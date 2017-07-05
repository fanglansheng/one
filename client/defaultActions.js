'use strict';
import fetch from 'isomorphic-fetch';
import { ActionTypes } from './constants';


const selectMarker = (place) => {
	return {
		type: ActionTypes.CLICK_MARKER,
		place
	}
};

export const fetchCurrentLocation = () => dispatch => {
	if (navigator.geolocation) {
		const handleSuccess = (position) => {
			const pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			console.log(pos);

			// map.setCenter(pos);
		};

		const handleError = () => {
			console.log("Error: The Geolocation service failed.");
		};

		navigator.geolocation.getCurrentPosition(handleSuccess, handleError);

	} else {
		console.log('Error: Your browser doesn\'t support geolocation.');
	}

};

export const getPlaceDetail = (place) => dispatch => {
	dispatch(selectMarker(place));
}