import React, { useEffect, useState } from 'react';
import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  Flex,
  Icon,
  MenuDivider,
} from '@chakra-ui/core';
import { RiArrowDropDownFill } from 'react-icons/ri';

import { useMemberWallet } from '../../contexts/PokemolContext';
import { getFilterOptions } from '../../content/proposal-filters';
import { determineUnreadProposalList } from '../../utils/proposal-helper';

const ProposalFilter = ({ filter, setFilter, proposals }) => {
  const [memberWallet] = useMemberWallet();
  const [filterOptions, setFilterOptions] = useState();
  const [actionNeeded, setActionNeeded] = useState([]);

  useEffect(() => {
    let options;
    if (memberWallet && memberWallet.activeMember) {
      const action = proposals.filter((prop) => {
        const unread = determineUnreadProposalList(
          prop,
          memberWallet.activeMember,
          memberWallet.memberAddress,
        );
        return unread.unread;
      });
      setActionNeeded(action);

      options = getFilterOptions(memberWallet.activeMember, action.length);
    } else {
      options = getFilterOptions(false);
    }
    setFilterOptions(options);
    setFilter(options[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberWallet]);

  const buildFilterName = () => {
    if (!filter) return '';

    return filter.value === 'Action Needed'
      ? `${filter.name} (${actionNeeded.length})`
      : filter.name;
  };

  return (
    <Flex direction='row'>
      <Box mr={3} textTransform='uppercase' fontFamily='heading'>
        Filter By
      </Box>

      {filterOptions ? (
        <Menu>
          <MenuButton
            textTransform='uppercase'
            fontFamily='heading'
            color='primary.50'
            _hover={{ textDecoration: 'underline' }}
          >
            {buildFilterName()}{' '}
            <Icon as={RiArrowDropDownFill} color='primary.50' />
          </MenuButton>
          <MenuList bg='black'>
            <MenuGroup>
              {filterOptions.map((option) => {
                if (option.type === 'main') {
                  return (
                    <MenuItem
                      key={option.value}
                      onClick={() => setFilter(option)}
                      value={option.value}
                      _hover={{ color: 'primary.300' }}
                    >
                      {option.value === 'Action Needed'
                        ? `${option.name} (${actionNeeded.length})`
                        : option.name}
                    </MenuItem>
                  );
                }
                return null;
              })}
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title='Proposal Type'>
              {filterOptions.map((option) => {
                if (option.type === 'proposalType') {
                  return (
                    <MenuItem
                      key={option.value}
                      onClick={() => setFilter(option)}
                      value={option.value}
                      _hover={{ color: 'primary.300' }}
                    >
                      {option.name}
                    </MenuItem>
                  );
                }
                return null;
              })}
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title='Proposal Status'>
              {filterOptions.map((option) => {
                if (option.type === 'status') {
                  return (
                    <MenuItem
                      key={option.value}
                      onClick={() => setFilter(option)}
                      value={option.value}
                      _hover={{ color: 'primary.300' }}
                    >
                      {option.name}
                    </MenuItem>
                  );
                }
                return null;
              })}
            </MenuGroup>
          </MenuList>
        </Menu>
      ) : null}
    </Flex>
  );
};

export default ProposalFilter;
