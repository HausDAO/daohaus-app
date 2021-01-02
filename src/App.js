import React, { useState, useEffect } from "react";
import Layout from "./components/layout";

import { useInjectedProvider } from "./contexts/InjectedProviderContext";
import Loading from "./components/loading";
import Authed from "./routers/authed";
import NotAuthed from "./routers/notAuthed";

function App() {
  const { injectedProvider } = useInjectedProvider();

  const [viewMode, setViewMode] = useState(null);

  useEffect(() => {
    if (!injectedProvider && localStorage.getItem("hasConnected")) {
      setViewMode(<Loading />);
    } else if (injectedProvider) {
      setViewMode(<Authed provider={injectedProvider} />);
    } else {
      setViewMode(<NotAuthed />);
    }
  }, [injectedProvider]);

  return <Layout>{viewMode}</Layout>;
}

export default App;
