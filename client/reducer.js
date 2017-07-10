'use strict';
import { combineReducers } from 'redux';
import { ActionTypes } from './constants';

const places = (state=[], action) => {
	const { type } = action;
	switch (type) {

		case ActionTypes.ADD_PLACE:
			return [...state, action.place];

		case ActionTypes.RMV_PLACE:
			return state.filter(place=> place!=action.place);

		default:
			return state;
	}
};

const selectedPlace = (state={}, action) => {
	const { type } = action;
	switch (type) {
		case ActionTypes.CLICK_MARKER:
			return action.place;
		default:
			return state;
	}
}

const trips = (state=[], action) => {
	const { type } = action;
	switch (type) {
		// case ActionTypes.SELECT_TRIP:
		case ActionTypes.RECEIVE_TRIPS:
			return action.trips;
			
		case ActionTypes.ADD_TRIP:
			return [...state, action.trip];

		// case ActionTypes.EDIT_TRIP:

		case ActionTypes.DEL_TRIP:
			return state.filter(trip=> trip!=action.trip);

		case ActionTypes.ADD_DAY:
			const {tripId, itinerary} = action;

			return state.map(trip => {
				if(trip.id !== tripId) {
					return trip;
				} else {
					return {
						...trip,
						itineraries : [trip.itineraries, itinerary]
					};
				}
			});

		default:
			return state;
	}
};

const defaultTrip = {
	id: 0,
	title: '',
	memo: '',
	itineraries : []
};
const currentTrip = (state=defaultTrip, action) => {
	if(action.type == ActionTypes.SELECT_TRIP){
		return action.trip;
	}
	return state;
};


const rootReducer = combineReducers({
	trips,
	places,
	selectedPlace,
	currentTrip
});

export default rootReducer;