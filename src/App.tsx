import Home from "./components/pages/Home";
import UserProfile from "./components/pages/Profile";
import Navbar from "./components/Navbar";
import { useState } from "react";
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { HoundInfo } from "./scripts/hound-genome";
import Search from "./components/pages/Search";

function App(): JSX.Element {
  const [hounds] = useState<Map<string, HoundInfo[]>>(new Map());
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
            <UserProfile hounds={hounds} />
          </Route>

          <Route path="/search">
            <Search />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
