import React, { useEffect, useState } from 'react';

import { Legend, PieChart, Pie, Cell } from 'recharts';

const TransmutationStatus = (props) => {
  const { setupValues, PIECOLORS, getTokenInfo } = props;
  const [transDistroInfo, setTransDistroInfo] = useState();

  const pieTransmutationData = (info) => {
    const round = info.totalSupply * setupValues.contributionRoundPerc;
    const data = [
      { name: 'availible', value: +info.transSupply },
      { name: 'transmuted', value: round - info.transSupply },
    ];
    return data;
  };

  useEffect(() => {
    const tokens = async () => {
      const info = await getTokenInfo(
        'getRequestToken',
        setupValues.getTokenAddress,
      );

      setTransDistroInfo(pieTransmutationData(info));
    };

    tokens();

    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h4>Transmutation Status</h4>
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
      <p>start date</p>
      <p>max monthly burn rate: {setupValues.maxBurnRatePerMo}</p>
      <p>current avg burn rate</p>
      <p>number proposals made</p>
      <p>amount transmuted/remaining</p>
    </div>
  );
};

export default TransmutationStatus;
