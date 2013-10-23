var express = require('express');
var app = express();

var currentRoom, acknowledgedData;

app.use(express.bodyParser());
app.use(express.static('public'));

app.get('/room', function(req, res){
  res.json({ 'room': currentRoom || false });
});

app.post('/announce', function(req, res){
  currentRoom = req.body;
  console.log('ann');
  res.json({ 'thanks': true });
});

app.get('/hasAcknowledged', function(req, res){
  res.json({ 'acknowledged': acknowledgedData || false });
});

app.post('/acknowledged', function(req, res){
  acknowledgedData = req.body;
  console.log('ack');
  res.json({ 'thanks': true });
});

app.listen(3000);