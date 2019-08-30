
$(function(){
    var account = comm.getpara().account;
    $("#account").text(account);
    var res = customer.execute("sendSms", {siteId:'2',typeId:2,account:account,codeLength:4});
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
            keyword:'验证手机返回',
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
               phoneSubmit();

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
        var repObj= customer.execute("sendSms", {siteId:'2',typeId:2,account:account,codeLength:4});
        comm.loading.hide();
        if(res.responseData&&!$.isEmptyObject(res.responseData)){
            $('.codeSendLeftTime').html(res.responseData.codeNum);
        }else{
            $('.codeSendLeftTime').html(0);
            $(".alSended").html('重新发送').removeClass("active");
            popupFn(repObj.responseMessage?repObj.responseMessage:'您获取验证码过于频繁，<br/>请于24小时后再试。',3000,function(){
                //window.history.back(-1);
            })
        }
        if(!repObj.responseStatus && repObj.responseMessage && repObj.responseMessage!=""){
            $(".l_warning").html('<label for="account" generated="true" class="error">'+repObj.responseMessage+'</label>');
            return false;
        }
        return true;
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

    function phoneSubmit(){
    	var validCode=$("#validCode").val();
    	if(validCode && validCode!=""){
    		var rep=customer.execute("validSms",{"validCode":validCode,type:"customer_verification"});
            comm.loading.hide();
            if(rep.responseStatus){
            	var id=rep.responseMessage;
                registSubmit(id,validCode);
            }else{//验证码错误
                popupFn('验证码错误，请重新输入',3000,function(){
                    $("#validCode").val("");
                })
            }
    	}
    }
    function registSubmit(id,validCode){
        var param={account:account,type:'mobile',passwd:comm.getpara().psw,verificationId:id,validCode:validCode};
        var token = comm.getToken();
        var result =CommService.execute("/mcall/web/user/userRegist/?struts.token="+token,param);
        comm.loading.hide();
        if(result && result.responseStatus){
            var customerId=result.responsePk;
            user.getSessionInfo();
            //generatePersonPage(customerId);

            if(comm.isWeiXin() ){
                var wxBindUrl = "/mcall/wx/allin/interact/registTempStorage/";
                $.ajax({url: wxBindUrl, type: "POST", data:{} }).done(function(rs){ localStorage.removeItem("flagWXRegist"); });
            }
            TempCache.setItem('firstRegist',1);
            var fromPage = TempCache.getItem('fromPage');
            TempCache.setItem('fromPageN',fromPage);
            if(fromPage!=undefined&&fromPage!=null){ //如果有来源页
                if(TempCache.getItem('needAuthRegist')){   //需要认证权限
                    var _t = "/pages/passport/auth/information.html?isFollow=1";
                    setTimeout(function(){
                      g_sps.jump(null,t);
                    },3000)
                }else{  //跳转到标签选择页面（选择感兴趣的标签）
                  g_sps.jump(null,'/pages/passport/auth/regist_tag.html');
                }

            }else{
                if(TempCache.getItem('needAuthRegist')){   //需要认证权限 跳认证页，否则跳首页
                    var _t = "/pages/passport/auth/information.html?isFollow=1";
                    setTimeout(function(){
                      g_sps.jump(null,_t);
                    },3000)
                }else{          //跳转到感兴趣的标签页
                  g_sps.jump(null,'/pages/passport/auth/regist_tag.html');
                }

            }
            //comm.bindWeixin();
            user.registSuccess();
        }else{
            if(result && result.responseMessage){
                popupFn(result.responseMessage,3000,function(){
                    $("#validCode").val("");
                });
            }else{
                popupFn('验证码错误，请重新输入',3000,function(){
                    $("#validCode").val("");
                });
            }
        }
    }

});
