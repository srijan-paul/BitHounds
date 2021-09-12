import Home from "./components/pages/Home";
import UserProfile from "./components/pages/Profile";
import Navbar from "./components/Navbar";
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

function App(): JSX.Element {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route path="/home">
            <Home />
          </Route>

          <Route path="/usr/:address">
            <UserProfile />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
