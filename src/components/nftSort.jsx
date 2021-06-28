import React, { useEffect } from 'react';
import {
  Box,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { RiArrowDropDownFill, RiCheckboxCircleLine } from 'react-icons/ri';

const ListSort = ({ sort, setSort, options }) => {
  useEffect(() => {
    setSort(options[0]);
  }, []);

  return (
    <Flex direction='row' justifyContent='flex-end'>
      <Box
        mr={3}
        textTransform='uppercase'
        fontFamily='heading'
        fontSize={['sm', null, null, 'md']}
      >
        Sorted
      </Box>

      <Menu isLazy autoSelect={false}>
        <MenuButton
          as={HStack}
          textTransform='uppercase'
          fontFamily='heading'
          fontSize={['sm', null, null, 'md']}
          color='secondary.500'
          spacing={2}
          _hover={{ cursor: 'pointer' }}
        >
          by {sort?.name || 'newest'}
        </MenuButton>
        <MenuList bg='blackAlpha.900'>
          {options.map(option => (
            <MenuItem
              key={option.value}
              onClick={() => setSort(option)}
              value={option.value}
              fontSize='xs'
              textTransform='uppercase'
              fontFamily='heading'
              _active={{ color: 'primary.300' }}
              _hover={{ bg: 'none', color: 'secondary.400' }}
              _focus={{ bg: 'none', color: 'secondary.400' }}
            >
              {option.name}
              {sort === option && (
                <Icon as={RiCheckboxCircleLine} ml='auto' w={6} h={6} />
              )}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default ListSort;
