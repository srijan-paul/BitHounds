import Home from "./components/Home";
import Navbar from "./components/Navbar";
import UpdateContract from "./components/UpdateContract";
import { useState } from "react";
import { TezosToolkit } from "@taquito/taquito";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

function App(): JSX.Element {
    const [Tezos, setTezos] = useState<TezosToolkit>(new TezosToolkit("https://api.tez.ie/rpc/granadanet"));
    return (
      <Router>
              <Switch>
                  <Route path="/breed">
                      <Navbar />
                      <UpdateContract Tezos={Tezos} />
                  </Route>
                  <Route path="/">
                    <div className="App">
                        <Navbar />
                        <Home setTezos={setTezos}/>
                    </div>
                  </Route>
              </Switch>
      </Router>
  );
}

export default App;
