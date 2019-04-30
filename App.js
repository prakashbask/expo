import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { NativeModules } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';

import HomeApp from './HomeApp';
import ApolloClient from './api/ApolloClient';
import Store from './redux/Store';

let { JSCExecutor } = NativeModules;

export default class App extends React.Component {
  render() {
    return (
      <ReduxProvider store={Store}>
        <ApolloProvider client={ApolloClient}>
          <HomeApp {...this.props} />
        </ApolloProvider>
      </ReduxProvider>
    );
  }
}
if (JSCExecutor) {
  JSCExecutor.setContextName('Expo Home');
}
