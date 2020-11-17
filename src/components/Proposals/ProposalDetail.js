import React, { useState, useEffect } from 'react';
import { formatDistanceToNow, isBefore } from 'date-fns';
import { Flex, Box, Icon, Link, Skeleton } from '@chakra-ui/core';
import ContentBox from '../Shared/ContentBox';
import { RiExternalLinkLine } from 'react-icons/ri';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { utils } from 'web3';

import { useMembers, useMemberWallet } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import UserAvatar from '../../components/Shared/UserAvatar';
import { memberProfile } from '../../utils/helpers';
import { getProposalCountdownText } from '../../utils/proposal-helper';
import TextBox from '../Shared/TextBox';

const ProposalDetail = ({ proposal }) => {
  const [members] = useMembers();
  const [theme] = useTheme();
  const details = proposal?.details && JSON.parse(proposal?.details);
  const [memberWallet] = useMemberWallet();
  const [memberVote, setMemberVote] = useState();

  useEffect(() => {
    if (proposal?.votes && memberWallet && memberWallet?.activeMember) {
      setMemberVote(
        proposal.votes.find(
          (vote) =>
            vote.memberAddress === memberWallet.memberAddress.toLowerCase(),
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberWallet, proposal]);

  return (
    <ContentBox m={6}>
      <Flex>
        <Box w='90%'>
          <TextBox>
            {proposal ? proposal.proposalType : theme.daoMeta.proposal}
          </TextBox>
          <Skeleton isLoaded={details?.title}>
            <TextBox fontSize='3xl' variant='value'>
              {details?.title ? details?.title : '-'}
            </TextBox>
          </Skeleton>
          <Skeleton isLoaded={details?.description}>
            <Box w='100%' mt={8}>
              {details?.description}
            </Box>
          </Skeleton>
          <Flex w='100%' justify='space-between' mt={6}>
            {(proposal?.tributeOffered > 0 || !proposal?.tributeOffered) && (
              <Box>
                <TextBox>Tribute</TextBox>
                <Skeleton isLoaded={proposal?.tributeOffered}>
                  <TextBox fontSize='lg' variant='value'>
                    {proposal?.tributeOffered
                      ? `${utils.fromWei(
                          proposal.tributeOffered.toString(),
                        )} ${proposal.tributeTokenSymbol || 'WETH'}`
                      : '--'}
                  </TextBox>
                </Skeleton>
              </Box>
            )}
            {proposal?.paymentRequested > 0 && ( // don't show during loading
              <Box>
                <TextBox>Payment Requested</TextBox>
                <Skeleton isLoaded={proposal?.paymentRequested}>
                  <TextBox fontSize='lg' variant='value'>
                    {proposal?.paymentRequested
                      ? `${utils.fromWei(
                          proposal.paymentRequested.toString(),
                        )} ${proposal.paymentTokenSymbol || 'WETH'}`
                      : '--'}
                  </TextBox>
                </Skeleton>
              </Box>
            )}
            {(proposal?.sharesRequested > 0 || !proposal?.sharesRequested) && (
              <Box>
                <TextBox>Shares</TextBox>
                <Skeleton isLoaded={proposal?.sharesRequested}>
                  <TextBox fontSize='lg' variant='value'>
                    {proposal?.sharesRequested
                      ? proposal.sharesRequested
                      : '--'}
                  </TextBox>
                </Skeleton>
              </Box>
            )}
            {proposal?.lootRequested > 0 && ( // don't show during loading
              <Box>
                <TextBox>Loot</TextBox>
                <Skeleton isLoaded={proposal?.lootRequested}>
                  <TextBox size='lg' variant='value'>
                    {proposal?.lootRequested ? proposal.lootRequested : '--'}
                  </TextBox>
                </Skeleton>
              </Box>
            )}
            <Box>
              {proposal?.proposalIndex ? (
                <>
                  <TextBox>
                    {isBefore(
                      Date.now(),
                      new Date(+proposal?.votingPeriodEnds * 1000),
                    )
                      ? 'Voting Period Ends'
                      : 'Voting Ended'}
                  </TextBox>
                  <TextBox fontSize='lg' variant='value'>
                    {formatDistanceToNow(
                      new Date(+proposal?.votingPeriodEnds * 1000),
                      {
                        addSuffix: true,
                      },
                    )}
                  </TextBox>
                </>
              ) : (
                <>
                  <TextBox>Proposal Status</TextBox>
                  <Skeleton isLoaded={proposal?.status}>
                    <TextBox fontSize='lg' variant='value'>
                      {proposal?.status
                        ? getProposalCountdownText(proposal)
                        : '--'}
                    </TextBox>
                  </Skeleton>
                </>
              )}
            </Box>
          </Flex>
          <Box mt={6}>
            <TextBox>Link</TextBox>
            <Skeleton isLoaded={details?.link}>
              <Link href={details?.link} target='_blank'>
                {details?.link ? details.link : '-'}{' '}
                <Icon as={RiExternalLinkLine} color='primary.50' />
              </Link>
            </Skeleton>
          </Box>
        </Box>
        <Flex>
          {memberVote &&
            (+memberVote.uintVote === 1 ? (
              <Flex
                pl={6}
                w='40px'
                borderColor='secondary.500'
                borderWidth='2px'
                borderStyle='solid'
                borderRadius='40px'
                p={1}
                h='40px'
                justify='center'
                align='center'
                m='0 auto'
              >
                <Icon as={FaThumbsUp} color='secondary.500' />
              </Flex>
            ) : (
              <Flex
                pl={6}
                w='40px'
                borderColor='secondary.500'
                borderWidth='2px'
                borderStyle='solid'
                borderRadius='40px'
                p={1}
                h='40px'
                justify='center'
                align='center'
                m='0 auto'
              >
                <Icon as={FaThumbsDown} color='secondary.500' />
              </Flex>
            ))}
        </Flex>
      </Flex>
      <Skeleton isLoaded={details?.description}>
        <TextBox w='100%' mt={8} variant='value'>
          {details?.description}
        </TextBox>
      </Skeleton>

      <Flex w='80%' mt={6} justify='space-between'>
        <Box mr={5}>
          <TextBox>Submitted By</TextBox>
          <Skeleton isLoaded={members && proposal?.proposer}>
            {members && proposal?.proposer ? (
              <UserAvatar
                user={memberProfile(members, proposal?.proposer).profile}
              />
            ) : (
              '--'
            )}
          </Skeleton>
        </Box>
        <Box>
          <TextBox>Recipient</TextBox>
          <Skeleton isLoaded={members && proposal?.applicant}>
            {members && proposal?.applicant ? (
              <UserAvatar
                user={memberProfile(members, proposal?.applicant).profile}
              />
            ) : (
              '--'
            )}
          </Skeleton>
        </Box>
      </Flex>
    </ContentBox>
  );
};

export default ProposalDetail;
