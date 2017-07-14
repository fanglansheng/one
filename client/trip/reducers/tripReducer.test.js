import core from '../../core';
const {
	ActionTypes,
	ReducerFactory
} = core.constants;

import trips from './tripReducer';
import expect from 'expect';

const initialState = {
	isFetching: false,
	didInvalidate: false,
	currentTripId: -1,
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

describe('trip reducer', () => {

	test('should return initial state', () => {
		expect(trips(undefined, {})).toEqual(initialState);
	});

	test('should handle REQUEST_TRIPS', () => {
		expect(trips(undefined, {
			type: ActionTypes.REQUEST_TRIPS
		})).toEqual({
			...initialState,
			isFetching: true
		});
	});

	test('should handle RECEIVE_TRIPS', () => {
		const normalizedTrips = {	'1': mockTrip };

		expect(trips(initialState, {
			type: ActionTypes.RECEIVE_TRIPS,
			allItems: [1],
			trips: normalizedTrips,
			activities: {'1': mockActivity}
		})).toEqual({
			...initialState,
			allItems: [1],
			byId: normalizedTrips
		});
	});

	test('should handle ADD_ACTIVITY, add new day to trip', () => {
		expect(
			trips({
				...initialState,
				allItems: [1],
				byId: {'1': mockTrip }
			}, {
				type: ActionTypes.ADD_ACTIVITY,
				activity: { ...mockActivity, id: 2},
				tripId: 1
			})
		).toEqual({
			...initialState,
			allItems:[1],
			byId:{
				'1': { 
					...mockTrip, 
					activities: [1,2]
				}
			}
		});
	});

	test('should handle DEL_ACTIVITY', () => {
		expect(
			trips({
				...initialState,
				allItems:[1],
				byId:{
					'1': { 
						...mockTrip, 
						activities: [1,2]
					}
				}
			}, {
				type: ActionTypes.DEL_ACTIVITY,
				tripId: 1,
				activityId: 2
			})
		).toEqual({
			...initialState,
				allItems:[1],
				byId:{
					'1': mockTrip
				}
		});
	});


});