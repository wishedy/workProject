jQuery.validator.addMethod("emailOrPhone", function(value, element) {
    var phone = /^1\d{10}$/;
    var email = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    return this.optional(element) || (phone.test(value)) || (email.test(value));
}, "手机或者邮箱");
function allinLoginPageInit(){

    comm.initInputFocusEvent();
    comm.bindReturnBtn("");
    $("#allinLoginForm").validate({
        submitHandler : function() {
            loginSubmit();
        },
        rules : {
            "email" : {
                "required" : true,
                "emailOrPhone" : true,
                "rangelength" : [ 1, 50 ]
            },
            "password" : {
                "required" : true,
                "rangelength" : [ 6, 20 ]
            }
        },
        messages : {
            "email" : {
                "required" : "请填写邮箱或已验证手机。",
                "emailOrPhone" : "请输入正确的手机号或邮箱。",
                "rangelength":"最多可输入50个字符。"
            },
            "password" : {
                "required" : "请填写密码。",
                "rangelength" : "密码长度请保持在6-20位！",
                "remote" : "用户名或密码不正确,请重新输入!"
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
        //$(".errorInfo").hide();
        comm.creatEvent({
            triggerType:'登录按钮',
            keyword:"登录按钮",
            actionId:16
        });
        $("#allinLoginForm").submit();
    });

    $("input").on("focus",function(){
       $(".l_bottom").hide();
    });
    $("input").on("blur",function(){
        $(".l_bottom").show();
    });

    function loginSubmit(){
        var type;
    	var password=$("#allinLoginForm").find("[name=password]").val();
        var email = $.trim($("#allinLoginForm").find("[name=email]").val());
        type = checkAccountType(email);
        var param = {
        		j_username:"website;"+email+";"+password+";"+type,
        		j_password:password
            };
        param.rememberMe=1;
        var url=customer.urlList.userLogin.url;
        $.ajax({
              url: url,
              cache: false,
              data:param,
              dataType:'json',
              type:"POST",
              success: function(data){
                  // 不正确的邮箱或密码,请重新输入！
                  var result = data.responseObject;
                  if(!result.responseStatus){         // 登录失败
                    comm.showPageError(result.responseMessage);
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
                          if(needAuth!=undefined){
                              TempCache.removeItem("needAuth");
                          }


                          if(needAuth!=undefined && needAuth=="true"){
                              if(auth==null || $.isEmptyObject(auth)) {
                                  comm.redirect("/pages/passport/chooseDepartment.html?type=needAuth&redirect=1");
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
              },
              error:function (XMLHttpRequest, textStatus, errorThrown) {
                    // 通常 textStatus 和 errorThrown 之中
                    // 只有一个会包含信息
                    //this; // 调用本次AJAX请求时传递的options参数
                  popup(textStatus + "   " +errorThrown);
              }
        });
        
    }


 /*   $(".login-tip").on("vclick",function(){
       $.mobile.changePage("lianhelogin.html");
    });*/
}

/*
$("#loginPage").on("pagecreate",function(){

    loginPageInit();

});*/

$("#allinLoginPage").on("pagecreate",function(){
    allinLoginPageInit();
});




$("#allinLoginPage").ready(function(){
    allinLoginPageInit();
});


/**
 * 微信分享
 */
function initShareWeixin(){
//	window.weiXinTitle="我发现了一个很专业的医生社区。一起来看看吧。";	
//	window.weiXinDesc="唯医网是专门的医生互动社区。更汇集海量手术视频、病例讨论、会议回放哦～";
	var weiXinTitle="我发现了一个很专业的医生社区。一起来看看吧。";
	var weiXinDesc="唯医网是专门的医生互动社区。更汇集海量手术视频、病例讨论、会议回放哦～";
	WeixinJSApi.title=function(){return weiXinTitle;};
	WeixinJSApi.desc=function(){return weiXinDesc;};
}
initShareWeixin();

//window.onload = Log.createBrowse(27, '登录页面');
