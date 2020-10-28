import React from 'react';
import { Box } from '@chakra-ui/core';

import ProposalCard from './ProposalCard';

const ProposalsList = ({ proposals }) => {
  //! remove the slice and deal with pagination
  return (
    <>
      <Box w='60%'>
        {proposals.slice(0, 5).map((proposal) => {
          return <ProposalCard proposal={proposal} key={proposal.id} />;
        })}
      </Box>
    </>
  );
};

export default ProposalsList;
