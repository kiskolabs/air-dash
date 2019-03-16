import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";

import NetatmoClient from "../lib/NetatmoClient.js";

class HealthIndexIcon extends Component {
  constructor(props) {
    super(props);
    this.netatmoClient = new NetatmoClient();
  }

  get color() {
    return this.netatmoClient.healthIndexToColor(this.props.healthIndex);
  }

  get icon() {
    return faHeartbeat;
  }

  render() {
    return <FontAwesomeIcon fixedWidth size="lg" icon={this.icon} />;
  }
}

export default HealthIndexIcon;
