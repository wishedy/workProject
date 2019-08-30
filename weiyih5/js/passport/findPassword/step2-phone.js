$(function(){
    //Log.createBrowse(75,"找回密码-验证码输入");
    var account = comm.getpara().account;
    var email = comm.getpara().email;
    accountMask = comm.phoneMask(account);
    var flag=comm.getpara().flag;
    $("#account").text("已验证手机："+accountMask);

    comm.bindReturnBtn("loginPage");
    comm.initInputFocusEvent();
    $("#getSMCode").on("vclick",getmsgHandle);


    function sendSms(){
		var timestamp = new Date().getTime();
        var repObj=customer.execute("sendPasswordMobile",{resetSite:'2',siteId:'2',account:account,timestamp:timestamp,ALLINACCESSTOKEN:allinaccesstoken(timestamp,account)});
        if(!repObj.responseStatus && repObj.responseMessage && repObj.responseMessage!=""){
            $(".l_warning").html('<label for="account" generated="true" class="error">'+repObj.responseMessage+'</label>');

            return false;
        }
        return true;
    }

    function getmsgHandle() {
        if(sendSms()){
            $("#getSMCode").off("vclick");
            $("#getSMCode").removeClass("active").addClass("disabled");
            countdownGetMsg();
        }else{
            $("#getSMCode").off("vclick");
            $("#getSMCode").removeClass("active").addClass("disabled").css('color','#ccc');
        }
    }

    function countdownGetMsg(){
        var t = 60;
        var a = setInterval(function(){
            if(t>0){
                $("#getSMCode").text(t-- + "s后重发").css("color","#808080");
            }else{
                clearInterval(a);
                $("#getSMCode").removeClass("disabled").addClass("active");
                $("#getSMCode").text("获取短信验证码").css("color","#333333");
                $("#getSMCode").on("vclick",getmsgHandle);
            }
        },1000)
    }


    $("#loginBtn").on("vclick",function(){
    	var code=$("#code").val();
        if($.trim(code)==""){
            $(".l_warning").html('<label for="account" generated="true" class="error">请输入验证码</label>');
            return false;
        }
        var rep=customer.execute("validSms",{"validCode":code,type:"customer_reset_password"});
        if(rep.responseStatus){

            var id= rep.responseMessage;
            g_sps.jump(null,"/mcall/customer/reset/password/mobile_input/?itemId="+id+"&validCode="+code+"&flag="+flag);
        }else{
        	var message= rep.responseMessage;
        	if(!message || message==""){
        		message="验证码错误！";
        	}
            $(".l_warning").html('<label for="account" generated="true" class="error">'+message+'</label>');

        }

    });


    if(email && email!=""){
    	$("#toEmailBtn").on("vclick",function(){
        g_sps.jump(null,"/pages/passport/findPassword/findPassword-step2-email.html?account="+email+"&mobile="+account);
        });
	}else{
		$("#toEmailBtn").css({"display":"none"});
	}

});

