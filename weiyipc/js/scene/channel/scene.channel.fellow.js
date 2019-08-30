/**
 * 功能描述：  fellow详情页的公共方法
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/4/22.
 */
$(function(){
    var len = $(".f_nav_ul li").length;
    $(".f_nav_ul li").width(100 / len + "%");
    var str= location.href;
    $(".f_nav_ul li").each(function(i,em){
        if($(em).find("a").attr("href")==str){
            $(em).addClass("f_b_on");
        }
    })
});
