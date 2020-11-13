import React from 'react';
import { Flex, Icon, Box } from '@chakra-ui/core';
import { BiToggleRight } from 'react-icons/bi';
import { VscGear } from 'react-icons/vsc';
import ComingSoonOverlay from '../Shared/ComingSoonOverlay';
import ContentBox from '../Shared/ContentBox';
import TextBox from '../Shared/TextBox';

const Superpowers = () => {
  return (
    <ContentBox d='flex' flexDirection='column' position='relative'>
      <ComingSoonOverlay />
      <Flex
        p={4}
        justify='space-between'
        align='center'
        borderBottomWidth='1px'
        borderBottomStyle='solid'
        borderBottomColor='whiteAlpha.200'
      >
        <TextBox>Force Proposal on Save</TextBox>
        <Icon as={BiToggleRight} w='35px' h='35px' />
      </Flex>
      <Flex p={4} justify='space-between' align='center'>
        <Box fontFamily='heading' fontWeight={700} fontSize='md'>
          Theme
        </Box>
        <Flex align='center'>
          <Icon as={VscGear} color='secondary.500' w='25px' h='25px' mr={2} />
          <Icon as={BiToggleRight} color='secondary.500' w='35px' h='35px' />
        </Flex>
      </Flex>
      <Flex p={4} justify='space-between' align='center'>
        <Box fontFamily='heading' fontWeight={700} fontSize='md'>
          Notifications
        </Box>
        <Flex align='center'>
          <Icon as={VscGear} color='secondary.500' w='25px' h='25px' mr={2} />
          <Icon as={BiToggleRight} color='secondary.500' w='35px' h='35px' />
        </Flex>
      </Flex>
    </ContentBox>
  );
};

export default Superpowers;
