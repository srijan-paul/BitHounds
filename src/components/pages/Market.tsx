import React from "react";
import { ContractHound, HoundInfo, houndInfoFromGenome } from "../../scripts/hound-genome";
import { TzContext } from "../context/TzToolKitContext";
import HoundCard from "../HoundCard";
import { BigNumber } from "bignumber.js";
import "../css/Market.css";

type HoundListEntry = {
  id: ContractHound;
  price: BigNumber;
  hound: HoundInfo;
};

type HoundList = Array<HoundListEntry>;

function HoundList(): JSX.Element {
  const tzContext = React.useContext(TzContext);
  const mapOfHoundsOnSale: Map<string, ContractHound> = tzContext.contractStorage.market.valueMap;
  const houndList = Array.from(mapOfHoundsOnSale).map(([id, contractHound]) => {
    return {
      id: id.substring(1, id.length - 1),
      hound: houndInfoFromGenome(contractHound.genome),
      price: contractHound.price,
    };
  });

  return (
    <div className="market__houndList">
      {houndList.map(({ hound, id, price }, index) => (
        <HoundCard hound={hound} key={index} id={id} width={150} height={150} price={price} />
      ))}
    </div>
  );
}

export default function Market(): JSX.Element {
  return (
    <div className="market">
      <HoundList />
    </div>
  );
}
