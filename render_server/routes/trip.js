import {
	Router
} from 'express';

/**
	trip : {
		trip_id: '',
		title: '',
		itineraries : [],
		memo : ''
	}
*/

/* GET user's trip list. */
Router.get('/', function(req, res, next) {

  res.send('respond with a resource');
});

/* POST Create a new trip */
Router.post('/', (req, res, next) => {
	const db = req.db;
	const {
		title,
		days,
		memo
	} = req.body;

	const tripCollection = db.get('tripCollection');
	const itineraryCollection = db.get('itineraryCollection');

	// // create a trip
	// tripCollection.insert({
	// 	title,
	// 	memo
	// }, (err, doc) => {

	// });

	// // create itineraries by days
	// itinerary.insert([], (err, doc) => {
	// 	if(err){
	// 		res.send('Error in adding to database');
	// 	}
	// });

});

module.exports = Router;
