import Button from "./Button";
import "./css/Profile.css";
import React from "react";
import { TzContext } from "./context/TzToolKitContext";
import { buyHound, randomBase62 } from "../scripts/util";
import { WalletContext } from "./context/WalletContext";

function UseContract(): JSX.Element {
  const tzContext = React.useContext(TzContext);
  const userAddress = React.useContext(WalletContext).userAddress;
  return (
    <Button
      style={{ minWidth: "90px", padding: "4px" }}
      onClick={() =>
        buyHound(
          tzContext,
          randomBase62(40),
          userAddress
        )
      }
    >
      Buy
    </Button>
  );
}

export default UseContract;
