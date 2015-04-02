var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');

var port = process.env.PORT || 2014;
var nodemailer = require('nodemailer');

dotenv.load();
var pg = require('pg');
var conString = process.env.DB_CREDENTIALS;
var knex = exports.knex = require('knex')({
  client: 'pg',
  connection: conString
});

var nodemailer = require('nodemailer');
var routes = require('./routes/index');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// middleware to automatically parse form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// middleware that calls ./routes/index.js whenever we hit the '/' endpoint
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});



// set port to number provided from user or defaults to 3000
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  // implementation of twitter stream on website
  var io = require('socket.io')(server);
  var Twitter = require('node-tweet-stream'),
    tw = new Twitter({
      consumer_key: 'Aah1DZDZAHJcvguh6mpymarYl',
      consumer_secret: 'QALUC2QHUQJj2zZAF5Tr22ezqyzz673XG3z0gmXcDQcq3zUeNj',
      token: '2983641870-TsjqyWFE2Q6VCp0E8F3IN4tHZ1tzPIxhMAksZ0w',
      token_secret: 'nBGdIfQ2tQl9aU726M109wJnFLxmqE1ck8RiwHs3qBYqL'
    });

  tw.track('3dprinting');
  tw.track('virtualreality');

  tw.on('tweet', function(tweet){
    io.emit('tweet', tweet);
    console.log(tweet);
  });
  console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
