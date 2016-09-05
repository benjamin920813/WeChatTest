/**
 * Created by admin on 2016/5/30 0030.
 */
$(document).ready(function(){

    var collections = shoots.collection("guji");

    collections.find({"flag":"buyInfo","userWxID":wxID},function(err,data){

        if(data.length>0){

            var html = "";
            var mytotal = 0;

            for(var j in data){

                mytotal += data[j].totalCost;

                for(var i = 0 ; i < data[j].buyCommodityIDList.length ; i ++){


                    html += '<div class="buy-list ' +data[j].buyCommodityIDList[i].buyCommodityID+'">'

                        +		'<div class="buy-img">'

                        +			'<img src="" alt="加载中...">'

                        +		'</div>'

                        +		'<div class="buy-inf">'

                        +			'<p class="buy-inf-span1">...</p>'

                        +			'<label>数量：'+data[j].buyCommodityIDList[i].buyCommodityNum+'</label>'

                        +		'</div>'

                        +	'</div>';

                }

                html  += '<div class="orderDetailControl">'

                    +       '<p style="text-align:left;">'

                    +	          '<label>订单号：</label><label class="orderNo">'+data[j].orderNum+'</label>'//<a class="return_btn" >申请退货</a>
                    +	          '<label>&nbsp;&nbsp;&nbsp;合计：</label><label>'+mytotal+'</label>'
                    +       '</p>'

                    +       '<p style="text-align:left;">'

                    +	          '<label>配送信息：</label><label class="commodityState">'+""+'</label>'

                    +       '</p>'

                    +       '<p style="text-align:right;">'

                    +	          '<a class="return_btn" >申请退货</a>'

                    +       '</p>'

                    +   '</div>';



            }

            $(".pg-content").html(html);

            addCommodityState();

            var buy_detail = [];

            $(".buy-list").each(function(index,ele){

                buy_detail.push({

                    "flag" : "sellInfo",

                    "commodityID" : $(ele).attr("id"),

                    "isSelling":true

                });

            });

            collections.find({$or:buy_detail},function(err,data){

                if(data.length===0){

                    $("body").find("img").attr("alt","商品已下架！");

                }

                for(var i = 0 ; i < data.length ; i ++){

                    try{

                        if(!data[i]){

                            $("."+data[i].commodityID).find("img").attr("alt","该商品已下架！");

                        }

                        $("."+data[i].commodityID).find("img").attr("src",data[i].commodityCoverImg);

                        $("."+data[i].commodityID).find(".buy-inf-span1").text('商品名称:'+data[i].commodityName);

                    }catch(e){}

                }

                fresh_btns();

            });

        }else{

        }

    });

    function addCommodityState(){

        $(".orderNo").each(function(index,ele){

            // $(ele).parent().parent().find(".commodityState").text($(ele).text().trim());

            $.ajax({

                type:"POST",

                url:"/serv/dbsearch/search",

                async:false,

                data:{"flag":"distributionInf_","orderNum":$(ele).text().trim()},

                success : function(data){

                    $(ele).parent().parent().find(".commodityState").text(data[0].distributionMember);

                },

                error:function(err){

                    // $(ele).parent().parent().find(".commodityState").text("err");

                }

            });

            // 	collections.findOne({"flag":"distributionInf_","orderNum":$(ele).text().trim()},function(err,data){

            // 		if(data){

            // 			$(ele).parent().parent().find(".commodityState").text(data.distributionMember);

            // 		}else{



            // 		}

            // 	})

        });

    }

    function fresh_btns(){

        $(".return_btn").click(function(){

            var return_no = $(this).parent().parent().find(".orderNo").text().trim();

            if($(this).text().trim()==="申请退货")

                window.location.href = "applicationForReturn.html?orderNo="+return_no;

        });

        $(".buy-list").click(function(){

            window.location.href="goodsDetails.html?commodityID="+$(this)[0].className.split(" ")[1];

        });

        checkOrder();

    }

    function checkOrder(){

        $(".orderNo").each(function(index,ele){

            collections.findOne({"flag" : "userReturnInf","returnOrderNum" : $(ele).text().trim(),"userWxID" : wxID},function(err,data){

                if(data!==null){

                    if(data.isDeal===true){

                        $(ele).parent().parent().find(".return_btn").text("已退货");

                    }else{

                        $(ele).parent().parent().find(".return_btn").text("处理中...");

                    }



                    $(ele).parent().parent().find(".return_btn").css("background-color","rgb(146, 150, 230)")

                    $(ele).parent().parent().find(".return_btn").show();

                }else{

                    $(ele).parent().parent().find(".return_btn").show();

                }

            });

        });

    }

});