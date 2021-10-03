import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ContractHound, houndInfoFromGenome } from "../../scripts/hound-genome";
import { EmptyCanvas, HoundCanvas } from "../HoundCard";
import { CanvasRenderFunc, getRendererFromGenome } from "../../scripts/generate-hounds";
import "../css/HoundInfo.css";
import { TzContext } from "../context/TzToolKitContext";
import Button from "../Button";
import { WalletContext } from "../context/WalletContext";

const CanvasWidth = 200,
  CanvasHeight = 200;

function HoundStats({ labels }: { labels: string[] }): JSX.Element {
  return (
    <div className="houndInfo__stats">
      {labels.map((label, index) => (
        <div className="houndInfo__label" key={index}>
          {label}
        </div>
      ))}
    </div>
  );
}

function Hound(): JSX.Element {
  const tzContext = useContext(TzContext);
  const houndMap: Map<string, ContractHound> = tzContext.contractStorage.hounds.valueMap;
  const { id } = useParams() as { id: string };
  const contractHound = houndMap.get(`"${id}"`) as ContractHound;
  const houndInfo = houndInfoFromGenome(contractHound.genome);
  const priceRef = React.useRef<HTMLInputElement>(null);

  const walletInfo = useContext(WalletContext);

  const [houndRenderer, setHoundRenderer] = useState<CanvasRenderFunc | undefined>();

  const sellHound = async () => {
    const houndId = parseInt(id);
    if (!priceRef.current) return;
    const price = parseFloat(priceRef.current?.value);

    const contract = tzContext.contract;
    if (!contract) {
      console.error("Invalid state");
      return;
    }

    const op = await contract.methods.sell(houndId, price).send();
    await op.confirmation();

    // Reload the contract storage since we added a new hound to the `market` list.
    await tzContext.loadContract();
  };

  const purchaseHound = async () => {
    const houndId = parseInt(id);
    const { contract } = tzContext;
    if (!contract) {
      return;
    }

    const op = await contract.methods
      .buy(houndId)
      .send({ amount: (contractHound.price.c as number[])[0] });

    await op.confirmation();
  };

  useEffect(() => {
    getRendererFromGenome(houndInfo.genome)
      .then((renderer) => {
        setHoundRenderer(() => renderer);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="houndInfo">
      <div className="houndInfo__wrapper">
        <div
          className="houndInfo__canvas"
          style={{
            maxWidth: CanvasWidth,
            maxHeight: CanvasHeight,
          }}
        >
          {houndRenderer ? (
            <HoundCanvas painter={houndRenderer} width={CanvasWidth} height={CanvasHeight} />
          ) : (
            <EmptyCanvas width={CanvasWidth} height={CanvasHeight} />
          )}
        </div>

        <div className="houndInfo__data">
          <div className="houndInfo__name">{houndInfo.name}</div>
          <HoundStats labels={houndInfo.stats.traits} />
          <br />
          <div className="houndInfo__field">Mood: {houndInfo.stats.mood}</div>
          <div className="houndInfo__field">Affiliation: {houndInfo.stats.moon} moon</div>
          <div className="houndInfo__field">Spriti Animal: {houndInfo.stats.spiritAnimal}</div>
        </div>
      </div>

      {(() => {
        if (walletInfo.userAddress == contractHound.creator) {
          if (contractHound.onSale) {
            return (
              <div className="houndInfo__onSale">
                &nbsp; On sale for {(contractHound.price.c as number[])[0]} mutez
              </div>
            );
          } else {
            return (
              <div className="houndInfo__sell" style={{ textAlign: "left", marginTop: "2rem" }}>
                <input type="number" name="price" className="numberInput" ref={priceRef} />
                &nbsp; &nbsp;
                <Button onClick={sellHound}>Sell</Button>
              </div>
            );
          }
        }

        if (walletInfo.userAddress != contractHound.creator && contractHound.onSale) {
          return (
            <div className="houndInf__buy">
              <Button onClick={purchaseHound}> Buy</Button>
            </div>
          );
        }

        return null;
      })()}
    </div>
  );
}

export default Hound;
