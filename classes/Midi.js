var _ = require('lodash'),
    midi = require('midi');

var Midi = function(metronome){
    this._in = {port:2};
    this._out = {port:1};
    this.output;
}

Midi.prototype.in = function(i){
    if(!_.isUndefined(i)) {
        if(!_.isObject(i)) {throw new Error('Must be a valid Midi in config object');}
        this._in = i;
    }
    if(_.isUndefined(this._in)) {throw new Error('Midi in params not set')}
    return this._in;
}

Midi.prototype.in = function(o) {
    if(!_.isUndefined(o)) {
        if(!_.isObject(o)) {throw new Error('Must be a valid Midi out config object');}
        this._out = o;
    }
    if(_.isUndefined(this._out)) {throw new Error('Midi out params not set')}
    return this._out;
}

Midi.prototype.start = function() {
    this.output = new midi.output()
    this.output.openPort(1)
}

Midi.prototype.stop = function() {
    this.output.closePort(1)
}

Midi.prototype.ctrlChange = function(channel, ctrl, value) {
    if(!_.isNumber(ctrl) || ctrl < 0 || ctrl > 127) {console.log('Midi.ctrlChange: ctrl index out of bounds, must be 0-127')}
    if(!_.isNumber(value) || value < 0 || value > 127) {console.log('Midi.ctrlChange: value must be 0-127')}
    var Bn = 175 + channel;
    if(_.isNumber(Bn) && Bn > 175 && Bn < 192) {
        this.output.sendMessage([Bn, ctrl, value]);
    } else {
        console.log('Midi.ctrlChange: Bn index out of bounds, must be 176-191');
    }
}

Midi.prototype.sendClock = function(){this.output.sendMessage([248]);}

module.exports = Midi;