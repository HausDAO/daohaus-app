import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ApolloClient from 'apollo-boost';

import { get } from './utils/Requests';
import { resolvers } from './utils/Resolvers';
import Routes from './Routes';
import Header from './components/header/Header';
import Loading from './components/shared/Loading';

import { DaoDataContext, DaoServiceContext } from './contexts/Store';

import './App.scss';
import config from './config';

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

          let altClient;
          // TODO: Swap resolvers on version
          if (apiData.isLegacy || +apiData.version === 2) {
            altClient = new ApolloClient({
              uri: apiData.isLegacy
                ? apiData.graphNodeUri
                : config.GRAPH_NODE_URI,
              clientState: {
                resolvers,
              },
            });
          }

          setDaoData({
            ...apiData,
            altClient,
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
      if (!daoService || !daoData || daoData.version === 2) {
        client.writeData({
          data: {
            currentPeriod: 0,
            totalShares: 0,
            guildBankAddr: '0x00000000000000000000',
            approvedToken: '0x00000000000000000000',
            tokenSymbol: 'DAO',
            gracePeriodLength: 0,
            votingPeriodLength: 0,
            periodDuration: 0,
            processingReward: 0,
            proposalDeposit: 0,
            guildBankValue: 0,
            shareValue: 0,
          },
        });

        if (daoData && daoData.version === 2 && daoService) {
          const currentPeriod = await daoService.mcDao.getCurrentPeriod();
          // client.writeData({
          daoData.altClient.writeData({
            data: { currentPeriod: parseInt(currentPeriod) },
          });

          setloading(false);
        }
        return;
      }

      const currentPeriod = await daoService.mcDao.getCurrentPeriod();
      const totalShares = await daoService.mcDao.getTotalShares();
      const guildBankAddr = await daoService.mcDao.getGuildBankAddr();
      const gracePeriodLength = await daoService.mcDao.getGracePeriodLength();
      const votingPeriodLength = await daoService.mcDao.getVotingPeriodLength();
      const periodDuration = await daoService.mcDao.getPeriodDuration();
      const processingReward = await daoService.mcDao.getProcessingReward();
      const proposalDeposit = await daoService.mcDao.getProposalDeposit();
      const approvedToken = await daoService.mcDao.approvedToken();
      const guildBankValue = await daoService.token.balanceOf(guildBankAddr);
      const tokenSymbol = await daoService.token.getSymbol();

      const cacheData = {
        currentPeriod: parseInt(currentPeriod),
        totalShares: parseInt(totalShares),
        guildBankAddr,
        approvedToken,
        tokenSymbol,
        gracePeriodLength: parseInt(gracePeriodLength),
        votingPeriodLength: parseInt(votingPeriodLength),
        periodDuration: parseInt(periodDuration),
        processingReward: daoService.web3.utils.fromWei(processingReward),
        proposalDeposit: daoService.web3.utils.fromWei(proposalDeposit),
        guildBankValue: daoService.web3.utils.fromWei(guildBankValue),
        shareValue: parseFloat(
          daoService.web3.utils.fromWei(
            daoService.web3.utils
              .toBN(guildBankValue)
              .div(daoService.web3.utils.toBN(totalShares)),
          ),
        ),
      };

      client.writeData({
        data: cacheData,
      });

      if (daoData.isLegacy) {
        daoData.altClient.writeData({
          data: cacheData,
        });
      }

      setloading(false);
    };

    fetchData();
  }, [client, daoData, daoService, daoPath]);

  return (
    <div className="App">
      {loading ? (
        <Loading />
      ) : (
        <Router>
          <Header />
          <Routes isValid={!!daoPath} />
        </Router>
      )}
    </div>
  );
};

export default App;
