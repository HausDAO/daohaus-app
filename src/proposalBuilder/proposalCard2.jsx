import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Flex, Box, Divider, Center } from '@chakra-ui/react';

import { useDaoMember } from '../contexts/DaoMemberContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import ContentBox from '../components/ContentBox';
import { CardLabel, ParaMd, ParaSm } from '../components/typography';
import PropActions from './propActions';

import { CUSTOM_DISPLAY } from '../data/proposalData';
import { getVoteData } from '../utils/proposalCard';
import {
  CustomTransfer,
  PropCardOffer,
  PropCardRequest,
} from './propBriefPrimitives';

const ProposalCardV2 = ({ proposal, interaction }) => {
  const { address } = useInjectedProvider();
  const { daoMember, isMember } = useDaoMember();
  const { canInteract } = interaction || {};

  const voteData = useMemo(() => {
    return getVoteData(proposal, address, daoMember);
  }, [daoMember, address, proposal?.status]);

  return (
    <ContentBox p='0' mb={4} minHeight='8.875rem'>
      <Flex>
        <PropCardBrief proposal={proposal} />
        <Center height='100%' minHeight='8.875rem'>
          <Divider orientation='vertical' colorScheme='blackAplha.900' />
        </Center>
        <Flex w='45%'>
          <PropActions
            proposal={proposal}
            canInteract={canInteract}
            voteData={voteData}
            isMember={isMember}
          />
        </Flex>
      </Flex>
    </ContentBox>
  );
};

const DetailsLink = ({ proposalId }) => {
  const { daochain, daoid } = useParams();
  return (
    <Box position='absolute' top='0.5rem' right='1rem'>
      <Link to={`/dao/${daochain}/${daoid}/proposals/${proposalId}`}>
        <ParaSm>More Details</ParaSm>
      </Link>
    </Box>
  );
};

const PropCardBrief = ({ proposal = {} }) => {
  const isOffering = Number(proposal.tributeOffered) > 0;
  const isRequesting =
    Number(proposal.lootRequested) > 0 ||
    Number(proposal.sharesRequested) > 0 ||
    Number(proposal.paymentRequested) > 0;
  const { customTransferUI } = CUSTOM_DISPLAY[proposal.proposalType] || {};

  return (
    <Flex
      width='60%'
      justifyContent='space-between'
      borderRight='1px solid rgba(255,255,255,0.1)'
      position='relative'
    >
      <Box px='1.2rem' py='0.6rem'>
        <CardLabel mb={2}>{proposal.proposalType}</CardLabel>
        <ParaMd fontWeight='700' mb={3}>
          {proposal.title}
        </ParaMd>
        {isRequesting && <PropCardRequest proposal={proposal} />}
        {isOffering && <PropCardOffer proposal={proposal} />}
        {customTransferUI && (
          <CustomTransfer
            proposal={proposal}
            customTransferUI={customTransferUI}
          />
        )}
      </Box>
      <DetailsLink proposalId={proposal.proposalId} />
    </Flex>
  );
};

export default ProposalCardV2;
