import React from 'react';
import { Box, Flex } from '@chakra-ui/core';
import BoostStatus from '../../components/Settings/BoostStatus';
import Superpowers from '../../components/Settings/Superpowers';
import DaoContractSettings from '../../components/Settings/DaoContractSettings';

const Settings = () => {
  return (
    <Flex>
      <Box w='50%'>
        <Box
          fontWeight={700}
          fontFamily='heading'
          fontSize='xs'
          textTransform='uppercase'
          ml={8}
        >
          Boost Status
        </Box>
        <BoostStatus />
        <Box
          fontWeight={700}
          fontFamily='heading'
          fontSize='xs'
          textTransform='uppercase'
          ml={8}
        >
          Dao Contract Settings
        </Box>
        <DaoContractSettings />
      </Box>
      <Box w='30%' pl={6}>
        <Box
          fontWeight={700}
          fontFamily='heading'
          fontSize='xs'
          textTransform='uppercase'
          ml={8}
        >
          Superpowers
        </Box>
        <Superpowers />
      </Box>
    </Flex>
  );
};

export default Settings;
