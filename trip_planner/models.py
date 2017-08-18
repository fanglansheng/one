'''
	Modles of db
'''
import os
import json
import requests
from trip_planner import app
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/trip.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

PLACE_API = 'https://maps.googleapis.com/maps/api/place/details/json'
API_KEY = os.environ.get('GOOGLE_API_KEY')

ACTIVITY_TYPE = {
    'hotel': 'hotel',
    'dinning': 'dinning',
    'transition': 'transition',
    'tour': 'tour'
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
        activities = self.activities.order_by(Activity.date.asc()).all()
        data['activities'] = [i.to_json() for i in activities]
        return data


class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    # user = db.relationship('User', backref='places' )
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'))

    start_datetime = db.Column(db.DateTime, nullable=True)
    end_datetime = db.Column(db.DateTime, nullable=True)
    memo = db.Column(db.String(500), default='')
    place_id = db.Column(db.String(64), default='')  # place_id
    # activity type
    act_type = db.Column(db.String(64), default='')

    def __init__(self, place_id, date=None):
        self.place_id = place_id
        if not date is None:
            self.date = date

    def __repr__(self):
        return "<Trip(place='%s',time='%s')>" % (self.place_id, self.date)

    def to_json(self):
        data = dict()
        data['trip_id'] = self.trip_id
        data['id'] = self.id
        data['start_datetime'] = self.start_datetime
        data['end_datetime'] = self.end_datetime
        data['act_type'] = self.act_type
        data['memo'] = self.memo
        data['place'] = get_place_detail(self.place_id)
        return data
