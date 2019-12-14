import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Store, set, keys, get } from "idb-keyval";
import Honeybadger from "honeybadger-js";
import ErrorBoundary from "@honeybadger-io/react";

import Dashboard from "./containers/Dashboard.js";
import NoMatch from "./containers/NoMatch.js";

import ErrorComponent from "./components/ErrorComponent.js";

import SecurityContext from "./lib/SecurityContext.js";

const revision =
  process.env.REACT_APP_COMMIT_REF || process.env.COMMIT_REF || process.env.GIT_COMMIT || "master";

const honeybadgerConfig = {
  api_key: "2c0ecf78",
  environment: process.env.NODE_ENV,
  revision: revision,
};

const honeybadger = Honeybadger.configure(honeybadgerConfig);

class App extends Component {
  constructor(props) {
    super(props);

    this.customStore = new Store("air-dash", "app-state");
    this.updateContext = this.updateContext.bind(this);

    let state = {
      updateContext: this.updateContext,
      forceReloadPage: this.forceReloadPage,
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

  async updateContext(newContext) {
    for (const key in newContext) {
      if (newContext.hasOwnProperty(key)) {
        let value = newContext[key];
        await set(key, value, this.customStore);
      }
    }

    await this.setState(newContext);
  }

  forceReloadPage() {
    navigator.serviceWorker.getRegistration().then(function(reg) {
      if (reg) {
        reg.unregister().then(function() {
          window.location.reload(true);
        });
      } else {
        window.location.reload(true);
      }
    });
  }

  render() {
    return (
      <ErrorBoundary honeybadger={honeybadger} ErrorComponent={ErrorComponent}>
        <SecurityContext.Provider value={this.state}>
          <Router>
            <>
              <Switch>
                <Route path="/" exact component={Dashboard} />
                <Route component={NoMatch} />
              </Switch>
            </>
          </Router>
        </SecurityContext.Provider>
      </ErrorBoundary>
    );
  }
}

export default App;
