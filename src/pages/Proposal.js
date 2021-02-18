import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Flex, Box, Stack, Link, Icon } from '@chakra-ui/react';
import { RiArrowLeftLine } from 'react-icons/ri';

import ActivitiesFeed from '../components/activitiesFeed';
import { getProposalHistories } from '../utils/activities';
import TextBox from '../components/TextBox';
import ProposalDetails from '../components/proposalDetails';
import ProposalActions from '../components/proposalActions';
import { getTerm } from '../utils/metadata';
import MainViewLayout from '../components/mainViewLayout';

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
    <MainViewLayout header='Proposal' isDao={true} customTerms={customTerms}>
      <Box>
        <Flex wrap='wrap'>
          <Flex
            direction='column'
            w={['100%', null, null, null, '60%']}
            pr={[0, null, null, null, 6]}
          >
            <Link as={RouterLink} to={`/dao/${daochain}/${daoid}/proposals`}>
              <Flex align='center'>
                <Icon
                  name='arrow-back'
                  color='primary.50'
                  as={RiArrowLeftLine}
                  h='20px'
                  w='20px'
                  mr={2}
                />
                <TextBox size={['sm', null, null, 'md']}>
                  All {getTerm(customTerms, 'proposals')}
                </TextBox>
              </Flex>
            </Link>
            <ProposalDetails proposal={currentProposal} daoMember={daoMember} />
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
    </MainViewLayout>
  );
};

export default Proposal;
