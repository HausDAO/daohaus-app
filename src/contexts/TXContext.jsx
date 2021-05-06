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

export const TXContext = createContext();

export const TXProvider = ({ children }) => {
  const { injectedProvider, address } = useInjectedProvider();
  const { resolvePoll, cachePoll } = useUser();
  const { hasPerformedBatchQuery, refetch } = useDao();
  const { errorToast, successToast } = useOverlay();
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

  return (
    <TXContext.Provider value={{ refreshDao, unlockToken }}>
      {children}
    </TXContext.Provider>
  );
};

export const useTX = () => {
  const { refreshDao, unlockToken } = useContext(TXContext);
  return { refreshDao, unlockToken };
};
