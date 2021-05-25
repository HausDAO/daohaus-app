import React, { useMemo } from 'react';

import { useDao } from '../contexts/DaoContext';
import GenericSelect from './genericSelect';

const MinionSelect = props => {
  const { daoOverview } = useDao();
  const minions = useMemo(() => {
    return daoOverview.minions
      .filter(minion => minion.minionType === props.minionType)
      .map(minion => ({
        value: minion.minionAddress,
        name: minion.details,
      }));
  }, []);
  console.log(`daoOverview.minions`, daoOverview.minions);

  return <GenericSelect {...props} options={minions} />;
};

export default MinionSelect;
