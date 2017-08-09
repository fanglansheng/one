import { combineReducers } from "redux";
import { ActionTypes } from "./constants";
import tripReducer from "../trip/reducers/tripReducer";
import activityReducer from "../trip/reducers/activityReducer";

const selectedPlace = (state = null, action) => {
  const { type } = action;
  switch (type) {
    case ActionTypes.CLICK_MARKER:
      return action.place;
    default:
      return state;
  }
};

export default combineReducers({
  trips: tripReducer,
  activities: activityReducer,
  selectedPlace
});
