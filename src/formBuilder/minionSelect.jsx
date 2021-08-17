import React, { useMemo, useEffect } from 'react';

import { useDao } from '../contexts/DaoContext';
import GenericSelect from './genericSelect';

const MinionSelect = props => {
  const { name, localValues, localForm } = props;
  const { minionAddress } = localValues;
  const { setValue } = localForm;
  const { daoOverview } = useDao();
  const minions = useMemo(() => {
    return daoOverview.minions
      .filter(minion => minion.minionType === props.minionType)
      .map(minion => ({
        value: minion.minionAddress,
        name: minion.details,
      }));
  }, []);

  useEffect(() => {
    if (minionAddress) {
      setValue(name, minionAddress);
    }
  }, [name, minionAddress]);

  return <GenericSelect {...props} options={minions} />;
};

export default MinionSelect;
