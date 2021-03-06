import React, { Component } from "react";
import { differenceInSeconds, isSameMinute } from "date-fns";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
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
    console.log("Fetching device data for", this.props.data.station_name);
    await this.setState({ loading: true });

    try {
      const data = await this.netatmoClient.getMeasurements({
        deviceId: this.props.data._id,
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

    // Wait between 30 and 60 seconds before updating the data
    const milliseconds = Math.floor(Math.random() * (30 * 1000)) + 30 * 1000;
    console.log(
      this.props.data.station_name,
      "timeseries data will be updated every",
      (milliseconds / 1000).toFixed(1),
      "seconds"
    );
    this.interval = setInterval(() => {
      this.fetchTimeSeriesData();
    }, milliseconds);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  timeSeriesDataAtIndex(index) {
    const { timeSeriesData } = this.state;

    if (!timeSeriesData) {
      return [];
    }

    let data = Object.keys(timeSeriesData).map(key => ({
      date: new Date(parseInt(key, 10) * 1000),
      value: timeSeriesData[key][index],
    }));

    return data.filter((obj) => obj.value);
  }

  timeSeriesDataFor(type) {
    switch (type) {
      case "co2":
        return this.addLatestValueToSeries(this.timeSeriesDataAtIndex(0), "CO2");
      case "humidity":
        return this.addLatestValueToSeries(this.timeSeriesDataAtIndex(1), "Humidity");
      case "noise":
        return this.addLatestValueToSeries(this.timeSeriesDataAtIndex(2), "Noise");
      case "temperature":
        return this.addLatestValueToSeries(this.timeSeriesDataAtIndex(3), "Temperature");
      default:
        return [];
    }
  }

  addLatestValueToSeries(series, type) {
    const {
      data: { dashboard_data },
    } = this.props;

    if (dashboard_data) {
      const last = series[series.length - 1];
      if (last && !isSameMinute(last.date, dashboard_data.time_utc)) {
        series.push({ date: dashboard_data.time_utc, value: dashboard_data[type] });
      }
    }

    return series;
  }

  render() {
    const {
      data: { station_name, dashboard_data, last_status_store },
    } = this.props;
    const { error } = this.state;

    const seconds = differenceInSeconds(new Date(), last_status_store);

    return (
      <div className="Device">
        <header>
          <div>
            <h1>{station_name}</h1>
          </div>
          <div>
            {error ? (
              <FontAwesomeIcon
                title={error}
                fixedWidth
                icon={faExclamationTriangle}
                size="3x"
                color="#ffca66"
              />
            ) : (
              <CircularProgressbar
                minValue={0}
                maxValue={10 * 60}
                value={seconds}
                styles={buildStyles({ pathColor: "#AEB4CB", trailColor: "rgba(255,255,255,0.1)" })}
              />
            )}
          </div>
        </header>

        <Chart
          data={this.timeSeriesDataFor("temperature")}
          width={400}
          height={125}
          margin={{ left: 15, top: 15, right: 15, bottom: 15 }}
          colorFn={this.netatmoClient.temperatureToColor}
          domain={[dataMin => Math.min(dataMin, 20), dataMax => Math.max(dataMax, 30)]}
          labelText="Temperature"
          latestValue={dashboard_data && dashboard_data.Temperature}
          valueSuffix="°C"
          valuePrecision={1}
          icon
        />

        <Chart
          data={this.timeSeriesDataFor("humidity")}
          width={400}
          height={125}
          margin={{ left: 15, top: 15, right: 15, bottom: 15 }}
          colorFn={this.netatmoClient.humidityToColor}
          domain={[15, 100]}
          labelText="Humidity"
          borderRadius="100"
          latestValue={dashboard_data && dashboard_data.Humidity}
          valuePrecision={0}
          valueSuffix="%"
        />

        <Chart
          data={this.timeSeriesDataFor("co2")}
          width={400}
          height={125}
          margin={{ left: 15, top: 15, right: 15, bottom: 15 }}
          colorFn={this.netatmoClient.co2ToColor}
          domain={[300, dataMax => Math.max(dataMax, 1800)]}
          labelText="CO₂"
          latestValue={dashboard_data && dashboard_data.CO2}
          valuePrecision={0}
          valueSuffix=" ppm"
        />

        <Chart
          data={this.timeSeriesDataFor("noise")}
          width={400}
          height={125}
          margin={{ left: 15, top: 15, right: 15, bottom: 15 }}
          colorFn={this.netatmoClient.noiseToColor}
          domain={[20, dataMax => Math.max(dataMax, 80)]}
          labelText="Noise"
          latestValue={dashboard_data && dashboard_data.Noise}
          valuePrecision={0}
          valueSuffix=" dB"
        />

        {dashboard_data && (
          <HealthIndex
            value={dashboard_data.health_idx}
            label={this.netatmoClient.healthIndexToWords(dashboard_data.health_idx)}
            color={this.netatmoClient.healthIndexToColor(dashboard_data.health_idx)}
          />
        )}
      </div>
    );
  }
}

Device.defaultProps = {
  data: {},
};

export default Device;
