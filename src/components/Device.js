import React, { Component } from "react";

class Device extends Component {
  render() {
    const {
      data: { station_name, dashboard_data },
    } = this.props;

    return (
      <div>
        <h1>{station_name}</h1>
        <pre>{JSON.stringify(dashboard_data, undefined, 2)}</pre>
      </div>
    );
  }
}

Device.defaultProps = {
  data: {},
};

export default Device;
