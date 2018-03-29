"use strict";

import * as React from "react";
import fetch from "isomorphic-fetch";
import ShowBooks from "./components/ShowBooks";
import BooksPager from "./components/BooksPager";

class Library extends React.Component {
  constructor() {
    super();
    this.getAvailableBooks = this.getAvailableBooks.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.state = { books: [], total: 0, page: 1 };
    this.paging = { limit: 10 };
  }
  getAvailableBooks(page = 1) {
    this.setState({ page: page });
    fetch("/api/library/" + page + "/" + this.paging.limit, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(json => {
        this.setState({ books: json });
      });
  }

  getTotalBooks() {
    fetch("/api/library", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(json => {
        this.setState({ total: json.total });
        console.log(json);
      });
  }

  componentWillMount() {
    this.getTotalBooks();
    this.getAvailableBooks();
  }
  handleChangePage(value) {
    this.getAvailableBooks(value);
  }
  render() {
    return (
      <div className="library-container">
        <h1>Find a Book</h1>
        <BooksPager
          books={this.state.total}
          onChangePage={this.handleChangePage}
        />
        <ShowBooks books={this.state.books} />
        <BooksPager
          books={this.state.total}
          onChangePage={this.handleChangePage}
        />
      </div>
    );
  }
}

export default Library;
