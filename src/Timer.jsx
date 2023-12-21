import React, { useState, useRef, useContext } from 'react';
import { PlayerContext } from '../context/Player';

const Timer = () => {
//   const [seconds, setSeconds] = useState(0);
//   const [isActive, setIsActive] = useState(false);
 
    const { timerValue} = useContext(PlayerContext);


  return (
    <div>
      <h1>make a move before: {timerValue} seconds</h1>
    </div>
  );
};

export default Timer;
