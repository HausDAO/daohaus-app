import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Flex, Box, Center, Button } from '@chakra-ui/react';

import { useDaoMember } from '../contexts/DaoMemberContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import ContentBox from '../components/ContentBox';
import { CardLabel, ParaMd, ParaSm } from '../components/typography';
import PropActions from './propActions';

import { CUSTOM_CARD_DATA } from '../data/proposalData';
import { getVoteData } from '../utils/proposalCard';
import {
  CustomTransfer,
  PropCardOffer,
  PropCardRequest,
} from './propBriefPrimitives';
import useMinionAction from '../hooks/useMinionAction';

const ProposalCardV2 = ({ proposal, interaction }) => {
  const { address } = useInjectedProvider();
  const { daoMember, isMember } = useDaoMember();
  const { minionAction, executeTX } = proposal?.minion
    ? useMinionAction(proposal)
    : {};

  const { canInteract } = interaction || {};

  const voteData = getVoteData(proposal, address, daoMember);

  return (
    <ContentBox p='0' mb={4} minHeight='8.875rem'>
      <Flex flexDir={['column', 'column', 'row']}>
        <PropCardBrief proposal={proposal} minionAction={minionAction} />
        <Center minHeight={['0', '0', '8.875rem']} />
        <Flex
          w={['100%', '100%', '45%']}
          mb={['4', '4', '0', '0']}
          mt={['4', '4', '0']}
        >
          <PropActions
            proposal={proposal}
            canInteract={canInteract}
            voteData={voteData}
            isMember={isMember}
            minionAction={minionAction}
            executeTX={executeTX}
          />
        </Flex>
        <Flex
          justifyContent='center'
          w='100%'
          display={['flex', 'flex', 'none']}
          mb='6'
        >
          <Button
            variant='outline'
            size='lg'
            width='10rem'
            mt={['4', '4', '0']}
          >
            More Details
          </Button>
        </Flex>
      </Flex>
    </ContentBox>
  );
};

const DetailsLink = ({ proposalId }) => {
  const { daochain, daoid } = useParams();
  return (
    <Box
      position='absolute'
      top='0.5rem'
      right='1rem'
      display={['none', 'none', 'block']}
    >
      <Link to={`/dao/${daochain}/${daoid}/proposals/${proposalId}`}>
        <ParaSm>More Details</ParaSm>
      </Link>
    </Box>
  );
};

const PropCardBrief = ({ proposal = {}, minionAction }) => {
  const isOffering = Number(proposal.tributeOffered) > 0;
  const isRequesting =
    Number(proposal.lootRequested) > 0 ||
    Number(proposal.sharesRequested) > 0 ||
    Number(proposal.paymentRequested) > 0;
  const { customTransferUI } = CUSTOM_CARD_DATA[proposal.proposalType] || {};

  return (
    <Flex
      width={['100%', '100%', '60%']}
      minHeight={['10rem', '10rem', '0']}
      justifyContent='space-between'
      borderRight={['none', 'none', '1px solid rgba(255,255,255,0.1)']}
      borderBottom={[
        '1px solid rgba(255,255,255,0.1)',
        '1px solid rgba(255,255,255,0.1)',
        'none',
        'none',
      ]}
      position='relative'
    >
      <Box px='1.2rem' py='0.6rem'>
        <CardLabel mb={['4', '4', '2']}>{proposal.proposalType}</CardLabel>
        <ParaMd
          fontWeight='700'
          mb={['5', '5', '3']}
          fontSize={['1.4rem', '1.4rem', '1rem']}
        >
          {proposal.title}
        </ParaMd>
        {isRequesting && <PropCardRequest proposal={proposal} />}
        {isOffering && <PropCardOffer proposal={proposal} />}
        {customTransferUI && (
          <CustomTransfer
            proposal={proposal}
            customTransferUI={customTransferUI}
            minionAction={minionAction}
          />
        )}
      </Box>
      <DetailsLink proposalId={proposal.proposalId} />
    </Flex>
  );
};

export default ProposalCardV2;
