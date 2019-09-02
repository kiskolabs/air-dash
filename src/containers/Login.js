import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import Loader from "../components/Loader.js";
import SecurityContext from "../lib/SecurityContext.js";

function toHexString(byteArray) {
  return Array.prototype.map
    .call(byteArray, function(byte) {
      return ("0" + (byte & 0xff).toString(16)).slice(-2);
    })
    .join("");
}

function getRandomString(bits) {
  let array = new Uint8Array(bits);
  window.crypto.getRandomValues(array);
  return toHexString(array);
}

class Login extends Component {
  static contextType = SecurityContext;

  constructor(props) {
    super(props);

    this.state = {
      oauthParams: {
        client_id: process.env.REACT_APP_NETATMO_CLIENT_ID,
        redirect_uri: `${window.location.origin}/code-received/`,
        scope: "read_homecoach",
        state: getRandomString(16),
      },
    };
  }

  get oauthURL() {
    const {
      oauthParams: { client_id, redirect_uri, scope, state },
    } = this.state;
    let params = new URLSearchParams();

    params.append("client_id", client_id);
    params.append("redirect_uri", redirect_uri);
    params.append("scope", scope);
    params.append("state", state);

    return `https://api.netatmo.com/oauth2/authorize?${params}`;
  }

  componentDidMount() {
    if (this.context.netatmoPasswordAuth) {
      this.timeout = setTimeout(() => {
        this.setState({ autologin: true });
      }, 5000);
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  render() {
    if (this.context.isAuthenticated()) {
      return <Redirect to="/" />;
    } else if (this.context.netatmoPasswordAuth) {
      if (this.state.autologin) {
        return <Redirect to="/autologin" />;
      } else {
        return <Loader />;
      }
    } else {
      return (
        <form action={this.oauthURL} method="POST">
          <button type="submit">Log in to Netatmo</button>
        </form>
      );
    }
  }
}

export default Login;
