import React from "react";
import { Route, Redirect } from "react-router-dom";

import SecurityContext from "../lib/SecurityContext.js";

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <SecurityContext.Consumer>
      {value => (
        <Route
          {...rest}
          render={props =>
            value.isAuthenticated() ? (
              <Component {...props} />
            ) : (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: props.location },
                }}
              />
            )
          }
        />
      )}
    </SecurityContext.Consumer>
  );
}

export default PrivateRoute;
