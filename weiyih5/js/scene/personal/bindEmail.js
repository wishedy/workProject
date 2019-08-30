/**
 * 功能描述：  绑定邮箱
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/19.
 */
$(function(){
    var customerId = TempCache.getItem("userId");
    var sendPasswordEmail=M_CALL+"customer/reset/password/sendPasswordEmail3/";//发送验证码
    var validateAccount=M_CALL+"customer/unite/validateCustomerAccount/";//验证帐号
    var updateEmailUrl=M_CALL+"customer/unite/update_email/";//修改邮箱
    var email = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    //输入框点击x
    $(".icon-searchCancel").on("click",function(){
        $(this).prev().val("");
        $(".btn-primary-lg").addClass('al-msgWriting');
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
    $('#email').focus(function () {
        $(this).autoMail({
            emails: ['qq.com', '163.com', '126.com', 'sina.com', 'sohu.com', 'yahoo.cn', 'gmail.com', 'hotmail.com', 'live.cn']
        });
    });
    $("#email").on("keyup",function(){
        if ($(this).val()) {
            $(".btn-primary-lg").removeClass('al-msgWriting');
        }else{
            $(".btn-primary-lg").addClass('al-msgWriting');
        }
    });
    //点击绑定
    $("#emailSumit").on("click",function(){
        if($("#email").val()){
            if (!email.test($("#email").val())) {
                popup("请输入正确邮箱地址");
            } else {
                $("#bindEmail").submit();
            }
        }
    });
    //验证码失去焦点修改邮箱
    $("#validCode").on("blur",function(){
        $("#updateEmail").submit();
    });
    //验证码页的返回
    $(".back").on("click",function(){
        setTimeout(function(){
            $(".ev-emailInner").show();
            $(".ev-validCode").hide();
        },500);
    });
    //邮箱校验
    $("#bindEmail").validate({
        submitHandler : function() {
            emailBind.submit();
        },
        rules : {
            "email" : {
                "required" : true,
                "email":true,
                "remote": {
                    "url":validateAccount,
                    "type":"POST",
                    "data":{ "account" : function() {comm.loading.show(); return $("#email").val();},"type" : "email"}
                }
            }
        },
        messages : {
            "email" : {
                "required" : "你还没填写邮箱。",
                "email" : "不像是正确的邮箱。",
                "remote":"邮箱已经被使用过！"
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

    var emailBind = {
        form: '',
        submit: function () {
            sendCode();
        }
    };
    //发送邮箱验证码
    function sendCode(){
        comm.loading.show();
        var email=$("#email").val();
        var param={};
        param= {email:email,isCheckEmail:0 };
        $.ajax({
            type : "post",
            url : updateEmailUrl,
            data : param,
            dataType : "json",
            success : function(rep){
                if(rep && rep.responseObject.responseStatus){
                    /*$(".emailInner").hide();
                    $(".ev-validCode").show();
                    $("#validCode").val("");
                    countdown();*/
                    //发送邮件
                    CommService.asyncExecute(sendPasswordEmail,{customerId:customerId,resetSite:7,email:email,applySource:2},function(){});
                    comm.alertBox({
                        mTitle: "绑定成功!",
                        title:"验证链接已发至邮箱，验证后能帮助你快速找回密码",
                        ensure:"知道了",
                        ensureCallback:function(){
                            history.back(-1);
                        }
                    });
                }else{
                    if( rep && rep.responseObject.responseMessage){
                        popup(rep.responseObject.responseMessage);
                    }else{
                        popup("绑定失败！");
                    }
                }
                comm.loading.hide();
            },
            error:function(){}
        });
    }

    /*//验证码校验
     $("#updateEmail").validate({
     submitHandler : function() {
     updateEmail.submit();
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
     popup(error[0].innerText);
     },
     success:function(element){
     $(element).parent().parent().removeClass("error");
     },
     onkeyup:false,
     onfocusout:false
     });*/


    /*var updateEmail = {
        form: '',
        submit: function () {
            comm.loading.show();
            var email = $("#email").val();
            var validCode=$("#validCode").val();
            var param={};
            param.paramJson= $.toJSON({"email":email,siteId:2,validCode:validCode});
            $.ajax({
                type : "post",
                url : updateEmailUrl,
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
        }

    });*/
});
