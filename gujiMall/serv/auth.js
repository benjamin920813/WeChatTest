//!node::koa
var Router = require('koa-router');
var router = new Router();
var phpjs = require('phpjs');

router.get('/login', function*() {

    var username = this.query.username;
    var password = this.query.password;

    console.log(username + "," + password);

    yield this.shoots.user.login(username, password);
    return this.redirect('../../');
});

router.get('/logout', function*() {

    var username = this.query.username;
    var password = this.query.password;

    if (username == 'admin' && password == 'admin') {

    }
    yield shoots.user.logout();
    return this.redirect('../../');
});

router.get('/register', function*() {

    var username = this.query.username;
    var password = this.query.password;
    var repassword = this.query.repassword;

    if (!password || password != repassword) {
        var msg = '密码不正确，或不一致';
        return this.redirect('../../register.html' + '?msg=' + msg);
    }
    //userid, username, password, userRole, profile
    var ret = yield shoots.user.add(phpjs.uniqid(), username, password);
    if (ret.errcode != 0) {
        return this.redirect('../../register.html?msg=' + ret.errmsg);
    } else {
        return this.redirect('../../login.html');
    }
});

module.exports = router;