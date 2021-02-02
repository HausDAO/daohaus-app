import React from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Box } from '@chakra-ui/react';
import ActivitiesFeed from '../components/activitiesFeed';
import { getProposalHistories } from '../utils/activities';
import TextBox from '../components/TextBox';
import ProposalDetails from '../components/proposalDetails';
import ProposalActions from '../components/proposalActions';

const Proposal = ({ activities }) => {
  const { propid } = useParams();
  const currentProposal = activities
    ? activities?.proposals?.find((proposal) => proposal.proposalId === propid)
    : null;

  return (
    <Box>
      <Flex wrap='wrap'>
        <Flex
          direction='column'
          w={['100%', null, null, null, '60%']}
          pr={[0, null, null, null, 6]}
        >
          <ProposalDetails proposal={currentProposal} />
        </Flex>
        <Flex
          direction='column'
          w={['100%', null, null, null, '40%']}
          pt={[6, 0]}
        >
          <Box>
            {!currentProposal?.cancelled && (
              <TextBox size='md'>Actions</TextBox>
            )}
          </Box>
          <Box pt={6}>
            {!currentProposal?.cancelled && (
              <ProposalActions proposal={currentProposal} />
            )}
            <ActivitiesFeed
              limit={6}
              activities={currentProposal}
              hydrateFn={getProposalHistories}
            />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Proposal;
