import React, { Component } from "react";
import "./Square.css";
import Piece from "../Piece/Piece";

class Square extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPiece: false,
      crd: [this.props.index.row, this.props.index.col],
    };
  }

  handleClick = () => {
    let { index, handleTurn } = this.props;
    console.log("index: ", index);
    this.setState({ showPiece: true });
    handleTurn();
  };
  //player is the color that changes the piece depending on turn
  render() {
    let { index, piece } = this.props;
    let { showPiece } = this.state;
    return (
      <div
        className="square"
        key={index.index}
        // id={index.index}
        onClick={this.handleClick}
      >
        <div className="square-meta">
          {piece && <Piece color={piece.color} />}
        </div>
      </div>
    );
  }
}

export default Square;
