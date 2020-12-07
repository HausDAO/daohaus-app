import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import BoostStatus from '../../components/Settings/BoostStatus';
import Superpowers from '../../components/Settings/Superpowers';
import DaoContractSettings from '../../components/Settings/DaoContractSettings';
import TextBox from '../../components/Shared/TextBox';

const Settings = () => {
  return (
    <Flex p={6} wrap='wrap'>
      <Box
        w={['100%', null, null, null, '60%']}
        pr={[0, null, null, null, 6]}
        pb={6}
      >
        <TextBox fontSize='xs'>Dao Contract Settings</TextBox>
        <DaoContractSettings />
        <TextBox fontSize='xs' mt={6}>
          Boost Status
        </TextBox>
        <BoostStatus />
      </Box>
      <Box w={['100%', null, null, null, '40%']}>
        <TextBox>Superpowers</TextBox>
        <Superpowers />
      </Box>
    </Flex>
  );
};

export default Settings;
