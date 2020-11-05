import React, { useEffect, useState } from 'react';
import {
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
} from '@chakra-ui/core';

import { useMemberWallet, useTheme } from '../../contexts/PokemolContext';
import { getFilterOptions } from '../../content/proposal-filters';

const ProposalFilter = ({ filter, setFilter, listLength }) => {
  const [theme] = useTheme();
  const [memberWallet] = useMemberWallet();
  const [filterOptions, setFilterOptions] = useState();

  useEffect(() => {
    let options;
    if (memberWallet && memberWallet.activeMember) {
      console.log('memberWallet.activeMember', memberWallet.activeMember);
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
      <Text
        ml={8}
        mr={3}
        textTransform='uppercase'
        fontFamily={theme.fonts.heading}
      >
        Filter By
      </Text>

      {filterOptions ? (
        <Menu>
          <MenuButton
            textTransform='uppercase'
            fontFamily={theme.fonts.heading}
          >
            {buildFilterName()}
          </MenuButton>
          <MenuList bg='black'>
            {filterOptions.map((option) => (
              <MenuItem
                key={option.value}
                onClick={() => setFilter(option)}
                value={option.value}
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
