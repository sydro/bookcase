"use strict";

import * as React from "react";
import fetch from "isomorphic-fetch";
import barcode from "../../../images/barcode.svg";
import { browserHistory } from "react-router";
import {
  Row,
  Col,
  FormGroup,
  FormControl,
  Button,
  Glyphicon
} from "react-bootstrap";

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
      <Row>
        <form onSubmit={this.handleSubmit}>
          <FormGroup
            controlId="formBasicText"
            //validationState={this.getValidationState()}
          >
            <Col xs={12} mdOffset={2} md={5}>
              <FormControl
                type="text"
                value={this.state.value}
                placeholder="Enter text"
                onChange={this.handleChange}
              />
              <FormControl.Feedback />
            </Col>
            <Col xs={6} md={2}>
              <Button className="btn-search" onClick={this.handleSubmit}>
                Find Book
              </Button>
            </Col>
            <Col xs={6} md={2}>
              <Button className="btn-search" onClick={this.handleBarcode}>
                <Glyphicon glyph="barcode" /> Scan Barcode
              </Button>
            </Col>
          </FormGroup>
        </form>
      </Row>
    );
  }
}

export default SearchForm;
