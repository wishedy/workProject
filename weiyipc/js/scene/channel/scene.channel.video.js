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
        channelId: 78 //channelId:''//113-病例 78-视频 81-文库 114-话题  68-首页
    });

    //module.bannerCarousel();    // 幻灯片

    module.recommendForYou({     // 为你推荐
        container:"#recommendForYou"
    });

    module.channelChart({          //排行榜
        container:"#channelChart",
        useSortFlag:3
    });

    module.newestUpload({        // 最新上传 对元素进行分组显示距现在天数

    });

	
	module.videoUpload({
		videoBtn:$("#video_upload_btn"),//创建点击btn
		//top: top,//弹层top值
		//left: left,
		userImg:0,//是否有用户头像
		needAuth:1
    });
	
    $.getStaticNum({
        dataType:"video",
        className:"playNum",
        ids:$("#videoIdList105").val()
    });
    $.getStaticNum({
        dataType:"video",
        className:"playNum",
        ids:$("#videoIdList109").val()
    });

    $.getStaticNum({
        dataType:"video",
        className:"playNum",
        ids:$("#videoIdList110").val()
    });

    $(".v_list_text").textOverflow(60);       // 限制简介长度
});
$(document).ready(function(e) {
	var len = $(".video_tag01").length;
	for (var i = 0; i < len; i++) {
		var leftHeight = $(".video_tag01:eq(" + i + ")").children(".video_tag_left").height();
		var rightHeight =  $(".video_tag01:eq(" + i + ")").children(".video_tag_right").height();
		if (leftHeight < rightHeight) {
			$(".video_tag_left:eq(" + i + ")").css("height",rightHeight + "px");
		}
	}
});