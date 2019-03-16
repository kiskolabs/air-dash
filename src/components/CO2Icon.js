import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";

import NetatmoClient from "../lib/NetatmoClient.js";

class CO2Icon extends Component {
  constructor(props) {
    super(props);
    this.netatmoClient = new NetatmoClient();
  }

  get color() {
    return this.netatmoClient.co2ToColor(this.props.co2);
  }

  get icon() {
    return faLeaf;
  }

  get counter() {
    switch (this.color) {
      case "red":
        return <span className="fa-layers-counter" style={{ background: "red" }} />;
      case "orange":
        return <span className="fa-layers-counter" style={{ background: "orange" }} />;
      case "yellow":
        return <span className="fa-layers-counter" style={{ background: "yellow" }} />;
      default:
        return null;
    }
  }

  render() {
    return (
      <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={this.icon} />
        {this.counter}
      </span>
    );
  }
}

export default CO2Icon;
