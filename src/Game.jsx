import { useContext, useEffect, useRef, useState } from "react";
import { sepolia, useAccount, useWalletClient } from "wagmi";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { HasherAbi } from "../constant/abi";
import { byteCodehasher } from "../constant/byteCodeHasher";
import { waitForTransaction } from "@wagmi/core";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../context/Player";
import { toast } from "react-hot-toast";
import { isAddress } from 'viem'
const Game = () => {
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  //   console.log(isConnected);

  //   const [] = useContext(PlayerContext);
  const { Player,setPlayer, ContractAddressHasher, setGameName } =
    useContext(PlayerContext);
  //   const [gameName, setGameName] = useState("");
  const [player1, setPlayer1] = useState(address);
  const [loding, setLoding] = useState(false);

  // console.log(Player.current);
  const hasherContractAddress = useRef(null);

  //   const {  } = useRoutes();

  const router = useNavigate();


  function handlePlayerChange(e) {
    const value = e.target.value;
    console.log(value);
    if (isAddress(value)) {
     setPlayer(value);
    }
  }


  const { data: walletClient } = useWalletClient({
    chainId: sepolia.id,
  });

  const deployHasherContract = async () => {
    try {
      if (!Player) {
        toast.error("Please enter player address");
        return;
      } else {
        const TransactionHash  = await walletClient.deployContract({
          abi: HasherAbi,
          bytecode: byteCodehasher,
          account: address,
          gas: 570560,
        });

        console.log(TransactionHash);

        setLoding(true);
        let datawait =  waitForTransaction({
          hash: TransactionHash,
        });
      const result = await  toast.promise(datawait, {
          loading: "Waiting for transaction to complete",
          success: "Transaction completed successfully",
          error: "Transaction failed",
        })
        setLoding(false);

        //  datawait = Promise.resolve(datawait);
        //  console.log(result);
        //  console.log(result.contractAddress);

        hasherContractAddress.current = result.contractAddress;
        if (result.contractAddress) {
          // setContractAddressHasher(datawait.contractAddress);
          ContractAddressHasher.current = result.contractAddress;
          router("/Play", { replace: true });
        }
      }
    } catch (error) {
      toast.error(error.shortMessage);
      console.log(error.shortMessage);
    }
  };


  useEffect( () =>  {
    ContractAddressHasher.current = hasherContractAddress.current;
  },[ContractAddressHasher]) 

  useEffect(() => {
    if (hasherContractAddress.current && Player) {
      router("/Play", { replace: true });
    }
  }, [Player, router]);

  const connectWallet = () => {
    if (!isConnected) {
      openConnectModal();
    }

    if (isConnected) {
      deployHasherContract();
    }
  };

  return (
    <>
      <div className="absolute left-20 top-10">
        <ConnectButton />
      </div>
      <div className="flex items-center font-serif justify-center text-[#000000] w-full min-h-screen bg-[#DF6C4F]">
        <div className="border py-5 px-6 bg-[#49c5b6]  text-center rounded-xl  max-w-md">
          <h1 className="text-4xl     font-medium">Create Your Game</h1>
          <h1 className="text-sm text-white">
            Name your game and set the opponent
          </h1>
          <input
            type="text"
            placeholder="Game name"
            onChange={(e) => setGameName(e.target.value)}
            className="w-full p-1 rounded-md bg-white my-3"
          />
          <h1 className="mt-2 ">Bring Players to your Game</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Prevent form from submitting and reloading the page
              connectWallet();
            }}
          >
            <input
              type="text"
              placeholder="Player 1"
              className="w-full font-mono p-1 rounded-md bg-white mt-2"
              value={address}
              onChange={(e) => setPlayer1(e.target.value)}
            />
            <input
              type="text"
              placeholder="Player 2 address"
              className="w-full p-1 font-mono rounded-md bg-white  my-3"
              required
              onChange={handlePlayerChange}
            />
            {loding ? (
              <>
                <button className="border w-full p-1 my-3">Loading...</button>
              </>
            ) : (
              <button
                type="submit"
                // onClick={() => connectWallet()}
                className="border w-full hover:bg-white pointer p-1 my-3 rounded"
              >
                {isConnected ? "Build Game" : " Connect Wallet"}
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Game;
