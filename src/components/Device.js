import React, { Component } from "react";
import { differenceInSeconds, subHours } from "date-fns";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import Chart from "./Chart.js";
import HealthIndex from "./HealthIndex.js";

import NetatmoClient from "../lib/NetatmoClient.js";
import SecurityContext from "../lib/SecurityContext.js";

import "./Device.css";

class Device extends Component {
  static contextType = SecurityContext;

  constructor(props) {
    super(props);

    this.state = {
      error: false,
      loading: false,
      timeSeriesData: null,
    };

    this.netatmoClient = new NetatmoClient();
    this.fetchTimeSeriesData = this.fetchTimeSeriesData.bind(this);
    this.timeSeriesDataFor = this.timeSeriesDataFor.bind(this);
    this.timeSeriesDataAtIndex = this.timeSeriesDataAtIndex.bind(this);
  }

  async fetchTimeSeriesData() {
    await this.setState({ loading: true });

    try {
      const tokens = await this.context.fetchTokens();
      const now = new Date();
      const data = await this.netatmoClient.getMeasurements(tokens, {
        deviceId: this.props.data._id,
        dateBegin: Math.round(subHours(now, 1).getTime() / 1000),
        dateEnd: Math.round(now.getTime() / 1000),
      });

      this.setState({
        error: null,
        loading: false,
        timeSeriesData: data,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        error: err.message,
        loading: false,
      });
    }
  }

  async componentDidMount() {
    await this.fetchTimeSeriesData();
  }

  timeSeriesDataAtIndex(index) {
    const { timeSeriesData } = this.state;

    if (!timeSeriesData) {
      return [];
    }

    return Object.keys(timeSeriesData.body).map(key => ({
      date: new Date(parseInt(key, 10) * 1000),
      value: timeSeriesData.body[key][index],
    }));
  }

  timeSeriesDataFor(type) {
    switch (type) {
      case "co2":
        return this.timeSeriesDataAtIndex(0);
      case "humidity":
        return this.timeSeriesDataAtIndex(1);
      case "noise":
        return this.timeSeriesDataAtIndex(2);
      case "temperature":
        return this.timeSeriesDataAtIndex(3);
      default:
        return [];
    }
  }

  render() {
    const {
      data: { station_name, dashboard_data, last_status_store },
    } = this.props;

    const seconds = differenceInSeconds(new Date(), last_status_store);

    return (
      <div className="Device">
        <header>
          <div>
            <h1>{station_name}</h1>
          </div>
          <div>
            <CircularProgressbar minValue={0} maxValue={10 * 60} value={seconds} />
          </div>
        </header>

        <Chart
          data={this.timeSeriesDataFor("temperature")}
          width={400}
          height={150}
          margin={{ left: 10, top: 10, right: 10, bottom: 10 }}
          colorFn={this.netatmoClient.temperatureToColor}
          domain={[15, dataMax => Math.max(dataMax, 30)]}
          labelText="Temperature"
          latestValue={dashboard_data.Temperature}
          valueSuffix="°C"
          icon
        />

        <Chart
          data={this.timeSeriesDataFor("humidity")}
          width={400}
          height={150}
          margin={{ left: 10, top: 10, right: 10, bottom: 10 }}
          colorFn={this.netatmoClient.humidityToColor}
          domain={[15, 100]}
          labelText="Humidity"
          latestValue={dashboard_data.Humidity}
          valueSuffix="%"
        />

        <Chart
          data={this.timeSeriesDataFor("co2")}
          width={400}
          height={150}
          margin={{ left: 10, top: 10, right: 10, bottom: 10 }}
          colorFn={this.netatmoClient.co2ToColor}
          domain={[200, dataMax => Math.max(dataMax, 1000)]}
          labelText="CO₂"
          latestValue={dashboard_data.CO2}
          valueSuffix=" ppm"
        />

        <Chart
          data={this.timeSeriesDataFor("noise")}
          width={400}
          height={150}
          margin={{ left: 10, top: 10, right: 10, bottom: 10 }}
          colorFn={this.netatmoClient.noiseToColor}
          domain={[10, dataMax => Math.max(dataMax, 80)]}
          labelText="Noise"
          latestValue={dashboard_data.Noise}
          valueSuffix=" dB"
        />

        <HealthIndex
          value={dashboard_data.health_idx}
          label={this.netatmoClient.healthIndexToWords(dashboard_data.health_idx)}
          color={this.netatmoClient.healthIndexToColor(dashboard_data.health_idx)}
        />
      </div>
    );
  }
}

Device.defaultProps = {
  data: {},
};

export default Device;
