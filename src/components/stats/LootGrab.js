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

  console.log(
    'getRequestToken(data, setupValues.giveToken)',
    getRequestToken(data, setupValues.giveToken),
  );

  const total =
    !getRequestToken(data, setupValues.giveToken) ||
    getRequestToken(data, setupValues.giveToken).contractBabeBalance == null
      ? 0
      : getRequestToken(data, setupValues.giveToken).contractBabeBalance;

  useEffect(() => {
    const tokens = async () => {
      let tokenWei = 0;
      if (getRequestToken(data, setupValues.giveToken)) {
        tokenWei = daoService.web3.utils.fromWei('' + total);
      }

      setChartData(
        barLootGrabData(setupValues.minCap, setupValues.maxCap, tokenWei),
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
      {getRequestToken(data, setupValues.giveToken) && (
        <p>
          Total Contributed:
          {daoService.web3.utils.fromWei('' + total)}{' '}
          {getRequestToken(data, setupValues.giveToken).symbol}
        </p>
      )}
    </div>
  );
};

export default LootGrab;
