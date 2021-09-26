import Button from "./Button";
import "./css/Profile.css";
import React from "react";
import { TzContext } from "./context/TzToolKitContext";
import { buyHound, randomBase62 } from "../scripts/util";

function UseContract(): JSX.Element {
  const TzToolkit = React.useContext(TzContext).toolkit;

  return (
    <Button
      style={{ minWidth: "90px", padding: "4px" }}
      onClick={() => buyHound(TzToolkit, randomBase62(40))}
    >
      Buy
    </Button>
  );
}

export default UseContract;
