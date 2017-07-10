import keyMirror from 'keymirror';

export const Host = 'http://localhost:5002';

export const ActionTypes = keyMirror({
	// place
	ADD_PLACE: null,
	RMV_PLACE: null,
	
	CLICK_MARKER: null,

	// trip
	REQUEST_TRIPS: null,
	RECEIVE_TRIPS: null,
	
	SELECT_TRIP: null,
	ADD_TRIP: null,
	DEL_TRIP: null,
	EDIT_TRIP: null,

	// itinerary
	ADD_DAY: null,
	DEL_DAY: null

});