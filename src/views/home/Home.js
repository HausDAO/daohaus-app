import React, { useState, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { DaoDataContext, BoostContext } from '../../contexts/Store';
import BottomNav from '../../components/shared/BottomNav';
import ErrorMessage from '../../components/shared/ErrorMessage';
import Loading from '../../components/shared/Loading';
import ValueDisplay from '../../components/shared/ValueDisplay';
import HeadTags from '../../components/shared/HeadTags';
import HomeChart from '../../components/shared/HomeChart';
import WhitelistTokenBalances from '../../components/tokens/WhitelistTokenBalances';
import { basePadding } from '../../variables.styles';
import { GET_MOLOCH } from '../../utils/Queries';
import { Link } from 'react-router-dom';

const HomeDiv = styled.div`
  width: 100%;
  text-align: center;
  img {
    width: 200px;
  }
  background-size: cover;
  background-position: ${(props) => props.theme.bgPosition};
  background-repeat: no-repeat;
  min-height: calc(100vh - 62px);
  background-image: url(${(props) => props.theme.brandBg});
  background-attachment: fixed;
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
    padding: ${basePadding};
  }
`;

const IntroDiv = styled.div`
  height: calc(50vh - 90px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${basePadding};
`;

const ChartDiv = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100%;
  // max-width: 420px;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  width: 100%;
  height: 33vh;
  pointer-events: none;
`;

const DataDiv = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  h4,
  h5,
  h3,
  h2,
  p {
    margin: 0;
  }
  h2,
  h3 {
    font-weight: 100;
  }
  h2 {
    font-size: 36px;
  }
  h3 {
    font-size: 28px;
  }
  .Row {
    display: flex;
    justify-content: space-evenly;
    margin-top: 25px;
  }
  .Bank,
  .Shares,
  .ShareValue {
    cursor: pointer;
    h2,
    h3 {
      font-weight: 300;
      transition: all 0.15s linear;
    }
    &.Selected {
      h2,
      h3 {
        font-weight: 400;
      }
    }
    svg {
      display: inline-block;
      vertical-align: middle;
      height: 28px;
      margin-top: -5px;
    }
  }
`;

const Home = () => {
  const [chartView, setChartView] = useState('bank');
  const [daoData] = useContext(DaoDataContext);
  const [boosts] = useContext(BoostContext);

  const { t } = useTranslation();

  const options = {
    pollInterval: 60000,
    variables: { contractAddr: daoData.contractAddress },
  };

  const { loading, error, data } = useQuery(GET_MOLOCH, options);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      {daoData ? <HeadTags daoData={daoData} /> : null}

      <HomeDiv>
        <IntroDiv>
          <h1>{daoData.name || 'PokéMol DAO'}</h1>
          <p>{daoData.description || 'Put a Moloch in Your Pocket'}</p>
          {boosts.transmutation ? (
            <Link to={`/dao/${daoData.contractAddress}/stats`}>stats</Link>
          ) : null}
        </IntroDiv>
        <DataDiv>
          {+daoData.version === 2 ? (
            <>
              <div>
                <h5>Shares</h5>
                <h2>{data.moloch.totalShares}</h2>
                <h5>Loot</h5>
                <h2>{data.moloch.totalLoot}</h2>
              </div>
              <WhitelistTokenBalances
                tokens={data.moloch.tokenBalances.filter(
                  (token) => token.guildBank,
                )}
              />
              <div></div>
            </>
          ) : (
            <>
              <div
                onClick={() => setChartView('bank')}
                className={'Bank' + (chartView === 'bank' ? ' Selected' : '')}
              >
                <h5>{t('Bank')}</h5>
                <h2>
                  <ValueDisplay
                    value={parseFloat(data.moloch.meta.guildBankValue).toFixed(
                      4,
                    )}
                    symbolOverride={data.moloch.meta.tokenSymbol}
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
                  <h3>{data.moloch.totalShares}</h3>
                </div>
                <div
                  onClick={() => setChartView('value')}
                  className={
                    'ShareValue' + (chartView === 'value' ? ' Selected' : '')
                  }
                >
                  <h5>Share Value</h5>
                  <h3>
                    <ValueDisplay
                      value={data.moloch.meta.shareValue.toFixed(4)}
                      symbolOverride={data.moloch.meta.tokenSymbol}
                    />
                  </h3>
                </div>
              </div>
            </>
          )}
        </DataDiv>
        {+daoData.version !== 2 && (
          <ChartDiv>
            <HomeChart
              guildBankAddr={data.moloch.guildBankAddress}
              chartView={chartView}
            />
          </ChartDiv>
        )}
        <BottomNav />
      </HomeDiv>
    </>
  );
};

export default Home;
