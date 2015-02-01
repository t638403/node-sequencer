var util = require('util'),
    _ = require('lodash'),
    MidiInstrument = require('./MidiInstrument');

var EMUXL1 = function(instrument, midi) {
    MidiInstrument.call(this, instrument, midi);
}

util.inherits(EMUXL1, MidiInstrument);
EMUXL1.prototype = _.assign(EMUXL1.prototype, {
    playNote:function(note) {
        var _this = this;

        // Enable knob paramaters for XL-1
        var emuxl1_note = _.cloneDeep(note);
        delete emuxl1_note.note;
        delete emuxl1_note.velocity;
        delete emuxl1_note.duration;
        var knob2ctrl = {
            A:this.A, B:this.B, C:this.C, D:this.D,
            E:this.E, F:this.F, G:this.G, H:this.H,
            I:this.I, J:this.J, K:this.K, L:this.L
        };
        _.each(emuxl1_note, function(value, knob) {
            if(_.has(knob2ctrl, knob)) {
                _this.ctrlChange(knob2ctrl[knob], value);
            }
        });

        // Play the actual note
        MidiInstrument.prototype.playNote.apply(this, [note]);
    },
    setInstrument:function(xl1_or_user, instrument_or_bank_nr, instrument_nr) {

        var conv = {'user':0, 'xl1':7};
        var MSB = 0; //conv[xl1_or_user] || 7;
        var LSB;
        if(_.isUndefined(instrument_nr)) {
            LSB = Math.floor(instrument_or_bank_nr / 128);
            instrument_nr = instrument_or_bank_nr - (LSB * 128);
        } else {
            LSB = instrument_or_bank_nr;
        }


        var Bn = 175 + this._instrument.midi.channel;
        var Cn = 191 + this._instrument.midi.channel;
        this._midi.output.sendMessage([Bn, parseInt('0x00', 16), MSB]);
        this._midi.output.sendMessage([Bn, parseInt('0x20', 16), LSB]);
        this._midi.output.sendMessage([Cn, instrument_nr]);
    },
    A:21, B:14, C:23, D:24,
    E:25, F:26, G:27, H:28,
    I:78, J:79, K:91, L:93
});

module.exports = EMUXL1;