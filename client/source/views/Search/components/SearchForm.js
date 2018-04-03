"use strict";

import * as React from "react";
import fetch from "isomorphic-fetch";
import barcode from "../../../images/barcode.svg";
import { browserHistory } from "react-router";

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBarcode = this.handleBarcode.bind(this);
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  handleSubmit(event) {
    this.props.onChange(this.state.value.trim());
    event.preventDefault();
  }
  handleBarcode(event) {
    browserHistory.push("/barcode");
  }

  render() {
    if (this.props.searchValue != "") {
      this.state.value = this.props.searchValue;
    }
    return (
      <div className="form-container">
        <form onSubmit={this.handleSubmit}>
          <input
            className="form-input"
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <button className="form-button" onClick={this.handleSubmit}>
            Find Book
          </button>
          <button className="form-button" onClick={this.handleBarcode}>
            <span dangerouslySetInnerHTML={{ __html: barcode }} />
          </button>
        </form>
      </div>
    );
  }
}

export default SearchForm;
