"use strict";

import * as React from "react";
import { browserHistory } from "react-router";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import { Grid, Row, Col, Button } from "react-bootstrap";

class BookTrade extends React.Component {
  constructor(props) {
    super(props);
    this.onProposeTrade = this.onProposeTrade.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onAuthorsChange = this.onAuthorsChange.bind(this);
    this.onIsbnChange = this.onIsbnChange.bind(this);
    this.onPagesChange = this.onPagesChange.bind(this);
    this.onDescChange = this.onDescChange.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onTitleChange(event) {
    this.props.onTitleChange(event.target.value);
  }
  onAuthorsChange(event) {
    this.props.onAuthorsChange(event.target.value);
  }
  onIsbnChange(event) {
    this.props.onIsbnChange(event.target.value);
  }
  onPagesChange(event) {
    this.props.onPagesChange(event.target.value);
  }
  onDescChange(event) {
    this.props.onDescChange(event.target.value);
  }
  onProposeTrade() {
    this.props.onProposeTrade();
  }
  onEdit() {
    this.props.onEditInfo();
  }
  onSave() {
    this.props.onEditInfo();
    this.props.onSave();
  }
  onDelete() {
    this.props.onDelete();
  }
  render() {
    const book = this.props.book;
    const active = this.props.active;

    if (book) {
      const buttons =
        typeof book.isbn == "undefined" ? null : (
          <div>
            <Button className="button-custom" onClick={browserHistory.goBack}>
              Back
            </Button>
            {this.props.editInfo ? (
              <Button className="save-button" onClick={this.onSave}>
                Save
              </Button>
            ) : (
              <Button className="button-custom" onClick={this.onEdit}>
                Edit
              </Button>
            )}
            <Button className="button-custom" onClick={this.onDelete}>
              Delete
            </Button>
          </div>
        );
      return (
        <Grid>
          <Row>
            <Col xs={12} md={4} className="trade-image-div">
              <img className="trade-image" src={book.image} alt={book.title} />
            </Col>
            <Col xs={12} md={8}>
              <Row>
                <Col xs={12} md={12}>
                  <b>
                    {this.props.editInfo ? (
                      <div>
                        Title:{" "}
                        <input
                          className="form-input"
                          type="text"
                          value={book.title}
                          onChange={this.onTitleChange}
                        />
                      </div>
                    ) : (
                      book.title
                    )}
                  </b>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={12}>
                  {this.props.editInfo ? (
                    <div>
                      Authors:{" "}
                      <input
                        className="form-input"
                        type="text"
                        value={book.authors}
                        onChange={this.onAuthorsChange}
                      />
                    </div>
                  ) : (
                    book.authors
                  )}
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={12}>
                  ISBN:{" "}
                  {this.props.editInfo ? (
                    <input
                      disabled
                      className="form-input"
                      type="text"
                      value={book.isbn}
                      onChange={this.onIsbnChange}
                    />
                  ) : (
                    book.isbn
                  )}
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={12}>
                  Pages:{" "}
                  {this.props.editInfo ? (
                    <input
                      className="form-input"
                      type="text"
                      value={book.pages}
                      onChange={this.onPagesChange}
                    />
                  ) : (
                    book.pages
                  )}
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={12}>
                  <ErrorMessage errors={this.props.errors} />
                  <SuccessMessage success={this.props.success} />
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={12}>
                  {buttons}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12}>
              {this.props.editInfo ? (
                <div>
                  Description:{" "}
                  <textarea
                    className="form-textarea"
                    value={book.description}
                    onChange={this.onDescChange}
                  />
                </div>
              ) : (
                book.description
              )}
            </Col>
          </Row>
        </Grid>
      );
    } else {
      return null;
    }
  }
}

export default BookTrade;
