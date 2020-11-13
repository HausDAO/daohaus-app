import React from 'react';
import { Box, Flex, Button } from '@chakra-ui/core';
import ComingSoonOverlay from '../Shared/ComingSoonOverlay';

const BoostStatus = () => {
  return (
    <Flex
      rounded='lg'
      bg='blackAlpha.600'
      borderWidth='1px'
      borderColor='whiteAlpha.200'
      p={6}
      m={6}
      mt={2}
      w='100%'
      h='175px'
      direction='column'
      justify='space-between'
      position='relative'
    >
      <ComingSoonOverlay />
      <Flex>
        <Box>
          <Box
            fontWeight={700}
            fontFamily='heading'
            fontSize='xs'
            textTransform='uppercase'
          >
            Runway
          </Box>
          <Box fontWeight={700} fontFamily='mono' fontSize='md'>
            0 Months
          </Box>
        </Box>
      </Flex>
      <Flex justify='space-between'>
        <Box>
          <Box
            fontWeight={700}
            fontFamily='heading'
            fontSize='xs'
            textTransform='uppercase'
          >
            Boosts
          </Box>
          <Box fontWeight={700} fontFamily='mono' fontSize='md'>
            0 Boosts
          </Box>
        </Box>
        <Box>
          <Box
            fontWeight={700}
            fontFamily='heading'
            fontSize='xs'
            textTransform='uppercase'
          >
            Monthly Cost
          </Box>
          <Box fontWeight={700} fontFamily='mono' fontSize='md'>
            0 Boosts
          </Box>
        </Box>
        <Button>Get Boosts </Button>
      </Flex>
    </Flex>
  );
};

export default BoostStatus;
