import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useRef,
} from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal';

<<<<<<< HEAD
import { supportedChains } from '../utils/chain';
import {
  deriveChainId,
  deriveSelectedAddress,
  getProviderOptions,
} from '../utils/web3Modal';
=======
import { supportedChains, chainByNetworkId } from '../utils/chain';
import { getProviderOptions } from '../utils/web3Modal';
>>>>>>> 279419af (fixes)

const defaultModal = new Web3Modal({
  providerOptions: getProviderOptions(),
  cacheProvider: true,
  theme: 'dark',
});

export const InjectedProviderContext = createContext();

export const InjectedProvider = ({ children }) => {
  const [injectedProvider, setInjectedProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [injectedChain, setInjectedChain] = useState(null);
  const [web3Modal, setWeb3Modal] = useState(defaultModal);

  const hasListeners = useRef(null);

  const connectProvider = async () => {
    const web3Modal = new Web3Modal({
      providerOptions: getProviderOptions(),
      cacheProvider: true,
      theme: 'dark',
    });

    const provider = await web3Modal.connect();

    provider.selectedAddress = deriveSelectedAddress(provider);
    const chainId = deriveChainId(provider);
    const chain = {
      ...supportedChains[chainId],
      chainId,
    };
    const web3 = new Web3(provider);
    if (web3?.currentProvider?.selectedAddress) {
      setInjectedProvider(web3);
      setAddress(web3.currentProvider.selectedAddress);
      setInjectedChain(chain);
      setWeb3Modal(web3Modal);
    }
  };

  useEffect(() => {
    if (!injectedProvider && web3Modal.cachedProvider) {
      connectProvider();
    }
  }, [injectedProvider, web3Modal]);

  // This useEffect handles the initialization of EIP-1193 listeners
  // https://eips.ethereum.org/EIPS/eip-1193

  useEffect(() => {
    const handleChainChange = (chainId) => {
      console.log('CHAIN CHANGE');
      connectProvider();
    };
    const accountsChanged = (account) => {
      console.log('ACCOUNT CHANGE');
      connectProvider();
    };

    const unsub = () => {
      if (injectedProvider?.currentProvider) {
        injectedProvider.currentProvider.removeListener(
          'accountsChanged',
          handleChainChange,
        );
        injectedProvider.currentProvider.removeListener(
          'chainChanged',
          accountsChanged,
        );
      }
    };

    if (injectedProvider?.currentProvider && !hasListeners.current) {
      injectedProvider.currentProvider
        .on('accountsChanged', accountsChanged)
        .on('chainChanged', handleChainChange);
      hasListeners.current = true;
    }
    return () => unsub();
  }, [injectedProvider]);

  const requestWallet = async () => {
    connectProvider();
  };

  const disconnectDapp = async () => {
    setInjectedProvider(null);
    setWeb3Modal(defaultModal);
    web3Modal.clearCachedProvider();
  };
  // const address = injectedProvider?.currentProvider?.selectedAddress;
  return (
    <InjectedProviderContext.Provider
      value={{
        injectedProvider,
        requestWallet,
        disconnectDapp,
        injectedChain,
        address,
        web3Modal,
      }}
    >
      {children}
    </InjectedProviderContext.Provider>
  );
};
export const useInjectedProvider = () => {
  const {
    injectedProvider,
    requestWallet,
    disconnectDapp,
    injectedChain,
    address,
    web3Modal,
  } = useContext(InjectedProviderContext);
  return {
    injectedProvider,
    requestWallet,
    disconnectDapp,
    injectedChain,
    web3Modal,
    address,
  };
};
