import React, { useEffect, useState, useContext } from 'react';

import { Legend, PieChart, Pie, Cell } from 'recharts';
import { DaoServiceContext } from '../../contexts/Store';

const TokenInfo = (props) => {
  const {
    setupValues,
    PIECOLORS,
    getTokenInfo,
    getRequestToken,
    tdata,
  } = props;
  const [tokenInfo, setTokenInfo] = useState();
  const [tokenDistroInfo, setTokenDistroInfo] = useState();
  const [daoService] = useContext(DaoServiceContext);

  const symbol = getRequestToken(tdata, setupValues.giveToken).symbol;

  const pieDistroData = (info) => {
    const data = [
      {
        name: 'transmutation',
        value: +daoService.web3.utils.fromWei(info.transSupply),
      },
      {
        name: 'trust',
        value: +daoService.web3.utils.fromWei(info.trustSupply),
      },
      {
        name: 'minion',
        value: +daoService.web3.utils.fromWei(info.minionSupply),
      },
      { name: 'dao', value: +daoService.web3.utils.fromWei(info.daoSupply) },
    ];
    const other = daoService.web3.utils.fromWei(
      '' +
        (info.totalSupply -
          info.transSupply -
          info.trustSupply -
          info.minionSupply -
          info.daoSupply),
    );
    if (parseInt(other) > 0) {
      data.other = {
        name: 'other',
        value: other,
      };
    }
    return data;
  };

  useEffect(() => {
    const tokens = async () => {
      const info = await getTokenInfo('getRequestToken', setupValues.giveToken);
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
      <p>Token address: {setupValues.giveToken}</p>
      <p>Token Symbol: {symbol && symbol}</p>
      <p>
        Total tokens:{' '}
        {tokenInfo && daoService.web3.utils.fromWei(tokenInfo.totalSupply)}
      </p>
      <p>
        <a
          href={`https://blockscout.com/poa/xdai/tokens/${setupValues.giveToken}/token-holders`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Token holders
        </a>
      </p>
    </div>
  );
};

export default TokenInfo;
