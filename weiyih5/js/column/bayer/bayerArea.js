/**
 * 功能描述： 拜耳例之声二期的区域赛
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2016/04/27.
 */

$(function(){


    //拜耳区域赛各赛区的视频列表标题
    var videoTitleLen;
    $.each($(".Ev-a-BayerAreaVideoListTitle"),function(i,ele){
        videoTitleLen=$(ele).text();
        if(comm.getLength(videoTitleLen)>36){
            $(ele).text(comm.cutstr(videoTitleLen,34)+"…");
        }
    });

});