var util = require('util'),
    path = require('path'),
    _ = require('lodash'),
    Sequence = require('./classes/Sequence'),
    Metronome = require('./classes/Metronome'),
    MidiInstrument = require('./classes/MidiInstrument'),
    ER1MKII = require('./classes/ER1MKII'),
    Midi = require('./classes/Midi');

var midi = new Midi();
var metronome = new Metronome();
var sequences = {};

process.stdin.resume();
process.stdin.setEncoding('utf8');
midi.start();
process.stdin.on('data', function (command) {
    if(command != '\n') {
        // remove newline, and split on spaces
        var args = command.split('').slice(0, command.length - 1).join('').split(/\s+/);
        var command = args.shift();
        if(_.contains(['play', 'stop'], command)) {
            if(command == 'play') {
                metronome.start();
            } else if(command == 'stop' && args.length == 0) {
                _.each(sequences, function(sequence) {
                    sequence.stop();
                })
                metronome.stop();
            }
            _.each(args, function(sequence){
                if(_.has(sequences, sequence)) {
                    sequences[sequence][command]();
                } else if (args.length > 0) {
                    console.log('Sequence not found \'%s\'', sequence);
                }
            })
        } else  if(command == 'load') {
            var project = args[0];
            try {
                //_.each(sequences, function(secuence) {
                //    secuence.stop();
                //});
                var path_to_project = path.join(__dirname, '/projects/', project);
                sequences = require(path_to_project)(metronome, midi);
                console.log('loaded \'%s\'', project)
            } catch (e) {
                switch(e.code) {
                    case 'MODULE_NOT_FOUND':
                        if(e.toString() == util.format('Error: Cannot find module \'%s\'', path_to_project)) {
                            console.log('Project not found \'%s\'', project)
                        } else {
                            throw new Error(e);
                        }
                        break;
                    default:
                        throw new Error(e);
                }
            }
        } else {
            console.log('Command not found \'%s\'', command)
        }
    }
});