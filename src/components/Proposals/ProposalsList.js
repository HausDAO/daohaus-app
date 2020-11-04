import React, { useEffect, useState } from 'react';
import { Box, Text, Flex } from '@chakra-ui/core';

import { useTheme } from '../../contexts/PokemolContext';
import ProposalCard from './ProposalCard';
import { defaultProposals } from '../../utils/constants';
import ProposalFilter from './ProposalFilter';
import ProposalSort from './ProposalSort';

const ProposalsList = ({ proposals }) => {
  const [theme] = useTheme();
  const [_proposals, setProposals] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (proposals.length > 0) {
      setProposals(proposals);
      setIsLoaded(true);
    } else {
      setProposals(defaultProposals);
    }
  }, [proposals]);
  //! remove the slice and deal with pagination

  // sort+filter here?

  return (
    <>
      <Box w='60%'>
        <Flex>
          <ProposalFilter setFilteredProposals={setProposals} />
          <ProposalSort setSortedProposals={setProposals} />
        </Flex>
        {_proposals &&
          _proposals.slice(0, 5).map((proposal) => {
            return (
              <ProposalCard
                proposal={proposal}
                key={proposal.id}
                isLoaded={isLoaded}
              />
            );
          })}
      </Box>
    </>
  );
};

export default ProposalsList;
