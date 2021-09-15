import React from "react";
import { TezosToolkit } from "@taquito/taquito";
import PropTypes from "prop-types";

const tzToolKit = new TezosToolkit("https://api.tez.ie/rpc/granadanet");
export const TzContext = React.createContext<TezosToolkit>(tzToolKit);

export default function TzContextProvider(props: {
  children: PropTypes.ReactNodeLike;
}): JSX.Element {
  return <TzContext.Provider value={tzToolKit}>{props.children}</TzContext.Provider>;
}
