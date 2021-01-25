import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { UserContextProvider } from "./contexts/UserContext";
import Hub from "./pages/Hub";
import Dao from "./pages/Dao";
import { DaoProvider } from "./contexts/DaoContext";
import Explore from "./pages/Explore";
import Summon from "./pages/Summon";

function App() {
  return (
    <UserContextProvider>
      <Switch>
        <Route exact path="/">
          <Hub />
        </Route>
        <Route exact path="/explore">
          <Explore />
        </Route>
        <Route exact path="/summon">
          <Summon />
        </Route>
        <Route path="/dao/:daochain/:daoid">
          <DaoProvider>
            <Dao />
          </DaoProvider>
        </Route>
      </Switch>
    </UserContextProvider>
  );
}

export default App;
