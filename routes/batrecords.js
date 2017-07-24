var express = require('express');
var router = express.Router();

var batrecords_controller = require('../controllers/batrecords.js');

router.get('/', batrecords_controller.table);

router.get('/batV', batrecords_controller.plotV);

router.get('/batI', batrecords_controller.plotI);

router.get('/batP', batrecords_controller.plotP);

router.get('/batC', batrecords_controller.plotC);

router.get('/batQ', batrecords_controller.plotQ);

module.exports = router;