import { BigNumber } from 'ethers';
import { graphQuery } from '../utils/apollo';
import { PROPOSALS_LIST } from '../graphQL/proposal-queries';
import { DAO_POLL } from '../graphQL/dao-queries';
import { getGraphEndpoint } from '../utils/chain';
import { hashMaker } from '../utils/proposalUtils';
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

const pollMolochSummon = async ({ chainID, summoner, summoningTime }) => {
  await graphQuery({
    endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
    query: DAO_POLL,
    variables: {
      summoner,
      summoningTime,
    },
  });
};

/// //////////TESTS///////////////
const proposalTest = (data, shouldEqual, pollId) => {
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
  // should this match proposalTest and clear the interval?
  return data && data.moloches.length > 0;
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
        testFn: proposalTest,
        shouldEqual: hash,
        args: { daoID, chainID },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
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
  } else if (action === 'summonMoloch') {
    return ({ chainID, summoner, summoningTime, actions }) => (txHash) => {
      startPoll({
        pollFetch: pollMolochSummon,
        testFn: molochSummonTest,
        // not really needed, just checking to see if we get an entity at all
        shouldEqual: { summoner, summoningTime },
        args: { chainID, summoner, summoningTime },
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
          pollArgs: { chainID, summoner, summoningTime },
        });
      }
    };
  }
};
