/**
 * 功能描述：   话题频道页
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
        channelId: 114 //channelId:''//113-病例 78-视频 81-文库 114-话题  68-首页
    });
    //module.bannerCarousel();    // 幻灯片

    module.recommendForYou({     // 为你推荐
        container:"#recommendForYou"
    });

    module.channelChart({          //排行榜
        container:"#channelChart",
        useSortFlag:4
    });

    module.newestUpload({        // 最新上传 对元素进行分组显示距现在天数

    });

    module.topicUpload({
        topicBtn:$("#topic_upload_btn"),
        container:$(".video_width").eq(0),
        top:-300,
        left:143.5,
        userImg:0
    });

    $.getStaticNum({
        dataType:"topic",
        className:"browseNum",
        ids:$("#topicIdList236").val()
    });
    $.getStaticNum({
        dataType:"topic",
        className:"browseNum",
        ids:$("#topicIdList237").val()
    });
    $.getStaticNum({
        dataType:"topic",
        className:"browseNum",
        ids:$("#topicIdList238").val()
    });
});
