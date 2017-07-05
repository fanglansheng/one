import os
from flask import jsonify, render_template, request, make_response
from flask_login import login_required, current_user

from sqlalchemy import and_, or_


from trip_planner import app, CONFIG_AWS
from trip_planner.models import *

# from react.render import render_component
# from react.conf import settings

# settings.configure(
#     RENDER=True,
#     RENDER_URL='http://127.0.0.1:9001/render',
# )

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
    if CONFIG_AWS:
        return render_template('login.html')
    else:
        return render_template('login_local.html')

@app.route('/')
@login_required
def index():
    if CONFIG_AWS:
        return render_template('index.html')
    else:
        return render_template('index_local.html')


# @app.route('/testrender')
# def render():
#     path = os.path.join(os.getcwd(), 'three/static/js/file/components/Nav.js')
#     rendered = render_component(
#         path,
#         {
#             'username': 'sdfadfs',
#             'email':'example@123.com'
#         },
#         to_static_markup=True
#     )
#     return render_template('index.html', rendered=rendered)