import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Button } from '@chakra-ui/react';

import ContentBox from './ContentBox';

const CcoBanner = () => {
  const { daochain, daoid } = useParams();
  return (
    <ContentBox mt={2} w='100%'>
      <Box fontSize='2xl' fontWeight={700} fontFamily='heading'>
        CCO TIME!! Come on let&apos;s do it!
      </Box>
      <Box mt={6}> FEELING $HAUS $HAUS $HAUS</Box>
      <Box mt={6}> EE-Yessa EYEYEYEYEYEYE!!!!</Box>

      <Button
        as={Link}
        variant='outline'
        mr={6}
        to={`/dao/${daochain}/${daoid}/cco`}
        value='staking'
        mt={6}
      >
        Contribute
      </Button>
    </ContentBox>
  );
};

export default CcoBanner;
