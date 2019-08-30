/**
 * 功能描述： 拜耳例之声的公共模块、活动介绍、优秀病例页面
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2016/04/01.
 */


$(function(){
//公共部分
    var left=($(window).width()-713)/2;
    var oneI= location.href.indexOf("sound2.html") > 0 || location.href.indexOf("sound_introduce.html")>0 || location.href.indexOf("sound_disease.html") >0;
    if(oneI){
        ////上传病例
        module.caseUpload({
            caseBtn:$(".Ev-UploadCaseBtn"),//创建点击btn
            needAuth:1,//需要登录认证
            top:126,//弹层top值
            left:left
        });
    }
    //导航栏的分享
    module.videoPKShare({
        title:"Xa例之声总决赛 | 金秋羊城，看强“例”对决！",
        sina:"#厚积理应薄发，实力就该发声#到总决赛现场，零距离感受巅峰对决，为您喜欢的选手加油助威，见证“Xa例之声”的诞生！",
        qqFriend:"#厚积理应薄发，实力就该发声#到总决赛现场，零距离感受巅峰对决，为您喜欢的选手加油助威，见证“Xa例之声”的诞生！",
        qqZone:"#厚积理应薄发，实力就该发声#到总决赛现场，零距离感受巅峰对决，为您喜欢的选手加油助威，见证“Xa例之声”的诞生！",
        url:window.location.href,//分享出去的链接地址
        pic:"https://img00.allinmd.cn/column/bayer/share03.png"//分享的小图
    });


    //导航条的顶部固定
    var dv = $('.Ev-BayerNavFixedEvent').eq(0);
    dv.attr('oTop', dv.offset().top);
    $(window).scroll(function () {
        if($(window).scrollTop()>=parseInt(dv.attr("oTop"))){
            dv.css({ 'position': 'fixed', top: 0 ,width:"100%",background:"#fff",zIndex:3});
        }else{
            dv.css({ 'position': 'relative'});
        }
    });


//活动介绍页面

    //右侧导航条的滚动
    rightBtnChange();
    $(window).bind("scroll",function(){
        rightBtnChange();
    });
    //右侧导航根据滚动高度自动选中
    function rightBtnChange(){
        $(".Ev-a-HoverShow a").removeClass("susBg");
        $.each($(".Ev-TargetNav"),function(i,em){
            var scrollTop=$(document).scrollTop();
            if(scrollTop>$(".Ev-TargetNav").eq(i).offset().top-200){
                $(".Ev-a-HoverShow a").removeClass("susBg");
                $(".Ev-a-HoverShow a").eq(i).addClass("susBg");
            }
            if(scrollTop==$(document).height()-$(window).height()){
                $(".Ev-a-HoverShow a").removeClass("susBg");
                $(".Ev-a-HoverShow a").eq($(".Ev-a-HoverShow a").length-1).addClass("susBg");
            }
        })
    }

});






