import { TezosToolkit } from "@taquito/taquito";
import Button from "./Button";

interface UpdateContractProps {
    Tezos: TezosToolkit;
}

const UseContract = ({ Tezos }: UpdateContractProps) => {
    const breed = async (): Promise<void> => {
        const contract = await Tezos.wallet.at("KT1SqKjicYmm3AE1YJkMurwWS4Y9qjYPzTTf");
        try {
            console.log(contract)
            const op = await contract.methods.add(1, 10).send();
            await op.confirmation();
            const newStorage: any = await contract.storage();
            console.log(newStorage);
        } catch (error) {
            console.log(error);
        } finally {
        }
    };
  return (
    <div className="buttons">
          <Button onClick={breed}>
          <span>
            Create
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
}

export default UpdateContract;
