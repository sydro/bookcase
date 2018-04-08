"use strict";

import * as React from "react";
import { Alert } from "react-bootstrap";

class ErrorMessage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (this.props.errors.length) {
      var messages = this.props.errors.map((message, index) => (
        <p key={index}>{message}</p>
      ));
    }
    if (messages) {
      return <Alert bsStyle="danger">{messages}</Alert>;
    } else {
      return null;
    }
  }
}

export default ErrorMessage;
