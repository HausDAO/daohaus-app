import React, { useEffect, useState, useContext } from 'react';

import { Legend, PieChart, Pie, Cell } from 'recharts';
import { DaoServiceContext } from '../../contexts/Store';

const TokenInfo = (props) => {
  const { setupValues, PIECOLORS, getTokenInfo } = props;
  const [tokenInfo, setTokenInfo] = useState();
  const [tokenDistroInfo, setTokenDistroInfo] = useState();
  const [daoService] = useContext(DaoServiceContext);


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

  useEffect(() => {
    const tokens = async () => {
      const info = await getTokenInfo(
        'getRequestToken',
        setupValues.getTokenAddress,
      );
      setTokenInfo(info);
      setTokenDistroInfo(pieDistroData(info));
    };

    tokens();

    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h4>Token Info</h4>
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
      <p>token address: {setupValues.getTokenAddress}</p>
      <p>
        Total tokens (wei):{' '}
        {tokenInfo && daoService.web3.utils.fromWei(tokenInfo.totalSupply)}
      </p>
      <p>token distro</p>
    </div>
  );
};

export default TokenInfo;
