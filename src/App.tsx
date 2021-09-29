import React from "react";
import Home from "./components/pages/Home";
import UserProfile from "./components/pages/Profile";
import Navbar from "./components/Navbar";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Search from "./components/pages/Search";
import Hound from "./components/pages/Hound";

function App(): JSX.Element {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
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

          <Route path="/search">
            <Search />
          </Route>

          <Route path="/hound/:genome">
            <Hound />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
