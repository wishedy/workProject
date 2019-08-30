/**
 * 针对定期的单场视频直播
 * */
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

	//会议列表地址
	var conListPath = "/html/conference/"+conId+"/1/meeting_live.html";
	
	//基础校验
	if(ownerid === null || ownerid.length !== 32) g_sps.jump(null,conListPath);
	if(conId === null || conId.length !== 13) g_sps.jump(null,conListPath);
	if(conSubId === null) g_sps.jump(null,conListPath);
	
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

function isForeign(){ //是否海外
	var foreign = false;
	$.ajax({
		url: PC_CALL+"log/op/location/getIpArea/",
		type: "POST",
		data: {},
		async: false,
		success: function(data){
			if(data.responseObject.responseData.countryCode !== "CN"){ foreign = true;
			}else{ foreign = false; }
		}
	});
	return foreign;
}
//获取浏览数
function getBrowseNum(){
	setInterval(function(){
		$.ajax({
			url:PC_CALL+"conference/index/getLiveCount/",
			dataType:"json",
			type:"post",
			data:{paramJson:$.toJSON({conSubId:$.getUrlParam("conSubId")})},
			success:function(res){
				if(comm.hasResponseData(res)){
					var count = res.responseObject.responseData.count;
					if(count){
						$('#peopleNum').html(count).show();
					}
				}
			}
		});
	},60*1000);
}
function isValidAuth(callBackUrl){//验证规则是否能够观看
	function authority(rs){
		var subId  = $.getUrlParam("conSubId"), 
			data   = rs.responseObject.responseData.data_list&&rs.responseObject.responseData.data_list[0].menu_data_list,
			authority=0;
		
		//获取当前所需权限 观看权限(1所有、2登录、3认证、4caos缴费)
		if(data){
			$.each(data, function(i,el){
				if(el.id == subId){
					authority= el.authority;
					$("#peopleNum").text(el.browseNum);
				}
			});
		}
		//如果未匹配到数据配置的分会场信息，则回首页
		var hr = this.backURL;
		if(!authority) g_sps.jump(null,hr);
		
		//是否登录/认证
		var isLogin= $.trim($("#sesCustomerId").val()).length !== 0 ? true: false;
		var isAuth = $.trim($("#sesAuth").val());
		if(isAuth == 2 || isAuth == 7 || isAuth == 8 || isAuth == 9 ) isAuth = true; else isAuth = false;
		
		// 匹配结果
		var href=this.backURL;
		switch(authority){
			case 1: break;														//所有
			case 2: if(!isLogin){ g_sps.jump(null,href); } break; //登录
			case 3: if(!isAuth){ g_sps.jump(null,href); } break;  //认证
			case 4: break;
			default: g_sps.jump(null,href);
		}
	}
	
	var data={};
	data.paramJson = $.toJSON({conId:$.getUrlParam("conId")});
	$.ajax({url: PC_CALL+"conference/index/getAllSubConferenceListV2/", type: "POST",data:data, backURL:callBackUrl}).done(authority);
	getBrowseNum();
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

    //if(GlobalOneStatusBrowse){
    		// 添加浏览日志
    	    var log = {};
    	    log.href = "/pages/channel/conference/only-conference/live.html?ownerid="+  obj.ownerid+"&conId="+ obj.conId +"&conSubId="+ obj.conSubId;
    	    log.id = 24;
    	    log.name = "会议直播页";
    		comm.Log.createBrowse(log);
    //}
    
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
        url:'//weiyiwang.gensee.com/sdk/site/sdk/video?widgetid=videoComponent&id=videoComponent&site=weiyiwang.gensee.com&ctx=webcast&ownerid='+id+'&uname='+User.nickname+'&authcode='+playLiveAuthcode,
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
		url:'//weiyiwang.gensee.com/sdk/site/sdk/doc?widgetid=docComponent&id=docComponent&site=weiyiwang.gensee.com&class=gs-sdk-widget&ctx=webcast&ownerid='+id+'&uname='+User.nickname+'&authcode='+playLiveAuthcode,
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
	
	//conSubType:1-分会,2-卫星会;     
	//is_online:'是否在线直播(0-不直播、1-展视互动-直播、2-厂商-直播、3-展视互动-回播；)',
	//conId:'会议id'; 
	//conIdList: 会议id串
	
	var conListURL = PC_CALL+"conference/index/getConferenceAgendaList/"; //分会场列表
	params.paramJson = $.toJSON({conId : obj.conId, isOnline: 1}); //分会场参数
	ajaxList(conListURL,params,obj,"con");
	
	var conSubListURL = PC_CALL+"conference/index/getConferenceAllDateList/"; //分会场日程
	params.paramJson = $.toJSON({conSubId : obj.conSubId,pageIndex:1,pageSize:100}); //分会场日程参数
	ajaxList(conSubListURL,params,obj,"conSub");
}

