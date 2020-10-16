import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import App from './App';
import * as serviceWorker from './serviceWorker';
import { resolvers } from './utils/Resolvers';
import Store from './contexts/Store';
import supportedChains from './utils/chains';

import './index.css';

const chainData = supportedChains[+process.env.REACT_APP_NETWORK_ID];

const client = new ApolloClient({
  uri: chainData.subgraph_url,
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
