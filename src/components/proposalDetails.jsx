import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Box, Skeleton, Badge, Text, Spinner } from '@chakra-ui/react';
import { AddressZero } from '@ethersproject/constants';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useMetaData } from '../contexts/MetaDataContext';
import { useDao } from '../contexts/DaoContext';
import ContentBox from './ContentBox';
import DiscourseProposalTopic from './discourseProposalTopic';
import MediaBox from './mediaBox';
import MemberIndicator from './memberIndicator';
import ProposalMinionCard from './proposalMinionCard';
import ProposalDocLocationCard from './proposalDocLocationCard';
import TextBox from './TextBox';
import TextIndicator from './textIndicator';
import TokenDisplay from './tokenDisplay';
import Vote from './voteIcon';
import {
  determineProposalStatus,
  getProposalCountdownText,
  getProposalDetailStatus,
  memberVote,
  MINION_TYPES,
  PROPOSAL_TYPES,
} from '../utils/proposalUtils';
import { getCustomProposalTerm } from '../utils/metadata';
import { generateSFLabels, TIP_LABELS } from '../utils/toolTipLabels';
import { handleDecimals } from '../utils/general';

const urlify = text => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, url => {
    return `<a rel="noopener noreferrer" target="_blank" href="${url}"> link </a>`;
  });
};

const ProposalDetails = ({
  proposal,
  hideMinionExecuteButton,
  minionAction,
}) => {
  const { address } = useInjectedProvider();
  const { customTerms } = useMetaData();
  const { daoOverview } = useDao();
  const [status, setStatus] = useState(null);
  useEffect(() => {
    if (proposal) {
      const statusStr = determineProposalStatus(proposal);
      setStatus(statusStr);
    }
  }, [proposal]);

  const handleRecipient = () => {
    if (proposal?.minion) {
      return (
        <MinionBox
          daoOverview={daoOverview}
          hideMinionExecuteButton={hideMinionExecuteButton}
          proposal={proposal}
        />
      );
    }
    return (
      <MemberIndicator
        address={
          proposal?.applicant === AddressZero
            ? proposal?.proposer
            : proposal?.applicant
        }
        label='recipient'
        shouldFetchProfile
      />
    );
  };

  return (
    <Box pt={6}>
      <ContentBox>
        <Box>
          <Box>
            <Flex justify='space-between' wrap={['wrap', null, null, 'nowrap']}>
              <TextBox size='xs' mb={[3, null, null, 0]}>
                {getCustomProposalTerm(customTerms, proposal?.proposalType)}
              </TextBox>
              <Box fontSize={['sm', null, null, 'md']}>
                {proposal?.proposalIndex ? (
                  <>{status && getProposalDetailStatus(proposal, status)}</>
                ) : (
                  <Skeleton isLoaded={status}>
                    <Badge>
                      {status && getProposalCountdownText(proposal, status)}
                    </Badge>
                  </Skeleton>
                )}
              </Box>
            </Flex>
            <Skeleton isLoaded={proposal?.title}>
              {proposal?.title && <Text fontSize='3xl'>{proposal?.title}</Text>}
            </Skeleton>
          </Box>
          {proposal?.minionAddress ? (
            <>
              <Box w='100%'>{proposal?.description}</Box>
              <ProposalMinionCard
                proposal={proposal}
                minionAction={minionAction}
              />
            </>
          ) : (
            <Skeleton isLoaded={proposal?.description}>
              {proposal?.description &&
                (proposal?.description.indexOf('http') > -1 ? (
                  <Box
                    w='100%'
                    dangerouslySetInnerHTML={{
                      __html: urlify(proposal?.description),
                    }}
                  />
                ) : (
                  <Box w='100%'>{proposal?.description}</Box>
                ))}
            </Skeleton>
          )}
          {proposal?.proposalType === 'change location of DAO DOC' ? (
            <>
              <Box w='100%'>{proposal?.description}</Box>
              <ProposalDocLocationCard proposal={proposal} />
            </>
          ) : (
            ''
          )}
          {proposal?.proposalType === PROPOSAL_TYPES.WHITELIST && (
            <TokenDisplay tokenAddress={proposal.tributeToken} />
          )}
          {proposal?.escrow?.tokenAddresses?.length > 0 && (
            <Flex w='100%' justify='space-between' mt={6} wrap='wrap'>
              <Box mb={3}>
                <TextBox size='xs' mb={2}>
                  Token Offered
                </TextBox>
                <TextBox size='xs'>
                  Type:{' '}
                  {proposal.escrow.tokenTypes[0] === '1' ? 'ERC721' : 'ERC1155'}
                </TextBox>
                <TextBox size='xs'>
                  Address: {proposal.escrow.tokenAddresses[0]}
                </TextBox>
                <TextBox size='xs'>ID: {proposal.escrow.tokenIds[0]} </TextBox>
                <TextBox size='xs'>
                  Amount: {1 || proposal.escrow.amounts[0]}
                </TextBox>
              </Box>
            </Flex>
          )}
          <Box mt={proposal?.link || proposal?.minionAddress ? 6 : 2}>
            {proposal?.link && <MediaBox link={proposal.link} />}
          </Box>
          <DiscourseProposalTopic proposal={proposal} />
        </Box>
        <Flex w='100%' justify='space-between' mt={6} wrap='wrap'>
          {(proposal?.tributeOffered > 0 || !proposal?.tributeOffered) && (
            <TextIndicator
              label={
                proposal?.proposalType === 'Transmutation Proposal'
                  ? 'Transmuting'
                  : 'Tribute offered'
              }
              comma
              value={handleDecimals(
                proposal?.tributeOffered,
                proposal?.tributeTokenDecimals,
              )}
              append={proposal?.tributeTokenSymbol || 'WETH'}
            />
          )}
          {proposal?.paymentRequested > 0 && ( // don't show during loading
            <TextIndicator
              label='Payment Requested'
              comma
              value={handleDecimals(
                proposal?.paymentRequested,
                proposal?.paymentTokenDecimals,
              )}
              append={proposal?.paymentTokenSymbol || 'WETH'}
            />
          )}
          {(proposal?.sharesRequested > 0 || !proposal?.sharesRequested) && (
            <TextIndicator
              label='shares requested'
              comma
              value={proposal?.sharesRequested}
            />
          )}
          {proposal?.lootRequested > 0 && ( // don't show during loading
            <TextIndicator
              label='loot requested'
              comma
              value={proposal?.lootRequested}
            />
          )}
        </Flex>
        <Flex
          mt={3}
          mb={6}
          justify='space-between'
          direction={['column', 'row']}
          pr={memberVote(proposal, address) !== null && '5%'}
          w='100%'
        >
          <MemberIndicator
            address={proposal?.createdBy}
            label='submitted by'
            shouldFetchProfile
          />
          {handleRecipient()}
          <Flex align='center'>
            {memberVote(proposal, address) !== null &&
              (+memberVote(proposal, address) === 1 ? (
                <Vote thumbsUp />
              ) : (
                <Vote thumbsDown />
              ))}
          </Flex>
        </Flex>
      </ContentBox>
    </Box>
  );
};

