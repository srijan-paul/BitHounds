import { TezosToolkit } from "@taquito/taquito";
import React from "react";
import { useParams } from "react-router-dom";
import DefaultProfilePic from "../../assets/default-user.png";
import { HoundInfo } from "../../scripts/hound-genome";
import { assert } from "../../util/assert";
import "../css/Profile.css";
import HoundCard from "../HoundCard";
import UpdateContract from "../UpdateContract";

// Wallet addresses can be too long for us to render them fully, so
// we only render a substring.
const MaxAddressLen = 12;

function ProfileHeader({ hounds, address }: { hounds: HoundInfo[]; address: string }): JSX.Element {
  console.log(hounds, address);
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
          Hounds Owned: {hounds ? hounds.length : 0}
          <br />
          Breeds completed: 0 
          <br />
          Level: Initiate
        </div>
      </div>
    </div>
  );
}

function HoundList({ hounds }: { hounds: HoundInfo[] }): JSX.Element {
  return (
    <div className="houndList">
      {hounds.map((hound, key) => {
        return <HoundCard key={key} hound={hound} width={140} height={140} />;
      })}
    </div>
  );
}

function UserProfile({
  Tezos,
  hounds,
}: {
  Tezos: TezosToolkit;
  hounds: Map<string, HoundInfo[]>;
}): JSX.Element {
  const { address } = useParams() as { address: string };
  console.log(address);
  console.log(hounds);
  return (
    <div className="userProfile">
      <ProfileHeader hounds={hounds.get(address) as HoundInfo[]} address={address} />
      <UpdateContract Tezos={Tezos} />
      {hounds.has(address) ? (
        <HoundList hounds={hounds.get(address) as HoundInfo[]} />
      ) : (
        <div className="noHounds">User does not own any hounds.</div>
      )}
    </div>
  );
}

export default UserProfile;
