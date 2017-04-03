var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var flash = require('express-flash');
var session = require('express-session');

var index = require('./routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//MongoDB setup
var mongo_pw = process.env.MONGO_PW;
var url = 'mongodb://mongo:' + mongo_pw + '@localhost:27017/todo?authSource=admin';
MongoClient.connect(url, function(err, db){
    console.log('Errors? ' + err);
    assert(!err);

    app.use(function(req, res, next){
        req.task_col = db.collection('tasks');
        next();
    });

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    app.use(session({secret:'top secret'}));
    app.use(flash());

    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', index);

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
});

module.exports = app;
