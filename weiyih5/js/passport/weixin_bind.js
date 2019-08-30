jQuery.validator.addMethod("emailOrPhone", function(value, element) {
    var phone = /^1\d{10}$/;
    var email = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    return this.optional(element) || (phone.test(value)) || (email.test(value));
}, "手机或者邮箱");

function allinLoginPageInit(){
    comm.initInputFocusEvent();
    comm.bindReturnBtn("","/");
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
        onkeyup:true

    });

    $("#loginBtn").on("vclick",function(){
        //$(".errorInfo").hide();
        $("#allinLoginForm").submit();
    });

    $("input").on("focus",function(){
       $(".l_bottom").hide();
    });
    $("input").on("blur",function(){
        $(".l_bottom").show();
    });

    function loginSubmit(){
    	$.mobile.loading("show");
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
                  if(!result.responseStatus){         // 登录失败
                    comm.showPageError(result.responseMessage);
                  }else{
                	  user.getSessionInfo();
                	  var eventKey=comm.getpara() && comm.getpara().key;
                	  if(eventKey && eventKey!=undefined && eventKey=="bind_unite"){
                		  bingUnite();
                	  }else{
                		  user.success("登录成功，即将返回来源页"); 
                	  }
                  }
              },
              error:function (XMLHttpRequest, textStatus, errorThrown) {
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
 * 绑定微信帐号
 */
function bingUnite(){
	var param=comm.getpara();
	var data={};
	data.weixinOpenId=param && param.uniteNameWeixin;
	data.signature=param && param.signature;
	data.password=$("#allinLoginForm").find("[name=password]").val();
    data.account= $.trim($("#allinLoginForm").find("[name=email]").val());
	
	var rep=customer.execute("createWeixinUniteBind", data);
	if(rep && rep.responseStatus){
		user.success("绑定成功，即将返回来源页"); 
	}else{
		pop("绑定失败:"+rep.resonseMessage);
	}
	$.mobile.loading("hide");
}

