import { TezosToolkit } from "@taquito/taquito";
import React from "react";
import { useParams } from "react-router-dom";
import DefaultProfilePic from "../../assets/default-user.png";
import { HoundInfo} from "../../scripts/hound-genome";
import "../css/Profile.css";
import HoundCard from "../HoundCard";
import UpdateContract from "../UpdateContract";

// Wallet addresses can be too long for us to render them fully, so
// we only render a substring.
const MaxAddressLen = 12;

type TezosProps = {
  Tezos: TezosToolkit;
  hounds: HoundInfo[];
};

type Hound = {
  hounds: HoundInfo[];
};


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
          Hounds Owned: 3
          <br />
          Breeds completed: 2
          <br />
          Level: Initiate
        </div>
      </div>
    </div>
  );
}

function HoundList(hounds: Hound): JSX.Element {
  return (
    <div className="houndList"> 
      {hounds.hounds.map((hound, idx) => {
        return <HoundCard key={idx} hound={hound} width={140} height={140} />;
      })}
    </div>
  );
}

function UserProfile({ Tezos, hounds }: TezosProps): JSX.Element {
  const { address } = useParams() as { address: string };
  console.log(address);
  return (
    <div className="userProfile">
      <ProfileHeader address={address} />
      <UpdateContract Tezos={Tezos}/>
      <HoundList hounds={hounds} />
    </div>
  );
}

export default UserProfile;
