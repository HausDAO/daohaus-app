import React, { useMemo, useEffect } from 'react';

import { useDao } from '../contexts/DaoContext';
import { MINION_TYPES } from '../utils/proposalUtils';
import GenericSelect from './genericSelect';

const MinionSelect = props => {
  const { daoOverview, daoVaults } = useDao();
  const { bridgeModule, name, localForm, localValues } = props;
  const { setValue, register, watch } = localForm;

  const minionAddress = watch(name);

  const minions = useMemo(() => {
    return daoOverview.minions
      .filter(minion => {
        const customFilter =
          props.filters?.[
            localValues?.crossChainMinion
              ? MINION_TYPES.CROSSCHAIN_SAFE
              : minion.minionType
          ];
        return (
          minion.minionType === props.minionType &&
          (!bridgeModule || minion.bridgeModule === bridgeModule) &&
          (!customFilter ||
            customFilter({
              ...minion,
              ...daoVaults?.find(v => v.address === minion.minionAddress),
            }))
        );
      })
      .map(minion => ({
        safe: minion.safeAddress,
        value: minion.minionAddress,
        name: minion.details,
        crossChain: minion.crossChainMinion,
        foreignChainId: minion.foreignChainId,
        foreignSafeAddress: minion.foreignSafeAddress,
        bridgeModule: minion.bridgeModule,
      }));
  }, [daoOverview, daoVaults]);

  console.log('minions', daoOverview.minions, daoVaults);

  console.log('props', props);

  useEffect(() => {
    register('selectedSafeAddress');
    register('crossChainMinion');
    register('foreignChainId');
    register('foreignSafeAddress');
    register('bridgeModule');

    if (localValues && localValues.minionAddress) {
      setValue(name, localValues.minionAddress);
    }
    if (localValues && localValues.safeAddress) {
      setValue('selectedSafeAddress', localValues.safeAddress);
    }
    if (localValues && localValues.crossChainMinion) {
      setValue('crossChainMinion', localValues.crossChainMinion);
    }
    if (localValues && localValues.foreignChainId) {
      setValue('foreignChainId', localValues.foreignChainId);
    }
    if (localValues && localValues.foreignSafeAddress) {
      setValue('foreignSafeAddress', localValues.foreignSafeAddress);
    }
    if (localValues && localValues.bridgeModule) {
      setValue('bridgeModule', localValues.bridgeModule);
    }
  }, [name]);

  useEffect(() => {
    if (minionAddress) {
      const {
        safe,
        crossChain,
        foreignChainId,
        foreignSafeAddress,
        bridgeModule,
      } = minions.filter(minion => minion.value === minionAddress)?.[0];

      setValue('selectedSafeAddress', safe);

      if (crossChain) {
        setValue('crossChainMinion', crossChain);
        setValue('foreignChainId', foreignChainId);
        setValue('foreignSafeAddress', foreignSafeAddress);
        setValue('bridgeModule', bridgeModule);
      }
    }
  }, [minionAddress]);

  return (
    <GenericSelect {...props} options={minions} helperText={minionAddress} />
  );
};

export default MinionSelect;
