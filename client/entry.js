'use strict';

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import thunkMiddleware from 'redux-thunk';
// import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';

// // import {
// //   BrowserRouter as Router,
// //   Route,
// //   Link
// // } from 'react-router-dom';

// import rootReducer from './reducer';

// import App from './components/App';
// import Home from './components/Home';

// import DataApp from '../file/containers/App';
// import History from '../file/containers/History';
// import Content from '../file/containers/Content';


// import Download from './components/Download';


// import org from '../organization';
// const { MembersContainer } = org;

// import PolicyApp from '../policy/components/App'; 


// import 'react-dates/lib/css/_datepicker.css';
// import '../../scss/main.scss';

// const loggerMiddleware = createLogger();

// const store = createStore(
//   rootReducer,
//   applyMiddleware(
//     thunkMiddleware, // lets us dispatch() functions
//     loggerMiddleware // neat middleware that logs actions
//   )
// );

// window.app = document.getElementById('app');

// ReactDOM.render(
// 	<Provider store={store}>
// 		<Router history={hashHistory}>
// 			<Route path="/" component={App}>
// 				<IndexRoute component={Home}/>
// 				<Route path="fs/:queryType" component={DataApp}/>
// 				<Route path="policy" component={PolicyApp}/>
// 				<Route path="experiments" component={null}/>
// 			</Route>

// 			<Route path="org/:orgName" component={App}>
// 				<IndexRoute component={MembersContainer}/>
// 				<Route path="fs/:queryType" component={DataApp}/>
// 				<Route path="policy" component={PolicyApp}/>
// 				<Route path="experiments" component={null}/>
// 			</Route>

// 		</Router>
// 	</Provider>,
// 	window.app
// );


ReactDOM.render(
  'Hello World',
  document.getElementById('app')
);

// ReactDOM.render(
//   <Nav/>,
//   document.getElementById('nav')
// );