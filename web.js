var express = require('express')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var request = require('sync-request');


app.use(express.static('www'))

io.on('connection', function(socket){


});

http.listen(3000, function(){
  console.log('Server Online');
});