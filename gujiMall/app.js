var koa = require('koa');
var fs = require('fs');
var resolve = require('path').resolve;
var router = require('koa-router')();
var mount = require('koa-mount');
var phpjs = require('phpjs');
var sha1 = require('sha1');
var bodyParser = require('koa-bodyparser');
var jwt = require('jwt-simple');
var app = koa();
var config = require('./.shoots.json');
var send = require('koa-send');
var shootConfig = require('./config');
var path = require('path');
var pageRule = new Map();
var request = require('co-request');
var ejs = require('co-ejs');
ejs.open = '<?js';
ejs.close = '?>';

app.use(bodyParser({
    formLimit: '20mb',
    jsonLimit: '10mb'
}));
app.use(router.routes()).use(router.allowedMethods());
app.use(require('koa-validate')());

var context = null;

var serv = function*(path, params, type) {
    type = (type && type.toUpperCase() == 'POST') ? 'POST' : 'GET';
    params = params || {};
    var url = 'http://127.0.0.1:' + config.port + '/serv/' + path;
    console.log(url);
    var cookie = context.headers.cookie || '';
    var option = {
        uri: url
    };
    if (cookie) {
        var j = request.jar();
        j.setCookie(cookie, url);
        option.jar = j;
    }

    try {
        if (type == 'GET') {
            option.qs = params;
            var ret = yield request(option);
        } else {
            option.method = 'POST';
            option.form = params;
            var ret = yield request(option);
        }
    } catch (e) {
        return 'network error';
    }
    return ret.body;
}

var env = {
    prd: process.env.PRD === 'true' || false,
    postfix: process.env.PRD === 'true' ? '' : '_dev'
};

var appOptions = {
    id: config.appid,
    secret: config.appsecret,
    name: config.name,
    server: config["appserv" + env.postfix],
    cookieid: config.cookieid
}

if (shootConfig && shootConfig.page) {
    shootConfig.page.forEach(function(item, i) {
        if (item && item.url) {
            item.url.forEach(function(page, i) {
                var rule = {};
                for (var o in item) {
                    if (typeof(item[o]) == 'function') {
                        rule[o] = item[o];
                    }
                }
                if (rule.allow || rule.deny) {
                    pageRule.set(page, rule);
                }
            })
        }
    })
}

app.use(function*(next) {
    this.env = env;
    yield next;
});

app.use(require('shoots-toolkit')(appOptions, shootConfig));

app.use(mount('/innerapi', function*() {
    if (this.request.method == 'POST') {
        var method = this.request.body.method;
        var func = this.request.body.func;
        var params = this.request.body.params;
        var shoots = this.shoots;
        switch (method) {
            case 'flash':
                var key = this.request.body.params.key;
                switch (func) {
                    case 'get':
                        this.body = yield this.shoots.flash.get(key);
                        break;
                    case 'set':
                        var value = this.request.body.params.value;
                        this.body = yield this.shoots.flash.set(key, value);
                        break
                    case 'has':
                        this.body = yield this.shoots.flash.has(key);
                        break;
                    default:
                        this.throw('not support ' + method + ':' + func, 503);
                        break;
                }
                break
            case 'session':
                var name = this.request.body.params.name;
                switch (func) {
                    case 'get':
                        this.body = yield this.shoots.session.get(name);
                        break;
                    case 'set':
                        var value = this.request.body.params.value;
                        if (name == 'user') {
                            this.throw('user session can not set by the web sdk', 403)
                        }
                        this.body = yield this.shoots.session.set(name, value);
                        break
                    case 'remove':
                        var value = this.request.body.params.value;
                        if (name == 'user') {
                            this.throw('user session can not remove by the web sdk', 403)
                        }
                        this.body = yield yield this.shoots.session.remove(name);
                        break;
                    default:
                        this.throw('not support ' + method + ':' + func, 503);
                        break;
                }
                break;
            case 'cache':
                var key = this.request.body.params.key;
                switch (func) {
                    case 'get':
                        this.body = yield this.shoots.cache.get(key);
                        break;
                    case 'set':
                        var value = this.request.body.params.value;
                        var expireSeconds = this.request.body.params.expireSeconds;
                        this.body = yield this.shoots.cache.set(key, value, expireSeconds);
                        break
                    case 'remove':
                        this.body = yield this.shoots.cache.remove(key);
                        break;
                    default:
                        this.throw('not support ' + method + ':' + func, 503);
                        break;
                }
                break
            default:
                this.throw('not support' + method, 503)
        }
    } else {
        this.body = 'it is worked';
    }
}));


