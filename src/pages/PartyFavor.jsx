import React, { useState } from 'react';
import { Flex, Stack, Button, Spinner, Box } from '@chakra-ui/react';

import { useTX } from '../contexts/TXContext';
import MainViewLayout from '../components/mainViewLayout';
import { TX } from '../data/contractTX';

const PartyFavor = ({ isMember }) => {
  const { submitTransaction } = useTX();
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    setLoading(true);
    await submitTransaction({
      tx: TX.RAGE_QUIT_CLAIM,
    });
    setLoading(false);
  };

  const claimButton = isMember && <Button onClick={handleClaim}>Claim</Button>;

  return (
    <MainViewLayout header='Party Favor' headerEl='Get paid' isDao>
      <Box fontSize='5xl' fontFamily='heading'>
        GET YOUR FAVORS!
      </Box>
      <Flex as={Stack} direction='column' spacing={4} w='10%'>
        {!loading ? claimButton : <Spinner size='xl' />}
      </Flex>
    </MainViewLayout>
  );
};

export default PartyFavor;
