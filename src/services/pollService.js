import { graphQuery } from '../utils/apollo';
import { PROPOSALS_LIST } from '../graphQL/proposal-queries';
import { getGraphEndpoint } from '../utils/chain';
import { hashMaker } from '../utils/proposalUtils';

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

/// //////////TESTS///////////////
const proposalTest = (data, shouldEqual, pollId) => {
  console.log(data);
  if (data.proposals) {
    const recentProposalHashes = data.proposals
      .slice(0, 10)
      .map((proposal) => hashMaker(proposal));
    console.log(recentProposalHashes);
    return recentProposalHashes.includes(shouldEqual);
  } else {
    clearInterval(pollId);
    throw new Error(
      `Poll test did recieve the expected results from the graph: ${data}`,
    );
  }
};
// console.log("Poll Started");
// console.log("GraphFetch:", graphFetch);
// console.log("testFn:", testFn);
// console.log("shouldEqual:", shouldEqual);
// console.log("Args:", args);
// console.log("Actions:", actions);

export const createPoll = ({ interval = 2000, tries = 20, action = null }) => {
  /// ////////////////////GENERIC POLL//////////////////
  const startPoll = ({ graphFetch, testFn, shouldEqual, args, actions }) => {
    let tryCount = 0;
    const pollId = setInterval(async () => {
      if (tryCount < tries) {
        try {
          const res = await graphFetch(args);
          const testResult = testFn(res, shouldEqual, pollId);
          if (testResult) {
            clearInterval(pollId);
            actions.onSuccess();
            return res;
          } else {
            tryCount++;
          }
        } catch (error) {
          console.error(error);
          actions.onError(error);
          clearInterval(pollId);
        }
      } else {
        actions.onError('Ran out of tries');
        clearInterval(pollId);
      }
    }, interval);
    return pollId;
  };

  /// /////////////////ACTIONS//////////////////////////
  if (!action) {
    throw new Error('User must submit an action argument');
  } else if (action === 'submitProposal') {
    return ({ daoID, chainID, hash, actions }) => () =>
      startPoll({
        graphFetch: pollProposals,
        testFn: proposalTest,
        shouldEqual: hash,
        args: { daoID, chainID },
        actions,
      });
  }
};
