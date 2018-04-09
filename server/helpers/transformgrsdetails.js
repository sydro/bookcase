"use strict";

module.exports = (data) => {
      let book = data
      let authors = ""
      try {
        authors = typeof book.authors.author !== "undefined" ? book.authors.author.map((author) => { return author.name }).join(", ") : "Author unavailable"
      }
      catch (err) {
        authors = typeof book.authors.author !== "undefined" ? book.authors.author.name : "Author unavailable"
      }
      return {
          "title": book.title,
          "authors": authors,
          "description": book.description || "Description unavailable",
          "isbn": typeof book.isbn13 !== "undefined" ? book.isbn13 : "ISBN unavailable",
          "pages": book.num_pages || "Page count unavailable",
          "image": typeof book.image_url !== "undefined" ? book.image_url : "Image unavailable"
        }
}
