import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTemperatureHigh,
  faTemperatureLow,
  faThermometerHalf,
  faThermometerThreeQuarters,
  faThermometerQuarter,
  faThermometerFull,
} from "@fortawesome/free-solid-svg-icons";

import NetatmoClient from "../lib/NetatmoClient.js";

class TemperatureIcon extends Component {
  constructor(props) {
    super(props);
    this.netatmoClient = new NetatmoClient();
  }

  get color() {
    return this.netatmoClient.temperatureToColor(this.props.temperature);
  }

  get icon() {
    const { temperature } = this.props;

    switch (this.color) {
      case "red":
        return temperature < 18 ? faTemperatureLow : faTemperatureHigh;
      case "orange":
        return temperature < 18 ? faThermometerQuarter : faThermometerFull;
      case "yellow":
        return temperature < 18 ? faThermometerQuarter : faThermometerThreeQuarters;
      default:
        return faThermometerHalf;
    }
  }

  render() {
    return <FontAwesomeIcon fixedWidth size="lg" icon={this.icon} />;
  }
}

export default TemperatureIcon;
