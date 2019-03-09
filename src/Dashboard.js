import React, { Component } from "react";
import axios from "axios";

import SecurityContext from "./SecurityContext.js";

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
    await this.setState({ loading: true, error: null });

    const response = await axios.get("https://api.netatmo.com/api/gethomecoachsdata", {
      params: { access_token: this.context.accessToken },
    });

    const { data } = response;

    if (data.error) {
      this.setState({
        error: data.error,
        loading: false,
      });
    } else {
      this.setState({
        error: null,
        loading: false,
        data: data.body,
      });
    }
  }

  async componentDidMount() {
    await this.fetchData();
  }

  render() {
    const { error, loading, data } = this.state;

    if (data) {
      return (
        <div>
          <pre>{JSON.stringify(data, undefined, 2)}</pre>
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
