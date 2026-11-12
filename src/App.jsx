import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createStore, set, keys, get } from "idb-keyval";
import { Honeybadger, HoneybadgerErrorBoundary } from "@honeybadger-io/react";

import Dashboard from "./containers/Dashboard";
import NoMatch from "./containers/NoMatch";

import ErrorComponent from "./components/ErrorComponent";

import SecurityContext from "./lib/SecurityContext";

const revision =
  import.meta.env.VITE_COMMIT_REF ||
  import.meta.env.COMMIT_REF ||
  import.meta.env.GIT_COMMIT ||
  "master";

const honeybadger = Honeybadger.configure({
  apiKey: "2c0ecf78",
  environment: import.meta.env.MODE,
  revision: revision,
});

class App extends Component {
  constructor(props) {
    super(props);

    this.customStore = createStore("air-dash", "app-state");
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
      if (Object.prototype.hasOwnProperty.call(newContext, key)) {
        let value = newContext[key];
        await set(key, value, this.customStore);
      }
    }

    await this.setState(newContext);
  }

  forceReloadPage() {
    window.location.reload();
  }

  render() {
    return (
      <HoneybadgerErrorBoundary honeybadger={honeybadger} ErrorComponent={ErrorComponent}>
        <SecurityContext.Provider value={this.state}>
          <Router>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="*" element={<NoMatch />} />
            </Routes>
          </Router>
        </SecurityContext.Provider>
      </HoneybadgerErrorBoundary>
    );
  }
}

export default App;
