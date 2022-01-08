import Web3, { utils as Web3Utils } from 'web3';
import abiDecoder from 'abi-decoder';
import { createContract } from './contract';
import { fetchABI, getMinionAbi } from './abi';
import { MINION_TYPES, PROPOSAL_TYPES } from './proposalUtils';
import { chainByID, getScanKey } from './chain';
import { TX } from '../data/contractTX';

export const MINION_ACTION_FUNCTION_NAMES = {
  VANILLA_MINION: 'actions',
  [MINION_TYPES.VANILLA]: 'actions',
  NIFTY_MINION: 'actions',
  [MINION_TYPES.NIFTY]: 'actions',
  SAFE_MINION: 'actions',
  [MINION_TYPES.SAFE]: 'actions',
  UBERHAUS_MINION: 'appointments',
  [MINION_TYPES.UBER]: 'appointments',
  SUPERFLUID_MINION: 'streams',
  [MINION_TYPES.SUPERFLUID]: 'streams',
};

export const SHOULD_DECODE = {
  [MINION_TYPES.NIFTY]: true,
  [MINION_TYPES.VANILLA]: true,
};

export const SHOULD_MULTI_DECODE = {
  [MINION_TYPES.SAFE]: true,
};

const getUHAction = proposalType => {
  return proposalType === PROPOSAL_TYPES.MINION_UBER_DEL
    ? 'appointments'
    : 'actions';
};

export const getProxiedAddress = async (abi, to, daochain) => {
  try {
    const rpcUrl = chainByID(daochain).rpc_url;
    const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
    const contract = new web3.eth.Contract(abi, to);
    const implAddress = await contract.methods.implementation().call();
    return implAddress;
  } catch (error) {
    console.log('Error getting Proxy implementation', error);
  }
};

//  Poorly named
export const decodeFromEtherscan = async (action, { chainID }) => {
  const key = getScanKey(chainID);
  const url = `${chainByID(chainID).abi_api_url}${action.proxyTo ||
    action.to}${key && `&apikey=${key}`}`;
  const response = await fetch(url);
  return response.json();
};

export const buildEthTransferAction = action => ({
  name: 'ETH Transfer',
  params: [
    {
      name: 'value',
      type: 'uint256',
      value: Web3Utils.toBN(action.value).toString(),
    },
  ],
});

export const isEthTransfer = action => action?.data?.slice(2)?.length === 0;

export const decodeAction = async (action, params) => {
  if (isEthTransfer(action)) {
    return buildEthTransferAction(action);
  }
  const { chainID } = params || {};
  const { to, data } = action || {};
  const targetContractABI = await fetchABI(to, chainID);
  abiDecoder.addABI(targetContractABI);
  return abiDecoder.decodeMethod(data);
};

export const decodeMultiAction = () => {};

export const handleDecode = async (action, params) => {
  if (params.minionType === MINION_TYPES.SAFE) {
    return decodeMultiAction(action, params);
  }

  return decodeAction(action, params);
};

export const getMinionAction = async params => {
  const {
    minionAddress,
    proposalId,
    chainID,
    minionType,
    proposalType,
  } = params;
  const abi = getMinionAbi(minionType);
  const actionName =
    minionType === MINION_TYPES.UBERHAUS_MINION
      ? getUHAction(proposalType)
      : MINION_ACTION_FUNCTION_NAMES[minionType];
  console.log(`actionName`, actionName);
  try {
    const minionContract = createContract({
      address: minionAddress,
      abi,
      chainID,
    });
    const action = await minionContract.methods[actionName](proposalId).call();

    if (SHOULD_DECODE[minionType]) {
      const decoded = await decodeAction(action, params);
      return { ...action, decoded };
    }
    if (SHOULD_MULTI_DECODE[minionType]) {
      //  Do multi-stuff
      return action;
    }
    return action;
  } catch (error) {
    console.error(error);
  }
};

export const earlyExecuteMinionType = proposal =>
  proposal?.minion?.minionType === MINION_TYPES.NIFTY ||
  proposal?.minion?.minionType === MINION_TYPES.SAFE;

export const getExecuteAction = ({ minion }) => {
  const { minionType } = minion;

  if (
    minionType === MINION_TYPES.VANILLA ||
    minionType === MINION_TYPES.NIFTY
  ) {
    return TX.MINION_SIMPLE_EXECUTE;
  }
};
