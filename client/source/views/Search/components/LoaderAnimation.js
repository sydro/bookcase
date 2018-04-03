"use strict";

import * as React from "react";

class LoaderAnimation extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (this.props.loader) {
      return (
        <div className="loader-container">
          <div className="loader" />
        </div>
      );
    } else {
      return null;
    }
  }
}

export default LoaderAnimation;
