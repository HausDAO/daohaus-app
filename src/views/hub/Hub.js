import React, { useContext } from 'react';
import { Button, Box, Flex, Text, Grid } from '@chakra-ui/core';
import { PokemolContext } from '../../contexts/PokemolContext';
import BrandOverride from '../../assets/themes/raidTheme/raidguild__avatar--pink.jpg';

const Hub = () => {
  const { dispatch } = useContext(PokemolContext);

  const setTheme = () => {
    dispatch({
      type: 'setTheme',
      payload: {
        brand50: '#ff4d74',
        brand100: '#ff4d74',
        brand200: '#ff4d74',
        brand300: '#ff4d74',
        brand400: '#fe1d5b',
        brand500: '#e50651',
        brand600: '#e50651',
        brand700: '#e50651',
        brand800: '#e50651',
        brand900: '#e50651',
        brandImg: BrandOverride,
        bg400: '#000',
      },
    });
  };

  const setDefault = () => {
    dispatch({
      type: 'clearTheme',
    });
  };

  return (
    <Box p={6}>
      <p>i am HUB content</p>
      <Flex w="100%">
        <Button onClick={setTheme}> PRETEND DAO BUTTON</Button>
        <Button onClick={setDefault}> DEFAULT</Button>
      </Flex>
      <Grid gap={6} templateColumns="repeat(2, 1fr)">
        <Box
          rounded="lg"
          bg="blackAlpha.600"
          borderWidth="1px"
          borderColor="whiteAlpha.200"
          p={6}
          mt={6}
          w="100%"
        >
          <Text fontSize="xl">Username.eth</Text>
        </Box>
        <Box
          rounded="lg"
          bg="blackAlpha.600"
          borderWidth="1px"
          borderColor="whiteAlpha.200"
          p={6}
          mt={6}
          w="100%"
        >
          <Text fontSize="xl">Recent Activity</Text>
        </Box>
      </Grid>
    </Box>
  );
};

export default Hub;
