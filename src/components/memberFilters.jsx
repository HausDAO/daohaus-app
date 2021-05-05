import React, { useEffect, useState } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  // MenuGroup,
  MenuItem,
  Flex,
  Icon,
  // MenuDivider,
  Text,
} from '@chakra-ui/react';
import { RiArrowDropDownFill } from 'react-icons/ri';
import { membersFilterOptions } from '../utils/memberContent';

const MemberFilters = ({ filter, setFilter }) => {
  const [filterOptions, setFilterOptions] = useState();

  useEffect(() => {
    setFilterOptions(membersFilterOptions);
    setFilter(membersFilterOptions[0]);
  }, []);

  const handleFilterSelect = option => {
    setFilter(option);
  };

  return (
    <Flex
      direction='row'
      justifyContent='flex-end'
      w={['100%', null, null, '50%']}
      mb={[5, null, null, 0]}
    >
      <Text
        textTransform='uppercase'
        fontFamily='heading'
        fontSize={['sm', null, null, 'md']}
        mr={3}
      >
        Filter By
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
              if (option.type === 'main') {
                return (
                  <MenuItem
                    key={option.value}
                    onClick={() => handleFilterSelect(option)}
                    value={option.value}
                  >
                    {option.name}
                  </MenuItem>
                );
              }
              return null;
            })}
          </MenuList>
        </Menu>
      ) : null}
    </Flex>
  );
};

export default MemberFilters;
