var path = require('path'),
    midi = require('midi');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var cfg = require('./cfg')

server.listen(cfg.server.port);

app.use("/", express.static(path.join(__dirname, 'public')));

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});