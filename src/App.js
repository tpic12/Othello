import React from "react";
import Gameboard from "./Gameboard/Gameboard";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Othello - tpic12</h1>
      <Gameboard />
      <h2>Score Goes here</h2>
    </div>
  );
}

export default App;
