import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Icon,
  Skeleton,
  Tooltip,
  Text,
} from '@chakra-ui/react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { RiErrorWarningLine, RiQuestionLine } from 'react-icons/ri';
import { isAfter, isBefore } from 'date-fns';
import { motion } from 'framer-motion';

import { useDao } from '../contexts/DaoContext';
import { useDaoMember } from '../contexts/DaoMemberContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import ContentBox from './ContentBox';
import TextBox from './TextBox';

// import { MinionService } from '../../utils/minion-service';
// import Web3 from 'web3';
// import { getRpcUrl } from '../../utils/helpers';

const MotionBox = motion.custom(Box);

const ProposalVote = ({ proposal }) => {
  const [nextProposalToProcess, setNextProposal] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const { daoOverview } = useDao();
  const { memberWalletRef } = useDaoMember();
  const { daochain, daoid } = useParams();
  const { address } = useInjectedProvider();
  // const [minionDeets, setMinionDeets] = useState();

  const currentlyVoting = (proposal) => {
    return (
      isBefore(Date.now(), new Date(+proposal?.votingPeriodEnds * 1000)) &&
      isAfter(Date.now(), new Date(+proposal?.votingPeriodStarts * 1000))
    );
  };
  console.log(memberWalletRef);
  console.log(currentlyVoting());
  console.log(proposal);

  // const txCallBack = (txHash, details) => {
  //   // if (txProcessor && txHash) {
  //   //   txProcessor.setTx(txHash, user.username, details);
  //   //   txProcessor.forceUpdate = true;
  //   //   console.log('force update changed');
  //   //   updateTxProcessor({ ...txProcessor });
  //   //   // close model here
  //   //   // onClose();
  //   //   // setShowModal(null);
  //   // }
  //   // if (!txHash) {
  //   //   console.log('error: ', details);
  //   // }
  // };

  const cancelProposal = async (id) => {
    try {
      // await dao.daoService.moloch.cancelProposal(id, txCallBack);
      console.log(id);
    } catch (err) {
      console.log('user rejected or transaction failed', err);
    }
  };

  const unlock = async (token) => {
    console.log('unlock ', token);
    try {
      // await dao.daoService.token.unlock(token, txCallBack);
      console.log(token);
    } catch (err) {
      console.log(err);
    }
  };

  const sponsorProposal = async (id) => {
    console.log('sponsor ', id);
    try {
      // await dao.daoService.moloch.sponsorProposal(id, txCallBack);
      console.log(id);
    } catch (err) {
      console.log('user rejected or transaction failed', err);
    }
  };

  const submitVote = async (proposal, vote) => {
    try {
      // await dao.daoService.moloch.submitVote(
      //   proposal.proposalIndex,
      //   vote,
      //   txCallBack,
      // );
      console.log(proposal);
    } catch (e) {
      console.error(`Error processing proposal: ${e.toString()}`);
    }
  };

  const processProposal = async (proposal) => {
    try {
      if (proposal.whitelist) {
        // await dao.daoService.moloch.processWhitelistProposal(
        //   proposal.proposalIndex,
        //   txCallBack,
        // );
        console.log('process whitelist');
      } else if (proposal.guildkick) {
        // await dao.daoService.moloch.processGuildKickProposal(
        //   proposal.proposalIndex,
        //   txCallBack,
        // );
        console.log('guildkick process');
      } else {
        // await dao.daoService.moloch.processProposal(
        //   proposal.proposalIndex,
        //   txCallBack,
        // );
        console.log('process proposal');
      }
    } catch (e) {
      console.error(`Error processing proposal: ${e.toString()}`);
    }
  };

  // const executeMinion = async (proposal) => {
  //   // TODO: will nedd to check if it has been executed yet
  //   const web3 = web3Connect?.web3
  //     ? web3Connect.web3
  //     : new Web3(new Web3.providers.HttpProvider(getRpcUrl(network)));
  //   const setupValues = {
  //     minion: proposal.minionAddress,
  //   };

  //   const minionService = new MinionService(web3, user?.username, setupValues);

  //   try {
  //     minionService.executeAction(proposal.proposalId, txCallBack);
  //   } catch (err) {
  //     console.log('error: ', err);
  //   }
  // };

  // useEffect(() => {
  //   let action;
  //   const getMinionDeets = async () => {
  //     // if (!proposal) {
  //     //   return;
  //     // }
  //     const setupValues = {
  //       minion: proposal.minionAddress,
  //     };
  //     const web3 = web3Connect?.web3
  //       ? web3Connect.web3
  //       : new Web3(new Web3.providers.HttpProvider(getRpcUrl(network)));

  //     const minionService = new MinionService(
  //       web3,
  //       user?.username,
  //       setupValues,
  //     );

  //     try {
  //       action = await minionService.getAction(proposal.proposalId);
  //     } catch (err) {
  //       console.log('error: ', err);
  //     }

  //     setMinionDeets(action);
  //   };
  //   if (proposal?.proposalId) {
  //     getMinionDeets();
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [proposal, user]);

  // useEffect(() => {
  //   if (proposals) {
  //     const proposalsToProcess = proposals
  //       .filter((p) => p.status === 'ReadyForProcessing')
  //       .sort((a, b) => a.gracePeriodEnds - b.gracePeriodEnds);

  //     // console.log(proposalsToProcess);
  //     if (proposalsToProcess.length > 0) {
  //       setNextProposal(proposalsToProcess[0]);
  //     }
  //   }
  // }, [proposals]);

  // useEffect(() => {
  //   if (memberWallet && proposal) {
  //     if (proposal.votes.length > 0) {
  //       const voted = proposal.votes.some(
  //         (vote) =>
  //           memberWallet.memberAddress.toLowerCase() ===
  //           vote.memberAddress.toLowerCase(),
  //       );
  //       if (voted === true) {
  //         setHasVoted(true);
  //       }
  //     }
  //   }
  // }, [proposal, memberWalletRef]);

  return (
    <>
      <ContentBox>
        {proposal?.status === 'Unsponsored' && !proposal?.proposalIndex && (
          <Flex justify='center' direction='column'>
            <Flex justify='center' mb={4}>
              <Flex justify='center' direction='column'>
                <TextBox size='xs'>
                  Deposit to Sponsor{' '}
                  <Tooltip
                    hasArrow
                    shouldWrapChildren
                    placement='bottom'
                    label='Deposits discourage spam, and are returned after a proposal is processed. Minus the reward for processing, if one has been selected'
                  >
                    <Icon mt='-4px' as={RiQuestionLine} />
                  </Tooltip>
                </TextBox>
                <TextBox variant='value' size='xl' textAlign='center'>
                  {daoOverview?.proposalDeposit /
                    10 ** daoOverview?.depositToken.decimals}{' '}
                  {daoOverview?.depositToken?.symbol}
                  {+memberWalletRef?.tokenBalance <
                  +daoOverview?.proposalDeposit /
                    10 ** daoOverview?.depositToken.decimals ? (
                    <Tooltip
                      shouldWrapChildren
                      placement='bottom'
                      label={
                        'Insufficient Funds: You only have ' +
                        memberWalletRef?.tokenBalance +
                        ' ' +
                        daoOverview?.depositToken?.symbol
                      }
                    >
                      <Icon
                        color='red.500'
                        as={RiErrorWarningLine}
                        ml={2}
                        mt='-4px'
                      />
                    </Tooltip>
                  ) : null}
                </TextBox>
              </Flex>
            </Flex>
            <Flex justify='space-around'>
              {+memberWalletRef?.allowance *
                10 ** daoOverview?.depositToken?.decimals >
                +daoOverview?.proposalDeposit ||
              +daoOverview?.proposalDeposit === 0 ? (
                <Button onClick={() => sponsorProposal(proposal?.proposalId)}>
                  Sponsor
                </Button>
              ) : (
                <Button
                  onClick={() => unlock(daoOverview.depositToken.tokenAddress)}
                >
                  Unlock
                </Button>
              )}
              {proposal?.proposer === address?.toLowerCase() && (
                <Button
                  variant='outline'
                  onClick={() => cancelProposal(proposal?.proposalId)}
                >
                  Cancel
                </Button>
              )}
            </Flex>
          </Flex>
        )}
        {(proposal?.status !== 'Unsponsored' || proposal?.proposalIndex) &&
          proposal?.status !== 'Cancelled' && (
            <>
              <Flex mb={6} w='100%'>
                <Skeleton
                  isLoaded={proposal}
                  w='100%'
                  display='flex'
                  flexDirection='row'
                >
                  {currentlyVoting(proposal) ? (
                    <>
                      {memberWalletRef && !hasVoted && (
                        <Flex w='48%' justify='space-around'>
                          <Flex
                            p={3}
                            borderWidth='1px'
                            borderColor='green.500'
                            borderStyle='solid'
                            borderRadius='40px'
                            justiy='center'
                            align='center'
                          >
                            <Icon
                              as={FaThumbsUp}
                              color='green.500'
                              w='25px'
                              h='25px'
                              _hover={{ cursor: 'pointer' }}
                              onClick={() => submitVote(proposal, 1)}
                            />
                          </Flex>
                          <Flex
                            p={3}
                            borderWidth='1px'
                            borderColor='red.500'
                            borderStyle='solid'
                            borderRadius='40px'
                            justiy='center'
                            align='center'
                          >
                            <Icon
                              as={FaThumbsDown}
                              color='red.500'
                              w='25px'
                              h='25px'
                              transform='rotateY(180deg)'
                              _hover={{ cursor: 'pointer' }}
                              onClick={() => submitVote(proposal, 2)}
                            />
                          </Flex>
                        </Flex>
                      )}
                      <Flex
                        justify={
                          memberWalletRef && !hasVoted ? 'flex-end' : 'center'
                        }
                        align='center'
                        w={memberWalletRef && !hasVoted ? '50%' : '100%'}
                      >
                        <Box
                          as='i'
                          fontSize={memberWalletRef && !hasVoted ? 'xs' : 'md'}
                        >
                          {+proposal?.noShares > +proposal?.yesShares &&
                            'Not Passing'}
                          {+proposal?.yesShares > +proposal?.noShares &&
                            'Currently Passing'}
                          {+proposal?.yesShares === 0 &&
                            +proposal?.noShares === 0 &&
                            'Awaiting Votes'}
                        </Box>
                      </Flex>
                    </>
                  ) : (
                    <>
                      <Flex justify='center' align='center' w='100%'>
                        <TextBox size='xl' variant='value'>
                          {proposal?.status === 'Failed' && 'Failed'}
                          {proposal?.status === 'Passed' && 'Passed'}
                          {(proposal?.status === 'GracePeriod' ||
                            proposal?.status === 'ReadyForProcessing') &&
                            proposal.yesShares > proposal.noShares &&
                            'Passed'}
                          {(proposal?.status === 'GracePeriod' ||
                            proposal?.status === 'ReadyForProcessing') &&
                            proposal.noShares > proposal.yesShares &&
                            'Failed'}
                        </TextBox>
                      </Flex>
                    </>
                  )}
                </Skeleton>
              </Flex>
              <Flex
                w='100%'
                h='20px'
                borderRadius='999px'
                backgroundColor='whiteAlpha.500'
                overflow='hidden'
                justify='space-between'
              >
                {+proposal?.yesShares > 0 && (
                  <MotionBox
                    h='100%'
                    backgroundColor='green.500'
                    borderRight={
                      proposal?.noShares > 0
                        ? '1px solid white'
                        : '0px solid transparent'
                    }
                    animate={{
                      width: [
                        '0%',
                        `${(+proposal?.yesShares /
                          (+proposal.yesShares + +proposal.noShares)) *
                          100}%`,
                      ],
                    }}
                    transition={{ duration: 0.5 }}
                  />
                )}
                {+proposal?.noShares > 0 && (
                  <MotionBox
                    h='100%'
                    backgroundColor='red.500'
                    animate={{
                      width: [
                        '0%',
                        `${(+proposal?.noShares /
                          (+proposal.yesShares + +proposal.noShares)) *
                          100}%`,
                      ],
                    }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </Flex>
              <Flex justify='space-between' mt={3}>
                <Skeleton isLoaded={proposal?.yesShares}>
                  <TextBox variant='value' size='xl'>
                    {proposal?.yesShares || '0'} Yes
                  </TextBox>
                </Skeleton>
                <Skeleton isLoaded={proposal?.noShares}>
                  <TextBox variant='value' size='xl'>
                    {proposal?.noShares || '0'} No
                  </TextBox>
                </Skeleton>
              </Flex>
            </>
          )}

        {memberWalletRef &&
          proposal?.status === 'ReadyForProcessing' &&
          (nextProposalToProcess?.proposalId === proposal?.proposalId ? (
            <Flex justify='center' pt='10px'>
              <Flex direction='column'>
                <Button onClick={() => processProposal(proposal)}>
                  Process
                </Button>
              </Flex>
            </Flex>
          ) : (
            <Flex justify='center' pt='10px'>
              <Flex direction='column'>
                <Button
                  as={Link}
                  to={`/dao/${daochain}/${daoid}/proposals/${nextProposalToProcess?.proposalId}`}
                  variant='outline'
                  onClick={() => setNextProposal(nextProposalToProcess)}
                >
                  Proposal {nextProposalToProcess?.proposalId} Needs Processing
                  Next
                </Button>
              </Flex>
            </Flex>
          ))}
        {/* {proposal?.status === 'Passed' && proposal?.minionAddress && (
          <Flex justify='center' pt='10px'>
            <Flex direction='column'>
              {minionDeets?.executed ? (
                <Text>Executed</Text>
              ) : (
                <Button onClick={() => executeMinion(proposal)}>
                  Execute Minion
                </Button>
              )}
            </Flex>
          </Flex>
        )} */}
      </ContentBox>
    </>
  );
};

export default ProposalVote;
