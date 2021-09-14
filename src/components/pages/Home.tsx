import { TezosToolkit } from "@taquito/taquito";
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import Button from "../Button";
import ConnectButton from "../ConnectWallet";
import { getRandomHoundRenderer } from "../../scripts/generate-hounds";
import "../css/Home.css";
import { SVGSlantTop, SVGSlantBottom } from "../svgs";
import { Link } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";

type TezosProps = {
  setTezos: Dispatch<SetStateAction<any>>;
  setHounds: Dispatch<SetStateAction<any>>;
};

function ConnectWallet({ setTezos, setHounds }: TezosProps) {
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
      setTezos={setTezos}
      setHounds={setHounds}
      setPublicToken={setPublicToken}
      setWalletConnected={setWalletConnected}
    />
  );
}

function PlayButton() {
  const walletInfo = useContext(WalletContext);
  const userLink = "/usr/"+ walletInfo.userAddress; 
  return (
    <Link to = {userLink}>
      <Button>
        <i className="fa fa-play"></i>
        &nbsp; &nbsp; Get Started
      </Button>
    </Link>
  );
}

function Hero({ setTezos, setHounds }: TezosProps) {
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
        <ConnectWallet setTezos={setTezos} setHounds={setHounds} />
        <PlayButton />
      </div>
    </div>
  );
}

type CanvasBounds = {
  width: number;
  height: number;
};

function HoundPlay() {
  const [renderToCanvas, setRenderer] = useState<() => void>(
    () => () => console.error("Render functions not loaded yet.")
  );

  const [canvasBounds] = useState<CanvasBounds>({ width: 200, height: 200 });

  useEffect(() => {
    (async () => {
      try {
        const canvas = document.getElementById("hound-play-ctx") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.imageSmoothingEnabled = false;

        const renderHound = await getRandomHoundRenderer();
        setRenderer(() => () => renderHound(ctx, canvasBounds.width, canvasBounds.height));
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

function Home({ setTezos, setHounds }: TezosProps): JSX.Element {
  return (
    <div>
      <Hero setTezos={setTezos} setHounds = {setHounds}/>

      <SVGSlantTop />
      <AboutGame />
      <SVGSlantBottom />
    </div>
  );
}

export default Home;
