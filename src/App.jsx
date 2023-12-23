import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Game from './Game.jsx';
import Play from './Play.jsx';
// import {Toast}

const App = () => {
  


  return (
    <Router>
    <Routes>

      <Route path="/"  element={<Game/>} />
      <Route path="/Play" element={<Play/>} />
    </Routes>
  </Router>
  );
};

export default App;
