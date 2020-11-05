import React, { useEffect } from 'react';
import {
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
} from '@chakra-ui/core';
import { useTheme } from '../../contexts/PokemolContext';
import { filterOptions } from '../../content/proposal-filters';

const ProposalFilter = ({ filter, setFilter }) => {
  const [theme] = useTheme();

  useEffect(() => {
    setFilter(filterOptions[0]);
    // eslint-disable-next-line
  }, []);

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
          {filter?.name}
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
    </Flex>
  );
};

export default ProposalFilter;
