"use strict";

import * as React from "react";
import fetch from "isomorphic-fetch";
import ShowBooks from "./components/ShowBooks";
import BooksPager from "./components/BooksPager";
import SearchForm from "./components/SearchForm";
import { Grid, Row, Col } from "react-bootstrap";

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
        <Grid>
          <Row className="middle">
            <Col xs={12} md={12}>
              <h1>Find a Book</h1>
            </Col>
          </Row>
          <Row>
            <Col xs={10} xsOffset={1} md={10} mdOffset={1}>
              <div id="pagination-search">
                <Row>
                  <Col xs={12} md={5}>
                    <SearchForm onSubmit={this.handleSearch} />
                  </Col>
                  <Col xs={12} md={7}>
                    <BooksPager
                      total={this.state.total}
                      onChangePage={this.handleChangePage}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12}>
              <ShowBooks books={this.state.books} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Library;
