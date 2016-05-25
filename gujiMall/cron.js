var cron = function() {};

cron.prototype.alive = {
    cronTime: '* * * * * *',
    onTick: function*() {
/*
        var coll = this.shoots.collection('job');
        var ret = yield coll.save({'k': 'bbit'});
        console.log(ret);
*/
    },
    onComplete: null,
    start: true,
    timeZone: 'Asia/Shanghai'
};

module.exports = cron;