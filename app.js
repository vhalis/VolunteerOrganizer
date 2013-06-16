var express = require('express');
var app = express();

// Routing
app.use('/', express.static(__dirname + '/static'));

// Set server listening
app.listen(3000);
