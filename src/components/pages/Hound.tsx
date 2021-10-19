import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ContractHound, houndInfoFromGenome } from "../../scripts/hound-genome";
import { EmptyCanvas, HoundCanvas } from "../HoundCard";
import { CanvasRenderFunc, getRendererFromGenome } from "../../scripts/generate-hounds";
import "../css/HoundInfo.css";
import { TzContext } from "../context/TzToolKitContext";
import Button from "../Button";
import { WalletContext } from "../context/WalletContext";
import { useHistory } from "react-router";

const CanvasWidth = 200,
  CanvasHeight = 200;

function stringToHex(string: string) {
  let result = "";
  for (let i = 0; i < string.length; i++) {
    result += string.charCodeAt(i).toString(16);
  }
  return result;
}

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
  const userAddress = useContext(WalletContext).userAddress;
  const houndMap: Map<string, ContractHound> = tzContext.contractStorage.hounds.valueMap;
  const { id } = useParams() as { id: string };
  const contractHound = houndMap.get(`"${id}"`) as ContractHound;
  const houndInfo = houndInfoFromGenome(contractHound.genome, contractHound.generation);
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
    if (!contract) return;
    const response = await fetch(
      `http://localhost:8080/mint?creator=${userAddress}&genome=${contractHound.genome}`,
      { method: "POST" }
    );
    const json = await response.json();
    const op = await contract.methods
      .buy(houndId, stringToHex("ipfs://" + json.msg.metadataHash))
      .send({ amount: (contractHound.price.c as number[])[0], mutez: true });

    await op.confirmation();
  };

  useEffect(() => {
    getRendererFromGenome(houndInfo.genome)
      .then((renderer) => {
        setHoundRenderer(() => renderer);
      })
      .catch(console.error);
  }, []);

  const owner = contractHound.owner;
  const ownerAddress = owner.length <= 12 ? owner : owner.substring(0, 10) + "...";
  // const genome = houndInfo.genome.substring(0, 9) + "...";

  const history = useHistory();

  return (
    <div className="houndInfo">
      <div className="houndInfo__wrapper">
        <div
          className="houndInfo__canvas"
          style={{
            minWidth: CanvasWidth,
            minHeight: CanvasHeight,
            width: CanvasWidth,
            height: CanvasHeight,
            borderRadius: "25px",
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
          <div className="houndInfo__field"> <b>Mood:</b> {houndInfo.stats.mood}</div>
          <div className="houndInfo__field"> <b>Affiliation:</b> {houndInfo.stats.moon} moon</div>
          <div className="houndInfo__field"> <b>Spirit Animal</b>: {houndInfo.stats.spiritAnimal}</div>
          <div className="houndInfo__field"> <b>Rarity</b>: {houndInfo.rarity}</div>
          <div className="houndInfo__field">
            <b>Owner:</b>
            <span
              className="link"
              onClick={() => {
                history.push(`/usr/${owner}`);
              }}
            >
              {ownerAddress}
            </span>
          </div>
        </div>
      </div>

      {(() => {
        if (walletInfo.userAddress == contractHound.creator) {
          if (contractHound.onSale) {
            return (
              <div className="houndInfo__onSale">
                &nbsp; On sale for {(contractHound.price.c as number[])[0] / 1_000_000} ꜩ
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
            <div className="houndInfo__buy">
              <div className="houndInfo__onSale">
                &nbsp; On sale for {(contractHound.price.c as number[])[0] / 1_000_000} ꜩ
              </div>
              <br />
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
