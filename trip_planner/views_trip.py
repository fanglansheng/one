import os
import sys
import requests
from flask import jsonify, render_template, request, make_response
# from flask_login import login_required, current_user
from datetime import datetime, timedelta

from sqlalchemy import and_, or_
from trip_planner import app
from trip_planner.models import *

# POST /trip
#		Create a new trip
#		json : {
#			title:'',
#			days: number,
#		}


# GET /trip 	- Get all trips
@app.route('/trip', methods=['POST', 'GET'])
def trip():
    print('hah')
    if request.method == 'POST':
        data = request.json
        if not data['title']:
            return make_response('Missing feilds!', 400)

        # create the new trip
        new_trip = Trip(data['title'], '')
        db.session.add(new_trip)
        db.session.commit()
        # redirect to the page to edit
        return jsonify(new_trip.to_json())

    trips = Trip.query.all()
    print trips
    dic = dict()
    dic['trips'] = [t.to_json() for t in trips]
    print dic
    return jsonify(dic)


# GET /trip/<id> 	- Get trip data
# DELETE /trip/<id> - Delete trip by id
# POST /trip/<id> - Edit tirp
#		json : {
#			title:'',
# 		memo: ''
#		}
@app.route('/trip/<int:trip_id>', methods=['POST', 'GET', 'DELETE'])
def edit_trip(trip_id):
    trip = Trip.query.get_or_404(trip_id)
    dic = {}
    # DELETE
    if request.method == 'DELETE':
        db.session.delete(trip)
        db.session.commit()
        return make_response('', 200)
    # EDIT
    if request.method == 'POST':
        data = request.json
        if 'title' in data:
            trip.title = data['title']
            db.session.commit()
        if 'memo' in data:
            trip.memo = data['memo']
            db.session.commit()
    # GET
    dic['trip'] = trip.to_json()
    return jsonify(dic)


# get an activity by tripId and date.
# If cannot find, create a new one
def get_activity_or_create(trip_id, date_str):
    # get date object
    it_date = datetime.strptime(date_str, "%Y%m%d").date()
    # check is activity exist
    activity = Activity.query.filter_by(
        trip_id=trip_id, date=it_date).one_or_none()
    # create a new one if not exist
    if activity is None:
        activity = Activity(trip_id, it_date)
        trip = Trip.query.get_or_404(trip_id)
        trip.activities.append(activity)
        db.session.add(activity)
        db.session.commit()
    return activity


# POST /trip/<int:trip_id>/activity
#		Add a activity to trip
#		json: {date:'20170709'}
@app.route('/trip/<int:trip_id>/activity', methods=['POST', 'GET'])
def activity(trip_id):
    trip = Trip.query.get_or_404(trip_id)
    dic = {}
    if request.method == 'POST':
        data = request.json
        # check form field
        if not 'place_id' in data:
            return make_response('Missing feilds!', 400)
        else:
            print data['place_id']
            activity = Activity(data['place_id'])
            trip.activities.append(activity)
            db.session.add(activity)
            db.session.commit()
        dic['activity'] = activity.to_json()
        return jsonify(dic)
    # GET return the trip information
    dic['trip'] = trip.to_json()
    return jsonify(dic)


# POST /activity/<int:it_id>
#		edit activity by id.
#		json : {'date':'20170907', memo: '..', duration: 60}
@app.route('/activity/<int:it_id>', methods=['POST', 'DELETE'])
def edit_activity(it_id):
    activity = Activity.query.get_or_404(it_id)
    if request.method == 'DELETE':
        db.session.delete(activity)
        db.session.commit()
        return make_response('', 200)

    if request.method == 'POST':
        data = request.json
        # check form field
        if 'datetime' in data:
            t = data['datetime']
            ret = datetime.strptime(t[0:16], '%Y-%m-%dT%H:%M')
            if t[18] == '+':
                ret -= timedelta(hours=int(t[19:22]), minutes=int(t[23:]))
            elif t[18] == '-':
                ret += timedelta(hours=int(t[19:22]), minutes=int(t[23:]))
            activity.date = ret
        if 'memo' in data:
            activity.memo = data['memo']
        if 'duration' in data:
            activity.duration = data['duration']
        if 'place_id' in data:
            activity.place_id = data['place_id']

        db.session.commit()
    return jsonify({'activity': activity.to_json()})
