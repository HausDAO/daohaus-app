import React from 'react';
import { Flex, Icon } from '@chakra-ui/react';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

const Vote = ({
  thumbsUp,
  thumbsDown,
  //  Will also be responsible for proposal actions vote button in the future
}) => {
  return (
    <Flex
      pl={6}
      w='40px'
      borderColor='secondary.500'
      borderWidth='2px'
      borderStyle='solid'
      borderRadius='40px'
      p={1}
      h='40px'
      justify='center'
      align='center'
      m='0 auto'
    >
      {thumbsUp && <Icon as={FaThumbsUp} color='secondary.500' />}
      {thumbsDown && <Icon as={FaThumbsDown} color='secondary.500' />}
    </Flex>
  );
};

export default Vote;
