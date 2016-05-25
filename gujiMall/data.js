//商家上传图片
	var sellerCommodityPic_ ={
			commodityID : "commodityID",
			flag:"sellerImg",
			img:[
				"  ",
				"  "

			],
			video:""
		},
		 user ={
			//微信ID 
			userWxID : 'wxID',
			flag : "user",
			//用户基本信息
			//姓名
			userName : "name",

			userFace : "",
			//手机
			userPhone : "phoneNum",
			//地址
			userAddress : "address",

			score : 0
		},
		reservationInf_={
			userWxID : 'wxID',
			flag : "reservationInf_",

			goodsDisc : '描述 ',
			//备注
			userRemark : '备注',
			//预约时间
			reservationDate : "周末",
			//预约提交时间
			reservationTime : "2012-09-10 21:21:21"
		},
		sellInf = {
			userWxID : 'wxID',
			flag : "sellInfo",
			commodityID : "commodityID",
			//商品名称
			commodityName : "commodityName",
			//商品原价
			primeCost : "primeCost",
			//商品售价
			sellingPrice : "sellingPrice",
			//商品品牌
			commodityBrand : "commodityBrand",
			//新旧程度
			commodityNewLeave :'',
			//商品类型
			commodityGenre : "pGenre_cGenre",
			//商品标签
			commodityTag :'',
			//商品信息
			commodityDisc : "commodityDisc",
			//原主信息
			originalOwnerInf : "originalOwnerInf",
			//商家上传图片
			businessCommodityPic : [],
			//商家上传视频
			businessCommodityVideo : "commodityVideo",
			//商品封面图片
			commodityCoverImg : "commodityCoverImg",
			reservationTime :"",
			//商品数量
			commodityNum : 0,
			userCommodityPic:[],
			lastModify : "",

			isSelling : false
		},
		buyInf = {
			userWxID : 'wxID',
			flag : "buyInfo",
			orderNum : '订单号',
			//买入商品的货号
			buyCommodityIDList : [
				"buyCommodityID":"",
				"buyCommodityNum":""
			],
			totalCost : 0,
			buyTime : "时间"
		},
		distributionInf_ ={
			userWxID : 'wxID',
			flag : "distributionInf_",
			orderNum : '订单号',
			//是否送货
			distributionState : "distributionState",
			//商品总金额
			distributionCost : "commodityCost",
			//配送员
			distributionMember : "distributionMember"
		},
		userReturnInf ={
			userWxID : 'wxID',
			flag : "userReturnInf",
			//订单号
			returnOrderNum : "returnOrderNum",
			//退货原因
			returnReason : "returnReason",
			isDeal:false
		};