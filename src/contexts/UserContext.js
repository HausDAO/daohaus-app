import React, { useContext, createContext, useEffect, useState } from 'react';

import { getApiMetadata } from '../utils/metadata';

import { useSessionStorage } from '../hooks/useSessionStorage';
import { HUB_MEMBERSHIPS } from '../graphQL/member-queries';
import { hubChainQuery } from '../utils/theGraph';
import { supportedChains } from '../utils/chain';
import { useInjectedProvider } from './InjectedProviderContext';
import { createPoll } from '../services/pollService';
import { useOverlay } from './OverlayContext';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const { address } = useInjectedProvider();
  const [userHubDaos, setUserHubDaos] = useSessionStorage('userHubData', []);
  const { successToast, errorToast } = useOverlay();
  const [outstandingTXs, setOutstandingTXs] = useState([]);

  const hasLoadedHubData = userHubDaos.length === 4;

  useEffect(() => {
    if (!userHubDaos.length && address) {
      hubChainQuery({
        query: HUB_MEMBERSHIPS,
        supportedChains,
        endpointType: 'subgraph_url',
        apiFetcher: getApiMetadata,
        reactSetter: setUserHubDaos,
        variables: {
          memberAddress: address,
        },
      });
    }
  }, [address, userHubDaos, setUserHubDaos]);

  useEffect(() => {
    if (!address) return;
    const cachedTXs = JSON.parse(localStorage.getItem('TXs')) || {};
    const userTXs = cachedTXs[address];
    if (userTXs?.length) {
      userTXs.forEach((tx) => {
        if (tx.status === 'unresolved') {
          createPoll(tx.pollData)({
            ...tx.pollArgs,
            actions: {
              onSuccess: () => {
                resolvePoll(tx.txHash);
                successToast({ title: 'Success!', description: tx.successMsg });
              },
              onError: () => {
                resolvePoll(tx.txHash);
                errorToast({ title: 'Error!', description: tx.errorMsg });
              },
            },
          })(tx.txHash);
        }
      });
      setOutstandingTXs(userTXs);
    }
  }, [address]);

  const cachePoll = (pollData) => {
    if (!address) {
      console.error("User address wasn't found. Cannot cache Poll.");
      return;
    }
    const oldCache = JSON.parse(localStorage.getItem(`TXs`)) || {};
    const userSpecificCache = oldCache[address] ? oldCache[address] : [];
    const newUserCache = [pollData, ...userSpecificCache];
    const newCache = {
      ...oldCache,
      [address]: newUserCache,
    };
    localStorage.setItem('TXs', JSON.stringify(newCache));
    setOutstandingTXs(newUserCache);
  };

  const resolvePoll = (txHash) => {
    if (!address) {
      console.error("User address wasn't found. Cannot cache Poll.");
      return;
    }
    const oldCache = JSON.parse(localStorage.getItem(`TXs`)) || {};
    const userSpecificCache = oldCache[address] ? oldCache[address] : [];
    const newUserCache = userSpecificCache.map((tx) =>
      tx.txHash === txHash ? { ...tx, status: 'resolved' } : tx,
    );
    const newCache = {
      ...oldCache,
      [address]: newUserCache,
    };
    localStorage.setItem('TXs', JSON.stringify(newCache));
    setOutstandingTXs(newUserCache);
  };

  const refetch = () => {
    // TODO - this is not working -it stopped the doubling, doesn have the meta yet
    // sessionStorage.removeItem('userHubData');
    setUserHubDaos([]);
  };

  return (
    <UserContext.Provider
      value={{
        userHubDaos,
        hasLoadedHubData,
        cachePoll,
        resolvePoll,
        outstandingTXs,
        refetch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => {
  const {
    userHubDaos,
    hasLoadedHubData,
    cachePoll,
    resolvePoll,
    outstandingTXs,
    refetch,
  } = useContext(UserContext);
  return {
    userHubDaos,
    hasLoadedHubData,
    cachePoll,
    resolvePoll,
    outstandingTXs,
    refetch,
  };
};
