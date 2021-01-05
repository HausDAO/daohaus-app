import React from "react";

import { useInjectedProvider } from "./contexts/InjectedProviderContext";
import Loading from "./components/loading";
import Authed from "./routers/authed";
import NotAuthed from "./routers/notAuthed";

function App() {
  const { injectedProvider } = useInjectedProvider();

  if (!injectedProvider && localStorage.getItem("hasConnected")) {
    return <Loading />;
  } else if (injectedProvider) {
    return <Authed />;
  } else {
    return <NotAuthed />;
  }
}

export default App;
