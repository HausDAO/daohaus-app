import { Box } from '@chakra-ui/react';
import React from 'react';
import PageHeader from './pageHeader';

const MainViewLayout = ({
  children,
  header,
  headerEl,
  customTerms,
  isDao,
  isDaosquare,
}) => {
  return (
    <>
      <PageHeader
        isDao={isDao}
        isDaosquare={isDaosquare}
        header={header}
        headerEl={headerEl}
        customTerms={customTerms}
      />
      <Box p={6}>{children}</Box>
    </>
  );
};

export default MainViewLayout;
