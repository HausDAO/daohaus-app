import { MolochService } from '../services/molochService';
import { logFormError } from './errorLog';
import { createHash, detailsToJSON } from './general';
import { valToDecimalString } from './tokenValue';

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
  })(tx.txType)({
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
  return null;
};

export const getArgs = ({ values, txType, contextData, hash }) => {
  if (txType === 'submitProposal') {
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
  if (txType === 'submitWhitelistProposal') {
    const details = detailsToJSON({ ...values, hash });
    return [values.tokenAddress, details];
  }
};