// match serv apis
(function() {
    var apis = fs.readdirSync('serv');
    for (var j in apis) {
        if (!apis[j].match(/\.js$/)) {
            continue;
        }
        var file = apis[j].replace(/\.js$/, '');
        app.use(mount('/serv/' + file, require('./serv/' + file).middleware()));
    }
})();



// match other files
app.use(mount('/', function*() {
    context = this;
    var opts = {};
    opts.root = resolve('.');
    opts.index = opts.index || 'index.html';
    this.path = (this.path != '/') ? this.path : '/index.html';
    if (!fs.existsSync("." + this.path)) {
        return;
    }

    if (this.path.match(/\.html$/)) {
        var sessionId = yield this.shoots.session.getId();
        var isAuthed = false;
        var user;
        if (sessionId) {
            user = yield this.shoots.session.get('user');
            console.log('session user=');
            console.log(user);
            if (user) {
                if (user.userrole && user.userrole != 'guest') {
                    isAuthed = true;
                }
            } else {
                sessionId = null;
                console.log('the session was expired');
            }
        }

        var autoAuthByWechat = this.shoots.config && this.shoots.config.autoAuthByWechat || false;;
        var authUrl = this.shoots.config && this.shoots.config.authUrl;
        if (!isAuthed) {
            if (autoAuthByWechat) {
                //TODO 自动获取用户的openid，正常显示所请求页面
                openId = 'I am the mp open id '; //假设如此

                user = {
                    userrole: 'user',
                    userid: openId
                };
                sessionId = 'the new session id';
                isAuthed = true;
            }
        }

        if (!sessionId && !user) {
            user = {
                username: 'guest',
                userrole: 'guest',
                userid: phpjs.uniqid()
            }
            var playload = appOptions;
            playload.role = user.userrole;
            playload.userid = user.userid;
            var setOk = yield this.shoots.session.set('user', user, 7 * 24 * 3600);
            console.log('set guest session ' + (setOk === true ? 'ok' : 'fail'));
        }


        var rule = pageRule.get(this.path) || pageRule.get('*');
        var flag = true;
        if (rule) {
            if (rule.allow) {
                flag = rule.allow.call(null, user.userrole, user.userid);
            }
            if (rule.deny) {
                flag = flag && !rule.deny.call(null, user.userrole, user.userid);
            }
        }
        console.log('path=' + this.path);
        console.log('user');
        console.log(user);
        console.log('isAuthed=' + isAuthed);
        console.log('authUrl=' + authUrl);
        console.log('check page flag=' + flag)
        if (!flag) {
            // pageRule 规则验证失败，继续到登陆页面
            return this.redirect(authUrl + '?return=' + this.request.url);

            if (isAuthed)
                this.redirect('/');
            else
                this.redirect(authUrl + '?return=' + this.request.url);
            return;
        }



        var ts = new Date().getTime();
        var html = fs.readFileSync("." + this.path);
        var script = "<script>var SHOOTS_SERVER='" + config['appserv' + this.env.postfix] + "'; var SHOOTS_SID='" + sessionId + "';</script>";
        html = html.toString().replace(/(<\/head>)/i, script + " $1")
            //console.log(html);
        this.body = yield ejs.render(html, {
            locals: {
                serv: serv,
                request: request,
                query: this.query
            },
            filename: this.path
        });
        this.set({
            'Pragma': 'no-cache',
            'Content-Type': 'text/html; charset=UTF-8',
            'Content-Length': new Buffer(this.body).length,
            'Cache-Control': 'no-cache'
        });

        return;
    }

    yield send(this, this.path, opts);
}));

app.listen(config.port);
console.log('http://127.0.0.1:' + config.port);