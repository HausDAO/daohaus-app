import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Amplify from 'aws-amplify';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import config from './config';
import { resolvers } from './utils/Resolvers';
import Store from './contexts/Store';

import './index.css';

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  }
});

const client = new ApolloClient({
  uri: config.GRAPH_NODE_URI,
  clientState: {
    resolvers,
  },
});

const Index = () => (
  <ApolloProvider client={client}>
    <Store apolloClient={client}>
      <App client={client} />
    </Store>
  </ApolloProvider>
);
ReactDOM.render(<Index />, document.getElementById('root'));

serviceWorker.unregister();
