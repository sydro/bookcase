import * as React from "react";
import ReactDOM from "react-dom";

import {
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Button
} from "react-bootstrap";

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSearch(event) {
    this.props.onSubmit(this.inputNode.value);
    event.preventDefault();
  }

  handleReset() {
    this.inputNode.value = "";
    this.props.onSubmit("");
  }

  render() {
    return (
      <div id="search-form">
        <Form inline onSubmit={this.handleSearch}>
          <FormGroup controlId="formInlineName">
            <ControlLabel>title</ControlLabel>{" "}
            <FormControl
              inputRef={node => (this.inputNode = node)}
              type="text"
              placeholder="ex: title of book"
            />
          </FormGroup>{" "}
          <Button onClick={this.handleSearch}>Filter</Button>
          <Button onClick={this.handleReset}>Reset</Button>
        </Form>
      </div>
    );
  }
}

export default SearchForm;
