/**
 * 功能描述：  病例频道页
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
        channelId: 113 //channelId:''//113-病例 78-视频 81-文库 114-话题  68-首页
    });

    //module.bannerCarousel();    // 幻灯片


    module.channelChart({          //排行榜
        container:"#channelChart",
        useSortFlag:1       //  排行榜病例--1，文库--2，视频---3
    });


    module.newestUpload({        // 最新发布 对元素进行分组显示距现在天数

    });

    var tTop = $(document).scrollTop();
	var top = tTop +(tTop!=0?50:80);
    var left = ($(window).width() - 713) / 2;
	module.caseUpload({
		caseBtn: $("#case_upload_btn"),//创建点击btn
		top: top,//弹层top值
		left: left,
		userImg:0,//是否有用户头像
		needAuth:1
     });
    

    $.getStaticNum({
        dataType:"case",
        className:"browseNum",
        ids:$("#caseIdList230").val()
    });
    $.getStaticNum({
        dataType:"case",
        className:"browseNum",
        ids:$("#caseIdList231").val()
    });
    $.getStaticNum({
        dataType:"case",
        className:"browseNum",
        ids:$("#caseIdList235").val()
    });

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
