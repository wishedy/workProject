var WeixinJSApi = {
	appId:'wx8d4a2df6fdc13658',
	timestamp:'',
	nonceStr:'',
	signature:'',
	init:function(){
		var configData=this.getWxJSConfig();
		if(configData){
			//this.appId=configData.appId;
			this.timestamp=configData.timestamp;
			this.nonceStr=configData.noncestr;
			this.signature=configData.signature;
		}
		this.config();
		this.error();
		this.ready();

	},
	config:function(){
		wx.config({
			debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId: this.appId, // 必填，公众号的唯一标识
			timestamp: this.timestamp, // 必填，生成签名的时间戳
			nonceStr: this.nonceStr, // 必填，生成签名的随机串
			signature: this.signature,// 必填，签名，
			jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline'], // 必填
			success: function(res) {
				//console.log("---success:"+res);
			},
			fail: function(res) {
				//console.log("---error:"+res);
			}
		});
	},
	ready:function(){
		wx.ready(function(){
			// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作。
			var defaultTitle="唯医—医生互动社区，医学继续教育";
			var defaultDesc="汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。";
			var defaultLogo="//img50.allinmd.cn/allin_logo.png";
			var defaultLink=location.href;
			//var link= (!WeixinJSApi.link() || WeixinJSApi.link()=="")?defaultLink:WeixinJSApi.link();
			//var urlView="https://m.allinmd.cn/mcall/wx/allin/interact/view/?ref="+link;
			//var authUrl="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+WeixinJSApi.appId+"&response_type=code&scope=snsapi_base&state=b64&redirect_uri="+urlView+"#wechat_redirect";


			//分享给朋友
			wx.onMenuShareAppMessage({
				//分享标题
				title: ((typeof WeixinJSApi.title()=="undefined") || !WeixinJSApi.title() ||WeixinJSApi.title()=="")?defaultTitle:WeixinJSApi.title(),
				//分享描述
				desc: ((typeof WeixinJSApi.desc()=="undefined") || !WeixinJSApi.desc() ||WeixinJSApi.desc()=="")?defaultDesc:WeixinJSApi.desc(),
				//分享链接
				link: ((typeof WeixinJSApi.link()=="undefined") || !WeixinJSApi.link() ||WeixinJSApi.desc()=="")?defaultDesc:WeixinJSApi.link(),
				//分享图标
				imgUrl: ((typeof WeixinJSApi.imgUrl()=="undefined") || !WeixinJSApi.imgUrl() || WeixinJSApi.imgUrl()=="")?defaultLogo:WeixinJSApi.imgUrl(),
				trigger: function (res) {
					// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
				},
				success: function (res) {
					if($('.videoPK_share_pop').length>0){
						$('.videoPK_share_pop').hide();
					}
					// 跳转
          g_sps.jump(null, WeixinJSApi.turnToUrl());
				},
				cancel: function (res) {
					// 用户取消分享后执行的回调函数
					//localStorage.setItem("swiperIndex", WeixinJSApi.swiperLength());
					if($("#videoPK_weixin_zhezhao").length>0){
						$("#videoPK_weixin_zhezhao").remove();
					}

				},
				fail: function (res) {
					//console.log(JSON.stringify(res));
				}
			});
			wx.onMenuShareTimeline({
				//分享标题
				title: ((typeof WeixinJSApi.weiXinCircleTitle()=="undefined") || !WeixinJSApi.weiXinCircleTitle() ||WeixinJSApi.weiXinCircleTitle()=="")?defaultTitle:WeixinJSApi.weiXinCircleTitle(), // 分享标题
				//无此参数
				//desc: ((typeof WeixinJSApi.desc()=="undefined") || !WeixinJSApi.desc() ||WeixinJSApi.desc()=="")?defaultDesc:WeixinJSApi.desc(), // 分享描述
				//分享链接
				link: (!WeixinJSApi.link() || WeixinJSApi.link()=="")?defaultLink:WeixinJSApi.link(), // 分享链接//
				//分享图标
				imgUrl: ((typeof WeixinJSApi.imgUrl()=="undefined") || !WeixinJSApi.imgUrl() || WeixinJSApi.imgUrl()=="")?defaultLogo:WeixinJSApi.imgUrl(),
				trigger: function (res) {
					// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
				},
				success: function (res) {
					// 跳转
          g_sps.jump(null,WeixinJSApi.turnToUrl());
				},
				cancel: function (res) {
					// 用户取消分享后执行的回调函数
					if($("#videoPK_weixin_zhezhao").length>0){
						$("#videoPK_weixin_zhezhao").remove();
					}
				},
				fail: function (res) {
					//console.log(JSON.stringify(res));
				}
			});
		});
	},
	error:function(){
		wx.error(function(res){
			// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看。
			//console.log("配置错误");
		});
	},
	checkJsApi:function(api){
		wx.checkJsApi({
			jsApiList: [api],
			success: function(res) {
				// 以键值对的形式返回，可用的api值true，不可用为false
				// 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
			}
		});
	},
	//获取口令
	getWxToken:function() {
		var token = "";
		var data=commdata.getResponseData("getWxAccessToken");
		if(data && data.access_token){
			token=data.access_token;
		}
		return token;
	},
	getWxJsapiTicket:function (){
		var ticket="";
		var token=this.getWxToken();
		if(token && token!=""){
			var data=commdata.getResponseData("getJSTicket",{accessToken:token});
			if(data && data.ticket && data.errmsg=="ok"){
				ticket=data.ticket;
			}
		}
		return ticket;
	},
	getWxJSConfig:function (){
		var wxUrl=window.location.href;
		var data=commdata.getResponseData("getJSConfig",{url:wxUrl});
		return data;
	},
	link:function (){
		return location.href;
	},
	title:function (){
		return "唯医—医生互动社区，医学继续教育";
	},
	desc:function (){
		return "汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。";
	},
	imgUrl:function (){
		var defaultLogo="https://m.llinmd.cn/images/img50allin_logo.png";
		var temp60="",temp100="",temp150="",temp200="",temp300="";
		var images=document.images;
		for(var i=0;i<images.length;i++){
			var a=images[i];
			if(temp60=="" && a.width>60 && a.height>60){
				defaultLogo=a.src;
				temp60=a.src;
			}
			if(temp100=="" && a.width>100 && a.height>100){
				defaultLogo=a.src;
				temp100=a.src;
			}
			if(temp150=="" && a.width>150 && a.height>150){
				defaultLogo=a.src;
				temp150=a.src;
			}
			if(temp200=="" && a.width>200 && a.height>200 && a.width<=300  && b.height<=300){
				defaultLogo=a.src;
				temp200=a.src;
				break;
			}

		}
		return defaultLogo;
	}
};
//$(function(){
//    WeixinJSApi.init(); //配置默认分享内容
//});
///**
// * 判断是否来自微信浏览器
// */
//WeixinJSApi.is_weixin=function (){
//    var ua = navigator.userAgent.toLowerCase();
//    if(ua.match(/MicroMessenger/i)=="micromessenger") {
//        return true;
//    } else {
//        return false;
//    }
//}
