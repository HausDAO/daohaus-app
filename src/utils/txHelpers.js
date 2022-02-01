import { encodeMultiSend } from '@gnosis.pm/safe-contracts';
import Web3 from 'web3';

import { detailsToJSON, filterObject, HASH } from './general';
import { getContractBalance, valToDecimalString } from './tokenValue';
import {
  encodeMultisendTx,
  ensureHex,
  getABIsnippet,
  getContractABI,
  safeEncodeHexFunction,
} from './abi';
import { getTokenData } from './vaults';
import { createContract } from './contract';
import { validate } from './validation';
import { MINION_TYPES, PROPOSAL_TYPES } from './proposalUtils';
import { TX } from '../data/txLegos/contractTX';
import { CONTRACTS } from '../data/contracts';

const getPath = pathString =>
  pathString
    .slice(1)
    .split('.')
    .filter(str => str !== '');

const getConditions = pathString =>
  pathString.split(' || ').filter(str => str !== '' || str !== ' ');

const splitByTemplates = string => string.split(/{|}/g).filter(Boolean);

const searchData = (data, fields, shouldThrow = true) => {
  if (data == null || fields == null) {
    throw new Error('txHelpers => searchData(): data or fields is empty');
  }

  if (!fields?.length) return data;
  const newData = data[fields[0]];
  if (newData == null) {
    if (shouldThrow) {
      console.log('data, fields', data, fields);
      throw new Error(`txHelpers => searchData()`);
    } else {
      return false;
    }
  }
  return searchData(newData, fields.slice(1), shouldThrow);
};

const handleConditionalPaths = (data, paths) => {
  if (!paths.length)
    throw new Error(
      `txHelpers => handleFallback: conditional paths failed to produce truthy data`,
    );
  const nextString = paths[0];
  const isSearchPath = nextString[0] === '.';
  if (isSearchPath) {
    const searchResult = searchData(data, getPath(nextString), false);
    if (searchResult) return searchResult;
    return handleConditionalPaths(data, paths.slice(1));
  }
  if (nextString) return nextString;
  throw new Error(
    `txHelpers => handleFallback: No values found for given conditional paths`,
  );
};

const buildJSONdetails = (data, fields) => {
  const newObj = {};
  for (const key in fields) {
    const value = fields[key];
    if (typeof value === 'string' && value.includes('||')) {
      const paths = getConditions(value);
      if (!paths.length)
        throw new Error('txHelpers.js => gatherArgs(): Incorrect Path string');
      const result = handleConditionalPaths(data, paths);
      newObj[key] = result;
    } else if (fields[key][0] === '.') {
      const path = getPath(fields[key]);
      newObj[key] = searchData(data, path);
    } else {
      newObj[key] = fields[key];
    }
  }
  const cleanValues = filterObject(newObj, val => {
    return val !== HASH.EMPTY_FIELD;
  });
  return JSON.stringify(cleanValues);
};

const getMultiSendFn = () => {
  return getABIsnippet({
    contract: CONTRACTS.LOCAL_SAFE_MULTISEND,
    fnName: 'multiSend',
  });
};

const encodeMulti = encodedTXs => {
  console.log('encodedTXs', encodedTXs);
  const web3 = new Web3();
  const multiSendFn = getMultiSendFn();
  return web3.eth.abi.encodeFunctionCall(multiSendFn, [
    encodeMultiSend(encodedTXs),
  ]);
};

const collapseToCallData = values =>
  values.TX.map(tx => ({
    to: tx.targetContract,
    data: safeEncodeHexFunction(JSON.parse(tx.abiInput), tx.abiArgs || []),
    value: tx.minionValue || '0',
    operation: tx.operation || '0',
  }));
