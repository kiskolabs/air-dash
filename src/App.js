import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";
import { Store, set, keys, get, clear } from "idb-keyval";

import Dashboard from "./containers/Dashboard.js";
import Login from "./containers/Login.js";
import AutoLogin from "./containers/AutoLogin.js";
import CodeReceived from "./containers/CodeReceived.js";
import NoMatch from "./containers/NoMatch.js";

import PrivateRoute from "./components/PrivateRoute.js";

import SecurityContext from "./lib/SecurityContext.js";

class App extends Component {
  constructor(props) {
    super(props);

    this.customStore = new Store("air-dash", "app-state");
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
      netatmoPasswordAuth: !!process.env.REACT_APP_NETATMO_PASSWORD_AUTH,
    };

    this.state = state;
  }

  static contextType = SecurityContext;

  async componentDidMount() {
    const stateKeys = await keys(this.customStore);

    let newState = {};
    for (let key of stateKeys) {
      try {
        const value = await get(key, this.customStore);
        newState[key] = value;
      } catch (err) {
        console.error(err);
      }
    }

    await this.setState(newState);
  }

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
    const refreshLabel = "Access token refresh";
    console.time(refreshLabel);
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
    console.timeEnd(refreshLabel);
  }

  async updateContext(newContext) {
    for (const key in newContext) {
      if (newContext.hasOwnProperty(key)) {
        let value = newContext[key];
        await set(key, value, this.customStore);
      }
    }

    await this.setState(newContext);
  }

  logOut() {
    clear(this.customStore).then(() => {
      window.location.reload();
    });
  }

  render() {
    return (
      <SecurityContext.Provider value={this.state}>
        <Router>
          <div>
            {this.isAuthenticated() && !this.state.netatmoPasswordAuth && (
              <button onClick={this.logOut}>Log out</button>
            )}
            <Switch>
              <PrivateRoute path="/" exact component={Dashboard} />
              <Route path="/login" exact component={Login} />
              <Route path="/autologin" exact component={AutoLogin} />
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
