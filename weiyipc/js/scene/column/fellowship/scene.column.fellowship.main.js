/**
 * 功能描述：  fellowship公共js
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/12/28.
 */
$(function(){
    var $li=$(".fs_nass_nav_main ul").children("li");
    var width=(1000-$(".Ev-NowApplyBtn").width())/$li.length;
    var timer=null;
    $li.css({"width":width});
    $li.eq($li.length-1).on("mouseover",function(){
        $(".fs_old_review").show();
    }).on("mouseout",function(){
        $(".fs_old_review").hide();
    });
    var loca=location.href;
    var aHref,aHrefCut;
    $li.each(function(i,em){
        aHref  =$(em).find('a').attr('href');
        aHrefCut  =aHref.substr(aHref.indexOf("://"));
        if(loca.search(aHrefCut)>-1){
            $(em).find("a").addClass("cur");
            return false;
        }
    })
});
