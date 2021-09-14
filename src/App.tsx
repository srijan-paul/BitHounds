import Home from "./components/pages/Home";
import UserProfile from "./components/pages/Profile";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { TezosToolkit } from "@taquito/taquito";
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
const map = new Map();
function App(): JSX.Element {
  const [Tezos, setTezos] = useState<TezosToolkit>(new TezosToolkit("https://api.tez.ie/rpc/granadanet"));
  const [hounds, setHounds] = useState(map);
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Home setTezos={setTezos} setHounds = {setHounds} />
          </Route>

          <Route path="/home">
            <Home setTezos={setTezos} setHounds = {setHounds}/>
          </Route>

          <Route path="/usr/:address">
            <UserProfile Tezos = {Tezos} hounds = {hounds} />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
