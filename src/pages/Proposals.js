import React, { useState, useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';

import ActivitiesFeed from '../components/activitiesFeed';
import ProposalCard from '../components/proposalCard';
import { getProposalsActivites } from '../utils/activities';
import Paginator from '../components/paginator';

const Proposals = React.memo(function Proposals({ proposals, activities }) {
  const [allProposals, setAllProposals] = useState(null);
  const [pagedProposals, setPagedProposals] = useState(null);

  useEffect(() => {
    if (proposals) {
      setAllProposals(proposals);
    }
  }, [proposals]);

  return (
    <Flex wrap='wrap'>
      <Box
        w={['100%', null, null, null, '60%']}
        pr={[0, null, null, null, 6]}
        pb={6}
      >
        {pagedProposals &&
          pagedProposals
            .slice(0, 5)
            .map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
        <Paginator
          perPage={3}
          setRecords={setPagedProposals}
          allRecords={allProposals}
        />
      </Box>

      <Box w={['100%', null, null, null, '40%']}>
        <ActivitiesFeed
          limit={5}
          activities={activities}
          hydrateFn={getProposalsActivites}
        />
      </Box>
    </Flex>
  );
});

export default Proposals;
