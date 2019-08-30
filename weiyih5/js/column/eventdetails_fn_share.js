var qqTitle=qqDesc=sDesc="";
$(function(){
	if(status==1){//1:结果公示中 -1:过期
		qqTitle="《骨科示教病例及手术视频评选活动》最终获奖结果揭晓"; //qq微信title
		qqDesc="最终结果新鲜出炉，桂冠由谁摘得？人气王花落谁家？点击揭晓，并查看全部优秀作品！"; //qq微信簡介
		sDesc="《骨科示教病例及手术视频评选活动》最终获奖结果揭晓—最终结果新鲜出炉，桂冠由谁摘得？人气王花落谁家？点击揭晓，并查看全部优秀作品！点击链接："; //新浪簡介
	}else{
		qqTitle="决战一触即发，骨科示教病例及手术视频选拔赛决赛入围名单公布！"; //qq微信title
		qqDesc="点击查看优秀作品名单，看看有没有你心中的“它”！桂冠最终由谁摘得？5月21日CAOS2016为你揭晓！"; //qq微信簡介
		sDesc="决战一触即发，骨科示教病例及手术视频选拔赛决赛入围名单公布！点击查看优秀作品名单，看看有没有你心中的“它”！桂冠最终由谁摘得？5月21日CAOS2016为你揭晓！点击链接："; //新浪簡介
	}
	//点击分享按钮分享层开启
	$('#share').click(function(e){
		if(is_weixin()){
			var $zhezhao = $('<div id="videoPK_weixin_zhezhao"></div>');
			$zhezhao.css({
				position:'fixed',
				width:'100%',
				height:'100%',
				background:"rgba(0,0,0,0.8)",
				zIndex:'100',
				top:'0',
				left:'0'
			}).append($('<img src="//img50.allinmd.cn/column/videoPK/video_pk_share.jpg" style="display:block;width:100%;height:100%;opacity:0.6;"/>'));
			$('body')
				.append($zhezhao)
				.delay(300)
				.remove('#videoPK_weixin_zhezhao');
			$("#videoPK_weixin_zhezhao").on("click",function(){
				$(this).remove();
				return false;
			})
		}else{
			$('.videoPK_share_pop').show();
		}
		e.preventDefault();
	})
	//点击分享按钮分享层关闭
	$('.videoPK_share_pop a').click(function(){
		$(this).parents('.videoPK_share_pop').hide();
	})
	//点击分享层本身-分享层关闭
	$('.videoPK_share_pop').click(function(){
		$(this).hide();
	})
	//返回顶部
	$('.fhdb').click(function(){
		$('body').animate({scrollTop:0},500)
		return false;
	})
	//分享
	$('.share_sina').click(function(){
		shareSina();
	})
	$('.share_qq').click(function(){
		shareQQ();
	})
	$('.share_qzone').click(function(){
		shareQzone();
	})
	setTimeout(function(){
		initShareWeixinm();
	},1000);
});

/**
 * 微信分享
 */

function getUrl(){
	var href=window.location.href;
	if(href.indexOf("myWorks.html")>0){
		href=$(".casePK_nav a").eq(0).attr("href");
	}
	return href;
}

function initShareWeixinm(){
	var weiXinTitle=qqTitle;
	var weiXinDesc=qqDesc;
	var weiXinLogo="/images/img50column/videoPK/pk_banner.jpg";

	WeixinJSApi.title=function(){

		return weiXinTitle;
	};
	WeixinJSApi.link=function(){

		return getUrl();
	};
	WeixinJSApi.desc=function(){
		return weiXinDesc;
	};

	WeixinJSApi.imgUrl=function(){

		return weiXinLogo;
	};
	WeixinJSApi.appSuc = function(){
		comm.shareLog({
			shareType: "",
			resourceId:"" ,
			resourceType: "",
			refId: "",
			isValid: 1,
			shareSence:33,
			shareChannel:4,
			shareContent:weiXinTitle
		});
	};
	WeixinJSApi.timeLineSuc = function(){
		comm.shareLog({
			shareType: "",
			resourceId:"" ,
			resourceType: "",
			refId: "",
			isValid: 1,
			shareSence:33,
			shareChannel:5,
			shareContent:weiXinTitle
		});
	}
	WeixinJSApi.init();
}


