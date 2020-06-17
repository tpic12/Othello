import React, { Component } from "react";
import Square from "../Square/Square";
import "./Gameboard.css";

class Gameboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starter: [
        [27, "White"],
        [28, "Black"],
        [35, "Black"],
        [36, "White"],
      ],
      pieces: {},
      squares: [],
      rows: [],
      cols: [],
      player: "Black",
      validMove: false,
      score: {
        black: 2,
        white: 2,
      },
      endGame: false,
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
          dir: {},
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
      square.dir.topLeft =
        rows[square.row - 1] && cols[square.col - 1]
          ? rows[square.row - 1][square.col - 1]
          : null;
      square.dir.topRight =
        rows[square.row - 1] && cols[square.col + 1]
          ? rows[square.row - 1][square.col + 1]
          : null;
      square.dir.bottomLeft =
        rows[square.row + 1] && cols[square.col - 1]
          ? rows[square.row + 1][square.col - 1]
          : null;
      square.dir.bottomRight =
        rows[square.row + 1] && cols[square.col + 1]
          ? rows[square.row + 1][square.col + 1]
          : null;
      square.dir.top = rows[square.row - 1]
        ? rows[square.row - 1][square.col]
        : null;
      square.dir.bottom = rows[square.row + 1]
        ? rows[square.row + 1][square.col]
        : null;
      square.dir.left =
        rows[square.row] && cols[square.col - 1]
          ? rows[square.row][square.col - 1]
          : null;
      square.dir.right =
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

  handleTurn = (index) => {
    const { squares } = this.state;
    let player = this.state.player;
    //an array of indexes/squares to be changed upon successful recursion/placement
    let ogLocation = [index];
    let tempPlacement = [];

    // console.log("index: ", index);
    for (let [key, value] of Object.entries(squares[index].dir)) {
      let counter = 0;
      // console.log("dir: ", key);
      if (this.validateMove(index, value, key, counter, tempPlacement)) {
        //add indicies to array to be placed
        ogLocation = ogLocation.concat(tempPlacement);
        this.setState({ validMove: true });
      }
      tempPlacement = [];
    }
    // console.log(ogLocation);
    // console.log(tempPlacement);
    // console.log("locations to be placed:", ogLocation);
    //this places the piece on the board
    if (ogLocation.length > 1) {
      for (let i = 0; i < ogLocation.length; i++) {
        let piece = {
          location: ogLocation[i],
          color: player,
        };
        if (squares[ogLocation[i]].piece) {
          Object.assign(squares[ogLocation[i]].piece, piece);
        } else {
          squares[ogLocation[i]].piece = piece;
        }

        // console.log(`placed ${player} on ${ogLocation[i]}`);
      }
      this.switchPlayer();
    }
  };

  switchPlayer() {
    let { player } = this.state;
    player = player === "White" ? "Black" : "White";
    this.setState({ player: player, validMove: false });
    this.tallyScore();
  }

  validateMove(index, value, key, counter, tempPlacement) {
    let { squares } = this.state;
    // console.log("counter: ", counter);
    // console.log("value: ", value);
    let player = this.state.player;
    //value === dir children, it is one of the directions to move, object
    if (value === null || counter > 10) {
      return false;
    } else if (!value.piece) {
      // console.log("nope");
      return false;
    }
    //base case
    else if (value.piece.color === player && counter !== 0) {
      // console.log(`success`);
      return true;
    }
    //case: next token is opponent, keep going in the dir
    else if (value.piece !== null && value.piece.color !== player) {
      // console.log("nice, onto the next!");
      tempPlacement.push(value.index);
      // console.log("current temp:", tempPlacement);
      return this.validateMove(
        value.index,
        squares[value.index].dir[key],
        key,
        ++counter,
        tempPlacement
      );
    }
    //immediate next token is players
    else if (value.piece.color === player && counter === 0) {
      // console.log("players color was here");
      return;
    }
  }

  tallyScore = () => {
    let { squares } = this.state;
    let blackScore = 0;
    let whiteScore = 0;
    let pieces = 0;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].piece !== null) {
        if (squares[i].piece.color === "White") {
          whiteScore++;
        } else if (squares[i].piece.color === "Black") {
          blackScore++;
        }
        pieces++;
      }
    }
    this.setState({
      score: {
        black: blackScore,
        white: whiteScore,
      },
    });
    if (pieces === squares.length) {
      this.endGame();
    }
  };

  endGame = () => {
    this.setState({ endGame: true });
  };

  handleNewGame = () => {
    window.location.reload();
  };

  render() {
    let { player, score, endGame } = this.state;
    let squares = this.state.squares.map((square, index) => {
      return (
        <Square
          key={index}
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
        {endGame && (
          <div className="end-screen">
            <div className="notice">
              <h3>
                {score.black > score.white ? "Black" : "White"} is the Winner!
              </h3>
              <button onClick={this.handleNewGame}>Play Again?</button>
            </div>
          </div>
        )}
        <div className="player-info">
          <h2>Current Player: {player}</h2>
          <p>
            Black:{score.black} | White:{score.white}
          </p>
        </div>

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
