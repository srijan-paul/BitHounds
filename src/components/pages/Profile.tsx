import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DefaultProfilePic from "../../assets/default-user.png";
import {
  breedHoundGenomes,
  ContractHound,
  HoundInfo,
  houndInfoFromGenome,
} from "../../scripts/hound-genome";
import { buyHound } from "../../scripts/util";
import Button from "../Button";
import { TzContext } from "../context/TzToolKitContext";
import { WalletContext } from "../context/WalletContext";
import "../css/Profile.css";
import HoundCard, { EmptyCanvas } from "../HoundCard";
import UseContract from "../UpdateContract";

// Wallet addresses can be too long for us to render them fully, so
// we only render a substring.
const MaxAddressLen = 12;

type HoundListEntry = {
  houndInfo: HoundInfo;
  id: string;
};

type HoundList = Array<HoundListEntry>;

function ProfileHeader({ hounds, address }: { hounds: HoundList; address: string }): JSX.Element {
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

type BreedingInfo = {
  childGenome: string;
  setChildGenome: (g: string) => void;
};

const BreedInfoContext = React.createContext<BreedingInfo>({
  childGenome: "",
  setChildGenome(genome: string) {
    this.childGenome = genome;
  },
});

function HoundList({
  address,
  hounds,
  parent1,
  parent2,
  setHounds,
  setParent1,
  setParent2,
}: {
  address: string;
  hounds: HoundList;
  parent1: HoundListEntry | null;
  parent2: HoundListEntry | null;
  setHounds: Dispatch<SetStateAction<HoundList>>;
  setParent1: Dispatch<SetStateAction<HoundListEntry | null>>;
  setParent2: Dispatch<SetStateAction<HoundListEntry | null>>;
}): JSX.Element {
  const tzContext = useContext(TzContext);

  const fetchHounds = async (address: string) => {
    const houndMap: Map<string, ContractHound> = tzContext.contractStorage.hounds.valueMap;
    const houndList: HoundList = Array.from(houndMap)
      .filter(([, hound]) => hound.creator == address)
      .map(([id, hound]) => ({
        id: id.substring(1, id.length - 1),
        houndInfo: houndInfoFromGenome(hound.genome),
      }));

    setHounds(houndList);
  };

  useEffect(() => {
    fetchHounds(address);
  }, []);

  return (
    <div className="houndList">
      {hounds
        ? hounds.map((hound, index) => (
            <HoundCard
              key={index}
              hound={hound.houndInfo}
              width={CanvasWidth}
              height={CanvasHeight}
              id={hound.id}
              onClick={() => {
                let newParent1, newParent2;
                if (!parent1) {
                  newParent1 = hounds[index];
                  newParent2 = parent2;
                  setParent1(hounds[index]);
                } else if (!parent2) {
                  newParent2 = hounds[index];
                  newParent1 = parent1;
                  setParent2(hounds[index]);
                }

                if (newParent1 == newParent2 && newParent1 != null) {
                  setParent1(null);
                  setParent2(null);
                }
              }}
            />
          ))
        : "Loading..."}
    </div>
  );
}

const CanvasWidth = 140,
  CanvasHeight = 140;

function BreedSection({
  parent1,
  parent2,
  setParent1,
  setParent2,
}: {
  parent1: HoundListEntry | null;
  parent2: HoundListEntry | null;
  setParent1: Dispatch<SetStateAction<HoundListEntry | null>>;
  setParent2: Dispatch<SetStateAction<HoundListEntry | null>>;
}): JSX.Element {
  const breedingInfo = React.useContext(BreedInfoContext);
  const tzContext = React.useContext(TzContext);

  return (
    <div className="breedSection">
      <div className="breedSection__hounds">
        <div className="breedSection__parent1">
          {parent1 ? (
            <HoundCard
              hound={parent1.houndInfo}
              width={CanvasWidth}
              height={CanvasHeight}
              id={parent1.id}
            />
          ) : (
            <EmptyCanvas width={CanvasWidth} height={CanvasHeight} backgroundColor="#ffd6f7" />
          )}
        </div>
        <i className="fa fa-heart" style={{ color: "#ffd6f7", fontSize: "2rem" }}></i>
        <div className="breedSection__parent2">
          {parent2 ? (
            <HoundCard
              hound={parent2.houndInfo}
              width={CanvasWidth}
              height={CanvasHeight}
              id={parent2.id}
            />
          ) : (
            <EmptyCanvas width={CanvasWidth} height={CanvasHeight} backgroundColor="#ffd6f7" />
          )}
        </div>
      </div>
      <div className="breedSection__btns">
        <Button
          onClick={() => {
            setParent1(null);
            setParent2(null);
          }}
        >
          Clear
        </Button>
        <Button
          onClick={async () => {
            if (!parent1 || !parent2) return;
            const crossedGenome = breedHoundGenomes(
              parent1.houndInfo.genome,
              parent2.houndInfo.genome
            );
            breedingInfo.setChildGenome(crossedGenome);
            await buyHound(tzContext, crossedGenome);
          }}
        >
          Breed
        </Button>
      </div>
    </div>
  );
}

function UserProfile(): JSX.Element {
  const { address } = useParams() as { address: string };
  const [hounds, setHounds] = useState<HoundList>([]);
  const wallet = useContext(WalletContext);
  const [parent1, setParent1] = useState<HoundListEntry | null>(null);
  const [parent2, setParent2] = useState<HoundListEntry | null>(null);

  return (
    <div className="userProfile">
      <ProfileHeader hounds={hounds} address={address} />
      <HoundList
        parent1={parent1}
        parent2={parent2}
        setParent1={setParent1}
        setParent2={setParent2}
        address={address}
        hounds={hounds}
        setHounds={setHounds}
      />
      {wallet.userAddress == address ? (
        <BreedSection
          parent1={parent1}
          parent2={parent2}
          setParent1={setParent1}
          setParent2={setParent2}
        />
      ) : null}
    </div>
  );
}

export default UserProfile;
