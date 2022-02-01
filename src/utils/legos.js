// For some reason, I have to brin pipe in manually instead of importing it,
//  Otherwise I get a 'cannot import before utilization error'

import { CONTRACTS } from '../data/contracts';
import { DETAILS } from '../data/details';
import { ACTIONS } from '../data/onTxHashActions';

export const firePlugins = ({ plugins, data }) => {
  plugins.forEach(plugin => plugin(data));
  return data.lego;
};

export const checkDuplicateKeys = data => {
  const { key, current } = data;
  if (current[key]) {
    throw new Error(`Key ${key} already exists!`);
  }
  return data;
};

export const checkRequiredFields = ({ typeModel, typeName }) => data => {
  const { lego, key } = data;
  const unfoundField = typeModel.find(
    modelField => lego[modelField] === undefined,
  );
  if (unfoundField) {
    throw new Error(
      `Error in ${key}: ${typeName} requires field ${unfoundField}`,
    );
  }
  return data;
};

export const validateLegos = ({ collections, plugins }) => {
  if (process.env.REACT_APP_DEV) {
    return collections.reduce(
      (acc, collection) => ({
        ...acc,
        ...Object.entries(collection).reduce(
          (childAcc, [legoKey, lego]) => ({
            ...childAcc,
            [legoKey]: firePlugins({
              plugins,
              data: {
                lego,
                collection,
                key: legoKey,
                current: acc,
                all: collections,
              },
            }),
          }),
          {},
        ),
      }),
      {},
    );
  }
  return collections.reduce((acc, collection) => ({ ...acc, ...collection }));
};

export const buildMultiTxAction = ({
  contract = CONTRACTS.SELECTED_MINION_SAFE,
  name = 'proposeAction',
  onTxHash = ACTIONS.PROPOSAL,
  poll = 'subgraph',
  display = 'Submitting multiTx Proposal',
  errMsg = 'Error: Could not submit multiTX proposal',
  successMsg = 'Success: Submitted MultiTX Proposal!',
  actions,
  forwardFundsAmt = '0',
  forwardFundsToken = '.contextData.daoOverview.depositToken.tokenAddress',
  memberOnlyEnabled = true,
  detailsToJSON = DETAILS.MINION_PROPOSAL,
}) => {
  if (!Array.isArray(actions)) {
    throw new Error(
      'multi TX lego Error: Transaction requires an actions array',
    );
  }
  return {
    contract,
    name,
    poll,
    onTxHash,
    display,
    errMsg,
    successMsg,
    gatherArgs: [
      { type: 'encodeMultiAction', actions },
      forwardFundsToken,
      forwardFundsAmt,
      {
        type: 'detailsToJSON',
        gatherFields: detailsToJSON,
      },
      memberOnlyEnabled,
    ],
  };
};
