import { BigNumber } from 'ethers';
import { graphQuery } from '../utils/apollo';
import { PROPOSALS_LIST } from '../graphQL/proposal-queries';
import {
  DAO_POLL,
  MINION_POLL,
  HOME_DAO,
  RAGE_QUIT_POLL,
  MINION_PROPOSAL_POLL,
} from '../graphQL/dao-queries';
import { getGraphEndpoint } from '../utils/chain';
import { hashMaker, memberVote, PROPOSAL_TYPES } from '../utils/proposalUtils';
import { TokenService } from '../services/tokenService';
import { MEMBERS_LIST, MEMBER_DELEGATE_KEY } from '../graphQL/member-queries';
import { MinionService } from './minionService';
import { UberHausMinionService } from './uberHausMinionService';

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

const pollMinionSummon = async ({ chainID, molochAddress, createdAt }) => {
  return await graphQuery({
    endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
    query: MINION_POLL,
    variables: {
      molochAddress,
      createdAt,
    },
  });
};

const pollMinionProposal = async ({ chainID, minionAddress, createdAt }) => {
  return await graphQuery({
    endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
    query: MINION_PROPOSAL_POLL,
    variables: {
      minionAddress,
      createdAt,
    },
  });
};

const pollMinionExecute = async ({
  chainID,
  minionAddress,
  proposalId,
  proposalType,
}) => {
  try {
    if (proposalType === PROPOSAL_TYPES.MINION_VANILLA) {
      const action = await MinionService({
        minion: minionAddress,
        chainID,
      })('getAction')({ proposalId });
      console.log(action);
      return action.executed;
    } else if (proposalType === PROPOSAL_TYPES.MINION_UBER_STAKE) {
      const action = await UberHausMinionService({
        minion: minionAddress,
        chainID,
      })('getAction')({ proposalId });
      console.log(action);
      return action.executed;
    } else if (proposalType === PROPOSAL_TYPES.MINION_UBER_DEL) {
      const action = await UberHausMinionService({
        minion: minionAddress,
        chainID,
      })('getAppointment')({ proposalId });
      console.log(action);
      return action.executed;
    }
  } catch (error) {
    console.log(chainID, minionAddress, proposalId, proposalType);
    console.error('Error caught in Poll block of TX:', error);
  }
};

const pollRageQuit = async ({ chainID, molochAddress, createdAt }) => {
  return await graphQuery({
    endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
    query: RAGE_QUIT_POLL,
    variables: {
      molochAddress,
      createdAt,
    },
  });
};

const syncTokenPoll = async ({ chainID, daoID, tokenAddress }) => {
  try {
    const daoOverview = await graphQuery({
      endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
      query: HOME_DAO,
      variables: {
        contractAddr: daoID,
      },
    });
    const graphBalance = daoOverview?.moloch?.tokenBalances?.find(
      (tokenObj) => tokenObj?.token?.tokenAddress === tokenAddress,
    )?.tokenBalance;
    return graphBalance;
  } catch (error) {
    return error;
  }
};

const withdrawTokenFetch = async ({
  chainID,
  daoID,
  memberAddress,
  tokenAddress,
}) => {
  try {
    const data = await graphQuery({
      endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
      query: MEMBERS_LIST,
      variables: {
        contractAddr: daoID,
      },
    });
    const member = data.daoMembers?.find(
      (member) => member?.memberAddress?.toLowerCase() === memberAddress,
    );
    const newTokenBalance = member.tokenBalances.find(
      (tokenObj) => tokenObj.token.tokenAddress === tokenAddress,
    ).tokenBalance;
    return newTokenBalance;
  } catch (error) {
    return error;
  }
};

