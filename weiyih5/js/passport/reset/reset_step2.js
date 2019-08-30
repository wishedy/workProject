/*
* 获取找回密码验证码
* **/
$(function(){
    var account = comm.getpara().account;
    var cid;
    var flag;
    if(comm.getpara().flag){
        flag = comm.getpara().flag;
    }
    $("#account").text(account);
	var timestamp = new Date().getTime();
    var res = customer.execute("sendPasswordMobile",{resetSite:'2',siteId:'2',account:account,codeLength:4,timestamp:timestamp,ALLINACCESSTOKEN:allinaccesstoken(timestamp,account)});
    if(res.responseData&&!$.isEmptyObject(res.responseData)){
        cid = res.responseData.customerId;
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
        var repObj= customer.execute("sendPasswordMobile",{resetSite:'2',siteId:'2',account:account,codeLength:4});
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
    		var rep=customer.execute("validSms",{"validCode":validCode,type:"customer_reset_password"});
            comm.loading.hide();
            if(rep.responseStatus){
            	var id=rep.responseMessage;
              g_sps.jump(null,"/pages/passport/reset/reset_step3.html?itemId="+id+"&validCode="+validCode+"&cid="+cid+"&flag="+flag);


            }else{//验证码错误
                popupFn('验证码错误，请重新输入',3000,function(){
                    $("#validCode").val("");
                })
            }
    	}
    }
    //window.onload = Log.createBrowse(74, '找回密码-验证码输入');

});
