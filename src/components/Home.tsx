import { TezosToolkit } from "@taquito/taquito";
import { useState } from "react";
import Button from "./Button";
import ConnectButton from "./ConnectWallet";

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

function Home() {
	return (
		<div>
			<Hero />
		</div>
	);
}

export default Home;
