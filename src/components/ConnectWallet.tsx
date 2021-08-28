import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType, BeaconEvent, defaultEventCallbacks } from "@airgap/beacon-sdk";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import { LedgerSigner } from "@taquito/ledger-signer";

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
		setStorage(storage?.toNumber() || 10);
	};

	const connectWallet = async (): Promise<void> => {
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
			console.log(error);
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
			Tezos.setWalletProvider();
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
			<button className="button" onClick={connectWallet}>
				<span>
					<i className="fas fa-wallet"></i>&nbsp; Connect with wallet
				</span>
			</button>
		</div>
	);
};

export default ConnectButton;
