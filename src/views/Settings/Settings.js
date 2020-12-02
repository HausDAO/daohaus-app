import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import BoostStatus from '../../components/Settings/BoostStatus';
import Superpowers from '../../components/Settings/Superpowers';
import DaoContractSettings from '../../components/Settings/DaoContractSettings';
import TextBox from '../../components/Shared/TextBox';

const Settings = () => {
  return (
    <Flex>
      <Box w='50%' pl={6}>
        <TextBox fontSize='xs'>Dao Contract Settings</TextBox>
        <DaoContractSettings />
        <TextBox fontSize='xs' mt={6}>
          Boost Status
        </TextBox>
        <BoostStatus />
      </Box>
      <Box w='50%' pl={6}>
        <TextBox>Superpowers</TextBox>
        <Superpowers />
      </Box>
    </Flex>
  );
};

export default Settings;
