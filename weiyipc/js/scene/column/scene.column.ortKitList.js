/**
 * 功能描述：  小灶列表
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/10/15.
 */
$(function(){
    var b=1;
    var timer=null;
    var top=$(".zao_list_nav_cont").offset().top;
    var height=$(window).height();
    $(window).bind("scroll",function(){
        if(b==2){
            clearInterval(timer);
        }
        b=2;
        var scrollTop=$(document).scrollTop();
        if(top>scrollTop){
            newTop=0;
        }else{
            newTop=scrollTop-top;
        }
        if(scrollTop>height){
            $(".list_nav_top").show();
        }else{
            $(".list_nav_top").hide();
        }
        $(".zao_list_nav_cont").css("top",newTop);
    });

    $(".list_nav_top").on("click",function(){
        MoveTop(0);
    });

    function MoveTop(target){
        clearInterval(timer);
        var iSpeed=iCur=0;
        timer=setInterval(function(){
            iCur=document.documentElement.scrollTop||document.body.scrollTop;
            iSpeed=(target-iCur)/8;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            if(iCur==target){
                clearInterval(timer);
            }else{
                document.documentElement.scrollTop=document.body.scrollTop=iCur+iSpeed;
            }

            b=1;
        },30);
    };
})
