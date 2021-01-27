import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { utils } from 'web3';
import { Flex, Box, Skeleton, Badge, Icon } from '@chakra-ui/react';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { format } from 'date-fns';

// import { useCustomTheme } from '../contexts/CustomThemeContext';
// import { useInjectedProvider } from '../contexts/InjectedProviderContext';
// import { useTX } from '../contexts/TXContext';
// import { MolochService } from '../services/molochService';
import {
  // createHash,
  // detailsToJSON,
  numberWithCommas,
  // timeToNow,
} from '../utils/general';
// import { createPoll } from '../services/pollService';

import {
  determineProposalStatus,
  determineProposalType,
  titleMaker,
  // descriptionMaker,
} from '../utils/proposalUtils';
import ContentBox from './ContentBox';

const ProposalCard = ({ proposal }) => {
  const { daochain, daoid } = useParams();
  const [memberVote, setMemberVote] = useState();

  useEffect(() => {
    if (proposal.votes && proposal.memberAddress) {
      setMemberVote(
        proposal.votes.find(
          (vote) => vote.memberAddress === proposal.memberAddress.toLowerCase(),
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal]);

  return (
    <Link
      key={proposal.id}
      to={`/dao/${daochain}/${daoid}/proposals/${proposal.proposalId}`}
    >
      <ContentBox
        mt={3}
        transition='all 0.15s linear'
        _hover={{ bg: 'primary.600', color: 'white' }}
      >
        <Flex justify='space-between'>
          <Box
            fontSize='xs'
            textTransform='uppercase'
            fontFamily='heading'
            letterSpacing='0.1em'
          >
            {determineProposalType(proposal)}
          </Box>
          <Box>
            <Skeleton isLoaded={determineProposalStatus(proposal)}>
              <Badge>{determineProposalStatus(proposal)}</Badge>
            </Skeleton>
          </Box>
        </Flex>
        <Flex justify='space-between' mt={3}>
          <Box>
            <Skeleton isLoaded={titleMaker(proposal)}>
              <Box fontWeight={700} fontSize='lg' fontFamily='heading'>
                {titleMaker(proposal) || '--'}
              </Box>
            </Skeleton>
            <Skeleton isLoaded={proposal?.createdAt}>
              <Box fontSize='xs' as='i'>
                {`Submitted ${format(
                  new Date(proposal.createdAt * 1000),
                  'MMM d, y',
                )}` || '--'}
              </Box>
            </Skeleton>
          </Box>
          <Box>
            <Flex align='center'>
              <Flex h='20px'>
                <Skeleton isLoaded={proposal?.status}>
                  {(+proposal?.yesShares > 0 || +proposal?.noShares > 0) && (
                    <>
                      <Badge
                        colorScheme='green'
                        variant={
                          +proposal.yesShares > +proposal.noShares &&
                          proposal.status !== 'Failed'
                            ? 'solid'
                            : 'outline'
                        }
                        mr={3}
                      >
                        {proposal?.yesShares ? proposal.yesShares : '--'} Yes
                      </Badge>
                      <Badge
                        colorScheme='red'
                        variant={
                          +proposal.noShares > +proposal.yesShares
                            ? 'solid'
                            : 'outline'
                        }
                      >
                        {proposal?.noShares ? proposal.noShares : '--'} No
                      </Badge>
                    </>
                  )}
                </Skeleton>
              </Flex>
            </Flex>
          </Box>
        </Flex>
        <Flex alignItems='center' height='80px'>
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
        <Flex justify='space-between' mt={2}>
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
              <Skeleton isLoaded={proposal?.tributeOffered}>
                <Box fontSize='lg' fontFamily='space' fontWeight={700}>
                  {proposal?.tributeOffered
                    ? numberWithCommas(utils.fromWei(proposal.tributeOffered))
                    : '--'}{' '}
                  {proposal.tributeTokenSymbol || 'WETH'}
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
              <Skeleton isLoaded={proposal?.paymentRequested}>
                <Box fontSize='lg' fontFamily='space' fontWeight={700}>
                  {proposal?.paymentRequested
                    ? numberWithCommas(utils.fromWei(proposal.paymentRequested))
                    : '--'}{' '}
                  {proposal.paymentTokenSymbol || 'WETH'}
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
              <Skeleton isLoaded={proposal?.sharesRequested}>
                <Box fontSize='lg' fontFamily='space' fontWeight={700}>
                  {proposal?.sharesRequested
                    ? numberWithCommas(proposal.sharesRequested)
                    : '--'}
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
              <Skeleton isLoaded={proposal?.lootRequested}>
                <Box fontSize='lg' fontFamily='space' fontWeight={700}>
                  {proposal?.lootRequested
                    ? numberWithCommas(proposal.lootRequested)
                    : '--'}
                </Box>
              </Skeleton>
            </Box>
          )}
        </Flex>
      </ContentBox>
    </Link>
  );
};

export default ProposalCard;
