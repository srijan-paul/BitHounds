import Button from "./Button";
import "./css/Profile.css";
import React from "react";
import { TzContext } from "./context/TzToolKitContext";
import { buyHound, randomBase62 } from "../scripts/util";
import { ContractAbstraction, Wallet } from "@taquito/taquito";

function UseContract(): JSX.Element {
  const tzContext = React.useContext(TzContext);

  return (
    <Button
      style={{ minWidth: "90px", padding: "4px" }}
      onClick={() => buyHound(tzContext.contract as ContractAbstraction<Wallet>, randomBase62(40))}
    >
      Buy
    </Button>
  );
}

export default UseContract;
