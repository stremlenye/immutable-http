var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.get('/', function (req, res) {
  console.log("some_get_info");
  res.send("some_get_info");
});

app.get('/test', function (req, res) {
  console.log("some_get_info");
  res.send("some_get_info");
});

app.post('/', function (req, res) {
  console.log(req.body);
  res.json(req.body);
});

app.put('/', function (req, res) {
  console.log(req.body);
  res.json(req.body);
});

app.delete('/', function (req, res) {
  console.log(req.body);
  res.json(req.body);
});


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
