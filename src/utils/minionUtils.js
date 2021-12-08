import { createContract } from './contract';

export const MINION_ACTION_FUNCTION_NAMES = {
  VANILLA_MINION: 'actions',
  SAFE_MINION: 'actions',
  UBERHAUS_MINION: 'appointments',
  SUPERFLUID_MINION: 'streams',
};

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
