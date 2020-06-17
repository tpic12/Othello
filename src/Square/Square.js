import React, { Component } from "react";
import "./Square.css";
import Piece from "../Piece/Piece";

class Square extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crd: [this.props.index.row, this.props.index.col],
    };
  }

  handleClick = () => {
    let { index, handleTurn } = this.props;

    handleTurn(index);
  };

  render() {
    let { index, piece } = this.props;
    let hasPiece = piece ? "square" : "square empty";

    return (
      <div
        className={hasPiece}
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
