import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './Routes';
import Header from './components/header/Header';
import Loading from './components/shared/Loading';
import McDaoService from './utils/McDaoService';
import Web3Service from './utils/Web3Service';
import TokenService from './utils/TokenService';

import './App.scss';
import { DaoContext } from './contexts/Store';

const web3 = new Web3Service();

const App = ({ client }) => {
  const [loading, setloading] = useState(true);
  const [daoService, setDaoService] = useContext(DaoContext);

  useEffect(()=> {
    const initDao = async () => {
      var pathname = window.location.pathname.split( '/' );
      console.log('pathname', pathname[1]);
      const _mcDao = new McDaoService(pathname[1]);
      await _mcDao.initContract()
      setDaoService(_mcDao)
    }
    initDao();

  },[])

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
    if(daoService){
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
          <Routes />
        </Router>
      )}
    </div>
  );
};

export default App;
