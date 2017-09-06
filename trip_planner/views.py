import os
import sys
import requests
from flask import jsonify, render_template, request, make_response
# from flask_login import login_required, current_user

from sqlalchemy import and_, or_
from trip_planner import app
from trip_planner.models import *

if not os.environ.get('GOOGLE_API_KEY'):
    sys.stderr.write("No GOOGLE_API_KEY environ\n\n")
    sys.exit(2)

GOOGLE_API_URL = 'https://maps.googleapis.com/maps/api/js?key=%s&libraries=places' % os.environ.get('GOOGLE_API_KEY')
"""
Initializes the database.
The app.cli.command() decorator registers a new command with the flask script.
"""

@app.cli.command('createtables')
def initdb_command():
    db.create_all()
    print 'Initialized the database.'

@app.cli.command('droptables')
def dropdb_command():
    db.drop_all()
    print 'Droped the database.'

@app.route('/login')
def login_page():
    return render_template('login.html')

@app.route('/')
# @login_required
def index():
    return render_template('index.html')

@app.route('/google_map_api.js')
def get_google_api():
    file = requests.get(GOOGLE_API_URL).content
    return file
