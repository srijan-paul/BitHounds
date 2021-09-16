import React from "react";
import "./css/Actions.css";
import Egg from "../assets/cosmic-egg.png";
import Arrow from "../assets/arrow.png";
import Hound from "../assets/hound.png";

function Actions(): JSX.Element {
  return (
    <div className="main">
      <div className="grid-container">

        <div className="grid-child-first">
          <img src="https://s2.coinmarketcap.com/static/img/coins/200x200/2011.png"></img>
        </div>

        <div className="grid-child-second">
          <ul style={{listStyleType: "disc", listStylePosition: "inside"}}>
            <li>
              Grab Your Hound by staking XTZ.
            </li>
            <br />
            <li>
              Buy and sell Hounds with the community.
            </li>
            <br />
            <li>
              Breed Hounds and unlock Rare Hounds.
            </li>
            <br />
            <li>
              Experience Power of the Hound in the moon phase.
            </li>
            <br />
            <li>
              Battle your Hounds with others in the arena.
            </li>
          </ul>
        </div>
      </div>
      <br />
      <br />
      <h1 className="heading">How BitHounds Work ?</h1>
      <div className="cards">
        <div className="card">
          <img src={ Egg } className="left"></img>
          <div className="about__text">
             Grab your Egg by investing XTZ.
            <br />
            <br />
            <ul style={{listStyleType: "disc", listStylePosition: "inside"}}>
              <li>
                 Go to your profile.   
              </li>
              <li>
                 Click on Buy button.   
              </li>
              <li>
                 Wait for it to get ready.   
              </li>
            </ul>
          </div>
        </div>
        <div className="card">
          <img src={ Arrow } className="center"></img>
          <div className="about__text">
            Wait for Tezos to process the request.
            <br />
            <br />
            <ul style={{listStyleType: "disc", listStylePosition: "inside"}}>
              <li>
                 Wait for Baker to accept your request.   
              </li>
              <li>
                 Once Baker adds your request to block.   
              </li>
              <li>
                 your operation hash will be generated.   
              </li>
            </ul>
          </div>
        </div>
        <div className="card">
          <img src={ Hound } className="right"></img> 
          <div className="about__text">
            Get your Hound NFT.
            <br />
            <br />
            <ul style={{listStyleType: "disc", listStylePosition: "inside"}}>
              <li>
                Find out the characteristics of your Hound.   
              </li>
              <li>
                Watch out the moon-phase.   
              </li>
              <li>
                Compete with others.   
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Actions;
