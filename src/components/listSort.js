import React, { useEffect } from 'react';
import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { RiArrowDropDownFill } from 'react-icons/ri';

const ListSort = ({ sort, setSort, options }) => {
  useEffect(() => {
    setSort(options[0]);
  }, []);

  return (
    <Flex direction='row'>
      <Box
        mr={3}
        textTransform='uppercase'
        fontFamily='heading'
        fontSize={['sm', null, null, 'md']}
      >
        Sort By
      </Box>

      <Menu isLazy>
        <MenuButton
          textTransform='uppercase'
          fontFamily='heading'
          fontSize={['sm', null, null, 'md']}
          color='secondary.500'
        >
          {sort?.name} <Icon as={RiArrowDropDownFill} color='secondary.500' />
        </MenuButton>
        <MenuList bg='black'>
          {options.map((option) => (
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

export default ListSort;
