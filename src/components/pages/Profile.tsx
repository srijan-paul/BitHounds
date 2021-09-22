import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DefaultProfilePic from "../../assets/default-user.png";
import { HoundInfo, HoundRarity } from "../../scripts/hound-genome";
import { WalletContext } from "../context/WalletContext";
import "../css/Profile.css";
import HoundCard from "../HoundCard";
import UseContract from "../UpdateContract";

// Wallet addresses can be too long for us to render them fully, so
// we only render a substring.
const MaxAddressLen = 12;

const generateHound = (genome: string, generation: number): HoundInfo => {
  return {
    nick: "Hound",
    generation: generation,
    id: Math.ceil(1241 + Math.random() * 2000),
    genome: genome,
    rarity: HoundRarity.COMMON,
  };
};

function ProfileHeader({ hounds, address }: { hounds: HoundInfo[]; address: string }): JSX.Element {
  const walletInfo = React.useContext(WalletContext);
  const { userAddress } = walletInfo;

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
        <br />
        {userAddress == address ? <UseContract /> : null}
      </div>
    </div>
  );
}

function HoundList({
  address,
  hounds,
  setHounds,
}: {
  address: string;
  hounds: HoundInfo[];
  setHounds: Dispatch<SetStateAction<HoundInfo[]>>;
}): JSX.Element {
  const fetchHounds = async (address: string) => {
    const url = `https://api.granadanet.tzkt.io/v1/operations/transactions?sender=${address}&target=KT1LFf3MEDg4uZCtYHw4RM5zpuJEvF2NPYsJ&entrypoint=createHound`;
    const response = await fetch(url, { method: "GET" });
    const storage = await response.json();
    const temporary = storage.map(
      (hound: { parameter: { value: { genome: string; generation: number } } }) =>
        generateHound(hound.parameter.value.genome, hound.parameter.value.generation)
    );
    setHounds(temporary);
  };

  useEffect(() => {
    fetchHounds(address);
  }, []);

  return (
    <div className="houndList">
      {hounds
        ? hounds.map((hound, key) => <HoundCard key={key} hound={hound} width={140} height={140} />)
        : "Loading..."}
    </div>
  );
}

function UserProfile(): JSX.Element {
  const { address } = useParams() as { address: string };
  const [hounds, setHounds] = useState<HoundInfo[]>([]);
  return (
    <div className="userProfile">
      <ProfileHeader hounds={hounds} address={address} />
      <HoundList address={address} hounds={hounds} setHounds={setHounds} />
    </div>
  );
}

export default UserProfile;
