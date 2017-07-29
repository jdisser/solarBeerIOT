var express = require('express');
var engine = require('ejs-mate');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var index = require('./routes/index');
var users = require('./routes/users');
var batrecords = require('./routes/batrecords');
var sysrecords = require('./routes/sysrecords');

var app = express();

app.engine('ejs', engine);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// database connection

var Sequelize = require('sequelize');

// Connect to a sql database
var db = new Sequelize('solarbeer.db', '', '', { 
  dialect: 'sqlite',
  storage: './database/solarbeer.db'
});

//import the models hardcoded
db.import('./models/batrecord.js');
db.import('./models/sysrecord.js');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/batrecords', batrecords);
app.use('/sysrecords', sysrecords);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// //dynamically includes controllers (routes)???
// fs.readdirSync('./controllers').forEach( function(file){
//   if (file.substr(-3) == '.js') {
//     route = require('./controllers/' + file);
//     route.controller(app);
//   }
// });

module.exports = app;
