import React from 'react';
import { Box, Flex } from '@chakra-ui/react';

import ActivitiesFeed from '../components/activitiesFeed';
import { getProposalsActivites } from '../utils/activities';
import ProposalsList from '../components/proposalList';

const Proposals = React.memo(function Proposals({ proposals, activities }) {
  return (
    <Flex wrap='wrap'>
      <Box
        w={['100%', null, null, null, '60%']}
        pr={[0, null, null, null, 6]}
        pb={6}
      >
        <ProposalsList proposals={proposals} />
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
