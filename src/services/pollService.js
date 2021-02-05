import { BigNumber } from 'ethers';
import { graphQuery } from '../utils/apollo';
import { PROPOSALS_LIST } from '../graphQL/proposal-queries';
import { DAO_POLL, HOME_DAO } from '../graphQL/dao-queries';
import { getGraphEndpoint } from '../utils/chain';
import { hashMaker, memberVote } from '../utils/proposalUtils';
import { TokenService } from '../services/tokenService';
import { MolochService } from './molochService';

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

const pollMolochSummon = async ({ chainID, summoner, createdAt }) => {
  return await graphQuery({
    endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
    query: DAO_POLL,
    variables: {
      summoner,
      createdAt,
    },
  });
};

const pollBabe = async ({ chainID, daoID, daoVersion, tokenAddress }) => {
  console.log('chainID', chainID);
  console.log('daoID', daoID);
  console.log('daoVersion', daoVersion);
  console.log('tokenAddress', tokenAddress);

  // const BABE = '0x000000000000000000000000000000000000baBe';
  try {
    //   const babeBalance = await MolochService({
    //     chainID,
    //     daoAddress: daoID,
    //     version: daoVersion,
    //   })('getUserTokenBalance')({
    //     userAddress: BABE,
    //     tokenAddress,
    //   });
    const daoOverview = await graphQuery({
      endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
      query: HOME_DAO,
      variables: {
        contractAddr: daoID,
      },
    });
    console.log('daoOverview', daoOverview);
    const graphBalance = daoOverview?.moloch?.tokenBalances?.find(
      (tokenObj) => tokenObj?.token?.tokenAddress === tokenAddress,
    )?.tokenBalance;
    return graphBalance;
  } catch (error) {
    return error;
  }
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

const molochSummonTest = (data, shouldEqual, pollId) => {
  console.log('new moloch: ', data);
  // could we pass this value back?
  if (data.moloches) {
    return data.moloches.length > 0;
  } else {
    console.log('no data.moloches');
    clearInterval(pollId);
    throw new Error(`Bad query, clearing poll: ${data}`);
  }
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

const collectTokenTest = (graphBalance, oldBalance, pollId) => {
  console.log('graphBalance', graphBalance);
  console.log('oldBalance', oldBalance);
  // console.log('babeBalance', babeBalance);
  // console.log('tokenContractVal', tokenContractVal);
  console.log('pollId', pollId);
  if (graphBalance) {
    return graphBalance !== oldBalance;
  } else {
    clearInterval(pollId);
    throw new Error(
      `Poll for collect tokens did not recieve new value from the graph`,
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
  } else if (
    action === 'submitProposal' ||
    action === 'submitWhitelistProposal' ||
    action === 'submitGuildKickProposal'
  ) {
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
  } else if (action === 'summonMoloch') {
    return ({ chainID, summoner, createdAt, actions }) => (txHash) => {
      startPoll({
        pollFetch: pollMolochSummon,
        testFn: molochSummonTest,
        shouldEqual: { summoner, createdAt },
        args: { chainID, summoner, createdAt },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: `DAO summoned`,
          unresolvedMsg: `Summoning DAO`,
          successMsg: `A New DAO has Risen on ${chainID}`,
          errorMsg: `Error summoning DAO on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { chainID, summoner, createdAt },
        });
      }
    };
  } else if (action === 'collectTokens') {
    return ({ token, actions, chainID, daoID }) => (txHash) => {
      console.log('Poll Args: token', token);
      console.log('Poll Args: actions', actions);
      console.log('Poll Args: chainID', chainID);
      console.log('Poll Args: daoID', daoID);
      console.log('Poll Args: txHash', txHash);

      if (!token?.contractBalances?.token)
        throw new Error(
          `token object does not contain .contractBalances.token`,
        );
      if (!token?.moloch?.version)
        throw new Error(`token object does not contain .moloch.version`);

      startPoll({
        pollFetch: pollBabe,
        testFn: collectTokenTest,
        shouldEqual: token.tokenBalance,
        args: {
          chainID,
          daoID,
          daoVersion: token?.moloch?.version,
          tokenAddress: token?.tokenAddress,
        },
        actions,
        txHash,
      });
      cachePoll({
        txHash,
        action,
        timeSent: Date.now(),
        status: 'unresolved',
        resolvedMsg: `Token Value Synced`,
        unresolvedMsg: `Syncing Token Value`,
        successMsg: `Token value has been synced`,
        errorMsg: `Error syncing token value`,
        pollData: {
          action,
          interval,
          tries,
        },
        pollArgs: {
          chainID,
          daoID,
          token,
        },
      });
    };
  }
};
