import Button from "./Button";
import "./css/Profile.css";
import React from "react";
import { TzContext } from "./context/TzToolKitContext";
import { randomBase62 } from "../scripts/util";

function UseContract(): JSX.Element {
  const TzToolkit = React.useContext(TzContext).toolkit;

  const buy = async (): Promise<void> => {
    const contract = await TzToolkit.wallet.at("KT1LFf3MEDg4uZCtYHw4RM5zpuJEvF2NPYsJ");
    try {
      const genome = randomBase62(40);
      const op = await contract.methods.createHound(3, genome, 0).send();
      await op.confirmation();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button style={{ minWidth: "90px", padding: "4px" }} onClick={buy}>
      Buy
    </Button>
  );
}

export default UseContract;
