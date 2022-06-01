import { BigNumber } from 'ethers';

export const testTXHash = (data, shouldEqual, pollId) => {
  if (data) {
    return data?.molochTransaction?.id === shouldEqual;
  }
  clearInterval(pollId);
  throw new Error(
    'Did not receive results from the graph based on the given transaction hash',
  );
};

export const testPosterTXHash = (data, shouldEqual, pollId) => {
  if (data) {
    return data?.contents?.[0]?.transactionHash === shouldEqual;
  }
  clearInterval(pollId);
  throw new Error(
    'Did not receive results from the graph based on the given transaction hash',
  );
};

export const testWrapNZap = (data, shouldEqual, pollId) => {
  if (data) {
    return data === shouldEqual;
  }
  clearInterval(pollId);
  throw new Error('Did not receive results from the Wrap N Zap transaction.');
};

export const tokenAllowanceTest = (data, shouldEqual) => {
  return BigNumber.from(data).gte(shouldEqual);
};

export const tokenApprovedTest = (data, shouldEqual) => {
  return data === shouldEqual;
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

export const withdrawTokenTest = (data, shouldEqual = 0, pollId) => {
  if (data) {
    // eslint-disable-next-line
    return data == shouldEqual;
  }
  clearInterval(pollId);
  throw new Error(
    `Poll test did not recieve the expected results from the graph: ${data}`,
  );
};

export const guildFundTest = (data, shouldEqual, pollId) => {
  if (data) {
    // eslint-disable-next-line
    return data == shouldEqual;
  }
  clearInterval(pollId);
  throw new Error(
    `Poll test did not recieve the expected results from the graph: ${data}`,
  );
};

export const checkDelRewardsTest = (data, shouldEqual, pollId) => {
  if (data) {
    return data?.rewarded === true;
  }
  clearInterval(pollId);
  throw new Error(
    `Poll test did not recieve the expected results from the graph: ${data}`,
  );
};

export const wrapNZapSummonTest = data => {
  return data?.wrapNZaps?.length > 0;
};

export const transmutationSummonTest = data => {
  return data?.transmutations?.length > 0;
};

export const superTokenTest = (data, shouldEqual, pollId) => {
  if (data.tokens) {
    return data.tokens.length > 0 === shouldEqual;
  }
  clearInterval(pollId);
  throw new Error(
    `Poll test did not recieve the expected results from the graph: ${data}`,
  );
};
