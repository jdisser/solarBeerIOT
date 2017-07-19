var express = require('express');
var router = express.Router();

var sysrecords_controller = require('../controllers/sysrecords.js');

router.get('/', sysrecords_controller.table);

router.get('/range', sysrecords_controller.range_table);

module.exports = router;