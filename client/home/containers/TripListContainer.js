/***** component items */
import { default as React, PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

import trip from "../../trip";
const { getAllTrips } = trip.selector;
const {
  fetchAllTripsIfNeeded,
  fetchCreateTrip,
  fetchDeleteTrip,
  selectTrip
} = trip.action;

import TripList from "../components/TripList";

const mapStateToProps = (state, props) => {
  const { isFetching } = state.trips;

  return {
    isFetching,
    trips: getAllTrips(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAllTrips: () => dispatch(fetchAllTripsIfNeeded()),
    selectTrip: tripData => dispatch(selectTrip(tripData)),
    deleteTrip: tripId => dispatch(fetchDeleteTrip(tripId)),
    addTrip: tripData => dispatch(fetchCreateTrip(tripData))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TripList);
