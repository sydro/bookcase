"use strict";

import * as React from "react";
import { Link } from "react-router";
import { Navbar, Nav, NavItem } from "react-bootstrap";

class HeaderButtons extends React.Component {
  constructor(props) {
    super(props);
    this.onLogout = this.onLogout.bind(this);
  }
  onLogout() {
    this.props.onLogout();
  }
  render() {
    const auth = this.props.auth;
    if (auth) {
      return (
        <Nav pullRight>
          <NavItem
            className="header-button-right"
            eventKey={1}
            href="/settings"
            to="/settings"
            componentClass={Link}
          >
            My Profile
          </NavItem>
          <NavItem
            className="header-button-right"
            eventKey={2}
            onClick={this.onLogout}
            href="#"
            to="#"
            componentClass={Link}
          >
            Logout
          </NavItem>
        </Nav>
      );
    } else {
      return (
        <Nav pullRight>
          <NavItem
            className="header-button-right"
            eventKey={1}
            href="/register"
            to="/register"
            componentClass={Link}
          >
            Sign Up
          </NavItem>
          <NavItem
            className="header-button-right"
            eventKey={2}
            href="/login"
            to="/login"
            componentClass={Link}
          >
            Login
          </NavItem>
        </Nav>
      );
    }
  }
}

export default HeaderButtons;
