/* 本文件放在jQuery后面 */

/* 往页面添加弹出框 */
var addPopUp = function(id,title,msg,choose){
	if(choose){//有函数，多显示取消按钮
		$("body")
		.append('<div class="modal fade" id="'+id+'" tabindex="-1" role="dialog" style="z-index: 900000;"  aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static">'
			+'<div class="modal-dialog" style="width: 400px;z-index: 900000;">'
				+'<div class="modal-content">'
					+'<div class="modal-header">'
						+'<button type="button" class="close" data-dismiss="modal">'
							+'<span aria-hidden="true">&times;</span><span class="sr-only">关闭</span>'
						+'</button>'
						+'<h4 class="modal-title" id="myModalLabel">'+title+'</h4>'
					+'</div>'
					+'<div class="modal-body" align="center" style="font-size: 16px">'
						+msg
					+'</div>'
					+'<div class="modal-footer">'
						+'<a type="button" class="kdmall-btn"   id="'+id+'_sure"  >确定</a>'
						+"&nbsp;&nbsp;"
						+'<a type="button" class="kdmall-btn"   id="'+id+'_cancel"  >取消</a>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>');
	}else{//有函数，不显示取消按钮
		$("body")
		.append('<div class="modal fade" id="'+id+'" tabindex="-1" role="dialog"  aria-labelledby="myModalLabel" aria-hidden="true">'
			+'<div class="modal-dialog" style="width: 400px;">'
				+'<div class="modal-content">'
					+'<div class="modal-header">'
						+'<button type="button" class="close" data-dismiss="modal">'
							+'<span aria-hidden="true">&times;</span><span class="sr-only">关闭</span>'
						+'</button>'
						+'<h4 class="modal-title" id="myModalLabel">'+title+'</h4>'
					+'</div>'
					+'<div class="modal-body" align="center" style="font-size: 16px">'
						+msg
					+'</div>'
					+'<div class="modal-footer">'
						+'<a type="button" class="kdmall-btn"   id="'+id+'_sure"  >确定</a>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>');
	}
}
/* 定义弹出框调用方法 */
var guli_confirm = function(title,msg,func,funcs){//标题，提示信息，点击确认执行的函数，点击确认执行的函数
	var id = 'confirmWindow';
	if( typeof(func) == 'function'){
		// 往页面添加弹出框
		addPopUp(id,title,msg,true);
		$('#'+id).modal({backdrop: 'static', keyboard: false});
		// 显示弹出框
		$('#'+id).modal('show');
		// 绑定确定按钮事件
		$('#'+id+'_sure').click(function(){
			func();
			$('#'+id).modal('hide');
			$(".modal-backdrop").hide();
			$('#'+id).remove();
			$('body').removeClass("modal-open");
		});
		// 绑定取消按钮事件
		
			$('#'+id+'_cancel').click(function(){
				if(typeof(funcs)=='function'){
					funcs();
				}
				$('#'+id).modal('hide');
				$(".modal-backdrop").hide();
				$('#'+id).remove();
				$('body').removeClass("modal-open");
			});
		
	
	}else{
		// 往页面添加弹出框
		addPopUp(id,title,msg,true);
		$('#'+id).modal({backdrop: 'static', keyboard: false});
		// 显示弹出框
		$('#'+id).modal('show');
		// 绑定确定按钮事件
		$('#'+id+'_sure','#'+id+'_cancel').click(function(){
			$('#'+id).modal('hide');
			$(".modal-backdrop").hide();
			$('#'+id).remove();
			$('body').removeClass("modal-open");
		});
	}
}
var guli_alert = function(title,msg,func){
	var id = 'alertWindow';

	if( typeof(func) == 'function'){
		// 往页面添加弹出框
		addPopUp(id,title,msg,false);
		$('#'+id).modal({backdrop: 'static', keyboard: false});
		// 显示弹出框
		$('#'+id).modal('show');
		// 绑定确定按钮事件
		$('#'+id+'_sure').click(function(){
			func();
			$('#'+id).modal('hide');
			$(".modal-backdrop").hide();
			$('#'+id).remove();
			$('body').removeClass("modal-open");
		});
	}else{
		// 往页面添加弹出框
		addPopUp(id,title,msg,false);
		
		// 显示弹出框
		$('#'+id).modal('show');
		$('#'+id).modal({backdrop: 'static', keyboard: false});
		// 绑定确定按钮事件
		$('#'+id+'_sure').click(function(){
			$('#'+id).modal('hide');
			$(".modal-backdrop").hide();
			$('#'+id).remove();
			$('body').removeClass("modal-open");
		});
	}
}

var refresh = function(){
	window.location.href = window.location.href;
}

/*================================================================*/
/*
 flag(string类型):
 "cancle":只显示取消按钮
 "sure":只显示确认按钮
 不传值或者传入all:两个按钮都显示
 isShow(true/false):
 是否显示窗口标题
 title(string类型):
 信息窗口标题
 msg(string类型)：
 窗口中要显示的信息
 obj：
 要调用的函数对象（含参数）
 五个参数必传

 Tip：
 1、参数必须是4个；
 2、使用信息窗口，必须在页面加载的时候调用createMsgWindow()函数，该函数是用来创建信息窗口到页面的。
 调用该函数就可以显示弹出框
 */
function guliwxalert(flag, title, msg, fu, data){
	if($(".msg_window").size() == 0){
		$("body").eq(0).children().last().after('<div class="layer_ display_none"><table style="width:100%;height:100%;"><tr><td><div class="msg_window display_none"><ul><li class="title_li"></li><li class="content_li"></li><li class="btn_li"><span class="quxiao1 cancel_btn" style="color:#f74e61;">取消</span><span class="center"></span><span class="queding1 sure_btn"  style="color:#f74e61;">确定</span></li></ul></div></td></tr></table></div>');
	}
	$(".cancel_btn").on("click",function(){
		$(".layer_").addClass("display_none");
		$(".msg_window").addClass("display_none");
		return false;
	});
	$(".sure_btn").on("click",function(e){
		$(".layer_").addClass("display_none");
		$(".msg_window").addClass("display_none");
		if(Object.prototype.toString.call(fu)==="[object Function]") fu(data);
		return false;
	});
	if(flag == ""){
		$(".center").css("display","block");
		$(".cancel_btn").removeClass("quxiao1 quxiao").addClass("quxiao1").css("display","block");
		$(".sure_btn").removeClass("queding1 queding").addClass("queding1").css("display","block");
	}else if(flag.toLowerCase() == "cancle"){
		$(".center").css("display","none");
		$(".sure_btn").css("display","none");
		$(".cancel_btn").css("display","block").removeClass("quxiao1").addClass("quxiao");
	}
	else if(flag.toLowerCase() == "sure"){
		$(".center").css("display","none");
		$(".cancel_btn").css("display","none");
		$(".sure_btn").css("display","block").removeClass("queding1").addClass("queding");
	}

	if(title){
		$(".title_li").html(title);
	}
	else{
		$(".title_li").html("");
	}
	$(".content_li").html(msg);
	$(".layer_").removeClass("display_none");
	$(".msg_window").removeClass("display_none");
}
/*================================================================*/