//!node::koa
var Router = require('koa-router');
var router = new Router();

router.get('/case1', function *() {


    this.body = 'hello, shoots!';
});

router.get('/removeAll', function *() {

    // auth...
    //


    mongo.removeAll();
});


module.exports = router;
