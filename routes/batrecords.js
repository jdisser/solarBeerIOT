var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
  res.send('Battery Records Page');
});

router.get('/range', function(req, res, next){
  res.send('Battery date range plot');
});

module.exports = router;