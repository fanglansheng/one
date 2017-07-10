import os
import sys
import requests
from flask import jsonify, render_template, request, make_response
# from flask_login import login_required, current_user

from sqlalchemy import and_, or_
from trip_planner import app
from trip_planner.models import *

# POST /trip
#		Create a new trip
# GET /trip
# 	Get all trips
@app.route('/trip', methods=['POST', 'GET'])
def trip():
	if request.method == 'POST':
		data = request.json
		if not data['title']:
			return make_response('Missing feilds!', 400)

		# create the new trip
		new_trip = Trip(data['title'], data['memo'])
		db.session.add(new_trip)

		# set itineraries
		if data['days']:
			itineraries = []
			for index in range(int(data['days'])):
				itinerary = Itinerary(new_trip.id)
				db.session.add(itinerary)
				itineraries.append(itinerary)
			new_trip.itineraries = itineraries
		db.session.commit()
		return jsonify(new_trip.to_json())

	trips = Trip.query.all()
	dic = {}
	dic['trips'] = [trip.to_json() for trip in trips]
	return jsonify(dic)


# get an itinerary by tripId and date.
# If cannot find, create a new one
def get_itinerary_or_create(trip_id, date_str):
	# get date object
	it_date = datetime.strptime(date_str, "%Y%m%d").date()
	# check is itinerary exist
	initerary = Itinerary.query.filter_by(
								trip_id=trip_id, 
								date=it_date).one_or_none()
	# create a new one if not exist
	if initerary is None:
		itinerary = Itinerary(trip_id, it_date)
		trip = Trip.query.get_or_404(trip_id)
		trip.itineraries.append(itinerary)
		db.session.add(itinerary)
		db.session.commit()
	return itinerary


# POST /trip/<int:trip_id>/itinerary
#		Add a initerary to trip
#		json: {date:'20170709'}
@app.route('/trip/<int:trip_id>/itinerary', methods=['POST', 'GET'])
def itinerary(trip_id):
	trip = Trip.query.get_or_404(trip_id)
	dic = {}

	if request.method == 'POST':
		data = request.json
		# check form field
		if 'date' in data: 
			itinerary = get_itinerary_or_create(trip.id, data['date'])
		else:
			itinerary = Itinerary(trip.id)
			trip.itineraries.append(itinerary)
			db.session.add(itinerary)
			db.session.commit()
		dic['initerary'] = itinerary.to_json()
		return jsonify(dic)
	# GET return the trip information
	dic['trip'] = trip.to_json()
	return jsonify(dic)

# POST /itinerary/<int:it_id>
#		edit itinerary by id.
#		json : {'date':'20170907', memo: '..'}
@app.route('/itinerary/<int:it_id>', methods=['POST', 'DELETE'])
def edit_itinerary(it_id):
	itinerary = Itinerary.query.get_or_404(it_id)
	if request.method == 'DELETE':
		db.session.delete(itinerary)
		db.session.commit()
		return make_response('',200)

	if request.method == 'POST':
		data = request.json
		# check form field
		if 'date' in data: 
			it_date = datetime.strptime(data['date'], "%Y%m%d").date()
			itinerary.date = it_date
		if 'memo' in data:
			itinerary.memo = data['memo']
		db.session.commit()
	return jsonify({ 'initerary': itinerary.to_json() })



