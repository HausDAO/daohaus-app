import React from 'react';
import { Box } from '@chakra-ui/react';

import PageHeader from './pageHeader';

const MainViewLayout = ({ children, header, headerEl, customTerms, isDao }) => {
  return (
    <>
      <PageHeader
        isDao={isDao}
        header={header}
        headerEl={headerEl}
        customTerms={customTerms}
      />
      <Box p={6}>{children}</Box>
    </>
  );
};

export default MainViewLayout;
