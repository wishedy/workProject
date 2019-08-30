
$(function(){
    var account = comm.getpara().account;
    var flag=comm.getpara().flag;
    $("#account").text(account);

    comm.bindReturnBtn("");
    customer.execute("sendSms", {siteId:'2',typeId:2,account:account});
    var intval;
    setInterval(function(){
        if($("#valiCode").val().length==6){
            $("#valiCode").trigger("blur");
        }
    },100);
    $("#valiCode").on("focus",function(){
        if($("#valiCode").val().length==6) {
            $(this).val("");
            var o = this;

            setTimeout(function () {
                $(o).trigger("focus");
            }, 200);
        }
    });
    var fontWidth = parseFloat($("#valiCode").css("fontSize").replace("px",""))*0.6;
    var spacing = ($(".content-page").width()*0.9275*0.90-6*fontWidth)/5;
    $("#valiCode").css("letter-spacing",spacing);

    $("#loginForm").validate({
        submitHandler : function() {
        	phoneSubmit();
        },
        rules : {
            "valiCode" : {
                "required" : true,
                "rangelength" : [ 6, 6 ]
            }

        },
        messages : {
            "valiCode" : {
                "required" : "请填写验证码。",
                "rangelength" : "错误的验证码！"
            }
        },
        focusInvalid:false,
        errorPlacement:function(error,element){
            var con = $(element).parent().parent().find(".l_warning");
            con.html(error);
            $(element).parent().parent().addClass("input_error");
        },
        success:function(element){
            $(element).parents(".input_error").removeClass("input_error");
            $(element).parent().empty();
        },
        onkeyup:false
    });

    $("#loginBtn").on("vclick",function(){
        $("#loginForm").submit();
    });



    $("#getSMCode").on("vclick",getmsgHandle);


    function sendSms(){
        var repObj= customer.execute("sendSms", {siteId:'2',typeId:2,account:account});
        if(!repObj.responseStatus && repObj.responseMessage && repObj.responseMessage!=""){
            $(".l_warning").html('<label for="account" generated="true" class="error">'+repObj.responseMessage+'</label>');
            return false;
        }
        return true;
    }

    function getmsgHandle() {
        if(sendSms(1)){
            $("#getSMCode").off("vclick");
            $("#getSMCode").removeClass("active").addClass("disabled");

            countdownGetMsg();
        }

    }

    function countdownGetMsg(){
        var t = 60;
        var a = setInterval(function(){
            if(t>0){
                $("#getSMCode").text(t-- + "秒后重新获取");
            }else{
                clearInterval(a);
                $("#getSMCode").removeClass("disabled").addClass("active");
                $("#getSMCode").text("获取短信验证码");
                $("#getSMCode").on("vclick",getmsgHandle);
            }
        },1000)
    }

    function phoneSubmit(){
    	var validCode=$("#valiCode").val();
    	if(validCode && validCode!=""){
    		var rep=customer.execute("validSms",{"validCode":validCode,type:"customer_verification"});
            if(rep.responseStatus){
            	var id=rep.responseMessage;
              g_sps.jump(null,"/pages/passport/regist-step2-password.html?account="+account+"&id="+id+"&validCode="+validCode+"&flag="+flag);
            }else{
                $(".l_warning").html('<label for="account" generated="true" class="error">验证码错误</label>');
            }
    	}
    }

})

/**
 * 微信分享
 */
function initShareWeixin(){
	window.weiXinTitle="我发现了一个很专业的医生社区。一起来看看吧。";	
	window.weiXinDesc="唯医网是专门的医生互动社区。更汇集海量手术视频、病例讨论、会议回放哦～";
}
initShareWeixin();