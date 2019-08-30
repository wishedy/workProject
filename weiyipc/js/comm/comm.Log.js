/**
 * 功能描述：记录日志
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiuYuTao on 2015/4/20.
 */
comm.Log = (function () {
	var urlList = {
		createBrowse:PC_CALL+"log/customer/browse/createBrowse/",	// 创建浏览记录
		updateLeave: PC_CALL+"log/customer/browse/updateLeave/"	// 更新浏览记录－离开页面时间
	};
	var browseUrl = [
		{//TODO 暂未配置sps
			id: '119',
			name: '进修项目页-项目介绍',
			url: '/intro_index.html'
		},
		{//TODO 暂未配置sps
			id: '120',
			name: '进修项目页-进修中心',
			url: '/project_index.html'
		},

	];

	var logParam;
	var logId;
	var execute = function (funcName, paramJson) {
		var url = urlList[funcName];
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
			async: paramJson.async != undefined ? paramJson.async : true,
			timeout: 10000,
			success: function callback(rep) {
				if (rep && rep.responseObject) {
					responseData = rep.responseObject;
				} else {
					responseData = rep;
				}
				logId = responseData.responseMessage;
			},
			error: function () {
			}
		});

		return responseData;
	};

	function search() {
		var loc = "//" + location.hostname + location.pathname.replace("//", "/");
		for (var i = 0; i < browseUrl.length; i++) {
			var obj = browseUrl[i];
			if(obj&&obj.url.length){
                if (loc == obj.url || (obj.url && obj.url.match(loc)) || (loc.indexOf(obj.url) > -1 && obj.id != 35)) {
                    return obj;
                }else {
					/*return {
						id:'0',
						name:'未收录类型',
						url:window.location.href
					}*/
				}
			}
		}
		return null;
	}

	/**
	 * 百度统计
	 */
    function addBaidu(){
		var _hmt = _hmt || [];
		if(/env=online/g.test(document.cookie)) {
			var hm = document.createElement("script");
			hm.src = "//hm.baidu.com/h.js?2a8bdc22175d5b291d02db032672746c";
			var s = document.getElementsByTagName("script")[0];
			s.parentNode.insertBefore(hm, s);
		}
	}
 	return {
		/**
		 * 浏览记录
		 * browseType:1-主页，2-视频应用页,3-文库应用页,4-视频内容页,5-文库内容页,6-个人主页,7-个人首页,8个人资料页
		 */
		createBrowse: function (param) {
            var weixinFlag=(navigator.userAgent.toLowerCase().indexOf("micromessenger") > -1 || navigator.userAgent.toLowerCase().indexOf("wechat") > -1) ? "isWeiXin" : "notWeiXin";
			if (param) {
				logParam = {browseUrl: param.href, browseType: param.id, opDesc: param.name,platformId: $('#sesDepartment').val()==undefined?1:$('#sesDepartment').val(),customerId:$("#sesCustomerId").val(),opAdvice:navigator.userAgent+"_"+weixinFlag,opSource:"pc",sendSiteId:1};
				if(param.noTimeOut){
					execute("createBrowse", logParam);
				}else{
					setTimeout(function() {
						execute("createBrowse", logParam);
					},1500);
				}

			} else {
				var obj = search();
				if (obj) {
					logParam = {browseUrl: location.href, browseType: obj.id, opDesc: obj.name,platformId: $('#sesDepartment').val()==undefined?1:$('#sesDepartment').val(),customerId:$("#sesCustomerId").val(),opAdvice:navigator.userAgent+"_"+weixinFlag,opSource:"pc",sendSiteId:1};
					if(obj.noTimeOut){
						execute("createBrowse", logParam);
					}else{
						setTimeout(function() {
							execute("createBrowse", logParam);
						},1500);
					}
				}
			}
		},
		/**
		 * 离开页面记录
		 */
		updateLeave: function () {
			if (logParam != undefined) {
				var param={id: logId, async: false};
				if(typeof g_sps!="undefined"){
					param = $.extend(param,{
						sessionId:g_sps._$.sessionId + "_" + g_sps._$.sessionIndex,
						openedCount: g_sps._$.openedCount
					})
				}
				execute("updateLeave", param);
			}
		}
	}
})();

$(window).on('beforeunload',function (evt) {
	comm.Log.updateLeave();
});
$(function () {
	comm.Log.createBrowse();
});


/**
 * 在调试状态下的话，在控制台输出调试信息 在需要日志的地方，更改debugMode = 1
 * */
function debugLog() {
	if (typeof debugMode != "undefined" && debugMode&&console.group!=undefined) {
		if(arguments.length >1){
			console.group("group");
		}
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "object") {
				console.dir(arguments[i]);
			} else {
				console.log(arguments[i]);
			}
		}
		if(arguments.length >1){
			console.groupEnd();
		}
	}
}
