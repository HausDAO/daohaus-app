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
  alertNumber,
  showAlert,
}) => {
  const sections = Object.keys(options);

  return (
    <Flex
      direction='row'
      w={['100%', null, null, '50%']}
      mb={[5, null, null, 0]}
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
          {currentOption} {alertNumber && `(${alertNumber})`}
          <Icon as={RiArrowDropDownFill} color='secondary.500' />
        </MenuButton>
        <MenuList bg='black'>
          {sections?.map((sectionName, index) => {
            return (
              <span key={sectionName}>
                {index === 0 || <MenuDivider />}
                <MenuGroup title={sectionName !== 'main' && sectionName}>
                  {options?.[sectionName]?.map((option, index) => {
                    return (
                      <MenuItem
                        key={`${option.value}-${index}`}
                        value={option.value}
                        onClick={() => handleSelect(option)}
                      >
                        {option.value === showAlert
                          ? `${option.name} (${alertNumber})`
                          : option.name}
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
