"use strict";

import * as React from "react";
import { browserHistory } from "react-router";
import BookTrade from "./components/BookTrade";
import TradeForm from "./components/TradeForm";

class Trade extends React.Component {
  constructor() {
    super();
    this.state = {
      books: null,
      active: false,
      errors: [],
      success: [],
      editInfo: false,
      book: null
    };
    this.getBookData = this.getBookData.bind(this);
    this.getUserBooks = this.getUserBooks.bind(this);
    this.handleTradeRequest = this.handleTradeRequest.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.toggleEditInfo = this.toggleEditInfo.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.updateBook = this.updateBook.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleAuthorsChange = this.handleAuthorsChange.bind(this);
    this.handleIsbnChange = this.handleIsbnChange.bind(this);
    this.handlePagesChange = this.handlePagesChange.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
  }
  toggleEditInfo() {
    const info = !this.state.editInfo;
    this.setState({ editInfo: info });
  }
  handleTitleChange(change) {
    let b = this.state.book;
    this.setState({
      book: {
        title: change,
        authors: b.authors,
        isbn: b.isbn,
        pages: b.pages,
        image: b.image,
        description: b.description
      }
    });
  }
  handleAuthorsChange(change) {
    let b = this.state.book;
    this.setState({
      book: {
        title: b.title,
        authors: change,
        isbn: b.isbn,
        pages: b.pages,
        image: b.image,
        description: b.description
      }
    });
  }
  handleIsbnChange(change) {
    let b = this.state.book;
    this.setState({
      book: {
        title: b.title,
        authors: b.authors,
        isbn: change,
        pages: b.pages,
        image: b.image,
        description: b.description
      }
    });
  }
  handlePagesChange(change) {
    let b = this.state.book;
    this.setState({
      book: {
        title: b.title,
        authors: b.authors,
        isbn: b.isbn,
        pages: change,
        image: b.image,
        description: b.description
      }
    });
  }
  handleDescChange(change) {
    let b = this.state.book;
    this.setState({
      book: {
        title: b.title,
        authors: b.authors,
        isbn: b.isbn,
        pages: b.pages,
        image: b.image,
        description: change
      }
    });
  }
  handleSave() {
    this.updateBook();
  }
  handleDelete() {
    fetch(`/api/book`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      credentials: "same-origin",
      body: `isbn=${encodeURIComponent(this.state.book.isbn)}`
    })
      .then(response => response.json())
      .then(json => {
        this.setState({ book: [], success: [] });
      });
  }
  getBookData() {
    fetch(`/api/book/${this.props.params.id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(json => {
        this.setState({ book: json });
      });
  }
  getUserBooks() {
    fetch("/api/settings", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Access-Token": localStorage.token
      },
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          this.setState({ errors: new Array(json.message) });
        } else if (json.username === this.state.book.owner) {
          this.setState({ errors: ["Can't trade own books"] });
        } else {
          this.setState({ books: json.books, active: true });
        }
      });
  }
  updateBook() {
    const book = this.state.book;
    fetch("/api/book", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Access-Token": localStorage.token
      },
      credentials: "same-origin",
      body: `book=${encodeURIComponent(JSON.stringify(book))}`
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          this.setState({ errors: new Array(json.message) });
        } else {
          this.setState({ book: json.book, errors: [] });
        }
      });
  }
  handleTradeRequest(index) {
    if (index) {
      const trade = this.state.trade;
      const offer = this.state.books[index];
      fetch("/api/trade", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Access-Token": localStorage.token
        },
        credentials: "same-origin",
        body: `trade=${encodeURIComponent(
          JSON.stringify(trade)
        )}&offer=${encodeURIComponent(JSON.stringify(offer))}&index=${index}`
      })
        .then(response => response.json())
        .then(json => {
          if (json.error) {
            this.setState({ errors: new Array(json.message) });
          } else {
            this.setState({ success: json.success });
            this.onEditInfo();
          }
        });
    }
  }
  componentWillMount() {
    this.getBookData();
  }
  render() {
    return (
      <div className="trade-container">
        <BookTrade
          editInfo={this.state.editInfo}
          book={this.state.book}
          active={this.state.active}
          onProposeTrade={this.getUserBooks}
          onEditInfo={this.toggleEditInfo}
          onSave={this.handleSave}
          onDelete={this.handleDelete}
          onTitleChange={this.handleTitleChange}
          onAuthorsChange={this.handleAuthorsChange}
          onIsbnChange={this.handleIsbnChange}
          onPagesChange={this.handlePagesChange}
          onDescChange={this.handleDescChange}
          errors={this.state.errors}
          success={this.state.success}
        />

        <TradeForm
          books={this.state.books}
          onSendTrade={this.handleTradeRequest}
        />
      </div>
    );
  }
}

export default Trade;
