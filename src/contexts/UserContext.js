import React, { useContext, createContext, useEffect, useRef } from "react";
import { useQuery } from "react-apollo";

import { USER_MEMBERSHIPS } from "../graphQL/member-queries";
import { useGraph } from "./GraphContext";
import { useInjectedProvider } from "./InjectedProviderContext";
// import { getUser } from "../actions/user";
// import { useInjectedProvider } from "./InjectedProviderContext";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const { injectedProvider, injectedChain } = useInjectedProvider();
  const { subgraph } = useGraph();
  // console.log(subgraph);
  // const [userMetadata, setMetaData] = useState(null);

  // console.log("hi");
  const { loading, error, data, refetch } = useQuery(USER_MEMBERSHIPS, {
    variables: {
      memberAddress: injectedProvider.provider.selectedAddress,
    },
    client: subgraph,
  });

  // console.log(subgraph);

  const prevChain = useRef(injectedChain.name);
  // const [user, setUser] = useState(null);

  useEffect(() => {
    if (loading) {
      console.log("loading");
    }
    if (data) {
      console.log(data);
    }
    if (error) {
      console.error(error);
    }
  }, [loading, data, error]);

  return <UserContext.Provider value={{}}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const {} = useContext(UserContext);
  return {};
};
