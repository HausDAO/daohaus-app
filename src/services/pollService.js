import { BigNumber } from 'ethers';
import { graphQuery } from '../utils/apollo';
import { PROPOSALS_LIST } from '../graphQL/proposal-queries';
import { getGraphEndpoint } from '../utils/chain';
import { hashMaker, memberVote } from '../utils/proposalUtils';
import { TokenService } from '../services/tokenService';

/// //////////CALLS///////////////
const pollProposals = async ({ daoID, chainID }) =>
  await graphQuery({
    endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
    query: PROPOSALS_LIST,
    variables: {
      contractAddr: daoID,
      skip: 0,
    },
  });

const pollTokenAllowances = async ({
  chainID,
  daoID,
  tokenAddress,
  userAddress,
}) => {
  const tokenContract = TokenService({
    chainID,
    tokenAddress,
  });
  const amountApproved = await tokenContract('allowance')({
    accountAddr: userAddress,
    contractAddr: daoID,
  });
  return amountApproved;
};

/// //////////TESTS///////////////
const submitProposalTest = (data, shouldEqual, pollId) => {
  if (data.proposals) {
    const recentProposalHashes = data.proposals.map((proposal) =>
      hashMaker(proposal),
    );
    console.log(recentProposalHashes);
    return recentProposalHashes.includes(shouldEqual);
  } else {
    clearInterval(pollId);
    throw new Error(
      `Poll test did recieve the expected results from the graph: ${data}`,
    );
  }
};

const tokenAllowanceTest = (data, shouldEqual, pollId) => {
  console.log('new allowance: ', data);
  return BigNumber.from(data).gte(shouldEqual);
};

const sponsorProposalTest = (data, shouldEqual, pollId) => {
  console.log(data);
  console.log('shouldEqual :>> ', shouldEqual);
  if (data.proposals) {
    const proposal = data.proposals.find(
      (proposal) => proposal.proposalId === shouldEqual,
    );
    console.log(proposal);
    return proposal?.sponsored;
  } else {
    clearInterval(pollId);
    throw new Error(
      `Poll test did recieve the expected results from the graph: ${data}`,
    );
  }
};

const submitVoteTest = (data, shouldEqual, pollId) => {
  const [proposalId, userAddress] = shouldEqual;
  console.log(data);
  console.log(proposalId, userAddress);
  if (data.proposals) {
    const proposal = data.proposals.find(
      (proposal) => proposal.proposalId === proposalId,
    );
    console.log(proposal);
    return memberVote(proposal, userAddress) !== null;
  } else {
    clearInterval(pollId);
    throw new Error(
      `Poll test did recieve the expected results from the graph: ${data}`,
    );
  }
};

const processProposalTest = (data, shouldEqual, pollId) => {
  console.log(data);
  console.log(shouldEqual);
  if (data.proposals) {
    const proposal = data.proposals.find(
      (proposal) => proposal.proposalIndex === shouldEqual,
    );
    console.log(proposal);
    return proposal?.processed;
  } else {
    clearInterval(pollId);
    throw new Error(
      `Poll test did recieve the expected results from the graph: ${data}`,
    );
  }
};

const cancelProposalTest = (data, shouldEqual, pollId) => {
  console.log(data);
  console.log(shouldEqual);
  if (data.proposals) {
    const proposal = data.proposals.find(
      (proposal) => proposal.proposalId === shouldEqual,
    );
    console.log(proposal);
    return proposal?.cancelled;
  } else {
    clearInterval(pollId);
    throw new Error(
      `Poll test did recieve the expected results from the graph: ${data}`,
    );
  }
};

