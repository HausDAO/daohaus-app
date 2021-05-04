import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Flex, Box, Stack, Link, Icon, IconButton } from '@chakra-ui/react';
import { RiArrowLeftLine, RiRefreshLine } from 'react-icons/ri';

import ActivitiesFeed from '../components/activitiesFeed';

import { getProposalHistories } from '../utils/activities';
import TextBox from '../components/TextBox';
import ProposalDetails from '../components/proposalDetails';
import ProposalActions from '../components/proposalActions';
import { getTerm } from '../utils/metadata';
import MainViewLayout from '../components/mainViewLayout';
import { useTX } from '../contexts/TXContext';

const Proposal = ({
  activities,
  overview,
  daoProposals,
  daoMember,
  customTerms,
  delegate,
}) => {
  const { propid, daochain, daoid } = useParams();
  const { refreshDao } = useTX();

  const currentProposal = activities
    ? activities?.proposals?.find(proposal => proposal.proposalId === propid)
    : null;
  // console.log(currentProposal);

  const testRefreshDao = () => {
    refreshDao();
  };

  return (
    <MainViewLayout header='Proposal' customTerms={customTerms} isDao>
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
                  {`All ${getTerm(customTerms, 'proposals')}`}
                </TextBox>
              </Flex>
            </Link>
            <ProposalDetails
              proposal={currentProposal}
              daoMember={daoMember}
              overview={overview}
            />
          </Flex>
          <Flex
            direction='column'
            w={['100%', null, null, null, '40%']}
            pt={[6, 0]}
          >
            <Flex justifyContent='space-between'>
              {!currentProposal?.cancelled && (
                <TextBox size='md'>Actions</TextBox>
              )}

              <IconButton
                icon={<RiRefreshLine size='1.5rem' />}
                p={0}
                size='sm'
                variant='outline'
                onClick={testRefreshDao}
              />
            </Flex>
            <Stack pt={6} spacing={6}>
              {!currentProposal?.cancelled && (
                <ProposalActions
                  proposal={currentProposal}
                  overview={overview}
                  daoMember={daoMember}
                  delegate={delegate}
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
