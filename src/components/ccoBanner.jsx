import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Button } from '@chakra-ui/react';

import ContentBox from './ContentBox';
import { useCustomTheme } from '../contexts/CustomThemeContext';

const CcoBanner = () => {
  const { daochain, daoid } = useParams();
  const { theme } = useCustomTheme();
  return (
    <ContentBox
      mt={6}
      w='100%'
      style={{ background: theme.colors.secondary[500] }}
    >
      <Box fontSize='lg' fontWeight={700} fontFamily='heading'>
        There is a Community Contribution Opportunity ongoing
      </Box>

      <Button
        as={Link}
        variant='primary'
        mr={6}
        to={`/dao/${daochain}/${daoid}/cco`}
        value='staking'
        mt={6}
      >
        {'Go to CCO ->'}
      </Button>
    </ContentBox>
  );
};

export default CcoBanner;
