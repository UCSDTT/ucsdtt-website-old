var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();


router.get('/', function(req, res) {
  res.render('index');
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
