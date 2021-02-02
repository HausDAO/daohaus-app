import React from 'react';
import { Box, Flex } from '@chakra-ui/react';

import ActivitiesFeed from '../components/activitiesFeed';
import ProposalCard from '../components/proposalCard';
import { getProposalsActivites } from '../utils/activities';

const Proposals = React.memo(function Proposals({ proposals, activities }) {
  return (
    <Flex wrap='wrap'>
      <Box
        w={['100%', null, null, null, '60%']}
        pr={[0, null, null, null, 6]}
        pb={6}
      >
        {proposals &&
          proposals
            .slice(0, 5)
            .map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
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
