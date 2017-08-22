'''
	Modles of db
'''
import os
import json
import requests
from trip_planner import app
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import time

db = SQLAlchemy(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/trip.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

PLACE_API = 'https://maps.googleapis.com/maps/api/place/details/json'
API_KEY = os.environ.get('GOOGLE_API_KEY')

VISIT_TYPE = {
    'transit': 'transit',
    'dinning': 'dinning',
    'activity': 'activity',
    'hotel': 'hotel',
    'tour': 'tour',
    'other': 'other'
}


#?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4&key='+
def get_place_detail(place_id):
    url = '{0}?placeid={1}&key={2}'.format(PLACE_API, place_id, API_KEY)
    content = requests.get(url).content
    response = json.loads(content)
    if not response['status'] == 'OK':
        print 'Cannot get google place detail'
        return place_id
    return response['result']


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(40), nullable=False, unique=True)
    first_name = db.Column(db.String(64), nullable=False)
    last_name = db.Column(db.String(64), nullable=False)

    def __init__(self, email, first_name, last_name):
        self.email = email
        self.first_name = first_name
        self.last_name = last_name

    def __repr__(self):
        return "<User(email='%s')>" % (self.email)

    def __eq__(self, other):
        return self.__dict__ == other.__dict__

    def to_json(self):
        data = dict()
        data['id'] = self.id
        data['email'] = self.email
        data['firstname'] = self.first_name
        data['lastname'] = self.last_name
        return data


class Trip(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    # user = db.relationship('User', backref='places')
    title = db.Column(db.String(80), nullable=False)
    ############## no need for memo!!!! #############################################
    memo = db.Column(db.String(500), default='')
    activities = db.relationship('Activity', backref='trip', lazy='dynamic')

    def __init__(self, title, memo):
        self.title = title
        self.memo = memo

    def __repr__(self):
        return "<Trip(name='%s')>" % (self.title)

    def to_json(self):
        data = dict()
        data['id'] = self.id
        data['title'] = self.title
        data['memo'] = self.memo
        # trips = Trip.query.order_by(desc(File.time)).all()
        activities = self.activities.order_by(Activity.start_time.asc()).all()
        data['activities'] = [i.to_json() for i in activities]
        return data


class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    # user = db.relationship('User', backref='places' )
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'))

    start_time = db.Column(db.DateTime, nullable=True)
    duration = db.Column(db.Time, default=time(1))
    memo = db.Column(db.String(500), default='')
    place_id = db.Column(db.String(64), default='')  # place_id
    # activity type
    act_type = db.Column(db.String(64), default='activity')

    def __init__(self, place_id, startTime=None):
        self.place_id = place_id
        if not startTime is None:
            self.startTime = startTime

    def __repr__(self):
        return "<Trip(place='%s',time='%s')>" % (self.place_id, self.date)

    def to_json(self):
        data = dict()
        data['trip_id'] = self.trip_id
        data['id'] = self.id
        data['startTime'] = self.start_time
        data['duration'] = self.duration.strftime("%H:%M")
        data['visitType'] = self.act_type
        data['memo'] = self.memo
        data['place'] = get_place_detail(self.place_id)
        return data
