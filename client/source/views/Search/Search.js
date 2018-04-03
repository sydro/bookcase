"use strict";

import * as React from "react";
import fetch from "isomorphic-fetch";
import { browserHistory } from "react-router";
import SearchForm from "./components/SearchForm";
import SearchResults from "./components/SearchResults";
import google from "../../images/google-dev.svg";
import goodreads from "../../images/goodreads_logo.svg";
import SuccessMessage from "./components/SuccessMessage";
import ErrorMessage from "./components/ErrorMessage";
import Loader from "./components/LoaderAnimation";

class Search extends React.Component {
  constructor() {
    super();
    this.state = { books: [], success: [], errors: [], loader: false };
    this.handleBookRequest = this.handleBookRequest.bind(this);
    this.handleBookRequestFallback = this.handleBookRequestFallback.bind(this);
    this.handleAddBook = this.handleAddBook.bind(this);
    this.handleCloseDetails = this.handleCloseDetails.bind(this);
  }
  handleBookRequestFallback(value) {
    if (!value.length) {
      return;
    }
    fetch("/api/search2", {
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
        if (json.length != 0) {
          this.setState({ books: json, errors: [], loader: false });
        } else {
          this.setState({
            books: [],
            errors: ["Nessun libro trovato"],
            loader: false
          });
        }
      });
  }
  handleBookRequest(value) {
    if (!value.length) {
      return;
    }
    this.setState({ books: [], loader: true, errors: [] });
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
        if (json.length != 0) {
          this.setState({ books: json, errors: [], loader: false });
        } else {
          this.handleBookRequestFallback(value);
        }
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
        <Loader loader={this.state.loader} />
        <SearchResults
          books={this.state.books}
          onAddBook={this.handleAddBook}
          onCloseDetails={this.handleCloseDetails}
        />
        <p className="data-label">
          Data provided by <span dangerouslySetInnerHTML={{ __html: google }} />{" "}
          Google Books API and{" "}
          <span dangerouslySetInnerHTML={{ __html: goodreads }} /> GoodReads API
        </p>
      </div>
    );
  }
}

export default Search;
