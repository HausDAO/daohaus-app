import React, { useCallback } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';

import Web3SignIn from './web3SignIn';
import WrongNetworkToolTip from './wrongNetworkToolTip';
import { getTerm } from '../utils/metadata';
import HausBalance from './hausBalance';
import { useHistory } from 'react-router-dom';
import { useOverlay } from '../contexts/OverlayContext';
import { useAppModal } from '../hooks/useModals';
import { getProfileForm } from '../utils/profile';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

const PageHeader = ({ isDao, header, headerEl, customTerms }) => {
  const { address } = useInjectedProvider();
  const { successToast } = useOverlay();
  const { stepperModal, closeModal } = useAppModal();

  const profileForm = getProfileForm(() => {
    successToast({ title: 'Updated Profile!' });
    // refreshProfile(profile);
    closeModal();
  });

  const handleEditProfile = useCallback(() => {
    stepperModal(profileForm);
  }, [address]);

  return (
    <Flex direction='row' justify='space-between' p={6}>
      <Flex
        direction='row'
        justify={['space-between', null, null, 'flex-start']}
        align='center'
        w={['100%', null, null, 'auto']}
      >
        <Box
          fontSize={['lg', null, null, '3xl']}
          fontFamily='heading'
          fontWeight={700}
          mr={10}
        >
          {customTerms ? getTerm(customTerms, header) : header}
        </Box>
        <Button onClick={handleEditProfile} variant='outline'>
          Edit 3Box Profile
        </Button>
        {headerEl}
      </Flex>
      <Flex
        direction='row'
        justify='flex-end'
        align='center'
        d={['none', null, null, 'flex']}
      >
        {isDao && <WrongNetworkToolTip />}
        <HausBalance />
        <Web3SignIn isDao={isDao} />
      </Flex>
    </Flex>
  );
};
export default PageHeader;
