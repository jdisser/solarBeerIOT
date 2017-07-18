var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
  res.send('System Daily Records Table');
});

router.get('/range', function(req, res, next){
  res.send('System Daily Dated Records');
});

module.exports = router;