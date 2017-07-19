var express = require('express');
var router = express.Router();

var batrecords_controller = require('../controllers/batrecords.js');

router.get('/', batrecords_controller.table);

router.get('/range', batrecords_controller.plot);

module.exports = router;