import React, { useEffect, useState } from 'react';
import { Query } from 'react-apollo';
import { withApollo } from 'react-apollo';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

import { GET_METADATA } from '../../utils/Queries';
import TokenService from '../../utils/TokenService';
import StateModals from '../../components/shared/StateModals';
import McDaoService from '../../utils/McDaoService';
import Web3Service from '../../utils/Web3Service';
import BottomNav from '../../components/shared/BottomNav';
import ErrorMessage from '../../components/shared/ErrorMessage';
import Loading from '../../components/shared/Loading';
import ValueDisplay from '../../components/shared/ValueDisplay';

import './Home.scss';

const Home = ({ client }) => {
  const [vizData, setVizData] = useState([]);
  const [chartView, setChartView] = useState('bank');

  const { guildBankAddr, approvedToken } = client.cache.readQuery({
    query: GET_METADATA,
  });

  useEffect(() => {
    const fetchData = async () => {
      const web3Service = new Web3Service();
      const tokenService = new TokenService(approvedToken);
      const mcDao = new McDaoService();

      if (guildBankAddr) {
        const events = await mcDao.getAllEvents();
        const firstBlock = events[0].blockNumber;
        const latestBlock = await web3Service.latestBlock();
        const blocksAlive = latestBlock.number - firstBlock;

        const blockIntervals = 10;
        const dataLength = blocksAlive / blockIntervals;

        if (chartView === 'bank') {
          const balancePromises = [];
          const indexes = [];
          for (let x = 0; x <= blockIntervals; x++) {
            const atBlock = firstBlock + Math.floor(dataLength) * x;
            balancePromises.push(
              tokenService.balanceOf(guildBankAddr, atBlock),
            );
            indexes.push(x);
          }
          const balanceData = await Promise.all(balancePromises);
          setVizData(
            balanceData.map((balance, index) => ({
              x: indexes[index],
              y: balance,
            })),
          );
        }

        if (chartView === 'shares') {
          const sharesPromises = [];
          const indexes = [];
          for (let x = 0; x <= blockIntervals; x++) {
            const atBlock = firstBlock + Math.floor(dataLength) * x;
            sharesPromises.push(mcDao.getTotalShares(atBlock));
            indexes.push(x);
          }
          const sharesData = await Promise.all(sharesPromises);
          setVizData(
            sharesData.map((shares, index) => ({
              x: indexes[index],
              y: shares,
            })),
          );
        }

        if (chartView === 'value') {
          const sharePromises = [];
          const balancePromises = [];

          const indexes = [];
          for (let x = 0; x <= blockIntervals; x++) {
            const atBlock = firstBlock + Math.floor(dataLength) * x;
            sharePromises.push(mcDao.getTotalShares(atBlock));
            balancePromises.push(
              tokenService.balanceOf(guildBankAddr, atBlock),
            );
            indexes.push(x);
          }
          const shareData = await Promise.all(sharePromises);
          const balanceData = await Promise.all(balancePromises);

          setVizData(
            indexes.map((value) => ({
              x: indexes[value],
              y: balanceData[value] / shareData[value],
            })),
          );
        }
      }
    };

    fetchData();
  }, [guildBankAddr, chartView, approvedToken]);

  return (
    <Query query={GET_METADATA} pollInterval={30000}>
      {({ loading, error, data }) => {
        if (loading) return <Loading />;
        if (error) return <ErrorMessage message={error} />;

        return (
          <>
            <StateModals />

            <div className="Home">
              <div className="Intro">
                <h1>PokéMol DAO</h1>
                <p>Put a Moloch in Your Pocket</p>
              </div>
              <div className="Chart" style={{ width: '100%', height: '33vh' }}>
                <ResponsiveContainer>
                  <AreaChart data={vizData}>
                    <defs>
                      <linearGradient
                        id="grade"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="rgba(189,134,254,1)"
                          stopOpacity={1}
                        />
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
              </div>
              <div className="Data">
                <div
                  onClick={() => setChartView('bank')}
                  className={'Bank' + (chartView === 'bank' ? ' Selected' : '')}
                >
                  <h5>Bank</h5>
                  <h2>
                    <ValueDisplay
                      value={parseFloat(data.guildBankValue).toFixed(4)}
                    />
                  </h2>
                </div>
                <div className="Row">
                  <div
                    onClick={() => setChartView('shares')}
                    className={
                      'Shares' + (chartView === 'shares' ? ' Selected' : '')
                    }
                  >
                    <h5>Shares</h5>
                    <h3>{data.totalShares}</h3>
                  </div>
                  <div
                    onClick={() => setChartView('value')}
                    className={
                      'ShareValue' + (chartView === 'value' ? ' Selected' : '')
                    }
                  >
                    <h5>Share Value</h5>
                    <h3>
                      <ValueDisplay value={data.shareValue.toFixed(4)} />
                    </h3>
                  </div>
                </div>
              </div>
              <BottomNav />
            </div>
          </>
        );
      }}
    </Query>
  );
};

export default withApollo(Home);
