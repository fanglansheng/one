import os, sqlite3, json, random, datetime
from flask import Flask

app = Flask(__name__)

CONFIG_AWS = False

# load the config from this file.
# Also can load config from another file, use: 
#   app.config.from_pyfile('yourconfig.cfg')
# http://flask.pocoo.org/docs/0.11/api/#flask.Config.from_object
#   app.config.from_object(__name__)

# Load default config and override config from an environment variable
app.config.update(dict(
    # DATABASE=os.path.join(app.root_path, 'dashboard.db'),
    SQLALCHEMY_DATABASE_URI='sqlite:////tmp/dashboard.db',
    DEBUG=True,
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='default',
    SQLALCHEMY_TRACK_MODIFICATIONS = True
))
# 'silent' tells Flask to not complain if no such environment key is set.
app.config.from_envvar('DASHBOARD_SETTINGS', silent=True)
    

import trip_planner.views
import trip_planner.models