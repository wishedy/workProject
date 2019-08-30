//对资源收藏关系进行初始化
var collectRelation = ajaxSend("/mcall/customer/collection/info/", {paramJson:$.toJSON({refId:$("#refId").val(),collectionType:$("#relationType").val(),dataFlag:2})});
if(collectRelation.responseObject.responseStatus){ //收过
    //浮动收藏状态
    if($("#float").length>0){
        $("#float").find("li:eq(2)>img").attr("src",img.collectBlueActive);
    }
    //固定位置收藏状态
    if($("#EQ_fiexdRelation").length>0){
        if($("#EQ_fiexdRelation").find("li:eq(1)").attr("identity") == "collect"){
            $("#EQ_fiexdRelation").find("li:eq(1) img").attr("src",img.collectBlueActive);
        }else if($("#EQ_fiexdRelation").find("li:eq(2)>img").attr("identity") == "collect"){
            $("#EQ_fiexdRelation").find("li:eq(2)>img").attr("src",img.collectBlueActive);
        }
    }
}else{ //未收过
    //浮动收藏状态
    if($("#float").length>0){
        $("#float").find("li:eq(2)>img").attr("src",img.collectBlueDefault);
    }
    //固定位置收藏状态
    if($("#EQ_fiexdRelation").length>0){
        $("#EQ_fiexdRelation").find("li:eq(2)>img").attr("src",img.collectDefault);
    }
}

function ajaxSend(url,params){
    var result = {};
    $.ajax({
        url : url,
        type : "post",
        async: false,
        data : params,
        success : function(data){
            result = data;
        }
    })
    return result;
}


