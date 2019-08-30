var Log = {};
Log.urlList = {
	createBrowse: "/mcall/log/customer/browse/createBrowse/",	// 创建浏览记录
	updateLeave: "/mcall/log/customer/browse/updateLeave/"	// 更新浏览记录－离开页面时间
};
Log.logId = "";
Log.isClose = false;
Log.execute = function (funcName, paramJson) {
	var t = Log;
	var url = t.urlList[funcName];
	var responseData = null;
	var param = {};
	if (paramJson && paramJson != "") {
		param.paramJson = $.toJSON(paramJson);
	} else {
		//param.paramJson= "{}";
	}
	$.ajax({
		type: 'POST',
		url: url,
		data: param,
		dataType: "json",
		async: true,//(paramJson.async == true) ? true : false,
		timeout: 10000,
		success: function callback(rep) {
			if (rep && rep.responseObject) {
				responseData = rep.responseObject;
			} else {
				responseData = rep;
			}
			if (responseData)
				Log.logId = responseData.responseMessage
		},
		error: function () {
		}
	});

	return responseData;
};

Log.getCookie = function (Name) {
	var cookieName = encodeURIComponent(Name) + "=",  //注cookie的名和值都是经过URL编码的,所有这里要用函数编码
	returnvalue = "",
	cookieStart = document.cookie.indexOf(cookieName),
	cookieEnd = null;
	if (cookieStart > -1) {
		cookieEnd = document.cookie.indexOf(";", cookieStart);
		if (cookieEnd == -1) {
			cookieEnd = document.cookie.length;
		}
		returnvalue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));  //对应的解码
	}
	return returnvalue;
};

Log.getPage = function (id) {
	var len = LogPageId.length;
	var page = null;
	for (var i = 0; i < len; i++) {
		var pageObj = LogPageId[i];
		if (pageObj != null && pageObj.id != null && pageObj.id == id) {
			page = pageObj;
		}
	}
	return page;
};

/**
 * 浏览记录
 * browseType:1-主页，2-视频应用页,3-文库应用页,4-视频内容页,5-文库内容页,6-个人主页,7-个人首页,8个人资料页
 */
Log.createBrowse = function (browseType, opDesc, url) {
	var t = Log;
	var broseUrl;
	if (url != undefined) {
		broseUrl = url;
	} else {
		broseUrl = window.location.href.substr(0, 250);
	}
  var weixinFlag=(navigator.userAgent.toLowerCase().indexOf("micromessenger") > -1 || navigator.userAgent.toLowerCase().indexOf("wechat") > -1) ? "isWeiXin" : "notWeiXin";
	var param = {browseUrl: broseUrl, browseType: browseType, opDesc: opDesc,platformId:TempCache.getItem('department')||1,opAdvice:navigator.userAgent+"_"+weixinFlag,opSource:"wap",sendSiteId:2};
	var openPage = "";//t.getCookie("openPage");
	if (openPage == null || openPage == "") {
		t.execute("createBrowse", param);
		var exp = new Date();
		exp.setTime(exp.getTime() + 20 * 1000);
		document.cookie = "openPage=on;expires=" + exp.toGMTString();
	}

}

/**
 * 离开页面记录
 */
Log.updateLeave = function () {
	if (Log.logId && Log.logId != "") {
		var param = {id: Log.logId, async: false};
        if(typeof g_sps!="undefined"){
            param = $.extend(param,{
                sessionId:g_sps._$.sessionId + "_" + g_sps._$.sessionIndex,
                openedCount: g_sps._$.openedCount
            })
        }
		Log.execute("updateLeave", param);
		Log.logId = "";
	}
};

$(window).bind('beforeunload',function (evt) {
	Log.updateLeave();
});

//加url不同加部分日志
(function addLog(){
     var url = window.location.href.split(':')[1];
     switch(url.split('?')[0]){ //防止加了sps之后带参数
         case '/pages/personal/sns.html?action=fans':
             //Log.createBrowse(124,'粉丝列表');
             setTimeout(function(){
                 g_sps.createBrowse({pageId:431});
             },2200);
             break;
         case '/pages/personal/sns.html?action=praise':
             //Log.createBrowse(127,'点赞列表');
             setTimeout(function(){
                 g_sps.createBrowse({pageId:417});
             },2200);
             break;
         case '/pages/personal/sns.html?action=follow':
             Log.createBrowse(126,'关注医师列表');
             break;
     }
 })();