import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { RiErrorWarningLine, RiQuestionLine } from 'react-icons/ri';
import {
  Box,
  Button,
  Flex,
  Icon,
  Skeleton,
  Tooltip,
  Stack,
  Text,
  IconButton,
} from '@chakra-ui/react';
import { isAfter, isBefore } from 'date-fns';
import { MaxUint256 } from '@ethersproject/constants';
import { motion } from 'framer-motion';
import { utils } from 'ethers';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useMetaData } from '../contexts/MetaDataContext';
import { useTX } from '../contexts/TXContext';
import useCanInteract from '../hooks/useCanInteract';
import CrossChainMinionExecute from './crossChainMinionExecute';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import MinionExecute from './minionExecute';
import MinionCancel from './minionCancel';
import EscrowActions from './escrowActions';

import { TX } from '../data/txLegos/contractTX';
import { isMinionProposalType, memberVote } from '../utils/proposalUtils';
import { getTerm, getTitle } from '../utils/metadata';
import { capitalize, daoConnectedAndSameChain } from '../utils/general';
import { createContract } from '../utils/contract';
import { LOCAL_ABI } from '../utils/abi';
import { supportedChains } from '../utils/chain';
import { earlyExecuteMinionType } from '../utils/minionUtils';

const MotionBox = motion(Box);

