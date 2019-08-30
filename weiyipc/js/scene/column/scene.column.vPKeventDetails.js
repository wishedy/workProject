/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/10/30.
 */
$(function(){
    module.videoPKShare({
        //pic:"//img10.allinmd.cn/common/header/logo.png"
    });

    $("#right_nav .right_nav_btn").on("click",function(){
        $("#right_nav .right_nav_btn").removeClass("active");
        $(this).addClass("active");
    });

    rightBtnChange();
    $(window).bind("scroll",function(){
        rightBtnChange();
    });

    $("#ev_tabBtn li").each(function(i,em){
        $(em).on("click",function(){
            $("#ev_tabBtn li div").removeClass("on");
            $(this).find("div").addClass("on");
            $(".ev_tadCont").hide();
            $(".ev_tadCont").eq(i).show();
        })
    });
    //右侧导航根据滚动高度自动选中
    function rightBtnChange(){
        $("#right_nav .right_nav_btn").removeClass("active");
        $.each($(".target_nav"),function(i,em){
            var scrollTop=$(document).scrollTop();
            if(scrollTop>$(".target_nav").eq(i).offset().top-10){
                $("#right_nav .right_nav_btn").removeClass("active");
                $(".right_nav_btn").eq(i).addClass("active");
            }
            if(scrollTop==$(document).height()-$(window).height()){
                $("#right_nav .right_nav_btn").removeClass("active");
                $(".right_nav_btn").eq($(".right_nav_btn").length-1).addClass("active");
            }
        })
    }
})
