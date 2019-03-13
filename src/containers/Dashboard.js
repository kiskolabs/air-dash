import React, { Component } from "react";

import Device from "../components/Device.js";
import SecurityContext from "../lib/SecurityContext.js";
import NetatmoClient from "../lib/NetatmoClient.js";

class Dashboard extends Component {
  static contextType = SecurityContext;

  constructor(props) {
    super(props);

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
      const client = new NetatmoClient(accessToken);

      const data = await client.getAirQualityData();

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
    }, 30 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { error, loading, data } = this.state;

    if (data) {
      return (
        <div>
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
