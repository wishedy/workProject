/**
 * 功能描述： 拜耳例之声的总决赛页
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by QiangKailiang on 2016/04/26.
 */
$(function(){
    //点击左上按钮返回上一页
   $(".Ev-BackBtn").on("click",function(){
       history.back();
   });
    //无内容时页脚居于底部
    if ($(".main").height()<=$(window).height()){
        $(".pageFooter").addClass('takeInBottom');
    }else{
        $(".pageFooter").removeClass('takeInBottom');
    }
    //头部banner轮播
    var headBanner = new Swiper('.headBanner', {
        autoplay: 3000,
        loop: true,
        pagination: '.swiper-pagination',
        autoplayDisableOnInteraction : false
});


   // Created by hejing on 2016/04/27.
    //赛区详情页精彩现场的标题
    $.each($(".Ev-BayerDetailsVideoListClick"),function(i,ele){
        $(ele).on("click",function(){
            var href=$(this).find("a").eq(0).attr("href");
            g_sps.jump(null,href);
        });
    });

});