import React from 'react';
import { Flex } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';

import { useAppModal } from '../hooks/useModals';
import { FORM } from '../data/forms';
import { UBERHAUS_DATA } from '../utils/uberhaus';
import { JANUARY_2024 } from '../utils/general';

const UberHausProposals = ({ uberHausMinion, uberMembers }) => {
  const { formModal } = useAppModal();
  const handleClick = propType => {
    console.log('uberHausMinion', uberHausMinion, propType);
    console.log('uberMembers', uberMembers, propType);

    switch (propType) {
      case 'delegate': {
        formModal({
          ...FORM.CHANGE_UBERHAUS_DELEGATE,
          localValues: {
            uberHausDaoAddress: UBERHAUS_DATA.ADDRESS,
            minionAddress: uberHausMinion.minionAddress,
            delegateExpiration: JANUARY_2024.toString(),
          },
        });
        break;
      }
      case 'stake': {
        formModal({
          ...FORM.UBERHAUS_STAKE,
          localValues: {
            uberHausDaoAddress: UBERHAUS_DATA.ADDRESS,
            minionAddress: uberHausMinion.minionAddress,
          },
        });
        break;
      }
      case 'ragequit': {
        formModal({
          ...FORM.UBERHAUS_RAGEQUIT,
          localValues: {
            uberHausDaoAddress: UBERHAUS_DATA.ADDRESS,
            minionAddress: uberHausMinion.minionAddress,
            uberMembers,
          },
        });
        break;
      }
      default: {
        return null;
      }
    }
  };
  return (
    <Flex flexDir='row' w='100%'>
      <Button onClick={() => handleClick('delegate')}>Delegate</Button>
      <Button onClick={() => handleClick('stake')}>Stake</Button>
      <Button onClick={() => handleClick('ragequit')}>RageQuit</Button>
    </Flex>
  );
};

export default UberHausProposals;
