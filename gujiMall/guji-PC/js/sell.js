/**
 * Created by admin on 2016/5/26 0026.
 */
var tipes =["请填写商品名称","请选择商品封面图片","请填写商品原价","请填写商品售价","请填写商品数量","请填写商品品牌","请填写标签","请填写商品信息","请填写原主信息","请选择商品图片","请选择商品视频","请填写估计"];

var menue_data_ =[["玩具","童车","学步车"],["贴身衣物","童装","童鞋","童包"],["推车","安全座椅","腰凳","餐椅"],["1-2岁","3-4岁","5-6岁","育儿"],["储奶袋","奶粉","辅食机","奶瓶","餐具","紫外线消毒柜"]];

var search = window.location.search.replace(/\?/, '');

var parameters_str = search.split(/&/);

var parameters = {};

for (var i in parameters_str) {

    var kv = parameters_str[i].split(/=/);

    parameters[kv[0]] = kv[1];

}

wxId_ =parameters['wxId'];

//userPhone_ =parameters['userPhone'];  //flag 为 sellInfo userPhone

reservationTime_ = parameters['reservationTime'].replace('%20',' ')||"";

commodID_ =parameters['commodID'];

var date_;

$(document).ready(function(){



    var collection_ =shoots.collection("guji");

    var selected1 =$("#select-1").val(),

        selected2 =$("#select-2").val(),

        selected3 =$("#select-3").val();



    initPlan(); //初始化原主个人信息





    $(".newCommodity").on('click',function(){

        clearEditPlan();

        createOption(menue_data_[0]);

        $("#shangpinxinxi").show();

        $(".commodityInf").show();

        $("#detaileInf").hide();

        $(".commodityInfEditSub").attr('data-kind','newEdit');

    });



    $("#newCommodityTb").on('click','tr',function(ev){



        date_ =this;

        $(this).siblings().removeClass('trch');



        if($(this).hasClass('trch')){

            $(this).removeClass('trch');

            $(".commodityInf_1").hide();

        }else{

            $(this).addClass('trch');

            $(".commodityInf_1").show();

        }



        var tdType =ev.target.dataset.bttype;

        var commodId =ev.target.dataset.commodid;

        if(tdType =='reEdit'){

            $("#shangpinxinxi").show();

            $("#detaileInf").hide();

            collection_.find({"commodityID":commodId},function(err,data){

                if(data.length !=0){

                    writeDataToEditPlan(data[0]);

                    mouseOver();

                    $(".commodityInf").show();

                    $(".commodityInfEditSub").attr({'data-kind':'reEdit','data-commodityID':commodId});

                }

            });

        }else if(tdType =='deleBt'){

            collection_.remove({"commodityID":commodId});

            $($(this).parent()[0]).remove();

            alert("删除成功");

            window.location.reload();

        }else if(tdType =='groundingBt'){

            collection_.find({"commodityID":commodId,"isSelling":true},function(err,data){

                if(data.length !=0){

                    alert("该商品已上架");

                }else{

                    collection_.update({"commodityID":commodId},{$set:{"isSelling":true,"lastModify":CurentTime()}});



                    alert("上架成功");

                    $("#"+commodId+"").find(".isSell").text("已上架");

                }

            });

        }else{

            $("#shangpinxinxi").hide();

            $("#detaileInf").show();

            writeInfToDetailsPlan(this.id);

        }

    });



    $(".commodityInfEditSub").on('click',function(){

        savecommodityInf();

    });



    $(".submiltBT").on('click',function(){

        var trList =$("#newCommodityTb").children();

        for(var i=0;i,trList.length;i++){

            collection_.update({"flag":"sellInfo","commodityID":trList[i].id},{$set:{"isSelling":true,"lastModify":CurentTime()}});

            $(trList[i]).find(".isSell").text("已上架");

            if(i==trList.length-1){

                alert("全部上架成功");

            }

        }

        console.log($("#newCommodityTb").children()[0].id);

    });

    $(".cancleBT").on('click',function(){

        collection_.remove({"flag":"reservationInf_","reservationTime":reservationTime_});

        collection_.remove({"flag":"sellInfo","reservationTime":reservationTime_});

        window.location.href ='index2.html';

    });



    $("#select-1").on('change',function(){

        console.log($(this).val());

    });

    $("#select-2").on('change',function(){

        Type =$(this)[0].selectedIndex;

        console.log(Type);

        createOption(menue_data_[Type]);

    });





    function mouseOver(){

        $(".displayNoneImg img,.videoDel,.userUpImg img").mousemove(function(event) {

            $(this).css({"cursor":"pointer"});



            if($(this).parent().find(".closeImgList").length ==0){

                var html='<img src="img/x_alt.png" class="closeImgList">';

                $(this).parent().append(html);

            }



        }).mouseout(function(event){

            if($(event.toElement).hasClass('closeImgList')){



                $(".closeImgList").on('click mouseover mouseout',function(ev){

                    if(ev.type =='click'){

                        $(this).parent().remove();

                    }else if(ev.type =='mouseover'){

                        $(this).css({"cursor":"pointer"});

                    }else{

                        $(this).remove();

                    }

                });



            }else{

                if($(this).parent().find(".closeImgList").length !=0){



                    $(this).parent().find(".closeImgList").remove();

                }

            }



        });

    }



    function writeInfToDetailsPlan(commodityID){

        collection_.find({"flag":"sellInfo","commodityID":commodityID},function(err,data){

            if(data.length !=0){

                var d =data[0];

                $(".det1").text(d.commodityName);

                $(".det2").attr('src',d.commodityCoverImg);

                $(".dgujia").text(d.gujia+"用户同意:"+d.gujiaStatus);

                $(".det3").text(d.primeCost);

                $(".det4").text(d.sellingPrice);

                $(".det5").text(d.commodityNum);

                $(".det6").text(d.commodityBrand);

                $(".det7").text(d.commodityNewLeave);

                $(".det8").text(d.commodityGenre.split("_")[0]+">"+d.commodityGenre.split("_")[1]);

                $(".det9").children().remove();

                var tagList =d.commodityTag.split(' '),html='';

                for(var i=0;i<tagList.length;i++){

                    html +='<span class="tagGoodTag">'+tagList[i]+'</span>';

                }

                $(".det9").append(html);

                $(".det10").text(d.commodityDisc);

                $(".det11").text(d.originalOwnerInf);

                $(".det12").children().remove();

                if(d.businessCommodityPic !=undefined){

                    var imgList =d.businessCommodityPic,html1='';



                    for(var j=0;j<imgList.length;j++){

                        html1 +='<div style="display:inline-block;position:relative"><img src='+imgList[j]+' alt=""></div>';

                    }

                    $(".det12").append(html1);

                }



                //商家上传视频$(".det13")

                if(d.businessCommodityVideo !=undefined){

                    $(".det13").attr('src',d.businessCommodityVideo);

                }



                //用户上传图片

                $(".det14").children().remove();

                if(d.userCommodityPic !=undefined){

                    var userImgList =d.userCommodityPic,html='';

                    for(var k=0;k<userImgList.length;k++){

                        html +='<img src='+userImgList[k]+' alt="">';

                    }

                    $(".det14").append(html);

                }

            }

        });

    }

    function createOption(data){

        $("#select-3").children().remove();

        var html ='';

        for(var i=0;i<data.length;i++){

            html +='<option>'+data[i]+'</option>';

        }

        $("#select-3").append(html);

    }



    function savecommodityInf(){

        // if(checkForm()){

        var businessCommodityPic_ =[],userCommodityPic_ =[];

        for(var i=0;i<$(".displayNoneImg").children().find(".imgListSize").length;i++){

            // var img_ =$(".displayNoneImg").children().find(".imgListSize")[i],

            // 	base64Img =getBase64Image(img_);

            // businessCommodityPic_.push(base64Img);

            var img_src =$(".displayNoneImg").children().find(".imgListSize")[i].src;

            businessCommodityPic_.push(img_src);

        }

        for(var i=0;i<$(".userUpImg").children().find(".imgListSize").length;i++){

            var img_src =$(".userUpImg").children().find(".imgListSize")[i].src;

            userCommodityPic_.push(img_src);

        }

        var sellinf_ ={

            userWxID : wxId_,

            //	userPhone : userPhone_,   //userPhone 可以去掉

            flag : "sellInfo",

            reservationTime : reservationTime_,



            commodityName : $(".inf1").val(),

            commodityCoverImg :$("#exampleInputFile1").parent().parent().find(".cover")[0].src,

            gujia : $(".gujia").val(),

            primeCost : $(".inf3").val(),

            sellingPrice : Number($(".inf4").val()),

            commodityNum : Number($(".inf5").val()),

            commodityBrand : $(".inf6").val(),

            commodityNewLeave : $("#select-1").val(),

            commodityGenre : $("#select-2").val()+'_'+$("#select-3").val(),

            commodityTag : $(".inf7").text().trim(),

            commodityDisc : $(".inf8").val(),

            originalOwnerInf : $(".inf9").val(),

            businessCommodityPic : businessCommodityPic_,

            businessCommodityVideo : $(".showVideo").attr('src'),

            userCommodityPic : userCommodityPic_

        };

        var kindEdit =$(".commodityInfEditSub").attr('data-kind');

        if(kindEdit =='newEdit'){

            sellinf_.commodityID =CurentTime_();

            collection_.insert(sellinf_);



            console.log(CurentTime_());





            collection_.update({"flag":"reservationInf_","reservationTime":reservationTime_},{$set:{"isEffic":"true"}});

            console.log(sellinf_);

            $(".commodityInf").hide();

            clearEditPlan();

            initPlan();

        }else if(kindEdit =='reEdit'){

            var reEditCommodId_ =$(".commodityInfEditSub").attr('data-commodityID');



            collection_.update({"flag":"sellInfo","commodityID":reEditCommodId_,"userWxID":wxId_},{$set:sellinf_});

            alert("保存成功");

            $(".commodityInf").hide();

            clearEditPlan();

            reEditSave(reEditCommodId_);

        }

        // }

    }

    $("#commdVideo").change(function(){

        var data = this;

        if (data.value != "") {

            var name = 'test';

            var file = shoots.file(name, data);

            file.save(function(err, data) {

                alert("视频上传成功");

                $(".userVideo").show();

                $("#commdVideo").attr('url',data.url);

                $("#commdVideo").attr('fileType',data.data.type.split('/')[0]);

                $(".showVideo").attr("src",data.url);

            }, function(err) {

                console.log(err);

            });

        }



    });

    function checkForm(){

        var isPass =true;

        $(".commodityInf .check_").each(function(index,element){

            if(index!=6 && index!=1 && index!=9 && index!=10 && index!=11){

                if($(element).val().trim() ===''){

                    alert(tipes[index]+index);

                    isPass =false;

                    return false;

                }

            }else if(index==6){

                if($(".bootstrap-tagsinput").text() ===''){

                    alert(tipes[index]);

                    isPass =false;

                    return false;

                }

            }else if(index ==1){

                if($(element).attr('src') ===''){

                    alert(tipes[index]);

                    isPass =false;

                    return false;

                }

            }else if(index ==10){

                if($(element).attr('url') ===''){

                    alert(tipes[index]);

                    isPass =false;

                    return false;

                }

            }else if(index ==11){



            }else{

                if($(element).children().length ==0){

                    alert(tipes[index]);

                    isPass =false;

                    return false;

                }

            }

        });

        // var inf11Type =$("#commdVideo").attr('fileType');

        // if(inf11Type!='video'){

        // 	alert("选择的商品视频格式不对");

        // 	return false;

        // }

        if($(".gujia").val() === ''){

            alert(tipes[11]);

            isPass =false;

        }



        return isPass;

    }

    function initPlan(){

        var data2_;

        collection_.find({"flag":'user',"userWxID":wxId_},function(err,data){

            data2_ =data[0];

            collection_.find({"flag":'reservationInf_',"userWxID":wxId_,"reservationTime":reservationTime_},function(err,data){



                writeDataToInfPlan(data[0],data2_);

            });

        });



        collection_.find({"flag":"sellInfo","userWxID":wxId_,"reservationTime":reservationTime_},function(err,data){

            if(data.length !=0){

                $("#newCommodityTb").children().remove();

                createNewCommodity(data);

            }

        });



    }



    function reEditSave(commodityID){

        var tr =$("#newCommodityTb #"+commodityID+"");

        collection_.find({"flag":"sellInfo","commodityID":commodityID,"userWxID":wxId_},function(err,data){

            if(data.length !=0){

                writeReEdit(data[0]);

            }

        });

        function writeReEdit(data){

            $(tr.find('img')[0]).attr('src',data.commodityCoverImg);

            $(tr.find('.name')[0]).text(data.commodityName);

            $(tr.find('.commodNum')[0]).text('X'+data.commodityNum);

        }



    }

    function createNewCommodity(data){

        if(data.length ==0){

            return false;

        }

        var html ='';

        for(var i=0;i<data.length;i++){

            var whichTrCh ='',isSell='上架';

            if(data[i].commodityID ==commodID_){

                whichTrCh ='trch';

            }



            if(data[i].isSelling){

                isSell ='已上架';

            }else{

                isSell ='上架';

            }

            html +='<tr id='+data[i].commodityID+' class='+whichTrCh+'>'

                +'<td style="width:170px;"><img src='+data[i].commodityCoverImg+'></td>'

                +'<td><div class="name">'+data[i].commodityName+'</div><br>货号：'+data[i].commodityID+'</td>'

                +'<td class="commodNum">X'+data[i].commodityNum+'</td>'

                +'<td style="text-align:center"><a class="btn btn-success btn-sm isSell" data-btType="groundingBt" data-commodID='+data[i].commodityID+' href="javascript:void(0);">'+isSell+'</a><br><p></p><a class="btn btn-success btn-sm " data-btType="reEdit" data-commodID='+data[i].commodityID+' href="javascript:void(0);">编辑</a><br><p></p><a class="btn btn-default btn-sm " data-btType="deleBt" data-commodID='+data[i].commodityID+' href="javascript:void(0);">删除</a></td>'

                +'</tr>';

        }

        $("#newCommodityTb").append(html);

    }

    function writeDataToEditPlan(data){

        $(".inf1").val(data.commodityName);

        $(".cover").attr('src',data.commodityCoverImg);

        $(".gujia").val(data.gujia);

        $(".inf3").val(data.primeCost);

        $(".inf4").val(data.sellingPrice);

        $(".inf5").val(data.commodityNum);

        $(".inf6").val(data.commodityBrand);

        $("#select-1").val(data.commodityNewLeave);

        $("#select-2").val(data.commodityGenre.split('_')[0]);

        var index_=$("#select-2")[0].selectedIndex;

        createOption(menue_data_[index_]);

        console.log(index_);

        $("#select-3").val(data.commodityGenre.split('_')[1]);



        var tagList =data.commodityTag.split(' ');

        $(".bootstrap-tagsinput").children('span').remove();



        var html ='';

        for(var i=0;i<tagList.length;i++){

            html +='<span class="tag label label-info">'+tagList[i]+'<span data-role="remove"></span></span>';

        }

        $(".bootstrap-tagsinput").prepend(html);

        $(".inf8").val(data.commodityDisc);

        $(".inf9").val(data.originalOwnerInf);

        if(data.businessCommodityPic !=undefined){

            var imgList =data.businessCommodityPic;

            if(imgList.length !=0){

                $(".imgListShow").show();

                $(".displayNoneImg").children().remove();

                var html ='';

                for(var i=0;i<imgList.length;i++){

                    html +='<div style="display:inline-block;position:relative"><img src='+imgList[i]+' class="imgListSize"></div>';

                }

                $(".displayNoneImg").append(html);

            }

        }

        if(data.businessCommodityVideo !=undefined){

            $(".inf11").attr('url',data.businessCommodityVideo);

            $(".showVideo").attr("src",data.businessCommodityVideo);

            $("#commdVideo").attr('fileType','video');

        }



        //用户上传图片

        if(data.userCommodityPic !=undefined){

            $(".userUpImg").children().remove();

            var userImgList =data.userCommodityPic,

                html ='';

            if(userImgList.length!=0){

                $(".userImgListShow").show();

            }

            for(var k=0;k<userImgList.length;k++){





                html +='<div style="display:inline-block;position:relative"><img src='+userImgList[k]+' class="imgListSize"></div>';

            }

            $(".userUpImg").append(html);

        }





        //商家上传视频

        // $(".inf11").val(data.businessCommodityVideo);

    }







    function clearEditPlan(){



        $(".inf1").val('');

        $(".inf2").val('');

        $(".cover").attr('src','');

        $(".gujia").val();

        $(".inf3").val('');

        $(".inf4").val('');

        $(".inf5").val('');

        $(".inf6").val('');

        $("#select-1").val('全新');

        $("#select-2").val('玩具');

        $("#select-3").val('玩具');

        $(".bootstrap-tagsinput").children('span').remove();

        $('.tagsinput').tagsinput('removeAll')

        $(".inf8").val('');

        $(".inf9").val('');

        $(".inf10").val('');

        $(".inf11").val('');

        $(".inf12").val('');

        $(".imgListShow").hide();

        $(".userImgListShow").hide();

        $(".displayNoneImg").children().remove();

        $(".showVideo").attr('src','');

        $(".userUpImg").children().remove();



        //商家上传视频还没写

        // $(".inf11").val(data.businessCommodityVideo);



        // window.location.reload();

    }

    function writeDataToInfPlan(data1,data2){

        $(".username").text(data1.reservationName);

        $(".userface").attr('src',data2.userFace);

        $(".userphone").text(data1.reservationPhone);  //userPhone flag 为 user

        $(".useraddress").text(data1.reservationAddress);

        $(".userdisc").text(data1.goodsDisc);

        $(".usernote").text(data1.userRemark);

        if(data1.reservationDate ==="weekday"){

            $(".weekday").attr("checked","checked");

        }

        if(data1.reservationDate ==="weekend"){

            $(".weekend").attr("checked","checked");

        }

    }





    $(".inf2 ").change(function(ev){//模拟上传图片

        var files = event.target.files, file;

        if (files && files.length > 0) {

            file = files[0];

            if(file.size > 1024 * 1024 * 2) {

                alert('图片大小不能超过 2MB!');

                return false;

            }

            var url =  uploadImg(files[0]);

            $(this).parent().parent().find(".cover").attr("src",url);

            // var URL = window.URL || window.webkitURL;

            // var imgURL = URL.createObjectURL(file);



        }

    });

    function uploadImg(file){

        var returnData = null;

        var form = new FormData();

        form.append( 'file', file );

        $.ajax({

            url: '../serv/upload/upload',

            data: form,

            processData: false,

            contentType :false,

            //					dataType: 'json',

            type: 'POST',

            async:false,

            success: function (data) {

                console.log(data);

                returnData = data.url;

            },

            error:function(err){

                console.log(err);

                returnData = null;

            }

        });

        return returnData;

    }

    $(".inf10").change(function(ev){

        var files = event.target.files, file;

        if (files && files.length > 0) {

            var URL = window.URL || window.webkitURL;

            var imgURL;

            var html ='';

            for(var i=0;i<files.length;i++){

                file =files[i];

                if(file.size > 1024 * 1024 * 2) {

                    alert('图片大小不能超过 2MB!');

                    return false;

                }

                imgURL =  uploadImg(file);

                // imgURL = URL.createObjectURL(file);

                html +='<div style="display:inline-block;position:relative"><img  src='+imgURL+' class="imgListSize"  /></div>';

            }

            $(".displayNoneImg").append(html);

            mouseOver();

            $(".imgListShow").show();

        }else{

            $(".imgListShow").hide();

        }

    });

    $(".inf12").change(function(ev){

        var files = event.target.files, file;

        if (files && files.length > 0) {

            var URL = window.URL || window.webkitURL;

            var imgURL;

            var html ='';

            for(var i=0;i<files.length;i++){

                file =files[i];

                if(file.size > 1024 * 1024 * 2) {

                    alert('图片大小不能超过 2MB!');

                    return false;

                }

                imgURL =  uploadImg(file);

                // imgURL = URL.createObjectURL(file);

                html +='<div style="display:inline-block;position:relative"><img  src='+imgURL+' class="imgListSize"  /></div>';

            }

            $(".userUpImg").append(html);

            mouseOver();

            $(".userImgListShow").show();

        }else{

            $(".userImgListShow").hide();

        }

    });

    function getBase64Image(img) {

        var canvas = document.createElement("canvas");

        canvas.width = img.naturalWidth;

        canvas.height = img.naturalHeight;

        var ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

        var dataURL = canvas.toDataURL("image/png");

        return dataURL ;

    }



    function CurentTime_(){

        var now = new Date();



        var year = now.getFullYear();       //年

        var month = now.getMonth() + 1;     //月

        var day = now.getDate();            //日



        var hh = now.getHours();            //时

        var mm = now.getMinutes();          //分

        var ms = now.getSeconds();

        var clock = year.toString();



        if(month < 10)

            clock += "0";

        clock += month ;



        if(day < 10)

            clock += "0";



        clock += day ;



        if(hh < 10)

            clock += "0";



        clock += hh ;

        if (mm < 10) clock += '0';

        clock += mm ;

        if(ms < 10) clock += '0';

        clock += ms;

        return clock;

    }





});
