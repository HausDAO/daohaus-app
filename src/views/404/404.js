import React from 'react';
import { Link } from 'react-router-dom';
import { Flex, Box, Button } from '@chakra-ui/core';
import { useTheme } from '../../contexts/CustomThemeContext';

const FourOhFour = () => {
  const [theme] = useTheme();

  return (
    <Flex align='center' justify='center' w='100%' h='100%'>
      <Flex direction='column' align='center' h='35%' justify='space-between'>
        <Box
          textTransform='uppercase'
          fontWeight={700}
          fontSize='md'
          fontFamily='heading'
          maxW='350px'
          textAlign='center'
        >
          {theme.daoMeta.f04heading}
        </Box>
        <Box
          textTransform='uppercase'
          fontWeight={700}
          fontSize='md'
          fontFamily='heading'
          maxW='350px'
          textAlign='center'
        >
          {theme.daoMeta.f04subhead}
        </Box>

        <Button
          as={Link}
          to='/'
          textTransform='uppercase'
          w='40%'
          fontWeight={700}
        >
          {theme.daoMeta.f04cta}
        </Button>
      </Flex>
    </Flex>
  );
};

export default FourOhFour;
