import React from 'react';
import {
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { RiArrowDropDownFill } from 'react-icons/ri';

import TextBox from './TextBox';

const Dropdown = ({ initialItem, items, label }) => {
  return (
    <Flex alignItems='center'>
      <TextBox mr='2' size='sm'>
        {label}
      </TextBox>
      <Menu value={initialItem?.value}>
        <MenuButton
          textTransform='uppercase'
          fontFamily='heading'
          fontSize='sm'
          color='secondary.500'
          _hover={{ color: 'secondary.400' }}
          display='inline-block'
        >
          {initialItem?.name}
          <Icon as={RiArrowDropDownFill} color='secondary.500' />
        </MenuButton>
        <MenuList>
          {items?.map(item => (
            <MenuItem key={item.value} value={item.value} onClick={item.fn}>
              {item.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default Dropdown;
