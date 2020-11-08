import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/core';

const ThemeSample = () => {
  return (
    <Flex>
      <Flex direction='column' p={6}>
        <h3 fontSize='l'>Primary</h3>
        <Box w='200px' bg='primary.50' p={6}>
          <Text>primary[50]</Text>
        </Box>
        <Box w='200px' bg='primary.100' p={6}>
          <Text>primary[100]</Text>
        </Box>
        <Box w='200px' bg='primary.200' p={6}>
          <Text>primary[200]</Text>
        </Box>
        <Box w='200px' bg='primary.300' p={6}>
          <Text>primary[300]</Text>
        </Box>
        <Box w='200px' bg='primary.400' p={6}>
          <Text>primary[400]</Text>
        </Box>
        <Box w='200px' bg='primary.500' p={6}>
          <Text>primary[500]</Text>
        </Box>
        <Box w='200px' bg='primary.600' p={6}>
          <Text>primary[600]</Text>
        </Box>
        <Box w='200px' bg='primary.700' p={6}>
          <Text>primary[700]</Text>
        </Box>
        <Box w='200px' bg='primary.800' p={6}>
          <Text>primary[800]</Text>
        </Box>
        <Box w='200px' bg='primary.900' p={6}>
          <Text>primary[900]</Text>
        </Box>
      </Flex>
      <Flex direction='column' p={6}>
        <h3 fontSize='l'>Secondary</h3>
        <Box w='200px' bg='secondary.50' p={6}>
          <Text>secondary[50]</Text>
        </Box>
        <Box w='200px' bg='secondary.100' p={6}>
          <Text>secondary[100]</Text>
        </Box>
        <Box w='200px' bg='secondary.200' p={6}>
          <Text>secondary[200]</Text>
        </Box>
        <Box w='200px' bg='secondary.300' p={6}>
          <Text>secondary[300]</Text>
        </Box>
        <Box w='200px' bg='secondary.400' p={6}>
          <Text>secondary[400]</Text>
        </Box>
        <Box w='200px' bg='secondary.500' p={6}>
          <Text>secondary[500]</Text>
        </Box>
        <Box w='200px' bg='secondary.600' p={6}>
          <Text>secondary[600]</Text>
        </Box>
        <Box w='200px' bg='secondary.700' p={6}>
          <Text>secondary[700]</Text>
        </Box>
        <Box w='200px' bg='secondary.800' p={6}>
          <Text>secondary[800]</Text>
        </Box>
        <Box w='200px' bg='secondary.900' p={6}>
          <Text>secondary[900]</Text>
        </Box>
      </Flex>
      <Flex direction='column' p={6}>
        <h3 fontSize='l'>Background</h3>
        <Box w='200px' bg='background.50' p={6}>
          <Text>background[50]</Text>
        </Box>
        <Box w='200px' bg='background.100' p={6}>
          <Text>background[100]</Text>
        </Box>
        <Box w='200px' bg='background.200' p={6}>
          <Text>background[200]</Text>
        </Box>
        <Box w='200px' bg='background.300' p={6}>
          <Text>background[300]</Text>
        </Box>
        <Box w='200px' bg='background.400' p={6}>
          <Text>background[400]</Text>
        </Box>
        <Box w='200px' bg='background.500' p={6}>
          <Text>background[500]</Text>
        </Box>
        <Box w='200px' bg='background.600' p={6}>
          <Text>background[600]</Text>
        </Box>
        <Box w='200px' bg='background.700' p={6}>
          <Text>background[700]</Text>
        </Box>
        <Box w='200px' bg='background.800' p={6}>
          <Text>background[800]</Text>
        </Box>
        <Box w='200px' bg='background.900' p={6}>
          <Text>background[900]</Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default ThemeSample;
