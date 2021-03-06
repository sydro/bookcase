"use strict";

const router = require("express").Router();
const books = require("../apis/books");
const booksgrs = require("../apis/books-grs");
const transform = require("../helpers/transform");
const transform2 = require("../helpers/transformgrs");
const transform2details = require("../helpers/transformgrsdetails");
const mid = require("../middleware");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Book = require("../models/Book");
const User = require("../models/User");

router.post("/register", mid.loggedOut, (req, res, next) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    let error = new Error("Username, email, and password required");
    error.status = 400;
    return next(error);
  }
  if (req.body.password !== req.body.confirm) {
    let error = new Error("Passwords must match");
    error.status = 400;
    return next(error);
  }

  let user = {
    username: req.body.username,
    email: req.body.email,
    first: req.body.first || "",
    last: req.body.last || "",
    password: req.body.password
  };

  User.create(user, (error, user) => {
    if (error) {
      return next(error);
    }
    res.status(200).send({ message: ["Success, welcome to Book Trader!"] });
  });
});

router.get("/token/verify", mid.loggedIn, (req, res, next) => {
  res.send(req.decoded);
});

router.post("/token/refresh", (req, res, next) => {
  jwt.sign(
    { username: req.body.username, id: req.body.userid },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "2d" },
    (error, token) => {
      if (error) {
        return next(error);
      }
      res.status(200).send({
        success: ["Success, you're logged in!"],
        token: token,
        authenticated: true,
        username: user.username,
        id: user._id
      });
    }
  );
});

router.post("/login", mid.loggedOut, (req, res, next) => {
  User.authenticate(req.body.email, req.body.password, (error, user) => {
    if (error || !user) {
      res.send({ error: ["Invalid username or password"] });
    } else {
      jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWT_SECRET,
        { algorithm: "HS256", expiresIn: "2d" },
        (error, token) => {
          if (error) {
            return next(error);
          }
          res.status(200).send({
            success: ["Success, you're logged in!"],
            token: token,
            authenticated: true,
            username: user.username,
            id: user._id
          });
        }
      );
    }
  });
});

router.get("/logout", mid.loggedIn, (req, res, next) => {
  if (req.decoded) {
    req.decoded = null;
  }
  res.status(301).send({ success: ["Logged out from system"] });
});

router.get("/library", (req, res, next) => {
  Book.find({}).count((error, count) => {
    if (error) {
      return next(error);
    }
    res.status(200).send({ total: count });
  });
});

router.get("/library/:page/:limit", (req, res, next) => {
  const page = typeof req.params.page != "undefined" ? req.params.page : 1;
  const limit = typeof req.params.limit != "undefined" ? req.params.limit : 10;
  Book.find({}, (error, books) => {
    if (error) {
      return next(error);
    }
    res.status(200).send(books);
  })
    .skip((page - 1) * limit)
    .limit(limit * 1);
});

router.get("/library/:page/:limit/:search", (req, res, next) => {
  const page = typeof req.params.page != "undefined" ? req.params.page : 1;
  const limit = typeof req.params.limit != "undefined" ? req.params.limit : 10;
  //Book.find({ title: new RegExp(searchRegex) }, (error, books) => {
  Book.find(
    { title: { $regex: req.params.search, $options: "i" } },
    (error, books) => {
      if (error) {
        return next(error);
      }
      res.status(200).send(books);
    }
  );
});

router.get("/book/:id", (req, res, next) => {
  const id = req.params.id;
  Book.findById(mongoose.Types.ObjectId(id), (error, book) => {
    if (error) {
      return next(error);
    }
    res.status(200).send(book);
  });
});

router.post("/search", (req, res, next) => {
  books
    .get(req.body.search)
    .then(value => {
      let books = [];
      if (typeof value.items != "undefined") {
        books = transform(value);
      }
      res.status(200).send(books);
    })
    .catch(reason => {
      return next(reason);
    });
});

router.post("/search2", (req, res, next) => {
  booksgrs
    .get(req.body.search)
    .then(value => {
      let books = [];
      if (typeof value.results != "undefined") {
        books = transform2(value);
      }
      res.status(200).send(books);
    })
    .catch(reason => {
      return next(reason);
    });
});

router.get("/details/:id", (req, res, next) => {
  const id = req.params.id;
  booksgrs
    .getDetails(id)
    .then(value => {
      let book = [];
      if (typeof value != "undefined") {
        book = transform2details(value);
      }
      res.status(200).send(book);
    })
    .catch(reason => {
      return next(reason);
    });
});

