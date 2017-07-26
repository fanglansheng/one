'use strict';
import { combineReducers } from 'redux';
import core from '../../core';
const {
	ActionTypes,
	ReducerFactory
} = core.constants;

const {
	createToggle,
	createCurrentIdWithName
} = ReducerFactory;

const allItems = (state=[], action) => {
	const { type } = action;
	switch (type) {
		case ActionTypes.RECEIVE_TRIPS:
			return action.allItems;
			
		case ActionTypes.ADD_TRIP:
			return [
				...state,
				action.tripId
			];

		case ActionTypes.DEL_TRIP:
			return state.filter(tripId => tripId != action.tripId);

		default:
			return state;
	}
};

const addActivity = (state, action) => {
	const { tripId, activity } = action;
	const trip = state[tripId];
	return {
		...state,
		[tripId] : {
			...trip,
			activities: [
				activity.id,
				...trip.activities
			]
		}
	};
};

const deleteActivity = (state, action) => {
	const { tripId, activityId } = action;
	const trip = state[tripId];
	return {
		...state,
		[tripId] : {
			...trip,
			activities: trip.activities.filter(id => id != activityId)
		}
	};
};

const byId = (state={}, action) => {
	const { type } = action;
	switch (type) {
		case ActionTypes.RECEIVE_TRIPS:
			return action.trips;
		
		case ActionTypes.ADD_TRIP:
		case ActionTypes.EDIT_TRIP:
			return {
				...state,
				[action.tripId]: action.trip
			};

		case ActionTypes.DEL_TRIP:
			return Object.keys(state).reduce((result, key) => {
				if (key !== action.tripId) {
					result[key] = state[key];
				}
				return result;
			}, {});

		case ActionTypes.ADD_ACTIVITY:
			return addActivity(state, action);

		case ActionTypes.DEL_ACTIVITY:
			return deleteActivity(state, action);

		default:
			return state;
	}
};

export default combineReducers({
	currentTripId : createCurrentIdWithName('TRIP'),
	isFetching : createToggle(ActionTypes.REQUEST_TRIPS),
	didInvalidate : createToggle(ActionTypes.INVALIDATE_TRIPS),
	allItems,
	byId
});
