var _ = require('lodash'),
    midi = require('midi');

var Midi = function(){
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

module.exports = Midi;