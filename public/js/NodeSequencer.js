var NodeSequencer = function(settings){
    this.settings = settings || {};
    this.isPlaying = false;
    this.interval;
    this.beat = 0;
};

NodeSequencer.prototype = {
    setting:function(path, value, settings) {

        settings = settings || this.settings;
        if(_.isString(path)) {path = path.split('.');}

        if(path.length == 1) {
            if(!_.isUndefined(value)) { settings[path[0]] = value;}
            return settings[path[0]];
        } else {
            return this.setting(path.slice(1), value, settings[path[0]]);
        }
    },
    play:function() {
        var _this = this;

        var beat = function() {
            $(window).trigger('beat', [_this.beat++]);
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
    }
};