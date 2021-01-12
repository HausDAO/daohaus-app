import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useMemo,
} from "react";

import { useSessionStorage } from "../hooks/useSessionStorage";
import { HUB_MEMBERSHIPS } from "../graphQL/member-queries";
import { queryAllChains } from "../utils/apollo";
import { supportedChains } from "../utils/chain";
import { useInjectedProvider } from "./InjectedProviderContext";

const getDaosFromHubData = (networks) => {
  return networks.reduce((obj, network) => {
    return {
      ...obj,
      ...network.data.membersHub.reduce((obj, dao) => {
        return { ...obj, [dao.moloch.id]: dao };
      }, {}),
    };
  }, {});
};

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const { injectedProvider } = useInjectedProvider();
  const [userHubDaos, setUserHubDaos] = useSessionStorage("userHubData", []);

  const hasLoadedHubData = userHubDaos.length === 4;

  useEffect(() => {
    if (!userHubDaos.length) {
      queryAllChains({
        query: HUB_MEMBERSHIPS,
        supportedChains,
        endpointType: "subgraph_url",
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
