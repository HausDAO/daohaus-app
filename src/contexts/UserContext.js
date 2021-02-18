import React, {
  useContext,
  createContext,
  useEffect,
  useState,
  useRef,
} from 'react';

import { getApiMetadata } from '../utils/metadata';

import { useSessionStorage } from '../hooks/useSessionStorage';
import { HUB_MEMBERSHIPS } from '../graphQL/member-queries';
import { hubChainQuery } from '../utils/theGraph';
import { supportedChains } from '../utils/chain';
import { useInjectedProvider } from './InjectedProviderContext';
import { createPoll } from '../services/pollService';
import { useOverlay } from './OverlayContext';

const numOfSupportedChains = Object.keys(supportedChains).length;

export const UserContext = createContext();
const address = '0x44bf6f5b5a5884e748fc87e10ddc4b6eb3c027c7';
export const UserContextProvider = ({ children }) => {
  // const { address } = useInjectedProvider();
  const { successToast, errorToast } = useOverlay();

  const [userHubDaos, setUserHubDaos] = useSessionStorage('userHubData', []);
  const [outstandingTXs, setOutstandingTXs] = useState([]);

  const hasLoadedHubData = userHubDaos?.length === numOfSupportedChains;
  const prevAddress = useRef(null);

  useEffect(() => {
    const bigQuery = () => {
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
    };
    if (!userHubDaos.length && address && prevAddress.current === null) {
      bigQuery();
      prevAddress.current = address;
    } else if (prevAddress.current !== address && address) {
      setUserHubDaos([]);
      prevAddress.current = null;
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

  const refetchUserHubDaos = () => {
    prevAddress.current = null;
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
        refetchUserHubDaos,
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
    refetchUserHubDaos,
  } = useContext(UserContext);
  return {
    userHubDaos,
    hasLoadedHubData,
    cachePoll,
    resolvePoll,
    outstandingTXs,
    refetchUserHubDaos,
  };
};
