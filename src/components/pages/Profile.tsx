import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DefaultProfilePic from "../../assets/default-user.png";
import { breedHoundGenomes, HoundInfo, HoundRarity } from "../../scripts/hound-genome";
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
  hounds: HoundInfo[];
  parent1: HoundInfo | null;
  parent2: HoundInfo | null;
  setHounds: Dispatch<SetStateAction<HoundInfo[]>>;
  setParent1: Dispatch<SetStateAction<HoundInfo | null>>;
  setParent2: Dispatch<SetStateAction<HoundInfo | null>>;
}): JSX.Element {
  const fetchHounds = async (address: string) => {
    const url = `https://api.granadanet.tzkt.io/v1/operations/transactions?sender=${address}&target=KT1LFf3MEDg4uZCtYHw4RM5zpuJEvF2NPYsJ&entrypoint=createHound`;
    const response = await fetch(url, { method: "GET" });
    const storage = await response.json();
    const tempHoundlist = storage.map(
      (hound: { parameter: { value: { genome: string; generation: number } } }) =>
        generateHound(hound.parameter.value.genome, hound.parameter.value.generation)
    );
    setHounds(tempHoundlist);
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
              hound={hound}
              width={CanvasWidth}
              height={CanvasHeight}
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
  parent1: HoundInfo | null;
  parent2: HoundInfo | null;
  setParent1: Dispatch<SetStateAction<HoundInfo | null>>;
  setParent2: Dispatch<SetStateAction<HoundInfo | null>>;
}): JSX.Element {
  const breedingInfo = React.useContext(BreedInfoContext);
  const { toolkit: TzToolkit } = React.useContext(TzContext);

  return (
    <div className="breedSection">
      <div className="breedSection__hounds">
        <div className="breedSection__parent1">
          {parent1 ? (
            <HoundCard hound={parent1} width={CanvasWidth} height={CanvasHeight} />
          ) : (
            <EmptyCanvas width={CanvasWidth} height={CanvasHeight} backgroundColor="#ffd6f7" />
          )}
        </div>
        <i className="fa fa-heart" style={{ color: "#ffd6f7", fontSize: "2rem" }}></i>
        <div className="breedSection__parent2">
          {parent2 ? (
            <HoundCard hound={parent2} width={CanvasWidth} height={CanvasHeight} />
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
            const crossedGenome = breedHoundGenomes(parent1.genome, parent2.genome);
            breedingInfo.setChildGenome(crossedGenome);
            await buyHound(TzToolkit, crossedGenome);
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
  const [hounds, setHounds] = useState<HoundInfo[]>([]);
  const wallet = useContext(WalletContext);
  const [parent1, setParent1] = useState<HoundInfo | null>(null);
  const [parent2, setParent2] = useState<HoundInfo | null>(null);

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
