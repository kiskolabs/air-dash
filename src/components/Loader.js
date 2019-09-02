import React, { Component } from "react";
import { PulseLoader } from "react-spinners";

class Loader extends Component {
  render() {
    return <PulseLoader {...this.props} />;
  }
}

export default Loader;
