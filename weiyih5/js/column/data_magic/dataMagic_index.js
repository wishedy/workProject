var Datacube = {
};
// 数据获取
Datacube.getData = function (customerId) {
    var params = {};
    params.paramJson = JSON.stringify({customerId: customerId});
    $.ajax({
        url: '/mcall/customer/statisticsStat/info/',
        type: 'POST',
        data: params,
        async: false,
        error: function (xhr) {
            //console.log("错误提示： " + xhr.status + " " + xhr.statusText);
        },
        success: function (data) {
            if (data.responseObject.responseData.bo_data && !$.isEmptyObject(data.responseObject.responseData.bo_data)) {
                Datacube.InfoWriteLocal(data);
            } else {                        // 未成功返回数据,跳转至登录页
              g_sps.jump(null,'/pages/column/data_magic/dataMagic_login.html');
            }
        }
    });
};
// 简单数据处理并写入缓存
Datacube.InfoWriteLocal= function (data) {
    var stateData = {"J":1,"I":2,"H":3,"G":4,"F":5};
    data.responseObject.responseData.bo_data.worthLevel=stateData[data.responseObject.responseData.bo_data.worthLevel];
    if(data.responseObject.responseData.bo_data.worthLevel ==5){
        data.responseObject.responseData.bo_data.worthLevelTitle = "您已成为唯医网的骨科大佬";
    }else{
        data.responseObject.responseData.bo_data.worthLevelTitle = "您距“骨科大佬”仅"+(5-data.responseObject.responseData.bo_data.worthLevel)+"步";
    }
    // 设置默认值
    data.responseObject.responseData.bo_data.worthTag = data.responseObject.responseData.bo_data.worthTag || "初出茅庐，还需努力";
    if(_that.isEmptyObject(data.responseObject.responseData.bo_data.titleLevel)){data.responseObject.responseData.bo_data.titleLevel="医路学徒"}
    data.responseObject.responseData.bo_data.browseVideoTime = data.responseObject.responseData.bo_data.browseVideoTime || 0;
    data.responseObject.responseData.bo_data.sendResourcesTotal = data.responseObject.responseData.bo_data.sendResourcesTotal || 0;
    data.responseObject.responseData.bo_data.browsedMyresourceTotal = data.responseObject.responseData.bo_data.browsedMyresourceTotal || 0;
    localStorage.setItem("NumbInfo", JSON.stringify(data.responseObject.responseData.bo_data));
};
// 判断是否登录
Datacube.isLogin = function () {
    var userId = parseInt(localStorage.getItem('userId')),online = window.location.search.split(/online=/)[1] || 0;
    localStorage.setItem("online", online);    //将线上线下参数存储
    var timeNode = '2016年04月20日';
    var state = JSON.parse(localStorage.getItem('NumbInfo'));

    if(state){
        var registTime = localStorage.getItem('NumbInfo') && JSON.parse(localStorage.getItem('NumbInfo')).registTime;
        if(registTime === null)  {
          g_sps.jump(null,'/pages/column/data_magic/dataMagic_login.html');
        }
        if (registTime > timeNode) {        // 新用户
            if (online === "no") {          // online = no 代表线下
                $("#EV-isLogin").attr("href", "/html/pages/column/data_magic/dataMagic_map.html");
            } else {
                $("#EV-isLogin").attr("href", "/html/pages/column/data_magic/dataMagic_download.html");
            }
        }else{
            $("#EV-isLogin").attr("href", "/html/pages/column/data_magic/dataMagic_course.html");
        }
    }else if (userId) {
        this.getData(userId);
        var registTime = localStorage.getItem('NumbInfo') && JSON.parse(localStorage.getItem('NumbInfo')).registTime;
        if(registTime === null)  {
          g_sps.jump(null,'/pages/column/data_magic/dataMagic_login.html');
        }
        if (registTime > timeNode) {        // 新用户
            if (online === "no") {          // online = no 代表线下
                $("#EV-isLogin").attr("href", "/html/pages/column/data_magic/dataMagic_map.html");
            } else {
                $("#EV-isLogin").attr("href", "/html/pages/column/data_magic/dataMagic_download.html");
            }
        }else{
            $("#EV-isLogin").attr("href", "/html/pages/column/data_magic/dataMagic_course.html");
        }
    }else{
        localStorage.setItem("fromPage", "/html/pages/column/data_magic/dataMagic_jump.html");
        $("#EV-isLogin").attr("href", "/html/pages/column/data_magic/dataMagic_login.html?redirect=1")
    }

};

$(function () {
    // Datacube.isLogin();
});

