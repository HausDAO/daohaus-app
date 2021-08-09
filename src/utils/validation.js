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
};

export const checkFormTypes = (values, fields) => {
  if (!values || !fields) {
    throw new Error(
      `Did not recieve truthy 'values' and/or 'fields' arguments in Function 'checkRequired`,
    );
  }
  const errors = fields.reduce((arr, field) => {
    const inputVal = values[field.name];
    //  check if empty
    if (inputVal === '' || field.expectType === 'any') {
      return arr;
    }
    const isValid = validate[field.expectType];
    if (typeof isValid !== 'function') {
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

    if (apiData?.[applicant] || apiData?.[applicant.toLowerCase()]) {
      return { name: 'applicant', message: 'Applicant cannot be another DAO.' };
    }
    return false;
  },
  async superfluidStreamProposal({ appState, values }) {
    console.log('validating', appState, values);
    if (+values.superfluidRate <= 0) {
      return {
        name: 'superfluidRate',
        message: 'Rate must be greater than zero',
      };
    }

    // TODO: add injectedProvider to TXContext.js line 65?
    const minDeposit = appState.injectedProvider.utils.toWei(
      values.paymentRequested,
    );
    if (+minDeposit < +values.weiRatePerSec * 3600) {
      return {
        name: 'paymentRequested',
        message: 'Funds requested must be at least one-hour stream value',
      };
    }

    // will async work? use contract service this will be a pain
    // const hasActiveStreams = await minionService('hasActiveStreams')({
    //   to: values.memberApplicant || values.applicant,
    //   tokenAddress: values.paymentToken,
    // });
    // likely need to do this on member or paymenttoken changes - custom fields...
    // or create a beforeTx lifecycle
  },
};
