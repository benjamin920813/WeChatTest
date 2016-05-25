//!node::koa
var Router = require('koa-router');
var router = new Router();
var wechat = require('co-wechat');
var quest = require('co-request');
var API = require('wechat-api');
var COAPI = require('../lib/cowxapi');
var appID = "wxb2ea67947cf3b9ea";
var appsecret = "7e6426bd7c7db6e0e6767d20426083cb";
var wxapi = new API(appID, appsecret);
router.get("/wxuserInfo",function*(){

	var openid = this.query["de"].split(",")[0];
	console.log("que");
	console.log(this.query);
	var access_token = this.query["de"].split(",")[1];
	var collections = this.shoots.collection("guji");
	var info = yield collections.findOne({"flag":"wxUserInfo","openid":openid});
	console.log({wxID:info.openid,face:info.headimgurl});

	this.body = {wxID:info.openid,face:info.headimgurl};
});

router.get("/wxcode",function*(){
	var collections = this.shoots.collection("guji");
	var wxcode = this.query.code;
	var returnUrl = this.query.state;
	console.log("++code++");
	console.log(wxcode);
	console.log("++code++");
	var getTokenUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxb2ea67947cf3b9ea&secret=7e6426bd7c7db6e0e6767d20426083cb&code="+wxcode+"&grant_type=authorization_code";
	var tokenAll = yield quest(getTokenUrl);
	var tokenBody = JSON.parse(tokenAll.body);
	console.log("++tokenBody++");
	console.log(tokenBody);
	console.log("++tokenBody++");


	tokenBody.expireTime = 0;
	tokenBody.expireTime = Number(tokenBody.expires_in)+(Date.now()/1000);
	tokenBody.flag = "wxToken";

	var getUserUrl = "https://api.weixin.qq.com/sns/userinfo?access_token="+tokenBody.access_token+"&openid="+tokenBody.openid+"&lang=zh_CN"
	var userInfoAll = yield quest(getUserUrl);
	var userInfo = JSON.parse(userInfoAll.body);
	if(userInfo.openid!==undefined){
		userInfo.flag = "wxUserInfo";
		yield collections.remove({"flag":"wxUserInfo","openid":userInfo.openid});
		yield collections.insert(userInfo);
		var userhas = yield collections.findOne({"flag":"wxUserInfo","userWxID":userInfo.openid});
		if(userhas===null||userhas===undefined){
			console.log("noone")
			yield collections.insert({"flag":"wxUserInfo","userWxID":userInfo.openid,"userFace":userInfo.headimgurl})
		}else{
			console.log("hasOne");
			console.log(userhas);
		}
		this.redirect("../../"+returnUrl+".html?de="+userInfo.openid+","+tokenBody.access_token);
		console.log(this.response);
	}
});

router.get('/share', function *() {

    var uri = this.query.uri;
    if (!uri) {
        uri = this.header['referer'];
        if (!uri) {
            return;
        }
    }
    console.log(uri);
    var config = yield COAPI.getJsConfig(wxapi, {
        debug: false,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'chooseImage'],
        url: uri
    });
    this.set({'Pragma': 'no-cache'});
    this.body = {
        config: JSON.stringify(config)
	}
});
module.exports = router;