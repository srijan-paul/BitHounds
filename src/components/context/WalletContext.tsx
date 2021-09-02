import { BeaconWallet } from "@taquito/beacon-wallet";
import PropTypes from "prop-types";
import React from "react";

type WalletInfo = {
  wallet: BeaconWallet | null;
  userAddress: string;
  setAddress: (address: string) => void;
  setWallet: (address: BeaconWallet) => void;
};

const defaultWallet: WalletInfo = {
  wallet: null,
  userAddress: "",
  setWallet(wallet) {
    this.wallet = wallet;
  },
  setAddress(address) {
    this.userAddress = address;
  },
};

// We use a react context to keep the user address available globally across
// all components. The addresss is initialized when the user clicks The [Connect] button
// On the Hero section. (see `Home.tsx`.)
export const WalletContext = React.createContext<WalletInfo>(defaultWallet);

export function WalletProvider(props: { children: PropTypes.ReactNodeLike }): JSX.Element {
  const walletInfo = React.useContext(WalletContext);
  return <WalletContext.Provider value={walletInfo}>{props.children}</WalletContext.Provider>;
}
