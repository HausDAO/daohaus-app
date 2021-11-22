import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Menu,
  MenuList,
  Icon,
  MenuButton,
  MenuItem,
  Button,
  Flex,
  Tooltip,
} from '@chakra-ui/react';

import { useTX } from '../contexts/TXContext';
import useCanInteract from '../hooks/useCanInteract';
import { TX } from '../data/contractTX';
import { chainByName } from '../utils/chain';

const MinionInternalBalanceActionMenu = ({
  targetDao,
  tokenWhitelisted,
  token,
}) => {
  const { canInteract } = useCanInteract({});
  const { submitTransaction, refreshDao } = useTX();
  const { minion } = useParams();

  const [loading, setLoading] = useState();

  const handleWithdraw = async options => {
    setLoading(true);

    await submitTransaction({
      tx: TX.MINION_WITHDRAW,
      args: [
        token.moloch.id,
        token.token.tokenAddress,
        token.tokenBalance,
        options.transfer,
      ],
      localValues: {
        minionAddress: minion,
      },
    });

    if (!options.transfer) {
      await refreshDao();
    }

    setLoading(false);
  };
  return (
    <Menu>
      <MenuButton
        as={Button}
        variant='outline'
        color='secondary.400'
        _hover={{ cursor: 'pointer' }}
        isDisabled={loading}
      >
        <Flex justify='space-between' align='center'>
          Actions
          <Icon
            as={BsThreeDots}
            color='secondary.400'
            h='20px'
            w='20px'
            ml={2}
            _hover={{ cursor: 'pointer' }}
          />
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem
          isDisabled={!canInteract}
          onClick={() => handleWithdraw({ transfer: false })}
        >
          <Tooltip
            hasArrow
            shouldWrapChildren
            placement='bottom'
            label='Withdraw internal balance into this minion vault'
          >
            Deposit in Minion Vault
          </Tooltip>{' '}
        </MenuItem>
        <MenuItem
          isDisabled={!tokenWhitelisted || !canInteract}
          onClick={() => handleWithdraw({ transfer: true })}
        >
          <Tooltip
            hasArrow
            shouldWrapChildren
            placement='bottom'
            label={
              !tokenWhitelisted
                ? 'Token must be whitelisted in the DAO'
                : 'Pull tokens through the minion into this DAOs Treasury'
            }
          >
            Deposit in Treasury
          </Tooltip>
        </MenuItem>

        <RouterLink
          to={`/dao/${chainByName(targetDao.meta?.network).chain_id}/${
            targetDao.moloch.id
          }`}
        >
          <MenuItem>View DAO</MenuItem>
        </RouterLink>
      </MenuList>
    </Menu>
  );
};

export default MinionInternalBalanceActionMenu;
