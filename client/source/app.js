"use strict";

import "babel-polyfill";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, IndexRoute, Route, browserHistory } from "react-router";
import fetch from "isomorphic-fetch";

import App from "./views/App";
import Home from "./views/Home/Home";
import Register from "./views/Register/Register";
import Login from "./views/Login/Login";
import Search from "./views/Search/Search";
import Library from "./views/Library/Library";
import Settings from "./views/Settings/Settings";
import Trade from "./views/Trade/Trade";
import Barcode from "./views/Barcode/Barcode";
import "style!./main.css";

// function refreshToken() {
//   console.log("test");
//   fetch("/api/token/refresh", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/x-www-form-urlencoded",
//       "X-Access-Token": localStorage.token
//     },
//     credentials: "same-origin",
//     body: `username=${localStorage.username}&user_id=${localStorage.userid}`
//   })
//     .then(response => response.json())
//     .then(json => {
//       if (json.error) {
//       } else {
//         localStorage.token = json.token;
//       }
//     });
// }
//
// function onChangeRefreshToken() {
//   fetch("/api/token/verify", {
//     method: "GET",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/x-www-form-urlencoded",
//       "X-Access-Token": localStorage.token
//     },
//     credentials: "same-origin"
//   })
//     .then(response => response.json())
//     .then(json => {
//       if (json.error) {
//         refreshToken();
//       } else {
//         if (json.exp <= (new Date().getTime() / 1000 + "").split(".")[0] - 60) {
//           refreshToken();
//         }
//       }
//     });
// }

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/browse" component={Library} />
      <Route path="/browse/:id" component={Trade} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/search" component={Search} />
      <Route path="/search/:isbn" component={Search} />
      <Route path="/settings" component={Settings} />
      <Route path="/barcode" component={Barcode} />
    </Route>
    <Route path="*" component={App} />
  </Router>,
  document.getElementById("app")
);
