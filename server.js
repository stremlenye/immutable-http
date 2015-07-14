var express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', function (req, res) {
  console.log("GET /")
  console.log("some_get_info");
  res.send("some_get_info");
});

app.get('/test', function (req, res) {
  console.log("GET /test")
  console.log("some_get_info");
  res.send("some_get_info");
});

app.get('/query', function (req, res) {
  console.log("GET /query")
  console.log(req.query);
  res.send(req.query);
});

app.post('/', function (req, res) {
  console.log("POST /")
  console.log(req.body);
  res.json(req.body);
});

app.post('/test', function (req, res) {
  console.log("POST /test")
  console.log(req.body);
  res.json(req.body);
});


app.put('/', function (req, res) {
  console.log("PUT /")
  console.log(req.body);
  res.json(req.body);
});

app.put('/test', function (req, res) {
  console.log("PUT /test")
  console.log(req.body);
  res.json(req.body);
});

app.delete('/', function (req, res) {
  console.log("DELETE /")
  console.log(req.body);
  res.json(req.body);
});

app.delete('/test', function (req, res) {
  console.log("DELETE /test")
  console.log(req.body);
  res.json(req.body);
});


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
