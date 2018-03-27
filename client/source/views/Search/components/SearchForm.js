"use strict";

import * as React from "react";
import fetch from "isomorphic-fetch";
import barcode from "../../../images/barcode.svg";
import { Link } from "react-router";

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  handleSubmit(event) {
    this.props.onChange(this.state.value.trim());
  }

  render() {
    if (this.props.searchValue != "") {
      this.state.value = this.props.searchValue;
    }
    return (
      <div className="form-container">
        <input
          className="form-input"
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <button className="form-button" onClick={this.handleSubmit}>
          Find Book
        </button>
        <button className="form-button" onClick={this.handleBarcodeRead}>
          <Link to="/barcode">
            <span dangerouslySetInnerHTML={{ __html: barcode }} />
          </Link>
        </button>
      </div>
    );
  }
}

export default SearchForm;
