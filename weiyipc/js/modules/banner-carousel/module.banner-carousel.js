/**
 * 功能描述：幻灯片
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiuYuTao on 2015/3/18.
 */

module.bannerCarousel = function(Obj){
    var defaults = {
        container:"#bannerCarousel"
    };

    var options = $.extend(defaults,Obj);

    $(options.container).slide({
        mainCell:".bd ul",
        effect:"leftLoop",
        autoPlay:true,
        titCell:".hd li",
        titOnClassName:"hover"
    });
    if($(".tempWrap li").length==1){
        $(".banner_channel_left").remove();
        $(".banner_channel_right").remove();
    }
};



