import { TezosToolkit } from "@taquito/taquito";
import { useEffect, useState } from "react";
import Button from "./Button";
import ConnectButton from "./ConnectWallet";
import { getHoundRenderer } from "./scripts/generate-hounds";
import "./css/Home.css";

function ConnectWallet() {
  const [Tezos] = useState<TezosToolkit>(new TezosToolkit("https://api.tez.ie/rpc/granadanet"));
  const [, setPublicToken] = useState<string | null>("");
  const [isWalletConnected, setWalletConnected] = useState<boolean>(false);

  // If the beacon wallet connection has been established, then render an explore button instead.
  if (isWalletConnected) {
    return (
      <Button>
        <i className="fa fa-eye"></i> &nbsp; Explore
      </Button>
    );
  }

  return (
    <ConnectButton
      Tezos={Tezos}
      setPublicToken={setPublicToken}
      setWalletConnected={setWalletConnected}
    />
  );
}

function PlayButton() {
  return (
    <Button>
      <i className="fa fa-play"></i>
      &nbsp; &nbsp; Get Started
    </Button>
  );
}

function Hero() {
  return (
    <div className="hero">
      <div className="hero__text">
        <div className="hero__text__title">
          <img src="./logo.svg" alt="logo" />
          <h1>
            <span>Bit</span>Hounds
          </h1>
        </div>

        <p className="hero__text__desc">Digital collectible trading cards with beasts inside.</p>
      </div>

      <div className="hero__buttons">
        <ConnectWallet />
        <PlayButton />
      </div>
    </div>
  );
}

type CanvasBounds = {
  width: 200;
  height: 200;
};

function HoundPlay() {
  const [renderToCanvas, setRenderer] = useState<() => void>(() => () => {
    console.log(":(");
  });

  const [canvasBounds] = useState<CanvasBounds>({ width: 200, height: 200 });

  useEffect(() => {
    (async () => {
      try {
        const canvas = document.getElementById("hound-play-ctx") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.imageSmoothingEnabled = false;

        const renderHound = await getHoundRenderer();
        setRenderer(() => () => {
          renderHound(ctx, canvasBounds.width, canvasBounds.height);
        });
        renderHound(ctx, canvasBounds.width, canvasBounds.height);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="houndPlay">
      <div className="houndPlay__top">
        <canvas
          width={canvasBounds.width}
          height={canvasBounds.height}
          id="hound-play-ctx"
        ></canvas>
      </div>

      <div className="houndPlay__bottom">
        <Button onClick={() => renderToCanvas()}> Generate! </Button>
      </div>
    </div>
  );
}

function AboutGame() {
  return (
    <div className="aboutContainer">
      <div className="about">
        <div className="about__demo">
          <HoundPlay />
        </div>
        <div className="about__text">
          <h1>What are BitHounds?</h1>
          <p>
            BitHounds are unique and collectible digital beasts. Every hound is a unique asset that
            belongs to you! Become a hound trainer and compete with trainers from the world over.
            <br />
            <br />
            You can breed hounds to give birth to children, trade hounds with other trainers and
            engage with the community!
          </p>
        </div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div>
      <Hero />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 170">
        <path
          fill="#edf2f8"
          fillOpacity="1"
          d="M0,96L80,101.3C160,107,320,117,480,112C640,107,800,85,960,80C1120,75,1280,85,1360,90.7L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        ></path>
      </svg>

      <AboutGame />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#edf2f8"
          fillOpacity="1"
          d="M0,64L120,58.7C240,53,480,43,720,42.7C960,43,1200,53,1320,58.7L1440,64L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"
        ></path>
      </svg>
    </div>
  );
}

export default Home;
