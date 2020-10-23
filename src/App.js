import React, { useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import { PokemolContext } from './contexts/PokemolContext';
import { resolvers } from './utils/Resolvers';
import Routes from './Routes';
import Layout from './components/layout/Layout';
import supportedChains from './utils/chains';
import StoreInit from './contexts/StoreInit';

// how would we toggle this? or just reload client in fetch components?
const chainData = supportedChains[+process.env.REACT_APP_NETWORK_ID];

const client = new ApolloClient({
  uri: chainData.subgraph_url,
  clientState: {
    resolvers,
  },
});

const App = () => {
  const { state } = useContext(PokemolContext);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={state.theme}>
        <StoreInit>
          <CSSReset />
          <Router>
            <Layout>
              <Routes />
            </Layout>
          </Router>
        </StoreInit>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
