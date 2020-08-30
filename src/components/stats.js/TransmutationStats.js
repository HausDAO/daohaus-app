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
  Cell,
} from 'recharts';

import { DaoServiceContext } from '../../contexts/Store';
import { GET_MOLOCH } from '../../utils/Queries';
import BottomNav from '../shared/BottomNav';
import ErrorMessage from '../shared/ErrorMessage';
import Loading from '../shared/Loading';
import { ViewDiv, PadDiv } from '../../App.styles';
import { setupValues } from '../../utils/TransmutationService';

const PIECOLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const TransmutationStats = () => {
  const [daoService] = useContext(DaoServiceContext);
  const [tokenInfo, setTokenInfo] = useState();
  const [daoDistroInfo, setDaoDistroInfo] = useState();
  const [tokenDistroInfo, setTokenDistroInfo] = useState();
  const [lootGrabData, setLootGrabData] = useState();
  const [transDistroInfo, setTransDistroInfo] = useState();

  const { loading, error, data } = useQuery(GET_MOLOCH, {
    variables: { contractAddr: daoService.daoAddress.toLowerCase() },
  });

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

  const getRequestToken = (data, tokenAddress) => {
    const token = data.moloch.tokenBalances.find(
      (token) => token.token.tokenAddress === tokenAddress,
    );
    return token;
  };

  const barLootGrabData = (min, max, contrib) => {
    return [
      {
        name: 'Loot Grab',
        max: max - min,
        min: min,
        contrib,
      },
    ];
  };

  const pieDaoData = (loot, shares) => {
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

  const pieTransmutationData = (info) => {
    const round = info.totalSupply * setupValues.contributionRoundPerc;
    const data = [
      { name: 'availible', value: +info.transSupply },
      { name: 'transmuted', value: round - info.transSupply },
    ];
    console.log('pieTransmutationData', data, round);
    return data;
  };

  useEffect(() => {
    const tokens = async () => {
      const info = await getTokenInfo(
        'getRequestToken',
        setupValues.getTokenAddress,
      );
      setTokenInfo(info);
      setTokenDistroInfo(pieDistroData(info));
      setDaoDistroInfo(
        pieDaoData(data.moloch.totalLoot, data.moloch.totalShares),
      );
      setTransDistroInfo(pieTransmutationData(info));

      setLootGrabData(
        barLootGrabData(
          setupValues.minCap,
          setupValues.maxCap,
          daoService.web3.utils.fromWei(
            '' +
              getRequestToken(data, setupValues.giveTokenAddress)
                .contractBabeBalance,
          ),
        ),
      );
    };
    if (data) {
      tokens();
    }
    // eslint-disable-next-line
  }, [daoService, data]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <ViewDiv>
      <div>
        <PadDiv>
          <h3>TransmutationStats</h3>
          <div>
            <h4>Loot Grab</h4>
            <p>Min Cap: {setupValues.minCap}</p>
            <p>Max Cap: {setupValues.maxCap}</p>
            <p>
              Total Contributed:{' '}
              {daoService.web3.utils.fromWei(
                '' +
                  getRequestToken(data, setupValues.giveTokenAddress)
                    .contractBabeBalance,
              )}{' '}
              {getRequestToken(data, setupValues.giveTokenAddress).symbol}
            </p>
            <BarChart width={500} height={300} data={lootGrabData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="min" stackId="a" fill="#8884d8" />
              <Bar dataKey="max" stackId="a" fill="#82ca9d" />
              <Bar dataKey="contrib" fill="#ffc658" />
            </BarChart>
          </div>

          <div>
            <h4>Loot/share distro chart</h4>
            <p>total: {+data.moloch.totalShares + +data.moloch.totalLoot}</p>
            {daoDistroInfo && (
              <PieChart width={400} height={400}>
                <Pie
                  dataKey="value"
                  startAngle={180}
                  endAngle={0}
                  data={daoDistroInfo}
                  cx={200}
                  cy={200}
                  outerRadius={80}
                  fill="#8884d8"
                  label
                  labelLine
                >
                  {' '}
                  {daoDistroInfo.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIECOLORS[index % PIECOLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            )}
          </div>

          <div>
            <h4>Token Info</h4>
            <p>token address: {setupValues.getTokenAddress}</p>
            <p>
              Total tokens (wei):{' '}
              {tokenInfo &&
                daoService.web3.utils.fromWei(tokenInfo.totalSupply)}
            </p>
            <p>token distro</p>
            {tokenDistroInfo ? (
              <PieChart width={400} height={400}>
                <Pie
                  dataKey="value"
                  startAngle={360}
                  endAngle={0}
                  data={tokenDistroInfo}
                  cx={200}
                  cy={200}
                  outerRadius={80}
                  fill="#8884d8"
                  legendType={'circle'}
                  label
                  labelLine
                >
                  {tokenDistroInfo.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIECOLORS[index % PIECOLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            ) : null}
          </div>
          <div>
            <h4>Transmutation Status</h4>
            <p>start date</p>
            <p>max monthly burn rate: {setupValues.maxBurnRatePerMo}</p>
            <p>current avg burn rate</p>
            <p>number proposals made</p>
            <p>amount transmuted/remaining</p>
            {transDistroInfo ? (
              <PieChart width={400} height={400}>
                <Pie
                  dataKey="value"
                  startAngle={360}
                  endAngle={0}
                  data={transDistroInfo}
                  cx={200}
                  cy={200}
                  outerRadius={80}
                  fill="#8884d8"
                  legendType={'circle'}
                  label
                  labelLine
                >
                  {transDistroInfo.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIECOLORS[index % PIECOLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            ) : null}
          </div>
          <div>
            <h4>Github</h4>
            <p>
              repo status: <a href={setupValues.githubRepo}>link</a>
            </p>
            {/* <img src="https://i.imgur.com/p8rXwlW.png" alt="github charts" /> */}
          </div>
          <div>
            <h4>live Proposals</h4>
          </div>
          <div>
            <h4>More info DAOHAUS TransmutationStats</h4>
          </div>
        </PadDiv>
      </div>
      <BottomNav />
    </ViewDiv>
  );
};

export default TransmutationStats;
