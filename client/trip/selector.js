import { createSelector } from 'reselect';

/////////// Basic Selectors
const getTripsById = (state) => state.trips.byId;
const getTripIdList = (state) => state.trips.allItems;

const getItinerariesById = (state) => state.itineraries.byId;
const getItineraryIdList = (state) => state.itineraries.allItems;
const getItineraryItem = (state, props) => state.itineraries.byId[props.itineraryId]

const getActivitiesById = (state) => state.activities.byId;
const getActivityIdList = (state) => state.activities.allItems;

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

// get Itinerary by id.
// export const getItineray = (itineraryId) => createSelector(
//   [
    
//     getActivitiesById
//   ],
//   (itinerary, activitiesById) => {
//     const activities = itinerary.activities.map(id => activitiesById(id));
//     return {
//       ...itinerary,
//       activities
//     }
//   }
// );

// Get all activity objects.
// export const getAllItineraries = mapIdsToObjects(
//   getItineraryIdList,
//   getItineray
// );

// Generate a selector to get a trip by Id
export const makeGetTrip = (tripId) => createSelector(
  [ 
    (state) => state.trips.byId[tripId], 
    getItinerariesById
  ],
  (trip, itinerariesById) => {
    if(!trip) return null;
    const itineraries = trip.itineraries.map(id => itinerariesById[id]);
    return {
      ...trip,
      itineraries
    };
  }
);

// get all trips without detail
export const makeGetAllTrips = mapIdsToObjects(
  getTripIdList,
  getTripsById
);