import React, { useEffect } from 'react';
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
import { membersSortOptions } from '../../content/members-filters';

const MemberSort = ({ sort, setSort }) => {
  useEffect(() => {
    setSort(membersSortOptions[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex direction='row'>
      <Box mr={3} textTransform='uppercase' fontFamily='heading'>
        Sort By
      </Box>

      <Menu>
        <MenuButton
          textTransform='uppercase'
          fontFamily='heading'
          color='primary.50'
        >
          {sort?.name} <Icon as={RiArrowDropDownFill} color='primary.50' />
        </MenuButton>
        <MenuList bg='black'>
          {membersSortOptions.map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => setSort(option)}
              value={option.value}
              _active={{ color: 'primary.300' }}
              _hover={{ color: 'primary.300' }}
            >
              {option.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default MemberSort;
