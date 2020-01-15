import React, { Component } from "react";

import "./ErrorComponent.css";

class ErrorComponent extends Component {
  state = {
    reloadCountdown: 60,
  };

  componentDidMount() {
    this.intervalID = setInterval(() => {
      if (this.state.reloadCountdown === 1) {
        window.location.reload();
      } else {
        this.setState((state, props) => ({
          reloadCountdown: state.reloadCountdown - 1,
        }));
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  render() {
    const {
      error: { message, stack },
    } = this.props;
    const { reloadCountdown } = this.state;

    return (
      <div className="ErrorComponent">
        <div className="Error">
          <h1>An Error Occurred</h1>
          <details>
            <summary>{message}</summary>
            <pre>{stack}</pre>
          </details>
          <p>
            Reloading the page in <span>{reloadCountdown}</span>{" "}
            {reloadCountdown === 1 ? "second" : "seconds"}
          </p>
        </div>
      </div>
    );
  }
}

export default ErrorComponent;
