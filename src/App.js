import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import { useTheme } from './contexts/PokemolContext';
import { resolvers } from './utils/apollo/resolvers';
import Routes from './Routes';
import Layout from './components/Layout/Layout';
import supportedChains from './utils/chains';
import UserInit from './contexts/UserInit';
import DaoInit from './contexts/DaoInit';

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
      <DaoInit />
    </>
  );
}

const App = () => {
  const [theme] = useTheme();

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Router>
          <Init />
          <Layout>
            <Routes />
          </Layout>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
