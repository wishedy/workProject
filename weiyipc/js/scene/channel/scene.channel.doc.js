/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiuYuTao on 2015/3/19.
 */

$(function () {
    module.bannerChannel({
        containerImg: '.Ev-ul-AppendBannerImg',//图片容器
        containerNum: '.Ev-ul-AppendBannerImgTitle',//数字容器,首页不传
        channelId: 81 //channelId:''//113-病例 78-视频 81-文库 114-话题  68-首页
    });

    //module.bannerCarousel();    // 幻灯片

    module.channelChart({       // 排行榜
        container:"#channelChart",
        useSortFlag:2
    });

    module.docUpload({
        docBtn:$(".doc_sc_but"),
        container:$(".doc_content"),
        top:126,
        left:143.5,
        userImg:0
    });

    $(".doc_list_text a").each(function (index, el) {
        $(this).text(comm.getStrLen($.trim($(this).text()),34));
    })
});
