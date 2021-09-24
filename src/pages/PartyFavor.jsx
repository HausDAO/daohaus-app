import React, { useState } from 'react';
import { Flex, Stack, Button, Spinner } from '@chakra-ui/react';
import { RiAddFill } from 'react-icons/ri';
import MainViewLayout from '../components/mainViewLayout';

import BoostNotActive from '../components/boostNotActive';
import TextBox from '../components/TextBox';
import { useOverlay } from '../contexts/OverlayContext';

const PartyFavor = ({ isMember, daoMetaData }) => {
  const [loading, setLoading] = useState(false);
  const { errorToast } = useOverlay();

  const claimButton = isMember && (
    <Button rightIcon={<RiAddFill />}>Claim Party Favor</Button>
  );

  return (
    <MainViewLayout header='Party Favor' headerEl='Get paid' isDao>
      <Flex as={Stack} direction='column' spacing={4} w='10%'>
        {!loading ? claimButton : <Spinner size='xl' />}
      </Flex>
    </MainViewLayout>
  );
};

export default PartyFavor;
