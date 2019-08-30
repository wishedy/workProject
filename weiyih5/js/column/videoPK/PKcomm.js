/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/2/15.
 */

var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {//移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
function getpara()//获取参数的函数
{
    var url=document.URL;
    var param={};
    var str,item;
    if(url.lastIndexOf("?")>0)
    {
        str=url.substring(url.lastIndexOf("?")+1,url.length);
        var arr=str.split("&");
        for(var i=0;i<arr.length;i++)
        {
            item =  arr[i].split("=");
            param[item[0]] = decodeURI(item[1]);
        }
        return param;
    }
}
$(function(){
    activityId=getpara().activityId;
    $("#activityId").val(activityId);
    $.ajax({
        type : "post",
        url : "/mcall/cms/activity/isResultShowBegin/",
        data : {paramJson:$.toJSON({"activityId":activityId})},
        dataType : "json",
        async:false,
        success : function(rep){
            if(rep&&rep.responseObject&&rep.responseObject.responseData){
                status=rep.responseObject.responseData.expireStatus;
                $("body").append("<input type='hidden' value='"+status+"' id='status'/>");
                if(status==1){//1:结果公示中 -1:过期
                    $(".casePK_nav li").eq(0).before('<li><a href="/pages/column/videoPK/casePK_results.html" data-ajax="false">结果公示</a></li>');
                }
                var str= location.href;
                var url = str.substr(str.lastIndexOf("/"));
                if(url.lastIndexOf("casePK_results")>0){
                    $(".casePK_nav li").eq(0).addClass("cur");
                }
            }
        },
        error:function(){}
    });
    var brow=browser.versions;
    if(brow.iPhone||brow.iPad){
        //$("#browser_title").removeClass("casePK_title_An").addClass("casePK_title_Ios");
    }
    if(brow.android){
        //$("#browser_title").removeClass("casePK_title_Ios").addClass("casePK_title_An");
    }
    var titleH=$("#browser_title").outerHeight();
    var navH=$(".casePK_nav").outerHeight();
    var headerTop = $(".casePK_nav").offset().top-titleH;
    $(window).on("scroll swipe vmousemove", function (ev) {
        // down
        var len = document.body.scrollTop - headerTop;
        if (len > 0) { // 向下滑动
            $('.casePK_nav').css({
                position:'fixed',
                top:titleH+"px",
                left:'0',
                background:"#fff",
                zIndex:"10"
            });
            $(".casePK_h5").css({marginTop:navH+"px"});
        } else {	// up       向上滑动
            $(".casePK_h5").css({marginTop:"0px"});
            $('.casePK_nav').css({
                position:'static'
            });
        }

    });
    var customerId=appjs.getAuthorCustomerId();//1448002588528;
    $.ajax({
        type : "post",
        url : "/mcall/activity/api/isReviewer/",
        data : {paramJson:$.toJSON({"customerId":customerId})},
        dataType : "json",
        async:false,
        success : function(rep){
            if(rep&&rep.responseObject&&rep.responseObject.responseData){
                var lia=$(".casePK_nav li").eq($(".casePK_nav li").length-1).find("a");
                if(rep.responseObject.responseData.isReviewer=="1"){//是专家
                    lia.remove();
                    //lia.text("作品审核");
                    //lia.attr("href","/pages/column/videoPK/casePK_review.html");
                }else{
                    lia.text("我的作品");
                    lia.attr("href","/pages/column/videoPK/casePK_myWorks.html?activityId=1449026372937");
                }
            }
        },
        error:function(){}
    });

})
