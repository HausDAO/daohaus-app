import { MolochService } from '../services/molochService';
import { MinionService } from '../services/minionService';

import { logFormError } from './errorLog';
import { detailsToJSON } from './general';
import { valToDecimalString } from './tokenValue';
import { handleEncodeHex } from './abi';

export const handleFormError = ({
  contextData,
  formData,
  args,
  values,
  error,
  errorToast,
  loading,
}) => {
  const errMsg = error?.message || '';
  console.error(error);
  loading?.(false);
  logFormError({
    contextData,
    formData,
    args,
    values,
    errMsg,
  });
  errorToast?.({
    title: 'Error Submitting Proposal',
    description: errMsg,
  });
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
  minionAddress,
  tx,
}) => {
  const { daochain, daoOverview, address } = contextData;
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

export const Transaction = async data => {
  const contract = data?.tx?.contract;
  if (contract === 'Moloch') {
    return MolochTransaction(data);
  }
  if (contract === 'Minion') {
    return MinionTransaction(data);
  }
  return null;
};

export const getArgs = ({ values, name, contextData, hash }) => {
  if (name === 'submitProposal') {
    // TODO create details conformity utility
    const details = detailsToJSON({ ...values, hash });
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
  }
  if (name === 'submitGuildKickProposal') {
    const details = detailsToJSON({ ...values, hash });
    return [values.applicant, details];
  }
  if (name === 'submitWhitelistProposal') {
    const details = detailsToJSON({ ...values, hash });
    return [values.tokenAddress, details];
  }
  if (name === 'proposeAction') {
    const hexData = handleEncodeHex();

    return [];
  }
};
