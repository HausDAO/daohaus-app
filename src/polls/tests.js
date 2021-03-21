import { BigNumber } from 'ethers';
import { hashMaker, memberVote } from '../utils/proposalUtils';

export const submitProposalTest = (data, shouldEqual, pollId) => {
  if (data.proposals) {
    const recentProposalHashes = data.proposals.map((proposal) =>
      hashMaker(proposal),
    );
    return recentProposalHashes.includes(shouldEqual);
  } else {
    clearInterval(pollId);
    throw new Error(
      `Poll test did recieve the expected results from the graph: ${data}`,
    );
  }
};

export const tokenAllowanceTest = (data, shouldEqual, pollId) => {
  return BigNumber.from(data).gte(shouldEqual);
};

export const molochSummonTest = (data, shouldEqual, pollId) => {
  if (data.moloches) {
    return data.moloches.length > 0;
  } else {
    clearInterval(pollId);
    throw new Error(`Bad query, clearing poll: ${data}`);
  }
};

export const minonSummonTest = (data, shouldEqual, pollId) => {
  if (data.moloch) {
    return data.moloch.minions.length > 0;
  } else {
    clearInterval(pollId);
    throw new Error(`Bad query, clearing poll: ${data}`);
  }
};

export const minonProposalTest = (data, shouldEqual, pollId) => {
  if (data.minions && data.minions[0]) {
    return data.minions[0].proposals.length > 0;
  } else {
    clearInterval(pollId);
    throw new Error(`Bad query, clearing poll: ${data}`);
  }
};

export const rageQuitTest = (data, shouldEqual, pollId) => {
  if (data.moloch) {
    return data.moloch.rageQuits.length > 0;
  } else {
    clearInterval(pollId);
    throw new Error(`Bad query, clearing poll: ${data}`);
  }
};

export const sponsorProposalTest = (data, shouldEqual, pollId) => {
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

export const submitVoteTest = (data, shouldEqual, pollId) => {
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

export const processProposalTest = (data, shouldEqual, pollId) => {
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

export const cancelProposalTest = (data, shouldEqual, pollId) => {
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

export const minionExecuteTest = async (executed, shouldEqual, pollId) => {
  return executed === shouldEqual;
};

export const collectTokenTest = (graphBalance, oldBalance, pollId) => {
  if (graphBalance) {
    return graphBalance !== oldBalance;
  } else {
    clearInterval(pollId);
    throw new Error(
      `Poll for collect tokens did not recieve new value from the graph`,
    );
  }
};

export const withdrawTokenTest = (data, shouldEqual = 0, pollId) => {
  if (data) {
    return +data === shouldEqual;
  } else {
    clearInterval(pollId);
    throw new Error(
      `Poll test did recieve the expected results from the graph: ${data}`,
    );
  }
};

export const guildFundTest = (data, shouldEqual, pollId) => {
  if (data) {
    return +data === shouldEqual;
  } else {
    clearInterval(pollId);
    throw new Error(
      `Poll test did recieve the expected results from the graph: ${data}`,
    );
  }
};

export const updateDelegateTest = (data, shouldEqual, pollId) => {
  if (data) {
    return data.delegateKey.toLowerCase() === shouldEqual.toLowerCase();
  } else {
    clearInterval(pollId);
    throw new Error(
      `Poll test did recieve the expected results from the graph: ${data}`,
    );
  }
};

export const uberHausDelegateSetTest = (data, shouldEqual, pollId) => {
  if (data) {
    return data.delegateKey.toLowerCase() === shouldEqual.toLowerCase();
  } else {
    clearInterval(pollId);
    throw new Error(
      `Poll test did recieve the expected results from the graph: ${data}`,
    );
  }
};
