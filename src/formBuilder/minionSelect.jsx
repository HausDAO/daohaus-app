import React, { useMemo, useEffect } from 'react';

import { useDao } from '../contexts/DaoContext';
import GenericSelect from './genericSelect';

const MinionSelect = props => {
  const { name, localValues, localForm } = props;
  const { setValue } = localForm;
  const { daoOverview, daoVaults } = useDao();
  const minions = useMemo(() => {
    return daoOverview.minions
      .filter(minion => {
        const customFilter = props.filters?.[minion.minionType];
        return (
          minion.minionType === props.minionType &&
          (!customFilter ||
            customFilter({
              ...minion,
              ...daoVaults.find(v => v.address === minion.minionAddress),
            }))
        );
      })
      .map(minion => ({
        value: minion.minionAddress,
        name: minion.details,
      }));
  }, []);

  useEffect(() => {
    if (localValues && localValues.minionAddress) {
      setValue(name, localValues.minionAddress);
    }
  }, [name, localValues]);

  return <GenericSelect {...props} options={minions} />;
};

export default MinionSelect;
