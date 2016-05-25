var comongo = require("co-mongo");
var Router = require("koa-router");
var router = new Router();
router.post("/search",function *(){
	var collections = this.shoots.collection("guji");
//	var search = JSON.parse(this.request.body);
	console.log(this.request.body);
	var result = yield collections.find(this.request.body);
	this.body = result;
	console.log(result);
	this.response.status=200;
	return;
});
router.post("/handleReturn",function *(){
	var collection_ = this.shoots.collection("guji");
	console.log(this.request.body);
	var returnOrderNum =this.request.body.returnOrderNum;

	console.log(returnOrderNum);

	var isChecked =this.request.body.ischecked;
	var checked =true;
		if(isChecked==='false'){
			checked =false;
		}
	console.log(isChecked);
	var result1 = yield collection_.findOne({"flag":"userReturnInf","returnOrderNum":returnOrderNum});
	var isDeal =Boolean(result1.isDeal);
	console.log(isDeal);
		if(!isDeal&&checked){
			var ordernum =this.request.body.returnOrderNum;
			var result2 = yield collection_.findOne({"flag":"buyInfo","orderNum":ordernum});
			for(var i=0;i<result2.buyCommodityIDList.length;i++){
				var result3 =yield collection_.findOne({"flag":"sellInfo","commodityID":result2.buyCommodityIDList[i].buyCommodityID});
				var num =result3.commodityNum+result2.buyCommodityIDList[i].buyCommodityNum;
				yield collection_.update({"flag":"sellInfo","commodityID":result2.buyCommodityIDList[i].buyCommodityID},{$set:{"commodityNum":num}});
			}
		}

	this.body = {msg:"not one"};
	this.response.status=200;
	return;	
});


router.post("/update",function *(){
	console.log("++++++++退货++++++++");
	console.log(this.request.body);
	console.log("++++++++退货++++++++");
	var collection_ = this.shoots.collection("guji");
	var commodityID = this.request.body.commodityID;
	var setData = {"commodityNum":Number(this.request.body.commodityNum)};
	yield collection_.update({"flag":"sellInfo","commodityID":commodityID},{$set:setData},{upsert:false});
	this.body = "ok";
	this.response.status=200;
	return;
});

router.post("/updatePhone",function *(){
	var collection_ = this.shoots.collection("guji");
	var wxID = this.request.body.wxID;
	var phoneNum = this.request.body.phoneNum;
	yield collection_.update({"userWxID":wxID},{$set:{"userPhone":phoneNum}},{multi:true,upsert:true});//ing
	this.response.status=200;
	return;
});

router.get("/test",function *(){
	var collections = this.shoots.collection("guji");
	yield collections.update({"flag":'user',"userPhone":"18616304256"},{$set:{"userPhone":"120"}},{upsert:true});
	
	this.body = "ok";
	this.response.status=200;
	return;
});
router.post("/getuserinf", function *(){
	var collections = this.shoots.collection("guji");
	var time = this.request.body.time;
	var id = this.request.body.userwxid;
	console.log(time);
	var result =yield collections.findOne({"flag":"reservationInf_","reservationTime":time,"userWxID":id});
	var data ={
		userName : result.reservationName,
		userPhone : result.reservationPhone,
		userAddress : result.reservationAddress
	};
	this.body = data;
});
module.exports = router;