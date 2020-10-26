import React, { useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import {
  useTheme,
  PokemolContextProvider,
  Updater,
} from './contexts/PokemolContext';
import { resolvers } from './utils/apollo/resolvers';
import Routes from './Routes';
import Layout from './components/layout/Layout';
import supportedChains from './utils/chains';
// import StoreInit from './contexts/StoreInit';

// how would we toggle this? or just reload client in fetch components?
const chainData = supportedChains[+process.env.REACT_APP_NETWORK_ID];

const client = new ApolloClient({
  uri: chainData.subgraph_url,
  clientState: {
    resolvers,
  },
});

const App = () => {
  const [theme] = useTheme();
  console.log(theme);

  return (
    <ApolloProvider client={client}>
      <PokemolContextProvider>
        <ThemeProvider theme={theme}>
          <Updater />
          <CSSReset />
          <Router>
            <Layout>
              <Routes />
            </Layout>
          </Router>
        </ThemeProvider>
      </PokemolContextProvider>
    </ApolloProvider>
  );
};

export default App;
