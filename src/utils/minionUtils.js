import Web3, { utils as Web3Utils } from 'web3';
import abiDecoder from 'abi-decoder';
import { createContract } from './contract';
import {
  decodeAMBTx,
  decodeMultisendTx,
  decodeNomadTx,
  fetchABI,
  getMinionAbi,
} from './abi';
import { MINION_TYPES } from './proposalUtils';
import { chainByID, getScanKey } from './chain';
import { BOOSTS } from '../data/boosts';
import { TX } from '../data/txLegos/contractTX';

// If a minion has separate action names (ex. UBER),
// then use Proposal types as a reference to the action name
// If you do use proposal types, DO NOT use minion types or it won't work.
export const MINION_ACTION_FUNCTION_NAMES = {
  VANILLA_MINION: 'actions',
  [MINION_TYPES.VANILLA]: 'actions',
  NIFTY_MINION: 'actions',
  [MINION_TYPES.NIFTY]: 'actions',
  SAFE_MINION: 'actions',
  SAFE_V2_MINION: 'actions',
  [MINION_TYPES.SAFE]: 'actions',
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

export const maxRateLimit = async () => {};

export const fetchActionABI = async (to, chainID, depth) => {
  const targetContractABI = await fetchABI(to, chainID);
  if (targetContractABI?.result === null) {
    return { ...targetContractABI, error: true };
  }

  if (targetContractABI?.result === 'Contract source code not verified') {
    return {
      ...targetContractABI,
      error: true,
      message: targetContractABI?.result,
    };
  }

  if (depth === 5) {
    return {
      ...targetContractABI,
      error: true,
      message: 'Etherscan Error: Max rate limit reached',
    };
  }

  if (targetContractABI?.result === 'Max rate limit reached') {
    return fetchActionABI(to, chainID, depth + 1);
  }

  return targetContractABI;
};

export const decodeAction = async (action, params, depth = 0) => {
  if (isEthTransfer(action)) {
    return buildEthTransferAction(action);
  }
  const { chainID } = params || {};
  const { to, data } = action || {};
  const targetContractABI = await fetchActionABI(to, chainID, depth);
  if (targetContractABI.error) {
    return targetContractABI;
  }
  abiDecoder.addABI(targetContractABI);
  const decodedAction = abiDecoder.decodeMethod(data);
  if (decodedAction.name === 'callAgreement') {
    return {
      ...decodedAction,
      actions: [
        {
          to: decodedAction.params[0].value,
          data: await decodeAction(
            {
              to: decodedAction.params[0].value,
              data: decodedAction.params[1].value,
            },
            {
              chainID,
            },
            depth + 1,
          ),
          value: '0',
        },
      ],
    };
  }
  return decodedAction;
};

export const decodeBundledMultiAction = async (
  chainID,
  decodedActions,
  decodedBundledTx,
) => {
  return {
    ...decodedActions,
    actions: [
      {
        ...decodedActions.actions[0],
        actions: await Promise.all(
          decodeMultisendTx(decodedBundledTx.to, decodedBundledTx.data).map(
            async action => ({
              ...action,
              data: await decodeAction(action, { chainID }),
            }),
          ),
        ),
      },
    ],
  };
};

export const decodeMultiAction = async ([encodedMulti], params) => {
  const { chainID } = params;
  const chainConfig = chainByID(chainID);
  const multiSendAddress = chainConfig.safeMinion.safe_mutisend_addr;

  //   SINGLE ARRAY VERSION

  const decodedActions = {
    ...encodedMulti,
    actions: await Promise.all(
      decodeMultisendTx(multiSendAddress, encodedMulti.data).map(
        async action => ({
          ...action,
          data: await decodeAction(action, params),
        }),
      ),
    ),
  };
  if (decodedActions.actions[0]?.data?.name === 'requireToPassMessage') {
    // cross-chain AMB bridge call
    const [contract, data] = decodedActions.actions[0].data.params;
    const ambDecodedTx = decodeAMBTx(contract.value, data.value);
    return await decodeBundledMultiAction(
      params.foreignChainId,
      decodedActions,
      ambDecodedTx,
    );
  }
  if (
    decodedActions.actions[0]?.data?.name === 'dispatch' &&
    chainConfig.zodiac_nomad_module?.homeContract &&
    decodedActions.actions[0]?.to ===
      chainConfig.zodiac_nomad_module.homeContract
  ) {
    // cross-chain Nomad bridge call
    const [
      ,
      recipientAddress,
      messageBody,
    ] = decodedActions.actions[0].data.params;
    const nomadDecodedTx = decodeNomadTx(
      recipientAddress.value,
      messageBody.value,
    );
    return await decodeBundledMultiAction(
      params.foreignChainId,
      decodedActions,
      nomadDecodedTx,
    );
  }
  return decodedActions;

  //  CODE REVIEW
  //  Question for Sam
  //  Why does the data structure come in as nested arrays?
  //  Could there be more than one collection of transactions?
  //  If not, I clean this up a lot.

  //  NESTED ARRAY VERSION
  // const multiCalls = actions.map(multiCall => ({
  //   ...multiCall,
  //   actions: decodeMultisendTx(multiSendAddress, multiCall.data),
  // }));
  // const decoded = await Promise.all(
  //   multiCalls.map(async multiCall => {
  //     const decodedTx = await Promise.all(
  //       multiCall.actions.map(async action => ({
  //         ...action,
  //         data: await decodeAction(action, params),
  //       })),
  //     );
  //     return { ...multiCall, actions: decodedTx };
  //   }),
  // );
  // return decoded;
};

export const getMinionAction = async params => {
  const {
    minionAddress,
    proposalId,
    chainID,
    minionType,
    proposalType,
    actions,
    safeMinionVersion,
  } = params;

  const abi = getMinionAbi(minionType, safeMinionVersion || '1');
  const actionName =
    MINION_ACTION_FUNCTION_NAMES[minionType] ||
    MINION_ACTION_FUNCTION_NAMES[proposalType];

  try {
    const minionContract = createContract({
      address: minionAddress,
      abi,
      chainID,
    });
    const action = await minionContract.methods[actionName](proposalId).call();

    if (SHOULD_DECODE[minionType] || SHOULD_DECODE[proposalType]) {
      const decoded = await decodeAction(action, params);
      return { ...action, decoded };
    }
    if (SHOULD_MULTI_DECODE[minionType]) {
      const decoded = await decodeMultiAction(actions, params);

      return { ...action, decoded };
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
  if (minionType === MINION_TYPES.SAFE) {
    return TX.MINION_SAFE_EXECUTE;
  }
};

export const isEarlyExecutionMinion = minion => {
  return Number(minion?.minQuorum) > 0;
};

export const getMinionSafeNameByPattern = ({ boostId, minionType, values }) => {
  const SEPARATOR = /<\d+>/g;
  const getPattern = () => {
    if (
      boostId === BOOSTS.CROSS_CHAIN_MINION.id ||
      minionType === MINION_TYPES.CROSSCHAIN_SAFE
    ) {
      return '0xab270234/<0>/<1>/<2>'; // bytes4(keccak256(abi.encodePacked('AMBMinionSafe'))) === 0xab270234
    }
    if (
      boostId === BOOSTS.CROSS_CHAIN_MINION_NOMAD.id ||
      minionType === MINION_TYPES.CROSSCHAIN_SAFE_NOMAD
    ) {
      return '0xfc3b5b76/<0>/<1>/<2>'; // bytes4(keccak256(abi.encodePacked("NomadMinionSafe"))) === 0xfc3b5b76
    }
  };
  const pattern = getPattern();
  return pattern?.replace(SEPARATOR, k => values[k]) || values['_minionName'];
};
