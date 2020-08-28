import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
} from 'recharts';

import { DaoServiceContext } from '../../contexts/Store';
import { GET_MOLOCH } from '../../utils/Queries';
import ErrorMessage from '../../components/shared/ErrorMessage';
import BottomNav from '../../components/shared/BottomNav';
import Loading from '../../components/shared/Loading';
import { ViewDiv, PadDiv } from '../../App.styles';
import { setupValues } from '../../utils/TransmutationService';

const Stats = () => {
  const [daoService] = useContext(DaoServiceContext);
  const [tokenInfo, setTokenInfo] = useState([]);

  const { loading, error, data } = useQuery(GET_MOLOCH, {
    variables: { contractAddr: daoService.daoAddress.toLowerCase() },
  });

  useEffect(() => {
    const tokens = async () => {
      const info = await getTokenInfo('getToken', setupValues.getTokenAddress);
      console.log('info', info);
      tokenInfo.push(info);
      setTokenInfo(tokenInfo);
    };
    tokens();
    // eslint-disable-next-line
  }, [daoService]);

  const getTokenInfo = async (name, tokenAddress) => {
    const totalSupply = await daoService.token.totalSupply(tokenAddress);
    const transSupply = await daoService.token.balanceOf(
      setupValues.transmutation,
      'latest',
      tokenAddress,
    );
    const trustSupply = await daoService.token.balanceOf(
      setupValues.trust,
      'latest',
      tokenAddress,
    );
    const minionSupply = await daoService.token.balanceOf(
      setupValues.minion,
      'latest',
      tokenAddress,
    );
    const daoSupply = await daoService.token.balanceOf(
      setupValues.moloch,
      'latest',
      tokenAddress,
    );
    return {
      tokenAddress: tokenAddress,
      totalSupply,
      transSupply,
      trustSupply,
      minionSupply,
      daoSupply,
      name,
    };
  };

  const getToken = (data, tokenAddress) => {
    const token = data.moloch.tokenBalances.find(
      (token) => token.token.tokenAddress === tokenAddress,
    );
    return token;
  };

  const barData = (min, max, contrib) => {
    return [
      {
        name: 'Loot Grab',
        max: max - min,
        min: min,
        contrib,
      },
    ];
  };

  const pieData = (loot, shares) => {
    return [
      { name: 'Loot', value: +loot },
      { name: 'Shares', value: +shares },
    ];
  };

  const pieDistroData = (info) => {
    const data = [
      { name: 'transmutation', value: +info.transSupply },
      { name: 'trust', value: +info.trustSupply },
      { name: 'minion', value: +info.minionSupply },
      { name: 'dao', value: +info.daoSupply },
      {
        name: 'other',
        value:
          info.totalSupply -
          info.transSupply -
          info.trustSupply -
          info.minionSupply -
          info.daoSupply,
      },
    ];
    return data;
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  console.log('stats', data);

  return (
    <ViewDiv>
      <div>
        <PadDiv>
          <h3>Stats</h3>
          <div>
            <h4>Loot Grab</h4>
            <p>Min Cap: {setupValues.minCap}</p>
            <p>Max Cap: {setupValues.maxCap}</p>
            <p>
              Total Raised:{' '}
              {daoService.web3.utils.fromWei(
                '' +
                  getToken(data, setupValues.giveTokenAddress)
                    .contractBabeBalance,
              )}{' '}
              {getToken(data, setupValues.giveTokenAddress).symbol}
            </p>
            <BarChart
              width={500}
              height={300}
              data={barData(
                setupValues.minCap,
                setupValues.maxCap,
                daoService.web3.utils.fromWei(
                  '' +
                    getToken(data, setupValues.giveTokenAddress)
                      .contractBabeBalance,
                ),
              )}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="min" stackId="a" fill="#8884d8" />
              <Bar dataKey="max" stackId="a" fill="#82ca9d" />
              <Bar dataKey="contrib" fill="#ffc658" />
            </BarChart>
            <p>Loot distro chart</p>
            <p>Share distro chart</p>
            <p>Loot/share distro chart</p>
            <PieChart width={400} height={400}>
              <Pie
                dataKey="value"
                startAngle={180}
                endAngle={0}
                data={pieData(data.moloch.totalLoot, data.moloch.totalShares)}
                cx={200}
                cy={200}
                outerRadius={80}
                fill="#8884d8"
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                label
              />
            </PieChart>
            <p>
              loot {data.moloch.totalLoot} shares {data.moloch.totalShares}{' '}
              total {+data.moloch.totalShares + +data.moloch.totalLoot}
            </p>
          </div>
          <div>
            <h4>Token Info</h4>
            <p>token address: {setupValues.getTokenAddress}</p>
            <p>
              Total tokens:{' '}
              {tokenInfo.length &&
                tokenInfo.find((token) => token.name === 'getToken')
                  ?.totalSupply}
            </p>
            <p>token distro</p>
            {tokenInfo.length && (
              <PieChart width={400} height={400}>
                <Pie
                  dataKey="value"
                  startAngle={360}
                  endAngle={0}
                  data={pieDistroData(
                    tokenInfo.find((token) => token.name === 'getToken'),
                  )}
                  cx={200}
                  cy={200}
                  outerRadius={80}
                  fill="#8884d8"
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  label
                />
              </PieChart>
            )}
          </div>
          <div>
            <h4>Transmutation Status</h4>
            <p>start date</p>
            <p>max monthly burn rate: {setupValues.maxBurnRatePerMo}</p>
            <p>current avg burn rate</p>
            <p>number proposals made</p>
            <p>amount transmuted/remaining</p>
          </div>
          <div>
            <h4>Github</h4>
            <p>
              repo status: <a href={setupValues.githubRepo}>link</a>
            </p>
            <img src="https://i.imgur.com/p8rXwlW.png" alt="github charts" />
          </div>
          <div>
            <h4>live Proposals</h4>
          </div>
          <div>
            <h4>More info DAOHAUS Stats</h4>
          </div>
        </PadDiv>
      </div>
      <BottomNav />
    </ViewDiv>
  );
};

export default Stats;
