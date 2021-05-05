import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Button, Flex, Icon, Skeleton, Tooltip } from '@chakra-ui/react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { RiErrorWarningLine, RiQuestionLine } from 'react-icons/ri';
import { isAfter, isBefore } from 'date-fns';
import { motion } from 'framer-motion';
import { MaxUint256 } from '@ethersproject/constants';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useUser } from '../contexts/UserContext';
import { TokenService } from '../services/tokenService';
import { useTX } from '../contexts/TXContext';
import { useOverlay } from '../contexts/OverlayContext';
import { createPoll } from '../services/pollService';
import { MolochService } from '../services/molochService';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { memberVote } from '../utils/proposalUtils';
import { supportedChains } from '../utils/chain';
import { getTerm } from '../utils/metadata';
import {
  capitalize,
  daoConnectedAndSameChain,
  isDelegating,
} from '../utils/general';
import { useMetaData } from '../contexts/MetaDataContext';
import MinionExecute from './minionExecute';

const MotionBox = motion(Box);

const getAllowance = (daoMember, delegate) => {
  if (daoMember?.hasWallet && daoMember?.allowance) {
    return +daoMember.allowance;
  }
  if (delegate?.hasWallet && delegate?.allowance) {
    return +delegate.allowance;
  }
  return null;
};

const canInteract = (daoMember, delegate) => {
  if (+daoMember?.shares > 0 && !isDelegating(daoMember)) {
    return true;
  }
  if (delegate) {
    return true;
  }
  return false;
};

