/**
 * 功能描述：获取用户头像  
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiuYuTao on 2015/4/21.
 */


//获取头像
comm.getLogoUrlList = function(logoType,logoSpec,customerId){
    var t=this;
    var params={};
    var data={};
    var urlData={};
    if(logoType && logoType!=="")data.logoType=logoType;
    if(logoSpec && logoSpec!=="")data.logoSpec=logoSpec;
    if(customerId && customerId!==""){
        data.logoUseFlag = AttUseFlag.c;
        data.refId=customerId;
        params.paramJson= $.toJSON(data);
        $.ajax({
            type:'POST',
            url: PC_CALL+"commdata/getLogoUrlList/",
            data:params,
            cache: false,
            async: false,
            dataType:'json',
            success: function(rep){
                if(rep && rep.responseObject){
                    urlData=rep.responseObject;
                }
            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    }
    return urlData;
};