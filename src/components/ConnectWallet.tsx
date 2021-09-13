import React, { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { TezosToolkit, WalletProvider } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType, BeaconEvent, defaultEventCallbacks } from "@airgap/beacon-sdk";
import Button from "./Button";
import { WalletContext } from "./context/WalletContext";
import { HoundInfo, HoundRarity } from "../scripts/hound-genome";

type ButtonProps = {
  Tezos: TezosToolkit;
  setTezos: Dispatch<SetStateAction<any>>;
  setHounds: Dispatch<SetStateAction<any>>;
  setPublicToken: Dispatch<SetStateAction<string | null>>;
  setWalletConnected: Dispatch<SetStateAction<boolean>>;
};

const temporaryHounds: HoundInfo[] = [];

const generateHound = (genome: string, generation:number): HoundInfo => {
  return {
    nick: "Hound",
    generation: generation,
    id: Math.ceil(1241 + Math.random() * 2000),
    genome: genome,
    rarity: HoundRarity.COMMON,
  };
};

function ConnectButton({ Tezos, setTezos,setHounds,setPublicToken, setWalletConnected }: ButtonProps): JSX.Element {
  const walletInfo = useContext(WalletContext);

  async function connectWallet() {
    const wallet = walletInfo.wallet as BeaconWallet;
    try {
      await wallet.requestPermissions({
        network: {
          type: NetworkType.GRANADANET,
          rpcUrl: "https://api.tez.ie/rpc/granadanet",
        },
      });
      const userAddress = await wallet.getPKH();
      walletInfo.setAddress(userAddress);
      setWalletConnected(true);
      console.log(walletInfo.userAddress);
    } catch (error) {
      console.error(error);
      setWalletConnected(false);
    }
  }

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
            handler: (data) => setPublicToken(data.publicKey),
          },
        },
      });

      // TODO (@srijan): why do I have to cast the wallet twice here?
      Tezos.setWalletProvider(wallet as unknown as WalletProvider);
      setTezos(Tezos);
      walletInfo.setWallet(wallet);
      const activeAccount = await wallet.client.getActiveAccount();
      if (activeAccount) {
        const userAddress = await wallet.getPKH();
        walletInfo.setAddress(userAddress);
      }

      fetch("https://api.granadanet.tzkt.io/v1/contracts/KT1LFf3MEDg4uZCtYHw4RM5zpuJEvF2NPYsJ/storage", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if(temporaryHounds.length == 0) {
            for (let i=0; i < data.counter; i++) {
              if(data.hounds[i].owner == walletInfo.userAddress) {
                temporaryHounds.push(generateHound(data.hounds[i].genome,data.hounds[i].generation));
              }
            }
            console.log(temporaryHounds);
            setHounds(temporaryHounds);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    })();
  }, []);

  return (
    <Button onClick={connectWallet}>
      <i className="fas fa-wallet"></i>&nbsp; &nbsp; Connect Wallet
    </Button>
  );
}

export default ConnectButton;