//分享
function shareSina(){
	//var href=window.location.href;
	var openurl="http://v.t.sina.com.cn/share/share.php?&appkey=895033136",
		url="&url="+encodeURIComponent(getUrl()),
		title="&title="+sDesc,
		pic="&pic=http://img50.allinmd.cn/column/videoPK/pk_banner.jpg"
	var aLink = openurl+url+title+pic;
	comm.shareLog({
		shareType: "",
		resourceId:"" ,
		resourceType: "",
		refId: "",
		isValid: 1,
		shareSence:33,
		shareChannel:3,
		shareContent:qqTitle
	});
	window.open(aLink,'_blank')
}
//function shareQQ(){
//	var openurl = 'http://connect.qq.com/widget/shareqq/index.html?',
//
////		title=qqhaoyou,
//		url="url="+encodeURIComponent(window.location.href),
//		desc="&desc=我对%23骨科示教病例及手术视频选拔赛%23很感兴趣，你也来参加吧！"+location;
//	var aLink = openurl+url+desc;
//	window.open(aLink,'_blank')
//}



function shareQzone(){
	//var href=window.location.href;

	var openurl;		//分享链接，PC手机两种
	var title = "&title="+ encodeURIComponent(qqTitle);			//分享标题
	var url = "&url="+encodeURIComponent(getUrl()),					//分享url
		imageUrl = "&imageUrl="+ encodeURIComponent("http://img50.allinmd.cn/column/videoPK/pk_banner.jpg"),				//图片链接
		pics="&pics="+ encodeURIComponent("http://img50.allinmd.cn/column/videoPK/pk_banner.jpg"),						//图片链接
		desc=qqDesc,		//描述
		summary = "&summary="+encodeURIComponent(desc),				//描述
		t="&t="+new Date().getTime();							//时间戳
	comm.shareLog({
		shareType: "",
		resourceId:"" ,
		resourceType: "",
		refId: "",
		isValid: 1,
		shareSence:33,
		shareChannel:3,
		shareContent:qqTitle
	});
	if(IsPC()){
		//PC端
		openurl="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?";
		var aLink = openurl+"desc="+summary+imageUrl+pics+title+url;
		window.open(aLink,'_blank');


	}else{
		//移动端
		openurl="http://qzs.qzone.qq.com/open/connect/widget/mobile/qzshare/feedback.html?";
		var aLink = openurl+"&desc="+summary+imageUrl+title+url+t;
		window.open(aLink,'_blank');
	}
}
function is_weixin(){
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i)=="micromessenger") {
		return true;
	} else {
		return false;
	}
}
function IsPC() {
	var userAgentInfo = navigator.userAgent;
	var Agents = ["Android", "iPhone",
		"SymbianOS", "Windows Phone",
		"iPad", "iPod"];
	var flag = true;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
}




//jq:tab切换效果展示：
$(".expert_nav li").each(function(t, n) {
	$(".expert_list_cont").find(".zj_list li:gt(5)").hide();
	$(n).on("click", function() {
			var i = $(this).index();
			$(".expert_nav li div").removeClass("new"),
				$(this).find("div").addClass("new"),
				$(".expert_list_cont").hide();
			var conCur = $(".expert_list_cont").eq(i).show() ;
			var overList = 	$(".expert_list_cont").eq(i).find(".zj_list li:gt(5)").hide();
			var more =  conCur.find(".more")
			conCur.find(".more").off("click").on("click", function () {
				show();
			});


			function show(){
				more.off("click").on("click",function(){
					hide();
				}).text("收起更多").addClass("close_more");
				overList.slideDown();
			}

			function hide(){
				more.off("click").on("click",function(){
					show();
				}).text("展开更多").removeClass("close_more");
				overList.slideUp();
			}
		}
	);
});

$(".expert_nav li:eq(0)").click();


