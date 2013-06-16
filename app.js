var express = require('express');
//var fs = require('fs');
//var http = require('https');
var app = express();

//var privateKey = fs.readFileSync('cert/server.key').toString();

// Routing
app.use('/', express.static(__dirname + '/static'));

// Set server listening
app.listen(80);
