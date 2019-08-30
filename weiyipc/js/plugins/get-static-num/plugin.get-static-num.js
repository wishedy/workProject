/**
 * 功能描述：获取统计数量，铺到页面上。
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiuYuTao on 2015/3/19.
 */

$.getStaticNum = function (options) {
    var defaultOptions = {
        dataType:"",    /* video, case, topic, doc */
        numType:"",
        ids:"",
        className:"",
        objectName:""
    };


    var optionData = $.extend(defaultOptions,options);
    var urlList = {
        "topic":PC_CALL+"topic/baseinfo/json_list/",
        "video":PC_CALL+"customer/video/json_list/" ,
        "doc":PC_CALL+"customer/doc/json_list/" ,
        "case":PC_CALL+"case_baseinfo/json_list/"
    };
    var param = {}
    switch (optionData.dataType){
        case "video" :
            param.paramJson = $.toJSON({videoIdList:optionData.ids});
            break;
        case "doc" :
            param.paramJson = $.toJSON({docIdList:optionData.ids});
            break;
        case "topic" :
            param.paramJson = $.toJSON({topicIdList:optionData.ids});
            break;
        case "case" :
            param.paramJson = $.toJSON({caseIdList:optionData.ids});
            break;
    }
    var objectName = {
        "topic":"cms_topic",
        "video":"cms_video",
        "doc":"cms_doc",
        "case":"case_baseinfo"
    };
    var itemIdName = {
        "topic":"topicId",
        "video":"videoId",
        "doc":"docId",
        "case":"caseId"
    };
    var requestType = "POST";
    if(optionData.dataType=="topic"){       // 话题接参比较特殊
        requestType="GET";
        param = {topicIdList:optionData.ids}
    }

    $.ajax({
        url:urlList[optionData.dataType],
        type:requestType,
        data:param,
        success: function (data) {
            var rst = data.responseObject.responseData;
            var lis = $("li[itemId]");
            var obj;
            var li;
            var itemId;
            var objItem;
            rst = rst.data_list;

            if(rst){

                for (var i = 0; i < rst.length; i++) {      // 条目
                    obj = rst[i];
                    if(typeof obj[objectName[optionData.dataType]]!="undefined"){
                        var arr = optionData.className.split(",");
                        objItem =  obj[objectName[optionData.dataType]];
                        itemId = objItem[itemIdName[optionData.dataType]];

                        li = lis.filter("[itemId=" + itemId + "]");
                        if(arr.length){

                            for (var j = 0; j < arr.length; j++) {  // 样式
                                if(arr[j]==="author"){
                                    for(var prop in obj){
                                        if(prop.indexOf("customer_auth")>=0){
                                            li.find(".author").text(obj[prop].lastName+obj[prop].firstName);
                                        }
                                    }
                                }else{

                                    var num = objItem[arr[j]];
                                    /*if(num>999){
                                        num = Math.floor(num/1000)+"K+";
                                    }*/
                                    li.find("." + arr[j]).text(num);
                                }
                            }
                        }
                    }
                }
            }else{
                // TODO:无数据
            }
        }
    });
};
