/***** component items */
'use strict';
import {
	default as React,
} from 'react';

import { 
	connect
} from 'react-redux';

import {
  selectMarker,
  addActivity
} from '../tripActions';

import TripMap from '../components/TripMap';


const mapStateToProps = (state, props) => {
	const {
		places,
		selectedPlace,
		itineraries
	} = state;

	const {currentItineraryId} = itineraries;
	return {
		places,
		selectedPlace,
		currentItineraryId
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const {tripId} = ownProps;
	return {
		selectMarker : (place) => dispatch(selectMarker(place)),
		addActivity : (itineraryId, activity ) => {
			dispatch(addActivity(itineraryId, activity));
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TripMap);