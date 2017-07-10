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
  selectMarker
} from '../../../defaultActions';

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
		selectMarker : (place) => {
			dispatch(selectMarker(place));
		}
	};
}

export default connect(
	null,
	mapDispatchToProps
)(TripMap);