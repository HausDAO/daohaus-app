import React from 'react';
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

const GenericSelect = ({
  options,
  handleSelect,
  currentOption,
  label,
  count,
  containerProps = {},
}) => {
  const sections = Object.keys(options);
  const showCount = count != null;

  return (
    <Flex
      direction='row'
      w={['100%', null, null, '50%']}
      mb={[5, null, null, 0]}
      {...containerProps}
    >
      <Text
        textTransform='uppercase'
        fontFamily='heading'
        mr={3}
        fontSize={['sm', null, null, 'md']}
      >
        {label}
      </Text>
      <Menu isLazy>
        <MenuButton
          textTransform='uppercase'
          fontFamily='heading'
          fontSize={['sm', null, null, 'md']}
          color='secondary.500'
          _hover={{ color: 'secondary.400' }}
        >
          {currentOption}
          {showCount && ` (${count})`}
          <Icon as={RiArrowDropDownFill} color='secondary.500' />
        </MenuButton>
        <MenuList bg='black'>
          {sections?.map((sectionName, index) => {
            return (
              <span key={sectionName}>
                {index === 0 || <MenuDivider />}
                <MenuGroup title={sectionName !== 'main' && sectionName}>
                  {options?.[sectionName]?.map((option, i) => {
                    return (
                      <MenuItem
                        key={`${option.value}-${i}`}
                        value={option.value}
                        onClick={() => handleSelect(option)}
                      >
                        {option.name}
                      </MenuItem>
                    );
                  })}
                </MenuGroup>
              </span>
            );
          })}
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default GenericSelect;
