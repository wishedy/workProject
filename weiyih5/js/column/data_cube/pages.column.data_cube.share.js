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
        $('body').animate({scrollTop:0},500)
        e.preventDefault();
    })
    //分享
    $('.share_sina').on("touchend",function(e){
        shareSina();
    })
    $('.share_qq').on("touchend",function(){
        shareQQ();
    })
    $('.share_qzone').on("touchend",function(){
        shareQzone();
    })

    setTimeout(function(){
       initShareWeixinm();
    },1000);

});

/**
* 微信分享
*/
function initShareWeixinm(){
	var weiXinTitle="晒晒您的骨医账单！";
	var weiXinDesc="我的2015唯医价值，等同于"+ JSON.parse(localStorage.getItem("dataCube")).worthLevel +",你的呢，快来测测吧!";
	var weiXinLogo="//m.allinmd.cn/html/pages/column/data_cube/images/logo800.png";
    var weiXinLink="//m.allinmd.cn/html/pages/column/data_cube/dataCube_index2.html?cid="+JSON.parse(localStorage.getItem("dataCube")).customerId;

    WeixinJSApi.link = function(){
        return weiXinLink;
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
		url="&url="+encodeURIComponent("//m.allinmd.cn/html/pages/column/data_cube/dataCube_index2.html?cid="+JSON.parse(localStorage.getItem("dataCube")).customerId),
		title="&title=我的2015唯医价值，等同于"+ JSON.parse(localStorage.getItem("dataCube")).worthLevel +"，你的呢，快来测测吧！",
		pic="&pic=//m.allinmd.cn/html/pages/column/data_cube/images/logo800.png";
	var aLink = openurl+url+title+pic;
	window.open(aLink,'_blank')
}

function shareQzone(){
		var openurl;		//分享链接，PC手机两种
		var title = "&title="+ encodeURIComponent("我的2015唯医价值，等同于"+ JSON.parse(localStorage.getItem("dataCube")).worthLevel +"，你的呢，快来测测吧！");			//分享标题
		var url = "&url="+encodeURIComponent("//m.allinmd.cn/html/pages/column/data_cube/dataCube_index2.html?cid="+JSON.parse(localStorage.getItem("dataCube")).customerId),	//分享url
			imageUrl = "&imageUrl="+ encodeURIComponent("//m.allinmd.cn/html/pages/column/data_cube/images/logo800.png"),				//图片链接
			pics="&pics="+ encodeURIComponent("//m.allinmd.cn/html/pages/column/data_cube/images/logo800.png"),						//图片链接
			t="&t="+new Date().getTime();							//时间戳

		if(IsPC()){
			//PC端
			openurl="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?";
			var aLink = openurl+"desc="+imageUrl+pics+title+url;
			window.open(aLink,'_blank');

		}else{
			//移动端
			openurl="http://qzs.qzone.qq.com/open/connect/widget/mobile/qzshare/feedback.html?";
			var aLink = openurl+"&desc="+imageUrl+title+url+t;
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