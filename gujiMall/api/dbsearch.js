var comongo = require("co-mongo");
var Router = require("koa-router");
var router = new Router();
router.post("/search",function *(){
	var mongo_addr = "mongodb://"+this.request.header.host.trim().split(":")[0]+":27017/plugins";
	var db = yield comongo.connect(mongo_addr);
	console.log(this.request.body);
	var collection_ = yield db.collection("guji");
//	var search = JSON.parse(this.request.body);
	console.log(typeof this.request.body);
	var result = yield collection_.find(this.request.body).toArray();
	this.body = result;
	this.response.status=200;
	return;
});

router.post("/handleReturn",function *(){
	var mongo_addr = "mongodb://"+this.request.header.host.trim().split(":")[0]+":27017/plugins";
	var db = yield comongo.connect(mongo_addr);
	var collection_ = yield db.collection("guji");
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
	var mongo_addr = "mongodb://"+this.request.header.host.trim().split(":")[0]+":27017/plugins";
	var db = yield comongo.connect(mongo_addr);
	console.log(this.request.body);
	var collection_ = yield db.collection("guji");
	var commodityID = this.request.body.commodityID;
	var setData = {"commodityNum":Number(this.request.body.commodityNum)};
	yield collection_.update({"flag":"sellInfo","commodityID":commodityID},{$set:setData},{upsert:false});
	this.body = "ok";
	this.response.status=200;
	return;
});

module.exports = router;