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

function ProfileHeader({hounds, address }: {hounds: any, address: string }): JSX.Element {
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
          Hounds Owned: {hounds[address].length}
          <br />
          Breeds completed: 2
          <br />
          Level: Initiate
        </div>
      </div>
    </div>
  );
}

function HoundList({hounds,address}: {hounds: any, address:string}): JSX.Element {
  console.log(hounds);
  console.log(hounds[address]);
  return (
    <div className="houndList"> 
      {hounds[address] && hounds[address].map((hound: HoundInfo, idx: React.Key | null | undefined) => {
        return <HoundCard key={idx} hound={hound} width={140} height={140} />;
      })}
    </div>  
  );
}

function UserProfile({ Tezos, hounds }: {Tezos:TezosToolkit, hounds:any}): JSX.Element {
  const { address } = useParams() as { address: string };
  console.log(address);
  console.log(hounds);
  return (
    <div className="userProfile">
      <ProfileHeader hounds={hounds} address={address} />
      <UpdateContract Tezos={Tezos}/>
      <HoundList hounds={hounds} address={address} />
    </div>
  );
}

export default UserProfile;

