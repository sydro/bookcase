"use strict";

import * as React from "react";
import fetch from "isomorphic-fetch";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { browserHistory } from "react-router";

class App extends React.Component {
  constructor() {
    super();
    this.state = { token: "", auth: false, username: "", userid: "" };
    this.componentWillMount = this.componentWillMount.bind(this);
    this.updateAuth = this.updateAuth.bind(this);
    this.resetAuth = this.resetAuth.bind(this);
  }
  componentWillMount() {
    if (localStorage.token) {
      this.setState({
        token: localStorage.token,
        auth: true,
        username: localStorage.username,
        userid: localStorage.userid
      });
    }
  }
  updateAuth(authentication) {
    localStorage.token = authentication.token;
    localStorage.username = authentication.username;
    localStorage.userid = authentication.userid;
    this.setState({
      token: authentication.token,
      auth: true,
      username: authentication.username,
      userid: authentication.id
    });
  }
  resetAuth() {
    fetch("/api/logout", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Access-Token": localStorage.token
      },
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
        } else {
          localStorage.clear();
          browserHistory.push("/");
        }
      });
    this.setState({ token: "", auth: false, username: "", userid: "" });
  }

  render() {
    return (
      <div className="main-container">
        <Header
          auth={this.state.auth}
          path={this.props.location.pathname}
          onLogout={this.resetAuth}
        />
        <div className="main-body">
          {this.props.children &&
            React.cloneElement(this.props.children, {
              onAuth: this.updateAuth
            })}
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
