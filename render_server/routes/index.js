import express from 'express';
import path from 'path';

const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('---',path.join(__dirname + '../public/index.html'));
  res.send('shit');
});

module.exports = router;
