"use strict";
import { combineReducers } from "redux";
import core from "../../core";
const { ActionTypes, ReducerFactory, mapKeysToIds } = core.constants;

const { createCurrentIdWithName } = core.ReducerFactory;

const allItems = (state = [], action) => {
  const { type } = action;
  const activityIds = mapKeysToIds(action.activities);

  switch (type) {
    case ActionTypes.RECEIVE_TRIPS:
      return activityIds || state;

    case ActionTypes.ADD_TRIP:
      return [...state, ...activityIds];

    case ActionTypes.DEL_TRIP:
      const remainIds = action.activityIds.filter(d => !state.includes(d));
      return remainIds;

    case ActionTypes.ADD_ACTIVITY:
      return [...state, action.activity.id];

    case ActionTypes.DEL_ACTIVITY:
      return state.filter(id => id != action.activityId);

    default:
      return state;
  }
};

const byId = (state = {}, action) => {
  const { type } = action;
  switch (type) {
    case ActionTypes.RECEIVE_TRIPS:
      // return state to prevent action.activities is undefined
      return action.activities || state;

    case ActionTypes.ADD_TRIP:
      return {
        ...state,
        ...action.activities
      };

    case ActionTypes.ADD_ACTIVITY:
      return {
        ...state,
        [action.activity.id]: action.activity
      };

    case ActionTypes.DEL_ACTIVITY:
      return Object.keys(state).reduce((result, key) => {
        if (key !== action.activityId.toString()) {
          result[key] = state[key];
        }
        return result;
      }, {});

    default:
      return state;
  }
};

export default combineReducers({
  currentActivityId: createCurrentIdWithName("ACTIVIYT"),
  allItems,
  byId
});
