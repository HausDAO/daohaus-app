import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Flex, Stack, Button, Spinner, Box, Icon } from '@chakra-ui/react';
import { GiPartyPopper } from 'react-icons/gi';

import { useTX } from '../contexts/TXContext';
import MainViewLayout from '../components/mainViewLayout';
import { TX } from '../data/contractTX';

const PartyFavor = ({ isMember }) => {
  const { daoid, daochain } = useParams();
  const { submitTransaction } = useTX();
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    setLoading(true);
    await submitTransaction({
      tx: TX.RAGE_QUIT_CLAIM,
      args: ['1', '0'],
    });
    setLoading(false);
  };

  const claimButton = isMember && (
    <Button onClick={handleClaim} size='lg'>
      Claim
    </Button>
  );

  return (
    <MainViewLayout header='Party Favor' isDao>
      <Flex direction='column' align='center'>
        <Icon as={GiPartyPopper} w={100} h={100} mb={10} />
        <Box fontSize='5xl' fontFamily='heading' mb={10}>
          GET YOUR FAVORS!
        </Box>
        <Flex as={Stack} direction='column' spacing={4} w='10%' mb={10}>
          {!loading ? claimButton : <Spinner size='xl' />}
        </Flex>
        <Box fontSize='xl'>
          And guess what? You&apos;re in a DAO now.{' '}
          <Link to={`/dao/${daochain}/${daoid}`}>Check it out.</Link>
        </Box>
      </Flex>
    </MainViewLayout>
  );
};

export default PartyFavor;
