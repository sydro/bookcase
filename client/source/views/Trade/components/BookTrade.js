"use strict";

import * as React from "react";
import { browserHistory } from "react-router";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";

class BookTrade extends React.Component {
  constructor(props) {
    super(props);
    this.onProposeTrade = this.onProposeTrade.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onAuthorsChange = this.onAuthorsChange.bind(this);
    this.onIsbnChange = this.onIsbnChange.bind(this);
    this.onPagesChange = this.onPagesChange.bind(this);
    this.onDescChange = this.onDescChange.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onTitleChange(event) {
    this.props.onTitleChange(event.target.value);
  }
  onAuthorsChange(event) {
    this.props.onAuthorsChange(event.target.value);
  }
  onIsbnChange(event) {
    this.props.onIsbnChange(event.target.value);
  }
  onPagesChange(event) {
    this.props.onPagesChange(event.target.value);
  }
  onDescChange(event) {
    this.props.onDescChange(event.target.value);
  }
  onProposeTrade() {
    this.props.onProposeTrade();
  }
  onEdit(){
    this.props.onEditInfo();
  }
  onSave(){
    this.props.onEditInfo();
    this.props.onSave();
  }
  onDelete(){
    this.props.onDelete();
  }
  render() {
    const book = this.props.book;
    const active = this.props.active;

    if (book) {
      const buttons = (typeof book.isbn == "undefined") ? null :
      <div>
        { this.props.editInfo ? (<button className="save-button" onClick={this.onSave}>Save</button>) : (<button className="button-custom" onClick={this.onEdit}>Edit</button>) }
        <button className="button-custom" onClick={this.onDelete}>Delete</button>
      </div>
      return (
        <div className="trade-all">
          <div className="trade-info">
            <img className="trade-image" src={ book.image } alt={ book.title }/>
            <div className="trade-detail">
              <div className="book-fields">
                <div><b>{ this.props.editInfo ? (<div>Title: <input className="form-input" type="text" value={ book.title } onChange={ this.onTitleChange } /></div>) : (book.title)}</b></div>
                <div>{ this.props.editInfo ? (<div>Authors: <input className="form-input" type="text" value={ book.authors } onChange={ this.onAuthorsChange } /></div>) : (book.authors)}</div>
                <div>ISBN: { this.props.editInfo ? (<input disabled className="form-input" type="text" value={ book.isbn } onChange={ this.onIsbnChange } />) : (book.isbn)}</div>
                <div>Pages: { this.props.editInfo ? (<input className="form-input" type="text" value={ book.pages } onChange={ this.onPagesChange } />) : (book.pages)}</div>
              </div>
              { /* active ? null : <button className="propose-button" onClick={ this.onProposeTrade }>Propose Trade</button> */}
              <button className="back-button" onClick={ browserHistory.goBack }>Back</button><br />
              { buttons }
              <ErrorMessage errors={ this.props.errors } />
              <SuccessMessage success={ this.props.success } />
            </div>
          </div>
          <div className="description">{ this.props.editInfo ? (<div>Description: <textarea className="form-textarea" value={ book.description } onChange={ this.onDescChange } /></div>) : (book.description)}</div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default BookTrade
