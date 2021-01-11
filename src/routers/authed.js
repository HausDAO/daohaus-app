import React from "react";
import { Switch, Route } from "react-router-dom";

import { UserContextProvider } from "../contexts/UserContext";
import AuthedHub from "../pagesAuthed/AuthedHub";
import AuthedDao from "../pagesAuthed/AuthedDao";
import { DaoProvider } from "../contexts/DaoContext";
import { MetaDataProvider } from "../contexts/MetaDataContext";

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
        <Route path="/dao/:daochain/:daoid">
          <MetaDataProvider>
            <DaoProvider>
              <AuthedDao />
            </DaoProvider>
          </MetaDataProvider>
        </Route>
      </Switch>
    </UserContextProvider>
  );
};

export default Authed;
