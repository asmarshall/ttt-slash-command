require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser');
var router = require('./routes/index');

var app = express();

// middleware
app.set('view engine', 'ejs');

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.urlencoded({verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));

app.use('/', router);

var server = app.listen(process.env.PORT || 8000, function () {
var port = server.address().port;
  console.log('Server up and listening on', port);
});
