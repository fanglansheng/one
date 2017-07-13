'use strict';
import { combineReducers } from 'redux';
import core from '../../core';
const {
	ActionTypes,
	ReducerFactory,
	mapKeysToIds
} = core.constants;

const {
	createToggle,
	createCurrentIdWithName
} = ReducerFactory;


const allItems = (state=[], action) => {
	const { type } = action;
	const itineraryIds = mapKeysToIds(action.itineraries);

	switch (type) {
		case ActionTypes.RECEIVE_TRIPS:
			return itineraryIds || state;

		case ActionTypes.ADD_TRIP:
			return [...state, ...itineraryIds];

		case ActionTypes.DEL_TRIP:
			const remainIds = action.itineraryIds.filter(d => !state.includes(d));
			return remainIds;

		case ActionTypes.ADD_DAY:
			return [
				...state,
				action.itineraryId
			];

		case ActionTypes.DEL_DAY:
			return state.filter(id => id != action.itineraryId);

		default:
			return state;
	}
};

const addActivity = (state, action) => {
	const { itineraryId, activityId } = action;
	const itinerary = state[itineraryId];
	return {
		...state,
		[itineraryId] : {
			...itinerary,
			activities: itinerary.activities.concat(activityId)
		}
	};
};

const delActivity = (state, action) => {
	const { itineraryId, activityId } = action;
	const itinerary = state[itineraryId];
	const remainIds = itinerary.activities.filter(id => id != action.activityId);
	return {
		...state,
		[itineraryId] : {
			...itinerary,
			activities: remainIds
		}
	};
};

const byId = (state={}, action) => {
	const { type } = action;
	switch (type) {
		case ActionTypes.RECEIVE_TRIPS:
			// return state to prevent action.itineraries is undefined
			return action.itineraries || state;
		
		case ActionTypes.ADD_TRIP:
			return {
				...state,
				...action.itineraries
			};

		case ActionTypes.ADD_DAY:
			return {
				...state,
				[action.itineraryId]: action.itinerary
			};

		case ActionTypes.DEL_DAY:
			return Object.keys(state).reduce((result, key) => {
				if (key !== action.itineraryId.toString()) {
					result[key] = state[key];
				}
				return result;
			}, {});

		case ActionTypes.ADD_ACTIVITY:
			return addActivity(state, action);

		case ActionTypes.DEL_ACTIVITY:
			return delActivity(state, action);
		default:
			return state;
	}
};

export default combineReducers({
	currentItineraryId : createCurrentIdWithName('DAY'),
	allItems,
	byId
});
