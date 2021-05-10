import React, { useContext, createContext } from 'react';
import { MaxUint256 } from '@ethersproject/constants';

import { useParams } from 'react-router-dom';
import { TokenService } from '../services/tokenService';
import { useDao } from './DaoContext';
import { useDaoMember } from './DaoMemberContext';
import { useMetaData } from './MetaDataContext';
import { useToken } from './TokenContext';
import { useInjectedProvider } from './InjectedProviderContext';
import { createPoll } from '../services/pollService';
import { useUser } from './UserContext';
import { useOverlay } from './OverlayContext';
import { createHash, detailsToJSON } from '../utils/general';
import { valToDecimalString } from '../utils/tokenValue';
import { createForumTopic } from '../utils/discourse';
import { MolochService } from '../services/molochService';
import { LogError } from '../utils/errorLog';
import { submitProposalTest } from '../polls/tests';
import { PROPOSAL_TYPES } from '../utils/proposalUtils';

export const TXContext = createContext();

export const TXProvider = ({ children }) => {
  const { injectedProvider, address } = useInjectedProvider();
  const { resolvePoll, cachePoll } = useUser();
  const { hasPerformedBatchQuery, refetch, daoOverview } = useDao();
  const { daoMetaData } = useMetaData();
  const {
    errorToast,
    successToast,
    setTxInfoModal,
    setProposalModal,
  } = useOverlay();
  const { hasFetchedMetadata, shouldUpdateTheme } = useMetaData();
  const { shouldFetchInit, shouldFetchContract } = useToken();
  const { currentMemberRef, memberWalletRef } = useDaoMember();
  const { daoid, daochain } = useParams();

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

  const unlockToken = async token => {
    // const token = getValues('tributeToken');
    const args = [daoid, MaxUint256];

    try {
      const poll = createPoll({ action: 'unlockToken', cachePoll })({
        daoID: daoid,
        chainID: daochain,
        tokenAddress: token,
        userAddress: address,
        unlockAmount: MaxUint256,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'Error unlocking token.',
            });
            resolvePoll(txHash);
            console.error(`Could not unlock: ${error}`);
          },
          onSuccess: txHash => {
            successToast({
              // ? update to token symbol or name
              title: 'Tribute token unlocked',
            });
            refreshDao();
            resolvePoll(txHash);
          },
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

  const submitProposal = async ({ values, proposalLoading, formData }) => {
    proposalLoading(true);
    const now = (new Date().getTime() / 1000).toFixed();
    const hash = createHash();
    const details = detailsToJSON({ ...values, hash });
    const { tokenBalances, depositToken } = daoOverview;
    const tributeToken = values.tributeToken || depositToken.tokenAddress;
    const paymentToken = values.paymentToken || depositToken.tokenAddress;
    const tributeOffered = values.tributeOffered
      ? valToDecimalString(values.tributeOffered, tributeToken, tokenBalances)
      : '0';
    const paymentRequested = values.paymentRequested
      ? valToDecimalString(values.paymentRequested, paymentToken, tokenBalances)
      : '0';
    const applicant = values?.applicant || address;
    const args = [
      applicant,
      values.sharesRequested || '0',
      values.lootRequested || '0',
      tributeOffered,
      tributeToken,
      paymentRequested,
      paymentToken,
      details,
    ];
    console.log(args);
    try {
      const poll = createPoll({ action: 'submitProposal', cachePoll })({
        daoID: daoid,
        chainID: daochain,
        hash,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'There was an error.',
              description: error?.message || '',
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
          },
          onSuccess: txHash => {
            successToast({
              title: 'Proposal Submitted to the Dao!',
            });
            refreshDao();
            resolvePoll(txHash);
            createForumTopic({
              chainID: daochain,
              daoID: daoid,
              afterTime: now,
              proposalType: 'Member Proposal',
              values,
              applicant,
              daoMetaData,
            });
          },
        },
      });
      const onTxHash = () => {
        setTxInfoModal(true);
        setProposalModal(false);
      };
      await MolochService({
        web3: injectedProvider,
        daoAddress: daoid,
        chainID: daochain,
        version: daoOverview.version,
      })('submitProposal')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (error) {
      const errMsg = error?.message || '';
      proposalLoading(false);

      LogError({
        caughtAt: 'Needs data',
        errMsg,
        type: 'Contract TX: Member Proposal',
        userAddress: address,
        daoAddress: daoid,
        priority: 1,
        formData: values,
        TxArgs: args,
        contextData: {
          address,
          daoOverview,
          daoid,
          daochain,
        },
      });
      errorToast({
        title: 'There was an error.',
        description: errMsg,
      });
    }
  };

  const whiteListToken = ({ values, proposalLoading, formData }) => {
    proposalLoading(true);
    const now = (new Date().getTime() / 1000).toFixed();
    const hash = createHash();
    const details = detailsToJSON({ ...values, hash });
    const args = [values.tokenAddress, details];
    console.log(`values`, values);
    console.log(`args`, args);
    try {
      const poll = createPoll({ action: 'submitWhitelistProposal', cachePoll })(
        {
          daoID: daoid,
          chainID: daochain,
          hash,
          actions: {
            onError: (error, txHash) => {
              errorToast({
                title: 'There was an error.',
              });
              resolvePoll(txHash);
              console.error(`Could not find a matching proposal: ${error}`);
            },
            onSuccess: txHash => {
              successToast({
                title: 'Whitelist Proposal Submitted to the Dao!',
              });
              refreshDao();
              resolvePoll(txHash);
              createForumTopic({
                chainID: daochain,
                daoID: daoid,
                afterTime: now,
                proposalType: PROPOSAL_TYPES.WHITELIST,
                values,
                applicant: address,
                daoMetaData,
              });
            },
          },
        },
      );
      const onTxHash = () => {
        setProposalModal(false);
        setTxInfoModal(true);
      };
      MolochService({
        web3: injectedProvider,
        daoAddress: daoid,
        chainID: daochain,
        version: daoOverview.version,
      })('submitWhitelistProposal')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      proposalLoading(false);
      console.error('error: ', err);
      errorToast({
        title: 'There was an error.',
      });
    }
  };

  const submitTransaction = ({ values, proposalLoading, formData }) => {
    const txType = formData?.tx?.txType;
    if (!txType) {
      throw new Error(
        'DEV NOTICE: Transaction data corrupt or not specified in proposalFormData.js',
      );
    }
    //  check special validation here
    if (txType === 'submitProposal') {
      return submitProposal({ values, proposalLoading, formData });
    }
    if (txType === 'submitWhitelistProposal') {
      return whiteListToken({ values, proposalLoading, formData });
    }
    console.log('did');
    throw new Error('DEV NOTICE: TX Type not found');
  };

  return (
    <TXContext.Provider value={{ refreshDao, unlockToken, submitTransaction }}>
      {children}
    </TXContext.Provider>
  );
};

export const useTX = () => {
  const { refreshDao, unlockToken, submitTransaction } = useContext(TXContext);
  return { refreshDao, unlockToken, submitTransaction };
};
