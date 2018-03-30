"use strict";
var Config = require("Config");
import * as React from "react";
import { Link, browserHistory } from "react-router";
import HeaderButtons from "./components/HeaderButtons";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.onLogout = this.onLogout.bind(this);
  }
  onLogout() {
    this.props.onLogout();
  }
  render() {
    return (
      <header>
        <div
          className={`${"header-container"} ${
            this.props.path === "/" ? "header-home" : "header-route"
          }`}
        >
          <div className="header-left">
            <h1 className="header-title">
              <Link to="/">{Config.title}</Link>
            </h1>
            <h3 className="header-text">Share knowledge!</h3>
          </div>
          <div className="header-middle">
            <Link className="header-button-middle" to="/browse">
              Browse Books
            </Link>
            <Link className="header-button-middle" to="/search">
              Add Books
            </Link>
          </div>
          <HeaderButtons auth={this.props.auth} onLogout={this.onLogout} />
        </div>
      </header>
    );
  }
}

export default Header;