const collapseLegoToCallData = (actions, gatherArgs, data) => {
  return actions.map((action, index) => {
    if (action.logTX) {
      console.log(`ACTION DATA FOR TRANSACTION ${index}`);
      console.log('action', action);
      console.log('App State', data);
    }
    const actionTarget = gatherArgs({
      ...data,
      tx: { ...data.tx, gatherArgs: [action.targetContract] },
    })[0];
    if (action.logTX) {
      console.log('targetContract: ', actionTarget);
    }
    const actionArgs = gatherArgs({
      ...data,
      tx: { ...data.tx, gatherArgs: action.args },
    });
    if (action.logTX) {
      console.log('args: ', actionArgs);
    }
    const actionValue = action.value
      ? gatherArgs({
          ...data,
          tx: { ...data.tx, gatherArgs: [action.value] },
        })[0]
      : '0';
    if (action.logTX) {
      console.log('value: ', actionValue);
    }
    const actionOperation = action.operation
      ? gatherArgs({
          ...data,
          tx: { ...data.tx, gatherArgs: [action.operation] },
        })[0]
      : '0';
    if (action.logTX) {
      console.log('operation: ', actionOperation);
    }
    const abiSnippet = getABIsnippet(
      { contract: action.abi, fnName: action.fnName },
      data,
    );

    if (action.logTX) {
      console.log('abi: ', action.abi);
      console.log('fnName: ', action.fnName);
      console.log('abiSnippet', abiSnippet);
    }

    return {
      to: actionTarget,
      data: safeEncodeHexFunction(abiSnippet, actionArgs || []),
      value: actionValue,
      operation: actionOperation,
    };
  });
};

const argBuilderCallback = Object.freeze({
  proposeActionVanilla({ values, formData }) {
    const hexData = ensureHex(values.abiInput, values.abiArgs);

    const details = detailsToJSON({
      ...values,
      minionType: formData.minionType,
    });
    return [values.targetContract, values.minionValue || '0', hexData, details];
  },
  proposeActionNifty({ values, formData }) {
    const hexData = ensureHex(values.abiInput, values.abiArgs);

    const details = detailsToJSON({
      ...values,
      minionType: formData.minionType,
    });

    return [
      values.targetContract,
      values.minionValue || '0',
      hexData,
      details,
      values.paymentToken,
      values.paymentRequested,
    ];
  },
  multiActionSafe(data) {
    const { values } = data;
    const detailsModel = {
      title: `.values.title`,
      description: `.values.description || ${HASH.EMPTY_FIELD}`,
      proposalType: PROPOSAL_TYPES.MULTI_TX_SAFE,
      minionType: MINION_TYPES.SAFE,
    };

    return [
      encodeMulti(collapseToCallData(values)),
      values.paymentToken,
      values.paymentRequested || '0',
      buildJSONdetails(data, detailsModel),
      true,
    ];
  },
  proposeActionSafe({ values, formData }) {
    const hexData = ensureHex(values.abiInput, values.abiArgs);

    const details = detailsToJSON({
      ...values,
      minionType: formData.minionType,
    });
    return [
      encodeMultisendTx(
        getABIsnippet({
          contract: CONTRACTS.LOCAL_SAFE_MULTISEND,
          fnName: 'multiSend',
        }),
        [values.targetContract],
        [values.minionValue || '0'],
        [hexData],
        [0],
      ),
      values.paymentToken,
      values.paymentRequested || '0',
      details,
      true, // _memberOnlyEnabled
    ];
  },
});

export const handleSearch = (data, arg, shouldThrow) => {
  const path = getPath(arg);
  if (!path.length)
    throw new Error('txHelpers.js => gatherArgs(): Incorrect Path string');
  return searchData(data, path, shouldThrow);
};

export const encodeMultiAction = ({ data, arg, gatherArgs }) => {
  return encodeMulti(collapseLegoToCallData(arg.actions, gatherArgs, data));
};

