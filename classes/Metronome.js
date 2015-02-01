var _ = require('lodash')
    util = require('util'),
    EventEmitter = require('events').EventEmitter;

var Metronome = function() {
    EventEmitter.call(this);
    this._beat = 0;
    this._quarter = 0;
    this._third = 0;
    this._isPlaying = false;
    this._intervals = []; // TODO memory leak. Keeps growing while playing
    this._bpm = 120;
    this._swing = 0;
}

util.inherits(Metronome, EventEmitter);

Metronome.prototype.bpm = function(bpm) {
    if(!_.isUndefined(bpm)) {
        if(!_.isNumber(bpm)) {throw new Error('Bpm must be numeric');}
        this._bpm = bpm;
    }
    return this._bpm;
}
Metronome.prototype.swing = function(swing) {
    if(!_.isUndefined(swing)) {
        if(!_.isNumber(swing)) {throw new Error('Swing must be numeric');}
        this._swing = swing;
    }
    return this._swing;
}

Metronome.prototype.beatInterval = function(numerator) {return 60 * 1000 / this.bpm();}
Metronome.prototype.thirdInterval = function(numerator) {return this.beatInterval() / 3;}
Metronome.prototype.quarterInterval = function(numerator) {
    if(numerator % 2 != 0) {
        return (this.beatInterval() / 4) + this.swing();
    }
    return this.beatInterval() / 4;
}

Metronome.prototype.start = function() {
    var _this = this;
    var beat = function() {
        _this.emit('beat', _this._beat);
        _this._beat++;
        _this._intervals.push(setTimeout(beat, _this.beatInterval(_this.beat)));

        for(var quarter=0; quarter < 4; quarter++) {
            _this._intervals.push(setTimeout(function() {
                _this.emit('quarter', _this._quarter, _this._beat, (_this._quarter - _this._beat * 4) + 4);
                _this._quarter++;
            }, quarter * _this.quarterInterval(quarter)));
        }

        for(var third = 0; third < 3; third++) {
            _this._intervals.push(setTimeout(function(){
                _this.emit('third', _this._third);
                _this._third++;
            }, third * _this.thirdInterval(third)));
        }

    }
    if(!this._isPlaying) {
        this._isPlaying = true;
        beat();
    }
}

Metronome.prototype.pause = function() {
    if(this._isPlaying) {
        _.each(this._intervals, function(interval){
            clearTimeout(interval);
        })
        this._beat--;
    }
    this._isPlaying = false;
}

Metronome.prototype.stop = function() {
    //this.pause();
    //this.rewind();
}

Metronome.prototype.rewind = function() {
    this._beat = 0;
}


module.exports = Metronome;