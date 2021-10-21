import React, { useMemo, useEffect } from 'react';

import { useDao } from '../contexts/DaoContext';
import GenericSelect from './genericSelect';

const MinionSelect = props => {
  const { daoOverview, daoVaults } = useDao();
  const { name, localForm, localValues } = props;
  const { setValue } = localForm;

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
        safe: minion.safeAddress,
        value: minion.minionAddress,
        name: minion.details,
      }));
  }, []);

  useEffect(() => {
    if (localValues && localValues.minionAddress) {
      setValue(name, localValues.minionAddress);
    }
    if (localValues && localValues.safeAddress) {
      setValue('selectedSafeAddress', localValues.safeAddress);
    }
  }, [name]);

  return <GenericSelect {...props} options={minions} />;
};

export default MinionSelect;
