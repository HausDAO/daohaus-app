import React from 'react';
import { Box, Button, Flex, Icon, Skeleton } from '@chakra-ui/core';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import {
  useMemberWallet,
  useDaoGraphData,
  useDao,
  useUser,
  useTxProcessor,
} from '../../contexts/PokemolContext';
import { isAfter, isBefore } from 'date-fns';
import { ethToWei } from '@netgum/utils'; // returns BN

const ProposalVote = ({ proposal }) => {
  const [user] = useUser();
  const [dao] = useDao();
  const [wallet] = useMemberWallet();
  const [daoData] = useDaoGraphData();
  const [txProcessor, updateTxProcessor] = useTxProcessor();
  const currentlyVoting = (proposal) => {
    return (
      isBefore(Date.now(), new Date(+proposal?.votingPeriodEnds * 1000)) &&
      isAfter(Date.now(), new Date(+proposal?.votingPeriodStarts * 1000))
    );
  };

  const txCallBack = (txHash, details) => {
    console.log('txCallBack', txProcessor);
    if (txProcessor && txHash) {
      txProcessor.setTx(txHash, user.username, details, true, false);
      txProcessor.forceUpdate = true;

      updateTxProcessor(txProcessor);
      // close model here
      // onClose();
      // setShowModal(null);
    }
    if (!txHash) {
      console.log('error: ', details);
    }
  };

  const cancelProposal = async (id) => {
    try {
      const tx = await dao.daoService.moloch.cancelProposal(id);
    } catch (err) {
      console.log('user rejected or transaction failed', err);
    }
  };

  const unlock = async (token) => {
    console.log('unlock ', token);
    try {
      const tx = await dao.daoService.token.unlock(token, txCallBack);
    } catch (err) {
      console.log(err);
    }
  };

  const sponsorProposal = async (id) => {
    console.log('sponsor ', id);
    try {
      const tx = await dao.daoService.moloch.sponsorProposal(id, txCallBack);
    } catch (err) {
      console.log('user rejected or transaction failed', err);
    }
  };

  const submitVote = async (proposal, vote) => {
    try {
      const tx = await dao.daoService.moloch.submitVote(
        proposal.proposalIndex,
        vote,
        ethToWei(wallet.eth),
        txCallBack,
      );
    } catch (e) {
      console.error(`Error processing proposal: ${e.toString()}`);
    }
  };

  const processProposal = async (proposal) => {
    try {
      if (proposal.whitelist) {
        await dao.daoService.moloch.processWhitelistProposal(
          proposal.proposalIndex,
          txCallBack,
        );
      } else if (proposal.guildkick) {
        console.log('guildkick process');

        await dao.daoService.moloch.processGuildKickProposal(
          proposal.proposalIndex,
          txCallBack,
        );
      } else {
        await dao.daoService.moloch.processProposal(
          proposal.proposalIndex,
          txCallBack,
        );
      }
    } catch (e) {
      console.error(`Error processing proposal: ${e.toString()}`);
    }
  };

  // TODO disable Process button if another proposal needs processing?

  return (
    <>
      <Box
        rounded='lg'
        bg='blackAlpha.600'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        p={10}
        m={6}
        ml={0}
        w='90%'
      >
        {proposal?.status === 'Unsponsored' && !proposal?.proposalIndex && (
          <Flex justify='center'>
            <Flex direction='column'>
              Balance: {wallet?.tokenBalance} {daoData?.depositToken?.symbol}
              {+wallet?.allowance * 10 ** daoData?.depositToken?.decimals >
              +daoData?.proposalDeposit ? (
                <Button onClick={() => sponsorProposal(proposal.proposalId)}>
                  Sponsor
                </Button>
              ) : (
                <Button
                  onClick={() => unlock(daoData.depositToken.tokenAddress)}
                >
                  Unlock
                </Button>
              )}
            </Flex>
            <Flex>
              {proposal?.proposer === user.username && (
                <Button onClick={() => sponsorProposal(proposal.proposalId)}>
                  Cancel
                </Button>
              )}
            </Flex>
          </Flex>
        )}
        {proposal?.status === 'Unsponsored' &&
          !proposal?.proposalIndex &&
          proposal?.proposer === user.username && (
            <Flex justify='center'>
              <Flex direction='column'>
                <Button onClick={() => sponsorProposal(proposal.proposalId)}>
                  Sponsor
                </Button>
              </Flex>
            </Flex>
          )}
        {(proposal?.status !== 'Unsponsored' || proposal?.proposalIndex) &&
          proposal?.status !== 'Cancelled' && (
            <>
              <Flex mb={6} w='100%'>
                {currentlyVoting(proposal) ? (
                  <>
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
                          _hover={{ cursor: 'ponter' }}
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
                          _hover={{ cursor: 'ponter' }}
                          onClick={() => submitVote(proposal, 2)}
                        />
                      </Flex>
                    </Flex>
                    <Flex justify='flex-end' align='center' w='50%'>
                      <Box as='i' fontSize='xs'>
                        Currently Passing
                      </Box>
                    </Flex>
                  </>
                ) : (
                  <>
                    <Flex justify='center' align='center' w='100%'>
                      <Skeleton isLoaded={proposal?.status}>
                        <Box fontSize='lg' fontFamily='heading'>
                          {proposal?.status === 'Failed' && 'Failed'}
                          {proposal?.status === 'Passed' && 'Passed'}
                        </Box>
                      </Skeleton>
                    </Flex>
                  </>
                )}
              </Flex>
              <Box
                w='100%'
                h='20px'
                borderRadius='6px'
                backgroundColor='white'
                display='flex'
                flexDirection='row'
              >
                {+proposal?.yesVotes > 0 && (
                  <Box
                    w={`${(+proposal?.yesVotes /
                      (+proposal.yesVotes + +proposal.noVotes)) *
                      100}%`}
                    h='100%'
                    backgroundColor='green.500'
                    borderRadius='6px'
                  />
                )}
                {+proposal?.noVotes > 0 && (
                  <Box
                    w={`${(+proposal?.noVotes /
                      (+proposal.yesVotes + +proposal.noVotes)) *
                      100}%`}
                    h='100%'
                    backgroundColor='red.500'
                    borderRadius='6px'
                  />
                )}
              </Box>
              <Flex justify='space-between' mt={3}>
                <Skeleton isLoaded={proposal?.yesVotes}>
                  <Box fontFamily='space' fontWeight={700}>
                    {proposal?.yesVotes || '0'} Yes
                  </Box>
                </Skeleton>
                <Skeleton isLoaded={proposal?.noVotes}>
                  <Box fontFamily='space' fontWeight={700}>
                    {proposal?.noVotes || '0'} No
                  </Box>
                </Skeleton>
              </Flex>
            </>
          )}
        {proposal?.status === 'ReadyForProcessing' && (
          <Flex justify='center' pt='10px'>
            <Flex direction='column'>
              <Button onClick={() => processProposal(proposal)}>Process</Button>
            </Flex>
          </Flex>
        )}
      </Box>
    </>
  );
};

export default ProposalVote;
