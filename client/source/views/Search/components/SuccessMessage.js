"use strict";

import * as React from "react";
import { Alert } from "react-bootstrap";

class SuccessMessage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (this.props.success.length) {
      var messages = this.props.success.map((message, index) => (
        <p key={index}>{message}</p>
      ));
    }
    if (messages) {
      return <Alert bStyle="success">{messages}</Alert>;
    } else {
      return null;
    }
  }
}

export default SuccessMessage;