router.post("/library", mid.loggedIn, (req, res, next) => {
  try {
    var book = Object.assign(
      {},
      JSON.parse(decodeURIComponent(req.body.book)),
      { owner: req.decoded.username },
      { id: mongoose.Types.ObjectId() }
    );
  } catch (error) {
    return next(error);
  }
  if (req.decoded.username == "admin") {
    Book.create(book, (error, book) => {
      if (error) {
        return next(error);
      }
      res.status(200).send({ success: [book.title + " added to collection"] });
    });
  } else {
    let error = new Error(
      "Error: have not necessary privileges to add a book!"
    );
    error.status = 403;
    return next(error);
  }
});

router.get("/settings", mid.loggedIn, (req, res, next) => {
  User.findById(req.decoded.id).exec((error, user) => {
    if (error) {
      return next(error);
    } else if (!user) {
      let error = new Error("No matching user");
      error.status = 404;
      return next(error);
    } else {
      res.status(200).send({
        username: user.username,
        first: user.first,
        last: user.last,
        city: user.city,
        state: user.state,
        email: user.email,
        books: user.books,
        trades: user.trades
      });
    }
  });
});

router.put("/user", mid.loggedIn, (req, res, next) => {
  if (req.body.email) {
    User.findOneAndUpdate(
      { _id: req.decoded.id },
      {
        email: req.body.email,
        first: req.body.first,
        last: req.body.last,
        city: req.body.city,
        state: req.body.state
      },
      { safe: true, strict: true, new: true }
    ).exec((error, user) => {
      if (error) {
        return next(error);
      } else if (!user) {
        let error = new Error("No matching user");
        error.status = 404;
        return next(error);
      } else {
        res.status(200).send({
          first: user.first,
          last: user.last,
          city: user.city,
          state: user.state,
          email: user.email
        });
      }
    });
  } else {
    let error = new Error("Email is required");
    error.status = 400;
    return next(error);
  }
});

router.put("/book", mid.loggedIn, (req, res, next) => {
  let book = JSON.parse(decodeURIComponent(req.body.book));
  if (book) {
    Book.findOneAndUpdate(
      { isbn: book.isbn },
      {
        title: book.title,
        authors: book.authors,
        isbn: book.isbn,
        pages: book.pages,
        description: book.description
      },
      { safe: true, strict: true, new: true }
    ).exec((error, book) => {
      if (error) {
        return next(error);
      } else if (!book) {
        let error = new Error("No matching book");
        error.status = 404;
        return next(error);
      } else {
        res.status(200).send({
          book: book
        });
      }
    });
  } else {
    let error = new Error("Isbn is required");
    error.status = 400;
    return next(error);
  }
});

router.delete("/book", (req, res, next) => {
  let isbn = req.body.isbn;
  if (isbn) {
    Book.findOneAndRemove({ isbn: isbn }).exec((error, book) => {
      if (error) {
        return next(error);
      } else if (!book) {
        let error = new Error("No matching book");
        error.status = 404;
        return next(error);
      } else {
        res.status(200).send({
          success: "Book wih isbn: " + isbn + " removed!"
        });
      }
    });
  } else {
    let error = new Error("Isbn is required");
    error.status = 400;
    return next(error);
  }
});

router.put("/books", mid.loggedIn, (req, res, next) => {
  try {
    var books = JSON.parse(decodeURIComponent(req.body.books));
    var remove = JSON.parse(decodeURIComponent(req.body.remove)).map(id =>
      mongoose.Types.ObjectId(id)
    );
  } catch (error) {
    return next(error);
  }
  User.findOneAndUpdate(
    { _id: req.decoded.id },
    { books: books },
    { safe: true, strict: true, new: true }
  ).exec((error, user) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      let error = new Error("No matching user");
      error.status = 404;
      return next(error);
    }
    if (remove.length) {
      Book.find()
        .where("_id")
        .in(remove)
        .remove()
        .exec((error, books) => {
          if (error) {
            return next(error);
          }
          res.status(200).send({
            books: user.books,
            message: ["Book(s) removed from collection"]
          });
        });
    } else {
      res.status(200).send({ books: user.books });
    }
  });
});

