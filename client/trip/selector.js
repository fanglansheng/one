import moment from "moment";
import { createSelector } from "reselect";
import { utcToLocal } from "../core/constants";

/////////// Basic Selectors
const getTripsById = state => state.trips.byId;
const getTripIdList = state => state.trips.allItems;

const getActivitiesById = state => state.activities.byId;
const getActivityIdList = state => state.activities.allItems;
const getActivityItem = (state, props) =>
  state.activities.byId[props.activityId];

const getDirectionsById = state => state.directions.byDates;
const getDirectionIdList = state => state.directions.allItems;

///////////// Utility Functions
// construct to map entity ids to object with content
const mapIdsToObjects = (allItemsSelector, byIdSelector) =>
  createSelector([allItemsSelector, byIdSelector], (allItems, byId) =>
    allItems.map(id => byId[id])
  );

///////////// Composed Selectors

// Get all activity objects.
export const getAllActivities = mapIdsToObjects(
  getActivityIdList,
  getActivitiesById
);

// get all trips without detail
export const getAllTrips = mapIdsToObjects(getTripIdList, getTripsById);

export const getAllDirections = mapIdsToObjects(
  getDirectionIdList,
  getDirectionsById
);

// Generate a selector to get a trip by Id
export const makeGetTrip = tripId =>
  createSelector(
    [state => state.trips.byId[tripId], getActivitiesById],
    (trip, activitiesById) => {
      if (!trip) return null;
      const activities = trip.activities.map(id => activitiesById[id]);
      return {
        ...trip,
        activities
      };
    }
  );

export const makeGetClassifiedActivities = tripId =>
  createSelector(
    [state => state.trips.byId[tripId], getActivitiesById],
    (trip, activitiesById) => {
      if (!trip) return [];
      const activities = trip.activities.map(id => activitiesById[id]);
      let dateDic = { Unassigned: [] };
      activities.forEach(activity => {
        const offset = activity.place.utc_offset;
        const date = utcToLocal(activity.startTime, offset);

        const dateText = date ? date.format("YYYY/MM/DD") : "Unassigned";
        if (dateText in dateDic) {
          dateDic[dateText].push(activity);
        } else {
          dateDic[dateText] = [activity];
        }
      });

      const dates = Object.keys(dateDic);
      let result = dates.map(key => ({
        date: key,
        activities: dateDic[key]
      }));
      return result;
    }
  );
