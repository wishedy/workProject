/**
 * 功能描述：  获取资料百分比
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/8.
 */
function customerInforate(){
    $.ajax({
        type : "post",
        url : PC_CALL + "comm/data/inforate/queryCustomerInforate/",
        data : {paramJson: $.toJSON({customerId:$("#sesCustomerId").val()})},
        dataType : "json",
        success : function(rep){
            if(rep&&rep.responseObject.responseData){
                if(rep.responseObject.responseData.rate>=0){
                    var rate=rep.responseObject.responseData.rate+"%";
                    $(".ev-inforate").css({width:rate});
                    $(".ev-inforateNum").text(rate);
                }
            }
        },
        error:function(){}
    });
}
