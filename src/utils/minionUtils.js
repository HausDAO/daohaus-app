import { getMinionAbi } from './abi';
import { createContract } from './contract';

export const getMinionAction = async ({
  minionAddress,
  proposalId,
  chainID,
  abi,
}) => {
  try {
    const minionContract = createContract({
      address: minionAddress,
      abi,
      chainID,
    });
    const result = await minionContract.methods.actions(proposalId).call();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const decodeAction = () => {};
