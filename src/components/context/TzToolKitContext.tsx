import React from "react";
import { TezosToolkit } from "@taquito/taquito";
import PropTypes from "prop-types";

type TzContext = {
  toolkit: TezosToolkit;
  setToolkit: (tk: TezosToolkit) => void;
};

const defaultContext: TzContext = {
  toolkit: new TezosToolkit("https://api.tez.ie/rpc/granadanet"),
  setToolkit(tk) {
    this.toolkit = tk;
  },
};

export const TzContext = React.createContext<TzContext>(defaultContext);

export default function TzContextProvider(props: {
  children: PropTypes.ReactNodeLike;
}): JSX.Element {
  return <TzContext.Provider value={defaultContext}>{props.children}</TzContext.Provider>;
}
