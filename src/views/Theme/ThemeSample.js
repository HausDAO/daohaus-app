import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/core';

import { useTheme } from '../../contexts/PokemolContext';

const ThemeSample = () => {
  const [theme] = useTheme();

  return (
    <Flex>
      <Flex direction='column' p={6}>
        <h3 fontSize='l'>Primary</h3>
        <Box w='200px' bg={theme.colors.brand[50]} p={6}>
          <Text>Brand[50]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.brand[100]} p={6}>
          <Text>Brand[100]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.brand[200]} p={6}>
          <Text>Brand[200]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.brand[300]} p={6}>
          <Text>Brand[300]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.brand[400]} p={6}>
          <Text>Brand[400]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.brand[500]} p={6}>
          <Text>Brand[500]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.brand[600]} p={6}>
          <Text>Brand[600]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.brand[700]} p={6}>
          <Text>Brand[700]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.brand[800]} p={6}>
          <Text>Brand[800]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.brand[900]} p={6}>
          <Text>Brand[900]</Text>
        </Box>
      </Flex>
      <Flex direction='column' p={6}>
        <h3 fontSize='l'>Secondary</h3>
        <Box w='200px' bg={theme.colors.secondary[50]} p={6}>
          <Text>secondary[50]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.secondary[100]} p={6}>
          <Text>secondary[100]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.secondary[200]} p={6}>
          <Text>secondary[200]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.secondary[300]} p={6}>
          <Text>secondary[300]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.secondary[400]} p={6}>
          <Text>secondary[400]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.secondary[500]} p={6}>
          <Text>secondary[500]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.secondary[600]} p={6}>
          <Text>secondary[600]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.secondary[700]} p={6}>
          <Text>secondary[700]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.secondary[800]} p={6}>
          <Text>secondary[800]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.secondary[900]} p={6}>
          <Text>secondary[900]</Text>
        </Box>
      </Flex>
      <Flex direction='column' p={6}>
        <h3 fontSize='l'>Background</h3>
        <Box w='200px' bg={theme.colors.background[50]} p={6}>
          <Text>background[50]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.background[100]} p={6}>
          <Text>background[100]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.background[200]} p={6}>
          <Text>background[200]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.background[300]} p={6}>
          <Text>background[300]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.background[400]} p={6}>
          <Text>background[400]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.background[500]} p={6}>
          <Text>background[500]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.background[600]} p={6}>
          <Text>background[600]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.background[700]} p={6}>
          <Text>background[700]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.background[800]} p={6}>
          <Text>background[800]</Text>
        </Box>
        <Box w='200px' bg={theme.colors.background[900]} p={6}>
          <Text>background[900]</Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default ThemeSample;
