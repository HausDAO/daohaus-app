import React, { useContext, createContext } from 'react';
import { MaxUint256 } from '@ethersproject/constants';
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
import { TokenService } from '../services/tokenService';
import { createForumTopic } from '../utils/discourse';
import { getArgs, handleFormError, Transaction } from '../utils/txHelpers';
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
    // apiData,
    outstandingTXs,
  };

  const uiActions = {
    errorToast,
    successToast,
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
    const { hash, tx, values, formData, discourse, additionalArgs = {} } = data;
    console.log(`tx`, tx);
    return createPoll({ action: tx.pollName || tx.name, cachePoll })({
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
          name: 'unlockToken',
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
  const createTX = async data => {
    const { values, loading, formData, tx, onTxHash } = data;
    loading(true);

    const hash = uuidv4();
    //  Create way to make args from TX data
    const args = getArgs({ ...data, hash });

    try {
      await Transaction({
        args,
        //  here
        poll: buildTXPoll({
          hash,
          tx,
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
      console.error(error);
      handleFormError({ ...data, contextData });
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
    return createTX(data);
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
