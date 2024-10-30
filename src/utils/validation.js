import Web3 from 'web3';
import { getSnapshotSpaces } from './theGraph';

// Error Model {
//   message: String (required)
//   name: String (required)
//   status: String
//   details: String
//

export const TYPE_ERR_MSGS = {
  number: 'Must be a valid number',
  integer: 'Must be a valid integer',
  string: 'Must be a valid string',
  address: 'Must be a valid Ethereum Address',
  urlNoHTTP: 'Must be a URL. Http not needed.',
  url: 'Must be a URL.',
  countryCode: 'Must be a valid country code.',
  greaterThanZero: 'Must be greater than zero.',
  boolean: 'Must be a Booolean value',
  disperseList:
    'Must be a proper list with addresses and token values on each line',
  contributorRewardList:
    'Must be a proper list with addresses, token values, and optional unlock date overrides on each line',
};

export const validate = {
  number(val) {
    return !isNaN(parseFloat(val)) && isFinite(val);
  },
  integer(val) {
    return (
      !isNaN(parseFloat(val)) && isFinite(val) && Number.isInteger(Number(val))
    );
  },
  string(val) {
    return typeof val === 'string';
  },
  address(val) {
    return /^0x[a-fA-F0-9]{40}$/.test(val);
  },
  urlNoHTTP(val) {
    return !val.includes('http') && val.includes('.');
  },
  url(val) {
    return /https?:\/\/(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/.test(
      val,
    );
  },
  countryCode(val) {
    if (val) {
      return /^[A-Z]{2}$/.test(val.toUpperCase());
    }
  },
  greaterThanZero(val) {
    return !isNaN(parseFloat(val)) && isFinite(val) && parseFloat(val) > 0;
  },
  boolean(val) {
    return val === 'true' || val === 'false' || val === true || val === false;
  },
  bytes32(val) {
    return val;
  },
  hex(val) {
    return Web3.utils.isHexStrict(val);
  },
  disperseList(val) {
    return val
      ?.split(/\r?\n/)
      .reduce(
        (acc, item) =>
          acc &&
          item.match(/0x[a-fA-F0-9]{40}/)?.[0] &&
          Number(
            item
              ?.replace(/0x[a-fA-F0-9]{40}/, '')
              .match(/(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/)?.[0],
          ),
        true,
      );
  },
  jsonStringObject(val) {
    try {
      const obj = JSON.parse(val);
      return typeof obj === 'object' && !Array.isArray(obj) && obj !== null;
    } catch (e) {
      return false;
    }
  },
  contributorRewardList(val) {
    return val
      ?.split(/\r?\n/)
      .reduce(
        (acc, item) =>
          acc &&
          item.match(/0x[a-fA-F0-9]{40}/)?.[0] &&
          Number(
            item
              ?.replace(/0x[a-fA-F0-9]{40}/, '')
              .match(/(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/)?.[0],
          ),
        true,
      );
  },
};

export const customValidations = {
  nonDaoApplicant({ appState, values }) {
    const { apiData } = appState;
    const { applicant } = values;

    if (apiData?.[applicant] || apiData?.[applicant?.toLowerCase()]) {
      return { name: 'applicant', message: 'Applicant cannot be another DAO.' };
    }
    return false;
  },
  superFluidStreamMinimum({ values }) {
    // TODO: Check either if minion has enough balance or payment requested is enough
    const minDeposit = values.paymentRequested;
    // TODO: fetch minimum stream value from SF governance contracts
    if (Number(minDeposit) < Number(values.weiRatePerSec) * 3600) {
      return {
        name: 'paymentRequested',
        message: 'Funds requested must be at least one-hour of stream value',
      };
    }
    return false;
  },
  enoughAllowance({ appState, values }) {
    const { daoMember } = appState;
    const { tributeOffered } = values;
    // TODO allowance should be tracked by token. but lazy check based on dropdown?
    if (Number(tributeOffered) > Number(daoMember.allowance)) {
      return {
        name: 'tributeOffered',
        message: 'Please unlock the tribute token.',
      };
    }
    return false;
  },
  noActiveStream({ values }) {
    if (values.activeStream) {
      return {
        name: 'applicant',
        message:
          "There's an active stream for the selected recipient and token",
      };
    }
    return false;
  },
  canRagequit({ appState }) {
    const proposalId = appState.daoMember.highestIndexYesVote
      ? appState.daoMember.highestIndexYesVote
      : null;
    const proposal = appState.daoProposals.find(
      p => p.proposalId === proposalId,
    );
    if (proposal && !proposal.processed) {
      return {
        name: 'shares',
        message:
          'Cannot process this request until all pending proposal that voted YES are processed',
      };
    }
    return false;
  },
  rageQuitMinimum({ values }) {
    if (!Number(values.shares) && !Number(values.loot)) {
      return {
        name: 'shares',
        message: 'Set loot or shares to Rage Quit',
      };
    }
    return false;
  },
  rageQuitMax({ appState, values }) {
    if (Number(values.shares) > Number(appState.daoMember.shares)) {
      return {
        name: 'shares',
        message: `Shares to Rage Quit may not exceed ${appState.daoMember.shares}.`,
      };
    }

    if (Number(values.loot) > Number(appState.daoMember.loot)) {
      return {
        name: 'loot',
        message: `Loot to Rage Quit may not exceed ${appState.daoMember.loot} loot.`,
      };
    }
    return false;
  },
  enoughBalance({ appState, values }) {
    const { daoMember } = appState;
    const { tributeOffered, tributeToken } = values;
    if (Number(tributeOffered) > 0) {
      const token = daoMember.tokenBalances.find(
        t => t.token.tokenAddress === tributeToken,
      );
      if (Number(tributeOffered) > Number(token.tokenBalance)) {
        return {
          name: 'tributeOffered',
          message: 'Tribute must be less than your balance.',
        };
      }
    }
    return false;
  },
  enoughDaoBalance({ appState, values }) {
    const { daoOverview } = appState;
    const { paymentRequested, paymentToken } = values;
    if (Number(paymentRequested) > 0) {
      const token = daoOverview.tokenBalances.find(
        t => t.token.tokenAddress === paymentToken,
      );
      console.log(token);
      if (Number(paymentRequested) > Number(token.tokenBalance)) {
        return {
          name: 'paymentRequested',
          message: 'Payment must be less than the DAO balance.',
        };
      }
    }
    return false;
  },
  validMinionName({ values }) {
    const invalidChars = /\//g;
    const { minionName, _minionName } = values;
    const name = _minionName ? '_minionName' : 'minionName';
    const value = _minionName || minionName;
    if (value.match(invalidChars)) {
      return {
        name,
        message: 'Minion Name has invalid characters',
      };
    }
  },
};

export const collectTypeValidations = valString => {
  const valFn = validate[valString];
  const valMsg = TYPE_ERR_MSGS[valString];
  if (!valFn || !valMsg) {
    console.log(`valFn`, valFn);
    console.log(`valMsg`, valMsg);
    throw new Error(
      `validation.js => collectTypeValidations(): type validation is not valid. It may not match the registry of existing val callbacks or errMsgs`,
    );
  }
  return val => (valFn(val) || val === '' ? true : valMsg);
};

export const handleStepValidation = {
  validateSnapshot: async ({ values }) => {
    const snapshotSpace = values?.space;
    const space = await getSnapshotSpaces(snapshotSpace);
    if (!space.space?.id) {
      throw Error('No space found!');
    }
    return true;
  },
};
