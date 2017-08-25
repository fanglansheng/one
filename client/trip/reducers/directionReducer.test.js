import core from "../../core";
const { ActionTypes } = core.constants;

import directions from "./directionReducer";
import expect from "expect";

const initialState = {
  allItems: [],
  byDate: {}
};

describe("activity reducer", () => {
  test("should return initial state", () => {
    expect(directions(undefined, {})).toEqual(initialState);
  });

  test("should handle ADD_DIRECTION", () => {
    expect(
      directions(initialState, {
        type: ActionTypes.ADD_DIRECTION,
        date: "2017-01-01",
        directions: { from: "sdf", to: "sadf" }
      })
    ).toEqual({
      allItems: ["2017-01-01"],
      byId: { "2017-01-01": { from: "sdf", to: "sadf" } }
    });
  });

  test("should handle DEL_DIRECTION", () => {
    expect(
      directions(
        {
          allItems: ["2017-01-01"],
          byId: { "2017-01-01": { from: "sdf", to: "sadf" } }
        },
        {
          type: ActionTypes.DEL_ACTIVITY,
          date: "2017-01-01"
        }
      )
    ).toEqual(initialState);
  });
});
