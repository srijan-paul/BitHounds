import { TezosToolkit } from "@taquito/taquito";
import Button from "./Button";
import "./css/Profile.css";
import React, { useContext } from "react";
import { TzContext } from "./context/TzToolKitContext";
import { randomBase62 } from "../scripts/util";

interface UpdateContractProps {
  Tezos: TezosToolkit;
}

const UseContract = ({ Tezos }: UpdateContractProps) => {
  const buy = async (): Promise<void> => {
    const contract = await Tezos.wallet.at("KT1LFf3MEDg4uZCtYHw4RM5zpuJEvF2NPYsJ");
    try {
      const genome = randomBase62(40);
      const op = await contract.methods.createHound(3, genome, 0).send();
      await op.confirmation();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="buyButton">
      <Button onClick={buy}>
        <span>Buy</span>
      </Button>
    </div>
  );
};

const UpdateContract = (): JSX.Element => {
  const tezos = useContext(TzContext);
  return <UseContract Tezos={tezos.toolkit} />;
};

export default UpdateContract;
