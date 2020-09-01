import React, { useEffect, useContext, useState } from 'react';

import { BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar } from 'recharts';
import { DaoServiceContext } from '../../contexts/Store';

const LootGrab = (props) => {
  const { setupValues, data, getRequestToken } = props;
  const [daoService] = useContext(DaoServiceContext);
  const [chartData, setChartData] = useState();

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

  useEffect(() => {
    const tokens = async () => {
      setChartData(
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

  return (
    <div>
      <h4>Loot Grab</h4>
      <BarChart width={500} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Legend />
        <Bar dataKey="min" stackId="a" fill="#8884d8" />
        <Bar dataKey="max" stackId="a" fill="#82ca9d" />
        <Bar dataKey="contrib" fill="#ffc658" />
      </BarChart>
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
    </div>
  );
};

export default LootGrab;
