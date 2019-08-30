
$(function(){
    var account = comm.getpara().account;
    $("#account").text(account);
    var resPk;
    var res;
    //var res = customer.execute("sendSms", {siteId:'2',typeId:2,account:account});
    $.ajax({
        url:M_CALL+'customer/unite/sendCode/',
        type:'get',
        dataType:'json',
        async:false,
        data:{paramJson:$.toJSON({typeId:3,siteId:2,account:account,isNew:1,codeLength:4,customerId:comm.getpara().cid})},
        success:function(data){
            if(data&&data.responseObject.responseData){
                res = data.responseObject;

            }
            resPk = data.responseObject.responsePk;
        }

    });
    if(res.responseData&&!$.isEmptyObject(res.responseData)){
        countdownGetMsg();
        $('.codeSendLeftTime').html(res.responseData.codeNum);
    }else{
        $('.codeSendLeftTime').html(0);
        $(".alSended").html('重新发送').removeClass("active");
        popupFn(res.responseMessage,3000,function(){
            //window.history.back(-1);
        })
    }
    //返回事件埋点
    $('#back').click(function(){
        comm.creatEvent({
            triggerType:'全站功能按钮点击',
            keyword:'快捷登录验证手机返回',
            actionId:41,
            async:false
        });
    });

    var intval;
    $("#validCode").on('keyup propertyChange input',function(){
       if($(this).val().length==4){
           comm.loading.show();
           setTimeout(function(){
               comm.loading.show();
               phoneSubmit(resPk);

           },200);
           $(this).blur();
       }
    });
    $("#validCode").on("focus",function(){
        if($("#validCode").val().length==4) {
            $(this).val("");
            var o = this;

            setTimeout(function () {
                $(o).trigger("focus");
            }, 200);
        }
    });

    function sendSms(){
        comm.loading.show();
        $.ajax({
            url:M_CALL+'customer/unite/sendCode/',
            type:'get',
            dataType:'json',
            async:false,
            data:{paramJson:$.toJSON({typeId:3,siteId:2,account:account,isNew:1,codeLength:4,customerId:comm.getpara().cid})},
            success:function(data){
                comm.loading.hide();
                resPk = data.responseObject.responsePk;
                if(data&&data.responseObject.responseData){
                    var repObj = data.responseObject.responseData;
                    if(!$.isEmptyObject(repObj)){
                        $('.codeSendLeftTime').html(res.responseData.codeNum);
                    }else{
                        $('.codeSendLeftTime').html(0);
                        $(".alSended").html('重新发送').removeClass("active");
                        popupFn(repObj.responseMessage?repObj.responseMessage:'您获取验证码过于频繁，<br/>请于24小时后再试。',3000,function(){
                            //window.history.back(-1);
                        });
                    }
                }
            }
        });
    }

    function getmsgHandle() {
        if(sendSms()){
            $(".alSended").off("click");
            $("alSended").removeClass("active");
            countdownGetMsg();
        }
    }

    function countdownGetMsg(){

        var t = 60;
        $('.alSended').html("已发送&nbsp;&nbsp;"+t + "s&nbsp;&nbsp;秒后重新发送").removeClass('active');
        var a = setInterval(function(){
            if(t>0){
                $('.alSended').html("已发送&nbsp;&nbsp;"+t-- + "s&nbsp;&nbsp;秒后重新发送").removeClass('active');
            }else{
                clearInterval(a);
                $(".alSended").html('重新发送').addClass("active");
                $(".alSended").on("click",getmsgHandle);
            }
        },1000)
    }

    function phoneSubmit(id){
    	var validCode=$("#validCode").val();
    	if(validCode && validCode!=""){
    		//var rep=customer.execute("validSms",{"validCode":validCode,type:"customer_verification"});
            $.ajax({
                url:M_CALL+'customer/unite/updateCode/',
                dataType:'json',
                type:'post',
                async:false,
                data:{paramJson:$.toJSON({typeId:3,validCode:validCode,account:account,id:id,operateType:7})},
                success:function(data){
                    comm.loading.hide();
                    if(data&&data.responseObject.responseStatus){
                        loginSubmit(data)
                    }else{//验证码错误
                        popupFn('验证码错误，请重新输入',3000,function(){
                            $("#validCode").val("");
                        })
                    }
                }
            });
    	}
    }
    function loginSubmit(data){
        var result = data.responseObject;
        if(!result.responseStatus){         // 登录失败
            comm.topShowPageError(result.responseMessage);
        }else{
            //绑定微信操作
            if(comm.isWeiXin()){
                //alert("loginBindWX Flag "+location.search.indexOf("flag"));
                var wxBindUrl = "/mcall/wx/allin/interact/loginTempStorage/";   // 临时关联关系存储
                $.ajax({url: wxBindUrl, type: "POST", data:{} }).done(function(rs){ localStorage.removeItem("flagWXRegist"); });
            }else{
                //绑定微信
                comm.bindWeixin();
            }

            // 此次登录是否需要认证
            var needAuth = TempCache.getItem("needAuth");
            var needConferenceAuth = TempCache.getItem("needConferenceAuth");
            var auth = user.getRenZhengInfo();
            if(needConferenceAuth!=undefined && needConferenceAuth=="true"){
                TempCache.removeItem("needConferenceAuth");
                user.needConferenceAuthHandler();
            }else{
                if(needAuth!=undefined && needAuth!=null){
                    TempCache.removeItem("needAuth");
                }

                if(needAuth!=undefined && needAuth=="true"){
                    if(auth==null || $.isEmptyObject(auth)) {
                        comm.redirect("/pages/passport/auth/information.html");
                    }else{
                        user.getSessionInfo();
                        user.success("登录成功，即将返回来源页");       //  登录成功
                    }
                }else{
                    user.getSessionInfo();
                    user.success("登录成功，即将返回来源页");       //  登录成功
                }
            }


        }
    }
    //window.onload = Log.createBrowse(77, '手机验证-验证码输入');
});
