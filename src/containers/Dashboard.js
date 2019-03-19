import React, { Component } from "react";

import Device from "../components/Device.js";
import Screensaver from "../components/Screensaver.js";
import SecurityContext from "../lib/SecurityContext.js";
import NetatmoClient from "../lib/NetatmoClient.js";

class Dashboard extends Component {
  static contextType = SecurityContext;

  constructor(props) {
    super(props);

    this.netatmoClient = new NetatmoClient();

    this.state = {
      error: false,
      loading: false,
      data: null,
    };

    this.fetchData = this.fetchData.bind(this);
  }

  async fetchData() {
    await this.setState({ loading: true });

    try {
      const accessToken = await this.context.fetchAccessToken();
      const data = await this.netatmoClient.getAirQualityData(accessToken);

      this.setState({
        error: null,
        loading: false,
        data: data,
      });
    } catch (err) {
      this.setState({
        error: err.message,
        loading: false,
      });
    }
  }

  async componentDidMount() {
    await this.fetchData();

    this.interval = setInterval(() => {
      this.fetchData();
    }, 60 * 1000);

    // Launch the screensaver once an hour
    this.screensaverInterval = setInterval(() => {
      this.context.updateContext({ screensaver: true });
    }, 60 * 60 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.screensaverInterval);
  }

  render() {
    const { error, loading, data } = this.state;

    if (this.context.screensaver) {
      return <Screensaver />;
    }

    if (data) {
      return (
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          {data.body.devices.map(device => (
            <Device key={device._id} data={device} />
          ))}
        </div>
      );
    } else if (loading) {
      return <div>Loading</div>;
    } else if (error) {
      return <div>Error! {error}</div>;
    } else {
      return <div>Dashboard</div>;
    }
  }
}

export default Dashboard;
