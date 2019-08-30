/**
 * 针对多场视频回放
 * */
var conData;
$(function(){
	//comm.forceHttp();
	
	//新版chrome  火狐存在公共聊天位移
	setTimeout(function(){
		$("#widget-chat").removeAttr("style");
		$("#widget-chat").css({
			"visibility":"visible",
			"padding":"10px",
			"height":"422px",
			"border-top":"1px solid #000"
		});
	},800);
	
	$(".phiz-btn,#chat-area,body").on("click",function(ev){
		$(".chat-cnt").css({"height":"201px"});
		
	});
	
	//设置第八届会议的所需Id   
	var conId = $.getUrlParam("conId"); //会议id"1408944750661";//
	var conSubId = $.getUrlParam("conSubId"); //分会场id"102";//
	var ownerid = $.getUrlParam("ownerid");  //直播id"3f674c281e704fe598c6b7dde1fa72b5"

	//防止直接输入直播地址过来
	if(conId === null){
		conId = 1408944750661;
	}
	
	//会议列表地址
	var conListPath = "/html/conference/"+conId+"/1/meeting_index.html";

	//基础校验
	if(ownerid === null || ownerid.length !== 32) g_sps.jump(null, conListPath);
	if(conId === null || conId.length !== 13) g_sps.jump(null, conListPath);
	if(conSubId === null) g_sps.jump(null, conListPath);
	
	var obj = {
		conId : conId,
		conSubId : conSubId,
		ownerid : ownerid,
		conListPath : conListPath
	}
	
	//只执行一次 
	GlobalOneStatusBrowse = false;
	
	//开始直播
	setTimeout(function(){
		changeVideo(obj);
		
		setTimeout(function(){
			$(".Ev-Show").show();
		},2000);
		
	},1000);
	
});

function isValidAuth(callBackUrl){//验证规则是否能够观看
	function authority(rs){
		var subId  = $.getUrlParam("conSubId"),
			data   = rs.responseObject.responseData.data_list[0].menu_data_list,
			authority=0;
		conData=data;
		//获取当前所需权限 观看权限(1所有、2登录、3认证、4caos缴费)
		$.each(data, function(i,el){
			if(el.id == subId){
				authority= el.authority;
			}
		});

		//如果未匹配到数据配置的分会场信息，则回首页
		var href = this.backURL;
		if(!authority) g_sps.jump(null, href);

		//是否登录/认证
		var isLogin= $.trim($("#sesCustomerId").val()).length !== 0 ? true: false;
		var isAuth = $.trim($("#sesAuth").val());
		if( isAuth == 2 || isAuth == 7 || isAuth == 8 || isAuth == 9) isAuth = true; else isAuth = false;
		var href = this.backURL;
		// 匹配结果
		switch(authority){
			case 1: break;														 //所有
			case 2: if(!isLogin){ g_sps.jump(null, href);} break; //登录
			case 3: if(!isAuth){ g_sps.jump(null, href); } break; //认证
			case 4: break;
			default: g_sps.jump(null, href);
		}
	}

	var data={};
	data.paramJson = $.toJSON({conId:$.getUrlParam("conId")});
	$.ajax({url: PC_CALL+"conference/index/getAllSubConferenceListV2/", type: "POST",data:data, backURL:callBackUrl}).done(authority);
} 

function nameAjax(){ //获取名字
	var User = {};
	$.ajax({
		url : PC_CALL+"customer/auth/getAuthBycustomerId/",
		type : "POST",
		data : {},
		async : false,
		success : function(data){
			if(data.responseObject.lastName+data.responseObject.firstName){
				User.nickname = data.responseObject.lastName+data.responseObject.firstName+"_"+data.responseObject.customerId+"_1_"+location.search.split("conSubId=")[1];
			}else{
				User.nickname = "游客"+"_"+(data.responseObject.customerId?data.responseObject.customerId:0)+"_1_"+location.search.split("conSubId=")[1];
			}
			User.id = data.responseObject.customerId;
			$("#sesAuth").val(data.responseObject.state);
		}
	});
	return User;
}

