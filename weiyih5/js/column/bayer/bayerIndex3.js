/**
 * 功能描述： 拜耳例之声的首页 第三期
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2016/06/02.
 */

$(function(){
    var controller={
        config:{
            bayerReviveListUrl:"/mcall/activity/resource/property/cmsActivityResourcePropertyAction!getReviveMapList"//复活排行榜
        },
        init:function(){
            var activityId=1460028659268/*1460028659268  1459416619774*/;
            var t=this,items,html,liHtml;
            var data={};
            data.activityId=activityId;
            $.ajax({
                type: "POST",
                url: t.config.bayerReviveListUrl,
                data:data,
                dataType: "json",
                success: function (data) {
                    if(data&&data.responseObject){
                        items=data.responseObject;
                        html="";
                        $.each(items,function(i,e){
                            if(i>1){
                                liHtml='<li class="reviveRankItem">';
                            }else{
                                liHtml='<li class="reviveRankItem reviveRankTop">';
                            }
                            html+=liHtml+
                                    '<i class="rankNum">'+(i+1)+'</i>'+
                                    '<h3>'+(e.customerName?cutstr(e.customerName,10):"")+'</h3>'+
                                    '<span class="area">'+(e.propertyName?e.propertyName:"")+'</span>'+
                                    '<i class="hr">&nbsp</i>'+
                                    '<span class="clickZan">点赞数</span>'+
                                    '<span class="zanNum">'+ e.preferUpNum+'</span>'+
                                '</li>';
                        });
                        $(".Ev-ul-BayerAppendReviveList").html(html);
                    }
                },
                error: function () {
                }
            });


        }


    };
    controller.init();


});