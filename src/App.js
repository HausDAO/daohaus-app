import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './Routes';
import Header from './components/header/Header';
import Loading from './components/shared/Loading';
import { get } from './utils/Requests';

import McDaoService from './utils/McDaoService';
import Web3Service from './utils/Web3Service';
import TokenService from './utils/TokenService';

import { DaoContext, DaoDataContext } from './contexts/Store';

import './App.scss';

const web3 = new Web3Service();

const App = ({ client }) => {
  const [loading, setloading] = useState(true);
  const [daoPath, setDaoPath] = useState('');
  const [, setDaoData] = useContext(DaoDataContext);
  const [daoService, setDaoService] = useContext(DaoContext);

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

        if (!apiData.isLegacy) {
          setDaoPath(daoParam);
          setDaoData(apiData);
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
    const initDao = async () => {
      try {
        const _mcDao = new McDaoService(daoPath);
        await _mcDao.initContract();
        setDaoService(_mcDao);
      } catch (err) {
        console.log('error init contract:', err);
      }
    };

    if (daoPath) {
      initDao();
    }
    // eslint-disable-next-line
  }, [daoPath]);

  useEffect(() => {
    // save all web3 data to apollo cache
    const fetchData = async () => {
      const currentPeriod = await daoService.getCurrentPeriod();
      const totalShares = await daoService.getTotalShares();
      const guildBankAddr = await daoService.getGuildBankAddr();
      const gracePeriodLength = await daoService.getGracePeriodLength();
      const votingPeriodLength = await daoService.getVotingPeriodLength();
      const periodDuration = await daoService.getPeriodDuration();
      const processingReward = await daoService.getProcessingReward();
      const proposalDeposit = await daoService.getProposalDeposit();
      const approvedToken = await daoService.approvedToken();

      const tokenService = new TokenService(approvedToken);
      const guildBankValue = await tokenService.balanceOf(guildBankAddr);
      const tokenSymbol = await tokenService.getSymbol();

      client.writeData({
        data: {
          currentPeriod: parseInt(currentPeriod),
          totalShares: parseInt(totalShares),
          guildBankAddr,
          approvedToken,
          tokenSymbol,
          gracePeriodLength: parseInt(gracePeriodLength),
          votingPeriodLength: parseInt(votingPeriodLength),
          periodDuration: parseInt(periodDuration),
          processingReward: web3.fromWei(processingReward),
          proposalDeposit: web3.fromWei(proposalDeposit),
          guildBankValue: web3.fromWei(guildBankValue),
          shareValue: web3.fromWei(guildBankValue) / totalShares,
        },
      });
      setloading(false);
    };
    if (daoService) {
      fetchData();
    }
  }, [client, daoService]);

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
