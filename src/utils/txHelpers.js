import { MolochService } from '../services/molochService';
import { MinionService } from '../services/minionService';
import { detailsToJSON } from './general';
import { valToDecimalString } from './tokenValue';
import { safeEncodeHexFunction } from './abi';
import { collapse } from './formBuilder';
import { TokenService } from '../services/tokenService';

const buildJSONdetails = (data, fields) =>
  JSON.stringify(
    fields.reduce((obj, field) => ({ ...obj, [field]: data[field] }), {}),
  );

const searchData = (data, fields) => {
  if (!data || !fields) throw new Error('Fn searchData in txHelpers');
  if (!fields?.length) return data;
  const newData = data[fields[0]];
  if (!newData) throw new Error('Could not find data with given queries');
  return searchData(newData, fields.slice(1));
};

const argBuilderCallback = Object.freeze({
  submitProposal({ values, tx, contextData, hash }) {
    console.log(`hash`, hash);
    const details = buildJSONdetails({ ...values, hash }, tx.detailsJSON);
    const { tokenBalances, depositToken } = contextData.daoOverview;
    const tributeToken = values.tributeToken || depositToken.tokenAddress;
    const paymentToken = values.paymentToken || depositToken.tokenAddress;
    const tributeOffered = values.tributeOffered
      ? valToDecimalString(values.tributeOffered, tributeToken, tokenBalances)
      : '0';
    const paymentRequested = values.paymentRequested
      ? valToDecimalString(values.paymentRequested, paymentToken, tokenBalances)
      : '0';
    const applicant = values?.applicant || contextData.address;
    return [
      applicant,
      values.sharesRequested || '0',
      values.lootRequested || '0',
      tributeOffered,
      tributeToken,
      paymentRequested,
      paymentToken,
      details,
    ];
  },
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
  const { tx, values, hash } = data;
  return tx.gatherArgs.map(arg => {
    //  takes in search notation. Performs recursive search for application data
    if (arg.type === 'search') return searchData(data, arg.fields);
    //  returns a static value defined in contractTX.js
    if (arg.type === 'static') return arg.value;
    //  builds a details JSON string from values. Reindexes bases on a
    //  given set of params defined in tx.detailsJSON
    if (arg === 'detailsToJSON') {
      if (!Array.isArray(tx.detailsJSON))
        throw new Error(
          'details to JSON requires an Array of selected fields definied in the TX data at contractTX.js, under the field "detailsToJSON"',
        );
      return buildJSONdetails({ ...values, hash }, tx.detailsJSON);
    }
    //  for convenience, will search the values object for a field with the given string.
    if (typeof arg === 'string') return values[arg];
    throw new Error(
      'Could not find args with the given TX config data: Check contractTX.js to make sure data conforms with getArgs() in txHelpers.js',
    );
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

export const MolochTransaction = async ({
  args,
  poll,
  onTxHash,
  contextData,
  injectedProvider,
  tx,
}) => {
  const { daoid, daochain, daoOverview, address } = contextData;
  return MolochService({
    web3: injectedProvider,
    daoAddress: daoid,
    chainID: daochain,
    version: daoOverview.version,
  })(tx.name)({
    args,
    address,
    poll,
    onTxHash,
  });
};
export const MinionTransaction = async ({
  args,
  poll,
  onTxHash,
  contextData,
  injectedProvider,
  values,
  tx,
}) => {
  const { daochain, daoOverview, address } = contextData;
  const minionAddress = values.minionAddress || values.selectedMinion;
  return MinionService({
    web3: injectedProvider,
    minion: minionAddress,
    chainID: daochain,
    version: daoOverview.version,
  })(tx.name)({
    args,
    address,
    poll,
    onTxHash,
  });
};

export const TokenTransaction = async ({
  args,
  poll,
  onTxHash,
  contextData,
  injectedProvider,
  values,
  tx,
}) => {
  const { daochain, daoOverview, address } = contextData;
  const { tokenAddress } = values;
  return TokenService({
    web3: injectedProvider,
    tokenAddress,
    chainID: daochain,
    version: daoOverview.version,
  })(tx.name)({
    args,
    address,
    poll,
    onTxHash,
  });
};

export const Transaction = async data => {
  const contractType = data?.tx?.contract;
  const txMap = {
    Moloch: MolochTransaction,
    Minion: MinionTransaction,
    Token: TokenTransaction,
  };
  const TX = txMap[contractType];
  if (!TX) {
    throw new Error(
      `Contract Type ${contractType} not found in 'Transaction' function in txHelpers.js. Check transaction data (contractTX.js).`,
    );
  }
  return TX(data);
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

export const createActions = ({ tx, uiControl, stage, uiActions }) => {
  if (!tx[stage]) return;
  console.log(`tx`, tx);
  console.log(`uiControl`, uiControl);
  console.log(`stage`, stage);
  console.log(`uiActions`, uiActions);
  // FOR REFERENCE:
  // const uiControl = {
  //   errorToast,
  //   successToast,
  //   resolvePoll,
  //   cachePoll,
  //   refetch,
  //   setTxInfoModal,
  //   setProposalModal,
  // };
  const actions = {
    closeProposalModal() {
      uiControl.setProposalModal(false);
    },
    openTxModal() {
      uiControl.setTxInfoModal(true);
    },
  };

  const availableActions = Object.keys(actions);
  if (!tx[stage].every(action => availableActions.includes(action))) {
    throw new Error(
      `createActions => txHelpers.js: One of the values inside of ${stage} does not match the list of available actions`,
    );
  }
  return () => {
    if (uiActions?.[stage] && typeof uiActions?.[stage] === 'function') {
      uiActions[stage]();
    }
    tx[stage].forEach(action => actions[action]());
  };
};
