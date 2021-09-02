import Home from "./components/Home";
import Navbar from "./components/Navbar";
import React from "react";

function App(): JSX.Element {
  return (
    <div className="App">
      <Navbar />
      <Home />
    </div>
  );
}

export default App;
