import React, { useEffect, useState } from 'react';

import { PieChart, Pie, Tooltip } from 'recharts';

const MemberDistroChart = (props) => {
  // attrib is a value from the members data (shares or loot)
  // <MemberDistroChart members={data.members} attrib={'shares'}></MemberDistroChart>
  const { attrib, members } = props;
  const [daoDistroInfo, setDaoDistroInfo] = useState();
  const pieMemberData = (data) => {
    return data.map((member) => {
      return {
        name: member.memberAddress,
        value: +member[attrib],
      };
    });
  };

  useEffect(() => {
    const chartData = async () => {
      setDaoDistroInfo(pieMemberData(members));
    };
    if (members) {
      chartData();
    }
    // eslint-disable-next-line
  }, [members]);

  return (
    <div>
      <h4>Loot distro chart</h4>
      {daoDistroInfo ? (
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            startAngle={360}
            endAngle={0}
            data={daoDistroInfo}
            cx={200}
            cy={200}
            outerRadius={80}
            fill="#8884d8"
            label
            labelLine
          />
          <Tooltip />
        </PieChart>
      ) : null}
    </div>
  );
};

export default MemberDistroChart;
