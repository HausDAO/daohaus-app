import React, { useContext, createContext } from 'react';
import { MaxUint256 } from '@ethersproject/constants';

import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { TokenService } from '../services/tokenService';
import { useDao } from './DaoContext';
import { useDaoMember } from './DaoMemberContext';
import { useMetaData } from './MetaDataContext';
import { useToken } from './TokenContext';
import { useInjectedProvider } from './InjectedProviderContext';
import { createPoll } from '../services/pollService';
import { useUser } from './UserContext';
import { useOverlay } from './OverlayContext';

import { createForumTopic } from '../utils/discourse';

import { getArgs, handleFormError, Transaction } from '../utils/txHelpers';
import { customValidations } from '../utils/validation';

export const TXContext = createContext();

export const TXProvider = ({ children }) => {
  const { injectedProvider, address } = useInjectedProvider();
  const {
    resolvePoll,
    cachePoll,
    userHubDaos,
    apiData,
    outstandingTXs,
  } = useUser();
  const {
    hasPerformedBatchQuery,
    refetch,
    daoOverview,
    daoMembers,
    daoProposals,
  } = useDao();
  const { daoMetaData } = useMetaData();
  const {
    errorToast,
    successToast,
    setTxInfoModal,
    setProposalModal,
  } = useOverlay();
  const { hasFetchedMetadata, shouldUpdateTheme } = useMetaData();
  const { shouldFetchInit, shouldFetchContract, currentDaoTokens } = useToken();
  const {
    currentMemberRef,
    memberWalletRef,
    isMember,
    daoMember,
  } = useDaoMember();

  const { daoid, daochain } = useParams();

  const contextData = {
    address,
    daoOverview,
    daoid,
    daochain,
    daoMetaData,
    daoMembers,
    daoProposals,
    currentDaoTokens,
    isMember,
    daoMember,
    userHubDaos,
    // apiData,
    outstandingTXs,
  };

  const refreshDao = () => {
    // I use useRef to stop excessive rerenders in most of the contexts
    // I need to reset them in order to prevent them from locking up
    // the rerendering flow

    // DaoContext
    hasPerformedBatchQuery.current = false;
    // TokenContext
    shouldFetchInit.current = true;
    shouldFetchContract.current = true;
    // MetadataContext
    hasFetchedMetadata.current = false;
    shouldUpdateTheme.current = true;
    // DaoMemberContext
    currentMemberRef.current = false;
    memberWalletRef.current = false;
    // Now, I call rerender on DaoContext, which should re-fetch all the graphQueries
    // This should get up all the up to date data from the Graph and spread across the
    // entire component tree. It should also recache the new data automatically
    refetch();
  };

  const buildTXPoll = ({
    hash,
    tx,
    values,
    formData,
    discourse,
    additionalArgs = {},
  }) => {
    return createPoll({ action: tx.txType, cachePoll })({
      daoID: daoid,
      chainID: daochain,
      hash: hash || uuidv4(),
      ...additionalArgs,
      actions: {
        onError: (error, txHash) => {
          errorToast({
            title: tx.errMsg || 'Transaction Error',
            desciption: error?.message || '',
          });
          resolvePoll(txHash);
          console.error(`${tx.errMsg}: ${error}`);
        },
        onSuccess: txHash => {
          successToast({
            title: tx.successMsg || 'Transaction Successful',
          });
          refreshDao();
          resolvePoll(txHash);
          if (discourse) {
            createForumTopic({
              chainID: daochain,
              daoID: daoid,
              afterTime: (new Date().getTime() / 1000).toFixed(),
              proposalType: formData.type,
              values,
              applicant: values?.applicant || address,
              daoMetaData,
            });
          }
        },
      },
    });
  };

  const handleCustomValidation = ({ values, formData }) => {
    if (!formData?.customValidations?.length) return false;
    const errors = formData.customValidations.reduce((arr, rule) => {
      const isError = customValidations[rule]?.({
        values,
        formData,
        appState: { ...contextData, apiData },
      });
      if (isError) {
        return [...arr, isError];
      }
      return arr;
    }, []);
    return errors?.length ? errors : false;
  };

  const unlockToken = async token => {
    // const token = getValues('tributeToken');
    const args = [daoid, MaxUint256];

    try {
      const poll = buildTXPoll({
        tx: {
          txType: 'unlockToken',
          errMsg: 'Error unlocking token.',
          successMsg: 'Tribute Token Unlocked',
        },
        additionalArgs: {
          tokenAddress: token,
          userAddress: address,
          unlockAmount: MaxUint256,
        },
      });
      await TokenService({
        web3: injectedProvider,
        chainID: daochain,
        tokenAddress: token,
      })('approve')({ args, address, poll });
      return true;
    } catch (err) {
      console.log('error:', err);
      return false;
    }
  };

  //  handles submitProposal
  //  whitelisttokenProposal
  //  guildkickProposal
  const createProposal = async ({ values, proposalLoading, formData }) => {
    proposalLoading(true);
    const { txType } = formData.tx;
    const hash = uuidv4();
    const args = getArgs({
      values,
      txType,
      contextData,
      hash,
    });
    try {
      await Transaction({
        args,
        poll: buildTXPoll({
          hash,
          tx: formData.pollType || formData.tx,
          values,
          formData,
          discourse: true,
        }),
        onTxHash() {
          setProposalModal(false);
          setTxInfoModal(true);
        },
        contextData,
        injectedProvider,
        tx: formData.tx,
      });
    } catch (error) {
      handleFormError({
        error,
        contextData,
        formData,
        args,
        values,
        errorToast,
        loading: proposalLoading,
      });
    }
  };

  const submitTransaction = ({ values, proposalLoading, formData }) => {
    const txType = formData?.tx?.txType;
    if (!txType || !values || !proposalLoading || !formData) {
      throw new Error(
        'DEV NOTICE: One of the required args (values, txType, formData, loading) not specified in proposalFormData.js',
      );
    }
    if (
      txType === 'submitProposal' ||
      txType === 'submitWhitelistProposal' ||
      txType === 'submitGuildKickProposal'
    ) {
      return createProposal({ values, proposalLoading, formData });
    }
    throw new Error('DEV NOTICE: TX Type not found');
  };

  return (
    <TXContext.Provider
      value={{
        refreshDao,
        unlockToken,
        submitTransaction,
        handleCustomValidation,
      }}
    >
      {children}
    </TXContext.Provider>
  );
};

export const useTX = () => {
  const {
    refreshDao,
    unlockToken,
    submitTransaction,
    handleCustomValidation,
  } = useContext(TXContext);
  return { refreshDao, unlockToken, submitTransaction, handleCustomValidation };
};
