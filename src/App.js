import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './Routes';
import Header from './components/header/Header';
import Loading from './components/shared/Loading';
import McDaoService from './utils/McDaoService';
import Web3Service from './utils/Web3Service';
import TokenService from './utils/TokenService';

import './App.scss';

const mcDao = new McDaoService();
const web3 = new Web3Service();

const App = ({ client }) => {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    // save all web3 data to apollo cache
    const fetchData = async () => {
      const currentPeriod = await mcDao.getCurrentPeriod();
      const totalShares = await mcDao.getTotalShares();
      const guildBankAddr = await mcDao.getGuildBankAddr();
      const gracePeriodLength = await mcDao.getGracePeriodLength();
      const votingPeriodLength = await mcDao.getVotingPeriodLength();
      const periodDuration = await mcDao.getPeriodDuration();
      const processingReward = await mcDao.getProcessingReward();
      const proposalDeposit = await mcDao.getProposalDeposit();
      const approvedToken = await mcDao.approvedToken();

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

    fetchData();
  }, [client]);
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
