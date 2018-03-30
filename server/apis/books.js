"use strict";

const https = require("https");
const qs = require("../helpers/querystring");

module.exports = {
  get: function(searchString) {
    var promise = new Promise((resolve, reject) => {
      var urlParams = {
        q: searchString
      };

      var httpsOpts = {
        hostname: "www.googleapis.com",
        method: "GET",
        path: "/books/v1/volumes?" + qs(urlParams)
      };
      var request = https.request(httpsOpts, response => {
        var string = "";

        response.setEncoding("utf-8");
        response.on("data", chunk => {
          string += chunk;
        });
        response.on("end", () => {
          try {
            var jsonData = JSON.parse(string);
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
