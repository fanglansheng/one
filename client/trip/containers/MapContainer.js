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
  fetchCreateActivity
} from '../tripActions';

import {
	makeGetTrip,
	makeGetCenter
} from '../selector.js';

import TripMap from '../components/TripMap';



const mapStateToProps = (state, props) => {
	const {
		selectedPlace,
	} = state;

	if(!state.trips.allItems.length){
		return {
			places: [],
			selectedPlace,
			center: window.currentLocation,
			defaultZoom: 5
		}
	}

	const getTrip = makeGetTrip(props.tripId);
	const trip = getTrip(state);

	const activityPlaces = trip.activities.map(a => a.place);

	const getCenter = makeGetCenter(props.tripId);
	const center = getCenter(state) || window.currentLocation;

	return {
		...props,
		activityPlaces,
		selectedPlace,
		center: center
		// defaultZoom: 
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const {tripId} = ownProps;
	return {
		selectMarker : (place) => dispatch(selectMarker(place)),
		addActivity : (activity ) => {
			dispatch(fetchCreateActivity(tripId, activity));
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TripMap);