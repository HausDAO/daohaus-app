import React, { useState, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { GET_METADATA } from '../../utils/Queries';
import { DaoDataContext, ThemeContext } from '../../contexts/Store';
import StateModals from '../../components/shared/StateModals';
import BottomNav from '../../components/shared/BottomNav';
import ErrorMessage from '../../components/shared/ErrorMessage';
import Loading from '../../components/shared/Loading';
import ValueDisplay from '../../components/shared/ValueDisplay';
import HeadTags from '../../components/shared/HeadTags';
import HomeChart from '../../components/shared/HomeChart';
import styled from 'styled-components';

// import './Home.scss';

const HomeDiv = styled.div`
  width: 100%;
  text-align: center;
  img { width: 200px; }
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  height: 100vh;
  h1 {
      text-align: center;
      font-size: 36px;
  }
  p {
      text-align: center;
      font-weight: 900;
      margin: 0px;
      margin-bottom: 25px;
  }
  .Intro {
      height: calc(50vh - 90px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: $base-padding;
  }
`;

const IntroDiv = styled.div`
  height: calc(50vh - 90px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $base-padding;
`;

const ChartDiv = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100%;
  // max-width: 420px;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  width: 100%;
  height: 33vh;
`;

const DataDiv = styled.div`
h4, h5, h3, h2, p { margin: 0; }
h2, h3 { font-weight: 100; }
h2 { font-size: 36px; }
h3 { font-size: 28px; }
.Row {
    justify-content: space-evenly;
    margin-top: 25px;
}
.Bank, .Shares, .ShareValue {
    cursor: pointer;
    h2, h3 { font-weight: 300; transition: all .15s linear; }

    &.Selected {
        h2, h3 { font-weight: 400; }
    }
    svg { display: inline-block; vertical-align: middle; height: 28px; margin-top: -5px; }
}

`;

const Home = () => {
  const [chartView, setChartView] = useState('bank');
  const [daoData] = useContext(DaoDataContext);
  const [themeVariables] = useContext(ThemeContext);  
  
  const { loading, error, data } = useQuery(GET_METADATA, {
    pollInterval: 20000,
  });


  const ThemedIntroDiv = styled(IntroDiv)`
    color: ${themeVariables && themeVariables.primary};
  `
  const ThemedHomeDiv = styled(HomeDiv)`
  background-image: url(${daoData.themeMap && daoData.themeMap.bgImage});
  `

  const ThemedDataDiv = styled(DataDiv)`
  .Bank, .Shares, .ShareValue {
    &:hover h5 { color: ${themeVariables && themeVariables.primary}; }
  }
  `

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      {daoData ? <HeadTags daoData={daoData} /> : null}
      <StateModals />

      <ThemedHomeDiv>
        <ThemedIntroDiv>
          <h1>{daoData.name || 'PokéMol DAO'}</h1>
          <p>{daoData.description || 'Put a Moloch in Your Pocket'}</p>
        </ThemedIntroDiv>
        <ChartDiv>
          <HomeChart guildBankAddr={data.guildBankAddr} chartView={chartView} />
        </ChartDiv>
        <ThemedDataDiv>
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
        </ThemedDataDiv>
        <BottomNav />
      </ThemedHomeDiv>
    </>
  );
};

export default Home;
