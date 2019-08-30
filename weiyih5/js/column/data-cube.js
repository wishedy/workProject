var dataCube = {};
//检验是否登录，未登录去登录页
dataCube.validateLogin = function(e){
    if(localStorage.getItem('userId') === null){
        g_sps.jump(null,'/pages/column/data_cube/dataCube_login.html');
        e.preventDefault();
    }
}

//ajax初始化数据
dataCube.initData = function(state){
    var params = {};
    params.paramJson = $.toJSON({customerId:state.cid});
    var $promise = $.ajax({
        url: '/mcall/customer/statisticsStat/info/',
        type: 'POST',
        data: params
    });

    var deferred = {
        succ: function(data){
            if(data.responseObject.responseStatus && !$.isEmptyObject(data.responseObject.responseData)){
                var data = data.responseObject.responseData.bo_data;
                localStorage.setItem('dataCube',JSON.stringify(data));
                dataCube.showData(state);
            }else{
              g_sps.jump(null,'dataCube_error.html');
            }
        }
    }
    $promise.done(deferred.succ);
}

//显示数据
dataCube.showData = function(state){
    var data = JSON.parse(localStorage.getItem("dataCube"));
    var href = location.href;
    if(data !== null) {
        if (href.indexOf("dataCube_index2")>-1){ //index2
            $(".Ev-trueName").text(data.trueName); //显示名称

        }else if(href.indexOf("dataCube_welcome")> -1){ //welcome
            $(".Ev-trueName").text(data.trueName); //显示名称
            $(".Ev-date").text(data.registTime); //显示日期
            dataCube.runNum(".Ev-day",data.dayNum,0,1);  //注册时间到‘2016-01-01’日一共多少天

        }else if(href.indexOf("dataCube_star")> -1){ //star
            $(".Ev-busy").html(state.isSelf?'<img src="images/DC_starYou.png" alt="忙碌的你"/>':'<img src="images/DC_starTa.png" alt="忙碌的他"/>'); //忙碌的他或我
            dataCube.runNum(".Ev-resourceNum",data.sendResourcesTotal,0,1); //上传资源数
            dataCube.runNum(".Ev-reviewNum",data.reviewNum,0,1); //回复了多少条评论
            $(".Ev-starLevel").html(dataCube.StyleStarLevel(data.starLevel)); //显示星级

        }else if(href.indexOf("dataCube_diligent")> -1){//diligent
            $(".Ev-diligent").html(state.isSelf?'<img src="images/DC_datay.png" alt="勤奋的你">':'<img src="images/DC_datah.png" alt="勤奋的他">');
            dataCube.runNum(".Ev-browseCaseNum", data.browseCaseNum,0,1);  //浏览了多少病例
            dataCube.runNum(".Ev-readDocNum", data.browseDocNum,0,1); //阅读了多少文章
            dataCube.runNum(".Ev-viewVideoNum", data.browseVideoNum,0,1); //查看了多少视频
            dataCube.runNum(".Ev-browseVideoTime", data.browseVideoTime,0,1); //观看总时长
            dataCube.runNum(".Ev-conferenceNum", data.conferenceLevel,0,1); //相当于多少个会议

        }else if(href.indexOf("dataCube_attention")> -1){ //attention
            $(".Ev-friendly").html(state.isSelf?'<img src="images/DC_attentionYou_03.png" alt="友善的你"/>':'<img src="images/DC_attentionTa.png" alt="友善的他"/>');
            $(".Ev-FollowTA").html(state.isSelf?'你':'TA');
            dataCube.runNum(".Ev-followDoctorNum",data.followPeopleNum,0,1); //关注了多少医师
            $(".Ev-remark").html(data.followLevel); //得出评语

        }else if(href.indexOf("dataCube_value")> -1){ //value
            $(".Ev-who").text(state.isSelf?'您':'TA');
            $(".Ev-worthTag").html(dataCube.StyleWorthTag(data.worthTag));
            $(".Ev-worthLevel").text(data.worthLevel); //价值，一辆车
            $(".Ev-worthPercent").text(data.worthPercent); //超越百分比
            $(".Ev-viewOrShare").html(state.isSelf?'<a href="javascript:;" class="dc_xf"><img src="images/DC_vabtn01.png" data-self="1" alt=""></a>':'<a href="javascript:;" class="dc_xf"><img src="images/DC_vabtn03.png" data-self="0" alt=""></a>');
            dataCube.StyleFace(state.cid,".Ev-faceImg",data.customerLogo);
        }

    }
}

