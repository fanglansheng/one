from trip_planner import app, CONFIG_AWS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin
from sqlalchemy.orm import validates
from sqlalchemy.sql import func

from datetime import datetime

db = SQLAlchemy(app)

if CONFIG_AWS:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////var/www/html/three/test.db'
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/dashboard.db'

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

class PlaceMark(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref='places')
    name = db.Column(db.String(80), nullable=False)
    value = db.Column(db.String(80), nullable=False)