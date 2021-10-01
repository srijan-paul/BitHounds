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
  const priceRef = React.useRef(null);

  const walletInfo = useContext(WalletContext);

  const [houndRenderer, setHoundRenderer] = useState<CanvasRenderFunc | undefined>();

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

      {walletInfo.userAddress == contractHound.creator ? (
        <div
          className="houndInfo__sell"
          style={{ textAlign: "left", marginTop: "2rem" }}
        >
          <input type="number" name="price" className="numberInput" ref={priceRef} />
          &nbsp;
          &nbsp;
          <Button>Sell</Button>
        </div>
      ) : null}
    </div>
  );
}

export default Hound;
