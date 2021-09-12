import React, { useEffect, useState, useRef } from "react";
import { getRendererFromGenome, CanvasRenderFunc } from "../scripts/generate-hounds";
import { HoundInfo } from "../scripts/hound-genome";
import "./css/HoundCard.css";

export function HoundCanvas({
  painter,
  width,
  height,
}: {
  painter: CanvasRenderFunc;
  width?: number;
  height?: number;
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
    <div className="houndCanvasWrapper">
      <canvas className="houndCanvas" width={width} height={height} ref={canvasRef}></canvas>
    </div>
  );
}

function EmptyCanvas(): JSX.Element {
  return (
    <div className="houndCanvas">
      I am empty
      <canvas id="hound-canvas" width="200" height="200"></canvas>
    </div>
  );
}

function HoundLabel({ info }: { info: HoundInfo }): JSX.Element {
  return (
    <div className="houndLabel">
      <div className="houndLabel__id">#{info.id}</div>
      <div className="houndLabel__info">
        <div className="houndLabel__info__gen">Gen {info.generation} </div>
        <div className="houndLabel__info__rarity">{info.rarity}</div>
      </div>
    </div>
  );
}

function HoundCard({
  hound,
  width,
  height,
}: {
  hound: HoundInfo;
  width?: number;
  height?: number;
}): JSX.Element {
  const [houndRenderer, setHoundRenderer] = useState<CanvasRenderFunc | undefined>();

  useEffect(() => {
    getRendererFromGenome(hound.genome)
      .then((renderer) => {
        setHoundRenderer(() => renderer);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="houndCard">
      {houndRenderer ? (
        <HoundCanvas painter={houndRenderer} width={width} height={height} />
      ) : (
        <EmptyCanvas />
      )}
      <HoundLabel info={hound} />
    </div>
  );
}

export default HoundCard;
