var app = require('../app');
var express = require('express');
var nodemailer = require('nodemailer');
var _ = require('underscore');
var router = express.Router();
var Twitter = require('twitter'),
    twitter = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_TOKEN_SECRET
      });

var keywords = 'from:engineeringcom OR from:edncom OR from:eeportal_com OR from:elonmusk OR from:cenmag';

router.get('/', function(req, res) {
  var members = [];


  // Get twitter data (pick 4 out of 20 tweets randomly)
  twitter.get('search/tweets', {q: keywords, count: 20, lang: 'en'}, function(error, data, response){
    var tweets = [];
    var statuses = data.statuses;
    statuses = _.shuffle(statuses);

    for(var idx = 0; idx < 8; ++idx) {
      var tweet = statuses[idx];
      var url = '';
      if(tweet.entities.urls.length != 0)
        url = tweet.entities.urls[0].url;
      tweets.push({
        name: tweet.user.name,
        screen_name: tweet.user.screen_name,
        status_link: 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str,
        text: tweet.text,
        url: url
      });
    }
    // // Get member data
    // app.knex('members').where({active_status: 'Active'})
    //   .orderBy('epsidelt_num', 'asc')
    //   // Server error maybe
    //   .catch(function(error) {
    //     console.error(error);
    //   })
    //   .then(function(rows) {
    //     console.log(rows.length + ' member(s) returned');
    //     // Pass tweets and members to homepage
    //     res.render('index', {
    //           data: JSON.stringify(rows),
    //           tweetData: tweets
    //     });
    //   });

    res.render('index', {
      data: [],
      tweetData: tweets
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
