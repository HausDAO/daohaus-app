import React, { useContext } from 'react';
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

const transmutationMeta = {
  minCap: 1,
  maxCap: 2.5,
  giveTokenAddress: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
  getTokenAddress: '0x091f54f042635060bbd480a871cc7a9ae4139ecf',
  maxBurnRatePerMo: '25',
  githubRepo: 'https://github.com',
};

const Stats = () => {
  const [daoService] = useContext(DaoServiceContext);
  const { loading, error, data } = useQuery(GET_MOLOCH, {
    variables: { contractAddr: daoService.daoAddress.toLowerCase() },
  });

  const getTokenTotalSupply = (data, tokenAddress) => {
    return data.moloch.tokenBalances.find(
      (token) => token.token.tokenAddress === tokenAddress,
    ).contractTokenTotalSupply;
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
            <p>Min Cap: {transmutationMeta.minCap}</p>
            <p>Max Cap: {transmutationMeta.maxCap}</p>
            <p>
              Total Raised:{' '}
              {daoService.web3.utils.fromWei(
                '' +
                  getToken(data, transmutationMeta.giveTokenAddress)
                    .contractBabeBalance,
              )}{' '}
              {getToken(data, transmutationMeta.giveTokenAddress).symbol}
            </p>
            <BarChart
              width={500}
              height={300}
              data={barData(
                transmutationMeta.minCap,
                transmutationMeta.maxCap,
                daoService.web3.utils.fromWei(
                  '' +
                    getToken(data, transmutationMeta.giveTokenAddress)
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
            <p>token address: {transmutationMeta.getTokenAddress}</p>
            <p>
              Total tokens:{' '}
              {getTokenTotalSupply(data, transmutationMeta.getTokenAddress)}
            </p>
            <p>token distro</p>
          </div>
          <div>
            <h4>Transmutation Status</h4>
            <p>start date</p>
            <p>max monthly burn rate: {transmutationMeta.maxBurnRatePerMo}</p>
            <p>current avg burn rate</p>
            <p>number proposals made</p>
            <p>amount transmuted/remaining</p>
          </div>
          <div>
            <h4>Github</h4>
            <p>repo status: {transmutationMeta.githubRepo}</p>
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
