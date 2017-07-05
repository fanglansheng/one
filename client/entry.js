'use strict';

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import thunkMiddleware from 'redux-thunk';
// import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';

// import {
//   BrowserRouter as Router,
//   Route,
//   Link
// } from 'react-router-dom';

import rootReducer from './reducer';

import App from './containers/App';
// import TripMap from './components/TripMap';


// import 'react-dates/lib/css/_datepicker.css';
import './scss/mapStyle.scss';

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
		<App/>
	</Provider>,
	document.getElementById('app')
);