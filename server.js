var path = require('path'),
    midi = require('midi');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var cfg = require('./cfg')

server.listen(cfg.server.port);

app.use("/", express.static(path.join(__dirname, 'public')));

app.get('/midi/out/portnames', function(req, res) {
    var output = new midi.output();
    var portCount = output.getPortCount();
    var ports = [];
    for(var i = 0; i < portCount; i++) {
        ports.push(output.getPortName(i))
    }
    output.closePort();
    res.json(ports);
});
app.get('/midi/in/portnames', function(req, res) {
    var input = new midi.output();
    var portCount = input.getPortCount();
    var ports = [];
    for(var i = 0; i < portCount; i++) {
        ports.push(input.getPortName(i))
    }
    input.closePort();
    res.json(ports);
});

io.on('connection', function (socket) {

    socket.emit('midi', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});