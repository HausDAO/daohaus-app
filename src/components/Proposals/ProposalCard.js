import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Text, Badge, Skeleton } from '@chakra-ui/core';
import { utils } from 'web3';
import { format } from 'date-fns';

import { useDao, useMemberWallet } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
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
            <Box
              fontSize='sm'
              textTransform='uppercase'
              fontFamily={theme.fonts.heading}
            >
              {proposal?.proposalType
                ? proposal.proposalType
                : theme.daoMeta.proposal}
            </Box>
            <Skeleton isLoaded={isLoaded}>
              <Box
                fontWeight={700}
                fontSize='lg'
                fontFamily={theme.fonts.heading}
              >
                {proposal.title || '--'}
              </Box>
            </Skeleton>
          </Box>
          <Flex align='center'>
            <Flex h='20px'>
              <Skeleton isLoaded={isLoaded}>
                {(+proposal?.yesVotes > 0 || +proposal?.noVotes > 0) && (
                  <>
                    <Badge colorScheme='green' mr={3}>
                      {proposal?.yesVotes ? proposal.yesVotes : '--'} Yes
                    </Badge>
                    <Badge colorScheme='red'>
                      {proposal?.noVotes ? proposal.noVotes : '--'} No
                    </Badge>
                  </>
                )}

                {memberVote ? (
                  <Box fontSize='sm'>
                    {+memberVote.uintVote ? 'You voted yes' : 'You voted no'}
                  </Box>
                ) : null}
              </Skeleton>
            </Flex>
          </Flex>
        </Flex>
        <Flex w='80%' justify='space-between' mt={10}>
          {(proposal?.tributeOffered > 0 || !proposal?.tributeOffered) && (
            <Box>
              <Box
                textTransform='uppercase'
                fontSize='sm'
                fontFamily={theme.fonts.heading}
                fontWeight={700}
              >
                Tribute
              </Box>
              <Skeleton isLoaded={isLoaded}>
                <Box
                  fontSize='lg'
                  fontFamily={theme.fonts.space}
                  fontWeight={700}
                >
                  {proposal?.tributeOffered
                    ? utils.fromWei(proposal.tributeOffered)
                    : '--'}{' '}
                  {proposal.tributeToken || 'WETH'}
                </Box>
              </Skeleton>
            </Box>
          )}
          {proposal?.paymentRequested > 0 && (
            <Box>
              <Box
                textTransform='uppercase'
                fontSize='sm'
                fontFamily={theme.fonts.heading}
                fontWeight={700}
              >
                Payment Requested
              </Box>
              <Skeleton isLoaded={isLoaded}>
                <Box
                  fontSize='lg'
                  fontFamily={theme.fonts.space}
                  fontWeight={700}
                >
                  {proposal?.paymentRequested
                    ? utils.fromWei(proposal.paymentRequested)
                    : '--'}{' '}
                  {proposal.paymentToken || 'WETH'}
                </Box>
              </Skeleton>
            </Box>
          )}
          {(proposal?.sharesRequested > 0 || !proposal?.sharesRequested) && (
            <Box>
              <Box
                textTransform='uppercase'
                fontSize='sm'
                fontFamily={theme.fonts.heading}
                fontWeight={700}
              >
                Shares
              </Box>
              <Skeleton isLoaded={isLoaded}>
                <Box
                  fontSize='lg'
                  fontFamily={theme.fonts.space}
                  fontWeight={700}
                >
                  {proposal?.sharesRequested ? proposal.sharesRequested : '--'}
                </Box>
              </Skeleton>
            </Box>
          )}
          {proposal?.lootRequested > 0 && (
            <Box>
              <Box
                textTransform='uppercase'
                fontSize='sm'
                fontFamily={theme.fonts.heading}
                fontWeight={700}
              >
                Loot
              </Box>
              <Skeleton isLoaded={isLoaded}>
                <Box
                  fontSize='lg'
                  fontFamily={theme.fonts.space}
                  fontWeight={700}
                >
                  {proposal?.lootRequested ? proposal.lootRequested : '--'}
                </Box>
              </Skeleton>
            </Box>
          )}
          <Box fontFamily={theme.fonts.heading}>
            <Box
              textTransform='uppercase'
              fontSize='sm'
              fontFamily={theme.fonts.heading}
              fontWeight={700}
            >
              Proposal Status
            </Box>
            <Skeleton isLoaded={isLoaded}>
              <Box
                fontSize='lg'
                fontFamily={theme.fonts.space}
                fontWeight={700}
                textTransform='uppercase'
              >
                {proposal?.status ? getProposalCountdownText(proposal) : '--'}
              </Box>
            </Skeleton>
          </Box>
        </Flex>
        <Skeleton isLoaded={isLoaded}>
          <Box
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
          </Box>
        </Skeleton>
      </Box>
    </Link>
  );
};

export default ProposalCard;
