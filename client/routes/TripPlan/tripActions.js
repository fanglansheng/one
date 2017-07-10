'use strict';
import fetch from 'isomorphic-fetch';
import {
	ActionTypes,
	Host
} from '../../constants';


const addDay = (tripId, itinerary) => {
	return {
		type: ActionTypes.ADD_DAY,
		tripId,
		itinerary
	}
};

export const fetchCreateDay = (tripId, postData) => dispatch => {
	const init = {
		method : 'POST',
		headers : new Headers({'Content-Type': 'application/json'}),
		body : JSON.stringify(postData)
	};

	return fetch(`${Host}/trip/${tripId}/itinerary`, init)
		.then(response => {
			if(response.ok) {
				return response.json();
			}
			throw new Error('Network response was not ok.');
		})
		.then(json => {
			dispatch(addDay(tripId, json.initerary));
		});
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