const gatherArgs = data => {
  const { tx } = data;
  return tx.gatherArgs.map(arg => {
    // checks if dev used two pipe operators to denote an OR condition.
    // Splits the string into separate paths, then performs recursive search until
    // a truthy result first.
    if (typeof arg === 'string' && arg.includes('||')) {
      const paths = getConditions(arg);
      if (!paths.length)
        throw new Error('txHelpers.js => gatherArgs(): Incorrect Path string');
      return handleConditionalPaths(data, paths);
    }
    //  takes in search notation. Performs recursive search for application data
    if (arg[0] === '.') {
      return handleSearch(data, arg);
    }
    //  builds a details JSON string from values. Reindexes bases on a
    //  given set of params defined in tx.detailsJSON
    if (arg.type === 'detailsToJSON') {
      return buildJSONdetails(data, arg.gatherFields);
    }
    if (arg.type === 'encodeHex') {
      const args = gatherArgs({
        ...data,
        tx: { ...tx, gatherArgs: arg.gatherArgs },
      });
      return safeEncodeHexFunction(getABIsnippet(arg), args);
    }
    if (arg.type === 'encodeSafeActions') {
      return encodeMultisendTx(
        getABIsnippet(arg),
        gatherArgs({
          ...data,
          tx: { ...tx, gatherArgs: arg.to },
        }).flatMap(a => a),
        gatherArgs({
          ...data,
          tx: { ...tx, gatherArgs: arg.value },
        }).flatMap(a => a),
        gatherArgs({
          ...data,
          tx: { ...tx, gatherArgs: arg.data },
        }).flatMap(a => a),
        gatherArgs({
          ...data,
          tx: { ...tx, gatherArgs: arg.operation },
        }).flatMap(a => a),
      );
    }
    if (arg.type === 'encodeMultiAction') {
      return encodeMultiAction({ data, arg, gatherArgs });
    }
    if (arg.type === 'nestedArgs') {
      return arg.gatherArgs.flatMap(a => {
        return gatherArgs({
          ...data,
          tx: { ...tx, gatherArgs: [a] },
        });
      });
    }
    //  for convenience, will search the values object for a field with the given string.
    return arg;
  });
};

export const getArgs = data => {
  const { tx } = data;
  if (data.args) {
    //  Dev adds arguments manually in the component
    return data.args;
  }
  if (tx.argsFromCallback) {
    //  Dev uses a custom callback to calculate arguments
    if (tx.argsFromCallback === true) {
      //  Dev uses a boolean to indicate the custom callback.
      //  defaults to the name of the transaction
      return argBuilderCallback[tx.name](data);
    }
    //  Otherwise search custom callbacks based on the name passed in
    //  through the transaction data
    return argBuilderCallback[tx.argsFromCallback](data);
  }
  if (tx.gatherArgs && Array.isArray(tx.gatherArgs)) {
    //  Dev uses the search notation to find arguments inside of custom callback.
    return gatherArgs(data);
  }
  throw new Error(
    'Error at getArgs() in txHelpers.js. TX data did not include a method to collect arguments. Check transaction data in contractTX.js.',
  );
};

export const createHydratedString = data => {
  const { string } = data;
  if (!string)
    throw new Error(
      'txHelpers.js => createHydratedString: string does not exist',
    );
  const fragments = splitByTemplates(string);
  return fragments
    .map(fragment => {
      if (fragment[0] === '.') {
        return handleSearch(data, fragment);
      }
      return fragment;
    })
    .join('');
};

export const getContractAddress = data => {
  const { contractAddress } = data.tx.contract;
  if (contractAddress[0] === '.') {
    const path = getPath(contractAddress);
    const address = searchData(data, path);
    return address;
  }
  if (validate.address(contractAddress)) return contractAddress;
  throw new Error(
    'txHelpers => getContactAddress(): Did not receive a valid contract address',
  );
};
export const Transaction = async data => {
  const { args, tx, poll, onTxHash, contextData, injectedProvider } = data;

  const web3Contract = await createContract({
    address: getContractAddress(data),
    abi: await getContractABI(data),
    chainID: contextData.daochain,
    web3: injectedProvider,
  });
  const transaction = await web3Contract.methods[tx.name](...args);
  data.lifeCycleFns?.onTxFire?.(data);

  return transaction
    .send('eth_requestAccounts', { from: contextData.address })
    .on('transactionHash', txHash => {
      poll?.(txHash, data);
      onTxHash?.(txHash, data);
      return txHash;
    })
    .on('error', error => {
      console.error(error);
      return error;
    });
};

