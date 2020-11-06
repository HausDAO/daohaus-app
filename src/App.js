import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/core';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import { useTheme } from './contexts/PokemolContext';
import { resolvers } from './utils/apollo/resolvers';
import Routes from './Routes';
import Layout from './components/Layout/Layout';
import supportedChains from './utils/chains';
import UserInit from './contexts/UserInit';
import DaoInit from './contexts/DaoInit';
import EnsInit from './contexts/EnsInit';
import TxProcessorInit from './contexts/TxProcessorInit';
import GraphInit from './contexts/GraphInit';
import PriceInit from './contexts/PricesInit';

// how would we toggle this? or just reload client in fetch components?
const chainData = supportedChains[+process.env.REACT_APP_NETWORK_ID];

const client = new ApolloClient({
  uri: chainData.subgraph_url,
  clientState: {
    resolvers,
  },
});

function Init() {
  return (
    <>
      <UserInit />
      <TxProcessorInit />
      <EnsInit />
      <DaoInit />
      <GraphInit />
      <PriceInit />
    </>
  );
}

const App = () => {
  const [theme] = useTheme();

  return (
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
        <Router>
          <Init />
          <Layout>
            <Routes />
          </Layout>
        </Router>
      </ChakraProvider>
    </ApolloProvider>
  );
};

export default App;
