var NodeSequencer = function(settings){

    this.settings = settings || {};
    this.isPlaying = false;
    this.interval;
    this.beat = 0;
};

NodeSequencer.prototype = {
    play:function() {
        var _this = this;

        var beat = function() {
            console.log(_this.beat)
            _.each(_this.settings.instruments, function(instrument) {
                _.each(_this.settings.sequences[instrument.getName()], function(sequence) {
                    _.each(sequence.getBeat(_this.beat), function(note) {
                        var numerator_denominator = note.on.split('/');
                        var fraction = (parseFloat(numerator_denominator[0]) - 1) / parseFloat(numerator_denominator[1]);
                        setTimeout(function(){
                            instrument.playNote(note);
                        }, fraction * 60 * 1000 / parseFloat(_this.settings.global.bpm))
                    })
                });
            });
            _this.beat++;
            _this.interval = setTimeout(beat, 60 * 1000 / parseFloat(_this.settings.global.bpm));
        }

        if(!this.isPlaying) {
            this.isPlaying = true;
            beat();
        }

    },
    stop:function() {
        if(this.isPlaying) {
            clearTimeout(this.interval);
            this.beat--;
        }
        this.isPlaying = false;
    },
    rewind:function() {
        this.beat = 0;
    },
    midiInPort:function(port) {
        if(!_.isUndefined(port)) {
            this.settings.midi.in.port = port;
        }
        return this.settings.midi.out.port;
    },
    midiOutPort:function(port) {
        if(!_.isUndefined(port)) {
            this.settings.midi.out.port = port;
        }
        return this.settings.midi.out.port;
    }
};