
$(function(){
    comm.bindReturnBtn("");
    comm.initInputFocusEvent();

    var account = comm.getpara().account;
    $("#account").text(account);
    var forgetPasswdUrl="/mcall/customer/reset/password/send_email_input/?resetSite=2&account="+account;
    $("#forgetPasswdBtn").attr("href",forgetPasswdUrl);
    $("#loginForm").validate({
        submitHandler : function() {
            loginSubmit();
        },
        rules : {
            "passwd" : {
                "required" : true,
                "rangelength" : [ 6, 20 ]
            }
        },
        messages : {
            "passwd" : {
                "required" : "请填写密码。",
                "rangelength" : "密码长度请保持在6-20位！"
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



    function loginSubmit(){
        var type;
        var password=$("#loginForm").find("[name=passwd]").val();

        type = checkAccountType(account);
        var param = {
            j_username:"website;"+account+";"+password+";"+type,
            j_password:password
        };
        param.rememberMe=1;
        var url=customer.urlList.userLogin.url;
        //var responseObject=customer.execute("userLogin", param);
        //var message=responseObject.responseMessage;
        //alert(responseObject.responseStatus);
        //var data = { "paramJson": $.toJSON(param)};
        $.ajax({
            url: url,
            cache: false,
            data:param,
            dataType:'json',
            type:"POST",
            success: function(data){
                // 不正确的邮箱或密码,请重新输入！
                var result = data.responseObject;
                //$.ajax({url:"/mcall/customer/auth/updateSessionUser/",async:false});
                if(!result.responseStatus){         // 登录失败
                    comm.showPageError(result.responseMessage);
                }else{
                	user.getSessionInfo();
                    user.success("登录成功，即将返回来源页");       //  登录成功
                }
            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                // 通常 textStatus 和 errorThrown 之中
                // 只有一个会包含信息
                //this; // 调用本次AJAX请求时传递的options参数
                popup(textStatus + "   " +errorThrown);
            }
        });

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