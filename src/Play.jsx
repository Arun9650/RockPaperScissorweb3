import { useEffect, useRef, useState } from "react";

import {
  prepareWriteContract,
  readContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";
import { HasherAbi, RPSabi } from "../constant/abi.js";

import { useContext } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { PlayerContext } from "../context/Player";
import { sepolia } from "wagmi/chains";
import {  parseEther } from "viem";
import { byteCodeRPS } from "../constant/byteCodeRSP.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
// import Timer from "./Timer.jsx";

const Play = () => {
  const { address } = useAccount();

  const [salt, setSalt] = useState(0);
  const [selectedValue, setSelectedValue] = useState(0);
  const [hash, setHash] = useState(0);
  const [selectedValue2, setSelectedValue2] = useState(0);
  const [loding, setLoding] = useState(false);
  const [loding2, setLoding2] = useState(false);
  const [loding3, setLoding3] = useState(false);
  const [showWhoWins, setShowWhoWins] = useState(false);
  const [bet, setBet] = useState(0);
  const [whowins, setWhowins] = useState(null);
  const [noBet, setNobet] = useState(true);
  const [betPlaced, setBetPlaced] = useState(false);
  const [saveClick, setSaveClick] = useState(false);
  //   const [time, setTime] = useState(0);
  const {
    Player,
    player2Run,
    ContractAddressHasher,
    gamename,
    player1Timer,
    player2Timer,
    timeover,
    player1MakesMove,
    player2MakesMove,
    setPlayer1Run,
    setPlayer2Run,
  } = useContext(PlayerContext);
  //   console.log("Player", Player);

  const { data: walletClient } = useWalletClient({
    chainId: sepolia.id,
  });
  // console.log("Player", Player);

  const moves = ['Null', 'Rock', 'Paper', 'Scissors', 'Spock', 'Lizard'];

  const ContractAddressRSP = useRef(null);

  const router = useNavigate();

  const Hash = async () => {
    console.log(ContractAddressHasher);
    try {
      const firstPlayerMove = Number(selectedValue);
      const firstPlayerSalt = Number(salt);

      console.log("firstPlayerMove", firstPlayerMove);
      console.log("firstPlayerSalt", firstPlayerSalt);

      const { request } = await prepareWriteContract({
        abi: HasherAbi,
        address: ContractAddressHasher.current,
        functionName: "hash",
        args: [firstPlayerMove, firstPlayerSalt],
      });

      const { hash } = await writeContract(request);

      // console.log("hash", hash);
      setLoding(true);
      // toast.loading("Transaction is in progress");
      const txWait =  waitForTransaction({
        hash: hash,
      });

      toast.promise(txWait, {
        loading: "Waiting for transaction to complete",
        success: "Transaction completed successfully",
        error: "Transaction failed",
      });
      
      setLoding(false);

      console.log("txWait", txWait);

      const result = await readContract({
        address: ContractAddressHasher.current,
        abi: HasherAbi,
        functionName: "hash",
        args: [firstPlayerMove, firstPlayerSalt],
      });
      setHash(result);
      console.log("result", result);
    } catch (error) {
      console.log(error);
      toast.error(error.shortMessage);
    }
    // console.log("result", typeof result);
  };

  const RSP = async () => {
    try {
      const txhash = await walletClient.deployContract({
        abi: RPSabi,
        bytecode: byteCodeRPS,
        account: address,
        gas: 5705600,
        value: parseEther(bet),
        args: [hash, Player],
      });

      // console.log(hash);
      // console.log(txhash);

      setLoding(true);
      const transactionHash =  waitForTransaction({
        hash: txhash,
      });
      setLoding(false);
    
   const result =  await    toast.promise(transactionHash, {
        loading: "Waiting for transaction to complete",
          success: "Transaction completed successfully",
          error: "Transaction failed",
      });




      alert("Please change your account to second player");
      // console.log(contractAddress);

      ContractAddressRSP.current = result.contractAddress;

      // Timer();
      setPlayer1Run(true);
      // startTimer()
      setNobet(false);
      setBetPlaced(true);

      player1MakesMove();
    } catch (error) {
      console.log(error);
      toast.error(error.shortMessage);
    }
  };

  useEffect(() => {
    if (timeover) {
      if (player1Timer) {
        (async function () {
          const data = await prepareWriteContract({
            abi: RPSabi,
            functionName: "j1Timeout",
            address: ContractAddressRSP.current,
            account: address,
          });

          const hash = await writeContract(data);

          const txWait = await waitForTransaction({
            hash: hash.hash,
          });

          console.log(txWait);
        })();
      } else if (player2Timer) {
        (async function () {
          const data = await prepareWriteContract({
            abi: RPSabi,
            functionName: "j2Timeout",
            address: ContractAddressRSP.current,
          });

          const hash = await writeContract(data);

          const txWait = await waitForTransaction({
            hash: hash.hash,
          });

          console.log(txWait);
        })();
      }
    }
  }, [timeover, player1Timer, player2Timer, address]);

  const Play = async () => {
    try {
      console.log("contractRSP", ContractAddressRSP.current);
      const data = await prepareWriteContract({
        abi: RPSabi,
        address: ContractAddressRSP.current,
        functionName: "play",
        args: [Number(selectedValue2)],
        value: parseEther(bet),
      });

      const { hash } = await writeContract(data);

      setLoding2(true);
      const txWait =  waitForTransaction({
        hash: hash,
      });

   
      setPlayer1Run(false);

     const result = await  toast.promise(txWait, {
        loading: "Waiting for transaction to complete",
          success: "Transaction completed successfully",
          error: "Transaction failed",
      })

      console.log("result", result);


      setLoding2(false);
      alert("Please change your account to first player");
      alert("Please Click on Click me to see who wins the game");

      // console.log("txwait", txWait);
      setNobet(true);
      setPlayer2Run(true);
      player2MakesMove();
     
      // setPlayer2Run(true);
      
      // player1Timer.current 
    } catch (error) {
      console.log(error);
      toast.error(error.shortMessage);
    }
  };

  const Save = async () => {
    // console.log("contractRSP", ContractAddressRSP.current);
    // console.log("selectedvalue", selectedValue);
    // console.log("salt", ContractAddressRSP.current);
    try {
      setPlayer2Run(false);
      const data = await prepareWriteContract({
        abi: RPSabi,
        address: ContractAddressRSP.current,
        functionName: "solve",
        args: [Number(selectedValue), Number(salt)],
      });

      const hash = await writeContract(data);

      setLoding3(true);

      const txWait = await waitForTransaction({
        hash: hash.hash,
      });
      setLoding3(false);
      setSaveClick(true);

      console.log("txWait", txWait);

      console.log("hash", hash);
      console.log("selce", selectedValue);
      console.log("selce2", selectedValue2);
      console.log("Contract ", ContractAddressRSP.current);
      const whoWins = await readContract({
        abi: RPSabi,
        address: ContractAddressRSP.current,
        functionName: "win",
        args: [Number(selectedValue), Number(selectedValue2)],
      });

      setWhowins(whoWins);
      setShowWhoWins(true);
      console.log("whowindse", whoWins);
    } catch (error) {
      setPlayer2Run(true);
      console.log(error);
      toast.error(error.shortMessage);
    }
  };
  return (
    <>
      <div className="flex h-screen   relative bg-[#DF6C4F]  p-4">
        <div className="absolute left-32 z-20">
          <button
            className="w-full  hover:text-white underline text-black font-mono"
            onClick={() => router("/")}
          >
            Back to Home
          </button>
        </div>
        <div className="  flex flex-col w-full ">
          <div className="mx-auto  text-black underline text-3xl ">
            {gamename ? gamename : "Rock Paper Scissor"}
          </div>
          <div className="flex w-full ">
            <div className="w-1/2  relative flex flex-col  items-center pt-20 ">
              <div className="absolute top-14">
                click on click me before {player1Timer} seconds
              </div>
              <div className="border bg-[#49c5b6]  p-5 rounded-xl">
                <div className="mb-2">
                  First Player:{" "}
                  <span className="p-1 font-mono bg-white rounded-md text-black">
                    {address}
                  </span>
                </div>
                <div className="flex  flex-col">
                  {hash ? (
                    <>
                      <div className="flex gap-4 ">
                        <h1>Place your Bet (Eth)</h1>
                        <input
                          type="number"
                          className="bg-white font-mono text-black"
                          onChange={(e) => setBet(e.target.value)}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-5">
                        <h1>Choose your move: </h1>
                        <select
                          name=""
                          id=""
                          className="w-40 mx-3 bg-white font-mono text-black"
                          value={selectedValue}
                          onChange={(e) => setSelectedValue(e.target.value)}
                        >
                          <option value="0">Null</option>
                          <option value="1">Rock</option>
                          <option value="2">Paper</option>
                          <option value="3">Scissor</option>
                          <option value="4">Spock</option>
                          <option value="5">Lizard</option>
                        </select>
                      </div>
                      <div className="flex gap-3 mt-2">
                        <label htmlFor="salt">Enter your Salt</label>
                        <input
                          type="number"
                          id="salt"
                          placeholder="1234"
                          className="bg-white font-mono text-black"
                          onChange={(e) => setSalt(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>

                {loding ? (
                  <button className="border hover:bg-white text-black font-serif w-full rounded-md p-1 mt-2 w- px-3">
                    Loading...
                  </button>
                ) : (
                  <button
                    onClick={() => (hash ? RSP() : Hash())}
                    disabled={betPlaced}
                    className="border w-full disabled:bg-gray-400 hover:bg-white uppercase text-black font-serif rounded-md p-1 mt-2 w- px-3"
                  >
                    {hash ? "Place a Bet" : "Commit Move"}
                  </button>
                )}
              </div>
            </div>

            <div className="w-1/2 flex  flex-col items-center pt-20 relative ">
              <div className="absolute top-14">
                Make a move before {player2Timer} seconds
              </div>
              <div className="border bg-[#49c5b6]  flex flex-col justify-between  rounded-lg p-5 h-full">
                <div>
                  second player :{" "}
                  <span className="bg-white p-1 rounded-md text-black font-mono">
                    {Player}
                  </span>
                </div>
                <div>
                  <div className="flex ">
                    <h1>Choose your move: </h1>
                    <select
                      name=""
                      id=""
                      className="w-40 mx-3 bg-white text-black"
                      onChange={(e) => setSelectedValue2(e.target.value)}
                    >
                      <option value="0">Null</option>
                      <option value="1">Rock</option>
                      <option value="2">Paper</option>
                      <option value="3">Scissor</option>
                      <option value="4">Spock</option>
                      <option value="5">Lizard</option>
                    </select>
                  </div>
                </div>
                {loding2 ? (
                  <button className="border w-full text-black font-serif  mx-auto rounded-md p-1 mt-2 px-3">
                    Loading...
                  </button>
                ) : (
                  <button
                    onClick={() => Play()}
                    disabled={!hash || noBet}
                    className="border disabled:bg-gray-400 uppercase hover:bg-white font-serif text-black w-full  mx-auto rounded-md p-1 mt-2 px-3"
                  >
                    Play
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex  mt-10 bg-[#DF6C4F] items-center  justify-center">
            {showWhoWins && <div className="">Player 1 choose {moves[selectedValue]}</div>}
            <div className=" ">
              <h1>let&apos;s see who wins</h1>
              {loding3 ? (
                <button className="border p-2 font-serif bg-[#49c5b6]  text-black rounded-md w-full">
                  Loading...
                </button>
              ) : (
                <button
                  onClick={() => Save()}
                  disabled={!betPlaced || !player2Run}
                  className="border p-2 hover:bg-white uppercase disabled:bg-gray-400 bg-[#49c5b6]  text-black font-serif rounded-md w-full"
                >
                  Click me{" "}
                </button>
              )}

              {saveClick && (
                <h1 className="text-3xl  font-serif font-semibold underline">
                  Player 1 {whowins ? "win" : "loss"}
                </h1>
              )}
            </div>
            {showWhoWins && <div>Player 2 Choose {moves[selectedValue2]}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Play;
