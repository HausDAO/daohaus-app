import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Badge, Skeleton, Icon } from '@chakra-ui/core';
import { utils } from 'web3';
import { format } from 'date-fns';

import { useDao, useMemberWallet } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import { getProposalCountdownText } from '../../utils/proposal-helper';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

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
        transition='all 0.15s linear'
        _hover={{ bg: 'secondaryAlpha', color: 'white' }}
      >
        <Flex justify='space-between'>
          <Box minWidth='30%' mr={5}>
            <Box
              fontSize='xs'
              textTransform='uppercase'
              fontFamily='heading'
              letterSpacing='0.1em'
              mb={3}
            >
              {proposal?.proposalType
                ? proposal.proposalType
                : theme.daoMeta.proposal}
            </Box>
            <Skeleton isLoaded={isLoaded}>
              <Box fontWeight={700} fontSize='lg' fontFamily='heading'>
                {proposal.title || '--'}
              </Box>
            </Skeleton>
          </Box>
          <Flex align='center'>
            <Flex h='20px'>
              <Skeleton isLoaded={isLoaded}>
                {(+proposal?.yesVotes > 0 || +proposal?.noVotes > 0) && (
                  <>
                    <Badge
                      colorScheme='green'
                      variant={
                        +proposal.yesVotes > +proposal.noVotes &&
                        proposal.status !== 'Failed'
                          ? 'solid'
                          : 'outline'
                      }
                      mr={3}
                    >
                      {proposal?.yesVotes ? proposal.yesVotes : '--'} Yes
                    </Badge>
                    <Badge
                      colorScheme='red'
                      variant={
                        +proposal.noVotes > +proposal.yesVotes
                          ? 'solid'
                          : 'outline'
                      }
                    >
                      {proposal?.noVotes ? proposal.noVotes : '--'} No
                    </Badge>
                  </>
                )}
              </Skeleton>
            </Flex>
          </Flex>
          <Flex>
            {memberVote && (
              <Box fontSize='sm'>
                {+memberVote.uintVote === 1 ? (
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
                )}
              </Box>
            )}
          </Flex>
        </Flex>
        <Flex w='80%' justify='space-between' mt={10}>
          {(proposal?.tributeOffered > 0 || !proposal?.tributeOffered) && (
            <Box>
              <Box
                textTransform='uppercase'
                fontSize='xs'
                fontFamily='heading'
                fontWeight={400}
                letterSpacing='0.1em'
                color='whiteAlpha.600'
              >
                Tribute
              </Box>
              <Skeleton isLoaded={isLoaded}>
                <Box fontSize='lg' fontFamily='space' fontWeight={700}>
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
                fontSize='xs'
                fontFamily='heading'
                fontWeight={400}
                letterSpacing='0.1em'
                color='whiteAlpha.600'
              >
                Payment Requested
              </Box>
              <Skeleton isLoaded={isLoaded}>
                <Box fontSize='lg' fontFamily='space' fontWeight={700}>
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
                fontSize='xs'
                fontFamily='heading'
                fontWeight={400}
                letterSpacing='0.1em'
                color='whiteAlpha.600'
              >
                Shares
              </Box>
              <Skeleton isLoaded={isLoaded}>
                <Box fontSize='lg' fontFamily='space' fontWeight={700}>
                  {proposal?.sharesRequested ? proposal.sharesRequested : '--'}
                </Box>
              </Skeleton>
            </Box>
          )}
          {proposal?.lootRequested > 0 && (
            <Box>
              <Box
                textTransform='uppercase'
                fontSize='xs'
                fontFamily='heading'
                fontWeight={400}
                letterSpacing='0.1em'
                color='whiteAlpha.600'
              >
                Loot
              </Box>
              <Skeleton isLoaded={isLoaded}>
                <Box fontSize='lg' fontFamily='space' fontWeight={700}>
                  {proposal?.lootRequested ? proposal.lootRequested : '--'}
                </Box>
              </Skeleton>
            </Box>
          )}
          <Box fontFamily='heading'>
            <Box
              textTransform='uppercase'
              fontSize='xs'
              fontFamily='heading'
              fontWeight={400}
              letterSpacing='0.1em'
              color='whiteAlpha.600'
            >
              Proposal Status
            </Box>
            <Skeleton isLoaded={isLoaded}>
              <Box
                fontSize='lg'
                fontFamily='space'
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
            fontWeight={500}
            fontSize='xs'
            fontFamily={theme.fonts.body}
            mt={2}
            textTransform='uppercase'
          >
            {proposal.createdAt
              ? `Created on: ${format(
                  new Date(proposal.createdAt * 1000),
                  'MMMM d, y',
                )}`
              : '--'}
          </Box>
        </Skeleton>
      </Box>
    </Link>
  );
};

export default ProposalCard;