//根据场景选择不同的APP下载地址
dataCube.downloadAppAddress = function(){
    var userAgentInfo = navigator.userAgent;
    var isIphone = false;
    if (userAgentInfo.indexOf("iPhone") > 0) {
        isIphone = true
    }

    var isWeixin = (userAgentInfo.indexOf("MicroMessenger") > 0);

    if (isIphone) {
        if (isWeixin) {
            link = "http://fusion.qq.com/cgi-bin/qzapps/unified_jump?appid=12138947&from=groupmessage&isTimeline=false&actionFlag=0&params=pname%3Dcom.allin.social%26versioncode%3D1%26channelid%3D%26actionflag%3D0&isappinstalled=1";
        } else {
            link = "https://itunes.apple.com/cn/app/wei-yi-for-iphone/id986266583";
        }
    } else {
        link = "http://a.app.qq.com/o/simple.jsp?pkgname=com.allin.social";
    }

    return link;
}

//返回是否自己与客户id 优先取Url中cid,可以根据URL从入口处控制住为自已
dataCube.getUrlCid = function(){
    var id = 0;
    if(window.location.search.match(/\d+/) !== null)
        id = window.location.search.match(/\d+/).toString();
    else
        id = localStorage.getItem("userId");

    //未登录
    if( id === undefined || id=== null){
        if( location.href.indexOf("dataCube_index.html")>-1 || location.href.indexOf("dataCube_welcome")>-1 ){
            g_sps.jump(null,"dataCube_login.html");
            return false;
        }else{
            return {isSelf:0, cid:0}
        }
    }

    //登录：简单验证与确定是否为自已
    if(id.length === 13 && id != localStorage.getItem('userId')) return {isSelf:0,cid:parseInt(id)};
        return {isSelf:1,cid:parseInt(localStorage.getItem('userId'))};
}

//根据星级返回样式
dataCube.StyleStarLevel = function(level){
    var html = "", level = parseInt(level);
    switch(level){
        case 1:
            html = '<li class="dc_lightStar"></li>'+
            '<li class="dc_grayStar"></li>'+
            '<li class="dc_grayStar"></li>'+
            '<li class="dc_grayStar"></li>'+
            '<li class="dc_grayStar"></li>';
            break;
        case 2:
            html = '<li class="dc_lightStar"></li>'+
            '<li class="dc_lightStar"></li>'+
            '<li class="dc_grayStar"></li>'+
            '<li class="dc_grayStar"></li>'+
            '<li class="dc_grayStar"></li>';
            break;
        case 3:
            html = '<li class="dc_lightStar"></li>'+
            '<li class="dc_lightStar"></li>'+
            '<li class="dc_lightStar"></li>'+
            '<li class="dc_grayStar"></li>'+
            '<li class="dc_grayStar"></li>';
            break;
        case 4:
            html = '<li class="dc_lightStar"></li>'+
            '<li class="dc_lightStar"></li>'+
            '<li class="dc_lightStar"></li>'+
            '<li class="dc_lightStar"></li>'+
            '<li class="dc_grayStar"></li>';
            break;
        case 5:
            html = '<li class="dc_lightStar"></li>'+
            '<li class="dc_lightStar"></li>'+
            '<li class="dc_lightStar"></li>'+
            '<li class="dc_lightStar"></li>'+
            '<li class="dc_lightStar"></li>';
            break;
        default:
            html = '<li class="dc_grayStar"></li>'+
            '<li class="dc_grayStar"></li>'+
            '<li class="dc_grayStar"></li>'+
            '<li class="dc_grayStar"></li>'+
            '<li class="dc_grayStar"></li>'
    }
    return html;
}

//按tag返回对应图tag
dataCube.StyleWorthTag = function(tag){
    var html = "";
    switch(tag){
        case "常驻医师": html='<img src="images/DC_Dczys.png" alt="常驻医师">'; break;
        case "我为医狂": html='<img src="images/DC_Cwwyk.png" alt="我为医狂">'; break;
        case "勤学大师": html='<img src="images/DC_Bqxds.png" alt="勤学大师">'; break;
        case "医见领袖": html='<img src="images/DC_Ayjlx.png" alt="医见领袖">'; break;
        default: html='<img src="images/DC_Eylxt.png" alt="医路学徒">';
    }
    return html;
}

//处理背景图地址
dataCube.StyleFace = function(cid,ele,faceImg){
    if(faceImg === "" ){
        var faceRandom = Math.round(Math.random()*1);
        if(faceRandom){
            $(ele).html('<a href="/allin/personal/app/#/index?cid='+cid+'"><img src="images/DC_blue.png"></a>');
        }else{
            $(ele).html('<a href="/allin/personal/app/#/index?cid='+cid+'"><img src="images/DC_red.png"></a>');
        }
    }else{ //头像地址
        $(ele).html('<a href="/allin/personal/app/#/index?cid='+cid+'"><img src="'+faceImg+'"></a>');
    }
}

//跑计数器
dataCube.runNum = function(el,num,cur,time){
    setTimeout(function(){
         if(cur<num){
             cur++;
             $(el).text(cur);
             dataCube.runNum(el,num,cur,time);
         }
    },time);
}

