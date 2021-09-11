import React from "react";
import { useParams } from "react-router-dom";
import DefaultProfilePic from "../../assets/default-user.png";
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
        <div className="profileHeader__right__description">Hounds Owned: 4
          <br />
          Breeds completed: 2
          <br/>
          Level: Initiate
        </div>
      </div>
    </div>
  );
}

const temporaryGenomes = [
  "1234".repeat(10),
  "xyzw".repeat(10),
  "d2ds".repeat(10),
  // "asd2".repeat(10),
  "qqqq".repeat(10),
  "qqqq".repeat(10),
  "qqqq".repeat(10),
  "qqqq".repeat(10)
];

function HoundList(): JSX.Element {
  return <div className="houndList">
    {temporaryGenomes.map((genome, idx) => {
      return <HoundCard key={idx} genome={genome} />;
    })}
  </div>;
}

function UserProfile(): JSX.Element {
  const { address } = useParams() as { address: string };
  console.log(address);
  return (
    <div className="userProfile">
      <ProfileHeader address={address} />
      <HoundList/>
    </div>
  );
}

export default UserProfile;
