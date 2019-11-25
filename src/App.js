import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './Routes';
import Header from './components/header/Header';
import Loading from './components/shared/Loading';
import { get } from './utils/Requests';

import McDaoService from './utils/McDaoService';
import Web3Service from './utils/Web3Service';
import TokenService from './utils/TokenService';

import { DaoContext } from './contexts/Store';

import './App.scss';

const web3 = new Web3Service();

const App = ({ client }) => {
  const [loading, setloading] = useState(true);
  const [daoPath, setDaoPath] = useState('');
  const [daoData, setDaoData] = useState('');
  const [daoService, setDaoService] = useContext(DaoContext);

  useEffect(() => {
    // get dao from daohaus api and check if exists and is whitelisted
    console.log('get dao api', daoService);
    var pathname = window.location.pathname.split('/');
    console.log('pathname', pathname[1]);

    const getDao = async () => {
      let apiData = '';
      if(!pathname[1]){
        setloading(false);
        return false;
      }
      try {
        const daoRes = await get(`moloch/${pathname[1]}`);
        apiData = daoRes.data;
        if(apiData.whitelisted || true){
          setDaoPath(pathname[1]);
          setDaoData(apiData);
        } else {
          setloading(false);
        }

      } catch (e) {
        setloading(false);
        console.log('error on dao api call', e);
      }
      console.log(apiData);
    };

    getDao();
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
    console.log(daoPath);

    if (daoPath) {
      initDao();
    }
  }, [daoPath]);

  useEffect(() => {
    // save all web3 data to apollo cache
    const fetchData = async () => {
      console.log('dao', daoService);

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