const ProposalActions = ({
  daoMember,
  daoProposals,
  delegate,
  hideMinionExecuteButton,
  minionAction,
  overview,
  proposal,
}) => {
  const { daochain, daoid } = useParams();
  const { address, injectedChain, injectedProvider } = useInjectedProvider();
  const { submitTransaction } = useTX();
  const { customTerms } = useMetaData();
  const { canInteract, interactErrors } = useCanInteract({
    checklist: ['canSponsorAndVote'],
  });
  const [enoughDeposit, setEnoughDeposit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextProposalToProcess, setNextProposal] = useState(null);
  const [quorumNeeded, setQuorumNeeded] = useState(null);

  const currentlyVoting = proposal => {
    return (
      isBefore(Date.now(), new Date(+proposal?.votingPeriodEnds * 1000)) &&
      isAfter(Date.now(), new Date(+proposal?.votingPeriodStarts * 1000))
    );
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
      sx={{ '-webkit-backdrop-filter': 'blur(6px)' }}
      w='100%'
      h='100%'
    >
      <Box
        maxW={['70%', null, null, 'auto']}
        fontFamily='heading'
        fontSize={['md', null, null, 'xl']}
        fontWeight={700}
        textAlign='center'
        zIndex='2'
        title={getTitle(customTerms, 'Proposal')}
      >
        {`Connect to ${capitalize(supportedChains[daochain]?.network)}
      ${
        proposal?.minion?.foreignChainId
          ? `or ${capitalize(
              supportedChains[proposal?.minion?.foreignChainId]?.network,
            )}`
          : ''
      }
      for ${getTerm(customTerms, 'proposal')} actions`}
      </Box>
    </Flex>
  );

  useEffect(() => {
    let shouldUpdate = true;
    const getDepositTokenBalance = async () => {
      const tokenContract = createContract({
        address: overview?.depositToken.tokenAddress,
        abi: LOCAL_ABI.ERC_20,
        chainID: daochain,
      });
      const tokenBalance = await tokenContract.methods
        .balanceOf(address)
        .call();

      if (shouldUpdate) {
        setEnoughDeposit(
          +overview?.proposalDeposit === 0 ||
            +tokenBalance / 10 ** overview?.depositToken.decimals >=
              +overview?.proposalDeposit /
                10 ** overview?.depositToken.decimals,
        );
      }
    };
    if (overview?.depositToken && address && proposal) {
      getDepositTokenBalance();
      setQuorumNeeded(
        (overview?.totalShares * proposal?.minion?.minQuorum) / 100,
      );
    }
    () => {
      shouldUpdate = false;
    };
  }, [overview, address, proposal, injectedChain]);

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

  const cancelProposal = async () => {
    setLoading(true);
    await submitTransaction({
      args: [proposal.proposalId],
      tx: TX.CANCEL_PROPOSAL,
    });
    setLoading(false);
  };

  const unlock = async token => {
    setLoading(true);
    const unlockAmount = MaxUint256.toString();
    await submitTransaction({
      args: [daoid, unlockAmount],
      tx: TX.UNLOCK_TOKEN,
      values: { tokenAddress: token, unlockAmount },
    });
    setLoading(false);
  };

  const sponsorProposal = async id => {
    setLoading(true);
    await submitTransaction({
      args: [id],
      tx: TX.SPONSOR_PROPOSAL,
    });
    setLoading(false);
  };

  const submitVote = async (proposal, vote) => {
    setLoading(true);
    await submitTransaction({
      args: [proposal.proposalIndex, vote],
      tx: TX.SUBMIT_VOTE,
    });
    setLoading(false);
  };

  const processProposal = async proposal => {
    setLoading(true);
    const getTx = proposal => {
      if (proposal.whitelist) {
        return TX.PROCESS_WL_PROPOSAL;
      }
      if (proposal.guildkick) {
        return TX.PROCESS_GK_PROPOSAL;
      }
      return TX.PROCESS_PROPOSAL;
    };
    await submitTransaction({
      args: [proposal.proposalIndex],
      tx: getTx(proposal),
    });
    setLoading(false);
  };

  return (
    <>
      <ContentBox position='relative'>
        {!daoConnectedAndSameChain(
          address,
          injectedChain?.chainId,
          daochain,
          proposal?.minion?.foreignChainId,
        ) &&
          ((proposal?.status === 'Unsponsored' && !proposal?.proposalIndex) ||
            proposal?.status === 'ReadyForProcessing') && <NetworkOverlay />}
        {!daoConnectedAndSameChain(
          address,
          injectedChain?.chainId,
          daochain,
          proposal?.minion?.foreignChainId,
        ) &&
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
                  {!enoughDeposit && daoMember ? (
                    <Tooltip
                      shouldWrapChildren
                      placement='bottom'
                      label={`Insufficient Funds: You only have ${Number(
                        daoMember?.depositTokenData?.balance,
                      )?.toFixed(3)} ${overview?.depositToken?.symbol}`}
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
              {canInteract ? (
                <>
                  {Number(daoMember?.depositTokenData?.allowance) ||
                  Number(delegate?.depositTokenData?.allowance) >=
                    Number(overview?.proposalDeposit) ||
                  Number(overview?.proposalDeposit === 0) ? (
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
                  label={interactErrors}
                  bg='secondary.500'
                >
                  <Button isDisabled>Sponsor</Button>
                </Tooltip>
              )}
              {proposal?.proposer === address?.toLowerCase() &&
                !proposal?.minionAddress && (
                  <Button
                    variant='outline'
                    onClick={cancelProposal}
                    isLoading={loading}
                  >
                    Cancel
                  </Button>
                )}
              {proposal?.minionAddress &&
                proposal?.proposer === proposal?.minionAddress && (
                  <MinionCancel
                    proposal={proposal}
                    minionAction={minionAction}
                  />
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
                        injectedChain?.chainId,
                        daochain,
                      ) &&
                        canInteract &&
                        memberVote(proposal, address) === null && (
                          <Flex w='48%' justify='space-around'>
                            <IconButton
                              icon={
                                <Flex justiy='center' align='center'>
                                  <Icon boxSize='1.5em' as={FaThumbsUp}></Icon>
                                </Flex>
                              }
                              p={3}
                              size='xl'
                              color='green.500'
                              background='none'
                              borderRadius='40px'
                              borderWidth='1px'
                              borderColor='green.500'
                              borderStyle='solid'
                              _hover={{ cursor: 'pointer' }}
                              _disabled={{
                                borderColor: 'green.900',
                                color: 'green.900',
                                cursor: 'not-allowed',
                                _hover: {
                                  cursor: 'not-allowed',
                                },
                              }}
                              isDisabled={proposal?.executed}
                              onClick={() => submitVote(proposal, 1)}
                            />
                            <IconButton
                              icon={
                                <Flex p={3} justiy='center' align='center'>
                                  <Icon
                                    boxSize='1.5em'
                                    as={FaThumbsDown}
                                  ></Icon>
                                </Flex>
                              }
                              borderRadius='40px'
                              borderWidth='1px'
                              borderColor='red.500'
                              borderStyle='solid'
                              color='red.500'
                              size='xl'
                              background='none'
                              _hover={{ cursor: 'pointer' }}
                              _disabled={{
                                color: 'red.900',
                                borderColor: 'red.900',
                                cursor: 'not-allowed',
                                _hover: {
                                  cursor: 'not-allowed',
                                },
                              }}
                              transform='rotateY(180deg)'
                              isDisabled={proposal?.executed}
                              onClick={() => submitVote(proposal, 2)}
                            />
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
        <Stack>
          {daoConnectedAndSameChain(
            address,
            injectedChain?.chainId,
            daochain,
          ) &&
            proposal?.status === 'ReadyForProcessing' &&
            !injectedProvider?.currentProvider?.safe &&
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

          {((proposal?.status === 'NeedsExecution' &&
            proposal?.minionAddress) ||
            earlyExecuteMinionType(proposal)) &&
            proposal?.status !== 'ReadyForProcessing' && (
              <Stack mt='15px' justify='center'>
                {(proposal?.status === 'NeedsExecution' &&
                  proposal?.minionAddress) ||
                (quorumNeeded && proposal.yesShares >= quorumNeeded) ? (
                  <MinionExecute
                    hideMinionExecuteButton={hideMinionExecuteButton}
                    minionAction={minionAction}
                    proposal={proposal}
                    early={
                      earlyExecuteMinionType(proposal) &&
                      proposal.yesShares >= quorumNeeded &&
                      !proposal?.processed
                    }
                  />
                ) : (
                  quorumNeeded &&
                  isMinionProposalType(proposal) && (
                    <Text size='sm' textAlign='center' maxW='60%' m='auto'>
                      {proposal?.minion?.minQuorum}% quorum or{' '}
                      {utils.commify(quorumNeeded)} shares needed for Early
                      Execution
                    </Text>
                  )
                )}
              </Stack>
            )}
          {proposal?.minion?.crossChainMinion &&
            proposal?.executed &&
            proposal?.minionExecuteActionTx && (
              <CrossChainMinionExecute chainID={daochain} proposal={proposal} />
            )}
          {proposal?.escrow &&
            (proposal?.status === 'Failed' ||
              proposal?.status === 'Cancelled') && (
              <Flex justify='center'>
                <EscrowActions proposal={proposal} />
              </Flex>
            )}
        </Stack>
      </ContentBox>
    </>
  );
};

export default ProposalActions;
