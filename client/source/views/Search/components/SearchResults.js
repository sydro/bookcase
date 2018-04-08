"use strict";

import * as React from "react";
import BookDetail from "./BookDetail";
import { Modal, Button } from "react-bootstrap";

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.showDetail = this.showDetail.bind(this);
    this.state = { book: null, index: null, showDetail: false };
    this.onAddBook = this.onAddBook.bind(this);
    this.onCloseDetails = this.onCloseDetails.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.handleHideDetail = this.handleHideDetail.bind(this);
  }
  componentWillReceiveProps() {
    this.setState({ book: null, index: null });
  }
  showDetail(index, event) {
    this.setState({
      book: this.props.books[index],
      index: index,
      showDetail: true
    });
  }
  onAddBook() {
    this.props.onAddBook(this.state.index);
    this.handleHideDetail();
  }
  onCloseDetails() {
    this.props.onCloseDetails();
    this.handleHideDetail();
  }
  handleHideDetail() {
    this.setState({ showDetail: false });
  }
  render() {
    const books = this.props.books.map((book, index) => {
      return (
        <div
          className="book-entry"
          key={index}
          onClick={this.showDetail.bind(this, index)}
        >
          <img className="book-image" src={book.image} alt={book.title} />
          <p>
            <b>{book.title}</b>
          </p>
          <p>
            <i>{book.authors}</i>
          </p>
        </div>
      );
    });
    return (
      <div className="search-container">
        <Modal
          show={this.state.showDetail}
          onHide={this.handleHideDetail}
          dialogClassName="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">Add Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BookDetail
              book={this.state.book}
              onAddBook={this.onAddBook}
              onCloseDetails={this.onCloseDetails}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleHideDetail}>Close</Button>
          </Modal.Footer>
        </Modal>
        <div className="search-results">{books}</div>
      </div>
    );
  }
}

export default SearchResults;
