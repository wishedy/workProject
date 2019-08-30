import comm from 'static/js/comm.js';
import TempCache from 'static/js/tempcache.js';
const Log={
    urlList : {
        createBrowse: "/mcall/log/customer/browse/createBrowse/",	// 创建浏览记录
        updateLeave: "/mcall/log/customer/browse/updateLeave/"	// 更新浏览记录－离开页面时间
    },
	logId:"",
	isClose:false,
	execute:function(funcName, param){
        let t = this;
        let url = t.urlList[funcName];
        let responseData = null;

        comm.ajax2({
            type: 'POST',
            url: url,
            data: {paramJson:JSON.stringify(param)},
            success: function callback(rep) {
                if (rep && rep.responseObject) {
                    responseData = rep.responseObject;
                } else {
                    responseData = rep;
                }
                if (responseData)
                    t.logId = responseData.responseMessage
            }
        });

        return responseData;
	},
	//创建浏览记录
    createBrowse : function (browseType, opDesc, url) {
        let t = this;
        let broseUrl;
        if (url != undefined) {
            broseUrl = url;
        } else {
            broseUrl = window.location.href.substr(0, 250);
        }
        let weixinFlag=(navigator.userAgent.toLowerCase().indexOf("micromessenger") > -1 || navigator.userAgent.toLowerCase().indexOf("wechat") > -1) ? "isWeiXin" : "notWeiXin";
        let param = {browseUrl: broseUrl, browseType: browseType, opDesc: opDesc,platformId:TempCache.getItem('department')||1,opAdvice:navigator.userAgent+"_"+weixinFlag,opSource:"wap",sendSiteId:2};
        let openPage = "";
        if (openPage == null || openPage == "") {
            t.execute("createBrowse", param);
            let exp = new Date();
            exp.setTime(exp.getTime() + 20 * 1000);
            document.cookie = "openPage=on;expires=" + exp.toGMTString();
        }
    },
	//离开更新浏览记录 （记下离开时间）
    updateLeave : function () {
		let t=this;
        if (t.logId && t.logId != "") {
            let param = {id: t.logId, async: false};
            if(typeof g_sps!="undefined"){
                param = $.extend(param,{
                    sessionId:g_sps._$.sessionId + "_" + g_sps._$.sessionIndex,
                    openedCount: g_sps._$.openedCount
                })
            }
            t.execute("updateLeave", param);
            t.logId = "";
        }
    }
};
export default Log;
window.addEventListener('onbeforeunload',Log.updateLeave,false);
// window.onbeforeunload=function(){
//     Log.updateLeave();
// };

//加url不同加部分日志
(function addLog(){
     let url = window.location.href.split(':')[1];
     switch(url.split('?')[0]){ //防止加了sps之后带参数
         case '//m.allinmd.cn/pages/personal/sns.html?action=fans':
             Log.createBrowse(124,'粉丝列表');
             break;
         case '//m.allinmd.cn/pages/personal/sns.html?action=praise':
             Log.createBrowse(127,'点赞列表');
             break;
         case '//m.allinmd.cn/pages/personal/sns.html?action=follow':
             Log.createBrowse(126,'关注医师列表');
             break;
     }
 })();