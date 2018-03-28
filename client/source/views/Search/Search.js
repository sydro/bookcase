"use strict";

import * as React from "react";
import fetch from "isomorphic-fetch";
import { browserHistory } from "react-router";
import SearchForm from "./components/SearchForm";
import SearchResults from "./components/SearchResults";
import google from "../../images/google-dev.svg";
import SuccessMessage from "./components/SuccessMessage";
import ErrorMessage from "./components/ErrorMessage";

class Search extends React.Component {
  constructor() {
    super();
    this.state = { books: [], success: [], errors: [] };
    this.handleBookRequest = this.handleBookRequest.bind(this);
    this.handleAddBook = this.handleAddBook.bind(this);
    this.handleCloseDetails = this.handleCloseDetails.bind(this);
  }
  handleBookRequest(value) {
    if (!value.length) {
      return;
    }
    fetch("/api/search", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      credentials: "same-origin",
      body: `search=${value}`
    })
      .then(response => response.json())
      .then(json => {
        this.setState({ books: json });
      });
  }
  handleAddBook(index) {
    fetch("/api/library", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Access-Token": localStorage.token
      },
      credentials: "same-origin",
      body: `book=${encodeURIComponent(
        JSON.stringify(this.state.books[index])
      )}`
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          let error =
            json.error == "500" ? "Books exists in library!" : json.message;
          this.setState({ success: [], errors: [error] });
        } else {
          this.setState({ success: json.success, errors: [] });
        }
        console.log(this.state);
      });
  }
  handleCloseDetails() {
    this.setState({ success: [], error: [] });
  }
  render() {
    let searchValue = "";
    if (typeof this.props.params.isbn != "undefined") {
      this.handleBookRequest("isbn:" + this.props.params.isbn);
      searchValue = "isbn:" + this.props.params.isbn;
      this.props.params.isbn = undefined;
    }
    return (
      <div className="account-container">
        <h1>Add Books to Library</h1>
        <SearchForm
          onChange={this.handleBookRequest}
          searchValue={searchValue}
        />
        <SuccessMessage success={this.state.success} />
        <ErrorMessage errors={this.state.errors} />
        <SearchResults
          books={this.state.books}
          onAddBook={this.handleAddBook}
          onCloseDetails={this.handleCloseDetails}
        />
        <p className="data-label">
          Data provided by <span dangerouslySetInnerHTML={{ __html: google }} />{" "}
          Google Books API
        </p>
      </div>
    );
  }
}

export default Search;
