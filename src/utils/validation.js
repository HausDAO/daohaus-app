import Web3 from 'web3';

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
  greaterThanZero: 'Must be greater than zero.',
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
  greaterThanZero(val) {
    return !isNaN(parseFloat(val)) && isFinite(val) && parseFloat(val) > 0;
  },
};

export const checkFormTypes = (values, fields) => {
  if (!values || !fields) {
    throw new Error(
      `Did not receive truthy 'values' and/or 'fields' arguments in Function 'checkRequired`,
    );
  }
  const errors = fields.reduce((arr, field) => {
    const inputVal = values[field.name];
    //  check if empty
    if (inputVal === '' || field.expectType === 'any' || !field.expectType) {
      return arr;
    }
    const isValid = validate[field.expectType];
    if (typeof isValid !== 'function') {
      console.log(field);
      throw new Error(`Could not find validator function ${field.expectType}`);
    }
    if (!isValid(inputVal)) {
      return [
        ...arr,
        { message: TYPE_ERR_MSGS[field.expectType], name: field.name },
      ];
    }
    return arr;
  }, []);
  console.log(`errors`, errors);
  if (!errors.length) {
    return false;
  }
  return errors;
};

export const validateRequired = (values, required) => {
  //  takes in array of required fields
  if (!values || !required?.length) return;
  const errors = required.reduce((arr, field) => {
    if (!values[field.name]) {
      return [
        ...arr,
        {
          message: `${field.label} is required.`,
          name: field.name,
        },
      ];
    }
    return arr;
  }, []);

  if (!errors.length) {
    return false;
  }
  return errors;
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
    const minDeposit = Web3.utils.toWei(values.paymentRequested);
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
    if (values.activeStreams) {
      return {
        name: 'applicant',
        message:
          "There's an active stream for the selected recipient and token",
      };
    }
    return false;
  },
  canRagequit({ appState }) {
    const { proposalId } = appState.daoMember.highestIndexYesVote;
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
  noExistingSafeMinion({ appState, values }) {
    const { minions } = appState.daoOverview;
    const foundSafe = minions?.find(
      m => m.safeAddress === values.safeAddress.toLowerCase(),
    );
    if (foundSafe) {
      return {
        name: 'safeAddress',
        message: 'This Gnosis Safe has already been assigned to a Minion',
      };
    }
    return false;
  },
};
