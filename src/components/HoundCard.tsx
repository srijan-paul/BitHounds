import React, { useEffect, useState, useRef } from "react";
import { getRendererFromGenome, CanvasRenderFunc } from "../scripts/generate-hounds";

export function HoundCanvas({ painter }: { painter: CanvasRenderFunc }): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  console.log(canvasRef.current);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.imageSmoothingEnabled = false;

    painter(ctx, 150, 150);
  }, []);

  return (
    <div className="houndCanvasWrapper">
      <canvas className="houndCanvas" width="150" height="150" ref={canvasRef}></canvas>
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

function HoundCard({ genome }: { genome: string }): JSX.Element {
  const [houndRenderer, setHoundRenderer] = useState<CanvasRenderFunc | undefined>();

  useEffect(() => {
    getRendererFromGenome(genome)
      .then((renderer) => {
        setHoundRenderer(() => renderer);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="houndCard">
      {houndRenderer ? <HoundCanvas painter={houndRenderer} /> : <EmptyCanvas />}
    </div>
  );
}

export default HoundCard;
