import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp, faVolumeDown } from "@fortawesome/free-solid-svg-icons";

import NetatmoClient from "../lib/NetatmoClient.js";

class NoiseIcon extends Component {
  constructor(props) {
    super(props);
    this.netatmoClient = new NetatmoClient();
  }

  get color() {
    return this.netatmoClient.noiseToColor(this.props.noise);
  }

  get icon() {
    switch (this.color) {
      case "red":
      case "orange":
      case "yellow":
        return faVolumeUp;
      default:
        return faVolumeDown;
    }
  }

  render() {
    return <FontAwesomeIcon fixedWidth size="lg" icon={this.icon} />;
  }
}

export default NoiseIcon;