//  Seaches application state for values
export const exposeValues = data => {
  const foundData = data.tx.exposeValues.reduce((obj, query) => {
    return { ...obj, [query.name]: searchData(data, query.search) };
  }, {});
  if (foundData) {
    const existingValues = data.values || {};
    return { ...data, values: { ...foundData, ...existingValues } };
  }
  throw new Error('Could not find data with given queries');
};

export const createActions = ({ tx, uiControl, stage }) => {
  if (!tx[stage]) return;

  // FOR REFERENCE:
  // const uiControl = {
  //   errorToast,
  //   successToast,
  //   resolvePoll,
  //   cachePoll,
  //   refetch,
  //   setTxInfoModal,
  //   setModal,
  //   setGenericModal
  // };
  const actions = {
    closeProposalModal() {
      uiControl?.setModal?.(false);
    },
    openTxModal() {
      uiControl?.setTxInfoModal?.(true);
    },
    closeGenericModal() {
      uiControl?.setGenericModal?.({});
    },
  };

  const availableActions = Object.keys(actions);
  if (!tx[stage].every(action => availableActions.includes(action))) {
    throw new Error(
      `createActions => txHelpers.js: One of the values inside of ${stage} does not match the list of available actions`,
    );
  }
  return () => tx[stage].forEach(action => actions[action]());
};

export const fieldModifiers = Object.freeze({
  addTributeDecimals(fieldValue, data) {
    if (!fieldValue) return null;
    return valToDecimalString(
      fieldValue,
      data.values.tributeToken,
      data.contextData.daoOverview.tokenBalances,
    );
  },
  addPaymentDecimals(fieldValue, data) {
    if (!fieldValue) return null;
    return valToDecimalString(
      fieldValue,
      data.values.paymentToken,
      data.contextData.daoOverview.tokenBalances,
    );
  },
  addMinionVaultDecimals(fieldValue, data) {
    if (!fieldValue) return null;

    if (data.formData.localValues?.tokenAddress) {
      return getContractBalance(
        fieldValue,
        data.formData.localValues.tokenDecimals,
      );
    }
    const { daoVaults } = data.contextData;
    const { minionToken, selectedMinion } = data.values;
    return getContractBalance(
      fieldValue,
      getTokenData(daoVaults, selectedMinion, minionToken).decimals,
    );
  },
  addWeiDecimals(fieldValue) {
    if (!fieldValue) return null;
    return Web3.utils.toWei(fieldValue);
  },
});

export const handleFieldModifiers = appData => {
  const { activeFields, values } = appData;
  const newValues = { ...values };
  activeFields?.forEach(field => {
    if (field.modifiers) {
      //  check to see that all modifiers are valid
      field.modifiers.forEach(mod => {
        const modifiedVal = fieldModifiers[mod](newValues[field.name], appData);
        newValues[field.name] = modifiedVal;
      });
    } else {
      return field;
    }
  });
  return newValues;
};

export const getTxFromName = name => {
  if (name?.includes('TX')) {
    const justTag = name
      .split('.')
      .slice(0, 2)
      .join('.');
    return justTag;
  }
  return null;
};

export const transactionByProposalType = proposal => {
  if (proposal.proposalType === PROPOSAL_TYPES.MINION_UBER_DEL) {
    return TX.UBERHAUS_MINION_EXECUTE_APPOINTMENT;
  }
  if (proposal.proposalType === PROPOSAL_TYPES.MINION_SUPERFLUID) {
    return TX.SUPERFLUID_MINION_EXECUTE;
  }
  if (proposal.minion.minionType === PROPOSAL_TYPES.MINION_SAFE) {
    return TX.MINION_SAFE_EXECUTE;
  }
  return TX.MINION_SIMPLE_EXECUTE;
};
