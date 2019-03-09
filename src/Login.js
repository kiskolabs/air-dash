import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { ulid } from "ulid";

import SecurityContext from "./SecurityContext.js";

class Login extends Component {
  static contextType = SecurityContext;

  constructor(props) {
    super(props);

    this.state = {
      oauthParams: {
        client_id: process.env.REACT_APP_NETATMO_CLIENT_ID,
        redirect_uri: `${window.location.origin}/code-received/`,
        scope: "read_homecoach",
        state: ulid(),
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

  render() {
    if (this.context.isAuthenticated()) {
      return <Redirect to="/" />;
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
