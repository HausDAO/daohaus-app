import React, { useContext } from 'react';
import { RiArrowDropDownFill } from 'react-icons/ri';
import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  Flex,
  Icon,
  MenuDivider,
  Switch,
  FormLabel,
} from '@chakra-ui/react';

import { ExploreContext } from '../contexts/ExploreContext';
import { EXPLORE_FILTER_OPTIONS } from '../utils/exploreContent';

const ExploreFilterList = () => {
  const { state, dispatch } = useContext(ExploreContext);

  const handleFilterSelect = (option, category, e) => {
    let updatedFilterValues;
    if (!e.target.checked) {
      updatedFilterValues = state.filters[category].filter(
        f => f !== option.value,
      );
    } else {
      updatedFilterValues = [...state.filters[category], option.value];
    }

    dispatch({
      type: 'updateFilter',
      payload: { [category]: updatedFilterValues },
    });
  };

  const renderOption = (option, category) => {
    return (
      <MenuItem key={option.value} value={option.value}>
        <Switch
          id={option.name}
          size='sm'
          colorScheme='secondary'
          mr={3}
          isChecked={state.filters[category].includes(option.value)}
          onChange={e => handleFilterSelect(option, category, e)}
        />
        <FormLabel htmlFor={option.name} mb='0'>
          {option.name}
        </FormLabel>
      </MenuItem>
    );
  };

  const filterCount = Object.keys(state.filters).reduce((sum, key) => {
    sum += state.filters[key].length;
    return sum;
  }, 0);

  return (
    <Flex
      direction='row'
      w={['100%', null, null, 'auto']}
      my={[5, null, null, 0]}
    >
      <Menu isLazy closeOnSelect={false}>
        <MenuButton
          textTransform='uppercase'
          fontFamily='heading'
          color='secondary.500'
          _hover={{ color: 'secondary.400' }}
        >
          <Box>
            {`Filters (${filterCount})`}
            <Icon as={RiArrowDropDownFill} color='secondary.500' />
          </Box>
        </MenuButton>
        <MenuList bg='black'>
          <MenuGroup title='Network'>
            {EXPLORE_FILTER_OPTIONS.map(option => {
              if (option.type === 'network') {
                return renderOption(option, 'network');
              }
              return null;
            })}
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title='Member Count'>
            {EXPLORE_FILTER_OPTIONS.map(option => {
              if (option.type === 'members') {
                return renderOption(option, 'members');
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
