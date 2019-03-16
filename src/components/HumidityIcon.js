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

  render() {
    return <FontAwesomeIcon fixedWidth size="lg" icon={this.icon} />;
  }
}

export default HumidityIcon;
