import React, { Component } from "react";

import Device from "../components/Device.js";
import Loader from "../components/Loader.js";
import Screensaver from "../components/Screensaver.js";
import SecurityContext from "../lib/SecurityContext.js";
import NetatmoClient from "../lib/NetatmoClient.js";

import HeartIcon from "../images/heart.png";
import HeartBrokenIcon from "../images/heart-broken.png";

import "./Dashboard.css";

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
    console.log("Fetching dashboard data");
    await this.setState({ loading: true });

    try {
      const tokens = await this.context.fetchTokens();
      const data = await this.netatmoClient.getAirQualityData(tokens);

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

    document.addEventListener("mousemove", this.hideIdleCursor);
  }

  updateFavicon(image) {
    var link = document.querySelector("link[rel*='icon']") || document.createElement("link");
    link.type = "image/png";
    link.rel = "icon";
    link.href = image;
    document.getElementsByTagName("head")[0].appendChild(link);
  }

  componentDidUpdate() {
    const { data } = this.state;
    if (data) {
      const healths = data.body.devices.map(device => device.dashboard_data.health_idx);
      const max = Math.max(...healths);
      max >= 2 ? this.updateFavicon(HeartBrokenIcon) : this.updateFavicon(HeartIcon);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.screensaverInterval);

    this.clearIdleCursor();
  }

  clearIdleCursor() {
    document.removeEventListener("mousemove", this.hideIdleCursor);
    if (this.idleTimeOut) {
      clearTimeout(this.idleTimeOut);
    }
    let style = document.querySelector("#idleCursorStyles");
    if (style) {
      style.remove();
    }
  }

  hideIdleCursor() {
    if (this.idleTimeOut) {
      clearTimeout(this.idleTimeOut);
    }

    const css = "* { cursor: none }";
    let style = document.querySelector("#idleCursorStyles");

    if (!style) {
      style = document.createElement("style");
      style.id = "idleCursorStyles";
      style.appendChild(document.createTextNode(css));
    }

    this.idleTimeOut = setTimeout(() => {
      if (!this.cursorIsHidden) {
        document.head.appendChild(style);
        this.cursorIsHidden = true;
      }
    }, 5000);

    if (this.cursorIsHidden) {
      style.remove();
      this.cursorIsHidden = false;
    }
  }

  render() {
    const { error, loading, data } = this.state;

    if (this.context.screensaver) {
      return <Screensaver />;
    }

    if (data) {
      return (
        <div className="grid-container">
          {data.body.devices.map(device => (
            <Device key={device._id} data={device} />
          ))}
        </div>
      );
    } else if (loading) {
      return <Loader />;
    } else if (error) {
      return <div>Error! {error}</div>;
    } else {
      return <div>Dashboard</div>;
    }
  }
}

export default Dashboard;
