import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
//functions
import { _t, consolee, getCookie } from "../functions/Functions";

//3rd party packages

export default class AdminRoute extends Component {
  render() {
    let token = getCookie();
    const { children, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={() => {
          return token !== undefined ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { alert: "You need to login first!" },
              }}
            />
          );
        }}
      ></Route>
    );
  }
}