$(function(){
    //获取cid与判断自已
    var state = dataCube.getUrlCid();

    //ajax或直接读取localStorage
    if(JSON.parse(localStorage.getItem('dataCube'))!== null && JSON.parse(localStorage.getItem('dataCube')).customerId == state.cid){
        //显示数据 提取localStorage
        dataCube.showData(state);
    }else{
        //初始化数据ajax
        dataCube.initData(state);
    }

    //index2
    $(".Ev-showSelfAcount").on("touchend",function(e){ //查看自己
        dataCube.validateLogin();
        g_sps.jump(null,'dataCube_welcome.html?cid='+localStorage.getItem('userId'));
        e.preventDefault();

    });

    $(".Ev-showOtherAcount , .Ev-linkIndex").on("touchend",function(){   //查看他人时
      g_sps.jump(null,'dataCube_star.html?cid='+dataCube.getUrlCid().cid);
    });

    //欢迎页
    $(".Ev-linkWelcome").on("touchend",function(){
      g_sps.jump(null,'dataCube_star.html?cid='+dataCube.getUrlCid().cid);
    });

    //星 忙碌的
    $(".Ev-linkStat").on("touchend",function(){
      g_sps.jump(null,'dataCube_diligent.html?cid='+dataCube.getUrlCid().cid);
    });

    //勤奋的
    $(".Ev-linkDiligent").on("touchend",function(){
      g_sps.jump(null,'dataCube_attention.html?cid='+dataCube.getUrlCid().cid);
    });

    //友善的
    $(".Ev-linkFriendly").on("touchend",function(){
      g_sps.jump(null,'dataCube_value.html?cid='+dataCube.getUrlCid().cid);
    });

    //value 查看自己或分享
    $(".Ev-viewOrShare").on("touchend",function(e){
        var isSelf = parseInt($("img",this).attr("data-self"));
        if(isSelf){
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

                $("#videoPK_weixin_zhezhao").on("touchend",function(e){
                    $("#videoPK_weixin_zhezhao").remove();
                    e.preventDefault();
                });

                $('body')
                    .append($zhezhao)
                    .delay(300)
                    .remove('#videoPK_weixin_zhezhao');
            }else{
                $('.videoPK_share_pop').show();
            }

            e.preventDefault();

        }else{
          g_sps.jump(null,'dataCube_welcome.html?cid='+localStorage.getItem('userId'));
        }
    });
    $(".Ev-downloadApp").on("touchend",function(){
      g_sps.jump(null,dataCube.downloadAppAddress());
    });


    /****向上向下划****/
    var dataCubeAddress = {
        "index2": { upUrl : "dataCube_star.html?cid="+dataCube.getUrlCid().cid },
        "welcome": {
            upUrl : "dataCube_star.html?cid="+dataCube.getUrlCid().cid,
            downUrl : "dataCube_index.html"
        },
        "star": {
            upUrl : "dataCube_diligent.html?cid="+dataCube.getUrlCid().cid
            //downUrl : "dataCube_welcome.html?cid="+dataCube.getUrlCid().cid
            //如果自己时welcome非自己index2;
        },
        "diligent": {
            upUrl : "dataCube_attention.html?cid="+dataCube.getUrlCid().cid,
            downUrl : "dataCube_star.html?cid="+dataCube.getUrlCid().cid
        },
        "attention": {
            upUrl : "dataCube_value.html?cid="+dataCube.getUrlCid().cid,
            downUrl : "dataCube_diligent.html?cid="+dataCube.getUrlCid().cid
        },
        "value": {
            downUrl : "dataCube_attention.html?cid="+dataCube.getUrlCid().cid
        }

    };

    $("body").on("swipeUp",function(){
        upDown("upUrl");
    });

    $("body").on("swipeDown",function(){
        upDown("downUrl");
    })

    function upDown(action){
        var url = location.href;
        var tempUrl = "";
        var tempAddress = Object.keys(dataCubeAddress);

        //如果为star时并向下划，如果本人则welcome页，非本人则index2
        if( action === "downUrl" && location.href.indexOf("dataCube_star")> -1 ){
            var selfCid = dataCube.getUrlCid();
            if(selfCid.isSelf) g_sps.jump(null,"dataCube_welcome.html?cid="+selfCid.cid);
            else g_sps.jump(null,"dataCube_index2.html?cid="+selfCid.cid);
        }

        for(var i = 0,len = tempAddress.length; i<len; i++ ){
            if(url.indexOf(tempAddress[i])>-1){
                tempUrl = dataCubeAddress[tempAddress[i]][action];
                if(tempUrl !== undefined){
                  g_sps.jump(null,tempUrl);
                }
                break;
            }
        }
    }
});
