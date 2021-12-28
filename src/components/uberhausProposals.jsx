import React from 'react';
import { Flex } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';

import { useAppModal } from '../hooks/useModals';
import { FORM } from '../data/forms';
import { UBERHAUS_DATA } from '../utils/uberhaus';
import { JANUARY_2024 } from '../utils/general';

const UberhausProposals = ({ uberHausMinion }) => {
  const { formModal } = useAppModal();
  const handleClick = propType => {
    console.log('uberHausMinion', uberHausMinion, propType);

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
      default: {
        return null;
      }
    }
  };
  return (
    <Flex flexDir='row' w='100%'>
      <Button onClick={() => handleClick('delegate')}>Delegate</Button>
      <Button onClick={() => handleClick('stake')}>Stake</Button>
    </Flex>
  );
};

export default UberhausProposals;
