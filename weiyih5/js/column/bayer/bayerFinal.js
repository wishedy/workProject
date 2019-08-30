/**
 * 功能描述： 拜耳例之声的总决赛页
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by QiangKailiang on 2016/04/26.
 */
$(function() {
    //总决赛结束阶段底部banner轮播
    if ($(".highLights")) {
        var finalBanner = new Swiper('.highLights', {
            autoplay: 3000,
            loop: true,
            pagination: '.swiper-pagination',
            autoplayDisableOnInteraction : false
        });
    }

});
