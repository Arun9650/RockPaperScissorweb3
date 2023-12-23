import { createContext, useRef, useState, useEffect } from "react";

// Create the context
export const PlayerContext = createContext();

// Create a provider for components to consume and subscribe to changes
export const PlayerProvider = ({ children }) => {
  
  const [Player, setPlayer] = useState("");
  // const Player = useRef("");
  const [player1Run, setPlayer1Run] = useState(false);
  const [player2Run, setPlayer2Run] = useState(false);
  const [timer, setTimer] = useState(null);
  const [timerValue, setTimerValue] = useState(300);
  const [timeover, setTimeOver] = useState(false);

  const [player1Timer, setPlayer1Timer] = useState(300); // 5 minutes in seconds
  // const player1Timer = useRef(300);
  const [player2Timer, setPlayer2Timer] = useState(300);


  const [gamename, setGameName] = useState("");
  const ContractAddressHasher = useRef("");


  useEffect(() => {
  const Player =  localStorage.getItem("Player");
  ContractAddressHasher.current = localStorage.getItem("ContractAddressHasher");
  if(Player){
    setPlayer(Player);
  }
  },[])

  useEffect(() => {
    localStorage.setItem("Player", Player);
  },[Player])

  useEffect(() => {
    let timer;
  
    if (player1Timer > 0 && player2Run) {
      timer = setTimeout(() => {
        // player1Timer.current = Math.max(0, player1Timer.current - 1);
        setPlayer1Timer((prevTimer) => Math.max(0, prevTimer - 1));
      }, 1000);
    }
  
    else if(player1Timer === 0 && player2Run){
      setTimeOver(true);
    }
  
    return () => clearTimeout(timer);
  }, [player1Timer, player2Run]);




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
    // player1Timer.current = 300;
  };


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
