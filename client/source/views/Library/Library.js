"use strict";

import * as React from "react";
import fetch from "isomorphic-fetch";
import ShowBooks from "./components/ShowBooks";
import BooksPager from "./components/BooksPager";
import SearchForm from "./components/SearchForm";

class Library extends React.Component {
  constructor() {
    super();
    this.getAvailableBooks = this.getAvailableBooks.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = { books: [], total: 0, page: 1 };
    this.paging = { limit: 10 };
  }
  getAvailableBooks(page = 1, search = "") {
    this.setState({ page: page });
    let search_url = search != "" ? "/" + search : "";
    fetch("/api/library/" + page + "/" + this.paging.limit + search_url, {
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
      });
  }

  componentWillMount() {
    this.getTotalBooks();
    this.getAvailableBooks();
  }
  handleChangePage(value) {
    this.getAvailableBooks(value);
  }
  handleSearch(value) {
    this.getAvailableBooks(this.state.page, value);
  }
  render() {
    return (
      <div className="library-container">
        <h1>Find a Book</h1>
        <div id="pagination-search">
          <SearchForm onSubmit={this.handleSearch} />
          <BooksPager
            total={this.state.total}
            onChangePage={this.handleChangePage}
          />
        </div>
        <ShowBooks books={this.state.books} />
      </div>
    );
  }
}

export default Library;
