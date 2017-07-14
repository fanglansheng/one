import os
import requests
import json
from trip_planner import app
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin
from sqlalchemy.orm import validates
from sqlalchemy.sql import func

from datetime import datetime


db = SQLAlchemy(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/trip.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

PLACE_API = 'https://maps.googleapis.com/maps/api/place/details/json'
API_KEY = os.environ.get('GOOGLE_API_KEY')

#?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4&key='+
def get_place_detail(place_id):
	url = '{0}?placeid={1}&key={2}'.format(PLACE_API, place_id, API_KEY)
	content = requests.get(url).content
	response = json.loads(content)
	if not response['status'] == 'OK':
		print('Cannot get google place detail')
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
	activities = db.relationship('Activity', backref='trip')

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
		data['activities'] = [i.to_json() for i in self.activities]
		return data

class Activity(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	# user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
	# user = db.relationship('User', backref='places')
	trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'))

	date = db.Column(db.DateTime, nullable=True)
	memo = db.Column(db.String(500), default='')
	place_id = db.Column(db.String(64), default='') # place_id
	duration = db.Column(db.Integer, default=1) # minutes

	def __init__(self, place_id, date=None):
		self.place_id = place_id
		if not date is None:
			self.date = date

	def __repr__(self):
		return "<Trip(name='%s')>" % (self.title)

	def to_json(self):
		data = dict()
		data['id'] = self.id
		data['date'] = self.date
		data['memo'] = self.memo
		data['place'] = get_place_detail(self.place_id)
		data['trip_id'] = self.trip_id
		return data