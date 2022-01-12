import React from 'react';
import { Menu, MenuList, MenuButton, MenuItem, Button } from '@chakra-ui/react';

import { useAppModal } from '../hooks/useModals';
import { FORM } from '../data/forms';
import { UBERHAUS_DATA } from '../utils/uberhaus';
import { JANUARY_2024 } from '../utils/general';

const UberHausProposals = ({ uberHausMinion, uberMembers }) => {
  const { formModal } = useAppModal();

  const handleClick = propType => {
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
      case 'withdraw': {
        formModal({
          ...FORM.UBERHAUS_WITHDRAW,
          localValues: {
            uberHausDaoAddress: UBERHAUS_DATA.ADDRESS,
            minionAddress: uberHausMinion.minionAddress,
            uberMembers,
            withdrawToken: UBERHAUS_DATA.STAKING_TOKEN,
          },
        });
        break;
      }
      case 'pull': {
        formModal({
          ...FORM.UBERHAUS_PULL,
          localValues: {
            uberHausDaoAddress: UBERHAUS_DATA.ADDRESS,
            minionAddress: uberHausMinion.minionAddress,
            uberMembers,
            pullToken: UBERHAUS_DATA.STAKING_TOKEN,
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
    <Menu isDisabled>
      <MenuButton as={Button} size='lg'>
        Manage
      </MenuButton>
      <MenuList>
        <MenuItem>
          <Button onClick={() => handleClick('delegate')}>Delegate</Button>
        </MenuItem>
        <MenuItem>
          <Button onClick={() => handleClick('stake')}>Stake</Button>
        </MenuItem>
        <MenuItem>
          <Button onClick={() => handleClick('ragequit')}>RageQuit</Button>
        </MenuItem>
        <MenuItem>
          <Button onClick={() => handleClick('withdraw')}>Withdraw</Button>
        </MenuItem>
        <MenuItem>
          <Button onClick={() => handleClick('pull')}>Pull</Button>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UberHausProposals;
