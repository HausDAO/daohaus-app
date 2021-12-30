import React, { useEffect, useState } from 'react';

import { useDaoMember } from '../contexts/DaoMemberContext';

import GenericInput from './genericInput';
import InputSelect from './inputSelect';
import ModButton from './modButton';

const UberHausRageQuitInput = props => {
  console.log('RQ Props', props);
  // const { daoMember } = useDaoMember();
  const { localForm, localValues } = props;
  const { setValue } = localForm;

  const [minionLoot, setMinionLoot] = useState(0);
  const [minionShares, setMinionShares] = useState(0);

  const btnDisplay = () => {
    if (minionShares) return `Max: ${minionShares}`;
    return '0';
  };

  // const btnDisplay = () => {
  //   const btnText = {};

  //   minionShares
  //     ? (btnText.shares = `Max: ${minionShares}`)
  //     : (btnText.shares = '0');
  //   minionLoot ? (btnText.loot = `Max: ${minionLoot}`) : (btnText.loot = '0');
  //   console.log('btnText', btnText);
  //   return btnText;
  // };

  const setMax = () => {
    setValue('shares', minionShares);
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
    // <InputSelect
    //   {...props}
    //   btn={<ModButton text={btnDisplay()} fn={setMax} />}
    // />
  );
};

export default UberHausRageQuitInput;
