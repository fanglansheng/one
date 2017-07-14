import { schema } from 'normalizr';

export const user = new schema.Entity('users', 
	{ idAttribute: 'id' });

// activity
export const activity = new schema.Entity('activities');
export const activityList = new schema.Array(activity);

// trips
export const trip =  new schema.Entity('trips', {
	activities: [activity]
}, { idAttribute: 'id' });

export const tripList = new schema.Array(trip);
