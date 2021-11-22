import { getMinionAbi } from './abi';
import { createContract } from './contract';

export const getMinionAction = async ({ proposal, chainID }) => {
  try {
    const { minion, minionAddress, proposalId } = proposal;
    const minionContract = createContract({
      address: minionAddress,
      abi: getMinionAbi(minion.minionType),
      chainID,
    });
    const result = await minionContract.methods.actions(proposalId).call();
    return result;
  } catch (error) {
    console.error(error);
  }
};
