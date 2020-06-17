import React from "react";
import Gameboard from "./Gameboard/Gameboard";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="title">
        <h1>Othello - tpic12</h1>
      </div>
      <Gameboard />
    </div>
  );
}

export default App;
