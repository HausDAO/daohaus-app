import React, { useState, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { GET_METADATA } from '../../utils/Queries';
import { DaoDataContext } from '../../contexts/Store';
import StateModals from '../../components/shared/StateModals';
import BottomNav from '../../components/shared/BottomNav';
import ErrorMessage from '../../components/shared/ErrorMessage';
import Loading from '../../components/shared/Loading';
import ValueDisplay from '../../components/shared/ValueDisplay';
import HeadTags from '../../components/shared/HeadTags';

import './Home.scss';
import HomeChart from '../../components/shared/HomeChart';

const Home = () => {
  const [chartView, setChartView] = useState('bank');
  const [daoData] = useContext(DaoDataContext);

  const { loading, error, data } = useQuery(GET_METADATA, {
    pollInterval: 20000,
  });

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      {daoData ? <HeadTags daoData={daoData} /> : null}
      <StateModals />

      <div className="Home">
        <div className="Intro">
          <h1>{daoData.name || 'PokéMol DAO'}</h1>
          <p>{daoData.description || 'Put a Moloch in Your Pocket'}</p>
        </div>
        <div className="Chart" style={{ width: '100%', height: '33vh' }}>
          <HomeChart guildBankAddr={data.guildBankAddr} chartView={chartView} />
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
              className={'Shares' + (chartView === 'shares' ? ' Selected' : '')}
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
};

export default Home;