const ProposalVote = ({
  proposal,
  overview,
  daoProposals,
  daoMember,
  delegate,
}) => {
  const [nextProposalToProcess, setNextProposal] = useState(null);
  const [loading, setLoading] = useState(false);
  const { daochain, daoid } = useParams();
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const { cachePoll, resolvePoll } = useUser();
  const {
    errorToast,
    successToast,
    setProposalModal,
    setTxInfoModal,
  } = useOverlay();
  const { refreshDao } = useTX();
  const { customTerms } = useMetaData();

  const [enoughDeposit, setEnoughDeposit] = useState(false);

  const currentlyVoting = proposal => {
    return (
      isBefore(Date.now(), new Date(+proposal?.votingPeriodEnds * 1000)) &&
      isAfter(Date.now(), new Date(+proposal?.votingPeriodStarts * 1000))
    );
  };

  const userRejectedToast = () => {
    errorToast({
      title: 'User rejected transaction signature.',
    });
  };

  const NetworkOverlay = () => (
    <Flex
      position='absolute'
      top='0px'
      left='0px'
      bottom='0px'
      right='0px'
      zIndex='3'
      align='center'
      justify='center'
      style={{ backdropFilter: 'blur(6px)' }}
    >
      <Box
        maxW={['70%', null, null, 'auto']}
        fontFamily='heading'
        fontSize={['md', null, null, 'xl']}
        fontWeight={700}
        textAlign='center'
        zIndex='2'
      >
        {`Connect to ${capitalize(supportedChains[daochain]?.network)}
      for ${getTerm(customTerms, 'proposal')} actions`}
      </Box>
    </Flex>
  );

  const onTxHash = () => {
    setProposalModal(false);
    setTxInfoModal(true);
  };

  useEffect(() => {
    const getDepositTokenBalance = async () => {
      const depositTokenBalance = await TokenService({
        tokenAddress: overview?.depositToken.tokenAddress,
        chainID: daochain,
      })('balanceOf')(address);
      setEnoughDeposit(
        +overview?.proposalDeposit === 0 ||
          +depositTokenBalance / 10 ** overview?.depositToken.decimals >
            +overview?.proposalDeposit / 10 ** overview?.depositToken.decimals,
      );
    };
    if (overview?.depositToken && address) {
      getDepositTokenBalance();
    }
  }, [overview]);

  const cancelProposal = async id => {
    setLoading(true);
    const args = [id];
    try {
      console.log(id);
      const poll = createPoll({ action: 'cancelProposal', cachePoll })({
        daoID: daoid,
        chainID: daochain,
        proposalId: id,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'There was an error.',
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
            setLoading(false);
          },
          onSuccess: txHash => {
            successToast({
              title: 'Cancelled proposal!',
            });
            refreshDao();
            resolvePoll(txHash);
            setLoading(false);
          },
        },
      });
      await MolochService({
        web3: injectedProvider,
        daoAddress: daoid,
        chainID: daochain,
        version: overview.version,
      })('cancelProposal')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
      userRejectedToast();
    }
  };

  const unlock = async token => {
    setLoading(true);

    const maxUnlock = MaxUint256.toString();
    const args = [daoid, maxUnlock];

    try {
      const poll = createPoll({ action: 'unlockToken', cachePoll })({
        daoID: daoid,
        chainID: daochain,
        tokenAddress: token,
        userAddress: address,
        unlockAmount: maxUnlock,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'Failed to unlock token',
            });
            resolvePoll(txHash);
            console.error(`Could not unlock token: ${error}`);
            setLoading(false);
          },
          onSuccess: txHash => {
            successToast({
              // ? update to token symbol or name
              title: `Tribute token ${overview?.depositToken?.symbol} unlocked`,
            });
            refreshDao();
            resolvePoll(txHash);
            setLoading(false);
          },
        },
      });
      await TokenService({
        web3: injectedProvider,
        chainID: daochain,
        tokenAddress: token,
      })('approve')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      console.log('error:', err);
      setLoading(false);
      userRejectedToast();
    }
  };

  const sponsorProposal = async id => {
    setLoading(true);
    const args = [id];
    try {
      const poll = createPoll({ action: 'sponsorProposal', cachePoll })({
        daoID: daoid,
        chainID: daochain,
        proposalId: id,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'There was an error.',
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
            setLoading(false);
          },
          onSuccess: txHash => {
            successToast({
              title: 'Sponsored proposal. Queued for voting!',
            });
            refreshDao();
            resolvePoll(txHash);
            setLoading(false);
          },
        },
      });
      await MolochService({
        web3: injectedProvider,
        daoAddress: daoid,
        chainID: daochain,
        version: overview.version,
      })('sponsorProposal')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
      userRejectedToast();
    }
  };

  const submitVote = async (proposal, vote) => {
    setLoading(true);
    const args = [proposal.proposalIndex, vote];
    try {
      const poll = createPoll({ action: 'submitVote', cachePoll })({
        daoID: daoid,
        chainID: daochain,
        proposalId: proposal.proposalId,
        userAddress: address,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'There was an error.',
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
          },
          onSuccess: txHash => {
            successToast({
              title: 'Vote submitted. Your community appreciates you.',
            });
            refreshDao();
            resolvePoll(txHash);
            setLoading(false);
          },
        },
      });
      await MolochService({
        web3: injectedProvider,
        daoAddress: daoid,
        chainID: daochain,
        version: overview.version,
      })('submitVote')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
      userRejectedToast();
    }
  };

  const processProposal = async proposal => {
    setLoading(true);
    let proposalType = 'other';
    let processFn = 'processProposal';

    if (proposal.whitelist) {
      proposalType = 'whitelist';
      processFn = 'processWhitelistProposal';
    } else if (proposal.guildkick) {
      proposalType = 'guildkick';
      processFn = 'processGuildKickProposal';
    }

    const args = [proposal.proposalIndex];

    try {
      const poll = createPoll({ action: 'processProposal', cachePoll })({
        daoID: daoid,
        chainID: daochain,
        proposalType,
        proposalIndex: proposal.proposalIndex,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'There was an error.',
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
            setLoading(false);
          },
          onSuccess: txHash => {
            successToast({
              title: 'Proposal processed. Get that money!',
            });
            refreshDao();
            resolvePoll(txHash);
            setLoading(false);
          },
        },
      });
      await MolochService({
        web3: injectedProvider,
        daoAddress: daoid,
        chainID: daochain,
        version: overview.version,
      })(processFn)({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
      userRejectedToast();
    }
  };

  useEffect(() => {
    if (daoProposals) {
      const proposalsToProcess = daoProposals
        .filter(p => p.status === 'ReadyForProcessing')
        .sort((a, b) => a.gracePeriodEnds - b.gracePeriodEnds);

      if (proposalsToProcess.length > 0) {
        setNextProposal(proposalsToProcess[0]);
      }
    }
  }, [daoProposals]);

  return (
    <>
      <ContentBox position='relative'>
        {!daoConnectedAndSameChain(address, daochain, injectedChain?.chainId) &&
          ((proposal?.status === 'Unsponsored' && !proposal?.proposalIndex) ||
            proposal?.status === 'ReadyForProcessing') && <NetworkOverlay />}
        {!daoConnectedAndSameChain(address, daochain, injectedChain?.chainId) &&
          (proposal?.status !== 'Unsponsored' || proposal?.proposalIndex) &&
          proposal?.status !== 'Cancelled' &&
          !proposal?.status === 'ReadyForProcessing' && <NetworkOverlay />}
        {proposal?.status === 'Unsponsored' && !proposal?.proposalIndex && (
          <Flex justify='center' direction='column'>
            <Flex justify='center' mb={4}>
              <Flex justify='center' direction='column' align='center'>
                <TextBox size='xs'>
                  Deposit to Sponsor
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
                  {`${overview?.proposalDeposit /
                    10 ** overview?.depositToken.decimals}
                  ${overview?.depositToken?.symbol}`}
                  {!enoughDeposit ? (
                    <Tooltip
                      shouldWrapChildren
                      placement='bottom'
                      label={`Insufficient Funds: You only have ${daoMember?.depositTokenBalance} ${overview?.depositToken?.symbol}`}
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
              {canInteract(daoMember, delegate) ? (
                <>
                  {getAllowance(daoMember, delegate) *
                    10 ** overview?.depositToken?.decimals >=
                    +overview?.proposalDeposit ||
                  +overview?.proposalDeposit === 0 ? (
                    <Button
                      onClick={() => sponsorProposal(proposal?.proposalId)}
                      isDisabled={!enoughDeposit}
                      isLoading={loading}
                    >
                      Sponsor
                    </Button>
                  ) : (
                    <Button
                      onClick={() => unlock(overview.depositToken.tokenAddress)}
                      isLoading={loading}
                    >
                      Unlock
                    </Button>
                  )}
                </>
              ) : (
                <Tooltip
                  hasArrow
                  shouldWrapChildren
                  placement='bottom'
                  label='You have no shares to vote with. Either you are not a member or you have delegated voting power to another member'
                  bg='secondary.500'
                >
                  <Button isDisabled>Sponsor</Button>
                </Tooltip>
              )}
              {proposal?.proposer === address?.toLowerCase() && (
                <Button
                  variant='outline'
                  onClick={() => cancelProposal(proposal?.proposalId)}
                  isLoading={loading}
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
                      {daoConnectedAndSameChain(
                        address,
                        daochain,
                        injectedChain?.chainId,
                      ) &&
                        canInteract(daoMember, delegate) &&
                        memberVote(proposal, address) === null && (
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
                          daoMember && memberVote(proposal, address) === null
                            ? 'flex-end'
                            : 'center'
                        }
                        align='center'
                        w={
                          daoMember && memberVote(proposal, address) === null
                            ? '50%'
                            : '100%'
                        }
                      >
                        <Box
                          as='i'
                          fontSize={
                            daoMember && memberVote(proposal, address) === null
                              ? 'xs'
                              : 'md'
                          }
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
                            +proposal?.yesShares > +proposal?.noShares &&
                            'Passed'}
                          {(proposal?.status === 'GracePeriod' ||
                            proposal?.status === 'ReadyForProcessing') &&
                            +proposal?.noShares > +proposal?.yesShares &&
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
                    {`${proposal?.yesShares || '0'} Yes`}
                  </TextBox>
                </Skeleton>
                <Skeleton isLoaded={proposal?.noShares}>
                  <TextBox variant='value' size='xl'>
                    {`${proposal?.noShares || '0'} No`}
                  </TextBox>
                </Skeleton>
              </Flex>
            </>
          )}

        {daoConnectedAndSameChain(address, daochain, injectedChain?.chainId) &&
          proposal?.status === 'ReadyForProcessing' &&
          (nextProposalToProcess?.proposalId === proposal?.proposalId ? (
            <Flex justify='center' pt='10px'>
              <Flex direction='column'>
                <Button
                  onClick={() => processProposal(proposal)}
                  isLoading={loading}
                >
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
                  {`Proposal ${nextProposalToProcess?.proposalId} Needs Processing Next`}
                </Button>
              </Flex>
            </Flex>
          ))}
        {proposal?.status === 'Passed' && proposal?.minionAddress && (
          <MinionExecute proposal={proposal} />
        )}
      </ContentBox>
    </>
  );
};

export default ProposalVote;
