import Home from "./components/pages/Home";
import UserProfile from "./components/pages/Profile";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { TzContext } from "./components/context/TzToolKitContext";
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { HoundInfo } from "./scripts/hound-genome";

function App(): JSX.Element {
  const [hounds] = useState<Map<string, HoundInfo[]>>(new Map());
  const tezosToolkit = React.useContext(TzContext);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Home hounds={hounds} />
          </Route>

          <Route path="/home">
            <Home hounds={hounds} />
          </Route>

          <Route path="/usr/:address">
            <UserProfile Tezos={tezosToolkit} hounds={hounds} />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
