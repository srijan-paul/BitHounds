import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { TezosToolkit, WalletProvider } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType, BeaconEvent, defaultEventCallbacks } from "@airgap/beacon-sdk";
import Button from "./Button";
import { WalletContext } from "./context/WalletContext";

type ButtonProps = {
  Tezos: TezosToolkit;
  setPublicToken: Dispatch<SetStateAction<string | null>>;
  setWalletConnected: Dispatch<SetStateAction<boolean>>;
};

const ConnectButton = ({ Tezos, setPublicToken, setWalletConnected }: ButtonProps): JSX.Element => {
  const walletInfo = useContext(WalletContext);

  const connectWallet = async () => {
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

      // TODO (@srijan): why do I have to cast the wallet twice here?
      Tezos.setWalletProvider(wallet as unknown as WalletProvider);

      walletInfo.setWallet(wallet);
      const activeAccount = await wallet.client.getActiveAccount();
      if (activeAccount) {
        const userAddress = await wallet.getPKH();
        walletInfo.setAddress(userAddress);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Button onClick={connectWallet}>
      <i className="fas fa-wallet"></i>&nbsp; &nbsp; Connect Wallet
    </Button>
  );
};

export default ConnectButton;
