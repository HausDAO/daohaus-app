import React, { useContext, createContext, useState, useEffect } from "react";
import { useQuery } from "react-apollo";

import { HUB_MEMBERSHIPS } from "../graphQL/member-queries";
import { queryAllChains } from "../utils/apollo";
import { supportedChains } from "../utils/chain";
import { resolvers } from "../utils/resolvers";
import { useGraph } from "./GraphContext";
import { useInjectedProvider } from "./InjectedProviderContext";
// import { getUser } from "../actions/user";
// import { useInjectedProvider } from "./InjectedProviderContext";

export const UserContext = createContext();

export const UserContextProvider = ({ children, provider }) => {
  const [userHubDaos, setUserHubDaos] = useState([]);
  const hasLoadedHubData = userHubDaos.length === 4;

  useEffect(() => {
    queryAllChains({
      query: HUB_MEMBERSHIPS,
      supportedChains,
      endpointType: "subgraph_url",
      reactSetter: setUserHubDaos,
      variables: {
        memberAddress: provider.selectedAddress,
      },
    });
  }, [provider.selectedAddress]);

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
