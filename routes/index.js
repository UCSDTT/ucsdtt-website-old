var app = require('../app');
var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();
var Twitter = require('twitter'),
    twitter = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_TOKEN_SECRET
      });
var keywords = 'from:elonmusk OR from:techcrunch OR from:neiltyson';

router.get('/', function(req, res) {
  var members = [];

  // Get twitter data
  twitter.get('search/tweets', {q: keywords, count: 4, lang: 'en'}, function(error, data, response){
  tweets = [];
 
  //twitter.get('statuses/home_timeline', {count: 6, exclude_replies: true, contributor_details: true, lang: 'en'}, function(error, data, response){
    //console.log(data);
    var statuses = data.statuses;
    for(var idx = 0; idx < data.length; ++idx) {
      var tweet = statuses[idx];
      console.log(tweet);
      tweets.push({
        name: tweet.user.name,
        screen_name: tweet.user.screen_name,
        status_link: 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str,
        text: tweet.text
      });
    }
    // Get member data
    app.knex('members')
      .orderBy('id', 'asc')
      // Server error maybe
      .catch(function(error) {
        console.error(error);
      })
      .then(function(rows) {
        console.log(rows.length + ' member(s) returned');
        // Pass tweets and members to homepage
        res.render('index', { 
              data: JSON.stringify(rows),
              tweetData: tweets
        });
      });
    });
});

router.get('/memberpage', function(req, res){
  res.render('memberpage', {});
});

router.post('/contact', function(req, res){
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  var mailOpts = {
    from: req.body.email,
    to: "ttsdwebmaster@gmail.com",
    subject: "tt contact form - " + req.body.name,
    text: req.body.message
  };

  transporter.sendMail(mailOpts, function(error, response){
    if (error) {
      console.log(error);
      
      var result = {
        message: "Error sending E-mail.",
        sendstatus: 0
      };

      res.json(JSON.stringify(result));
    } else {
      console.log('email sent.');
      
      var result = {
        message: "Thanks for contacting us!",
        sendstatus: 1
      };

      res.json(JSON.stringify(result));
    }
  });
});

module.exports = router;
