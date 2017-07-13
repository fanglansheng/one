import { schema } from 'normalizr';

export const user = new schema.Entity('users', 
	{ idAttribute: 'id' });

// itinerary
export const itinerary = new schema.Entity('itineraries');
export const itineraryList = new schema.Array(itinerary);

// trips
export const trip =  new schema.Entity('trips', {
	itineraries: [itinerary]
}, { idAttribute: 'id' });

export const tripList = new schema.Array(trip);
