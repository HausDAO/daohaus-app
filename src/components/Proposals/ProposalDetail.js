import React from 'react';
import { formatDistanceToNow, isBefore } from 'date-fns';
import { Flex, Box, Text, Icon, Link, Skeleton } from '@chakra-ui/core';
import { RiExternalLinkLine } from 'react-icons/ri';
import { FaThumbsUp } from 'react-icons/fa';
import { utils } from 'web3';

import { useTheme, useMembers } from '../../contexts/PokemolContext';
import UserAvatar from '../../components/Shared/UserAvatar';
import { memberProfile } from '../../utils/helpers';
import { getProposalCountdownText } from '../../utils/proposal-helper';

const ProposalDetail = ({ proposal }) => {
  const [members] = useMembers();
  const [theme] = useTheme();
  const details = proposal?.details && JSON.parse(proposal?.details);
  const votePeriodEnds = new Date(+proposal?.votingPeriodEnds * 1000);
  return (
    <Box
      rounded='lg'
      bg='blackAlpha.600'
      borderWidth='1px'
      borderColor='whiteAlpha.200'
      p={6}
      m={6}
    >
      <Flex>
        <Box w='90%'>
          <Text
            textTransform='uppercase'
            fontSize='sm'
            fontFamily={theme.fonts.heading}
            fontWeight={700}
          >
            {proposal ? proposal.proposalType : theme.daoMeta.proposal}
          </Text>
          <Skeleton isLoaded={details?.title}>
            <Text
              fontSize='3xl'
              fontFamily={theme.fonts.heading}
              fontWeight={700}
            >
              {details?.title ? details?.title : '-'}
            </Text>
          </Skeleton>
          <Flex w='100%' justify='space-between' mt={6}>
            {(proposal?.tributeOffered > 0 || !proposal?.tributeOffered) && (
              <Box>
                <Text
                  textTransform='uppercase'
                  fontSize='sm'
                  fontFamily={theme.fonts.heading}
                  fontWeight={700}
                >
                  Tribute
                </Text>
                <Skeleton isLoaded={proposal?.tributeOffered}>
                  <Text
                    fontSize='lg'
                    fontFamily={theme.fonts.space}
                    fontWeight={700}
                  >
                    {proposal?.tributeOffered
                      ? `${utils.fromWei(
                          proposal.tributeOffered.toString(),
                        )} ${proposal.tributeTokenSymbol || 'WETH'}`
                      : '--'}
                  </Text>
                </Skeleton>
              </Box>
            )}
            {proposal?.paymentRequested > 0 && ( // don't show during loading
              <Box>
                <Text
                  textTransform='uppercase'
                  fontSize='sm'
                  fontFamily={theme.fonts.heading}
                  fontWeight={700}
                >
                  Payment Requested
                </Text>
                <Skeleton isLoaded={proposal?.paymentRequested}>
                  <Text
                    fontSize='lg'
                    fontFamily={theme.fonts.space}
                    fontWeight={700}
                  >
                    {proposal?.paymentRequested
                      ? `${utils.fromWei(
                          proposal.paymentRequested.toString(),
                        )} ${proposal.paymentTokenSymbol || 'WETH'}`
                      : '--'}
                  </Text>
                </Skeleton>
              </Box>
            )}
            {(proposal?.sharesRequested > 0 || !proposal?.sharesRequested) && (
              <Box>
                <Text
                  textTransform='uppercase'
                  fontSize='sm'
                  fontFamily={theme.fonts.heading}
                  fontWeight={700}
                >
                  Shares
                </Text>
                <Skeleton isLoaded={proposal?.sharesRequested}>
                  <Text
                    fontSize='lg'
                    fontFamily={theme.fonts.space}
                    fontWeight={700}
                  >
                    {proposal?.sharesRequested
                      ? proposal.sharesRequested
                      : '--'}
                  </Text>
                </Skeleton>
              </Box>
            )}
            {proposal?.lootRequested > 0 && ( // don't show during loading
              <Box>
                <Text
                  textTransform='uppercase'
                  fontSize='sm'
                  fontFamily={theme.fonts.heading}
                  fontWeight={700}
                >
                  Loot
                </Text>
                <Skeleton isLoaded={proposal?.lootRequested}>
                  <Text
                    fontSize='lg'
                    fontFamily={theme.fonts.space}
                    fontWeight={700}
                  >
                    {proposal?.lootRequested ? proposal.lootRequested : '--'}
                  </Text>
                </Skeleton>
              </Box>
            )}
            <Box>
              {proposal?.proposalIndex ? (
                <>
                  <Text
                    textTransform='uppercase'
                    fontSize='sm'
                    fontFamily={theme.fonts.heading}
                    fontWeight={700}
                  >
                    {isBefore(Date.now(), votePeriodEnds)
                      ? 'Voting Period Ends'
                      : 'Voting Ended'}
                  </Text>
                  <Text
                    fontSize='lg'
                    fontFamily={theme.fonts.space}
                    fontWeight={700}
                  >
                    {formatDistanceToNow(votePeriodEnds, {
                      addSuffix: true,
                    })}
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    textTransform='uppercase'
                    fontSize='sm'
                    fontFamily={theme.fonts.heading}
                    fontWeight={700}
                  >
                    Proposal Status
                  </Text>
                  <Skeleton isLoaded={proposal?.status}>
                    <Text
                      fontSize='lg'
                      fontFamily={theme.fonts.space}
                      fontWeight={700}
                    >
                      {proposal?.status
                        ? getProposalCountdownText(proposal)
                        : '--'}
                    </Text>
                  </Skeleton>
                </>
              )}
            </Box>
          </Flex>
          <Box mt={6}>
            <Text
              textTransform='uppercase'
              fontSize='sm'
              fontFamily={theme.fonts.heading}
              fontWeight={700}
            >
              Link
            </Text>
            <Skeleton isLoaded={details?.link}>
              <Link href={details?.link} target='_blank'>
                {details?.link ? details.link : '-'}{' '}
                <Icon
                  as={RiExternalLinkLine}
                  color={theme.colors.primary[50]}
                />
              </Link>
            </Skeleton>
          </Box>
        </Box>
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
      </Flex>
      <Skeleton isLoaded={details?.description}>
        <Box w='100%' mt={8}>
          {details?.description}
        </Box>
      </Skeleton>

      <Flex w='80%' mt={6} justify='space-between'>
        <Box mr={5}>
          <Text
            textTransform='uppercase'
            fontSize='sm'
            mb={4}
            fontFamily={theme.fonts.heading}
            fontWeight={700}
          >
            Submitted By
          </Text>
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
          <Text
            textTransform='uppercase'
            fontSize='sm'
            fontFamily={theme.fonts.heading}
            fontWeight={700}
            mb={4}
          >
            Recipient
          </Text>
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
    </Box>
  );
};

export default ProposalDetail;
