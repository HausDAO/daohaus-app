import React from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';
import { Flex, Icon } from '@chakra-ui/react';

const ErrorList = ({ errors = [], singleError }) => (
  <Flex flexDirection='column' alignItems='flex-start'>
    {errors.map((error, index) => (
      <Error message={error.message} key={`${error.message}-${index}`} />
    ))}
    {singleError && <Error message={singleError?.message} />}
  </Flex>
);

const Error = ({ message }) => (
  <Flex color='secondary.300' fontSize='m' alignItems='flex-start'>
    <Icon
      as={RiErrorWarningLine}
      color='secondary.300'
      mr={1}
      transform='translateY(4px)'
    />
    {message}
  </Flex>
);

export default ErrorList;
