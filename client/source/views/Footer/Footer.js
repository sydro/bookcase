"use strict";
var Config = require("Config2");
import * as React from "react";

class Footer extends React.Component {
  render() {
    console.log(Config);
    return (
      <footer className="footer">
        <div className="footer-container">
          <span className="footer-social" />
          <p className="footer-info">{Config.footer}</p>
        </div>
      </footer>
    );
  }
}

export default Footer;
