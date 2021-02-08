import React from 'react';
import { Box, Flex } from '@chakra-ui/react';

import ActivitiesFeed from '../components/activitiesFeed';
import { getProposalsActivites } from '../utils/activities';
import ProposalsList from '../components/proposalList';
import MainViewLayout from '../components/mainViewLayout';

const Proposals = React.memo(function Proposals({
  proposals,
  activities,
  customTerms,
}) {
  return (
    <MainViewLayout header='Proposals' customTerms={customTerms} isDao={true}>
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
    </MainViewLayout>
  );
});

export default Proposals;
