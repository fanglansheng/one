import keyMirror from "keymirror";

export const Host = "http://localhost:5002";

export const ActionTypes = keyMirror({
  // place
  ADD_PLACE: null,
  RMV_PLACE: null,

  // map
  GET_ROUTE: null,
  CLICK_MARKER: null,
  SET_TRAVEL_MODE: null,

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

export const VisitType = {
  TRANSIT: { value: "transit", icon: "" },
  DINNGING: { value: "dinning", icon: "" },
  HOTEL: { value: "hotel", icon: "" },
  TOUR: { value: "tour", icon: "" },
  ACTIVITY: { value: "activity", icon: "" },
  OTHER: { value: "other", icon: "" }
};

export const DefaultCenter = {
  lat: 39.9375346,
  lng: 115.837023
};

export const handleResponse = response => {
  if (response.ok) {
    return response.json();
  }
  throw new Error("Network response was not ok.");
};

export const shouldFetch = (state, type) => {
  const content = state[type];
  if (content.isFetching) {
    return false;
  } else if (!content.allItems.length) {
    return true;
  } else {
    return content.didInvalidate;
  }
};

export const mapKeysToIds = dic => {
  if (!dic) return [];
  return Object.keys(dic).map(d => parseInt(d));
};
