'use strict';
import fetch from 'isomorphic-fetch';
import {
	ActionTypes,
	Host,
	handleResponse
} from './constants';



export const getCurrentLocation = () => {
	if (navigator.geolocation) {
		let pos = {
			lat: 39.9375346,
			lng: 115.837023
		};
		const handleSuccess = (position) => {
			pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			console.log(pos);
		};

		const handleError = () => {
			console.log("Error: The Geolocation service failed.");
		};

		navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
		return pos;

	} else {
		console.log('Error: Your browser doesn\'t support geolocation.');
	}
};


