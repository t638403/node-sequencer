var util = require('util'),
    _ = require('lodash'),
    MidiInstrument = require('./MidiInstrument');

var NRPN = {
    S1:{
        low_boost:      {LSB:'0x00', DataEntryLSB:'0x01'},
        pan:            {LSB:'0x01', DataEntryLSB:'0x02'},
        pitch:          {LSB:'0x02', DataEntryLSB:'0x04'},
        wave:           {LSB:'0x03', DataEntryLSB:'0x05'},
        mod_type:       {LSB:'0x04', DataEntryLSB:'0x06'},
        mod_speed:      {LSB:'0x05', DataEntryLSB:'0x07'},
        mod_depth:      {LSB:'0x06', DataEntryLSB:'0x08'},
        level:          {LSB:'0x07', DataEntryLSB:'0x00'},
        decay:          {LSB:'0x08', DataEntryLSB:'0x03'}
    },
    S2:{
        low_boost:      {LSB:'0x0A', DataEntryLSB:'0x0B'},
        pan:            {LSB:'0x0B', DataEntryLSB:'0x0C'},
        pitch:          {LSB:'0x0C', DataEntryLSB:'0x0E'},
        wave:           {LSB:'0x0D', DataEntryLSB:'0x0F'},
        mod_type:       {LSB:'0x0E', DataEntryLSB:'0x10'},
        mod_speed:      {LSB:'0x0F', DataEntryLSB:'0x11'},
        mod_depth:      {LSB:'0x10', DataEntryLSB:'0x12'},
        level:          {LSB:'0x11', DataEntryLSB:'0x0A'},
        decay:          {LSB:'0x12', DataEntryLSB:'0x0D'}
    },
    S3:{
        low_boost:      {LSB:'0x14', DataEntryLSB:'0x15'},
        pan:            {LSB:'0x15', DataEntryLSB:'0x16'},
        pitch:          {LSB:'0x16', DataEntryLSB:'0x18'},
        wave:           {LSB:'0x17', DataEntryLSB:'0x19'},
        mod_type:       {LSB:'0x18', DataEntryLSB:'0x1A'},
        mod_speed:      {LSB:'0x09', DataEntryLSB:'0x1B'},
        mod_depth:      {LSB:'0x1A', DataEntryLSB:'0x1C'},
        level:          {LSB:'0x1B', DataEntryLSB:'0x14'},
        decay:          {LSB:'0x1C', DataEntryLSB:'0x17'}
    },
    S4:{
        low_boost:      {LSB:'0x1E', DataEntryLSB:'0x1F'},
        pan:            {LSB:'0x1F', DataEntryLSB:'0x20'},
        pitch:          {LSB:'0x20', DataEntryLSB:'0x22'},
        wave:           {LSB:'0x21', DataEntryLSB:'0x23'},
        mod_type:       {LSB:'0x22', DataEntryLSB:'0x24'},
        mod_speed:      {LSB:'0x23', DataEntryLSB:'0x25'},
        mod_depth:      {LSB:'0x24', DataEntryLSB:'0x26'},
        level:          {LSB:'0x25', DataEntryLSB:'0x1E'},
        decay:          {LSB:'0x26', DataEntryLSB:'0x21'}
    },
    TK:{
        low_boost:      {LSB:'0x28', DataEntryLSB:'0x29'},
        pan:            {LSB:'0x29', DataEntryLSB:'0x2A'},
        pitch:          {LSB:'0x2A', DataEntryLSB:'0x2C'},
        level:          {LSB:'0x2F', DataEntryLSB:'0x28'},
        decay:          {LSB:'0x20', DataEntryLSB:'0x2B'}
    },
    HH:{
        low_boost:      {LSB:'0x32', DataEntryLSB:'0x33'},
        pan:            {LSB:'0x33', DataEntryLSB:'0x34'},
        pitch:          {LSB:'0x34', DataEntryLSB:'0x36'},
        level:          {LSB:'0x39', DataEntryLSB:'0x32'},
        decay:          {LSB:'0x3A', DataEntryLSB:'0x35'}
    },
    CR:{
        low_boost:      {LSB:'0x3C', DataEntryLSB:'0x3D'},
        pan:            {LSB:'0x3D', DataEntryLSB:'0x3E'},
        pitch:          {LSB:'0x3E', DataEntryLSB:'0x40'},
        level:          {LSB:'0x43', DataEntryLSB:'0x3C'},
        decay:          {LSB:'0x44', DataEntryLSB:'0x3F'}
    },
    CL:{
        low_boost:      {LSB:'0x46', DataEntryLSB:'0x47'},
        pan:            {LSB:'0x47', DataEntryLSB:'0x48'},
        pitch:          {LSB:'0x48', DataEntryLSB:'0x4A'},
        level:          {LSB:'0x4D', DataEntryLSB:'0x46'},
        decay:          {LSB:'0x4E', DataEntryLSB:'0x49'}
    },
    A1:{
        low_boost:      {LSB:'0x50', DataEntryLSB:'0x51'},
        pan:            {LSB:'0x51', DataEntryLSB:'0x52'},
        level:          {LSB:'0x57', DataEntryLSB:'0x50'},
        decay:          {LSB:'0x58', DataEntryLSB:'0x53'}
    },
    A2:{
        low_boost:      {LSB:'0x5A', DataEntryLSB:'0x5B'},
        pan:            {LSB:'0x5B', DataEntryLSB:'0x5C'},
        level:          {LSB:'0x61', DataEntryLSB:'0x5A'},
        decay:          {LSB:'0x62', DataEntryLSB:'0x5D'}
    }
}

var ER1MKII = function(instrument, midi) {
    MidiInstrument.call(this, instrument, midi);
}

util.inherits(ER1MKII, MidiInstrument);
ER1MKII.prototype = _.assign(ER1MKII.prototype, {
    playNote:function(note) {
        var _this = this;
        var er1mkii_note = _.cloneDeep(note);
        delete er1mkii_note.note;
        delete er1mkii_note.velocity;
        delete er1mkii_note.duration;
        var note2label = _.invert({
            S1:this.S1,S2:this.S2,S3:this.S3,S4:this.S4,TK:this.TK,
            HH:this.HH,CL:this.CL,CR:this.CR,A1:this.A1,A2:this.A2
        });
        _.each(er1mkii_note, function(val, knob) {
            var nrpn = NRPN[note2label[note.note]];
            if(_.has(nrpn, knob)) {
                var Bn = 175 + _this._instrument.midi.channel;
                var LSB = parseInt('0x62', 16);
                var MSB = parseInt('0x63', 16);
                var DataEntryMSB = parseInt('0x06', 16);
                var DataEntryLSB = parseInt('0x26', 16);

                _this._midi.output.sendMessage([Bn, LSB, parseInt(nrpn[knob].LSB, 16)]);
                _this._midi.output.sendMessage([Bn, MSB, parseInt('0x02', 16)]);
                _this._midi.output.sendMessage([Bn, DataEntryMSB, val]);
                _this._midi.output.sendMessage([Bn, DataEntryLSB, parseInt(nrpn[knob].DataEntryLSB, 16)]);
            }
        });

        MidiInstrument.prototype.playNote.apply(this, [note]);
    },
    S1:'C2',S2:'D2',S3:'E2',S4:'F2',TK:'B2',HH:'C3',CL:'E3',CR:'D3',A1:'G2',A2:'A2'
});

module.exports = ER1MKII;