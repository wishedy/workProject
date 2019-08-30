$(function(){
	//首页头像滚动
	function autoPlay(){
		var speed=30;
		var d2=document.getElementById("demo2");
		var d1=document.getElementById("demo1");
		var d=document.getElementById("demo");
		d2.innerHTML=d1.innerHTML;
		function Marquee(){
			if(d2.offsetWidth-d.scrollLeft<=0){
				d.scrollLeft-=d1.offsetWidth;
			}else{
				d.scrollLeft++;
			}
		}
		var MyMar=setInterval(Marquee,speed);
		d.onmouseover=function() {clearInterval(MyMar);}
		d.onmouseout=function() {MyMar=setInterval(Marquee,speed);}	
	}
	//首页头像滚动 end

//初始化 
	var top1=0;
	var top2=0;
	var maxTop1=0;
	var maxTop2=0;
	
	var str= location.href;
	var url = str.substr(str.lastIndexOf("/"));
	//var url = "/meeting_index.html";
	switch(url){
	//会议概括
	case "/meeting_basic.html":
		$(".m_right").css("top",30);
		top2=$(".m_right").offset().top;
		break;
	case "/meeting_agenda.html":
		top1=$(".rc_left_v2").eq(0).offset().top;
		maxTop1=$(".m_main").height()+$(".m_main").offset().top-$(".rc_left_v2").height();	
		break;
	case "/meeting_index.html":
		if($("#demo").length>0){
			autoPlay();
		}
		break;
	case "":
		break;
	case "":
		break;
	case "":
		break;
	
	}
    //会议日程的时间和地点设置
    $(".rc_address").each(function(i,em){
        var addressWidth = $(em).innerWidth();
        if(addressWidth>390){
            $(em).addClass('rc_address_v2');
            $('.rc_time').eq(i).addClass('rc_time_v2');
        }
    })
//	锚点
	$(".rc_l_content a").bind("click",function(){
		$(".rc_l_content a").removeClass("active");
		$(this).addClass("active");	
	});
	
	$(".meeting_line div").each(function(i,val){
		$(val).bind("click",function(){
			$(".meeting_line div").removeClass("hover");
			$(val).addClass("hover");		
		});	
	});
	
	$(".rc_l_content_v2 ul li div").bind("click",function(){
		$(".rc_l_content_v2 ul li div").attr("class","jc_bg").find("a").css("color","#333");
		$(this).attr("class","agenda_left_Navi").find("a").css("color","#266ba2");
	});

	$(window).bind("scroll",function(){
		var scrollTop=$(document).scrollTop();
		/*if(top1>=scrollTop){
			$(".rc_left_v2").css("top",30);	
		}else{
			
			$(".rc_left_v2").css("top",30+scrollTop-top1);	
			
			if(scrollTop>maxTop2){
				$(".rc_left_v2").eq(1).css("top",26+maxTop2-top1);		
			}
			if(scrollTop>maxTop1){
				$(".rc_left_v2").eq(0).css("top",26+maxTop1-top1);	
			}
		}	*/
		if(top2>=scrollTop){
			$(".m_right").css("top",30);	
		}else{
			$(".m_right").css("top",30+scrollTop-top2);	
		}
			
	});
// 锚点end	

	//导航切换
	$("#evNaviTab li").each(function(i,el){
		var _str = $(el).find("a").attr("href");
		var _url = _str.substr(_str.lastIndexOf("/"));
		if(url.search(_url)>-1){
			$(this).addClass("on");
			return false;
		}
	});
	
	//导航宽度
	$(".m_nav li").css("width",994/$("#evNaviTab li").length);

	//TODO : 直播时,防止a失控
	var a19_link = $("#a_19").attr("href");
	if(a19_link === undefined){ //a19 展示  a100 天坛
		a19_link = $("#a_100").attr("href");
		$("#a_100").attr("id","a_19");
	}
	$("#a_19").parent().html("<span class=\"ev-a_19\" link='"+a19_link+"' style='color:#fff;'>视频直播</span>").css("cursor","pointer");
	
	//回放时，防止a失控
	var a20_link = $("#a_20").attr("href");
	$("#a_20").parent().html("<span class=\"ev-a_20\" link='"+a20_link+"' style='color:#fff;'>会议回播</span>").css("cursor","pointer");
	
	
	/*
	 * 监听导航	
	 * */
	//验证权限
	function validAuthority(link){
        function GetQueryString(name){
            var reg = new RegExp("(^|[&|?])"+ name +"=([^&]*)(&|$)");
            var r = link.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return null;
        }
		function authority(rs){
			var subId = GetQueryString("conSubId"),
				data,
				authority = 0;
				if(comm.hasResponseData(rs)){
					data = rs.responseObject.responseData.data_list[0].menu_data_list;
				}

			//获取当前所需权限 观看权限(1所有、2登录、3认证、4caos缴费)
			if(data) {
				$.each(data, function (i, el) {
					if (el.id == subId) {
						authority = el.authority;
					}
				});
			}
			//如果未匹配到数据配置的分会场信息，则回站首页
			if(!authority) {
				if(link.lastIndexOf("back=1")>-1){//回播

				}else{
                    comm.surePop({"title":"直播未开始","icon":0});
                    return;
				}
			}
			// 匹配结果
			switch(authority){
				case 1: g_sps.jump(null,link); break;								//所有
				case 2: //登录
					user.login({
						callback: function () {
                            g_sps.jump(null,link);
						},
						scene: privilegeSceneConst.eSceneTypeNeedManufactureLogin,
						link: link
					});
					break;
				case 3: //认证
					user.login({
						callback: function () {
                            g_sps.jump(null,link);
						},
						scene: privilegeSceneConst.eSceneTypeNeedManufacture,
						link: link
					});
					break;
				case 4: break;															//CAOS缴费
				default: g_sps.jump(null,"/");
			}
		}

		var data= {};
		data.paramJson = $.toJSON({conId:(GetQueryString("conId"))});
		$.ajax({url: PC_CALL+"conference/index/getAllSubConferenceListV2/", type: "POST",data:data}).done(authority);
	}

	$(".ev-a_19").on("click",function(){ //直播
		if(!isForeign()){
			validAuthority($(".ev-a_19").attr("link"));
		}else{
            g_sps.jump(null,$(".ev-a_19").attr("link"));
		}
	});
	
	$(".ev-a_20").on("click",function(){ //回播
		if(!isForeign()){
			validAuthority($(".ev-a_20").attr("link"));
		}else{
            g_sps.jump(null,$(".ev-a_20").attr("link"));
		}
	});
	
//	$("#evNaviTab li").on("click",function(){
//		var id = $(this).find("a").attr("id");
//		 if(id=="a_20"){ //回放
//			 if(!isForeign()) {
//				 user.login({
//					 callback: function () {
//						 window.location.href = "/pages/channel/conference/multi-conference/playback.html?ownerid=ac67b44d3e434fedb4075d9a81a2966f&conId=1408944750661&conSubId=74";
//					 },
//					 operateType: "conference"
//				 });
//
//				 return false;
//			 }
//		 }
//	});

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
    //点击浏览记录登录成功后刷新页面
	scene.TopHeadLoginCallback=function(no){
		if(!no){
			location.reload();
		}
	};
    //添加关注会议并点击
	var data= {};
	var refId=location.pathname.split('/')[3];
	//var refId='1493198998161';
	data.paramJson = $.toJSON({
		scene:0,//场景（0-会议频道页，1-我关注的会议，2-会议预告）
		conId:refId,
		"sessionCustomerId":$('#sesCustomerId').val()||"",
		firstResult:0,
		maxResult:20,
		platformId:$('#sesDepartment').val()||1
	});
	$.ajax({url: PC_CALL+'conference/index/getMapListV4/', type: "POST",data:data}).done(function(req){
		if(req&&req.responseObject&&req.responseObject.responseData&&req.responseObject.responseData.data_list&&req.responseObject.responseData.data_list.length>0){
			if(req.responseObject.responseData.data_list[0].followState=='1'){
				$('.qr_img').append('<b class="qrAttention qrAttentioned"><span>已关注</span></b>');
			}else {
				$('.qr_img').append('<b class="qrAttention"><span>关注会议</span></b>');
			}
		}else {
			$('.qr_img').append('<b class="qrAttention"><span>关注会议</span></b>');
		}
		$('.qr_img b').off('click').on('click',function(){
			var $this=$(this),
				sesAuth=$("#sesAuth").val();
			if(sesAuth=='2'||sesAuth=='7'||sesAuth=='8'||sesAuth=='9'){
				var paramData= {};
				paramData.paramJson = $.toJSON({
					"refId":refId,
					"refName":'',
					"customerId":$('#sesCustomerId').val()||"",
					"followType":3
				});
				comm.LightBox.showloading();
				if(!$this.hasClass('qrAttentioned')){
					//   关注
					comm.creatEvent({
						triggerName:'关注',
						triggerType:"关注",
						keyword:'',
						refId:refId,
						refType:'会议',
						actionId:11022
					});
					$.ajax({url: PC_CALL+'customer/follow_resource/createFollowResource/', type: "POST",data:paramData}).done(function(req){
						if(req.responseObject.responseStatus){
							comm.LightBox.hideloading();
							$this.addClass('qrAttentioned');
							$this.find('span').text('已关注');
						}
					});
				}else {
					$.ajax({url: PC_CALL+"customer/follow_resource/delete3/", type: "POST",data:paramData}).done(function(req){
						if(req.responseObject.responseStatus){
							comm.LightBox.hideloading();
							$this.removeClass('qrAttentioned');
							$this.find('span').text('关注会议');
						}
					});
				}
			}else {
				user.login({
					callback: function () {
						location.reload();
					},
					scene: privilegeSceneConst.eSceneTypeAuth,
					stay:true
				});
			}
		})
	});
});






			
