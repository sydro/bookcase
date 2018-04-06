"use strict";
var Config = require("Config");
import * as React from "react";
import { Link, browserHistory } from "react-router";
import { Navbar, Nav, NavItem } from "react-bootstrap";
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
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">{Config.title}</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem
              className="header-button-middle"
              eventKey={1}
              href="/browse"
              componentClass={Link}
              to="/browse"
            >
              Browse Books
            </NavItem>
            <NavItem
              className="header-button-middle"
              eventKey={2}
              href="/search"
              to="/search"
              componentClass={Link}
            >
              Add Book
            </NavItem>
          </Nav>
          <HeaderButtons auth={this.props.auth} onLogout={this.onLogout} />
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
