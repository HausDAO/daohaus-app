import React, { useContext, createContext } from 'react';
import { useParams } from 'react-router-dom';

import { useDao } from './DaoContext';
import { useDaoMember } from './DaoMemberContext';
import { useMetaData } from './MetaDataContext';
import { useToken } from './TokenContext';
import { useInjectedProvider } from './InjectedProviderContext';
import { useUser } from './UserContext';
import { useOverlay } from './OverlayContext';

import { createPoll } from '../services/pollService';
import { createForumTopic } from '../utils/discourse';
import {
  createActions,
  exposeValues,
  getArgs,
  handleFieldModifiers,
  createHydratedString,
  // handleFormError,
  Transaction,
} from '../utils/txHelpers';
import { customValidations } from '../utils/validation';
import { TX } from '../data/contractTX';
import { supportedChains } from '../utils/chain';

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
    daoVaults,
  } = useDao();
  const { daoMetaData } = useMetaData();
  const {
    errorToast,
    successToast,
    setTxInfoModal,
    setModal,
    setGenericModal,
  } = useOverlay();
  const { hasFetchedMetadata, shouldUpdateTheme } = useMetaData();
  const { shouldFetchInit, shouldFetchContract, currentDaoTokens } = useToken();
  const {
    currentMemberRef,
    memberWalletRef,
    isMember,
    daoMember,
  } = useDaoMember();

  const { daoid, daochain, minion } = useParams();
  const chainConfig = supportedChains[daochain];

  const contextData = {
    address,
    daoOverview,
    daoid,
    daochain,
    minion,
    daoMetaData,
    daoMembers,
    daoProposals,
    currentDaoTokens,
    isMember,
    daoMember,
    userHubDaos,
    outstandingTXs,
    daoVaults,
    chainConfig,
  };

  const uiControl = {
    errorToast,
    successToast,
    resolvePoll,
    cachePoll,
    refetch,
    setTxInfoModal,
    setGenericModal,
    setModal,
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

  const buildTXPoll = data => {
    const { tx, values, formData, now, lifeCycleFns, localValues } = data;

    return createPoll({
      action: tx.poll || tx.specialPoll || tx.name,
      cachePoll,
    })({
      daoID: daoid,
      chainID: daochain,
      tx,
      createdAt: now,
      ...values,
      ...localValues,
      address,
      actions: {
        onError: (error, txHash) => {
          errorToast({
            title: tx.errMsg || 'Transaction Error',
            description: error?.message || '',
          });
          lifeCycleFns?.onPollError?.(txHash, error, data);
          resolvePoll(txHash);
          console.error(`${tx.errMsg}: ${error}`);
        },
        onSuccess: txHash => {
          successToast({
            title: tx.successMsg || 'Transaction Successful',
          });
          refreshDao();
          lifeCycleFns?.onPollSuccess?.(txHash, data);
          resolvePoll(txHash);
          if (tx.createDiscourse) {
            createForumTopic({
              chainID: daochain,
              daoID: daoid,
              afterTime: now,
              proposalType: formData?.type,
              values,
              applicant: values?.applicant || address,
              daoMetaData,
            });
          }

          // could we add some more
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

  const createTX = async data => {
    data.lifeCycleFns?.beforeTx?.(data);

    const now = (new Date().getTime() / 1000).toFixed();
    const consolidatedData = {
      ...data,
      contextData,
      injectedProvider,
      now,
    };
    const onTxHash = createActions({
      tx: data.tx,
      uiControl,
      stage: 'onTxHash',
      lifeCycleFns: data.lifeCycleFns,
    });

    try {
      const args = getArgs({ ...consolidatedData });

      const poll = buildTXPoll({
        ...consolidatedData,
      });
      const tx = await Transaction({
        args,
        ...consolidatedData,
        poll,
        onTxHash,
      });

      data.lifeCycleFns?.afterTx?.();
      return tx;
    } catch (error) {
      console.error(error);
      data.lifeCycleFns?.onCatch?.();
      errorToast({
        title: data?.tx?.errMsg || 'There was an error',
        description: error.message || '',
      });
    }
  };

  const submitTransaction = data => {
    console.log('data', data);

    const {
      tx: { name },
    } = data;

    //  Checks that this TX has a name and that the name is in the
    //  list of existing Transactions
    if (!name) {
      throw new Error('TX CONTEXT: TX data or name not found');
    }
    const txExists = Object.values(TX)
      .map(tx => tx.name)
      .includes(name);
    if (!txExists) {
      throw new Error('TX CONTEXT: TX does not exist');
    }

    //  Searches for items within the data tree and adds them to {values}
    if (data?.tx?.exposeValues) {
      return createTX(exposeValues({ ...data, contextData, injectedProvider }));
    }
    return createTX(data);
  };

  const modifyFields = formState => {
    return handleFieldModifiers({ ...formState, contextData });
  };

  const submitCallback = formState => {
    return formState.onSubmit({ ...formState, contextData, injectedProvider });
  };

  const hydrateString = data =>
    createHydratedString({
      ...data,
      contextData,
      injectedProvider,
    });

  return (
    <TXContext.Provider
      value={{
        refreshDao,
        submitTransaction,
        handleCustomValidation,
        modifyFields,
        submitCallback,
        hydrateString,
      }}
    >
      {children}
    </TXContext.Provider>
  );
};

export const useTX = () => {
  const {
    refreshDao,
    submitTransaction,
    handleCustomValidation,
    modifyFields,
    submitCallback,
    hydrateString,
  } = useContext(TXContext);
  return {
    refreshDao,
    submitTransaction,
    handleCustomValidation,
    modifyFields,
    submitCallback,
    hydrateString,
  };
};
