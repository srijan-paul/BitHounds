import React from "react";
import { useParams } from "react-router-dom";
import DefaultProfilePic from "../../assets/default-user.png";
import { HoundInfo, HoundRarity } from "../../scripts/hound-genome";
import "../css/Profile.css";
import HoundCard from "../HoundCard";

// Wallet addresses can be too long for us to render them fully, so
// we only render a substring.
const MaxAddressLen = 12;

function ProfileHeader({ address }: { address: string }): JSX.Element {
  return (
    <div className="profileHeader">
      <div className="profileHeader__left">
        <div className="profileHeader__left__pic">
          <img src={DefaultProfilePic}></img>
        </div>
        <div className="profileHeader__left__address">
          {address.length >= MaxAddressLen ? address.substring(0, MaxAddressLen) + "..." : address}
        </div>
      </div>
      <div className="profileHeader__right">
        <div className="profileHeader__right__name">Anonymous Trainer</div>
        <div className="profileHeader__right__description">
          Hounds Owned: 4
          <br />
          Breeds completed: 2
          <br />
          Level: Initiate
        </div>
      </div>
    </div>
  );
}

const generateRandomData = (genome: string): HoundInfo => {
  return {
    nick: "Hound",
    generation: Math.floor(1 + Math.random() * 3),
    id: Math.ceil(1241 + Math.random() * 2000),
    genome: genome,
    rarity: HoundRarity.COMMON,
  };
};

const temporaryHounds = [
  generateRandomData("1234".repeat(10)),
  generateRandomData("XXXX".repeat(10)),
  generateRandomData("qqqx".repeat(10)),
  generateRandomData("q123".repeat(10)),
  generateRandomData("a12e".repeat(10)),
  generateRandomData("se12".repeat(10)),
  generateRandomData("12ds".repeat(10)),
  generateRandomData("xw21".repeat(10)),
  generateRandomData("AAAA".repeat(10)),
];

function HoundList(): JSX.Element {
  return (
    <div className="houndList">
      {temporaryHounds.map((hound, idx) => {
        return <HoundCard key={idx} hound={hound} width={140} height={140} />;
      })}
    </div>
  );
}

function UserProfile(): JSX.Element {
  const { address } = useParams() as { address: string };
  console.log(address);
  return (
    <div className="userProfile">
      <ProfileHeader address={address} />
      <HoundList />
    </div>
  );
}

export default UserProfile;
