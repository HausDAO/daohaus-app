import React, { useContext, createContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import { useDao } from './DaoContext';
import { useDaoMember } from './DaoMemberContext';
import { useInjectedProvider } from './InjectedProviderContext';
import { useMetaData } from './MetaDataContext';
import { useOverlay } from './OverlayContext';
import { useToken } from './TokenContext';
import { useUser } from './UserContext';
import {
  createActions,
  getArgs,
  handleFieldModifiers,
  createHydratedString,
  // handleFormError,
  Transaction,
} from '../utils/txHelpers';
import { createPoll } from '../services/pollService';
import { createForumTopic } from '../utils/discourse';
import { customValidations } from '../utils/validation';
import { supportedChains } from '../utils/chain';
import { TX } from '../data/txLegos/contractTX';
import { handleChecklist } from '../utils/appChecks';

export const TXContext = createContext();

export const TXProvider = ({ children }) => {
  const { injectedProvider, address, injectedChain } = useInjectedProvider();
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
    refreshAllDaoVaults,
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
    delegate,
  } = useDaoMember();

  const { daoid, daochain, minion } = useParams();
  const [txClock, setTxClock] = useState(uuid());
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
    delegate,
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
    refreshAllDaoVaults,
    setTxInfoModal,
    setGenericModal,
    setModal,
  };

  const refreshDao = async (skipVaults = false) => {
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
    if (!skipVaults) {
      console.log('refresh');
      await refreshAllDaoVaults();
      console.log('refresh done');
    }
    await refetch();
    setTxClock(uuid());
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
        onSuccess: async txHash => {
          await refreshDao();
          successToast({
            title: tx.successMsg || 'Transaction Successful',
          });
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
      const args = await getArgs({ ...consolidatedData });
      console.log(`args`, args);
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
    if (data?.tx?.minionType) {
      const newData = {
        ...data,
        formData: { ...data?.formData, minionType: data?.tx?.minionType },
      };
      return createTX(newData);
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

  const checkState = (checklist, errorDeliveryType, checkApiData) =>
    checkApiData
      ? handleChecklist(
          {
            ...contextData,
            ...apiData,
            injectedProvider,
            injectedChain,
          },
          checklist,
          errorDeliveryType,
        )
      : handleChecklist(
          { ...contextData, injectedProvider, injectedChain },
          checklist,
          errorDeliveryType,
        );

  return (
    <TXContext.Provider
      value={{
        refreshDao,
        submitTransaction,
        handleCustomValidation,
        modifyFields,
        submitCallback,
        hydrateString,
        checkState,
        txClock,
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
    checkState,
    txClock,
  } = useContext(TXContext) || {};
  return {
    refreshDao,
    submitTransaction,
    handleCustomValidation,
    modifyFields,
    submitCallback,
    hydrateString,
    checkState,
    txClock,
  };
};
