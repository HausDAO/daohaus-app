import React from "react";

import { GraphProvider } from "../contexts/GraphContext";
import { useInjectedProvider } from "../contexts/InjectedProviderContext";
import { UserContextProvider } from "../contexts/UserContext";
import AuthedHub from "../pagesAuthed/AuthedHub";

const Authed = () => {
  // const { injectedChain } = useInjectedProvider();
  return (
    <GraphProvider>
      {/* <UserContextProvider> */}
      <AuthedHub />
      {/* </UserContextProvider> */}
    </GraphProvider>
  );
};

export default Authed;
