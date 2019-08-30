$(function(){
    //点击分享按钮分享层关闭
    $('.videoPK_share_pop a').on("touchend",function(e){
        $(this).parents('.videoPK_share_pop').hide();
        e.preventDefault();
    })

    //点击分享层本身-分享层关闭
    $('.videoPK_share_pop').on("touchend",function(e){
        $(this).hide();
        e.preventDefault();
    })
    //返回顶部
    $('.fhdb').on("touchend",function(e){
        $('body').animate({scrollTop:0},500);
        e.preventDefault();
    })
    //分享
    $('.share_sina').on("touchend",function(){
        shareSina();
    })
    $('.share_qq').on("touchend",function(){
        shareQQ();
    })
    $('.share_qzone').on("touchend",function(){
        shareQzone();
    })
    setTimeout(function(){
        localStorage.getItem('NumbInfo')&&initShareWeixinm();
    },1000);

});

/**
* 微信分享
*/
function initShareWeixinm(){
    // 分享给微信好友信息
	var weiXinTitle="测一测：你离骨科大佬还差几步";
	var weiXinDesc=JSON.parse(localStorage.getItem("NumbInfo")).worthTag;
	var weiXinLogo="/images/img50/column/data_magic/shareLog.jpg";
    var weiXinLink="/html/pages/column/data_magic/dataMagic_index.html";
    var weiXinCircleTitle="我的评价为"+ JSON.parse(localStorage.getItem("NumbInfo")).worthTag +"，快来测测你离骨科大佬还差几步";
    //跳转的app下载页参数
    var turnToUrl,swiperLength,online = localStorage.getItem('NumbInfo') && localStorage.getItem('online');
    if (online === "no") {          // online = no 代表线下
        turnToUrl   = "dataMagic_gift.html";
    } else {
       turnToUrl = "dataMagic_download.html";
    }
    swiperLength = (localStorage.getItem('NumbInfo') && localStorage.getItem('swiperLength'));
    WeixinJSApi.turnToUrl = function(){
        return turnToUrl;
    };
    //swiper页面总长度
    WeixinJSApi.swiperLength = function(){
        return swiperLength;
    };
    WeixinJSApi.link = function(){
        return weiXinLink;
    };
    WeixinJSApi.weiXinCircleTitle = function(){
        return weiXinCircleTitle;
    };
	WeixinJSApi.title=function(){
		return weiXinTitle;
	};
	WeixinJSApi.desc=function(){
		return weiXinDesc;
	};

	WeixinJSApi.imgUrl=function(){
		return weiXinLogo;
	};
	WeixinJSApi.init();
}

//分享
function shareSina(){
	var openurl="http://v.t.sina.com.cn/share/share.php?&appkey=895033136",
		url="&url="+encodeURIComponent("/html/pages/column/data_magic/dataMagic_index.html"),
		title="&title="+ JSON.parse(localStorage.getItem("NumbInfo")).worthTag,
		pic="&pic=/images/img50/column/data_magic/shareLog.jpg";
	var aLink = openurl+url+title+pic;
    window.open(aLink,'_blank');

    // 判断线上线下的跳转
    var online = localStorage.getItem('NumbInfo') && localStorage.getItem('online');
    if (online === "no") {          // online = no 代表线下
      g_sps.jump(null,"dataMagic_gift.html");
    } else {
      g_sps.jump(null,"dataMagic_download.html");
    }
}
function shareQzone(){
		var openurl;		//分享链接，PC手机两种
		var title = "&title="+ encodeURIComponent("我的评价为"+ JSON.parse(localStorage.getItem("NumbInfo")).worthTag +"，快来测测你离骨科大佬还差几步");			//分享标题
		var url = "&url="+encodeURIComponent("/html/pages/column/data_magic/dataMagic_index.html"),	        //分享url
            pics="&pics="+ encodeURIComponent("/images/img50/allin_logo.png"),						//图片链接
			t="&t="+new Date().getTime();							                                                                        //时间戳

		if(IsPC()){
			//PC端
			openurl="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?";
			var aLink = openurl+"desc="+pics+title+url;
            window.open(aLink,'_blank');
            // 判断线上线下的跳转
            var online = localStorage.getItem('NumbInfo') && localStorage.getItem('online');
            if (online === "no") {          // online = no 代表线下
              g_sps.jump(null,"dataMagic_gift.html");
            } else {
              g_sps.jump(null,"dataMagic_download.html");
            }
		}else{
			//移动端
			openurl="http://qzs.qzone.qq.com/open/connect/widget/mobile/qzshare/feedback.html?";
			var aLink = openurl+"&desc="+pics+title+url+t;
            window.open(aLink,'_blank');
            // 判断线上线下的跳转
            var online = localStorage.getItem('NumbInfo') && localStorage.getItem('online');
            if (online === "no") {          // online = no 代表线下
              g_sps.jump(null,"dataMagic_gift.html");
            } else {
              g_sps.jump(null,"dataMagic_download.html");
            }
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
