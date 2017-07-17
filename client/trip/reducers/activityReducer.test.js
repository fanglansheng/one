import core from '../../core';
const {
	ActionTypes,
	ReducerFactory
} = core.constants;

import activities from './activityReducer';
import expect from 'expect';

const initialState = {
	currentActivityId: -1,
	allItems: [],
	byId: {},
};

const mockActivity = {
	"id": 1, 
	"date": "2017-01-01", 
	"trip_id": 1,
	"memo" : 'dd'
};

const mockTrip= {
	"name": 'Hello', 
	"memo": 'momo',
	"id": 1, 
	"activities": [1]
};

describe('activity reducer', () => {

	test('should return initial state', () => {
		expect(activities(undefined, {})).toEqual(initialState);
	});

	test('should handle RECEIVE_TRIPS', () => {

		expect(activities(initialState, {
			type: ActionTypes.RECEIVE_TRIPS,
			allItems: [1],
			trips: {'1': mockTrip },
			activities: {'1': mockActivity}
		})).toEqual({
			...initialState,
			allItems: [1],
			byId: {'1': mockActivity}
		});
	});

	test('should handle ADD_ACTIVITY, add new one to trip', () => {
		expect(
			activities(initialState, {
				type: ActionTypes.ADD_ACTIVITY,
				activity: mockActivity,
				tripId: 1
			})
		).toEqual({
			...initialState,
			allItems:[1],
			byId : { '1': mockActivity }
		});
	});

	test('should handle DEL_ACTIVITY', () => {
		expect(
			activities({
				...initialState,
				allItems:[1],
				byId : { '1': mockActivity }
			}, {
				type: ActionTypes.DEL_ACTIVITY,
				tripId: 1,
				activityId: 1
			})
		).toEqual(initialState);
	});


});