1. Node Server with Babe (Using ES6 and JSX syntax)
https://github.com/babel/example-node-server

2. Run the demo locally:
  (1). Set environment variable $FLASK_APP=trip_planner/views.py and $GOOGLE_API_KEY
  (2). `npm install` install node modules
  (3). `npm start` run webpack
  (4). `python runserver.py` run flask server

3. Set up in AWS:
  (1). Set environment variable $FLASK_APP=trip_planner/views.py and $GOOGLE_API_KEY
  (2). `npm install` install node modules
  (3). `npm run build` generate the bundle.js for production.
  (4). Set AWS_DEPLOY to True in __init__.py