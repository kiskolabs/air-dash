import React, { Component } from "react";
import axios from "axios";

import Device from "../components/Device.js";
import Loader from "../components/Loader.js";
import Screensaver from "../components/Screensaver.js";
import ErrorBar from "../components/ErrorBar.js";
import ErrorComponent from "../components/ErrorComponent.js";
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
    this.fetchDeployStatus = this.fetchDeployStatus.bind(this);
  }

  async fetchData() {
    console.log("Fetching dashboard data");
    await this.setState({ loading: true });

    try {
      const data = await this.netatmoClient.getAirQualityData();

      this.setState({
        error: null,
        loading: false,
        data: data,
      });
    } catch (err) {
      this.setState({
        error: err,
        loading: false,
      });
    }
  }

  async fetchDeployStatus() {
    console.log("Fetching deploy status");

    try {
      const response = await axios.get("/deploy.json");
      let { data } = response;

      console.log("Deploy", data);

      const revisonWas = this.context.deployRevision;
      const revisionChanged = revisonWas !== data.revision;
      const needsRefresh = revisonWas && revisionChanged;

      if (revisionChanged) {
        await this.setState(
          {
            deployRevision: data.revision,
            deployDate: new Date(data.date),
          },
          () => {
            const { deployRevision, deployDate } = this.state;
            this.context.updateContext({
              deployRevision,
              deployDate,
            });

            if (needsRefresh) {
              console.info("Reloading page to get the latest frontend");
              window.setTimeout(this.context.forceReloadPage, 1000);
            }
          }
        );
      }
    } catch (err) {
      console.error(err);
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

    // Check for a new deployment
    this.deployInterval = setInterval(() => {
      this.fetchDeployStatus();
    }, 60 * 1000);
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
      const healths = data.devices.map(
        device => device.dashboard_data && device.dashboard_data.health_idx
      );
      const max = Math.max(...healths);
      max >= 2 ? this.updateFavicon(HeartBrokenIcon) : this.updateFavicon(HeartIcon);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.screensaverInterval);
    clearInterval(this.deployInterval);

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

    if (loading && !data) {
      return <Loader />;
    } else if (error && !data) {
      return <ErrorComponent error={error} />;
    } else {
      const devices = data ? data.devices : [];
      return (
        <>
          <div className="grid-container">
            {devices.map(device => (
              <Device key={device._id} data={device} />
            ))}
          </div>
          {error && <ErrorBar error={error} />}
          {this.context.screensaver && <Screensaver />}
        </>
      );
    }
  }
}

export default Dashboard;
