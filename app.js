var nodemailer = require("nodemailer");
var express = require('express');
//var fs = require('fs');
//var http = require('https');
var app = express();
app.use(express.bodyParser()); // Required for parsing POST

var transport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
      user: "deventvo@gmail.com",
      pass: "devent-vo"
    }
  });

//var privateKey = fs.readFileSync('cert/server.key').toString();
//var query = require('url').parse(req.url,true).query;
// Routing
app.use('/', express.static(__dirname + '/static'));

function sendMailURI(req, res) {
  var mailOptions = {
      from: req.param('from'),
      to: req.param('to'),
      subject: req.param('subject'),
      text: req.param('text')
  }

  console.log("Sending mail");
  
  /*var myResponse = {thank : "you"}; // Received JSON - need reply with JSON

  res.writeHead( 200 );
  res.setHeader("Content-Type", "text/html");
  res.write(JSON.stringify(myResponse));
  res.end();*/
  
  transport.sendMail(mailOptions);
};

app.get('/mail', sendMailURI); //mostly for testing purposes
app.post('/mail', sendMailURI);

// Set server listening
app.listen(80);
