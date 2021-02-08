import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Flex, Box, Stack, Link, Icon } from '@chakra-ui/react';
import { RiArrowLeftLine } from 'react-icons/ri';

import ActivitiesFeed from '../components/activitiesFeed';
import { getProposalHistories } from '../utils/activities';
import TextBox from '../components/TextBox';
import ProposalDetails from '../components/proposalDetails';
import ProposalActions from '../components/proposalActions';
import { getCopy } from '../utils/metadata';

const Proposal = ({
  activities,
  overview,
  daoProposals,
  daoMember,
  customTerms,
}) => {
  const { propid, daochain, daoid } = useParams();
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
          <Link as={RouterLink} to={`/dao/${daochain}/${daoid}/proposals`}>
            <TextBox size='md'>
              <Icon
                name='arrow-back'
                color='primary.50'
                as={RiArrowLeftLine}
                h='20px'
                w='20px'
              />{' '}
              All {getCopy(customTerms, 'proposals')}
            </TextBox>
          </Link>
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
          <Stack pt={6} spacing={6}>
            {!currentProposal?.cancelled && (
              <ProposalActions
                proposal={currentProposal}
                overview={overview}
                daoMember={daoMember}
                daoProposals={daoProposals}
              />
            )}
            <ActivitiesFeed
              limit={6}
              activities={currentProposal}
              hydrateFn={getProposalHistories}
              isLink={false}
            />
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Proposal;
