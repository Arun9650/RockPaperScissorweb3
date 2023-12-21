import { createContext, useRef, useState, useEffect } from "react";

// Create the context
export const PlayerContext = createContext();

// Create a provider for components to consume and subscribe to changes
export const PlayerProvider = ({ children }) => {
  const [Player, setPlayer] = useState("");
  const [player1Run, setPlayer1Run] = useState(false);
  const [player2Run, setPlayer2Run] = useState(false);
  const [timer, setTimer] = useState(null);
  const [timerValue, setTimerValue] = useState(300);
  const [timeover, setTimeOver] = useState(false);

  const [player1Timer, setPlayer1Timer] = useState(300); // 5 minutes in seconds
  const [player2Timer, setPlayer2Timer] = useState(300);


  const [gamename, setGameName] = useState("");
  const ContractAddressHasher = useRef("");


  useEffect(() => {
    let timer;

    if (player1Timer > 0 && player2Run) {
      timer = setTimeout(() => {
        setPlayer1Timer((prevTimer) => Math.max(0, prevTimer - 1));
      }, 1000);
    }

    else if(player1Timer == 0 && player2Run){
        setTimeOver(true);
    }

    return () => clearTimeout(timer);
  }, [player1Timer , player2Run]);




  useEffect(() => {
    let timer;

    if (player2Timer > 0 && player1Run) {
      timer = setTimeout(() => {
        setPlayer2Timer((prevTimer) => Math.max(0, prevTimer - 1));
      }, 1000);
    }


    else if(player2Timer == 0 && player1Run){
        setTimeOver(true);
    }

    return () => clearTimeout(timer);
  }, [player2Timer , player1Run]);


  const player1MakesMove = () => {
    setPlayer2Timer(300);
  };

  const player2MakesMove = () => {
    setPlayer1Timer(300);
  };

  // const startTimer = () => {
  //   const newTimer = setInterval(() => {
  //     setTimerValue((prevValue) => {
  //       if (prevValue === 0 || prevValue === 300) {
  //         clearInterval(newTimer);
  //         setTimer(null);
  //         setTimeOver(true);
  //         return 0;
  //       }
  //       return prevValue - 1;
  //     });
  //   }, 1000);

  //   setTimer(newTimer);
  // };

  // const stopTimer = () => {
  //   clearInterval(timer);
  //   setTimer(null);
  // };

  // const resetTimer = () => {
  //   setTimer(0);
  //   stopTimer();
  // };

  return (
    <PlayerContext.Provider
      value={{
        player1Timer,
        player2Timer,
        player1MakesMove,
        player2MakesMove,
        timer,
        timerValue,
        timeover,
        Player,
        setPlayer,
        ContractAddressHasher,
        gamename,
        setGameName,
        player2Run,
        player1Run,
        setPlayer1Run,
        setPlayer2Run,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
