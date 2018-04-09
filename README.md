# Personal Library

Forked from [jmcilhargey/book-trader](https://github.com/jmcilhargey/book-trader)

## Overview

A textbook trading app that allows to search for books with the Google Books API/Goodreads API and add them to their collection. Users can browse, search, and sort the student library Users can edit their personal settings and mark books as available / unavailable. Authentication done with JWTs and a hash / salt based encryption strategy.

**NB**: You need a Google Books API and GoodReads API to set in .env file

## Install

The following must be installed to run the project:

* Node
* NPM
* MongoDB

And to install the application dependencies:

    $ npm install

## Run

To access the Google Books API, go to the Google Developer Console at https://console.developers.google.com/

Search for the Google Books API and then click Enable. Under Credentials, copy the API key and save as GOOGLE_KEY environment variable.

To access the Goodreads API, go to the Goodreads API page at https://www.goodreads.com/api/keys and save generated key in environment variable.

Create a secret key for the JWT_SECRET environment variable. This can be done with Node from the command line using the crypto library:

    node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"

Start up a local MongoDB instance or enter a database URI in the MONGO_URI environment variable.

To start the app:

    $ npm run start

Navigate to

    http://localhost:3000

## Docker run

To run app with docker:

* Create .env file with these variables:

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
MONGO_URI=mongodb://username:password@database:27017/bookcase
JWT_SECRET=...
GOODREADS_KEY=...
GOODREADS_SECRET=...
TITLE=...
FOOTER=...
```

* Run docker-compose

```
cd docker
docker-compose up -d
```

## Test

To run the test suite, type the command:

    $ npm test

## License

MIT License
