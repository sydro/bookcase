"use strict";

module.exports = (data) => {
  try {
    return data.results.work.map((book) => {
      return {
            "title": book.best_book.title,
            "authors": typeof book.best_book.author !== "undefined" ? book.best_book.author.name : "Author unavailable",
            //"description": book.volumeInfo.description || "Description unavailable",
            //"isbn": typeof book.volumeInfo.industryIdentifiers !== "undefined" ? book.volumeInfo.industryIdentifiers[0].identifier : "ISBN unavailable",
            //"pages": book.volumeInfo.pageCount || "Page count unavailable",
            "image": typeof book.best_book.image_url !== "undefined" ? book.best_book.image_url : "Image unavailable"
          }
    });
  } catch(err) {
    if (err.message == "data.results.work.map is not a function") {
      var book = data.results.work
      return [ {
          "title": book.best_book.title,
          "authors": typeof book.best_book.author !== "undefined" ? book.best_book.author.name : "Author unavailable",
          //"description": book.volumeInfo.description || "Description unavailable",
          //"isbn": typeof book.volumeInfo.industryIdentifiers !== "undefined" ? book.volumeInfo.industryIdentifiers[0].identifier : "ISBN unavailable",
          //"pages": book.volumeInfo.pageCount || "Page count unavailable",
          "image": typeof book.best_book.image_url !== "undefined" ? book.best_book.image_url : "Image unavailable"
        } ]
    } else return []
  }
}
