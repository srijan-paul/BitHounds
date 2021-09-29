import React, { useEffect, useState, useRef } from "react";
import { getRendererFromGenome, CanvasRenderFunc } from "../scripts/generate-hounds";
import { HoundInfo } from "../scripts/hound-genome";
import "./css/HoundCard.css";
import { useHistory } from "react-router-dom";

export function HoundCanvas({
  painter,
  width,
  height,
  isBreedingCandidate,
}: {
  painter: CanvasRenderFunc;
  width?: number;
  height?: number;
  isBreedingCandidate?: boolean;
}): JSX.Element {
  const DefaultWidth = 200,
    DefaultHeight = 200;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.imageSmoothingEnabled = false;

    painter(ctx, width || DefaultWidth, height || DefaultHeight);
  }, []);

  return (
    <div
      className="houndCanvasWrapper"
      style={{
        backgroundColor: isBreedingCandidate ? "#ffd6f7" : "#c5eefa",
      }}
    >
      <canvas className="houndCanvas" width={width} height={height} ref={canvasRef}></canvas>
    </div>
  );
}

export function EmptyCanvas({
  width,
  height,
  backgroundColor,
}: {
  width?: number;
  height?: number;
  backgroundColor?: string;
}): JSX.Element {
  return (
    <div
      className="houndCanvas"
      style={{
        backgroundColor: backgroundColor || "#c5eefa",
        padding: "25px 10px 0px 10px",
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px",
      }}
    >
      <canvas id="hound-canvas" width={width || "200"} height={height || "200"}></canvas>
    </div>
  );
}

function HoundLabel({ info }: { info: HoundInfo }): JSX.Element {
  const maxGenomeLen = 10;
  const genome = info.genome;
  const history = useHistory();

  return (
    <div className="houndLabel">
      <div className="houndLabel__id">{info.name}</div>
      <div className="houndLabel__info">
        <div className="houndLabel__info__gen">Gen {info.generation} </div>
        <div className="houndLabel__info__rarity">{info.rarity}</div>
        <div className="houndLabel__info__profile" onClick={() => history.push(`/hound/${genome}`)}>
          {genome.length >= maxGenomeLen ? genome.substring(0, maxGenomeLen) + "..." : genome}
        </div>
      </div>
    </div>
  );
}

function HoundCard({
  hound,
  width,
  height,
  isBreedingCandidate,
  onClick,
}: {
  hound: HoundInfo;
  width?: number;
  height?: number;
  isBreedingCandidate?: boolean;
  onClick?: (..._: any[]) => any;
}): JSX.Element {
  const [houndRenderer, setHoundRenderer] = useState<CanvasRenderFunc | undefined>();

  useEffect(() => {
    getRendererFromGenome(hound.genome)
      .then((renderer) => {
        setHoundRenderer(() => renderer);
      })
      .catch(console.error);
  }, [hound]);

  return (
    <div className="houndCard" onClick={onClick}>
      {houndRenderer ? (
        <HoundCanvas
          painter={houndRenderer}
          width={width}
          height={height}
          isBreedingCandidate={isBreedingCandidate}
        />
      ) : (
        <EmptyCanvas />
      )}
      <HoundLabel info={hound} />
    </div>
  );
}

export default HoundCard;
