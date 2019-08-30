//向下滚动页面置顶
$(document).ready(function(){
    $(".naver_lists li").eq(0).after("<li><a href='/pages/column/videoPK_v2/primary_result.html?activityId=1472178139520'>预赛结果</a></li>");
    if(location.href.lastIndexOf("primary_result")>-1){
        $(".naver_lists li").eq(1).addClass("nav_homgpage");
    }
    function navScroll(){
        var navTop = $('#naver').offset().top;
        $(window).scroll(function(){
            var scrollTop = $(document).scrollTop();
            if(scrollTop>=navTop){
                $('#naver').css({
                    "position":"fixed",
                    "left":"0",
                    "top":"0",
                    "background":'#fff'
                })
            }else{
                $('#naver').css("position","static")
            }
        }) 
    }
    navScroll();
    //悬浮导航点击事件
    function navClick(){
        var dit = $('#dirctory dl dd');
        dit.click(function(){
            $(this).children().css({
                "background":"#4a5c88",
                "color":"#fff"
            }).end().siblings('dd').children().css({
                "background":"#f9f9fd",
                "color":"#333"
            })
        })
    }
    navClick();
    $(".aside_title dd").on("click",function(){
        $(".aside_title dd a").removeClass("active");
        $(this).find("a").addClass("active");
    });
    //专家评委tab切换
    function vd_pingweiTab(){
        $('#v2_ev_tabBtn li').click(function(){
            var index = $(this).index();
            $(this).children().addClass('on').end().siblings().children().removeClass('on');
            $('.ev_tadCont').eq(index).show().siblings('.ev_tadCont').hide();
        })
    }
    vd_pingweiTab();
    //专业术士点击事件
    function gd_btnClick(){
        $('.gd_btn').toggle(
            function(){
                $(this).css('background','url(//img00.allinmd.cn/column/videoPK_v2/jt_more_s.png) no-repeat right center').html('收起全部');
                $('.term').css('height','2660px')
            },
            function(){
                $(this).css('background','url(//img00.allinmd.cn/column/videoPK_v2/jt_more.png) no-repeat right center').html('展示更多');
                $('.term').css('height','550px')
            })
    }
    gd_btnClick();
    //悬浮导航滚动
    $(window).scroll(function(){
        $(".ev-suspend dd").children().removeClass("active");
        for(var i=0;i<$(".ev-boneTitle").length;i++){
            var boneTitleTop = $(".ev-boneTitle").eq(i).offset().top-120,scrollTop = $(document).scrollTop();
            if(scrollTop >= boneTitleTop){
                $(".ev-suspend dd a").removeClass("active");
                $(".ev-suspend dd a").eq(i).addClass("active");
            }
            if(scrollTop==$(document).height()-$(window).height()){
                $(".ev-suspend dd a").removeClass("active");
                $(".ev-suspend dd a").eq($(".ev-suspend dd").length-1).addClass("active");
            }
        }
    });
    $(".ev-suspend dd").on("click",function(){
        var i=$(this).index();
        if($(".ev-suspend dt").length>0){
            i=i-1;
        }
        var top=$(".ev-boneTitle").eq(i).offset().top;

        document.documentElement.scrollTop = document.body.scrollTop = top-100;
    });
})