function listCtrl(data,src,obj){ //数据控制
	if(src==="con"){ //分会场 单场会议不存在其它分会场，所以注释以下
		/*var kv = data.data_list[1].menu_data_list;
		var html = "";
		$.each(kv,function(i,el){
			if(el.id == obj.conSubId){
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

			GlobalOneStatusBrowse = true;
			changeVideo(obj);
		});*/
		
	}else{ //秀分会场日程
		
		//非PC端跳手机版 为了取标题
		if(!comm.equipment.IsPC()){
            g_sps.jump(null,"//m.allinmd.cn/pages/conference/live-wrap.html?conSubId="+$.getUrlParam("conSubId")+"&conId="+$.getUrlParam("conId")+"&liveId="+$.getUrlParam("ownerid")+"&token=333333");
			return false;
		}

		if(!isForeign()) isValidAuth("/html/conference/"+$.getUrlParam("conId")+"/1/meeting_index.html");
		
		var kv = data.data_list[0].menu_list_agenda;
		var html = "",tempDate = "",arrDate = [];
		document.title=data.data_list[0].conSubName+"直播会场-唯医,allinmd";
		$(".ev-currColumn").text(data.data_list[0].conSubName); 
		
		function template(i,el){
			var addClass = 'style="color:#999;font-weight: normal;"';
			if(i==0){
				addClass = "";
			}
			
			return  "<li class=\"on ev-conSubListDate cursor\" "+addClass+">"+el.start_time+"</li>";
		};
		
		var tDate = [];  //默认日期位置
		var showAgenda = 0;
		$.each(kv,function(i,el){

			showAgenda = el.ConferenceAgenda[0].isOnline;
			if(showAgenda){
				tempDate += template(i,el);

				tDate.push(new Date(el.start_time).getTime());

				$.each(el.ConferenceAgenda,function(j,ele){
					html += conSubListTemplate(i,ele,el.start_time);
				});
			}
		});
		
		
		//给日程加事件切换
		$(".time_title").html(tempDate).find("li").on("click",function(){
			$(this).removeAttr("style").siblings().css({"color":"#999","font-weight":"normal"});
			
			$(".ev-conSubList>li").hide();
			$("[date="+$(this).text()+"]").show();
		});
		
		$(".ev-conSubList").html(html);
		
		
		//获取当前时间
		var MDY = new Date();
		var Month = MDY.getMonth()+1;
		var Day = MDY.getDate();
		var Year = MDY.getFullYear();
		
		var pjDate = Year+"-"+(Month.toString().length>1?Month:"0"+Month)+"-"+(Day.toString().length>1?Day:"0"+Day);
		var MDYTime = new Date(pjDate).getTime();
		
		//设置当前日程或大于当前日程
		var citeDate = "";
		var sign = false;
		for(var k = 0; k<tDate.length; k++){
			if(tDate[k]>=MDYTime){
				$(".time_title li:eq("+k+")").click();
				sign = true;
				return false;
			}
		}

		if(!sign){
			var len = $(".time_title").find("li").length;
			$(".time_title li:eq("+(len-1)+")").click();
		}
		
	}

	if($(".time_title").find("li").length === 1){
		$(".time_title").find("li").click();
	}
}

function conListTemplate(el){ //分会场列表模版
	return '<li data-ownerid="'+el.liveId+'" data-conSubId="'+el.id+'">'+el.conSubName+'</li>';
}

function conSubListTemplate(i,el,date){ //某个分会场日程模版
	var defaultStyle = 'style="display:none;"';
	if(i==0){
		defaultStyle = "";
	}
	
	return '<li date='+date+' '+defaultStyle+'>'+
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

