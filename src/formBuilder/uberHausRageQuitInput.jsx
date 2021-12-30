import React, { useEffect, useState } from 'react';

import GenericInput from './genericInput';
import ModButton from './modButton';

const UberHausRageQuitInput = props => {
  console.log('RQ Props', props);

  const { localForm, localValues, name } = props;
  const { setValue } = localForm;
  const [minionShares, setMinionShares] = useState(0);
  const [minionLoot, setMinionLoot] = useState(0);

  const btnDisplay = () => {
    if (name === 'shares') {
      if (minionShares) return `Max: ${minionShares}`;
      return '0';
    }
    if (name === 'loot') {
      if (minionLoot) return `Max: ${minionLoot}`;
      return '0';
    }
  };

  const setMax = () => {
    if (name === 'shares') {
      setValue('shares', minionShares);
    }
    if (name === 'loot') {
      setValue('loot', minionLoot);
    }
  };

  useEffect(() => {
    if (!localValues.minionAddress && !localValues.uberMembers) return;

    const uberMinionMember = localValues.uberMembers.find(
      member => member.memberAddress === localValues.minionAddress,
    );

    console.log('uberMinionMember is: ', uberMinionMember);

    if (+uberMinionMember.shares) {
      console.log(+uberMinionMember.shares);
      setMinionShares(+uberMinionMember.shares);
    }
    if (+uberMinionMember.loot) {
      console.log(+uberMinionMember.loot);
      setMinionLoot(+uberMinionMember.loot);
    }
  }, [localValues.uberHausMinion, localValues.uberMembers]);

  return (
    <GenericInput
      {...props}
      btn={<ModButton text={btnDisplay()} fn={setMax} />}
    />
  );
};

export default UberHausRageQuitInput;
