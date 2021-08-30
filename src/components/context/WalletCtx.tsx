import React from "react";

// We use a react context to keep the wallet available globally across
// all components. The wallet is initialized when the user clicks The [Connect] button
// On the Hero section. (see `Home.tsx`.)
const WalletContext = React.createContext<any>(null);

function WalletProvider(props: { children: any }) {
	const wallet = React.useContext(WalletContext);
	return <WalletContext.Provider value={wallet}>{props.children}</WalletContext.Provider>;
}

export default WalletProvider;
