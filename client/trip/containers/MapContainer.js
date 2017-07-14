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

import { makeGetTrip } from '../selector.js';

import TripMap from '../components/TripMap';



const mapStateToProps = (state, props) => {
	const {
		selectedPlace,
	} = state;

	const getTrip = makeGetTrip(props.tripId);
	const trip = getTrip(state);
	if(!trip){
		return {
			places: [],
			selectedPlace
		}
	}
	const places = trip.activities.map(a => a.place);
	return {
		...props,
		places,
		selectedPlace,
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