import React, { useState, useEffect, useContext, createContext } from 'react';
import { ethers } from 'ethers';

import { testProvider } from '../actions/initTests';
import { supportedChains } from '../utils/chain';

export const DefaultProviderContext = createContext();

export const DefaultProvider = ({ children }) => {
  const [dappChain, setDappChain] = useState(supportedChains[1]);
  const [connectBy, setConnectBy] = useState('rpc_url');
  const [dappProvider, setDappProvider] = useState(null);
  const [testOnLoad] = useState(false);

  useEffect(() => {
    const handleNewProvider = async provider => {
      if (testOnLoad) {
        await testProvider(provider, dappChain[connectBy], 'Dapp Provider');
      }
      setDappProvider(provider);
    };
    const provider = ethers.getDefaultProvider(dappChain[connectBy]);
    if (provider._isProvider) {
      handleNewProvider(provider);
    } else {
      throw new Error(
        `Default Provider Context could not create a valid provider from ${dappChain[connectBy]}`,
      );
    }
  }, [dappChain, connectBy, testOnLoad]);

  const changeDappChain = newChainID => {
    if (supportedChains[newChainID]) {
      setDappChain(supportedChains[newChainID]);
    } else {
      throw new Error(
        `${newChainID} is not a supported networks. Check the supportedChains obj in utils/chains.js for a reference of all supported chains`,
      );
    }
  };

  return (
    <DefaultProviderContext.Provider
      value={{ changeDappChain, dappProvider, setConnectBy }}
    >
      {children}
    </DefaultProviderContext.Provider>
  );
};

export const useDefaultProvider = () => {
  const { changeDappChain, dappProvider, setConnectBy } = useContext(
    DefaultProviderContext,
  );
  return { changeDappChain, dappProvider, setConnectBy };
};
