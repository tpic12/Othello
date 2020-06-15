import React, { Component } from "react";
import Square from "../Square/Square";
import "./Gameboard.css";

class Gameboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starter: [
        [27, "white"],
        [28, "black"],
        [35, "black"],
        [36, "white"],
      ],
      pieces: {},
      squares: [],
      rows: [],
      cols: [],
      player: "white",
    };
  }

  componentDidMount() {
    this.initBoard();
    setTimeout(() => this.initPieces(), 1);
  }

  //initializes board squares and sets state
  initBoard = () => {
    const squares = [];
    const rows = [];
    const cols = [];

    for (let i = 0; i < 8; i++) {
      rows[i] = [];
      cols[i] = [];
    }
    for (let key = 0, i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let square = {
          index: key,
          row: i,
          col: j,
          piece: null,
        };
        squares[key] = square;
        rows[i][j] = square;
        cols[i][j] = square;
        key++;
      }
    }

    this.setState({ rows: rows });
    this.setState({ cols: cols });
    this.setState({ squares: squares }, this.setAdjacents);
  };
  setAdjacents() {
    const { squares, rows, cols } = this.state;

    squares.forEach((square) => {
      square.topLeft =
        rows[square.row - 1] && cols[square.col - 1]
          ? rows[square.row - 1][square.col - 1]
          : null;
      square.topRight =
        rows[square.row - 1] && cols[square.col + 1]
          ? rows[square.row - 1][square.col + 1]
          : null;
      square.bottomLeft =
        rows[square.row + 1] && cols[square.col - 1]
          ? rows[square.row + 1][square.col - 1]
          : null;
      square.bottomRight =
        rows[square.row + 1] && cols[square.col + 1]
          ? rows[square.row + 1][square.col + 1]
          : null;
      square.top = rows[square.row - 1]
        ? rows[square.row - 1][square.col]
        : null;
      square.bottom = rows[square.row + 1]
        ? rows[square.row + 1][square.col]
        : null;
      square.left =
        rows[square.row] && cols[square.col - 1]
          ? rows[square.row][square.col - 1]
          : null;
      square.right =
        rows[square.row] && cols[square.col + 1]
          ? rows[square.row][square.col + 1]
          : null;
    });

    this.setState({ squares: squares });
  }

  initPieces = () => {
    const { squares, pieces } = this.state;

    this.state.starter.forEach((item, i) => {
      let piece = {
        location: item[0],
        color: item[1],
        id: i,
      };

      squares[item[0]].piece = piece;
      pieces[piece.id] = piece;
    });
    this.setState({ pieces: pieces });
    this.setState({ squares: squares });
  };

  handleTurn = () => {
    let player = this.state.player;
    player = player === "black" ? "white" : "black";
    this.setState({ player });
  };

  render() {
    let squares = this.state.squares.map((square, index) => {
      return (
        <Square
          key={index.index}
          index={index}
          piece={square.piece}
          handleTurn={this.handleTurn}
        />
      );
    });
    let rows = [];
    let chunk = 8;
    for (let i = 0; i < squares.length; i += chunk) {
      rows.push(squares.slice(i, i + chunk));
    }
    return (
      <div className="wrapper">
        <main className="main">
          <div className="board">
            {rows.map((row, index) => {
              return (
                <div className="row" key={index}>
                  {row}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }
}

export default Gameboard;
