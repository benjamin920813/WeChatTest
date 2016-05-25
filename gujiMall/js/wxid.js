var wxID = "";
var face = "";
var appID = "wxb2ea67947cf3b9ea";
var search = window.location.search.replace(/\?/, '');
var parameters_str = search.split(/&/);
var wxConfig = {};
var parameters = {};
for (var i in parameters_str) {
	var kv = parameters_str[i].split(/=/);
	parameters[kv[0]] = kv[1];
}
var detail =parameters['de'];
if($.cookie===undefined){
	$("body").append("<script src='js/jquery.cookie.js'></script>");
}else{
}
if(detail!==undefined){
	$.cookie("userwxInfo",detail, { expires:1});
}else{
}
if($.cookie("userwxInfo")===undefined||$.cookie("userwxInfo")==="undefined,undefined"){
	var returnUrl = window.location.pathname.trim().split("/")[window.location.pathname.split("/").length-1].split(".")[0];
	window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appID+"&redirect_uri=http%3a%2f%2fwww.grecycle.com.cn%2fserv%2fwechat%2fwxcode&response_type=code&scope=snsapi_userinfo&state="+returnUrl+"#wechat_redirect"
}else{
	$.ajax({
		type:"post",
		url:"serv/dbsearch/search",
		data:{"flag":"wxUserInfo","openid":$.cookie("userwxInfo").trim().split(",")[0]},
		async:false,
		success:function(data){
			if(data.length===0){
				var returnUrl = window.location.pathname.trim().split("/")[window.location.pathname.split("/").length-1].split(".")[0];
				window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appID+"&redirect_uri=http%3a%2f%2fwww.grecycle.com.cn%2fserv%2fwechat%2fwxcode&response_type=code&scope=snsapi_userinfo&state="+returnUrl+"#wechat_redirect"
			}else{
				var user = $.cookie("userwxInfo");
				$.ajax({
					type:"get",
					url:"serv/wechat/wxuserInfo?de="+user,
					async:false,
					success:function(data){
						wxID = data.wxID;
						face = data.face;

					}
				});
			}
		}
	});		
}
$.ajax({
	type:"get",
	url:"serv/wechat/share?uri="+encodeURIComponent(window.location.href),
	async:false,
	success:function(config){
		var config = JSON.parse(config.config);
		wxConfig = config;
	}
});
