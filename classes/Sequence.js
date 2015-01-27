var Sequence = function(sequence) {
    var _this = this;
    this.sequence = {};

    var toObj = function(params) {
        return {beatInterval:params[0],on:params[1],duration:params[2],pitch:params[3],velocity:params[4]};
    }
    _.each(sequence, function(note) {
        if(!/^\d+:\d+\/\d+:\d+\/\d+:[ABCDEFG](|#)\d:\d+$/.test(note)) {throw new Error('Parse Error, invalid note definition');}
        var params = note.split(':');
        if(_this.sequence[params[0]]) {
            _this.sequence[params[0]].push(toObj(params))
        } else {
            _this.sequence[params[0]] = [toObj(params)]
        }
    });
}
Sequence.prototype = {
    getBeat:function(index) {
        return this.sequence[index];
    }
}