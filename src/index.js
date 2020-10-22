import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import App from './App';
import * as serviceWorker from './serviceWorker';
import { resolvers } from './utils/Resolvers';
// import Store from './contexts/Store';
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
  return (
    <ApolloProvider client={client}>
      {/* <Store apolloClient={client}> */}
      <App client={client} />
      {/* </Store> */}
    </ApolloProvider>
  );
};
ReactDOM.render(<Index />, document.getElementById('root'));

serviceWorker.unregister();
