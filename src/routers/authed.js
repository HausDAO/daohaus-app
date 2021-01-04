import React from "react";
import { Switch, Route } from "react-router-dom";

import { UserContextProvider } from "../contexts/UserContext";
import AuthedDaoRoutes from "./authedDaoRoutes";
import AuthedHub from "../pagesAuthed/AuthedHub";
import { useInjectedProvider } from "../contexts/InjectedProviderContext";

const Authed = () => {
  return (
    <UserContextProvider>
      <Switch>
        <Route exact path="/">
          <AuthedHub />
        </Route>
        <Route exact path="/hub">
          <AuthedHub />
        </Route>
        <Route path="/dao/:id">
          <AuthedDaoRoutes />
        </Route>
      </Switch>
    </UserContextProvider>
  );
};

export default Authed;
