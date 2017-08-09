"use strict";
import fetch from "isomorphic-fetch";
import { normalize } from "normalizr";
import * as schema from "./schema";

import core from "../core";
const { ActionTypes, Host, handleResponse, shouldFetch } = core.constants;

export const setTravelMode = mode => ({
  type: ActionTypes.SET_TRAVEL_MODE,
  mode
});

export const setActivityFormVisable = visable => ({
  type: ActionTypes.SHOW_PLACE_SEARCH,
  visable
});

export const selectMarker = place => {
  return {
    type: ActionTypes.CLICK_MARKER,
    place
  };
};

const selectActivity = activityId => ({
  type: ActionTypes.SET_CURRENT_ACTIVITY,
  id: activityId
});

const addActivity = (tripId, activity) => ({
  type: ActionTypes.ADD_ACTIVITY,
  tripId,
  activity
});

// activity is the data returned from server
const editActivity = (tripId, activity) => ({
  type: ActionTypes.EDIT_ACTIVITY,
  tripId,
  activity
});

export const fetchCreateActivity = (tripId, placeId) => dispatch => {
  const init = {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ place_id: placeId })
  };

  return fetch(`${Host}/trip/${tripId}/activity`, init)
    .then(handleResponse)
    .then(json => {
      dispatch(addActivity(tripId, json.activity));
    });
};

export const fetchEditActivity = (tripId, itId, postData) => dispatch => {
  const init = {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(postData)
  };

  return fetch(`${Host}/activity/${itId}`, init)
    .then(handleResponse)
    .then(json => {
      dispatch(editActivity(tripId, json.activity));
    });
};

export const fetchDeleteActivity = (tripId, activityId) => dispatch => {
  const init = { method: "DELETE" };

  return fetch(`${Host}/activity/${activityId}`, init)
    .then(response => {
      if (response.ok) {
        console.log(`Delete collection ${activityId} success`);
        return;
      }
      throw new Error("Network response was not ok.");
      // dispatch invalid
    })
    .then(
      dispatch({
        type: ActionTypes.DEL_ACTIVITY,
        activityId,
        tripId
      })
    );
};

////////////////trips

export const selectTrip = tripId => ({
  type: ActionTypes.SET_CURRENT_TRIP,
  id: tripId
});

const receiveTrips = (allItems, entities) => ({
  type: ActionTypes.RECEIVE_TRIPS,
  allItems,
  ...entities
});

const addTrip = trip => ({
  type: ActionTypes.ADD_TRIP,
  trip
});

export const fetchTripIfNeeded = tripId => (dispatch, getState) => {
  if (shouldFetch(getState(), "trips")) {
    return dispatch(fetchTrip(tripId));
  } else {
    return Promise.resolve();
  }
};

const fetchTrip = tripId => dispatch => {
  dispatch({ type: ActionTypes.REQUEST_TRIPS });

  return fetch(`${Host}/trip/${tripId}/activity`, {})
    .then(handleResponse)
    .then(json => {
      const data = normalize(json.trip, schema.trip);
      dispatch(receiveTrips([data.result], data.entities));
      dispatch(selectTrip(tripId));

      const trip = data.entities.trips[tripId];
      dispatch(selectActivity(trip.activities[0]));
    });
};

export const fetchAllTripsIfNeeded = () => (dispatch, getState) => {
  if (shouldFetch(getState(), "trips")) {
    return dispatch(fetchAllTrips());
  } else {
    return Promise.resolve();
  }
};

// GET /trip : get all trips
const fetchAllTrips = () => dispatch => {
  dispatch({ type: ActionTypes.REQUEST_TRIPS });
  return fetch(`${Host}/trip`, {}).then(handleResponse).then(json => {
    const data = normalize(json.trips, schema.tripList);
    if (!data.result.length) {
      dispatch(
        receiveTrips([], {
          trips: {},
          activities: {}
        })
      );
      return;
    }
    dispatch(receiveTrips(data.result, data.entities));

    // dispatch(selectTrip(data.result[0]));
  });
};

// POST /trip: create a trip
export const fetchCreateTrip = postData => dispatch => {
  const init = {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(postData)
  };

  return fetch(`${Host}/trip`, init).then(handleResponse).then(json => {
    dispatch({
      type: ActionTypes.ADD_TRIP,
      trip: json,
      tripId: json.id
    });
  });
};

export const fetchDeleteTrip = tripId => dispatch => {
  const init = { method: "DELETE" };
  return fetch(`${Host}/trip/${tripId}`, init)
    .then(response => {
      if (response.ok) {
        console.log(`Delete collection ${activityId} success`);
        return;
      }
      throw new Error("Network response was not ok.");
      // dispatch invalid
    })
    .then(json => {
      dispatch({
        type: ActionTypes.DEL_TRIP,
        tripId
      });
    });
};
