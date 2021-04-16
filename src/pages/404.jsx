import React from 'react';
import { Link } from 'react-router-dom';
import { Flex, Box, Button } from '@chakra-ui/react';

import Layout from '../components/layout';

const FourOhFour = () => {
  return (
    <Layout>
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
            You have been slain
          </Box>
          <Box
            textTransform='uppercase'
            fontWeight={700}
            fontSize='md'
            fontFamily='heading'
            maxW='350px'
            textAlign='center'
          >
            Please reload from the most recent save point.
          </Box>

          <Button
            as={Link}
            to='/'
            textTransform='uppercase'
            w='40%'
            fontWeight={700}
          >
            Start Over
          </Button>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default FourOhFour;
