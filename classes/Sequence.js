var _ = require('lodash'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter;

var Sequence = function(metronome) {
    EventEmitter.call(this);
    var _this = this;
    this._metronome = metronome;

    this._metronome.on('beat', function(nr) {
        _this.emit('beat', nr);
    });
    this._metronome.on('quarter', function(nr, beat, quarter) {
        _this.emit('quarter', nr, beat, quarter);
    });
    this._metronome.on('third', function(nr, beat, third) {
        _this.emit('third', nr, beat, third);
    });
};

util.inherits(Sequence, EventEmitter);

Sequence.prototype = _.assign(Sequence.prototype, {
    play:function() {
        if(_.has(this, 'beat')) {this.on('beat', this.beat);}
        if(_.has(this, 'quarter')) {this.on('quarter', this.quarter);}
        if(_.has(this, 'third')) {this.on('third', this.third);}
    },
    stop:function() {
        this.removeAllListeners('beat');
        this.removeAllListeners('quarter');
        this.removeAllListeners('third');
    }
});

module.exports = Sequence;