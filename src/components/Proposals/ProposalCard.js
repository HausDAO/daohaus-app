import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Text, Badge, Skeleton } from '@chakra-ui/core';
import { utils } from 'web3';
import { format } from 'date-fns';

import {
  useDao,
  useMemberWallet,
  useTheme,
} from '../../contexts/PokemolContext';
import { getProposalCountdownText } from '../../utils/proposal-helper';

const ProposalCard = ({ proposal, isLoaded }) => {
  const [dao] = useDao();
  const [theme] = useTheme();
  const [memberWallet] = useMemberWallet();
  const [memberVote, setMemberVote] = useState();

  useEffect(() => {
    if (proposal.votes && memberWallet && memberWallet.activeMember) {
      setMemberVote(
        proposal.votes.find(
          (vote) =>
            vote.memberAddress === memberWallet.memberAddress.toLowerCase(),
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberWallet, proposal]);

  console.log('render proposalCard');

  return (
    <Link to={`/dao/${dao.address}/proposals/${proposal.proposalId}`}>
      {/* <Link to={`/dao/${dao?.address}/proposals/${proposal?.proposalId}`}> */}

      <Box
        rounded='lg'
        bg='blackAlpha.800'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        p={6}
        m={6}
        mt={2}
      >
        <Flex>
          <Box minWidth='30%' mr={5}>
            <Text
              fontSize='sm'
              textTransform='uppercase'
              fontFamily={theme.fonts.heading}
            >
              {proposal?.proposalType
                ? proposal.proposalType
                : theme.daoMeta.proposal}
            </Text>
            <Skeleton isLoaded={isLoaded}>
              <Text
                fontWeight={700}
                fontSize='lg'
                fontFamily={theme.fonts.heading}
              >
                {proposal.title || '--'}
              </Text>
            </Skeleton>
          </Box>
          <Flex align='center'>
            <Flex h='20px'>
              <Skeleton isLoaded={isLoaded}>
                <Badge colorScheme='green' mr={3}>
                  {proposal?.yesVotes ? proposal.yesVotes : '--'} Yes
                </Badge>
                <Badge colorScheme='red'>
                  {proposal?.noVotes ? proposal.noVotes : '--'} No
                </Badge>
                {memberVote ? (
                  <Text fontSize='sm'>
                    {+memberVote.uintVote ? 'You voted yes' : 'You voted no'}
                  </Text>
                ) : null}
              </Skeleton>
            </Flex>
          </Flex>
        </Flex>
        <Flex w='80%' justify='space-between' mt={10}>
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
              <Skeleton isLoaded={isLoaded}>
                <Text
                  fontSize='lg'
                  fontFamily={theme.fonts.space}
                  fontWeight={700}
                >
                  {proposal?.tributeOffered
                    ? utils.fromWei(proposal.tributeOffered)
                    : '--'}{' '}
                  {proposal.tributeToken || 'WETH'}
                </Text>
              </Skeleton>
            </Box>
          )}
          {(proposal?.paymentRequested > 0 || !proposal?.paymentRequested) && (
            <Box>
              <Text
                textTransform='uppercase'
                fontSize='sm'
                fontFamily={theme.fonts.heading}
                fontWeight={700}
              >
                Payment Requested
              </Text>
              <Skeleton isLoaded={isLoaded}>
                <Text
                  fontSize='lg'
                  fontFamily={theme.fonts.space}
                  fontWeight={700}
                >
                  {proposal?.paymentRequested
                    ? utils.fromWei(proposal.paymentRequested)
                    : '--'}{' '}
                  {proposal.paymentToken || 'WETH'}
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
              <Skeleton isLoaded={isLoaded}>
                <Text
                  fontSize='lg'
                  fontFamily={theme.fonts.space}
                  fontWeight={700}
                >
                  {proposal?.sharesRequested ? proposal.sharesRequested : '--'}
                </Text>
              </Skeleton>
            </Box>
          )}
          {(proposal?.lootRequested > 0 || !proposal?.lootRequested) && (
            <Box>
              <Text
                textTransform='uppercase'
                fontSize='sm'
                fontFamily={theme.fonts.heading}
                fontWeight={700}
              >
                Loot
              </Text>
              <Skeleton isLoaded={isLoaded}>
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
          <Box fontFamily={theme.fonts.heading}>
            {getProposalCountdownText(proposal)}
          </Box>
        </Flex>
        <Skeleton isLoaded={isLoaded}>
          <Text
            fontWeight={700}
            fontSize='xs'
            fontFamily={theme.fonts.heading}
            mt={2}
          >
            {proposal.createdAt
              ? `Created on: ${format(
                  new Date(proposal.createdAt * 1000),
                  'MMMM d y',
                )}`
              : '--'}
          </Text>
        </Skeleton>
      </Box>
    </Link>
  );
};

export default ProposalCard;
