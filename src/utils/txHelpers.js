import { detailsToJSON } from './general';
import { addZeros, valToDecimalString } from './tokenValue';
import { safeEncodeHexFunction, getABIsnippet, getContractABI } from './abi';
import { collapse } from './formBuilder';
import { getContractBalance, getTokenData } from './vaults';
import { createContract } from './contract';
import { validate } from './validation';
import { PROPOSAL_TYPES } from './proposalUtils';
import { TX } from '../data/contractTX';

// const isSearchPath = string => string[0] === '.';

const getPath = pathString =>
  pathString
    .slice(1)
    .split('.')
    .filter(str => str !== '');

const getConditions = pathString =>
  pathString.split(' || ').filter(str => str !== '' || str !== ' ');

const searchData = (data, fields, shouldThrow = true) => {
  if (data == null || fields == null) {
    throw new Error('txHelpers => searchData(): data or fields is empty');
  }
  if (!fields?.length) return data;
  const newData = data[fields[0]];
  if (newData == null) {
    if (shouldThrow) {
      console.log('searchData error', data, fields);
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
    `txHelpers => handleFallback: Dead end, bruh. No values found for given conditional paths`,
  );
};

const buildJSONdetails = (data, fields) => {
  const newObj = {};
  for (const key in fields) {
    const isSearchPath = fields[key][0] === '.';
    if (isSearchPath) {
      const path = getPath(fields[key]);
      newObj[key] = searchData(data, path);
    } else {
      newObj[key] = fields[key];
    }
  }

  return JSON.stringify(newObj);
};

const argBuilderCallback = Object.freeze({
  proposeAction({ values, hash, formData }) {
    const hexData = safeEncodeHexFunction(
      JSON.parse(values.abiInput),
      collapse(values, '*ABI_ARG*', 'array'),
    );
    const details = detailsToJSON({
      ...values,
      hash,
      minionType: formData.minionType,
    });
    return [
      values.targetContract,
      values.minionPayment || '0',
      hexData,
      details,
    ];
  },
});

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
      const path = getPath(arg);
      if (!path.length)
        throw new Error('txHelpers.js => gatherArgs(): Incorrect Path string');
      return searchData(data, path);
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
      console.log(args);
      return safeEncodeHexFunction(getABIsnippet(arg), args);
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

// export const MolochTransaction = async ({
//   args,
//   poll,
//   onTxHash,
//   contextData,
//   injectedProvider,
//   tx,
// }) => {
//   const { daoid, daochain, daoOverview, address } = contextData;
//   return MolochService({
//     web3: injectedProvider,
//     daoAddress: daoid,
//     chainID: daochain,
//     version: daoOverview.version,
//   })(tx.name)({
//     args,
//     address,
//     poll,
//     onTxHash,
//   });
// };
// export const MinionTransaction = async ({
//   args,
//   poll,
//   onTxHash,
//   contextData,
//   injectedProvider,
//   values,
//   tx,
// }) => {
//   const { daochain, daoOverview, address } = contextData;
//   const minionAddress = values.minionAddress || values.selectedMinion;
//   return MinionService({
//     web3: injectedProvider,
//     minion: minionAddress,
//     chainID: daochain,
//     version: daoOverview.version,
//   })(tx.name)({
//     args,
//     address,
//     poll,
//     onTxHash,
//   });
// };

// export const TokenTransaction = async ({
//   args,
//   poll,
//   onTxHash,
//   contextData,
//   injectedProvider,
//   values,
//   tx,
// }) => {
//   const { daochain, daoOverview, address } = contextData;
//   const { tokenAddress } = values;
//   return TokenService({
//     web3: injectedProvider,
//     tokenAddress,
//     chainID: daochain,
//     version: daoOverview.version,
//   })(tx.name)({
//     args,
//     address,
//     poll,
//     onTxHash,
//   });
// };

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
  console.log(web3Contract);
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
  //   setProposalModal,
  //   setGenericModal
  // };
  const actions = {
    closeProposalModal() {
      uiControl.setProposalModal(false);
    },
    openTxModal() {
      uiControl.setTxInfoModal(true);
    },
    closeGenericModal() {
      uiControl.setGenericModal({});
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
    return addZeros(fieldValue, 18);
  },
});

export const handleFieldModifiers = appData => {
  const { activeFields, values } = appData;
  const newValues = { ...values };
  activeFields?.forEach(field => {
    if (field.modifiers) {
      //  check to see that all modifiers are valid
      field.modifiers.forEach(mod => {
        console.log(`mod`, mod);
        const modifiedVal = fieldModifiers[mod](newValues[field.name], appData);
        newValues[field.name] = modifiedVal;
      });
    } else {
      return field;
    }
  });
  return newValues;
};

export const transactionByProposalType = proposal => {
  if (proposal.proposalType === PROPOSAL_TYPES.MINION_UBER_DEL) {
    return TX.UBERHAUS_MINION_EXECUTE_APPOINTMENT;
  }
  if (proposal.proposalType === PROPOSAL_TYPES.MINION_SUPERFLUID) {
    return TX.SUPERFLUID_MINION_EXECUTE;
  }
  return TX.MINION_SIMPLE_EXECUTE;
};
