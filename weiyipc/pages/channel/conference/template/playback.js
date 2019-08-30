/*
 **/

$(function(){
	//弹窗
	var dialog=function(opt){
		var o={
			message:opt.message,
			parentObj:opt.parentObj,
	        pic:(opt.pic!=null?opt.pic:true)
		};
		
		var html="";
		html+='<div id="remind_shade" style="position:absolute; left:0; top:0; background:#ffffff; opacity:0.6; filter:alpha(opacity=60); -moz-opacity: 0.6;"></div>'+
	    	'<div class="message" style="background:#000; position:absolute; opacity:0.6; filter:alpha(opacity=60); -moz-opacity: 0.6; padding:8px 58px 8px 58px;">'+
	    		'<div class="ico" style="float:left;">'+ (o.pic?'<img src="/js/third-party/caos/image/g_success.png" style="vertical-align:middle;">':'') +'</div>'+
	    		'<div class="remind_content" style="color:#FFF; font-size:18px;	padding-left:10px; float:left; height:34px; line-height:34px;">'+o.message+'</div>'+
	    	'</div>';
		
		o.parentObj.append(html);
		
	    $("#remind_shade").css({
			width:o.parentObj.width(),
			height:o.parentObj.height(),
	    });
		
		var Top = (o.parentObj.height()-$(".message").outerHeight(true))/2;
	    var Left = (o.parentObj.width()-$(".message").outerWidth(true))/2;
		
		$(".message").css({
			top:Top,
			left:Left,
	    });
		
	};


	var Common={};

	// 弹层遮罩
	Common.LightBox = {
	    element : null,
	    init : function () {
	        var a = "100%",
	            b = "fixed";
	        $.browser.msie && "6.0" == $.browser.version && !$.support.style && (a = document.documentElement.clientHeight + "px", b = "absolute");
	        var c;
	        c = $.browser.msie ? '<div id="lightbox" style="left:0; background:#3f4550; top:0; width:100%; height:' + a + "; filter:alpha(opacity=60); -moz-opacity: 0.6; opacity: 0.6;zoom:1; position:" + b + '; z-index:9; " ><iframe src="" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" width="100%" height="100%" style="left:0; background:rgb(255,255,255); top:0; width:100%; filter:alpha(opacity=0); -moz-opacity: 0; opacity: 0;zoom:1; position:absolute; z-index: 9"></iframe></div>' : '<div id="lightbox" style="left:0; background:#3f4550; top:0; width:100%; height:' + a + "; filter:alpha(opacity=60); -moz-opacity: 0.6; opacity: 0.6;zoom:1; position:" + b + '; z-index:9; " ></div>',
	            this.element = $(c).appendTo(document.body),
	            $("#_lightbox").remove(),
	            this.count = 0
	    },
	    getZIndex : function () {
	        return parseInt(this.element.css("zIndex")) || -1
	    },
	    hide : function () {
	        var a = this;
	        a.element && ($.browser.msie && Number($.browser.version) < 9 ? setTimeout(function () {
	            a.count--,
	                (a.count <= 0 || a.element.css("zIndex") <= 9) && a.element.hide()
	        }, 200) : (a.count--, (a.count <= 0 || a.element.css("zIndex") <= 9) && (a.element.hide(), $.browser.msie || $("div.SecEditCtrl").css("visibility", "visible"))))
	    },
	    resetZIndex : function () {
	        return this.setZIndex("9")
	    },
	    setZIndex : function (a) {
	        return this.element || this.init(),
	            this.element.css("zIndex", a || this.element.css("zIndex"))
	    },
	    show : function () {
	        return this.element || this.init(),
	            $.browser.msie && "6.0" == $.browser.version && !$.support.style && this.element.css("height", CU.getDocumentPracticalHeight() + "px"),
	            this.element.show(),
	            this.setZIndex("9"),
	            this.count < 0 && (this.count = 0),
	            this.count++,
	            $.browser.msie || $("div.SecEditCtrl").each(function () {
	            $(this).parents("div.bu-pop")
	        }),
	            this
	    },
	    zIndexUp : function () {
	        this.element.css("zIndex", "+=2")
	    },
	    zIndexDown : function () {
	        this.element.css("zIndex", "-=2")
	    }
	};

	// 设置居中
	Common.setCenter = function(obj){
	    var positionFromTop = ($(window).height()-obj.height())/2;
	    var positionFromLeft = ($(window).width()-obj.width())/2;
	    var top  = $(window).scrollTop() + positionFromTop;
	    var left = $(window).scrollLeft() + positionFromLeft;
	    obj.css({
	        top: top + 'px',
	        left: left + 'px'
	    });
	};

	Common.showloading = function(){
	    this.loading = (this.loading || $('<div style="position:absolute; top:45%; left:50%;z-index:18; display:none" id="ctrollerLoading"><img src="/js/third-party/caos/image/xubox_loading0.gif" alt="loading" /></div>').appendTo(document.body)).show();
	    Common.setCenter($("#ctrollerLoading"));
	    if($("#lightbox").length>0){
	        Common.LightBox.zIndexUp();
	        Common.LightBox.element.show();
	    }else{
	        Common.LightBox.show();
	    }

	};

	Common.hideloading = function(){
	    this.loading.hide();
	    if(Common.LightBox.getZIndex()==9){
	        Common.LightBox.hide();
	    }else{
			Common.LightBox.hide();
	        Common.LightBox.zIndexDown() ;
	    }

	};

	Common.showLightBox=function(){
		Common.LightBox.show();
	};

	Common.dialog=function(){
		//创建弹层所需DOM结构
		var t = this;
	   
		$("<div class='lightbox-container'></div>"
		).appendTo($("body"));

		t.$container = $(".lightbox-container").css({
			zIndex:10,
			position:"absolute"
		});
		
	};
	//浏览器大小改变and滚动条滚动弹层的位置改变
	Common.Window=function(){
		if($(".lightbox-container")){
			$(window).bind("scroll",function(){
				Common.setCenter($(".lightbox-container"));	
			});	
			$(window).bind("resize",function(){
				Common.setCenter($(".lightbox-container"));		
			});
		}
	};

	Common.closeLightBox=function(){
		Common.LightBox.hide();
		$(".lightbox-container").remove();	
	};
	Common.bindClose=function(){
		$(".s_close a").live("click",function(){
			Common.closeLightBox();
			$(".tip-yellow").remove();
		});	
		$(".close_btn img").live("click",function(){
			Common.closeLightBox();	
		});
	};
	
//-----------------------------------------------------------------------------------------	
	
	
	//playType 播放类型 live为直播 playback为回放
//	var url = location.href;
//	var urlStr = url.substr(url.lastIndexOf("/")+1);
//	var urlStr = urlStr.substr(urlStr.indexOf("_")+1);
//	var playType = urlStr.substr(0,urlStr.indexOf("_"));
	var playType = 0;
	
	//当前期数
	var urlStr2 = url.substr(url.substr(0,url.lastIndexOf("/")).lastIndexOf("/")+1);
	var conId = parseInt(/\d+/.exec(urlStr2.substr(0,urlStr2.indexOf("/"))));
	var conId = $("#conId").val();
	
	//在权限受限时转回主地址
	var backURL = "/html/conference/"+conId+"/meeting_index.html";
	
	//获取当前资源ID 播放级别data 
	var playCode = {id:$("#conSubId").val()}; //

	//获取当前资源播放级别地址
	var lockLevelURL = PC_CALL+"conference/sub/getById/";
	
	//调用视频组件  主页面地址 播放类型  播放级别  当前资源ID
	playVideo.init(backURL,playType,lockLevelURL,playCode); //loggerURL,loggerData
	
	var channel = GS.createChannel(); 
	//2.通过通道监听在线人数事件
	channel.bind("onUserOnline", function(event) {
		$("#peopleNum").html(event.data.count); 
	});
	
	
	//导航
	$("#evNaviList").hide();
	$("#evDown,#evMainNavi,#evNaviList").css("cursor","pointer");

	$("#evDown").toggle(function(){
		$(this).html("收起");
		$("#evNaviList").show();
	},function(){
		$(this).html("更多");
		$("#evNaviList").hide();
	});
	
	
	//倒计时
	var time = setInterval(isStartLive,1000);
	function isStartLive(){
		var conferenceTime = "2014/08/15 08:00:00";
		var t = new Date().getTime();
		var c = new Date(conferenceTime).getTime();
		if((c-t)>0){
			showStatus(c,t);
		}else{
			clearInterval(time);
			$(".lightbox-container").remove();
			$("#lightbox").remove();
		}
	}
	function showStatus(c,t){
		var timeInfo = tear(c,t);
		if($(".lightbox-container").length==0){
			Common.showLightBox(); //背景
			Common.dialog();  //对话框
			$(".lightbox-container").html(winHT(timeInfo)); //追加内容
			Common.setCenter($(".lightbox-container")); //设置居中
			Common.Window();  //自适应窗口居中
			Common.bindClose(); //关闭窗口
		}else{
			$(".lightbox-container").html(winHT(timeInfo)); //追加内容
		}
	}
	function tear(c,t){
		//days = parseInt((c-t) / (1000 * 60 * 60 * 24));  
		hours = parseInt((c-t) % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));  
		minutes = parseInt((c-t) % (1000 * 60 * 60) / (1000 * 60));  
		seconds = parseInt((c-t) % (1000 * 60) / 1000); 
		if(hours>0){
			hours = "<span style=\"color:#3a8dcb;font-size:25px;\">"+hours+"</span>小时";
		}else{
			hours = "";
		}
		if(minutes>0){
			minutes = "<span style=\"color:#3a8dcb;font-size:25px;\">"+minutes+"</span>分";
		}else{
			minutes = "<span style=\"color:#3a8dcb;font-size:25px;\">"+seconds+"</span>秒";
		}
		return hours+minutes;
	}
	function winHT(info){
		var HTML = "<div style=\"border:1px solid white;border-radius:6px;width:450px;height:343px;background:white\">"+
		"<img src=\"//img00.allinmd.cn/conference/5/clock.png\" style=\"padding:105px 0 0 186px;\"/>"+
		"<div style=\"text-align: center;padding-top: 42px;color:#666;font-size:17px;\">距离直播开始时间还有"+info+"</div>"+
		"</div>";
		return HTML;
	}
	
	
	/*******回放********/
	//选择视频
	function changeVideo(_id){
		var id= _id;
		var playbackAuthcode = $("#videoComponent").attr("authcode");
		$.ajax({
	        url:'http://allinmd.gensee.com/sdk/site/sdk/vod?widgetid=videoComponent&id=videoComponent&site=allinmd.gensee.com&ctx=webcast&ownerid='+id+'&uid='+User.id+'&uname='+User.nickname+'&authcode='+playbackAuthcode,
	        dataType:"jsonp",
	        jsonp:"jsonpcallback",
	        jsonpCallback:"__GSJsonp.jsonpcallback_8",
	        success:function(data){
	        }
	   });
	}
	__GSJsonp.jsonpcallback_8 =function(a){
		$("#videoComponent").html(a);
	};


	
	//切换视频
	$("#aEvents li a").bind("click",function(){
		changeVideo($(this).attr("data-id"));
	});
});

