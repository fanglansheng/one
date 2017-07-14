import keyMirror from 'keymirror';

export const Host = 'http://localhost:5002';

export const ActionTypes = keyMirror({
	// place
	ADD_PLACE: null,
	RMV_PLACE: null,
	
	CLICK_MARKER: null,

	// trip
	SET_CURRENT_TRIP: null,
	REQUEST_TRIPS: null,
	RECEIVE_TRIPS: null,
	ADD_TRIP: null,
	DEL_TRIP: null,
	EDIT_TRIP: null,

	// activity
	SET_CURRENT_ACTIVITY: null,
	ADD_ACTIVITY: null,
	DEL_ACTIVITY: null,
	EDIT_ACTIVITY: null,

	SHOW_PLACE_SEARCH: null

});

export const DefaultCenter = {
	lat: 39.9375346,
	lng: 115.837023
};

export const ReducerFactory = {
	createToggle : (toggleType = '') => (state = false, action) => {
		return action.type == toggleType;
	},

	createCurrentIdWithName : (name = '') => (state = -1, action) => {
		if(action.type == `SET_CURRENT_${name}`){
			return action.id;
		} else {
			return state;
		}
	}
};

export const handleResponse = response => {
	if(response.ok) {
		return response.json();
	}
	throw new Error('Network response was not ok.');
};


export const shouldFetch = (state, type) => {
	const content = state[type];
	if (!content.allItems.length) {
		return true;
	} else if (content.isFetching) {
		return false;
	} else {
		return content.didInvalidate;
	}
};

export const mapKeysToIds = dic => {
	if(!dic) return [];
	return Object.keys(dic).map(d => parseInt(d));
}
