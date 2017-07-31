var express = require('express');
var router = express.Router();

var batrecords_controller = require('../controllers/batrecords.js');

router.get('/', batrecords_controller.table);

router.get('/batV', batrecords_controller.plotV);             //plot last 100 records
router.get('/batV/json', batrecords_controller.plotVJson);    //plot selected records by date in parameters

router.get('/batI', batrecords_controller.plotI);
router.get('/batI/json', batrecords_controller.plotIJson);

router.get('/batP', batrecords_controller.plotP);
router.get('/batP/json', batrecords_controller.plotPJson);

router.get('/batC', batrecords_controller.plotC);
router.get('/batC/json', batrecords_controller.plotCJson);

router.get('/batQ', batrecords_controller.plotQ);
router.get('/batQ/json', batrecords_controller.plotQJson);

module.exports = router;