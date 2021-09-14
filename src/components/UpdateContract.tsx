/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-empty */
/* eslint-disable func-style */
import { TezosToolkit } from "@taquito/taquito";
import Button from "./Button";
import "./css/Profile.css";

interface UpdateContractProps {
    Tezos: TezosToolkit;
}

const UseContract = ({ Tezos }: UpdateContractProps) => {
  const buy = async (): Promise<void> => {
    const contract = await Tezos.wallet.at("KT1LFf3MEDg4uZCtYHw4RM5zpuJEvF2NPYsJ");
    try {
      const op = await contract.methods.createHound(3, "6Ip0PFw4AyzAqpQn8Bxh12XzcbfLCdlUlQzvjk2I", 0).send();
      await op.confirmation();
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  return (
    <div className="buyButton">
      <Button onClick={buy}>
        <span>
            Buy
        </span>
      </Button>
    </div>
  );
};


const UpdateContract = ({ Tezos }: UpdateContractProps): JSX.Element => {
  return (
    <div>
      <UseContract Tezos={Tezos}/>
    </div>
  );
};

export default UpdateContract;