router.put("/library", mid.loggedIn, (req, res, next) => {
  try {
    var exchange = JSON.parse(decodeURIComponent(req.body.trade));
  } catch (error) {
    return next(error);
  }
  Book.findOneAndUpdate(
    { id: exchange.trade.id },
    { $set: { owner: exchange.offer.owner } },
    { new: true },
    (error, book1) => {
      if (error) {
        return next(error);
      }
      Book.findOneAndUpdate(
        { id: exchange.offer.id },
        { $set: { owner: exchange.trade.owner } },
        { new: true },
        (error, book2) => {
          if (error) {
            return next(error);
          }
          res.status(200).send({ message: "Library updated" });
        }
      );
    }
  );
});

router.post("/trade", mid.loggedIn, (req, res, next) => {
  try {
    var trade = JSON.parse(decodeURIComponent(req.body.trade));
    var offer = JSON.parse(decodeURIComponent(req.body.offer));
    var index = Number(req.body.index);
  } catch (error) {
    return next(error);
  }
  if (trade.owner === req.decoded.username) {
    let error = new Error("Can't trade own books");
    error.status = 400;
    return next(error);
  } else {
    User.findById(req.decoded.id).exec((error, user) => {
      if (error) {
        return next(error);
      }
      if (!user.books[index].available) {
        let error = new Error("Your book is a pending another trade");
        error.status = 400;
        return next(error);
      }
      const id = mongoose.Types.ObjectId();
      user.trades.push({ sent: true, trade: trade, offer: offer, id: id });
      user.books[index].available = false;
      user.save();
      User.findOneAndUpdate(
        { username: trade.owner },
        {
          $push: { trades: { sent: false, trade: trade, offer: offer, id: id } }
        }
      ).exec((error, user) => {
        if (error) {
          return next(error);
        }
        res
          .status(200)
          .send({ success: ["Success! Trade request send to " + trade.owner] });
      });
    });
  }
});

router.put("/trade", mid.loggedIn, (req, res, next) => {
  try {
    var exchange = JSON.parse(decodeURIComponent(req.body.trade));
  } catch (error) {
    return next(error);
  }
  User.findById(req.decoded.id, (error, user1) => {
    if (error) {
      return next(error);
    }
    const id = exchange.id;
    const trade = Object.assign({}, exchange.trade);
    const offer = Object.assign({}, exchange.offer);
    const trades1 = user1.trades.filter(
      trade => String(trade.id) !== String(id)
    );
    const books1 = user1.books.filter(book => book.title !== trade.title);
    offer.owner = user1.username;
    books1.push(offer);
    user1.books = books1;
    user1.trades = trades1;
    user1.save((error, user1) => {
      if (error) {
        return next(error);
      }
      User.findOne({ username: exchange.offer.owner }, (error, user2) => {
        if (error) {
          return next(error);
        }
        const trades2 = user2.trades.filter(
          trade => String(trade.id) !== String(id)
        );
        const books2 = user2.books.filter(book => book.title !== offer.title);
        trade.owner = user2.username;
        books2.push(trade);
        user2.books = books2;
        user2.trades = trades2;
        user2.save((error, user3) => {
          if (error) {
            return next(error);
          }
          res.status(200).send({
            books: user1.books,
            trades: user1.trades,
            success: ["Success! You've swapped books with " + user3.username]
          });
        });
      });
    });
  });
});

router.delete("/trade", mid.loggedIn, (req, res, next) => {
  try {
    var trade = JSON.parse(decodeURIComponent(req.body.trade));
  } catch (error) {
    return next(error);
  }
  User.findOneAndUpdate(
    { _id: req.decoded.id },
    { $pull: { trades: { id: mongoose.Types.ObjectId(trade.id) } } },
    { new: true },
    (error, user1) => {
      if (error) {
        return next(error);
      }
      user1.books.forEach(book => {
        if (book.title === trade.offer.title) {
          book.available = true;
        }
      });
      user1.save((error, user1) => {
        User.findOneAndUpdate(
          { username: trade.offer.owner },
          { $pull: { trades: { id: mongoose.Types.ObjectId(trade.id) } } },
          { new: true },
          (error, user2) => {
            if (error) {
              return next(error);
            }
            user2.books.forEach(book => {
              if (book.title === trade.offer.title) {
                book.available = true;
              }
            });
            user2.save((error, user2) => {
              res.status(200).send({
                books: user1.books,
                trades: user1.trades,
                success: ["Trade cancelled and removed from queue"]
              });
            });
          }
        );
      });
    }
  );
});

module.exports = router;
