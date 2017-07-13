from trip_planner import app
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin
from sqlalchemy.orm import validates
from sqlalchemy.sql import func

from datetime import datetime

db = SQLAlchemy(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/trip.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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
	itineraries = db.relationship('Itinerary', backref='trip')

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
		data['itineraries'] = [i.to_json() for i in self.itineraries]
		return data

class Itinerary(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	# user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
	# user = db.relationship('User', backref='places')
	date = db.Column(db.DateTime, nullable=True)
	memo = db.Column(db.String(500), default='')
	trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'))
	# accommodation

	def __init__(self, trip_id, date=None):
		self.trip_id = trip_id
		if not date is None:
			self.date = date

	def to_json(self):
		data = dict()
		data['id'] = self.id
		data['date'] = self.date
		data['memo'] = self.memo
		data['trip_id'] = self.trip_id
		data['activities'] = []
		return data