import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Dashboard from "./Dashboard.js";
import Login from "./Login.js";
import CodeReceived from "./CodeReceived.js";
import SecurityContext from "./SecurityContext.js";
import PrivateRoute from "./PrivateRoute.js";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: () => !!this.state.accessToken,
      updateContext: newContext => {
        this.setState(newContext);
      },
      logOut: () => {
        this.setState({ accessToken: null });
      },
    };
  }

  static contextType = SecurityContext;

  render() {
    return (
      <SecurityContext.Provider value={this.state}>
        <Router>
          <div>
            <PrivateRoute path="/" exact component={Dashboard} />
            <Route path="/login" exact component={Login} />
            <Route path="/code-received/" component={CodeReceived} />
          </div>
        </Router>
      </SecurityContext.Provider>
    );
  }
}

export default App;
