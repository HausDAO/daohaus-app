import React, { useContext } from 'react';
import { RiArrowDropDownFill } from 'react-icons/ri';

import { ExploreContext } from '../../contexts/ExploreContext';
import { SORT_OPTIONS } from '../../content/explore-content';
import {
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';

const ExploreSort = () => {
  const { state, dispatch } = useContext(ExploreContext);

  const handleChange = (option) => {
    dispatch({ type: 'updateSort', payload: option });
  };

  return (
    <Flex
      direction='row'
      w={['100%', null, null, 'auto']}
      mr={6}
      my={[5, null, null, 0]}
    >
      <Text textTransform='uppercase' fontFamily='heading' mr={3}>
        Sort By
      </Text>
      <Menu isLazy>
        <MenuButton
          textTransform='uppercase'
          fontFamily='heading'
          color='secondary.500'
          _hover={{ color: 'secondary.400' }}
        >
          {state.sort?.name} <Icon as={RiArrowDropDownFill} />
        </MenuButton>
        <MenuList bg='black'>
          {SORT_OPTIONS.map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => handleChange(option)}
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

export default ExploreSort;
