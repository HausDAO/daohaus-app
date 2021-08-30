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
  console.log(`values`, values);
  console.log(`required`, required);
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
  enoughAllowance({ appState, values }) {
    const { daoMember } = appState;
    const { tributeOffered } = values;
    // TODO allowance should be tracked by token. but lazy check based on dropdown?
    if (+tributeOffered > +daoMember.allowance) {
      return {
        name: 'tributeOffered',
        message: 'Please unlock the tribute token.',
      };
    }
    return false;
  },
  enoughBalance({ appState, values }) {
    const { daoMember } = appState;
    const { tributeOffered, tributeToken } = values;
    if (+tributeOffered > 0) {
      const token = daoMember.tokenBalances.find(
        t => t.token.tokenAddress === tributeToken,
      );
      if (+tributeOffered > +token.tokenBalance) {
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
    if (+paymentRequested > 0) {
      const token = daoOverview.tokenBalances.find(
        t => t.token.tokenAddress === paymentToken,
      );
      console.log(token);
      if (+paymentRequested > +token.tokenBalance) {
        return {
          name: 'paymentRequested',
          message: 'Payment must be less than the DAO balance.',
        };
      }
    }

    return false;
  },
};
