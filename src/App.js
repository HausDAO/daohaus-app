import React from "react";

import { useInjectedProvider } from "./contexts/InjectedProviderContext";
import Authed from "./routers/authed";
import NotAuthed from "./routers/notAuthed";

function App() {
  const { address, injectedProvider } = useInjectedProvider();

  if (!injectedProvider && localStorage.getItem("hasConnected")) {
    return <div>Loading</div>;
  } else if (injectedProvider) {
    if (injectedProvider && !address) {
      //This mess is because of Metamask's unreliable address injection
      //that seems to happen 1-2% of the time (50% of the time if not caught in injected Provider )
      //I'm trying to see when and why it happens in hopes of finding a workaround.
      if (injectedProvider.provider.selectedAddress) {
        //metamask inject a provider with an address, then mutate one in later
        //this causes the auth system to slip
        return <Authed />;
      } else {
        console.log("window.ethereum", window.ethereum);
        console.log("injectedProvider", injectedProvider);
        console.log("address", address);
        return <h1>Error: Metamask did not inject address. Check console.</h1>;
      }
    }
    return <Authed />;
  } else {
    return <NotAuthed />;
  }
}

export default App;
