/**
 * 功能描述：  绑定手机
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/19.
 */
$(function(){
    var sendSms=M_CALL+"customer/verification/sendSms/";//发送验证码
    var updateMobileUrl=M_CALL+"customer/unite/updateMobile/";//修改手机
    var validateAccount=M_CALL+"customer/unite/validateCustomerAccount/";//验证帐号
    //输入框点击x
    $(".icon-searchCancel").on("click",function(){
        $("#mobile").val("");
        $(".icon-searchCancel").hide();
        return false;
    });
    $("#mobile").on("focus",function(){
        $(".icon-searchCancel").show();
    });
    //点击发送验证码
    $("#mobileSumit").on("click",function(){
        $("#bindMobile").submit();
    });
    //验证码失去焦点修改手机
    $("#validCode").on("blur",function(){
        $("#updateMobile").submit();
    });
    $("#validCode").on("focus",function(){
        $(this).val("");
    });
    $("#validCode").on("keyup",function(){
        if ($(this).val().length>=4) {
            $(this).val($(this).val().substring(0,4));
            $(this).blur();
        }
    });
    //返回埋点
    $('.ev_digHole').click(function(){
        comm.creatEvent({
            triggerType:'全站功能按钮点击',
            keyword:"返回",
            actionId:41,
            async:false
        });
    });
    //验证码页的返回
    $(".back").on("click",function(){
        setTimeout(function(){
            $(".ev-mobileInner").show();
            $(".ev-validCode").hide();
        },500);
    });

    $("#mobile").on("keyup",function(){
        if ($(this).val().length===11) {
            $(".btn-primary-lg").removeClass('al-msgWriting');
        }else{
            $(".btn-primary-lg").addClass('al-msgWriting');
        }
    });
    //手机校验
    $("#bindMobile").validate({
        submitHandler : function() {
            mobileBind.submit();

        },
        rules : {
            "mobile" : {
                "required" : true,
                "mobile":true,
                "rangelength":[11,11],
                "remote": {
                    "url":validateAccount,
                    "type":"POST",
                    "data":{ "account" : function() {comm.loading.show(); return $("#mobile").val();},"type" : "mobile"}
                }
            }
        },
        messages : {
            "mobile" : {
                "required" : "你还没填写手机号。",
                "mobile" : "不像是正确的手机号。",
                "rangelength":"手机号长度请保持在{1}位！",
                "remote":"手机号已经被使用过！"
            }
        },
        errorPlacement:function(error,element){
            comm.loading.hide();
            if(error[0].innerText){
                popup(error[0].innerText);
            }
        },
        success:function(element){

        },
        onkeyup:false,
        onfocusout:false
    });

    //验证码校验
    $("#updateMobile").validate({
        submitHandler : function() {
            updateMobile.submit();
        },
        rules : {
            "validCode" : {
                "required" : true,
                "validCode":true
            }
        },
        messages : {
            "validCode" : {
                "required" : "请输入验证码！",
                "validCode" : "验证码不正确！"
            }
        },
        errorPlacement:function(error,element){
            if(error[0].innerText){
                popup(error[0].innerText);
            }
        },
        success:function(element){

        },
        onkeyup:false,
        onfocusout:false
    });


    var mobileBind = {
        form: '',
        submit: function () {
            sendCode();
        }
    };
    //发送手机验证码
    function sendCode(){
        comm.loading.show();
        var mobile=$("#mobile").val();
        var param={};
        param.paramJson= $.toJSON({"siteId":2,typeId:2,"account":mobile,codeLength:4});
        $.ajax({
            type : "post",
            url : sendSms,
            data : param,
            dataType : "json",
            success : function(rep){
                if(rep && rep.responseObject.responseStatus){
                    $(".ev-mobileInner").hide();
                    $(".ev-validCode").show();
                    $("#validCode").val("");
                    $(".num").text(rep.responseObject.responseData.codeNum);
                    countdown();
                }else{
                    if( rep && rep.responseObject.responseMessage){
                        popup(rep.responseObject.responseMessage);
                    }else{
                        popup("发送失败！");
                    }
                }
                comm.loading.hide();
            },
            error:function(){}
        });
    }

    var updateMobile = {
        form: '',
        submit: function () {
            comm.loading.show();
            var mobile = $("#mobile").val();
            var validCode=$("#validCode").val();
            var param={};
            param.paramJson= $.toJSON({"mobile":mobile,siteId:2,validCode:validCode});
            $.ajax({
                type : "post",
                url : updateMobileUrl,
                data : param,
                dataType : "json",
                success : function(rep){
                    var res=rep.responseObject;
                    if(!res){popup("绑定失败!");}
                    if(res.responseStatus){
                        popup("绑定成功!");
                        history.back(-1);
                    }else{
                        if(res.responseMessage){
                            popup(res.responseMessage);
                        }else{
                            popup("绑定失败！");
                        }
                    }
                    comm.loading.hide();
                },
                error:function(){}
            });

            return false;
        }
    };

    //倒计时
    function countdown() {
        $("#countdown").show();
        var timer = null;
        var num = 60;
        timer = setInterval(function () {
            num--;
            if (num == 0) {
                clearInterval(timer);
                $(".ev-sended").hide();
                $(".ev-reSend").show();
            }
            $(".second").text(num+"s");
        }, 1000);

        function addZero(n) {
            if (n < 10) {
                return '0' + n;
            } else {
                return n;
            }
        };
    }

    //重新发送
    $(".ev-reSend").on("click",function(){
        if($(".num").text()!="0"){
            $(".ev-sended").show();
            $(".ev-reSend").hide();
            sendCode();
        }else{
            popup("一天只能发送三次");
        }

    });
});
