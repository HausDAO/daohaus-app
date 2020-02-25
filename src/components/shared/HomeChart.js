import React, { useEffect, useState, useContext } from 'react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

import { DaoServiceContext } from '../../contexts/Store';

const HomeChart = ({ guildBankAddr, chartView }) => {
  const [rawData, setRawData] = useState({
    balances: [],
    shares: [],
    shareValues: [],
  });
  const [vizData, setVizData] = useState([]);
  const [daoService] = useContext(DaoServiceContext);

  useEffect(() => {
    const fetchData = async () => {
      const balances = await getBalance();
      const shares = await getShares();
      const shareValues = getShareValues(balances, shares);

      setRawData({ balances, shares, shareValues });
      setVizData(
        balances.map((balance) => ({
          x: balance.blockNumber,
          y: balance.currentBalance,
        })),
      );
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (chartView === 'bank') {
        setVizData(
          rawData.balances.map((balance) => ({
            x: balance.blockNumber,
            y: balance.currentBalance,
          })),
        );
      }

      if (chartView === 'shares') {
        setVizData(
          rawData.shares.map((shares) => ({
            x: shares.blockNumber,
            y: shares.currentShares,
          })),
        );
      }

      if (chartView === 'value') {
        setVizData(
          rawData.shareValues.map((values) => ({
            x: values.blockNumber,
            y: values.shareValue,
          })),
        );
      }
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartView]);

  console.log('chartView', chartView);

  const getShares = async () => {
    const events = await daoService.mcDao.getAllEvents();
    const firstBlock = events[0].blockNumber;
    const minted = await daoService.mcDao.daoContract.getPastEvents(
      'ProcessProposal',
      { fromBlock: firstBlock, toBlock: 'latest' },
    );
    const burned = await daoService.mcDao.daoContract.getPastEvents(
      'Ragequit',
      { fromBlock: firstBlock, toBlock: 'latest' },
    );

    const passed = minted
      .filter((event) => event.returnValues.didPass)
      .map((item) => ({
        shares: item.returnValues.sharesRequested,
        blockNumber: item.blockNumber,
      }));

    const burnt = burned.map((item) => ({
      shares: '-' + item.returnValues.sharesToBurn,
      blockNumber: item.blockNumber,
    }));

    const sorted = passed
      .concat(burnt)
      .sort((a, b) => a.blockNumber - b.blockNumber);

    return sorted.reduce(
      (sum, item, idx) => {
        sum.push({
          shares: item.shares,
          blockNumber: item.blockNumber,
          currentShares: sum[idx].currentShares + +item.shares,
        });

        return sum;
      },
      [{ ...sorted[0], currentShares: 1 }],
    );
  };

  const getBalance = async () => {
    const deposit = await daoService.token.contract.getPastEvents('Transfer', {
      filter: { dst: guildBankAddr },
      fromBlock: 0,
      toBlock: 'latest',
    });
    const withdraw = await daoService.token.contract.getPastEvents('Transfer', {
      filter: { src: guildBankAddr },
      fromBlock: 0,
      toBlock: 'latest',
    });
    const deposits = deposit.map((item) => ({
      balance: daoService.web3.utils.fromWei(item.returnValues.wad.toString()),
      blockNumber: item.blockNumber,
    }));
    const withdraws = withdraw.map((item, idx) => ({
      balance:
        '-' + daoService.web3.utils.fromWei(item.returnValues.wad.toString()),
      blockNumber: item.blockNumber,
    }));
    const sorted = deposits
      .concat(withdraws)
      .sort((a, b) => a.blockNumber - b.blockNumber);

    return sorted.reduce(
      (sum, item, idx) => {
        sum.push({
          balance: item.balance,
          blockNumber: item.blockNumber,
          currentBalance: sum[idx].currentBalance + +item.balance,
        });

        return sum;
      },
      [{ ...sorted[0], currentBalance: 0 }],
    );
  };

  const getShareValues = (balances, shares) => {
    const baseCollection = balances.length < shares.length ? balances : shares;
    const compareCollection =
      balances.length < shares.length ? shares : balances;

    return baseCollection.map((baseValue, idx) => {
      const bal = baseValue.balance
        ? baseValue.currentBalance
        : compareCollection[idx].currentBalance;
      const shares = baseValue.balance
        ? compareCollection[idx].currentShares
        : baseValue.currentShares;
      return {
        blockNumber: baseValue.blockNumber,
        shareValue: +bal / +shares,
      };
    });
  };

  return (
    <ResponsiveContainer>
      <AreaChart data={vizData}>
        <defs>
          <linearGradient id="grade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(189,134,254,1)" stopOpacity={1} />
            <stop
              offset="100%"
              stopColor="rgba(189,134,254,1)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="y"
          stroke="rgba(203,46,206,1)"
          fill="url(#grade)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default HomeChart;
