/**
 * Created by ALLIN on 2016/9/8.
 */
/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/11/19.
 */
$(function(){
    //获取活动的activityId；
    var str= location.href;
    var activityId=comm.getpara().activityId;
    $("#activityId").val(activityId);

    //结果是否在公示中，上传是否截止
    $.ajax({
        type:'post',
        url:PC_CALL+'activity/event/isResultShowBegin/',
        data:{paramJson:$.toJSON({ activityId:activityId})},
        dataType:"json",
        async:false,
        success:function(res){
            if(res&&res.responseObject.responseData&&(!$.isEmptyObject(res.responseObject.responseData))){
                var isResultShowBegin=res.responseObject.responseData.expireStatus;
                //if(isResultShowBegin==1){//如果在公示中，默认上传截止
                //    $('#activityId').attr('isResultShowBegin',isResultShowBegin);	//0:未知错误 1:结果公示中 -1:过期
                //    $(".nav_apply a").text("结果公布").attr('href','/v2/pages/column/videoPK/pk4_results.html').css('color','#fff').parent().off('click');		//更改公布链接
                //}
            }
            if(!$('#activityId').attr('isResultShowBegin')){		//如果不是结果公示过程，则查看上传是否截止
                //上传是否截止
                $.ajax({
                    type:'post',
                    url:PC_CALL+'activity/event/isSignUpOver/',
                    data:{paramJson:$.toJSON({ activityId:activityId})},
                    dataType:"json",
                    async:false,
                    success:function(rep){
                        if(rep&&rep.responseObject.responseData&&(!$.isEmptyObject(rep.responseObject.responseData))){
                            var isSignState=rep.responseObject.responseData.expireStatus;
                            $('#activityId').attr('isSignUpOver',isSignState);	////0:未知错误 1:未截止 -1:截止
                        }
                    }
                });
                //评分是否开始
                $.ajax({
                    type:'post',
                    url:PC_CALL+"activity/event/isReviewBegin/",
                    data:{paramJson:$.toJSON({ activityId:activityId})},
                    dataType:"json",
                    async:false,
                    success:function(data){
                        if (data && data.responseObject.responseData) {
                            var isReviewBegin = data.responseObject.responseData.expireStatus;
                            $('#activityId').attr('isReviewBegin',isReviewBegin);//1是已经开始了,-1没开始
                        }
                    }
                })
                $('.nav_apply a').css('color','#fff');
            }

        }
    })

    var isReviewed;		//是否是专家
    if($("#activityId").attr("expert")){
        isReviewed = $("#activityId").attr("expert");
    }else{
        isReviewed=isReviewerPK3();
        $("#activityId").attr("expert",isReviewed);
    }
    //如果在结果公示阶段，立即上传变为结果公示
    if(isReviewed==1){	//如果是专家
        $(".wait_review_work").text("待评作品");
    }

    if(!$("#sesCustomerId").val()){//未登录

        if(!$('#activityId').attr('isResultShowBegin')){//结果非公示中
            //评分开始不可以上传，报名截止还可以继续上传
            //if($('#activityId').attr('isReviewBegin')==1||$('#activityId').attr('isSignUpOver')==-1){
                $(".nav_apply a").text("结果公示");
            /*}else{
                $(".nav_apply a").text("立即报名");
                if($("#activityId").attr("expert")!=1) {
                    module.videoCasePk2({
                        enrollBtn: $(".nav_apply"),
                        top: parseInt(($('body').height()) / 2 - ($('.doc_tc').height() / 2)),
                        left: ($(window).width() - 713) / 2,
                        activityId: activityId,
                        needGoDetail: 1,//需要跳终端
                        enrollCallBack: function () {//报名成功后回调
                            $(".nav_apply a").text("立即上传");
                        },
                        publishBack: function () {
                            if (str.lastIndexOf("personal_center")) {
                                window.location.href = str;
                            }
                        },
                        videoPKList: function () {
                        }
                    });
                }
            }*/
            //活动无效，报名通道隐藏
            //if($('#activityId').attr('isSignUpOver')==0){
            //    $(".nav_apply").remove();
            //}
        }
    }else{
        var isEnroll;
        if($('#activityId').attr('isResultShowBegin')){//结果公示中 只获取报过名与否
            setRegisterStatus();
        }else{
            if($('#activityId').attr('isSignUpOver')==-1){	//登录后-如果截止//0:未知错误 1:未截止 -1:截止
                $(".nav_apply a").text("结果公示");
                setRegisterStatus();
            }else{
                isEnroll=setRegisterStatus();
                if(isEnroll==0){
                    $(".nav_apply a").text("立即报名");
                }else{
                    $(".nav_apply a").text("立即上传");
                }
                if($("#activityId").attr("expert")!=1){
                    module.videoCasePk2({
                        enrollBtn:$(".nav_apply"),
                        top:parseInt(($('body').height())/2-($('.doc_tc').height()/2)),
                        left:($(window).width()-713)/2,
                        activityId:activityId,
                        isEnroll:isEnroll,
                        needGoDetail:1,//需要跳终端
                        enrollCallBack:function(){//报名成功后回调
                            $(".nav_apply a").text("立即上传");
                        },
                        publishBack:function(){
                            if(str.lastIndexOf("personal_center")){
                                g_sps.jump(null,str);
                            }
                        },
                        videoPKList:function(){

                        }
                    });
                }
            }
            //活动无效，报名通道隐藏
            //if($('#activityId').attr('isSignUpOver')==0){
            //    $(".nav_apply").remove();
            //}
        }
    }

    //nav_apply点击事件
    $(".nav_apply").on("click",function(){
        //if($("#sesCustomerId").val()){
            //if($(this).find("a").text()==="正在评选"){
                //window.location.href = "/html/activity/"+$('#activityId').val()+"/personal_center.html?activityId="+$('#activityId').val();
            //}else if($(this).text()==="初选结果"){
                var url= "/pages/column/videoPK_v2/semifinals_result.html?activityId="+$('#activityId').val();
                //TODO sps跳转
                g_sps.jump($(this),url);
            //}else{

            //}
        /*}else{
            user.login({
                callback:function(){
                    window.location.href=location.href;
                },
                scene:privilegeSceneConst.eSceneTypeFellow
            });
        }*/
    });
    scoreAlert();
})
//获取用户报名状态
function setRegisterStatus(){
    var isEnroll="";
    $.ajax({
        type : "post",
        url : PC_CALL+"activity/register/getRegisterStatus/",//获取报名状态
        data : {paramJson: $.toJSON({customerId:$("#sesCustomerId").val(),activityId:$('#activityId').val()})},
        dataType : "json",
        async:false,
        success : function(rep){
            if(rep.responseObject.responseData){
                if(rep.responseObject.responseData.registerStatus==1){//没有报名
                    $('#activityId').attr('registerStatus',1)
                    isEnroll=0;
                }else if(rep.responseObject.responseData.registerStatus>=2){//报过名
                    $('#activityId').attr('registerStatus',2)
                    isEnroll=1;
                }
            }
        }
    });
    return isEnroll;
}
//判断用户是否是专家
function isReviewerPK3(){
    comm.LightBox.showloading();
    var isReviewer;
    $.ajax({
        url:PC_CALL+"activity/api/isReviewer/",
        type:"POST",
        data:{paramJson: $.toJSON({customerId:$("#sesCustomerId").val(),activityId:$('#activityId').val()})},
        dataType:"json",
        async:false,
        success:function(data){
            comm.LightBox.hideloading();
            if(data&&data.responseObject.responseData){
                isReviewer=data.responseObject.responseData.isReviewer;
            }
        }
    });
    return isReviewer;
}
//评委打分提醒
function scoreAlert(){
    if($("#sesCustomerId").val()&&$("#activityId").attr("expert")==1&&$("#activityId").attr("isReviewBegin")==1){
        if($.cookie("isClose") != 'yes'){
            $.ajax({
                url:PC_CALL+"activity/api/getCustomerReviewResourceCount/",
                type:"POST",
                data:{paramJson: $.toJSON({
                    customerId:$("#sesCustomerId").val(),
                    activityId:$("#activityId").val(),
                    firstResult:0,
                    maxResult:100,
                    refType: 1,
                    resourceStatus:1
                })},
                dataType:"json",
                async:false,
                success:function(data){
                    if(data&&data.responseObject&&data.responseObject.resourceCount>0){
                        var items = data.responseObject.resourceCount;
                        $(".al-mainInner").append('<div class="score_reminder_mask"><section class="score_reminder"><h3>第二届骨科规范化手术视频征集评选</h3><p>亲爱的评委，您尚有'+items+'个作品待审核，请尽快完成</p><div class="btn_box"><button class="btn_cancel">稍后再说</button><button class="btn_ensure">前往打分</button></div></section></div>');
                        $(".score_reminder").css("top",$(document).scrollTop()+400)
                        $("body").css("overflow","hidden");
                        $(".btn_cancel").on("click",function(){
                            $(".score_reminder_mask").remove();
                            $("body").css("overflow","visible");
                        })
                        $(".btn_ensure").on("click",function(){
                            $(".score_reminder_mask").remove();
                            $("body").css("overflow","visible");
                            g_sps.jump(null,"/html/activity/"+$('#activityId').val()+"/personal_center.html?activityId="+$('#activityId').val());
                        })
                    }
                    //$.cookie("isClose",'yes',{ expires:1/8640});   //测试十秒
                    $.cookie("isClose",'yes',{ expires:1});      //一天
                }
            });
        }
    }
}
