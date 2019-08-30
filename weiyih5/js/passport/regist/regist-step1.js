jQuery.validator.addMethod("emailOrPhone", function(value, element) {
    var phone = /^1\d{10}$/;
    var email = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    return this.optional(element) || (phone.test(value)) || (email.test(value));
}, "手机或者邮箱");


$(function(){
    comm.initInputFocusEvent();
    comm.bindReturnBtn("");
    var flag=comm.getpara().flag;
    $("#loginForm").validate({
        submitHandler : function() {
            var account = $("#email").val(),type;
            if(/^1\d{10}$/.test(account)){
                type="mobile"
            }else{
                type="email"
            }
            var result = customer.execute("validateAccount",{account:$("#email").val(), type:type});
            if(result.responseStatus){  // 存在

              //g_sps.jump(null,"/pages/passport/regist_login.html?account="+account);
                if(comm.isApp()){
                    comm.callAppLogin();
                }else{
                    if(g_sps){
                        g_sps.jump(null,"/pages/passport/loginV2/login.html?account="+account);
                    }else{
                        window.location.href = "/pages/passport/loginV2/login.html?account="+account;
                    }

                }
            }else{                      // 不存在
                if(type=="email"){      // 邮箱设置密码
                  g_sps.jump(null,"/pages/passport/regist-step2-password.html?account="+account+"&flag="+flag);
                }else if(type=="mobile"){     // 手机发送验证码
                  g_sps.jump(null,"/pages/passport/regist-step2-phone.html?account="+account+"&flag="+flag);
                }
            }
        },
        rules : {
            "email" : {
                "required" : true,
                "emailOrPhone" : true,
                "rangelength" : [ 1, 50 ]
            }
        },
        messages : {
            "email" : {
                "required" : "请填写手机号或邮箱。",
                "emailOrPhone" : "请输入正确的手机号或邮箱。",
                "rangelength":"最多可输入50个字符。"
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
        },
        onkeyup:false

    });

    $("#loginBtn").on("vclick",function(){
       $("#loginForm").submit();
    });

	//window.onload = Log.createBrowse(28, "注册页面"); //	浏览日志
});

/**
 * 微信分享
 */
function initShareWeixin(){
	window.weiXinTitle="我发现了一个很专业的医生社区。一起来看看吧。";
	window.weiXinDesc="唯医网是专门的医生互动社区。更汇集海量手术视频、病例讨论、会议回放哦～";
}
initShareWeixin();
