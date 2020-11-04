import React, { useState } from 'react';
import {
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
} from '@chakra-ui/core';
import { useProposals, useTheme } from '../../contexts/PokemolContext';
import { filterOptions } from '../../content/proposal-filters';

const ProposalFilter = ({ setFilteredProposals }) => {
  const [theme] = useTheme();
  const [proposals] = useProposals();
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);

  console.log('proposals', proposals);

  const handleSelect = (filter) => {
    console.log('hi', filter);
    setSelectedFilter(filter);
    // setFilteredProposals(do some filtering)
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

      <Menu>
        <MenuButton textTransform='uppercase' fontFamily={theme.fonts.heading}>
          {selectedFilter.name}
        </MenuButton>
        <MenuList bg='black'>
          {filterOptions.map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => handleSelect(option)}
              value={option.value}
            >
              {option.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default ProposalFilter;

{
  /* <span style={{ color: theme.colors.primary[50] }}> filter</span> */
}
