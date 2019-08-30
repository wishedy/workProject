/**
 * 功能描述：  骨医小灶首页推荐
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/10/14.
 */
$(function(){
    $.ajax({
        type : "get",
        url : PC_CALL+"cms/recommend/getRecomList/?ownerChannelId=118&ownerColumnId=283",
        dataType : "json",
        success : function(rep){
            if(rep.rows&&rep.rows.length>0){
                if(rep.rows[0].docList&&rep.rows[0].docList.length){
                    var html="";
                    $.each(rep.rows[0].docList,function(i,val){
                        if(i<4){
                            html+='<li>'+
                                '<div class="bone_tj_img"><a href="'+val.pageStoragePath+'" target="_blank"><img src="'+val.docLogoUrl+'" /></a></div>'+
                                '<div class="bone_tj_text font_yahei"><a href="'+val.pageStoragePath+'" target="_blank">'+comm.getStrLen(val.docName,48)+'</a></div>'+
                                '</li>';
                        }
                    });
                    html+='<div class="clear"></div>';
                    $("#bone_list_ul").html(html);
                }
            }
        },
        error:function(){}
    });
})
