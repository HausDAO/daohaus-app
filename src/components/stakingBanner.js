import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Button } from '@chakra-ui/react';

import ContentBox from './ContentBox';

const StakingBanner = () => {
  const { daochain, daoid } = useParams();
  return (
    <ContentBox mt={2} w='100%'>
      <Box fontSize='2xl' fontWeight={700} fontFamily='heading'>
        Stake into UberHaus
      </Box>
      <Box mt={6}>Stake $HAUS, Earn $HAUS</Box>
      <Button
        as={Link}
        variant='outline'
        mr={6}
        to={`/dao/${daochain}/${daoid}/staking`}
        value='staking'
        mt={6}
      >
        View Staking
      </Button>
    </ContentBox>
  );
};

export default StakingBanner;
