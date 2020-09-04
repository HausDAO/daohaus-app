import React, { useEffect, useState } from 'react';

import { Legend, PieChart, Pie, Cell } from 'recharts';

const LootShareDistro = (props) => {
  const { data, PIECOLORS } = props;
  const [daoDistroInfo, setDaoDistroInfo] = useState();

  const pieDaoData = (loot, shares) => {
    return [
      { name: 'Loot', value: +loot },
      { name: 'Shares', value: +shares },
    ];
  };

  useEffect(() => {
    const tokens = async () => {
      setDaoDistroInfo(
        pieDaoData(data.moloch.totalLoot, data.moloch.totalShares),
      );
    };
    if (data) {
      tokens();
    }
    // eslint-disable-next-line
  }, [data]);

  return (
    <div>
      <h4>Loot/share distro chart</h4>
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
      <p>total: {+data.moloch.totalShares + +data.moloch.totalLoot}</p>
    </div>
  );
};

export default LootShareDistro;
