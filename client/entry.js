import "babel-polyfill";

import React from "react";
import ReactDOM from "react-dom";
import thunkMiddleware from "redux-thunk";
import { Router, Route, IndexRoute, hashHistory } from "react-router";

import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import { Provider } from "react-redux";

// import {
//   BrowserRouter as Router,
//   Route,
//   Link
// } from 'react-router-dom';
import rootReducer from "./core/reducer";

import rootApp from "./home";
const { Home, TripListContainer } = rootApp;

import trip from "./trip";
const { TripContainer } = trip;

import "rc-time-picker/assets/index.css";
import "react-dates/lib/css/_datepicker.css";
import "./scss/mapStyle.scss";

const loggerMiddleware = createLogger();

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
);

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={Home}>
        <IndexRoute component={TripListContainer} />
        <Route path="trip" component={TripListContainer} />
        <Route path="map" component={null} />
      </Route>
      <Route path="/trip/:tripId" component={TripContainer} />
    </Router>
  </Provider>,
  document.getElementById("app")
);
