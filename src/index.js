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
  },
});

const client = new ApolloClient({
  uri: config.GRAPH_NODE_URI_SUPER,
  clientState: {
    resolvers,
  },
});

const Index = () => {
  var pathname = window.location.pathname.split('/');
  const daoParam = pathname[2];
  const regex = RegExp('0x[0-9a-f]{10,40}');
  const validParam =
    pathname[1] === 'dao' && regex.test(daoParam) ? daoParam : false;

  return (
    <ApolloProvider client={client}>
      <Store apolloClient={client} daoParam={validParam}>
        <App client={client} />
      </Store>
    </ApolloProvider>
  );
};
ReactDOM.render(<Index />, document.getElementById('root'));

serviceWorker.unregister();
