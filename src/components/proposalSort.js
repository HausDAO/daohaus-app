import React, { useEffect } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react';
import { RiArrowDropDownFill } from 'react-icons/ri';
import { sortOptions } from '../utils/proposalContent';

const ProposalSort = ({ sort, setSort }) => {
  useEffect(() => {
    setSort(sortOptions[0]);
  }, []);

  return (
    <Flex direction='row' w={['100%', null, null, '50%']}>
      <Text
        ml={[0, null, null, 8]}
        mr={3}
        textTransform='uppercase'
        fontFamily='heading'
      >
        Sort By
      </Text>

      <Menu isLazy>
        <MenuButton
          textTransform='uppercase'
          fontFamily='heading'
          color='secondary.500'
          _hover={{ color: 'secondary.400' }}
        >
          {sort?.name} <Icon as={RiArrowDropDownFill} />
        </MenuButton>
        <MenuList bg='black'>
          {sortOptions.map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => setSort(option)}
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
