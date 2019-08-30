
jQuery.validator.addMethod("emailOrPhone", function(value, element) {
    var phone = /^1\d{10}$/;
    var email = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    return this.optional(element) || (phone.test(value)) || (email.test(value));
}, "手机或者邮箱");

$(function(){

    comm.initInputFocusEvent();
    comm.bindReturnBtn("");
    var token=comm.getToken();
    var account = comm.getpara().account;
    var id = comm.getpara().id;
    var validCode = comm.getpara().validCode;
    var flag=comm.getpara().flag;
    $("#account").text(account);
    var phoneReg = /^1\d{10}$/;
    var emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;


    $("#loginForm").validate({
        submitHandler : function() {
            registSubmit();
        },
        rules : {
            "passwd" : {
                "required" : true,
                "rangelength" : [ 6, 20 ],
                "chrnum":true
            },
            "repasswd" : {
                "required" : true,
                "rangelength" : [ 6, 20 ],
                "equalTo":"#passwd"
            }
        },
        messages : {

            "passwd" : {
                "required" : "请填写密码。",
                "rangelength" : "密码长度请保持在6-20位！"
            },
            "repasswd" : {
                "required" : "请再次填写密码。",
                "rangelength" : "密码长度请保持在6-20位！",
                "equalTo":"两次输入密码不一致！"
            }
        },
        errorPlacement:function(error,element){
            var con = $(element).parent().parent().find(".l_warning");
            con.html(error);
            $(element).parent().parent().addClass("input_error");
        },
        success:function(element){
            $(element).parents(".input_error").removeClass("input_error");
            $(element).parent().empty();
            $("#loginBtn").attr("on","true");
        },
        onkeyup:false

    });
    $("#loginBtn").attr("on","true");
    $("#loginBtn").on("vclick",function(){
        if($(this).attr("on")=="true"){
            comm.creatEvent({
                triggerType:'注册',
                keyword:"注册-创建帐号",
                actionId:22
            });
            if(account && account!="" && phoneReg.test(account) || emailReg.test(account)){
                $("#loginBtn").attr("on","false");
                $("#loginForm").submit();
            }
        }
    });


    function registSubmit(){
    	var type="";
    	if(account && account!="" && phoneReg.test(account)){
    		type="mobile";
    	}
    	if(account && account!="" && emailReg.test(account)){
    		type="email";
    	}
    	if(type!=""){
            $("#loading_mask").show();
            var param={account:account,type:type,passwd:$("[name=passwd]").val(),verificationId:id,validCode:validCode};
    		//var result = customer.execute("userRegist",param);

		    //绑定微信

    		var result =CommService.execute("/mcall/web/user/userRegist/?struts.token="+token,param);//防止重复提交

		    $("#loading_mask").hide();
            if(result && result.responseStatus){
            	$.mobile.loading("show");
                var customerId=result.responsePk;
                user.getSessionInfo();
          	    //generatePersonPage(customerId);

	            if(comm.isWeiXin() ){
		            var wxBindUrl = "/mcall/wx/allin/interact/registTempStorage/";
		            $.ajax({url: wxBindUrl, type: "POST", data:{} }).done(function(rs){ localStorage.removeItem("flagWXRegist"); });
	            }

				//comm.bindWeixin();
            	user.registSuccess();
            }else{
                $("#loginBtn").attr("on","true");
            	token=comm.getToken();
            	//popup(result.responseMessage);
            	if(result && result.responseMessage)
                comm.showPageError(result.responseMessage);
            }
    	}
        


    }

});

/**
 * 微信分享
 */
function initShareWeixin(){
	window.weiXinTitle="我发现了一个很专业的医生社区。一起来看看吧。";	
	window.weiXinDesc="唯医网是专门的医生互动社区。更汇集海量手术视频、病例讨论、会议回放哦～";
}
initShareWeixin();
