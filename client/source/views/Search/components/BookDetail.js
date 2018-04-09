"use strict";

import * as React from "react";
import fetch from "isomorphic-fetch";
import { Button } from "react-bootstrap";

class BookDetail extends React.Component {
  constructor(props) {
    super(props);
    this.onAddBook = this.onAddBook.bind(this);
    this.onCloseDetails = this.onCloseDetails.bind(this);
    this.fetchDetails = this.fetchDetails.bind(this);
    this.state = { book: props.book }
  }
  onAddBook() {
    this.props.onAddBook();
  }
  onCloseDetails() {
    this.props.onCloseDetails();
  }

  fetchDetails(valueId) {
    fetch("/api/details/" + valueId, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(json => {
        if (json.length != 0) {
            let book = this.state.book
            book.isbn = json.isbn
            book.description = json.description
            book.authors = json.authors
            book.pages = json.pages
            delete book.grId
            this.setState({ book })
          return
        } else {
          return
        }
      });
  }

  render() {
    const book = this.state.book;
    if (typeof book.grId != "undefined") {
      this.fetchDetails(book.grId._);
    }
    if (book) {
      return (
        <div id="book-detail" className="book-detail">
          <p>
            <b>{book.title}</b>
          </p>
          <p>
            <i>{book.authors}</i>
          </p>
          <p>ISBN {book.isbn}</p>
          <p>{book.pages} pages</p>
          <Button className="form-button" onClick={this.onAddBook}>
            Add to Library
          </Button>
          <Button className="form-button" onClick={this.onCloseDetails}>
            Cancel
          </Button>
          <p> </p>
          <p>{book.description}</p>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default BookDetail;
