import uuid from 'uuid';
import HashIds from 'hashids';
import gql from 'graphql-tag';
import AuthApi from '../AuthApi';
import ApolloClient from '../ApolloClient';
import Store from '../../redux/Store';
import SessionActions from '../../redux/SessionActions';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
jest.mock('react-native', () => {
  const ReactNative = require.requireActual('react-native');
  ReactNative.NativeModules.ExponentKernel.sdkVersions = '12.0.0,11.0.0';
  ReactNative.AsyncStorage.setItem = () => {};
  return ReactNative;
});
global.fetch = require('node-fetch');
global.alert = () => {}; // dont need user input to bypass alerts

const DeletionEndpoint = 'https://exp.host/--/api/v2/auth/deleteUser';

const _makeShortId = (salt: string, minLength: number = 10): string => {
  const hashIds = new HashIds(salt, minLength);
  return hashIds.encode(Date.now());
};
async function deleteUserAsync(sessionSecret) {
  let response = await fetch(DeletionEndpoint, {
    method: 'POST',
    headers: {
      'Expo-Session': sessionSecret,
    },
  });

  return await response.json();
}

describe('User Authentication Flow', () => {
  let testUsername;
  let testPassword;

  beforeAll(async () => {
    testUsername = `expo-app-${_makeShortId(uuid.v1())}`;
    testPassword = uuid.v1();

    // Register a new user that we can use for this test run
    const newUser = {
      firstName: 'quin',
      lastName: 'quin',
      username: testUsername,
      password: testPassword,
      email: `quin-${testUsername}@getexponent.com`,
    };

    await AuthApi.signUpAsync(newUser);

    await Store.dispatch(SessionActions.signOut());
  });

  afterAll(async () => {
    // sign in to obtain token, then delete user
    const signinResult = await AuthApi.signInAsync(testUsername, testPassword);
    await deleteUserAsync(signinResult.sessionSecret);
  });

  afterEach(() => {
    // reset the spies
    jest.restoreAllMocks();
  });

  it('login and stores auth tokens and sessions correctly', async () => {
    // sign in
    const signinResult = await AuthApi.signInAsync(testUsername, testPassword);
    const { sessionSecret } = signinResult;

    // store auth and session tokens
    await Store.dispatch(SessionActions.setSession({ sessionSecret: signinResult.sessionSecret }));

    // retrieve session tokens
    const state = Store.getState();
    const retrievedSession = state.session;

    // make sure the retrieved tokens are the same as the ones we originally received
    expect(sessionSecret).not.toBe(undefined);
    expect(sessionSecret).toBe(retrievedSession.sessionSecret);
  });

  function createSpies() {
    return {
      linkRequest: jest.spyOn(ApolloClient.link, 'request'),
    };
  }

  async function doGraphqlQuery() {
    try {
      await ApolloClient.query({
        query: gql`
          {
            app {
              all(limit: 5, filter: NEW, sort: TOP) {
                id
              }
            }
          }
        `,
        variables: null,
      });
      // reset client caches
      ApolloClient.resetStore();
    } catch (e) {}
  }
  it('does graphQL queries correctly, using sessions', async () => {
    let { linkRequest } = createSpies();

    // sign in, request for session secret to be returned
    const signinResult = await AuthApi.signInAsync(testUsername, testPassword);

    // store auth and session tokens
    await Store.dispatch(SessionActions.setSession({ sessionSecret: signinResult.sessionSecret }));
    await doGraphqlQuery();

    // expect to do just a query
    expect(linkRequest).toHaveBeenCalledTimes(1);
  });
});
