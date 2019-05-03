import ApolloClient from 'apollo-boost';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';

import Connectivity from './Connectivity';
import graphqlFragmentTypes from './generated/graphqlFragmentTypes.json';
import Store from '../redux/Store';

export default new ApolloClient({
  uri: 'https://exp.host/--/graphql',

  async request(operation): Promise<void> {
    let isConnected = await Connectivity.isAvailableAsync();
    if (!isConnected) {
      throw new Error('No connection available');
    }

    const { sessionSecret } = Store.getState().session;
    if (sessionSecret) {
      operation.setContext({
        headers: { 'expo-session': sessionSecret },
      });
    }
  },

  cache: new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData: graphqlFragmentTypes,
    }),
    dataIdFromObject(value) {
      // Make sure to return null if this object doesn't have an ID
      return value.hasOwnProperty('id') ? value.id : null;
    },
  }),
});
