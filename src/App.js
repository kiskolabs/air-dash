import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";

import Dashboard from "./Dashboard.js";
import Login from "./Login.js";
import CodeReceived from "./CodeReceived.js";
import SecurityContext from "./SecurityContext.js";
import PrivateRoute from "./PrivateRoute.js";
import NoMatch from "./NoMatch.js";

const AUTH_KEYS = ["accessToken", "refreshToken", "expiresIn", "expiresAt"];

class App extends Component {
  constructor(props) {
    super(props);

    this.refreshAccessToken = this.refreshAccessToken = this.refreshAccessToken.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.updateContext = this.updateContext.bind(this);
    this.fetchAccessToken = this.fetchAccessToken.bind(this);
    this.logOut = this.logOut.bind(this);

    let state = {
      isAuthenticated: this.isAuthenticated,
      updateContext: this.updateContext,
      fetchAccessToken: this.fetchAccessToken,
      logOut: this.logOut,
    };

    for (let key of AUTH_KEYS) {
      const value = localStorage.getItem(`air-dash.${key}`);
      if (value) {
        if (key === "expiresAt") {
          state[key] = Date.parse(value);
        } else {
          state[key] = value;
        }
      }
    }

    this.state = state;
  }

  static contextType = SecurityContext;

  isAuthenticated() {
    return !!this.state.accessToken;
  }

  async fetchAccessToken() {
    const now = new Date();
    if (this.state.accessToken && now < this.state.expiresAt) {
      console.log("Access token still valid");
      return this.state.accessToken;
    } else if (this.state.refreshToken) {
      console.log("Refreshing access token");
      await this.refreshAccessToken();
      return await this.fetchAccessToken();
    }
  }

  async refreshAccessToken() {
    try {
      const response = await axios.get("/.netlify/functions/refreshAccessToken", {
        params: {
          refresh_token: this.state.refreshToken,
        },
      });

      if (response.data) {
        const { data } = response;

        const { expires_in } = data;
        const expiresAt = new Date(+new Date() + expires_in * 1000);

        await this.updateContext({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresIn: expires_in,
          expiresAt: expiresAt,
        });
      } else {
        console.error("No data received");
        this.logOut();
      }
    } catch (error) {
      console.error(error);
      this.logOut();
    }
  }

  async updateContext(newContext) {
    for (const key in newContext) {
      if (newContext.hasOwnProperty(key)) {
        localStorage.setItem(`air-dash.${key}`, newContext[key]);
      }
    }

    await this.setState(newContext);
  }

  logOut() {
    let newState = {};
    for (let key of AUTH_KEYS) {
      newState[key] = null;
    }
    this.setState(newState, () => localStorage.clear());
  }

  render() {
    return (
      <SecurityContext.Provider value={this.state}>
        <Router>
          <div>
            {this.isAuthenticated() && <button onClick={this.logOut}>Log out</button>}
            <Switch>
              <PrivateRoute path="/" exact component={Dashboard} />
              <Route path="/login" exact component={Login} />
              <Route path="/code-received/" component={CodeReceived} />
              <Route component={NoMatch} />
            </Switch>
          </div>
        </Router>
      </SecurityContext.Provider>
    );
  }
}

export default App;
