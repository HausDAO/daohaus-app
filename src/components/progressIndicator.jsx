import React from 'react';
import { Flex } from '@chakra-ui/layout';
import { BsCheckCircle } from 'react-icons/bs';
import Icon from '@chakra-ui/icon';

import { useCustomTheme } from '../contexts/CustomThemeContext';
import TextBox from './TextBox';

const ProgressIndicator = ({ prepend, text, append, icon }) => {
  const { theme } = useCustomTheme();
  return (
    <Flex
      border={`2px ${theme.colors.secondary[500]} solid`}
      borderRadius='md'
      p={3}
    >
      {prepend}
      {icon && <Icon mr={3} as={BsCheckCircle} h='25px' w='25px' />}
      <TextBox variant='body'>{text}</TextBox>
      {append}
    </Flex>
  );
};
export default ProgressIndicator;
