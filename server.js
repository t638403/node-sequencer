var path = require('path'),
    _ = require('lodash'),
    Sequencer = require('./classes/Sequence'),
    Metronome = require('./classes/Metronome'),
    MidiInstrument = require('./classes/MidiInstrument'),
    Midi = require('./classes/Midi');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var cfg = require('./cfg'),
    project = require('./projects/default');


server.listen(cfg.server.port);

app.use("/", express.static(path.join(__dirname, 'public')));

var getMidiPortNames = function(io, socket) {
    //var io = new midi[io+'put']();
    //var portCount = io.getPortCount();
    //var ports = [];
    //for(var i = 0; i < portCount; i++) {
    //    ports.push(io.getPortName(i))
    //}
    //io.closePort();
    //return ports;
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

var midi = new Midi();
var metronome = new Metronome();
var mk2 = new MidiInstrument({"name":"MK2:CH02","midi":{"channel":2}}, midi);
var xl1_1 = new MidiInstrument({"name":"XL1:CH01","midi":{"channel":1}}, midi);
var xl1_3 = new MidiInstrument({"name":"XL1:CH03","midi":{"channel":3}}, midi);
var xl1_4 = new MidiInstrument({"name":"XL1:CH04","midi":{"channel":4}}, midi);
var instruments = {
    'mk2':mk2,
    'xl1_1':xl1_1,
    'xl1_3':xl1_3,
    'xl1_4':xl1_4
};
var sequencer = new Sequence(metronome, instruments);
var objects = {
    midi:midi,
    metronome:metronome,
    instruments:instruments,
    sequencer:sequencer
}

io.on('connection', function (socket) {

    console.log('client connected')

    initFrontEnd(socket);

    socket.emit('load setting', {name:'metronome-bpm', value:setting(project,  'metronome-bpm')})

    socket.on('load setting', function (name) {
        socket.emit('load setting', {name:name, value:setting(project,  name)})
    });
    socket.on('save setting', function (s) {
        var before = setting(project, s.name);
        var parts = s.name.split('-');
        setting(project,  s.name, s.value);
        if(_.has(objects, part[0])) {
            objects[parts[0]][parts[1]](s.value);
        }
        console.log('saved setting \'%s\' from \'%s\' to \'%s\'', s.name, before, s.value);
    });
    socket.on('action play', function() {
        console.log('play')
        objects.midi.start();
        objects.sequencer.start();
    });
    socket.on('action stop', function() {
        objects.sequencer.stop();
        objects.midi.stop();
    });
    socket.on('action rewind', function() {
        objects.sequencer.rewind();
    });

});