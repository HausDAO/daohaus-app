import React, { useEffect, useState } from 'react';
import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Icon,
} from '@chakra-ui/core';
import { RiArrowDropDownFill } from 'react-icons/ri';

import { useMemberWallet } from '../../contexts/PokemolContext';
import { getFilterOptions } from '../../content/proposal-filters';

const ProposalFilter = ({ filter, setFilter, listLength }) => {
  const [memberWallet] = useMemberWallet();
  const [filterOptions, setFilterOptions] = useState();

  useEffect(() => {
    let options;
    if (memberWallet && memberWallet.activeMember) {
      options = getFilterOptions(memberWallet.activeMember);
    } else {
      options = getFilterOptions(false);
    }
    setFilterOptions(options);
    setFilter(options[0]);
    // eslint-disable-next-line
  }, [memberWallet]);

  const buildFilterName = () => {
    if (!filter) return '';

    return filter.value === 'Action Needed'
      ? `${filter.name} (${listLength})`
      : filter.name;
  };

  return (
    <Flex direction='row'>
      <Box ml={8} mr={3} textTransform='uppercase' fontFamily='heading'>
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
            {filterOptions.map((option) => (
              <MenuItem
                key={option.value}
                onClick={() => setFilter(option)}
                value={option.value}
                _hover={{ color: 'primary.300' }}
              >
                {option.name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      ) : null}
    </Flex>
  );
};

export default ProposalFilter;
