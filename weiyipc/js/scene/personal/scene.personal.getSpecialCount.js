/**
 * 功能描述：  获取粉丝，赞的徽标提示
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/10.
 */
function getSpecialCount(){
    /*var data={};
    //data.readTrendTime = $.cookie("readTrendTime")?$.cookie("readTrendTime"):comm.date.local_time();
    data.readFansTime = $.cookie("readFansTime")?$.cookie("readFansTime"):comm.date.local_time();
    data.readPreferTime = $.cookie("readPreferTime")?$.cookie("readPreferTime"):comm.date.local_time();
    var param={};
    param.paramJson= $.toJSON(data);
    var json={};
    $.ajax({
        type : "post",
        url : PC_CALL + "customer/message/getSpecialCount/",
        data : param,
        async : false,
        dataType : "json",
        success : function(rep){
            if(rep&&rep.responseObject.responseData){
                if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                    var list=rep.responseObject.responseData.data_list[0];*/
                    if(json.fansNum>0){//有新的粉丝加徽标
                        $(".al-personalFollowNum").eq(0).append('<i class="al-newNumTips"></i>');
                    }else{
                        $(".al-personalFollowNum").eq(0).find("i").remove();
                    }
                    if(json.preferNum>0){//有新的关注人加徽标
                        $(".al-personalFollowNum").eq(2).append('<i class="al-newNumTips"></i>');
                    }else{
                        $(".al-personalFollowNum").eq(2).find("i").remove();
                    }

                /*}
            }
        },
        error:function(){}
    });
    return json*/
}
$(function(){
    getSpecialCount();
});
