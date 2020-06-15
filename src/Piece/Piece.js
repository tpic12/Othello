import React, { Component } from "react";
import "./Piece.css";

class Piece extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: this.props.color,
    };
  }
  render() {
    return <div className="piece" id={this.state.color}></div>;
  }
}

export default Piece;
