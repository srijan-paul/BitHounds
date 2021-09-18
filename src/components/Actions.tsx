import React from "react";
import "./css/Actions.css";
import Tezos_logo from "../assets/Tezos_logo.png";

function Actions(): JSX.Element {
  return (
    <div className="Actions">
      <div className="Actions__left">
        <img src={Tezos_logo} className="img"></img>
      </div>
      <div className="Actions__right">
        <ul style={{listStyleType: "disc", listStylePosition: "inside"}}>
          <li>
              Grab Your Hound by staking XTZ.
          </li>
          <li>
              Buy and sell Hounds with the community.
          </li>
          <li>
              Breed Hounds and unlock Rare Hounds.
          </li>
          <li>
              Experience Power of the Hound in the moon phase.
          </li>
          <li>
              Battle your Hounds with others in the arena.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Actions;
