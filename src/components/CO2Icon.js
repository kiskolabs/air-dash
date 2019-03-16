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
    return this.netatmoClient.humidityToColor(this.props.co2);
  }

  get icon() {
    return faLeaf;
  }

  render() {
    return <FontAwesomeIcon fixedWidth size="lg" icon={this.icon} />;
  }
}

export default CO2Icon;
