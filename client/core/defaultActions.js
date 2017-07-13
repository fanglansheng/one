'use strict';
import fetch from 'isomorphic-fetch';
import {
	ActionTypes,
	Host,
	handleResponse
} from './constants';

const receiveTrips = (json) => ({
	type: ActionTypes.RECEIVE_TRIPS,
	trips: json.trips
});

export const addTrip = (trip) => ({
	type: ActionTypes.ADD_TRIP,
	trip
});


export const selectTrip = (trip) => ({
	type: ActionTypes.SELECT_TRIP,
	trip
});

export const fetchCurrentLocation = () => {
	if (navigator.geolocation) {
		let pos = {};
		const handleSuccess = (position) => {
			pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			console.log(pos);
		};

		const handleError = () => {
			console.log("Error: The Geolocation service failed.");
		};

		navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
		return pos;

	} else {
		console.log('Error: Your browser doesn\'t support geolocation.');
	}
};


// GET /trip : get all trips
export const fetchAllTrips = () => dispatch => {
	dispatch({type: ActionTypes.REQUEST_TRIPS});

	return fetch(`${Host}/trip`, {})
		.then(handleResponse)
		.then(json => {
			dispatch(receiveTrips(json));
		});
};


// POST /trip: create a trip
export const fetchCreateTrip = (postData) => dispatch => {

	const init = {
		method : 'POST',
		headers : new Headers({'Content-Type': 'application/json'}),
		body : JSON.stringify(postData)
	};

	return fetch(`${Host}/trip`, init)
		.then(handleResponse)
		.then(json => {
			dispatch(addTrip(json));
		});
};

export const fetchDeleteTrip = tripId => dispatch => {
	const init = { method : 'DELETE' };
	return fetch(`${Host}/trip/${tripId}`, init)
		.then(handleResponse)
		.then(json => {
			dispatch({
				type: ActionTypes.DEL_TRIP,
				tripId
			});
		});
};
