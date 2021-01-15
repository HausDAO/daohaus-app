import React, { useContext, createContext, useEffect } from "react";

import { getApiMetadata } from "../utils/metadata";

import { useSessionStorage } from "../hooks/useSessionStorage";
import { HUB_MEMBERSHIPS } from "../graphQL/member-queries";
import { hubChainQuery } from "../utils/theGraph";
import { supportedChains } from "../utils/chain";
import { useInjectedProvider } from "./InjectedProviderContext";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const { injectedProvider } = useInjectedProvider();
  const [userHubDaos, setUserHubDaos] = useSessionStorage("userHubData", []);

  const hasLoadedHubData = userHubDaos.length === 4;

  useEffect(() => {
    if (!userHubDaos.length) {
      hubChainQuery({
        query: HUB_MEMBERSHIPS,
        supportedChains,
        endpointType: "subgraph_url",
        apiFetcher: getApiMetadata,
        reactSetter: setUserHubDaos,
        variables: {
          memberAddress: injectedProvider.provider.selectedAddress,
        },
      });
    }
  }, [injectedProvider.provider.selectedAddress, userHubDaos, setUserHubDaos]);

  return (
    <UserContext.Provider value={{ userHubDaos, hasLoadedHubData }}>
      {children}
    </UserContext.Provider>
  );
};
export const useLocalUserData = () => {
  const { userHubDaos, hasLoadedHubData } = useContext(UserContext);
  return { userHubDaos, hasLoadedHubData };
};
