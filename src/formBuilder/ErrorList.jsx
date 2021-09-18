import React from 'react';
import { Flex, Icon } from '@chakra-ui/react';
import { RiErrorWarningLine } from 'react-icons/ri';

const ErrorList = ({ errors = [] }) => (
  <Flex flexDirection='column' alignItems='flex-start'>
    {errors.map((error, index) => (
      <Error message={error.message} key={`${error.message}-${index}`} />
    ))}
  </Flex>
);

const Error = ({ message }) => (
  <Flex color='secondary.300' fontSize='m' alignItems='flex-start'>
    <Icon
      as={RiErrorWarningLine}
      color='secondary.300'
      mr={1}
      transform='translateY(2px)'
    />
    {message}
  </Flex>
);

export default ErrorList;
