import React, { Component } from "react";

import "./ErrorBar.css";

class ErrorBar extends Component {
  render() {
    const {
      error: { message },
    } = this.props;

    return (
      <div className="ErrorBar">
        <div className="Error">
          <strong>Error:</strong> <span>{message}</span>
        </div>
      </div>
    );
  }
}

export default ErrorBar;
