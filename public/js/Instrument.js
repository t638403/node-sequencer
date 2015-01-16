var Instrument = function(settings) {this.settings = settings;}
Instrument.prototype = {
    getName:function(){
        return this.settings.name;
    },
    playNote:function(note) {
        console.log('Playing %s on %s', note.pitch, this.getName());
    }
}