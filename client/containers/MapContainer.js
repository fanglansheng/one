/***** component items */
'use strict';
import {
	default as React,
} from 'react';

import { 
	connect
} from 'react-redux';

import {
  // fetchCurrentLocation
  getPlaceDetail
} from '../defaultActions';

import TripMap from '../components/TripMap';


const mapStateToProps = (state, props) => {
	const {
		places,
		selectedPlace
	} = state;
	return {
		places,
		selectedPlace
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getPlaceDetail : (place) => {
			dispatch(getPlaceDetail(place));
		}
	};
}

export default connect(
	null,
	mapDispatchToProps
)(TripMap);