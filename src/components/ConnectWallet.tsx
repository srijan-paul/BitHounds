import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { TezosToolkit, WalletProvider } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType, BeaconEvent, defaultEventCallbacks } from "@airgap/beacon-sdk";
import Button from "./Button";

type ButtonProps = {
	Tezos: TezosToolkit;
	setContract: Dispatch<SetStateAction<any>>;
	setWallet: Dispatch<SetStateAction<any>>;
	setUserAddress: Dispatch<SetStateAction<string>>;
	setUserBalance: Dispatch<SetStateAction<number>>;
	setStorage: Dispatch<SetStateAction<number>>;
	contractAddress: string;
	setBeaconConnection: Dispatch<SetStateAction<boolean>>;
	setPublicToken: Dispatch<SetStateAction<string | null>>;
	wallet: BeaconWallet;
};

const ConnectButton = ({
	Tezos,
	setContract,
	setWallet,
	setUserAddress,
	setUserBalance,
	setStorage,
	contractAddress,
	setBeaconConnection,
	setPublicToken,
	wallet,
}: ButtonProps): JSX.Element => {
	const setup = async (userAddress: string): Promise<void> => {
		setUserAddress(userAddress);
		const balance = await Tezos.tz.getBalance(userAddress);
		setUserBalance(balance.toNumber());
		const contract = await Tezos.wallet.at(contractAddress);
		const storage: any = await contract.storage();
		setContract(contract);
		console.log(storage);
		setStorage(10);
	};

	const connectWallet = async () => {
		try {
			await wallet.requestPermissions({
				network: {
					type: NetworkType.GRANADANET,
					rpcUrl: "https://api.tez.ie/rpc/granadanet",
				},
			});
			const userAddress = await wallet.getPKH();
			await setup(userAddress);
			setBeaconConnection(true);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		(async () => {
			const wallet = new BeaconWallet({
				name: "Taquito Boilerplate",
				preferredNetwork: NetworkType.GRANADANET,
				disableDefaultEvents: true,
				eventHandlers: {
					[BeaconEvent.PAIR_INIT]: {
						handler: defaultEventCallbacks.PAIR_INIT,
					},
					[BeaconEvent.PAIR_SUCCESS]: {
						handler: data => setPublicToken(data.publicKey),
					},
				},
			});
			Tezos.setWalletProvider(wallet as unknown as WalletProvider);
			setWallet(wallet);
			const activeAccount = await wallet.client.getActiveAccount();
			if (activeAccount) {
				const userAddress = await wallet.getPKH();
				await setup(userAddress);
				setBeaconConnection(true);
			}
		})();
	}, []);

	return (
		<div className="buttons">
			<Button onClick={connectWallet}>
				<i className="fas fa-wallet"></i>&nbsp; &nbsp; Connect Wallet
			</Button>
		</div>
	);
};

export default ConnectButton;
