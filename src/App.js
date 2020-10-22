import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';

import Routes from './Routes';
import Loading from './components/shared/Loading';

import { customTheme } from './themes/theme';

import Layout from './components/layout/Layout';

const App = () => {
  const [loading, setloading] = useState(false);
  //if dao - pass a theme

  return (
    <div className="App">
      <ThemeProvider theme={customTheme()}>
        <CSSReset />
        {loading ? (
          <Loading />
        ) : (
          <Router>
            <Layout>
              <Routes />
            </Layout>
          </Router>
        )}
      </ThemeProvider>
    </div>
  );
};

export default App;
