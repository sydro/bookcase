"use strict";

import * as React from "react";

class BookDetail extends React.Component {
  constructor(props) {
    super(props);
    this.onAddBook = this.onAddBook.bind(this);
    this.onCloseDetails = this.onCloseDetails.bind(this);
  }
  onAddBook() {
    this.props.onAddBook();
  }
  onCloseDetails() {
    this.props.onCloseDetails();
  }
  render() {
    const book = this.props.book;
    if (book) {
      return (
        <div id="book-detail" className="book-detail">
          <p>
            <b>{this.props.book.title}</b>
          </p>
          <p>
            <i>{this.props.book.authors}</i>
          </p>
          <p>ISBN {this.props.book.isbn}</p>
          <p>{this.props.book.pages} pages</p>
          <button className="form-button" onClick={this.onAddBook}>
            Add to Library
          </button>
          <button className="form-button" onClick={this.onCloseDetails}>
            Cancel
          </button>
          <p>{this.props.book.description}</p>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default BookDetail;
