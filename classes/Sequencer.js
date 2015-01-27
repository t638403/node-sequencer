var _ = require('lodash'),
    midi = require('midi');


var chords = [
    ['C3', 'C4', 'D#4', 'G4'],
    ['G2', 'G3', 'A4', 'A#4'],
    ['C3', 'C#4', 'F4', 'G#4']
]
var currentChord = chords[0];

var Sequencer = function(metronome, instruments) {

    var _this = this;
    this._metronome = metronome;
    this._instruments = instruments;
    var mk2 = {
        S1:'C2',
        S2:'D2',
        S3:'E2',
        S4:'F2',
        TK:'B2',
        HH:'C3',
        CL:'E3',
        CR:'D3'
    }
    this._metronome.on('beat', function(nr) {
        _this._instruments.mk2.playNote({pitch: mk2.S1, velocity:127, duration:500});
        if(nr%2 == 0) {

        } else {
            _this._instruments.mk2.playNote({pitch: mk2.CL, velocity:127, duration:500});
        }

        if(nr%4 == 0) {
            currentChord = chords[_.random(0, 2)];
            _this._instruments.xl1_3.playNote({pitch: currentChord[0], velocity:_.random(87, 127), duration:_.random(380, 1800)});
            _this._instruments.xl1_3.playNote({pitch: currentChord[1], velocity:_.random(87, 127), duration:_.random(380, 1800)});
            _this._instruments.xl1_3.playNote({pitch: currentChord[2], velocity:_.random(87, 127), duration:_.random(380, 1800)});
            _this._instruments.xl1_3.playNote({pitch: currentChord[3], velocity:_.random(87, 127), duration:_.random(380, 1800)});
        }

    });

    this._metronome.on('quarter', function(nr, beat, quarter) {
        _this._instruments.mk2.playNote({pitch: mk2.TK, velocity:127, duration:10});
        if(beat%8 == 0 && quarter == 2) {
            //_this._instruments.xl1_3.playNote({pitch: 'C3', velocity:127, duration:2000});
        }

        if(quarter == 0) {
            _this._instruments.mk2.playNote({pitch: mk2.S1, velocity:127, duration:10});
            _this._instruments.xl1_4.playNote({pitch: currentChord[0], velocity:_.random(87, 127), duration:_.random(80, 300)});
        }
        if(quarter == 1) {
            _this._instruments.xl1_4.playNote({pitch: currentChord[1], velocity:_.random(87, 127), duration:_.random(80, 300)});
            if(beat % 2 != 0) {
                _this._instruments.xl1_1.playNote({pitch: currentChord[0], velocity:_.random(87, 127), duration:_.random(80, 300)});
            } else {
                _this._instruments.xl1_1.playNote({pitch: currentChord[1], velocity:_.random(87, 127), duration:_.random(80, 300)});
            }
        }
        if(quarter == 3) {
            _this._instruments.xl1_4.playNote({pitch: currentChord[2], velocity:_.random(87, 127), duration:_.random(80, 300)});
        }
        if(quarter == 4) {
            _this._instruments.xl1_4.playNote({pitch: currentChord[3], velocity:_.random(87, 127), duration:_.random(80, 300)});
        }
        if(nr % 3 == 0) {
            _this._instruments.mk2.playNote({pitch: mk2.S2, velocity:127, duration:10});
            if(beat % 2 == 0) {
                _this._instruments.xl1_1.playNote({pitch: currentChord[2], velocity:_.random(87, 127), duration:_.random(80, 300)});
            } else {
                _this._instruments.xl1_1.playNote({pitch: currentChord[3], velocity:_.random(87, 127), duration:_.random(80, 300)});
            }
        }
        if(nr % 5 == 0) {
            _this._instruments.mk2.playNote({pitch: mk2.S4, velocity:127, duration:10});
        }

        if(nr % 7 == 0) {
            _this._instruments.mk2.playNote({pitch: mk2.S3, velocity:127, duration:10});
        }
    });
};

Sequencer.prototype = {
    start:function() {
        this._metronome.start();
    },
    stop:function() {
        this._metronome.stop();
    },
    rewind:function() {
        this.metronome.rewind();
    }
};

module.exports = Sequencer;