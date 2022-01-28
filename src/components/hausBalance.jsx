import React from 'react';
import { Avatar, Text, Flex } from '@chakra-ui/react';
import hausImg from '../assets/img/Daohaus__Castle--Dark.svg';

const HausBalance = () => {
  return (
    <Flex
      background='#1A84DD'
      height='42px'
      justifyContent='center'
      alignItems='center'
      mr='38px'
      padding='11px'
      borderRadius='2px'
    >
      <Avatar name='Haus logo' src={hausImg} size='sm' />
      <Text fontSize='sm' fontFamily='Roboto Mono' ml={3}>
        490.11 Haus
      </Text>
    </Flex>
  );
};

export default HausBalance;
