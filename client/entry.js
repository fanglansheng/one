'use strict';

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import thunkMiddleware from 'redux-thunk';
import {
	Router,
	Route,
	IndexRoute,
	hashHistory
} from 'react-router';

import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';

// import {
//   BrowserRouter as Router,
//   Route,
//   Link
// } from 'react-router-dom';
import rootReducer from './core/reducer';

import rootApp from './home';
const { Home, TripBox } = rootApp;

import trip from './trip';
const { TripPlan } = trip;

import 'rc-time-picker/assets/index.css';
import 'react-dates/lib/css/_datepicker.css';
import './scss/mapStyle.scss';

const loggerMiddleware = createLogger();

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
);

// set default location
window.currentLocation = {
	lat: 39.9375346,
	lng: 115.837023
};

// get current location
if (navigator.geolocation) {
  const handleSuccess = position => {
    window.currentLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    console.log('----');
  };

  const handleError = () => {
    console.error("Error: The Geolocation service failed.");
  };

  navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
} else {
  console.error('Error: Your browser doesn\'t support geolocation.');
}

ReactDOM.render(
	<Provider store={store}>
		<Router history={hashHistory}>
			<Route path="/" component={Home}>
				<IndexRoute component={TripBox}/>
				<Route path="trip" component={TripBox}/>
				<Route path="map" component={null}/>
			</Route>
			<Route path="/trip/:tripId" component={TripPlan}/>
		</Router>
	</Provider>,
	document.getElementById('app')
);