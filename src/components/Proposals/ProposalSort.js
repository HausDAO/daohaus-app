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
import { sortOptions } from '../../content/proposal-filters';

const ProposalSort = ({ setSortedRecords }) => {
  const [theme] = useTheme();
  const [proposals] = useProposals();
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);

  console.log('proposals', proposals);

  const handleSelect = (sort) => {
    console.log('hi', sort);
    setSelectedSort(sort);
    // setSortedRecords
  };

  return (
    <Flex direction='row'>
      <Text
        ml={8}
        mr={3}
        textTransform='uppercase'
        fontFamily={theme.fonts.heading}
      >
        Sort By
      </Text>

      <Menu>
        <MenuButton textTransform='uppercase' fontFamily={theme.fonts.heading}>
          {selectedSort.name}
        </MenuButton>
        <MenuList bg='black'>
          {sortOptions.map((option) => (
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

export default ProposalSort;
