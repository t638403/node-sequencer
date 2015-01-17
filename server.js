var path = require('path'),
    midi = require('midi'),
    _ = require('lodash');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var cfg = require('./cfg'),
    project = require('./projects/default');


server.listen(cfg.server.port);

app.use("/", express.static(path.join(__dirname, 'public')));

var getMidiPortNames = function(io, socket) {
    var io = new midi[io+'put']();
    var portCount = io.getPortCount();
    var ports = [];
    for(var i = 0; i < portCount; i++) {
        ports.push(io.getPortName(i))
    }
    io.closePort();
    return ports;
}

var fillMidiPortNameSelectBoxes = function(socket) {
    var ports = {
        'in':getMidiPortNames('in', socket),
        'out':getMidiPortNames('out', socket)
    }
    socket.emit('fill MIDI ports', ports);
}

var initFrontEnd = function(socket) {
    fillMidiPortNameSelectBoxes(socket);
}

var setting = function(settings, path, value) {
    settings = settings || this.settings;
    if(_.isString(path)) {path = path.split('-');}

    if(path.length == 1) {
        if(!_.isUndefined(value)) { settings[path[0]] = value;}
        return settings[path[0]];
    } else {
        return setting(settings[path[0]], path.slice(1), value);
    }
}

io.on('connection', function (socket) {

    initFrontEnd(socket);

    socket.emit('load setting', {name:'global-bpm', value:setting(project,  'global-bpm')})

    socket.on('load setting', function (name) {
        socket.emit('load setting', {name:name, value:setting(project,  name)})
    });
    socket.on('save setting', function (s) {
        var before = setting(project, s.name);
        setting(project,  s.name, s.value);
        console.log('saved setting \'%s\' from \'%s\' to \'%s\'', s.name, before, s.value);
    });
    socket.on('action play', function() {
        console.log('play');
    });
    socket.on('action stop', function() {
        console.log('stop');
    });
    socket.on('action rewind', function() {
        console.log('rewind');
    });

});

//var xl1 = new Instrument({
//    name:'XL-1',
//    channel:1
//});
//
//var s1 = new Sequence([
//    '1:1/8:1/8:C#2:80',
//    '1:3/8:1/8:D2:80',
//    '1:5/8:1/8:E2:80',
//    '1:7/8:1/8:F2:80',
//    '3:1/8:1/8:C#2:80',
//    '3:3/8:1/8:D2:80',
//    '3:5/8:1/8:E2:80',
//    '3:7/8:1/8:F2:80'
//]);
//
//var nodeSequencer = new NodeSequencer({
//    midi:{'in':{port:1},'out':{port:2}},
//    global:{bpm:120},
//    instruments:[xl1],
//    sequences:{
//        'XL-1':[s1]
//    }
//});