"use strict";

const https = require("https");
const qs = require("../helpers/querystring");
const xmlparser = require("xml2js").parseString;

module.exports = {
  get: function(searchString) {
    if (searchString.includes("isbn:")) {
      searchString = searchString.split(":")[1];
    }
    var promise = new Promise((resolve, reject) => {
      var urlParams = {
        q: searchString,
        key: process.env.GOODREADS_KEY
      };

      var httpsOpts = {
        hostname: "www.goodreads.com",
        method: "GET",
        path: "/search?" + qs(urlParams)
      };
      var request = https.request(httpsOpts, response => {
        var string = "";

        response.setEncoding("utf-8");
        response.on("data", chunk => {
          string += chunk;
        });
        response.on("end", () => {
          try {
            var jsonData = {};
            xmlparser(string, { explicitArray: false }, (err, result) => {
              jsonData = result.GoodreadsResponse.search;
            });
          } catch (error) {
            reject(error);
          }
          if (response.statusCode === 200) {
            resolve(jsonData);
          } else {
            reject(jsonData);
          }
        });
      });
      request.on("error", error => {
        reject(error);
      });
      request.end();
    });
    return promise;
  },
  getDetails: function(searchString) {
    var promise = new Promise((resolve, reject) => {
      var urlParams = {
        key: process.env.GOODREADS_KEY
      };

      var httpsOpts = {
        hostname: "www.goodreads.com",
        method: "GET",
        path: "/book/show/" + searchString + ".xml?" + qs(urlParams)
      };
      var request = https.request(httpsOpts, response => {
        var string = "";

        response.setEncoding("utf-8");
        response.on("data", chunk => {
          string += chunk;
        });
        response.on("end", () => {
          try {
            var jsonData = {};
            xmlparser(string, { explicitArray: false }, (err, result) => {
              jsonData = result.GoodreadsResponse.book;
            });
          } catch (error) {
            reject(error);
          }
          if (response.statusCode === 200) {
            resolve(jsonData);
          } else {
            reject(jsonData);
          }
        });
      });
      request.on("error", error => {
        reject(error);
      });
      request.end();
    });
    return promise;
  }
};
