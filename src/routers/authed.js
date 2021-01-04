import React from "react";
import { Switch, Route } from "react-router-dom";

import { UserContextProvider } from "../contexts/UserContext";
import AuthedHub from "../pagesAuthed/AuthedHub";

const Authed = ({ provider }) => {
  return (
    <UserContextProvider provider={provider}>
      <Switch>
        <Route path="/hub">
          <AuthedHub provider={provider} />
        </Route>
      </Switch>
    </UserContextProvider>
  );
};

export default Authed;
