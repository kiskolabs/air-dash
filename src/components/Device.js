import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faEmptyHeart } from "@fortawesome/free-regular-svg-icons";
import { differenceInSeconds, subHours } from "date-fns";
import { ResponsiveContainer, LineChart, Line, YAxis } from "recharts";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import CO2Icon from "./CO2Icon.js";
import HealthIndexIcon from "./HealthIndexIcon.js";
import HumidityIcon from "./HumidityIcon.js";
import NoiseIcon from "./NoiseIcon.js";
import TemperatureIcon from "./TemperatureIcon.js";

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

  renderHealthIndex(index) {
    const emptyStars = index;
    const fullStars = 5 - emptyStars;

    let stars = [];

    for (let i = 1; i <= fullStars; i++) {
      stars.push(<FontAwesomeIcon fixedWidth key={`star-${i}`} icon={faHeart} />);
    }

    for (let i = 1; i <= emptyStars; i++) {
      stars.push(<FontAwesomeIcon fixedWidth key={`empty-${i}`} icon={faEmptyHeart} />);
    }

    return stars;
  }

  timeSeriesDataAtIndex(index) {
    const { timeSeriesData } = this.state;

    if (!timeSeriesData) {
      return [];
    }

    return Object.keys(timeSeriesData.body).map(key => ({
      date: key,
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
      <div>
        <h1>
          {station_name}
          &nbsp;
          <div style={{ width: "1em", height: "1em", display: "inline-block" }}>
            <CircularProgressbar minValue={0} maxValue={10 * 60} value={seconds} />
          </div>
        </h1>
        <dl>
          <dt>
            <TemperatureIcon temperature={dashboard_data.Temperature} /> Temperature
          </dt>
          <dd className={this.netatmoClient.temperatureToColor(dashboard_data.Temperature)}>
            {dashboard_data.Temperature}
            °C
            {this.timeSeriesDataFor("temperature") && (
              <ResponsiveContainer width="100%" aspect={4}>
                <LineChart data={this.timeSeriesDataFor("temperature")}>
                  <YAxis
                    type="number"
                    hide={true}
                    domain={[15, dataMax => Math.max(dataMax, 30)]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </dd>

          <dt>
            <HumidityIcon humidity={dashboard_data.Humidity} /> Humidity
          </dt>
          <dd className={this.netatmoClient.humidityToColor(dashboard_data.Humidity)}>
            {dashboard_data.Humidity}%
            {this.timeSeriesDataFor("humidity") && (
              <ResponsiveContainer width="100%" aspect={4}>
                <LineChart data={this.timeSeriesDataFor("humidity")}>
                  <YAxis type="number" hide={true} domain={[0, 100]} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </dd>

          <dt>
            <CO2Icon co2={dashboard_data.CO2} /> CO₂
          </dt>
          <dd className={this.netatmoClient.co2ToColor(dashboard_data.CO2)}>
            {dashboard_data.CO2} ppm
            {this.timeSeriesDataFor("co2") && (
              <ResponsiveContainer width="100%" aspect={4}>
                <LineChart data={this.timeSeriesDataFor("co2")}>
                  <YAxis
                    type="number"
                    hide={true}
                    domain={[200, dataMax => Math.max(dataMax, 800)]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </dd>

          <dt>
            <NoiseIcon noise={dashboard_data.Noise} /> Noise
          </dt>
          <dd className={this.netatmoClient.noiseToColor(dashboard_data.Noise)}>
            {dashboard_data.Noise} dB
            {this.timeSeriesDataFor("noise") && (
              <ResponsiveContainer width="100%" aspect={4}>
                <LineChart data={this.timeSeriesDataFor("noise")}>
                  <YAxis
                    type="number"
                    hide={true}
                    domain={[10, dataMax => Math.max(dataMax, 80)]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </dd>

          <dt>
            <HealthIndexIcon healthIndex={dashboard_data.health_idx} /> Health Index
          </dt>
          <dd className={this.netatmoClient.healthIndexToColor(dashboard_data.health_idx)}>
            {this.renderHealthIndex(dashboard_data.health_idx)}{" "}
            {this.netatmoClient.healthIndexToWords(dashboard_data.health_idx)}
          </dd>
        </dl>
      </div>
    );
  }
}

Device.defaultProps = {
  data: {},
};

export default Device;
