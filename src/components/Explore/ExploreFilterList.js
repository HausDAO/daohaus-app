import React, { useContext, useEffect, useState } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  Flex,
  Icon,
  MenuDivider,
  Text,
} from '@chakra-ui/react';
import { RiArrowDropDownFill } from 'react-icons/ri';

import { EXPLORE_FILTER_OPTIONS } from '../../content/explore-content';
import { ExploreContext } from '../../contexts/ExploreContext';

const ExploreFilterList = () => {
  const { state, dispatch } = useContext(ExploreContext);

  const handleFilterSelect = (option) => {
    console.log('option', option);
  };

  const renderOption = (option) => {
    return (
      <MenuItem
        key={option.value}
        onClick={() => handleFilterSelect(option)}
        value={option.value}
      >
        {option.name}
      </MenuItem>
    );
  };

  return (
    <Flex
      direction='row'
      w={['100%', null, null, '50%']}
      mb={[5, null, null, 0]}
    >
      <Text textTransform='uppercase' fontFamily='heading' mr={3}>
        Filter By
      </Text>

      <Menu isLazy>
        <MenuButton
          textTransform='uppercase'
          fontFamily='heading'
          color='secondary.500'
          _hover={{ color: 'secondary.400' }}
        >
          hi there
          {/* {filter ? filter.name : ''}
           */}
          <Icon as={RiArrowDropDownFill} color='secondary.500' />
        </MenuButton>
        <MenuList bg='black'>
          <MenuGroup title='Network'>
            {EXPLORE_FILTER_OPTIONS.map((option) => {
              if (option.type === 'network') {
                return renderOption(option);
              }
              return null;
            })}
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title='Purpose'>
            {EXPLORE_FILTER_OPTIONS.map((option) => {
              if (option.type === 'purpose') {
                return renderOption(option);
              }
              return null;
            })}
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title='Version'>
            {EXPLORE_FILTER_OPTIONS.map((option) => {
              if (option.type === 'version') {
                return renderOption(option);
              }
              return null;
            })}
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title='Member Count'>
            {EXPLORE_FILTER_OPTIONS.map((option) => {
              if (option.type === 'members') {
                return renderOption(option);
              }
              return null;
            })}
          </MenuGroup>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default ExploreFilterList;
