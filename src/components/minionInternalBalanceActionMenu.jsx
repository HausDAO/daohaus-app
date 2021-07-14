import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
import { BsThreeDots } from 'react-icons/bs';
import { chainByName } from '../utils/chain';

const MinionInternalBalanceActionMenu = ({
  targetDao,
  tokenWhitelisted,
  daoConnectedAndSameChain,
  handleWithdraw,
  loading,
  isMember,
}) => {
  return (
    <Menu isDisabled>
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
          isDisabled={tokenWhitelisted || daoConnectedAndSameChain || !isMember}
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
          isDisabled={tokenWhitelisted || daoConnectedAndSameChain || !isMember}
          onClick={() => handleWithdraw({ transfer: true })}
        >
          <Tooltip
            hasArrow
            shouldWrapChildren
            placement='bottom'
            label={
              tokenWhitelisted
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
