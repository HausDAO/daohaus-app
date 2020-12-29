import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import { PokemolContextProvider } from './contexts/PokemolContext';
import { useTheme } from './contexts/CustomThemeContext';
import { resolvers } from './utils/apollo/resolvers';
import Routes from './Routes';
import Layout from './components/Layout/Layout';
import { supportedChains } from './utils/chains';
import EnsInit from './contexts/EnsInit';
import TxProcessorInit from './contexts/TxProcessorInit';
import GraphInit from './contexts/GraphInit';
import PriceInit from './contexts/PricesInit';
import { SummonContextProvider } from './contexts/SummonContext';
import UserDaoInit from './contexts/UserDaoInit';

const chainData = supportedChains[1];

const client = new ApolloClient({
  uri: chainData.subgraph_url,
  clientState: {
    resolvers,
  },
});

function Init() {
  return (
    <>
      <UserDaoInit />
      <TxProcessorInit />
      <GraphInit />
      <EnsInit />
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
          <PokemolContextProvider>
            <SummonContextProvider>
              <Init />
              <Layout>
                <Routes />
              </Layout>
            </SummonContextProvider>
          </PokemolContextProvider>
        </Router>
      </ChakraProvider>
    </ApolloProvider>
  );
};

export default App;
