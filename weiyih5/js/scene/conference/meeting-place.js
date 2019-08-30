$(function(){
     if(intransit)return;

    if(typeof comm.getpara()!=null && !isEmptyObject(comm.getpara())){
        var conId = comm.getpara().conId;
        /*if(conId=="1425810871312"){
            if(user.getLoginStatus()){
                var rst;
                $.ajax({
                    url:"/mcall/customer/auth/getAttendVideoStatus/",
                    dataType:"json",
                    type:"POST",
                    success: function (data) {
                        var rst = data.responseObject;
                        var userInfo = rst.responseData;
                        if(rst.responseStatus){ // 数据完整
                            comm.redirect("http://goodservice-zd.gensee.com/webcast/site/entry/join-917d74ba1ad9400386b42f6c285b20d9?token=333333&nickName=" +  userInfo.lastName + userInfo.firstName);
                        }else{      
                            TempCache.setItem("userInfo", $.toJSON(userInfo));
                            TempCache.setItem("fromPage", "http://goodservice-zd.gensee.com/webcast/site/entry/join-917d74ba1ad9400386b42f6c285b20d9?token=333333&nickName=");
                           window.location.href= "/html/pages/conference/liveshow/add-info.html";
                        }
                    }
                })

            }else{
                swal({title:"请先登录",confirmButtonText:"确定",cancelButtonText:"取消"},function(){
                    TempCache.setItem("fromPage", window.location.href);
                    window.location.href = "/html/pages/passport/login_select.html";
                });
                //TempCache.setItem("fromPage",window.location.href);
            }
            return false;
        }*/
        var data = commdata.getData("getConferenceSubList",{pageIndex:1,pageSize:200,conId:conId});
        var str = '<ul data-role="listview" data-theme="g" class="listv">';
        var conName = comm.getpara().conName;
        if(data.length){
            for(var i = 0 ; i< data.length;i++){

                switch(data[i].isOnline){
                    case 1:
                        str += '<li><a href="/pages/conference/live-wrap.html?conSubId='+ data[i].id +'&conId='+ conId +'&liveId='+ data[i].liveId + "&token=" + data[i].authcode + '&title='+data[i].conSubName+ '-' + conName +'" data-ajax="false" con-name='+data[i].conSubName+'><span>点击直播</span>'+ data[i].conSubName +'</a></li>';
                        break;
                    case 2:
                        str += '<li><a href="/pages/conference/live.html?conSubId='+ data[i].id +'&title='+data[i].conSubName+'" data-ajax="false" con-name='+data[i].conSubName+'><span>点击直播</span>'+ data[i].conSubName +'</a></li>';
                        break;
                    default:
                        str += '<li><a href="/pages/conference/schedule.html?conSubId='+ data[i].id +'&conId='+ conId +'&conSubName='+data[i].conSubName+'" data-ajax="false" con-name='+data[i].conSubName+'><span>点击观看</span>'+ data[i].conSubName +'</a></li>';

                }

            }
        }else{
            str = "本会场暂无相关信息，请检查";
        }
        str += "</ul>";
        $("[data-role=page]").append(str);
      /*  $(".listv li a").prepend("<span>点击观看</span>")*/
        $(".listv").listview();
    }else{
        alert("无相关数据");
    }

    comm.bindNav(4,false);
    initShareWeixin(conId);
});

function initShareWeixin(conId){
	var weiXinTitle="";
	var weiXinDesc="";
	WeixinJSApi.title=function(){
		var conSubName=$(".ui-listview a:eq(0) ").attr("con-name");
		if(conSubName && conSubName!=null){
			if(conSubName.length>30){conSubName=conSubName.substr(0,30)+"..."}
			weiXinTitle=conSubName;	
		}
		return weiXinTitle;
	};
    WeixinJSApi.appSuc = function(){
        comm.shareLog({
            shareType: 3,
            resourceId:conId ,
            resourceType: 3,
            refId: conId,
            isValid: 1,
            shareSence:25,
            shareChannel:4,
            shareContent:weiXinTitle
        });
    };
    WeixinJSApi.timeLineSuc = function(){
        comm.shareLog({
            shareType: 3,
            resourceId:conId ,
            resourceType: 3,
            refId: conId,
            isValid: 1,
            shareSence:25,
            shareChannel:5,
            shareContent:weiXinTitle
        });
    }
	WeixinJSApi.init();
}

