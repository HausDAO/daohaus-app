import React from "react";
import { Switch, Route } from "react-router-dom";

import VisitorHub from "../pagesUnauthed/VisitorHub";

const NotAuthed = ({ provider }) => {
  return (
    <Switch>
      <Route path="/hub">
        <VisitorHub provider={provider} />
      </Route>
    </Switch>
  );
};

export default NotAuthed;