export const createPoll = ({
  interval = 2000,
  tries = 20,
  action = null,
  cachePoll = null,
}) => {
  /// ////////////////////GENERIC POLL//////////////////
  const startPoll = ({
    pollFetch,
    testFn,
    shouldEqual,
    args,
    actions,
    txHash,
  }) => {
    // console.log('Poll Started');
    // console.log('pollFetch:', pollFetch);
    // console.log('testFn:', testFn);
    // console.log('shouldEqual:', shouldEqual);
    // console.log('Args:', args);
    // console.log('Actions:', actions);
    // console.log('TX-Hash', txHash);

    let tryCount = 0;
    const pollId = setInterval(async () => {
      if (tryCount < tries) {
        try {
          const res = await pollFetch(args);
          const testResult = testFn(res, shouldEqual, pollId);
          if (testResult) {
            clearInterval(pollId);
            actions.onSuccess(txHash);
            return res;
          } else {
            tryCount++;
          }
        } catch (error) {
          console.error(error);
          actions.onError(error, txHash);
          clearInterval(pollId);
        }
      } else {
        actions.onError('Ran out of tries', txHash);
        clearInterval(pollId);
      }
    }, interval);
    return pollId;
  };

  /// /////////////////ACTIONS//////////////////////////
  if (!action) {
    throw new Error('User must submit an action argument');
  } else if (action === 'submitProposal') {
    return ({ daoID, chainID, hash, actions }) => (txHash) => {
      startPoll({
        pollFetch: pollProposals,
        testFn: submitProposalTest,
        shouldEqual: hash,
        args: { daoID, chainID },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: `Submitted proposal`,
          unresolvedMsg: `Submitting proposal`,
          successMsg: `Proposal Submitted to ${daoID} on ${chainID}`,
          errorMsg: `Error Submitting proposal ${daoID} on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: {
            daoID,
            chainID,
            hash,
          },
        });
      }
    };
  } else if (action === 'unlockToken') {
    return ({
      daoID,
      chainID,
      tokenAddress,
      userAddress,
      unlockAmount,
      actions,
    }) => (txHash) => {
      startPoll({
        pollFetch: pollTokenAllowances,
        testFn: tokenAllowanceTest,
        shouldEqual: unlockAmount,
        args: { daoID, chainID, tokenAddress, userAddress, unlockAmount },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: `Unlocked Token`,
          unresolvedMsg: `Unlocking token`,
          successMsg: `Unlocking token for ${daoID} on ${chainID}`,
          errorMsg: `Error unlocking token for ${daoID} on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: {
            daoID,
            tokenAddress,
            chainID,
            userAddress,
            unlockAmount,
          },
        });
      }
    };
  } else if (action === 'sponsorProposal') {
    return ({ daoID, chainID, proposalId, actions }) => (txHash) => {
      startPoll({
        pollFetch: pollProposals,
        testFn: sponsorProposalTest,
        shouldEqual: proposalId,
        args: { daoID, chainID, proposalId },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: `Sponsored proposal`,
          unresolvedMsg: `Sponsoring proposal`,
          successMsg: `Proposal #${proposalId} Sponsored for ${daoID} on ${chainID}`,
          errorMsg: `Error Sponsoring proposal #${proposalId} for ${daoID} on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: {
            daoID,
            chainID,
            proposalId,
          },
        });
      }
    };
  } else if (action === 'submitVote') {
    return ({ daoID, chainID, proposalId, userAddress, actions }) => (
      txHash,
    ) => {
      startPoll({
        pollFetch: pollProposals,
        testFn: submitVoteTest,
        shouldEqual: [proposalId, userAddress],
        args: { daoID, chainID, proposalId, userAddress },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: `Voted on proposal #${proposalId}`,
          unresolvedMsg: `Voted on proposal #${proposalId}`,
          successMsg: `Voted on proposal #${proposalId} for ${daoID} on ${chainID}`,
          errorMsg: `Error voting on proposal #${proposalId} for ${daoID} on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: {
            daoID,
            chainID,
            proposalId,
            userAddress,
          },
        });
      }
    };
  } else if (action === 'processProposal') {
    return ({ daoID, chainID, proposalIndex, actions }) => (txHash) => {
      startPoll({
        pollFetch: pollProposals,
        testFn: processProposalTest,
        shouldEqual: proposalIndex,
        args: { daoID, chainID, proposalIndex },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: `Processed proposal`,
          unresolvedMsg: `Processing proposal`,
          successMsg: `Proposal #${proposalIndex} Processed for ${daoID} on ${chainID}`,
          errorMsg: `Error Sponsoring proposal #${proposalIndex} for ${daoID} on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: {
            daoID,
            chainID,
            proposalIndex,
          },
        });
      }
    };
  } else if (action === 'cancelProposal') {
    return ({ daoID, chainID, proposalId, actions }) => (txHash) => {
      startPoll({
        pollFetch: pollProposals,
        testFn: cancelProposalTest,
        shouldEqual: proposalId,
        args: { daoID, chainID, proposalId },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: `Cancelled proposal`,
          unresolvedMsg: `Cancelling proposal`,
          successMsg: `Proposal #${proposalId} Cancelled for ${daoID} on ${chainID}`,
          errorMsg: `Error Cancelling proposal #${proposalId} for ${daoID} on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: {
            daoID,
            chainID,
            proposalId,
          },
        });
      }
    };
  }
};
