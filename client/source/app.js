"use strict";

import "babel-polyfill";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, IndexRoute, Route, browserHistory } from "react-router";

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
