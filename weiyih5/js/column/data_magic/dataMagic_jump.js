var DatacubeJump = {};

DatacubeJump.getData = function (customerId) {
    var params = {};
    params.paramJson = JSON.stringify({customerId: customerId});
    $.ajax({
        url: '/mcall/customer/statisticsStat/info/',
        type: 'POST',
        data: params,
        async: false,
        error: function (xhr) {
            console.log("错误提示： " + xhr.status + " " + xhr.statusText);
        },
        success: function (data) {
            if (data.responseObject.responseData.bo_data && !$.isEmptyObject(data.responseObject.responseData.bo_data)) {
                DatacubeJump.InfoWriteLocal(data);
            } else {                        // 未成功返回数据,跳转至登录页
              g_sps.jump(null,'/pages/column/data_magic/dataMagic_login.html');
            }
        }
    });
};
// 判断是否登录,如需要则加载数据
DatacubeJump.isLogin= function () {
    var userId = parseInt(localStorage.getItem('userId'));
    if(localStorage.getItem('NumbInfo')){
        return true;
    }else if (userId) {
        this.getData(userId);
    }else{
        localStorage.setItem("fromPage", "/html/pages/column/data_magic/dataMagic_jump.html");
      g_sps.jump(null,'/pages/column/data_magic/dataMagic_login.html');
    }
};
// 简单数据处理并写入缓存
DatacubeJump.InfoWriteLocal= function (data) {
    var stateData = {"J":1,"I":2,"H":3,"G":4,"F":5};
    data.responseObject.responseData.bo_data.worthLevel = stateData[data.responseObject.responseData.bo_data.worthLevel] || 1;
    if(data.responseObject.responseData.bo_data.worthLevel == 5){
        data.responseObject.responseData.bo_data.worthLevelTitle = "您已成为唯医网的骨科大佬";
    }else{
        data.responseObject.responseData.bo_data.worthLevelTitle =  "您距“骨科大佬”仅"+(5- data.responseObject.responseData.bo_data.worthLevel )+"步";
    }
    // 设置默认值
    data.responseObject.responseData.bo_data.worthTag = data.responseObject.responseData.bo_data.worthTag || "初出茅庐，还需努力";
    if(this.isEmptyObject(data.responseObject.responseData.bo_data.titleLevel)){data.responseObject.responseData.bo_data.titleLevel="医路学徒"}
    data.responseObject.responseData.bo_data.browseVideoTime = data.responseObject.responseData.bo_data.browseVideoTime || 0;
    data.responseObject.responseData.bo_data.sendResourcesTotal = data.responseObject.responseData.bo_data.sendResourcesTotal || 0;
    data.responseObject.responseData.bo_data.browsedMyresourceTotal = data.responseObject.responseData.bo_data.browsedMyresourceTotal || 0;
    localStorage.setItem("NumbInfo", JSON.stringify(data.responseObject.responseData.bo_data));
};
// 根据场景选择不同的APP下载地址
DatacubeJump.downloadAppAddress = function () {
    var userAgentInfo = navigator.userAgent;
    var isIphone = false;
    if (userAgentInfo.indexOf("iPhone") > 0) {
        isIphone = true;
    }
    var isWeixin = (userAgentInfo.indexOf("MicroMessenger") > 0);
    if (isIphone) {
        if (isWeixin) {
            link = "http://fusion.qq.com/cgi-bin/qzapps/unified_jump?appid=12138947&from=groupmessage&isTimeline=false&actionFlag=0?ms=pname%3Dcom.allin.social%26versioncode%3D1%26channelid%3D%26actionflag%3D0&isappinstalled=1";
        } else {
            link = "https://itunes.apple.com/cn/app/wei-yi-for-iphone/id986266583";
        }
    } else {
        link = "http://a.app.qq.com/o/simple.jsp?pkgname=com.allin.social";
    }
    return link;
};
//根据时间节点判断跳转url
DatacubeJump.jumpToUrl = function(){
    var online = localStorage.getItem('NumbInfo') && localStorage.getItem('online');
    var timeNode = '2016年04月20日';
    var registTime = localStorage.getItem('NumbInfo') && JSON.parse(localStorage.getItem('NumbInfo')).registTime;
    // 数据为空 跳转到登录页
    if(registTime === null)  {
      g_sps.jump(null,'/pages/column/data_magic/dataMagic_login.html');
    }else if (registTime > timeNode) {        // 新用户
        if (online === "no") {          // online = no 代表线下
          g_sps.jump(null,'dataMagic_map.html');
        } else {
          g_sps.jump(null,"dataMagic_download.html");
        }
    }else{
      g_sps.jump(null,'dataMagic_course.html');
    }
};

// 判断是否空对象
DatacubeJump.isEmptyObject=function (obj){
    for(var n in obj){return false}
    return true;
};
    DatacubeJump.isLogin();
    DatacubeJump.jumpToUrl();

