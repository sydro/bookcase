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
        key: "6xTMWfTYxndlJBSWFlHGbg"
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
            console.log(error);
            reject(error);
          }
          if (response.statusCode === 200) {
            resolve(jsonData);
          } else {
            console.log(jsonData);
            reject(jsonData);
          }
        });
      });
      request.on("error", error => {
        console.log(error);
        reject(error);
      });
      request.end();
    });
    return promise;
  }
};
