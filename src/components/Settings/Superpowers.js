import React from 'react';
import { Flex, Icon, Box } from '@chakra-ui/core';
import { BiToggleRight } from 'react-icons/bi';
import { VscGear } from 'react-icons/vsc';
import ComingSoonOverlay from '../Shared/ComingSoonOverlay';

const Superpowers = () => {
  return (
    <Box
      rounded='lg'
      bg='blackAlpha.600'
      borderWidth='1px'
      borderColor='whiteAlpha.200'
      direction='column'
      m={6}
      mt={2}
      w='100%'
      position='relative'
    >
      <ComingSoonOverlay />
      <Flex
        p={4}
        justify='space-between'
        align='center'
        borderBottomWidth='1px'
        borderBottomStyle='solid'
        borderBottomColor='whiteAlpha.200'
      >
        <Box>Force Proposal on Save</Box>
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
    </Box>
  );
};

export default Superpowers;
