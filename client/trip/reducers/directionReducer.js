import { combineReducers } from "redux";
import core from "../../core";
const { ActionTypes } = core.constants;

const allItems = (state = [], action) => {
  const { type, date } = action;
  switch (type) {
    case ActionTypes.ADD_DIRECTION:
      return [...state, date];

    case ActionTypes.RMV_DIRECTION:
      return state.filter(d => d != date);

    default:
      return state;
  }
};

const byDates = (state = {}, action) => {
  const { type, date, routes } = action;
  switch (type) {
    case ActionTypes.ADD_DIRECTION:
      return { ...state, [date]: routes };

    case ActionTypes.RMV_DIRECTION:
      return Object.keys(state).reduce((result, key) => {
        if (key !== date) {
          result[key] = state[key];
        }
        return result;
      }, {});

    default:
      return state;
  }
};

export default combineReducers({
  allItems,
  byDates
});
