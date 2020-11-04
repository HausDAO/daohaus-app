import React from 'react';
import { formatDistanceToNow, isBefore } from 'date-fns';
import { Flex, Box, Text, Icon, Link } from '@chakra-ui/core';
import { RiExternalLinkLine } from 'react-icons/ri';
import { FaThumbsUp } from 'react-icons/fa';
import { utils } from 'web3';

import { useTheme, useMembers } from '../../contexts/PokemolContext';
import UserAvatar from '../../components/Shared/UserAvatar';
import { memberProfile } from '../../utils/helpers';

const ProposalDetail = ({ proposal }) => {
  const [members] = useMembers();
  const [theme] = useTheme();
  const details = proposal.details && JSON.parse(proposal.details);
  const votePeriodEnds = new Date(+proposal.votingPeriodEnds * 1000);
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
          <Text
            fontSize='3xl'
            fontFamily={theme.fonts.heading}
            fontWeight={700}
          >
            {details?.title ? details?.title : '-'}
          </Text>
          <Flex w='100%' justify='space-between' mt={6}>
            <Box>
              <Text
                textTransform='uppercase'
                fontSize='sm'
                fontFamily={theme.fonts.heading}
                fontWeight={700}
              >
                Tribute
              </Text>
              {proposal?.tributeOffered ? (
                <Text
                  fontSize='lg'
                  fontFamily={theme.fonts.space}
                  fontWeight={700}
                >
                  {utils.fromWei(proposal.tributeOffered.toString())}{' '}
                  {proposal.tributeTokenSymbol || 'WETH'}
                </Text>
              ) : (
                <Text
                  fontSize='lg'
                  fontFamily={theme.fonts.space}
                  fontWeight={700}
                >
                  -
                </Text>
              )}
            </Box>
            <Box>
              <Text
                textTransform='uppercase'
                fontSize='sm'
                fontFamily={theme.fonts.heading}
                fontWeight={700}
              >
                Shares
              </Text>
              <Text
                fontSize='lg'
                fontFamily={theme.fonts.space}
                fontWeight={700}
              >
                {proposal?.sharesRequested ? proposal.sharesRequested : '-'}
              </Text>
            </Box>
            <Box>
              <Text
                textTransform='uppercase'
                fontSize='sm'
                fontFamily={theme.fonts.heading}
                fontWeight={700}
              >
                Loot
              </Text>
              <Text
                fontSize='lg'
                fontFamily={theme.fonts.space}
                fontWeight={700}
              >
                {proposal.lootRequested ? proposal.lootRequested : '-'}
              </Text>
            </Box>
            <Box>
              {proposal.proposalIndex ? (
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
                  <Text
                    fontSize='lg'
                    fontFamily={theme.fonts.space}
                    fontWeight={700}
                  >
                    Awaiting Sponsor
                  </Text>
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
            <Link href={details?.link} target='_blank'>
              {details?.link ? details.link : '-'} <Icon as={RiExternalLinkLine} color={theme.colors.primary[50]}/>
            </Link>
          </Box>
        </Box>
        <Box pl={6}>
          <Icon as={FaThumbsUp} color={theme.colors.primary[50]} />
        </Box>
      </Flex>
      <Box w='100%' mt={8}>
        {details.description}
      </Box>
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
          {members && (
            <UserAvatar
              user={memberProfile(members, proposal.proposer).profile}
            />
          )}
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
          {members && (
            <UserAvatar
              user={memberProfile(members, proposal.applicant).profile}
            />
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default ProposalDetail;
