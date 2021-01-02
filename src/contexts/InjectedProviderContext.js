import React, { useState, useEffect, useContext, createContext } from "react";
import { ethers } from "ethers";

import { supportedChains } from "../utils/chain";
import { requestAddresses, findInjectedProvider } from "../utils/injected";

export const InjectedProviderContext = createContext();

export const InjectedProvider = ({ children }) => {
  const [injectedProvider, setInjectedProvider] = useState(null);
  const [injectedChain, setInjectedChain] = useState(null);

  const connectProvider = () => {
    const provider = findInjectedProvider();
    const chain = supportedChains[provider.chainId];

    if (!chain) {
      console.error("This is not a supported chain");
    }
    setInjectedProvider(new ethers.providers.Web3Provider(provider));
    setInjectedChain(supportedChains[provider.chainId]);
  };

  useEffect(() => {
    //This function is kept inside the useEffect to avoid incorrect/stale state.
    const requestAddressFromUser = async () => {
      const [newAddress] = await requestAddresses();
      console.log(newAddress);
      if (newAddress) {
        connectProvider();
      } else {
        localStorage.removeItem("hasConnected");
        console.error("Address is undefined");
      }
    };

    const cachedAddress = localStorage.getItem("hasConnected");
    if (cachedAddress && window.ethereum) {
      const unreliableAddressCheck = window.ethereum.selectedAddress;
      if (unreliableAddressCheck === cachedAddress) {
        connectProvider();
      } else {
        requestAddressFromUser();
      }
      //TODO Make autologin method window.web3
    }
  }, []);

  //This useEffect handles the initialization of EIP-1193 listeners
  //https://eips.ethereum.org/EIPS/eip-1193
  useEffect(() => {
    if (!window.ethereum) {
      console.warn("Cannot detect injected provider");
      return;
    }
    window.ethereum
      .on("accountsChanged", (accounts) => {
        // console.log(accounts);
      })
      .on("chainChanged", (chainId) => {
        console.log(chainId);
        connectProvider();
      });
    return () => {
      window.ethereum
        .removeListener("accountsChanged")
        .removeListener("chainChanged");
    };
  }, []);

  const requestWallet = async () => {
    const [injectedAddress] = await requestAddresses();

    if (injectedAddress) {
      connectProvider();
      localStorage.setItem("hasConnected", injectedAddress);
    } else {
      localStorage.removeItem("hasConnected");
      console.error("Cannot access injected Provider");
    }
  };

  const disconnectDapp = async () => {
    //NOTE: Becuase of the limitations of metamask API,
    //I can only reset the application state. This does not
    //disconnect or disable the injected provider
    setInjectedProvider(null);
    localStorage.removeItem("hasConnected");
  };

  return (
    <InjectedProviderContext.Provider
      value={{ injectedProvider, requestWallet, disconnectDapp, injectedChain }}
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
  } = useContext(InjectedProviderContext);
  return { injectedProvider, requestWallet, disconnectDapp, injectedChain };
};