const updateDelegateFetch = async ({ daoID, chainID, memberAddress }) => {
  try {
    const res = await graphQuery({
      endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
      query: MEMBER_DELEGATE_KEY,
      variables: {
        contractAddr: daoID,
        memberAddr: memberAddress,
      },
    });
    return res.members[0];
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
  if (data.moloches) {
    return data.moloches.length > 0;
  } else {
    console.log('no data.moloches');
    clearInterval(pollId);
    throw new Error(`Bad query, clearing poll: ${data}`);
  }
};

const minonSummonTest = (data, shouldEqual, pollId) => {
  console.log('new minion: ', data);
  if (data.moloch) {
    return data.moloch.minions.length > 0;
  } else {
    console.log('no data.moloch');
    clearInterval(pollId);
    throw new Error(`Bad query, clearing poll: ${data}`);
  }
};

const minonProposalTest = (data, shouldEqual, pollId) => {
  console.log('minions: ', data);
  if (data.minions && data.minions[0]) {
    return data.minions[0].proposals.length > 0;
  } else {
    console.log('no data.minions');
    clearInterval(pollId);
    throw new Error(`Bad query, clearing poll: ${data}`);
  }
};

const rageQuitTest = (data, shouldEqual, pollId) => {
  console.log('new rage quit: ', data);
  if (data.moloch) {
    return data.moloch.rageQuits.length > 0;
  } else {
    console.log('no data.moloch');
    clearInterval(pollId);
    throw new Error(`Bad query, clearing poll: ${data}`);
  }
};

const sponsorProposalTest = (data, shouldEqual, pollId) => {
  if (data.proposals) {
    const proposal = data.proposals.find(
      (proposal) => proposal.proposalId === shouldEqual,
    );
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
  if (data.proposals) {
    const proposal = data.proposals.find(
      (proposal) => proposal.proposalId === proposalId,
    );
    return memberVote(proposal, userAddress) !== null;
  } else {
    clearInterval(pollId);
    throw new Error(
      `Poll test did recieve the expected results from the graph: ${data}`,
    );
  }
};

const processProposalTest = (data, shouldEqual, pollId) => {
  if (data.proposals) {
    const proposal = data.proposals.find(
      (proposal) => proposal.proposalIndex === shouldEqual,
    );
    return proposal?.processed;
  } else {
    clearInterval(pollId);
    throw new Error(
      `Poll test did recieve the expected results from the graph: ${data}`,
    );
  }
};

const cancelProposalTest = (data, shouldEqual, pollId) => {
  if (data.proposals) {
    const proposal = data.proposals.find(
      (proposal) => proposal.proposalId === shouldEqual,
    );
    return proposal?.cancelled;
  } else {
    clearInterval(pollId);
    throw new Error(
      `Poll test did recieve the expected results from the graph: ${data}`,
    );
  }
};

const minionExecuteTest = async (executed, shouldEqual, pollId) => {
  return executed === shouldEqual;
};

const collectTokenTest = (graphBalance, oldBalance, pollId) => {
  if (graphBalance) {
    return graphBalance !== oldBalance;
  } else {
    clearInterval(pollId);
    throw new Error(
      `Poll for collect tokens did not recieve new value from the graph`,
    );
  }
};

const withdrawTokenTest = (data, shouldEqual = 0, pollId) => {
  if (data) {
    console.log('AT TEST');
    console.log('returned data', data);
    console.log('shouldEqual', shouldEqual);
    return +data === shouldEqual;
  } else {
    clearInterval(pollId);
    throw new Error(
      `Poll test did recieve the expected results from the graph: ${data}`,
    );
  }
};

const updateDelegateTest = (data, shouldEqual, pollId) => {
  if (data) {
    return data.delegateKey.toLowerCase() === shouldEqual.toLowerCase();
  } else {
    clearInterval(pollId);
    throw new Error(
      `Poll test did recieve the expected results from the graph: ${data}`,
    );
  }
};

export const createPoll = ({
  interval = 2000,
  tries = 30,
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
    console.log('IN POLL');
    console.log(`args`, args);
    let tryCount = 0;
    const pollId = setInterval(async () => {
      if (tryCount < tries) {
        try {
          const res = await pollFetch(args);
          const testResult = testFn(res, shouldEqual, pollId);
          console.log(testResult);
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
  } else if (action === 'submitProposalCco') {
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
          resolvedMsg: `Contribution submitted`,
          unresolvedMsg: `Contribution pending`,
          successMsg: `Contribution submission complete`,
          errorMsg: `Error submitting contribution`,
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
      if (!token?.contractBalances?.token)
        throw new Error(
          `token object does not contain .contractBalances.token`,
        );
      if (!token?.moloch?.version)
        throw new Error(`token object does not contain .moloch.version`);

      startPoll({
        pollFetch: syncTokenPoll,
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
      if (cachePoll) {
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
      }
    };
  } else if (action === 'minionProposeAction') {
    return ({ minionAddress, createdAt, chainID, actions }) => (txHash) => {
      startPoll({
        pollFetch: pollMinionProposal,
        testFn: minonProposalTest,
        shouldEqual: createdAt,
        args: { minionAddress, chainID, createdAt },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: `Minion proposal submitted`,
          unresolvedMsg: `Submitting minion proposal`,
          successMsg: `Minion proposal submitted for ${minionAddress} on ${chainID}`,
          errorMsg: `Error submitting minion proposal for ${minionAddress} on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { minionAddress, createdAt, chainID },
        });
      }
    };
  } else if (action === 'uberHausProposeAction') {
    return ({ minionAddress, createdAt, chainID, actions }) => (txHash) => {
      startPoll({
        pollFetch: pollMinionProposal,
        testFn: minonProposalTest,
        shouldEqual: createdAt,
        args: { minionAddress, chainID, createdAt },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: `UberHAUS proposal submitted`,
          unresolvedMsg: `Submitting UberHAUS proposal`,
          successMsg: `UberHAUS proposal submitted for ${minionAddress} on ${chainID}`,
          errorMsg: `Error submitting minion proposal for ${minionAddress} on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { minionAddress, createdAt, chainID },
        });
      }
    };
  } else if (action === 'minionExecuteAction') {
    return ({ chainID, minionAddress, proposalId, actions, proposalType }) => (
      txHash,
    ) => {
      startPoll({
        pollFetch: pollMinionExecute,
        testFn: minionExecuteTest,
        shouldEqual: true,
        args: { chainID, minionAddress, proposalId, proposalType },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: `Minion proposal executed`,
          unresolvedMsg: `Executing minion proposal`,
          successMsg: `Executed minion proposal on ${chainID}`,
          errorMsg: `Error executing minion proposal on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { chainID, minionAddress, proposalId },
        });
      }
    };
  } else if (action === 'transmutationProposal') {
    return ({ daoID, chainID, hash, actions }) => (txHash) => {
      startPoll({
        pollFetch: pollProposals,
        testFn: submitProposalTest,
        shouldEqual: hash,
        args: { daoID, chainID, hash },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: `Transmutation proposal submitted`,
          unresolvedMsg: `Submitting transmutation proposal`,
          successMsg: `A new transmutation proposal has been submitted on ${chainID}`,
          errorMsg: `Error submitting transmutation proposal on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { daoID, chainID, hash },
        });
      }
    };
  } else if (action === 'summonMinion') {
    console.log('action', action);
    return ({ chainID, molochAddress, createdAt, actions }) => (txHash) => {
      startPoll({
        pollFetch: pollMinionSummon,
        testFn: minonSummonTest,
        shouldEqual: { molochAddress, createdAt },
        args: { chainID, molochAddress, createdAt },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: `Minion summoned`,
          unresolvedMsg: `Summoning Minion`,
          successMsg: `A New Minion has Risen on ${chainID}`,
          errorMsg: `Error summoning Minion on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { chainID, molochAddress, createdAt },
        });
      }
    };
  } else if (action === 'withdrawBalance') {
    return ({
      tokenAddress,
      memberAddress,
      actions,
      chainID,
      daoID,
      uber,
      expectedBalance,
    }) => (txHash) => {
      startPoll({
        pollFetch: withdrawTokenFetch,
        testFn: withdrawTokenTest,
        shouldEqual: expectedBalance || 0,
        args: {
          chainID,
          daoID,
          memberAddress,
          tokenAddress,
        },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: `Withdrew Tokens`,
          unresolvedMsg: `Withdrawing tokens`,
          successMsg: `Successfully withdrew tokens!`,
          errorMsg: `There was an error withdrawing tokens`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: {
            chainID,
            daoID,
            memberAddress,
            tokenAddress,
            shouldEqual: uber ? expectedBalance : 0,
          },
        });
      }
    };
  } else if (action === 'ragequit') {
    console.log('action', action);
    return ({ chainID, molochAddress, createdAt, actions }) => (txHash) => {
      startPoll({
        pollFetch: pollRageQuit,
        testFn: rageQuitTest,
        shouldEqual: { molochAddress, createdAt },
        args: { chainID, molochAddress, createdAt },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: `Rage Quit Completed`,
          unresolvedMsg: `Rage Quitting`,
          successMsg: `You Rage Quit`,
          errorMsg: `Error Rage Quitting`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { chainID, molochAddress, createdAt },
        });
      }
    };
  } else if (action === 'ragequitClaim') {
    console.log('action', action);
    return ({ chainID, molochAddress, createdAt, actions }) => (txHash) => {
      startPoll({
        pollFetch: pollRageQuit,
        testFn: rageQuitTest,
        shouldEqual: { molochAddress, createdAt },
        args: { chainID, molochAddress, createdAt },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: `Claim Completed`,
          unresolvedMsg: `Claiming`,
          successMsg: `Claim Completed. You got your $HAUS`,
          errorMsg: `Error Claiming`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { chainID, molochAddress, createdAt },
        });
      }
    };
  } else if (action === 'updateDelegateKey') {
    console.log('action', action);
    return ({ chainID, daoID, memberAddress, delegateAddress, actions }) => (
      txHash,
    ) => {
      startPoll({
        pollFetch: updateDelegateFetch,
        testFn: updateDelegateTest,
        shouldEqual: delegateAddress,
        args: { chainID, daoID, memberAddress },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: `Delegate has been updated`,
          unresolvedMsg: `Updating delegate`,
          successMsg: `Updated delegate address to ${delegateAddress}`,
          errorMsg: `Poll error on updateDelegate`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { chainID, daoID, memberAddress, delegateAddress },
        });
      }
    };
  } else if (action === 'uberHausNominateDelegate') {
    return ({
      chainID,
      minionAddress,
      newDelegateAddress,
      actions,
      createdAt,
    }) => (txHash) => {
      console.log('newDelegateAddress', newDelegateAddress);
      console.log('minionAddress', minionAddress);
      console.log('chainID', chainID);

      startPoll({
        pollFetch: pollMinionProposal,
        testFn: minonProposalTest,
        shouldEqual: newDelegateAddress,
        args: { createdAt, minionAddress, chainID },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: `Created uberHAUS delegate proposal`,
          unresolvedMsg: `Creating proposal`,
          successMsg: `Created uberHAUS delegate proposal`,
          errorMsg: `Poll error on nominateDelegate`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { chainID, minionAddress },
        });
      }
    };
  }
};
