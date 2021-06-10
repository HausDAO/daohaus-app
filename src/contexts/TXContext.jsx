import React, { useContext, createContext } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

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
  exposeValues,
  getArgs,
  // handleFormError,
  Transaction,
} from '../utils/txHelpers';
import { customValidations } from '../utils/validation';
import { TX } from '../data/contractTX';

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

  const buildTXPoll = data => {
    const { hash, tx, values, formData, now } = data;

    return createPoll({ action: tx.pollName || tx.name, cachePoll })({
      daoID: daoid,
      chainID: daochain,
      hash,
      createdAt: now,
      ...values,
      address,
      actions: {
        onError: (error, txHash) => {
          errorToast({
            title: tx.errMsg || 'Transaction Error',
            description: error?.message || '',
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
    const hash = uuidv4();
    const now = (new Date().getTime() / 1000).toFixed();
    const consolidatedData = {
      ...data,
      contextData,
      injectedProvider,
      hash,
      now,
    };

    try {
      const args = getArgs({ ...consolidatedData });
      console.log(`TX ARGS:`, args);
      const poll = buildTXPoll({
        ...consolidatedData,
      });
      return await Transaction({
        args,
        ...consolidatedData,
        poll,
        onTxHash() {
          //  Temporary. Needs utils to handle differenct actions
          setProposalModal(false);
          setTxInfoModal(true);
        },
      });
    } catch (error) {
      console.error(error);
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
    if (!name) {
      throw new Error('TX CONTEXT: TX data or name not found');
    }
    const txExists = Object.values(TX)
      .map(tx => tx.name)
      .includes(name);
    if (!txExists) {
      throw new Error('TX CONTEXT: TX does not exist');
    }

    if (data?.tx?.exposeValues) {
      return createTX(exposeValues({ ...data, contextData, injectedProvider }));
    }
    return createTX(data);
  };

  return (
    <TXContext.Provider
      value={{
        refreshDao,
        // unlockToken,
        submitTransaction,
        handleCustomValidation,
      }}
    >
      {children}
    </TXContext.Provider>
  );
};

export const useTX = () => {
  const { refreshDao, submitTransaction, handleCustomValidation } = useContext(
    TXContext,
  );
  return { refreshDao, submitTransaction, handleCustomValidation };
};
