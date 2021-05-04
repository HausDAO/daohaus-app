import { BigNumber } from 'ethers';
import { hashMaker, memberVote } from '../utils/proposalUtils';

export const submitProposalTest = (data, shouldEqual, pollId) => {
  if (data.proposals) {
    const recentProposalHashes = data.proposals.map(proposal =>
      hashMaker(proposal),
    );
    return recentProposalHashes.includes(shouldEqual);
  }
  clearInterval(pollId);
  throw new Error(
    `Poll test did recieve the expected results from the graph: ${data}`,
  );
};

export const tokenAllowanceTest = (data, shouldEqual) => {
  return BigNumber.from(data).gte(shouldEqual);
};

export const molochSummonTest = (data, shouldEqual, pollId) => {
  if (data.moloches) {
    return data.moloches.length > 0;
  }
  clearInterval(pollId);
  throw new Error(`Bad query, clearing poll: ${data}`);
};

export const minonSummonTest = (data, shouldEqual, pollId) => {
  if (data.moloch) {
    return data.moloch.minions.length > 0;
  }
  clearInterval(pollId);
  throw new Error(`Bad query, clearing poll: ${data}`);
};

export const minonProposalTest = (data, shouldEqual, pollId) => {
  if (data.minions && data.minions[0]) {
    return data.minions[0].proposals.length > 0;
  }
  clearInterval(pollId);
  throw new Error(`Bad query, clearing poll: ${data}`);
};

export const rageQuitTest = (data, shouldEqual, pollId) => {
  if (data.moloch) {
    return data.moloch.rageQuits.length > 0;
  }
  clearInterval(pollId);
  throw new Error(`Bad query, clearing poll: ${data}`);
};

export const sponsorProposalTest = (data, shouldEqual, pollId) => {
  if (data.proposals) {
    const proposal = data.proposals.find(
      proposal => proposal.proposalId === shouldEqual,
    );
    return proposal?.sponsored;
  }
  clearInterval(pollId);
  throw new Error(
    `Poll test did recieve the expected results from the graph: ${data}`,
  );
};

export const submitVoteTest = (data, shouldEqual, pollId) => {
  const [proposalId, userAddress] = shouldEqual;
  if (data.proposals) {
    const proposal = data.proposals.find(
      proposal => proposal.proposalId === proposalId,
    );
    return memberVote(proposal, userAddress) !== null;
  }
  clearInterval(pollId);
  throw new Error(
    `Poll test did recieve the expected results from the graph: ${data}`,
  );
};

export const processProposalTest = (data, shouldEqual, pollId) => {
  if (data.proposals) {
    const proposal = data.proposals.find(
      proposal => proposal.proposalIndex === shouldEqual,
    );
    return proposal?.processed;
  }
  clearInterval(pollId);
  throw new Error(
    `Poll test did recieve the expected results from the graph: ${data}`,
  );
};

export const cancelProposalTest = (data, shouldEqual, pollId) => {
  if (data.proposals) {
    const proposal = data.proposals.find(
      proposal => proposal.proposalId === shouldEqual,
    );
    return proposal?.cancelled;
  }
  clearInterval(pollId);
  throw new Error(
    `Poll test did recieve the expected results from the graph: ${data}`,
  );
};

export const minionExecuteTest = (data, shouldEqual, pollId) => {
  if (data !== null || data !== undefined) {
    return data === shouldEqual;
  }
  clearInterval(pollId);
  console.error(
    `Poll test did recieve the expected results from contract: ${data}`,
  );
  return null;
};

export const collectTokenTest = (graphBalance, oldBalance, pollId) => {
  if (graphBalance) {
    return graphBalance !== oldBalance;
  }
  clearInterval(pollId);
  throw new Error(
    'Poll for collect tokens did not recieve new value from the graph',
  );
};

export const withdrawTokenTest = (data, shouldEqual = 0, pollId) => {
  if (data) {
    // eslint-disable-next-line
    return data == shouldEqual;
  }
  clearInterval(pollId);
  throw new Error(
    `Poll test did recieve the expected results from the graph: ${data}`,
  );
};

export const guildFundTest = (data, shouldEqual, pollId) => {
  if (data) {
    // eslint-disable-next-line
    return data == shouldEqual;
  }
  clearInterval(pollId);
  throw new Error(
    `Poll test did recieve the expected results from the graph: ${data}`,
  );
};

export const updateDelegateTest = (data, shouldEqual, pollId) => {
  if (data) {
    return data.delegateKey.toLowerCase() === shouldEqual.toLowerCase();
  }
  clearInterval(pollId);
  throw new Error(
    `Poll test did recieve the expected results from the graph: ${data}`,
  );
};

export const uberHausDelegateSetTest = (data, shouldEqual, pollId) => {
  if (data) {
    return data.delegateKey.toLowerCase() === shouldEqual.toLowerCase();
  }
  clearInterval(pollId);
  throw new Error(
    `Poll test did recieve the expected results from the graph: ${data}`,
  );
};

export const checkDelRewardsTest = (data, shouldEqual, pollId) => {
  if (data) {
    return data?.rewarded === true;
  }
  clearInterval(pollId);
  throw new Error(
    `Poll test did recieve the expected results from the graph: ${data}`,
  );
};

export const rageKickTest = data => {
  return data.members[0].loot === '0';
};

export const wrapNZapSummonTest = data => {
  return data?.wrapNZaps?.length > 0;
};
