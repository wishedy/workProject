/**
 * Created by Administrator on 2014/12/29.
 */

$(function () {
    /**
     * @module
     */
    toggleToPC();
    comm.bindNav(5,false,false);

	var tplPath = 0;
	if($("#tplPath").size()>0 && [31,32,127,78].indexOf(parseInt($("#tplPath").val()))>-1){
		tplPath = 1;
	}
  var amChannel = comm.getpara()._amChannel;
	var callAppOptions = {
		ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=2&sourceId=" + $("#resourceId").val() + "&tplPath=" + tplPath +(amChannel?"&_amChannel="+amChannel:''),
		android: "allin://com.allin.social:75235?data={scene:3,type:2,sourceId:"+  $("#resourceId").val()  +",tplPath:" + tplPath + (amChannel?",_amChannel:"+amChannel:'')+"}",
		ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=2&sourceId=" + $("#resourceId").val() + "&tplPath=" + tplPath +(amChannel?"&_amChannel="+amChannel:''),
		runAtOnce: false
	};
	//comm.bindCallApp(callAppOptions);

	comm.recognizeAppShareLink(callAppOptions);
    if (comm.getparaNew() && comm.getparaNew().share && (comm.getparaNew().share.toLowerCase() == "app")){//app分享的链接

    }else {
        user.privExecute({
            operateType: 'auth',   //'login','auth','conference'
            callback: function () {
                if (!TempCache.getItem("detailNoNeedApp")) {
                    comm.appWakeUp("confirm", callAppOptions);//唤醒app弹层
                }
                TempCache.removeItem("detailNoNeedApp");
            }
        });
    }
    //user.needRenZhengPop();
//    $("#float").relation({
//        type:1,
//        refId:parseInt($("#resourceId").val()),
//        relationType:parseInt($("#relationType").val()),
//        isFloat:true,
//        templateStyle:"blue",
//        docSetPlace : $("#doc_set"),
//        floatClick : true
//    });
    
    //中英文切换
    if($(".ch_en")){
        $(".ch_en").attr("oe","ch");
        $(".ch_en").on("vclick",function(){
            //切换成中文
            if($(this).attr("oe")=="en"){
                $(".ch_en").attr("oe","ch");
                $(this).find(".ch_en_center").text("切换到英文版");
                $(".oe_ch").show();
                $(".oe_en").hide();
            }else{
                //切换成英文
                $(".ch_en").attr("oe","en");
                $(this).find(".ch_en_center").text("切换到中文版");
                $(".oe_ch").hide();
                $(".oe_en").show();
            }

        });
    }
    $(".down").on("vclick",function(){
        setTimeout(function(){
            $(".author_show").hide();
            $(".author_hide").show();
            return false;
        },500);
    });
    $(".up").on("vclick",function(){
        setTimeout(function(){
            $(".author_hide").hide();
            $(".author_show").show();
            return false;
        },500);
    });

    /** @namespace */
    var doc={
    	    init:function(){
    	    	initShareWeixin();
    	    	updateViewdNum();
                this.bindScrollBox();
    	    },
            bindScrollBox: function () {
            // 推荐视频的滑动
            $(".scroll-box").on("vmousedown" ,function(e){
                var startMX,startLeft;
                var scrollBoxParent = $(this).parent().get(0);
                startMX = e.pageX;

                startLeft = scrollBoxParent.scrollLeft;
                $(this).on("vmousemove",function(e){
                    var newMX = e.pageX,
                        mx = newMX-startMX,
                        nowX = startLeft - mx;
                    //console.log("nowx:"+nowX + ",left:"+startLeft+",width:"+$(this).parent().width());
                    if(nowX<($(this).find(".scroll-box1").get(0).offsetWidth-$(this).parent().width())){
                        scrollBoxParent.scrollLeft=nowX;
                    }
                });
            });

            $(".scroll-box").on("vmouseup",function(){
                $(".scroll-box").off("vmousemove touchmove");
            });

            $(".slider-ctl-box .right").on("vclick", function () {
                var o =   $(".scroll-box1 li").eq(0);
                var liW = o.width() + parseInt(o.css("marginRight"));
                var w =  $(".scroll-box1").width();
                var sW =  $(".scroll-wrap").width();
                var oL = $(".scroll-wrap").get(0).scrollLeft;
                if((w-oL)>sW){
                    if((w-oL)>2*liW){
                        $(".scroll-wrap").eq(0).animate({"scrollLeft":$(".scroll-wrap").get(0).scrollLeft+liW*2});
                    }else{
                        $(".scroll-wrap").eq(0).animate({"scrollLeft": w-sW});
                    }
                }else{
                    $(".scroll-wrap").eq(0).animate({"scrollLeft": w-sW});
                }
            });
            $(".slider-ctl-box .left").on("vclick", function () {
                var o =   $(".scroll-box1 li").eq(0);
                var liW = o.width() + parseInt(o.css("marginRight"));
                var w =  $(".scroll-box1").width();
                var sW =  $(".scroll-wrap").width();
                var oL = $(".scroll-wrap").get(0).scrollLeft;
                if(oL>sW){
                    if(oL>2*liW){
                        $(".scroll-wrap").eq(0).animate({"scrollLeft":$(".scroll-wrap").get(0).scrollLeft-liW*2});
                    }else{
                        $(".scroll-wrap").eq(0).animate({"scrollLeft":0});
                    }
                }else{
                    $(".scroll-wrap").eq(0).animate({"scrollLeft":0});
                }
            });
        }
    };
    doc.init();
    //草稿提示
    /*var resourceId=$("#resourceId").val();//资源id
    comm.draftRemind({
        url:"/mcall/customer/draft/reviewOperate/",
        data:{refId:resourceId,reviewType:2,operateType:1},//reviewType 4:话题 7:病例;
        type:2, //1:频道页 2:详情页
        resourceId:resourceId,
        resourceType:2,//resourceType 1-视频，2-文库，4-话题 ,7-病例
        data2:{refId:resourceId,reviewType:2,operateType:2}//operateType 1:说明执行的是判断是否加载提示操作 2:关闭提示
    });*/
    //window.onload=Log.createBrowse(5,"文库终端页面"); //	浏览日志
    
});


