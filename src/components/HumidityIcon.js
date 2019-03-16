import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTint } from "@fortawesome/free-solid-svg-icons";

import NetatmoClient from "../lib/NetatmoClient.js";

class HumidityIcon extends Component {
  constructor(props) {
    super(props);
    this.netatmoClient = new NetatmoClient();
  }

  get color() {
    return this.netatmoClient.humidityToColor(this.props.humidity);
  }

  get icon() {
    return faTint;
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

export default HumidityIcon;
