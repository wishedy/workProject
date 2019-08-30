/**
 * 功能描述：  设置页面的意见反馈
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2016/8/24.
 */
$(function(){
    FastClick.attach(document.body);
    var controller={
        config:{},
        path:{
            suggest:"/mcall/customer/suggestion/create/"
        },
        init:function(){
            var t=this;
            $(".Ev-SetBackBtn").off("click").on("click",function(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
                if(document.referrer!=""){
                    $(this).attr("href","javascript:"+history.back(-1)+";");
                }else{
                    $(this).attr("href","/");
                }
            });
            var setSug=$("#Ev-settingSuggest"),
                submitBtn=$(".Ev-setSubmitBtn");
            comm.textChange({'$tex':setSug,'$num':$("#Ev-settingSugNum"),'noTop':1,maxTop:0});
            setSug.keyup(function(){
                if(setSug.val()!=""&& $.trim(setSug.val())&&comm.getByteLen($.trim(setSug.val()))>=10){
                    submitBtn.removeClass("al-msgWriting");
                }else{
                    submitBtn.addClass("al-msgWriting");
                }
            });
            t.submitBtnAjax();
        },
        submitBtnAjax:function(){
            var t=this;
            var cid=TempCache.getItem("userId");
            var textareaVal=$("#Ev-settingSuggest").val();
            //提交
            $(".Ev-setSubmitBtn").off("click").on("click",function(){
                if ($(this).attr("data-flag") == 1) {
                    $(this).attr("data-flag", "0");
                    if(!$(this).hasClass("al-msgWriting")) {
                        var param = {};
                        param.customerId = cid;
                        param.suggestion = $("#Ev-settingSuggest").val();
                        param.customerName = TempCache.getItem("trueName");
                        param.suggestionType = (comm.getpara().from=="search"?3:1);
                        param.visitSiteId = 2;//1.PC 2.h5
                        //H5系列课详情页面反馈新添加字段suggestionType=8此标记不影响公共方法
                        var reg = /discover_series_details/;
                        var courseid = document.referrer.match(/tId=.{13}/)&&document.referrer.match(/tId=.{13}/)[0].substr(4);
                        if(reg.test(document.referrer)){
                            param.suggestionType = 8;
                            param.sourceId = courseid;
                        }
                        //end
                        $.ajax({
                            url: t.path.suggest,
                            data: {paramJson: $.toJSON(param)},
                            type: "POST",
                            dataType: "json",
                            success: function (data) {
                                if (data && data.responseObject && data.responseObject.responseStatus) {
                                    popup("感谢您的反馈，我们会尽快处理！");
                                    $("#Ev-settingSuggest").val("");
                                    setTimeout(function () {
                                        if (document.referrer != "") {
                                            history.back(-1);
                                        } else {
                                            window.location = "/"
                                        }
                                        $(".Ev-setSubmitBtn").attr("data-flag", "1");
                                    }, 3000)
                                } else {
                                    popup("提交失败，请稍后重试！");
                                    setTimeout(function () {
                                        $(".Ev-setSubmitBtn").attr("data-flag", "1");
                                    }, 3000)
                                }
                            }
                        });
                    }
                }
            });
        }
    };
    controller.init();
});