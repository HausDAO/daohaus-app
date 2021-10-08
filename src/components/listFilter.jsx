import React, { useEffect, useState } from 'react';
import { RiArrowDropDownFill } from 'react-icons/ri';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react';

const ListFilter = ({ filter, setFilter, options, labelText }) => {
  const [filterOptions, setFilterOptions] = useState();

  useEffect(() => {
    setFilterOptions(options);
    setFilter(options[0]);
  }, []);

  const handleFilterSelect = option => {
    setFilter(option);
  };

  return (
    <Flex direction='row'>
      <Text
        textTransform='uppercase'
        fontFamily='heading'
        fontSize={['sm', null, null, 'md']}
        mr={3}
      >
        {labelText}
      </Text>

      {filterOptions ? (
        <Menu isLazy>
          <MenuButton
            textTransform='uppercase'
            fontFamily='heading'
            fontSize={['sm', null, null, 'md']}
            color='secondary.500'
            _hover={{ color: 'secondary.400' }}
          >
            {filter.name}
            <Icon as={RiArrowDropDownFill} color='secondary.500' />
          </MenuButton>
          <MenuList bg='black'>
            {filterOptions?.map(option => {
              return (
                <MenuItem
                  key={option.value}
                  onClick={() => handleFilterSelect(option)}
                  value={option.value}
                >
                  {option.name}
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>
      ) : null}
    </Flex>
  );
};

export default ListFilter;