//选择视频
function changeVideo(obj){
	//清空当前聊天记录
	$("#chat-list").empty();
	
    /*if(GlobalOneStatusBrowse){
    		// 添加浏览日志
    	    var log = {};
    	    log.href = "/pages/channel/conference/multi-conference/playback.html?ownerid="+  obj.ownerid+"&conId="+ obj.conId +"&conSubId="+ obj.conSubId;
    	    log.id = 26;
    	    log.name = "会议回放页";
    		comm.Log.createBrowse(log);
    }*/
    
    User = nameAjax();
	var id= obj.ownerid;
	var playLiveAuthcode = $("#videoComponent").attr("authcode");
	
	var channel = GS.createChannel(); 
	//2.通过通道监听在线人数事件
	/*channel.bind("onUserOnline", function(event) {
		$("#peopleNum").html(event.data.count); 
	});*/
	
	$("#videoComponent").attr("uid",User.id);
	$("#videoComponent").attr("uname",User.nickname);
	$("#videoComponent").attr("ownerid",obj.ownerid);
	
	//video
	$.ajax({     
        url:'//weiyiwang.gensee.com/sdk/site/sdk/vod?widgetid=videoComponent&id=videoComponent&site=weiyiwang.gensee.com&ctx=webcast&ownerid='+id+'&uid='+User.id+'&uname='+User.nickname+'&authcode='+playLiveAuthcode,
        dataType:"jsonp",
        jsonp:"jsonpcallback",
        jsonpCallback:"__GSJsonp.jsonpcallback_0",
        success:function(data){
        }
    });
	__GSJsonp.jsonpcallback_0 =function(a){
		$("#videoComponent").html(a);
	};
	
	//doc
	$.ajax({
		url:'//weiyiwang.gensee.com/sdk/site/sdk/doc?widgetid=docComponent&id=docComponent&site=weiyiwang.gensee.com&class=gs-sdk-widget&ctx=webcast&ownerid='+id+'&uid='+User.id+'&uname='+User.nickname+'&authcode='+playLiveAuthcode,
        dataType:"jsonp",
        jsonp:"jsonpcallback",
        jsonpCallback:"__GSJsonp.jsonpcallback_1",
        success:function(data){
        }
	});
	__GSJsonp.jsonpcallback_1 =function(a){
		$("#docComponent").html(a);
	};
	
	
	//地址参数配置
	var params = {};
	
	var conListURL = PC_CALL+"conference/index/getAllSubConferenceListV2/"; //分会场列表
	//conSubType:1-分会,2-卫星会;
	//is_online:'是否在线直播(0-不直播、1-展视互动-直播、2-厂商-直播、3-展视互动-回播；)',
	//conId:'会议id';
	//conIdList: 会议id串

	params.paramJson = $.toJSON({conId: obj.conId, isOnline: 3 }); //分会场参数
	ajaxList(conListURL,params,obj,"con");
	
	var conSubListURL = PC_CALL+"conference/index/getConferenceDateList/"; //分会场日程
	params.paramJson = $.toJSON({conSubId : obj.conSubId}); //分会场日程参数
	ajaxList(conSubListURL,params,obj,"conSub");
}

function listCtrl(data,src,obj){ //数据控制
	
	if(src==="con"){ //分会场
		var kv = data.data_list[0].menu_data_list;
		var html = "";
		$.each(kv,function(i,el){
			if(el.id == obj.conSubId){
				document.title=el.conSubName+"回放-唯医,allinmd";
				$(".ev-currColumn").text(el.conSubName);
				$(".ev-currColumn").attr("data-ownerid",el.liveId);
				$(".ev-currColumn").attr("data-conSubId",el.conSubId);
			}else{
				html += conListTemplate(el);
			}
		})
		
		$(".ev-conList").html(html).find("li").on("click",function(){//主导航
			obj.conSubId = $(this).attr("data-conSubId");
			obj.ownerid = $(this).attr("data-ownerid");
			var authority=0;
			var _href="/html/conference/"+$.getUrlParam("conId")+"/1/meeting_index.html";

			//获取当前所需权限 观看权限(1所有、2登录、3认证、4caos缴费)
			$.each(conData, function(i,el){
				if(el.id == obj.conSubId){
					authority= el.authority;
				}
			});

			//如果未匹配到数据配置的分会场信息，则回首页
			if(!authority) g_sps.jump(null,  _href);

			//是否登录/认证
			var isLogin= $.trim($("#sesCustomerId").val()).length !== 0 ? true: false;
			var isAuth = $.trim($("#sesAuth").val());
			if(isAuth == 2 || isAuth == 7 || isAuth == 8 || isAuth == 9) isAuth = true; else isAuth = false;

			// 匹配结果
			switch(authority){
				case 1: break;														 //所有
				case 2: if(!isLogin){ g_sps.jump(null, _href); } break; //登录
				case 3: if(!isAuth){ g_sps.jump(null, _href); } break; //认证
				case 4: break;
				default: g_sps.jump(null, _href);
			}
			GlobalOneStatusBrowse = true;
			changeVideo(obj);
		}); 
		
	}else{ //秀分会场日程
		
		//非PC端跳手机版 为了取标题
		if(!comm.equipment.IsPC()){
            g_sps.jump(null,"//m.allinmd.cn/pages/conference/live-wrap.html?conSubId="+$.getUrlParam("conSubId")+"&conId="+$.getUrlParam("conId")+"&playBackId="+$.getUrlParam("ownerid")+"&token=333333");
			return false;
		}
		
		isValidAuth("/html/conference/"+$.getUrlParam("conId")+"/1/meeting_index.html");
		
		var kv = data.data_list[0].menu_list_agenda;
		var html = "";
		$.each(kv,function(i,el){
			if(el.isOnline && el.isValid){ html += conSubListTemplate(el); }
		});
		
		$(".ev-conSubListDate").html(kv[0].startTime.substr(0,10));
		$(".ev-conSubList").html(html);
	}
}

function conListTemplate(el){ //分会场列表模版
	return '<li data-ownerid="'+el.playBackId+'" data-conSubId="'+el.id+'">'+el.conSubName+'</li>';
}

function conSubListTemplate(el){ //某个分会场日程模版
	return '<li>'+
	    '<div class="biao_top"></div>'+
	    '<div class="position_time">'+el.startTime.substr(11)+'</div>'+
	    '<div style="margin:0 13px;"><span style="color:#266ba2; margin-right:13px;">'+el.lecturer+'</span>'+el.conName+'</div>'+
    '</li>';
}

//异步获取列表
function ajaxList(url,params,obj,src){
	$.ajax({
		url : url,
		type : "POST",
		data : params,
		success : function(data){
			if(data != null && data.responseObject.responseStatus) listCtrl(data.responseObject.responseData,src,obj);
			//window.location.href = obj.conListPath; //直接跳回直播列表
		}
	})
}

