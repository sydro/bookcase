"use strict";

import * as React from "react";
import fetch from "isomorphic-fetch";
import EditButtons from "./components/EditButtons";
import UserInfo from "./components/UserInfo";
import UserBooks from "./components/UserBooks";
import UserTrades from "./components/UserTrades";
import ErrorMessage from "./components/ErrorMessage";
import { Grid, Row, Col, Button } from "react-bootstrap";

class Settings extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      first: "",
      last: "",
      email: "",
      city: "",
      state: "",
      books: [],
      trades: [],
      editInfo: false,
      editBooks: false,
      isEdit: false,
      errors: [],
      edits: []
    };
    this.getUserInfo = this.getUserInfo.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.toggleEditInfo = this.toggleEditInfo.bind(this);
    this.toggleEditBooks = this.toggleEditBooks.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleEditFirst = this.handleEditFirst.bind(this);
    this.handleEditLast = this.handleEditLast.bind(this);
    this.handleEditCity = this.handleEditCity.bind(this);
    this.handleEditState = this.handleEditState.bind(this);
    this.handleEditEmail = this.handleEditEmail.bind(this);
    this.handleDeleteBooks = this.handleDeleteBooks.bind(this);
    this.handleCancelTrade = this.handleCancelTrade.bind(this);
    this.handleAcceptTrade = this.handleAcceptTrade.bind(this);
    this.handleDeclineTrade = this.handleDeclineTrade.bind(this);
  }
  componentWillMount() {
    this.getUserInfo();
  }
  getUserInfo() {
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
        } else {
          this.setState({
            username: json.username,
            first: json.first,
            last: json.last,
            city: json.city,
            state: json.state,
            email: json.email,
            trades: json.trades,
            books: json.books,
            edits: json.books.map(book => {
              return { id: book.id, remove: false };
            })
          });
        }
      });
  }
  toggleEditInfo() {
    const info = !this.state.editInfo;
    const edit = !this.state.isEdit;
    this.setState({ editInfo: info, isEdit: edit });
  }
  toggleEditBooks() {
    const books = !this.state.editBooks;
    const edit = !this.state.isEdit;
    this.setState({ editBooks: books, isEdit: edit });
  }
  handleEditFirst(change) {
    this.setState({ first: change });
  }
  handleEditLast(change) {
    this.setState({ last: change });
  }
  handleEditCity(change) {
    this.setState({ city: change });
  }
  handleEditState(change) {
    this.setState({ state: change });
  }
  handleEditEmail(change) {
    this.setState({ email: change });
  }
  handleDeleteBooks(index) {
    const edits = this.state.edits.slice();
    edits[index].remove = !edits[index].remove;
    this.setState({
      edits: edits,
      errors: ["Warning, books marked with X's are deleted on save"]
    });
  }
  handleSave() {
    if (this.state.editInfo) {
      this.updateUser();
    } else if (this.state.editBooks) {
      this.updateBooks();
    }
  }
  updateUser() {
    fetch("/api/user", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Access-Token": localStorage.token
      },
      credentials: "same-origin",
      body: `first=${this.state.first}&last=${this.state.last}&city=${
        this.state.city
      }&state=${this.state.state}&email=${this.state.email}`
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          this.setState({ errors: new Array(json.message) });
        } else {
          this.setState({
            first: json.first,
            last: json.last,
            city: json.city,
            state: json.state,
            email: json.email,
            editInfo: !this.state.editInfo,
            isEdit: !this.state.isEdit
          });
        }
      });
  }
  updateBooks() {
    const books = this.state.books
      .slice()
      .filter((book, index) => !this.state.edits[index].remove);
    const remove = this.state.edits
      .slice()
      .filter(edit => edit.remove)
      .map(edit => edit._id);
    fetch("/api/books", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Access-Token": localStorage.token
      },
      credentials: "same-origin",
      body: `books=${encodeURIComponent(
        JSON.stringify(books)
      )}&remove=${encodeURIComponent(JSON.stringify(remove))}`
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          this.setState({ errors: new Array(json.message) });
        } else {
          this.setState({
            books: json.books,
            editBooks: !this.state.editBooks,
            isEdit: !this.state.isEdit,
            errors: [],
            edits: json.books.map(book => {
              return { id: book.id, remove: false };
            })
          });
        }
      });
  }
  handleCancelTrade(index) {
    const trade = this.state.trades[index];
    fetch("/api/trade", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Access-Token": localStorage.token
      },
      credentials: "same-origin",
      body: `trade=${encodeURIComponent(JSON.stringify(trade))}`
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          this.setState({ errors: new Array(json.message) });
        } else {
          this.setState({ books: json.books, trades: json.trades });
        }
      });
  }
  handleAcceptTrade(index) {
    const trade = this.state.trades[index];
    fetch("/api/trade", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Access-Token": localStorage.token
      },
      credentials: "same-origin",
      body: `trade=${encodeURIComponent(JSON.stringify(trade))}`
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          this.setState({ errors: new Array(json.message) });
        } else {
          this.setState({
            books: json.books,
            trades: json.trades,
            success: json.success
          });
        }
      });
    fetch("/api/library", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Access-Token": localStorage.token
      },
      credentials: "same-origin",
      body: `trade=${encodeURIComponent(JSON.stringify(trade))}`
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          this.setState({ errors: new Array(json.message) });
        }
      });
  }
  handleDeclineTrade(index) {
    const trade = this.state.trades[index];
    fetch("/api/trade", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Access-Token": localStorage.token
      },
      credentials: "same-origin",
      body: `trade=${encodeURIComponent(JSON.stringify(trade))}`
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          this.setState({ errors: new Array(json.message) });
        } else {
          this.setState({ books: json.books, trades: json.trades });
        }
      });
  }
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12} md={12}>
            <div className="settings-container">
              <EditButtons
                isEdit={this.state.isEdit}
                onSave={this.handleSave}
                onEditInfo={this.toggleEditInfo}
                onEditBooks={this.toggleEditBooks}
              />

              <ErrorMessage errors={this.state.errors} />

              <UserInfo
                editInfo={this.state.editInfo}
                onFirstChange={this.handleEditFirst}
                onLastChange={this.handleEditLast}
                onCityChange={this.handleEditCity}
                onStateChange={this.handleEditState}
                onEmailChange={this.handleEditEmail}
                username={this.state.username}
                first={this.state.first}
                last={this.state.last}
                city={this.state.city}
                state={this.state.state}
                email={this.state.email}
              />

              <UserBooks
                editBooks={this.state.editBooks}
                onBooksDelete={this.handleDeleteBooks}
                books={this.state.books}
                edits={this.state.edits}
              />

              <UserTrades
                trades={this.state.trades}
                onCancelTrade={this.handleCancelTrade}
                onAcceptTrade={this.handleAcceptTrade}
                onDeclineTrade={this.handleDeclineTrade}
              />
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Settings;
