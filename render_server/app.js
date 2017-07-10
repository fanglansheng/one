import express from 'express';
import path from 'path';
// import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import request from 'request';
import { MongoClient } from 'mongodb';

import Config from '../app.config';
import index from './routes/index'
import users from './routes/users';
// import trip from './routes/trip';
import spider from './routes/crawler';
import { handleRender } from './routes/render';


const app = express();
const port = 3000;
const dbUrl = "mongodb://localhost:27017/tripdb";
let db;

// setup database
MongoClient.connect(dbUrl, (err, database) => {
  if (err) throw err;
  db = database;
  console.log("Database linked!");
  // database.close();
});

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../dist')));

// app.use(handleRender);

// make database accessiable to routes
app.use((req, res, next)=>{
  req.db = db;
  next();
});

// app.use('/', index);
app.use('/users', users);
// app.use('/trip', trip);

app.get('/google_map_api.js', (req, res, next) => {
  const url = Config.GOOGLE_API_URL;
  req.pipe(request(url)).pipe(res);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error-handling middleware always takes four arguments. You must provide four arguments to identify it as an error-handling middleware function. Even if you don’t need to use the next object, you must specify it to maintain the signature. Otherwise, the next object will be interpreted as regular middleware and will fail to handle errors.
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
});

app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});

module.exports = app;