//直播回播控制 终端页可以
var playVideo = {}
playVideo = {
		init : function(backURL,playType,lockLevelURL,playCode){ 
			this.apply(playType);  //给直播或是回放设置用户名;
			this.isProhibit(this.lockLevel(lockLevelURL,playCode),backURL); 	// 是否登录，未登返回主地址
		},
		random : {},
		apply : function(playType){
			if(playType===0){
				this.live();
			}else{
				this.playBack();
			}
		},
		lockLevel : function(lockLevelURL,playCode){
			var level = 0;
			$.ajax({
				url : lockLevelURL,
				type : "POST",
				data : playCode, 
				async : false,
				success : function(data){
					level = data.rows[0].authority;
				} 
			})
			return level;
		},
		isProhibit : function(lockCode,backURL){
			var t = this;
			var operate = "";
			var state = false;
			
			//获取当前资源播放级别地址  //1 不用注册可看 //回主地址  2 注册会员  3 认证会员
			switch(lockCode){
			case 1:
				operate = "meetingVideo3";
				break;
			case 2:
				operate = "meetingVideo2";
				$.ajax({
					url : PC_CALL+"customer/unite/checkSession/",
					type: "POST",
					async : false,
					success : function(data){
						if(data.responseObject.responseStatus){
							state = true;
						}else{
							state = false;
						}
					}
				})
				if(state == false){
					location.href = backURL;
				}
				break;
			case 3:
				$.ajax({
					url : PC_CALL+"customer/auth/getAuthBycustomerId/",
					type : "POST",
					async : false,
					success : function(data){
						if(!t.isEmptyObj(data)){
							if(data.responseObject.state==1){
								state = true;
							}else{
								state = false;
							}
						}else{
							state = false;
						}
					}
				});
				if(state == false){
					location.href = backURL;
				}
				break;
			};
		},
		isEmptyObj : function(obj) {
            for (var key in obj) {
                return false;
            }
            return true;
        },
		//直播
		live : function(){
			var user = this.nameAjax();
			this.random.nickname = "游客"+this.GetRandomNum();
			this.random.id = this.GetRandomNum();
			$(".gsVideo").attr("uname", user.nickname?user.nickname:this.random.nickname);
			$(".gsVideo").attr("uid",user.id?user.id:this.random.id);
		},
		//回放
		playBack : function(){
			var user = this.nameAjax();
			this.random.nickname = "游客"+this.GetRandomNum();
			this.random.id = this.GetRandomNum();
			$(".gsVideo").attr("uname", user.nickname?user.nickname:this.random.nickname);
			$(".gsVideo").attr("uid",user.id?user.id:this.random.id);
		},
		nameAjax : function(){
			var user = {};
			$.ajax({
				url : PC_CALL+"customer/unite/getCustomerUnite/",
				type : "POST",
				async : false,
				success : function(data){
					if(data != null && data.responseObject != undefined){
						user.nickname = data.responseObject.email;
						user.id = data.responseObject.customerId;
					}else{
						user.nickname = null;
						user.id = null;
					}
				}
			});
			return user;
		},
		//随机数
		GetRandomNum : function(){
			var Min = 1000;
			var Max = 9999;
			var Rand = Math.random();   
			return Min + Math.round(Rand * (Max - Min));   
		}
		
}


//$("#evNaviList>li>div,#evMainNavi>li").on("click",function(){
//	var id = 0;
//	if($(this).attr("data-naviId")===undefined){
//		id = $(this).parent().attr("data-naviId");
//	}else{
//		id = $(this).attr("data-naviId");
//	};
//	var column = $("#evColumn").html();
//	var columnId = $("#evColumn").attr("data-naviId");
//	$("#evColumn").html($(this).html()).attr("data-naviId",id);
//	$(this).html(column).attr("data-naviId",columnId);
//	
//}).hover(function(){
//	$(this).addClass("on");
//},function(){
//	$(this).removeClass("on");
//});
//














