import React, { useMemo } from 'react';
import { useDao } from '../contexts/DaoContext';
import { proposalResolver } from '../utils/resolvers';
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

  return <GenericSelect {...props} options={minions} />;
};

export default MinionSelect;
