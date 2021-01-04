import React, { useEffect } from "react";

import { GraphProvider } from "../contexts/GraphContext";
import { useInjectedProvider } from "../contexts/InjectedProviderContext";
import { UserContextProvider } from "../contexts/UserContext";
import { HUB_MEMBERSHIPS } from "../graphQL/member-queries";
import AuthedHub from "../pagesAuthed/AuthedHub";
import { supportedChains } from "../utils/chain";

const Authed = ({ provider }) => {
  // const { injectedChain } = useInjectedProvider();

  const address = provider.selectedAddress;
  const chainURI = supportedChains[provider.chainId].subgraph_url;

  // useEffect(() => {
  //   const getGraph = async () => {
  //     const promise = await apolloGet(chainURI, HUB_MEMBERSHIPS, {
  //       memberAddress: address,
  //     });
  //     console.log(promise);
  //   };
  //   getGraph();
  // }, []);
  return (
    <UserContextProvider provider={provider}>
      <AuthedHub provider={provider} />
    </UserContextProvider>
  );
};

export default Authed;
