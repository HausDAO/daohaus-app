import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useTranslation } from 'react-i18next';

import { DaoDataContext, DaoServiceContext } from './contexts/Store';
import { get } from './utils/Requests';
import Routes from './Routes';
import Header from './components/header/Header';
import Loading from './components/shared/Loading';
import {
  defaultTheme,
  getAppBackground,
  GlobalStyle,
} from './variables.styles';
import { themeMap } from './themes/themes';

const AppDiv = styled.div`
  background-color: ${(props) => getAppBackground(props.theme)};
  min-height: 100vh;
  min-width: 100vw;
`;

const App = ({ client }) => {
  const [loading, setloading] = useState(true);
  const [daoPath, setDaoPath] = useState('');
  const [daoData, setDaoData] = useContext(DaoDataContext);
  const [theme, setTheme] = useState(defaultTheme);
  const [daoService] = useContext(DaoServiceContext);

  const { i18n } = useTranslation();

  useEffect(() => {
    var pathname = window.location.pathname.split('/');
    const daoParam = pathname[2];

    const getDao = async () => {
      let apiData = '';
      if (!daoParam) {
        setloading(false);
        return false;
      }
      try {
        const daoRes = await get(`moloch/${daoParam}`);
        apiData = daoRes.data;

        if (apiData) {
          setDaoPath(daoParam);

          setDaoData({
            ...apiData,
          });

          console.log(apiData);
          console.log('themeMap[apiData.themeName', themeMap);

          if (themeMap[apiData.themeName]) {
            setTheme(themeMap[apiData.themeName]);

            console.log(
              'themeMap[apiData.themeName].language',
              themeMap[apiData.themeName].language,
            );
            if (themeMap[apiData.themeName].language) {
              i18n.changeLanguage(themeMap[apiData.themeName].language);
            }
          }
        } else {
          setloading(false);
        }
      } catch (e) {
        setloading(false);
        console.log('error on dao api call', e);
      }
    };

    getDao();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // save all web3 data to apollo cache
    const fetchData = async () => {
      if (!daoService || !daoData) {
        client.writeData({
          data: {
            currentPeriod: 0,
            tokenSymbol: 'DAO',
            guildBankValue: 0,
            shareValue: 0,
          },
        });

        return;
      }

      const currentPeriod = await daoService.mcDao.getCurrentPeriod();
      const totalShares = await daoService.mcDao.getTotalShares();

      let guildBankAddr, guildBankValue;
      const cacheData = {
        currentPeriod: parseInt(currentPeriod),
      };

      if (daoData.version !== 2) {
        guildBankAddr = await daoService.mcDao.getGuildBankAddr();
        guildBankValue = await daoService.token.balanceOf(guildBankAddr);
        cacheData.guildBankValue = daoService.web3.utils.fromWei(
          guildBankValue,
        );
        cacheData.tokenSymbol = await daoService.token.getSymbol(
          theme.symbolOverride,
        );

        cacheData.shareValue = parseFloat(
          daoService.web3.utils.fromWei(
            daoService.web3.utils
              .toBN(guildBankValue)
              .div(daoService.web3.utils.toBN(totalShares)),
          ),
        );
      }

      client.writeData({
        data: cacheData,
      });

      setloading(false);
    };

    fetchData();

    // eslint-disable-next-line
  }, [client, daoData, daoService, daoPath]);

  return (
    <div className="App">
      {loading ? (
        <ThemeProvider theme={theme}>
          <Loading />
        </ThemeProvider>
      ) : (
        <Router>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <AppDiv>
              <Header />
              <Routes isValid={!!daoPath} />
            </AppDiv>
          </ThemeProvider>
        </Router>
      )}
    </div>
  );
};

export default App;
