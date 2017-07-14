import { createSelector } from 'reselect';

/////////// Basic Selectors
const getTripsById = (state) => state.trips.byId;
const getTripIdList = (state) => state.trips.allItems;


const getActivitiesById = (state) => state.activities.byId;
const getActivityIdList = (state) => state.activities.allItems;
const getActivityItem = (state, props) => state.activities.byId[props.activityId]

///////////// Utility Functions
// construct to map entity ids to object with content
const mapIdsToObjects = (allItemsSelector, byIdSelector) => createSelector(
  [ allItemsSelector, byIdSelector],
  (allItems, byId) => allItems.map(id => byId[id])
);


///////////// Composed Selectors

// Get all activity objects.
export const getAllActivities = mapIdsToObjects(
  getActivityIdList,
  getActivitiesById
);

// get all trips without detail
export const getAllTrips = mapIdsToObjects(
  getTripIdList,
  getTripsById
);

// Generate a selector to get a trip by Id
export const makeGetTrip = (tripId) => createSelector(
  [ 
    (state) => state.trips.byId[tripId], 
    getActivitiesById
  ],
  (trip, activitiesById) => {
    if(!trip) return null;
    const activities = trip.activities.map(id => activitiesById[id]);
    return {
      ...trip,
      activities
    };
  }
);


