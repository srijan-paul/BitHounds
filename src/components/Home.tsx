import { TezosToolkit } from "@taquito/taquito";
import { useState } from "react";
import Button from "./Button";
import ConnectButton from "./ConnectWallet";

function ConnectWallet() {
	const [Tezos] = useState<TezosToolkit>(new TezosToolkit("https://api.tez.ie/rpc/granadanet"));

	const [contract, setContract] = useState<any>(null);
	const [publicToken, setPublicToken] = useState<string | null>("");
	const [wallet, setWallet] = useState<any>();
	const [userAddress, setUserAddress] = useState<string>("");
	const [userBalance, setUserBalance] = useState<number>(0);
	const [storage, setStorage] = useState<number>(0);
	const [copiedPublicToken, setCopiedPublicToken] = useState<boolean>(false);
	const [beaconConnection, setBeaconConnection] = useState<boolean>(false);

	const contractAddress: string = "KT1WpkbcHe3UzVpwn95cqWuav8aPMR73bW6p";

	return (
		<ConnectButton
			Tezos={Tezos}
			setContract={setContract}
			setPublicToken={setPublicToken}
			setWallet={setWallet}
			setUserAddress={setUserAddress}
			setUserBalance={setUserBalance}
			setStorage={setStorage}
			contractAddress={contractAddress}
			setBeaconConnection={setBeaconConnection}
			wallet={wallet}
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
