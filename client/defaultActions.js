'use strict';
import fetch from 'isomorphic-fetch';
import {
	ActionTypes,
	Host
} from './constants';


export const selectMarker = (place) => {
	return {
		type: ActionTypes.CLICK_MARKER,
		place
	}
};

export const addPlaceToTrip = (place, trip) => {
	return {
		type: ActionTypes.ADD_PLACE,
		place,
		trip
	};
};

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
		.then(response => {
			if(response.ok) {
				return response.json();
			}
			throw new Error('Network response was not ok.');
		})
		.then(json => {
			dispatch(receiveTrips(json));
		});
};

export const fetchTrip = (tripId) => dispatch => {
	return fetch(`${Host}/trip/${tripId}/itinerary`, {})
		.then(response => {
			if(response.ok) {
				return response.json();
			}
			throw new Error('Network response was not ok.');
		})
		.then(json => {
			dispatch(selectTrip(json.trip));
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
		.then(response => {
			if(response.ok) {
				return response.json();
			}
			throw new Error('Network response was not ok.');
		})
		.then(json => {
			dispatch(addTrip(json));
		});
};
