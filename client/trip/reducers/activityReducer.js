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
	const activityIds = mapKeysToIds(action.activities);

	switch (type) {
		case ActionTypes.RECEIVE_TRIPS:
			return activityIds;
			
		case ActionTypes.ADD_ACTIVITY:
			return [
				...state,
				action.activityId
			];

		case ActionTypes.DEL_ACTIVITY:
			return state.filter(id => id != action.activityId);

		default:
			return state;
	}
};

const byId = (state={}, action) => {
	const { type } = action;
	switch (type) {
		case ActionTypes.RECEIVE_TRIPS:
			// return state to prevent action.activities is undefined
			return action.activities || {};
		
		case ActionTypes.ADD_ACTIVITY:
		case ActionTypes.EDIT_ACTIVITY:
			return {
				...state,
				[action.activityId]: action.activity
			};

		case ActionTypes.DEL_ACTIVITY:
			return Object.keys(state).reduce((result, key) => {
				if (key !== action.activityId) {
					result[key] = state[key];
				}
				return result;
			}, state);

		default:
			return state;
	}
};

export default combineReducers({
	currentActivityId : createCurrentIdWithName('ACTIVITY'),
	allItems,
	byId
});
