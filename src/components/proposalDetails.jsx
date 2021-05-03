import React, { useState, useEffect, useMemo } from 'react';

import { useParams } from 'react-router-dom';
import { Flex, Box, Skeleton, Badge, Text, Spinner } from '@chakra-ui/react';
import { AddressZero } from '@ethersproject/constants';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useMetaData } from '../contexts/MetaDataContext';
import { useDao } from '../contexts/DaoContext';
import TextBox from './TextBox';
import ContentBox from './ContentBox';
import ProposalMinionCard from './proposalMinionCard';
import Vote from './voteIcon';
import MediaBox from './mediaBox';
import TextIndicator from './textIndicator';
import MemberIndicator from './memberIndicator';
import UberDaoInfo from './uberDaoInfo';

import { generateSFLabels, TIP_LABELS } from '../utils/toolTipLabels';
import {
  determineProposalStatus,
  getProposalCountdownText,
  getProposalDetailStatus,
  memberVote,
  MINION_TYPES,
} from '../utils/proposalUtils';
import { getCustomProposalTerm } from '../utils/metadata';
import { UBERHAUS_DATA } from '../utils/uberhaus';
import { handleDecimals } from '../utils/general';
import UberHausDelegate from './uberhausDelegate';
import DiscourseProposalTopic from './discourseProposalTopic';

const UBER_LINK =
  '/dao/0x2a/0x96714523778e51b898b072089e5615d4db71078e/proposals';

const urlify = text => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, url => {
    return `<a rel="noopener noreferrer" target="_blank" href="${url}"> link </a>`;
  });
};

const ProposalDetails = ({ proposal, daoMember }) => {
  const { address } = useInjectedProvider();
  const { customTerms } = useMetaData();
  const { isUberHaus, daoOverview } = useDao();
  const [status, setStatus] = useState(null);
  const { daoid } = useParams();
  console.log(proposal);

  useEffect(() => {
    if (proposal) {
      const statusStr = determineProposalStatus(proposal);
      setStatus(statusStr);
    }
  }, [proposal]);

  const handleRecipient = () => {
    if (daoid === UBERHAUS_DATA.ADDRESS && isUberHaus) {
      return <UberDaoInfo proposal={proposal} />;
    }
    if (proposal?.minion) {
      return <MinionBox proposal={proposal} daoOverview={daoOverview} />;
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
              <ProposalMinionCard proposal={proposal} />
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
          <Box mt={proposal?.link || proposal?.minionAddress ? 6 : 2}>
            {proposal?.link && <MediaBox link={proposal.link} />}
          </Box>
          <DiscourseProposalTopic proposal={proposal} daoMember={daoMember} />
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
            address={proposal?.proposer}
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
        {proposal?.minion?.minionType === MINION_TYPES.UBER && (
          <UberHausDelegate proposal={proposal} />
        )}
      </ContentBox>
    </Box>
  );
};

export default ProposalDetails;

const MinionBox = ({ proposal, daoOverview }) => {
  const { daoid, daochain } = useParams();

  const minionName = useMemo(() => {
    if (daoOverview && proposal) {
      return daoOverview.minions.find(minion => {
        return minion.minionAddress === proposal.minionAddress;
      })?.details;
    }
  }, [daoOverview, proposal]);

  if (!daoOverview || !proposal) {
    return <Spinner />;
  }

  const { minionType } = proposal.minion;
  if (minionType === MINION_TYPES.UBER) {
    return (
      <MemberIndicator
        address={proposal?.minionAddress}
        label='uberhaus minion'
        tooltip
        tooltipText={TIP_LABELS.UBER_PROPOSAL}
        link={UBER_LINK}
        shouldFetchProfile={false}
        name={minionName}
      />
    );
  }
  if (minionType === MINION_TYPES.VANILLA) {
    return (
      <MemberIndicator
        address={proposal?.minionAddress}
        label='minion'
        tooltip
        tooltipText={TIP_LABELS.MINION_PROPOSAL}
        link='/'
        shouldFetchProfile={false}
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
        shouldFetchProfile={false}
        name={minionName}
      />
    );
  }

  return null;
};
