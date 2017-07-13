'use strict';
import { combineReducers } from 'redux';
import { ActionTypes } from './constants';
import tripReducer from '../trip/reducers/tripReducer';
import itineraryReducer from '../trip/reducers/itineraryReducer';
import activityReducer from '../trip/reducers/activityReducer';

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

export default combineReducers({
	trips: tripReducer,
	itineraries: itineraryReducer,
	activities: activityReducer,
	places,
	selectedPlace,
});