function updateViewdNum() {
    commdata.asyncExecute("updateDocNum",{"propertyKey":"browseNum","type":"plus","docId":$("#resourceId").val()});
}

/**
 * 微信分享
 */

function initShareWeixin(){	
	var weiXinTitle="";
	var weiXinDesc="";
	var weiXinLogo="//m.allinmd.cn/image/allin_logo.png";
    var resourceId = $('#resourceId').val();
    var refCustomerId = $('#authCustomerId').length>0?$('#authCustomerId').val():"";
	WeixinJSApi.title=function(){
		var resourceTitle=$("#docName").val().trim();
        var nameCard = $('.user_fabu_sq a').eq(0).text().trim();//作者名称
            nameCard = ((nameCard =='唯医小编'||nameCard=="")?"":nameCard+":");//作者名称为唯医小编时为空
		if(!resourceTitle){
			resourceTitle=$(".case_detail_title").text().trim();
		}
		if(comm.getLength(resourceTitle)>30){resourceTitle=comm.cutstr(resourceTitle,30)+"..."}
		if(resourceTitle && resourceTitle!="")
		weiXinTitle=nameCard+"《"+resourceTitle+"》 —唯医文库, allinmd";
		return weiXinTitle;
	};
	WeixinJSApi.desc=function(){
		var resourceDesc=$("#docAbstract").val().trim();
		if(comm.getLength(resourceDesc)>55){resourceDesc=comm.cutstr(resourceDesc,52)+"..."}
		if(resourceDesc && resourceDesc!="")
		weiXinDesc=resourceDesc;
		return weiXinDesc;
	};
	WeixinJSApi.imgUrl=function(){
        weiXinLogo = $('#shareImgSrc').val();
        return weiXinLogo;
	};
    WeixinJSApi.appSuc = function(){
        comm.shareLog({
            shareType: 2,
            resourceId:resourceId ,
            resourceType: 2,
            refId: resourceId,
            isValid: 1,
            shareSence:5,
            shareChannel:4,
            shareContent:weiXinTitle,
            refCustomerId:refCustomerId
        });
    };
    WeixinJSApi.timeLineSuc = function(){
        comm.shareLog({
            shareType: 2,
            resourceId:resourceId ,
            resourceType: 2,
            refId: resourceId,
            isValid: 1,
            shareSence:5,
            shareChannel:5,
            shareContent:weiXinTitle,
            refCustomerId:refCustomerId
        });
    }
}
