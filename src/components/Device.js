import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faHeartbeat,
  faLeaf,
  faThermometerQuarter,
  faTint,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { faClock, faHeart as faEmptyHeart } from "@fortawesome/free-regular-svg-icons";
import { distanceInWords, subHours } from "date-fns";
import { LineChart, Line } from "recharts";

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
      const accessToken = await this.context.fetchAccessToken();
      const now = new Date();
      const data = await this.netatmoClient.getMeasurements(accessToken, {
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

    return (
      <div>
        <h1>{station_name}</h1>
        <dl>
          <dt>
            <FontAwesomeIcon fixedWidth size="lg" icon={faThermometerQuarter} /> Temperature
          </dt>
          <dd className={this.netatmoClient.temperatureToColor(dashboard_data.Temperature)}>
            {dashboard_data.Temperature}°C
            {this.timeSeriesDataFor("temperature") && (
              <LineChart width={300} height={100} data={this.timeSeriesDataFor("temperature")}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            )}
          </dd>

          <dt>
            <FontAwesomeIcon fixedWidth size="lg" icon={faTint} /> Humidity
          </dt>
          <dd className={this.netatmoClient.humidityToColor(dashboard_data.Humidity)}>
            {dashboard_data.Humidity}%
            {this.timeSeriesDataFor("humidity") && (
              <LineChart width={300} height={100} data={this.timeSeriesDataFor("humidity")}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            )}
          </dd>

          <dt>
            <FontAwesomeIcon fixedWidth size="lg" icon={faLeaf} /> CO₂
          </dt>
          <dd className={this.netatmoClient.co2ToColor(dashboard_data.CO2)}>
            {dashboard_data.CO2} ppm
            {this.timeSeriesDataFor("co2") && (
              <LineChart width={300} height={100} data={this.timeSeriesDataFor("co2")}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            )}
          </dd>

          <dt>
            <FontAwesomeIcon fixedWidth size="lg" icon={faVolumeUp} /> Noise
          </dt>
          <dd className={this.netatmoClient.noiseToColor(dashboard_data.Noise)}>
            {dashboard_data.Noise} dB
            {this.timeSeriesDataFor("noise") && (
              <LineChart width={300} height={100} data={this.timeSeriesDataFor("noise")}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            )}
          </dd>

          <dt>
            <FontAwesomeIcon fixedWidth size="lg" icon={faHeartbeat} /> Health Index
          </dt>
          <dd className={this.netatmoClient.healthIndexToColor(dashboard_data.health_idx)}>
            {this.renderHealthIndex(dashboard_data.health_idx)}{" "}
            {this.netatmoClient.healthIndexToWords(dashboard_data.health_idx)}
          </dd>

          <dt>
            <FontAwesomeIcon fixedWidth size="lg" icon={faClock} /> Last update
          </dt>
          <dd>{distanceInWords(new Date(), last_status_store, { addSuffix: true })}</dd>
        </dl>
      </div>
    );
  }
}

Device.defaultProps = {
  data: {},
};

export default Device;
