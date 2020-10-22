import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';

import { DaoDataContext, DaoServiceContext } from './contexts/Store';
import { get } from './utils/Requests';
import Routes from './Routes';
import Loading from './components/shared/Loading';
import Layout from './components/layout/Layout';

const App = ({ client }) => {
  const [loading, setloading] = useState(true);
  const [daoPath, setDaoPath] = useState('');
  const [daoData, setDaoData] = useContext(DaoDataContext);
  const [daoService] = useContext(DaoServiceContext);

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
      <ThemeProvider>
        <CSSReset />
        {loading ? (
          <Loading />
        ) : (
          <Router>
            <Layout>
              <Routes isValid={!!daoPath} />
            </Layout>
          </Router>
        )}
      </ThemeProvider>
    </div>
  );
};

export default App;
