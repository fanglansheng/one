'use strict';
import fetch from 'isomorphic-fetch';
import { normalize } from 'normalizr';
import * as schema from './schema';

import core from '../core';
const {
	ActionTypes,
	Host,
	handleResponse,
	shouldFetch
} = core.constants;

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

export const selectTrip = (tripId) => ({
	type: ActionTypes.SET_CURRENT_TRIP,
	id: tripId
});

const receiveTrips = (allItems, entities) => ({
	type: ActionTypes.RECEIVE_TRIPS,
	allItems,
	...entities
});

const selectDay = itineraryId => ({
	type: ActionTypes.SET_CURRENT_DAY,
	id: itineraryId
});

const addDay = (tripId, itinerary) => ({
	type: ActionTypes.ADD_DAY,
	tripId,
	itinerary
});

// itinerary is the data returned from server
const editDay = (tripId, itinerary) => ({
	type: ActionTypes.EDIT_DAY,
	tripId,
	itinerary
});

export const fetchCreateDay = (tripId, postData) => dispatch => {
	const init = {
		method : 'POST',
		headers : new Headers({'Content-Type': 'application/json'}),
		body : JSON.stringify(postData)
	};

	return fetch(`${Host}/trip/${tripId}/itinerary`, init)
		.then(handleResponse)
		.then(json => {
			dispatch(addDay(tripId, json.initerary));
		});
};


export const fetchEditDay = (tripId, itId, postData) => dispatch => {
	const init = {
		method : 'POST',
		headers : new Headers({'Content-Type': 'application/json'}),
		body : JSON.stringify(postData)
	};

	return fetch(`${Host}/itinerary/${itId}`, init)
		.then(handleResponse)
		.then(json => {
			dispatch(editDay(tripId, json.initerary));
		});
};


export const fetchDeleteDay = (tripId, itineraryId) => dispatch => {
	const init = { method : 'DELETE' };

	return fetch(`${Host}/itinerary/${itineraryId}`, init)
		.then(response => {
			if(response.ok) {
				console.log(`Delete collection ${itineraryId} success`);
				return ;
			}
			throw new Error('Network response was not ok.');
			// dispatch invalid
		})
		.then(dispatch({
			type: ActionTypes.DEL_DAY,
			itineraryId,
			tripId
		}));
};


export const fetchTripIfNeeded = tripId => (dispatch, getState) => {
	if (shouldFetch(getState(), 'trips')) {
		return dispatch(fetchTrip(tripId));
	} else {
		return Promise.resolve();
	}
}

const fetchTrip = (tripId) => dispatch => {
	dispatch({ type: ActionTypes.REQUEST_TRIPS });

	return fetch(`${Host}/trip/${tripId}/itinerary`, {})
		.then(handleResponse)
		.then(json => {
			const data = normalize(json.trip, schema.trip);
			dispatch(receiveTrips([data.result], data.entities));
			dispatch(selectTrip(tripId));

			const trip = data.entities.trips[tripId];
			dispatch(selectDay(trip.itineraries[0]));
		});
};

export const addActivity = (itineraryId, data) => ({
	type: ActionTypes.ADD_ACTIVITY,
	itineraryId,
	data
});

export const fetchAddActivity = () => {};