export default ProposalDetails;

const MinionBox = ({ proposal, daoOverview, hideMinionExecuteButton }) => {
  const { daoid, daochain } = useParams();

  const minion = useMemo(() => {
    if (daoOverview && proposal) {
      return daoOverview.minions.find(minion => {
        return minion.minionAddress === proposal.minionAddress;
      });
    }
  }, [daoOverview, proposal]);

  const minionName = minion?.details;

  if (!daoOverview || !proposal) {
    return <Spinner />;
  }

  const { minionType } = proposal.minion;

  // handles case of a funding proposal sending funds to a minion address
  if (
    [MINION_TYPES.VANILLA, MINION_TYPES.NIFTY, MINION_TYPES.SAFE].includes(
      minionType,
    ) &&
    hideMinionExecuteButton === true
  ) {
    return (
      <MemberIndicator
        address={proposal?.minionAddress}
        label={`${minion?.crossChainMinion ? 'cross-chain ' : ''}minion`}
        tooltip
        tooltipText={
          proposal.proposalType === PROPOSAL_TYPES.MINION_SUPERFLUID
            ? generateSFLabels(proposal)
            : TIP_LABELS.FUNDING_MINION_PROPOSAL
        }
        link={`/dao/${daochain}/${daoid}/vaults/minion/${proposal.minionAddress}`}
        shouldFetchProfile
        name={minionName}
      />
    );
  }
  if (
    [MINION_TYPES.VANILLA, MINION_TYPES.NIFTY, MINION_TYPES.SAFE].includes(
      minionType,
    )
  ) {
    return (
      <MemberIndicator
        address={proposal?.minionAddress}
        label={`${minion?.crossChainMinion ? 'cross-chain ' : ''}minion`}
        tooltip
        tooltipText={
          proposal.proposalType === PROPOSAL_TYPES.MINION_SUPERFLUID
            ? generateSFLabels(proposal)
            : TIP_LABELS.MINION_PROPOSAL
        }
        link={`/dao/${daochain}/${daoid}/vaults/minion/${proposal.minionAddress}`}
        shouldFetchProfile
        name={minionName}
      />
    );
  }
  if (minionType === MINION_TYPES.SUPERFLUID) {
    return (
      <MemberIndicator
        address={proposal?.minionAddress}
        label='superfluid minion'
        tooltip
        tooltipText={generateSFLabels(proposal)}
        link={`/dao/${daochain}/${daoid}/settings/superfluid-minion/${proposal.minionAddress}`}
        shouldFetchProfile
        name={minionName}
      />
    );
  }

  return null;
};
