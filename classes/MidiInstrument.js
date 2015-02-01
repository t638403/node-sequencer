var _ = require('lodash');

var MidiInstrument = function(instrument, midi) {
    this._instrument = instrument;
    this._midi = midi;
}
MidiInstrument.prototype = {
    getNoteNumber:function(notename) {
        var notes = {'C':12,'C#':13,'D':14,'D#':15,'E':16,'F':17,'F#':18,'G':19,'G#':20,'A':21,'A#':22,'B':23};
        var parts = notename.toUpperCase().match(/^([CDEFGAB](|#))((|-)\d)$/);
        var notename = parts[1];
        var octave = parseInt(parts[3]);
        return notes[notename] + (octave * 12);
    },
    playNote:function(note) {
        var _this = this;
        var note_on = 143 + this._instrument.midi.channel;
        var note_number = this.getNoteNumber(note.note);
        var message = [note_on, note_number, note.velocity]
        this._midi.output.sendMessage(message)

        var note_off = 127 + this._instrument.midi.channel;
        setTimeout(function() {
            _this._midi.output.sendMessage([note_off, note_number, note.velocity])
        }, note.duration);
    }
}

module.exports = MidiInstrument;