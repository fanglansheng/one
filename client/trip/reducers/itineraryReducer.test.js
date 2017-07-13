import core from '../../core';
const {
	ActionTypes,
	ReducerFactory
} = core.constants;

import itineraries from './itineraryReducer';
import expect from 'expect';

const initialState = {
	currentItineraryId: -1,
	allItems: [],
	byId: {},
};

const mockItineray = {
	"id": 1, 
	"date": "2017-01-01", 
	"trip_id": 1,
	"memo" : 'dd'
};

const mockTrip= {
	"name": 'Hello', 
	"memo": 'momo',
	"id": 1, 
	"itineraries": [1]
};

describe('itineray reducer', () => {

	test('should return initial state', () => {
		expect(itineraries(undefined, {})).toEqual(initialState);
	});

	test('should handle RECEIVE_TRIPS', () => {

		expect(itineraries(initialState, {
			type: ActionTypes.RECEIVE_TRIPS,
			allItems: [1],
			trips: {'1': mockTrip },
			itineraries: {'1': mockItineray}
		})).toEqual({
			...initialState,
			allItems: [1],
			byId: {'1': mockItineray}
		});
	});

	test('should handle ADD_DAY, add new day to trip', () => {
		expect(
			itineraries(initialState, {
				type: ActionTypes.ADD_DAY,
				itinerary: mockItineray,
				itineraryId: 1,
				tripId: 1
			})
		).toEqual({
			...initialState,
			allItems:[1],
			byId : { '1': mockItineray }
		});
	});

	test('should handle DEL_DAY', () => {
		expect(
			itineraries({
				...initialState,
				allItems:[1],
				byId : { '1': mockItineray }
			}, {
				type: ActionTypes.DEL_DAY,
				tripId: 1,
				itineraryId: 1
			})
		).toEqual(initialState);
	});


});