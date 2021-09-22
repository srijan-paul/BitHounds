import React, { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { TezosToolkit, WalletProvider } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType, BeaconEvent, defaultEventCallbacks } from "@airgap/beacon-sdk";
import Button from "./Button";
import { WalletContext } from "./context/WalletContext";
import { TzContext } from "./context/TzToolKitContext";

type ButtonProps = {
  Tezos: TezosToolkit;
  setPublicToken: Dispatch<SetStateAction<string | null>>;
  setWalletConnected: Dispatch<SetStateAction<boolean>>;
};

function ConnectButton({setPublicToken, setWalletConnected }: ButtonProps): JSX.Element {
  const walletInfo = useContext(WalletContext);
  const tzContext = useContext(TzContext);

  async function connectWallet() {
    const wallet = walletInfo.wallet as BeaconWallet;
    const activeAccount = await wallet.client.getActiveAccount();
    if (activeAccount) {
      console.log("Already connected:", activeAccount.address);
      setWalletConnected(true);
    }
    else{
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
        console.log(walletInfo.userAddress, "<- Is the user address");
      } catch (error) {
        console.error(error);
        setWalletConnected(false);
      }
    }
    await wallet.clearActiveAccount();
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
      tzContext.toolkit.setWalletProvider(wallet as unknown as WalletProvider);
      tzContext.setToolkit(tzContext.toolkit);

      console.log(tzContext.toolkit.signer, "<- is the signer");

      walletInfo.setWallet(wallet);
      const activeAccount = await wallet.client.getActiveAccount();
      if (activeAccount) {
        const userAddress = await wallet.getPKH();
        walletInfo.setAddress(userAddress);
      }
    })();
  }, []);

  return (
    <Button onClick={connectWallet}>
      <i className="fas fa-wallet"></i>&nbsp; &nbsp; Connect Wallet
    </Button>
  );
}

export default ConnectButton;
