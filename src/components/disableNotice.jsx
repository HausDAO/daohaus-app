import React from 'react';
import { Flex, Heading, Link, Text } from '@chakra-ui/layout';
import { RiExternalLinkLine } from 'react-icons/ri';
import { Icon } from '@chakra-ui/react';

const DisableNotice = ({ subhead }) => {
  return (
    <Flex flexDir='column' w='100%' minW={['300px', '400px', '450px']}>
      <Heading fontSize='xl' mb='3rem'>
        DAOhaus v2 feature disabled
      </Heading>
      <Heading fontSize='l' mb='3rem'>
        {subhead
          ? subhead
          : 'Contact us to in the DAOhaus discord server if you have questions.'}
      </Heading>
      <Link
        color='white'
        href='https://discord.com/channels/709210493549674598/735524730328711188'
        isExternal
      >
        <Text fontSize='lg'>
          DAOhaus discord
          <Icon as={RiExternalLinkLine} ml='2px' mt='-3px' />
        </Text>
      </Link>
    </Flex>
  );
};

export default DisableNotice;
