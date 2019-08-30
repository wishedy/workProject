jQuery.validator.addMethod("emailOrPhone", function(value, element) {
    var phone = /^1\d{10}$/;
    var email = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    return this.optional(element) || (phone.test(value)) || (email.test(value));
}, "手机或者邮箱");

function loginPageInit(){
    //输入框焦点相关样式
    comm.initInputFocusEvent();
    comm.bindReturnBtn("");
    $("#loginForm").validate({
        submitHandler : function() {
            loginSubmit();
        },
        rules : {
            "email" : {
                "required" : true,
                "emailOrPhone" : true,
                "rangelength" : [ 1, 50 ]
            },
            "passwd" : {
                "required" : true,
                "rangelength" : [ 6, 20 ]
            }
        },
        messages : {
            "email" : {
                "required" : "请填写你在CAOS的用户名",
                "emailOrPhone" : "请输入正确的手机号或邮箱。",
                "rangelength":"最多可输入50个字符。"
            },
            "passwd" : {
                "required" : "请填写你在CAOS的密码。",
                "rangelength" : "密码长度在{0}-{1}位！",
                "remote" : "不正确的帐号或密码,请重新输入！"
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
        return false;
    });

    function loginSubmit(){
    	var email=$("#loginForm").find("[name=email]").val();
    	var password=$("#loginForm").find("[name=passwd]").val();
    	var type = checkAccountType(email);
        var param = {
        		j_username:"caos;"+email+";"+password+";"+type,
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
                  var resStatus=result.responseStatus;
                  var resCode=result.responseCode;
                  var resMessage=result.responseMessage;
                  //登录名已在唯医存在但未绑定
                  if(!resStatus && resCode=="0A1004"){
                	  //存在相同的唯医帐号，(即关联与不关联)未绑定，需要完善资料
                	  var email=$("#loginForm").find("[name=email]").val();
                	  var from=comm.getpara().from;
                	  var data={};
                	  data.email=email;
                	 var rep=customer.execute("checkIfBind",data,null);
                	 if(rep.responseStatus){
                           window.location.href="/pages/wx/wanshan.html?caosId="+ resMessage + "&email=" + $("#loginForm").find("[name=email]").val()+"&from="+from;
                	  }else{
                		  var con = $("#loginForm").find("[name=email]").parent().parent().find(".l_warning");
                        con.html("<label>"+rep.responseMessage+"</label>");
                		  return;
                	  }
                	  }
                	  //1.判断当前唯医帐号是否绑定过微信
                     else if(!result.responseStatus){         // 登录失败
                      comm.showPageError(result.responseMessage);
                     }else if(resStatus){
                      var data={};
                      var email=$("#loginForm").find("[name=email]").val();
                   	  data.email=email;
                   	  var rep=customer.execute("checkWeixinUniteBind", data);
                   	  if(rep.responseStatus){
                   		  var from=comm.getpara().from;
                   		  if("subscribe"==from){
                  		    	 window.location.href="/pages/personal/personal_myFollow.html";
                  		    	}else if("message"==from){
                  		    	 window.location.href="/pages/message/message_main.html";
                  		    	}
                   	  }else{
                   		 var con = $("#loginForm").find("[name=email]").parent().parent().find(".l_warning");
                         con.html("<label>"+rep.responseMessage+"</label>");
               		     return; 
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
}

/*
$("#loginPage").on("pagecreate",function(){

    loginPageInit();

});*/

$(function(){
    loginPageInit();
});

/*


$("#loginPage").ready(function(){
    loginPageInit();
});
*/

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

