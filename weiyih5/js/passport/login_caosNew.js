jQuery.validator.addMethod("emailOrPhone", function(value, element) {
    var phone = /^1\d{10}$/;
    var email = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    return this.optional(element) || (phone.test(value)) || (email.test(value));
}, "手机或者邮箱");
function checkComplete(){
    var phone = /^1\d{10}$/;
    var email = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    if((phone.test($('input[name=email]').val())||email.test($('input[name=email]').val()))&&$('input[name=password]').val()&&$('input[name=password]').val().length>=6&&$('input[name=password]').val().length<=20){
        $(".alLoginBtn").removeClass('disabled');
    }
}
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
            "password" : {
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
            "password" : {
                "required" : "请填写你在CAOS的密码。",
                "rangelength" : "密码长度在{0}-{1}位！",
                "remote" : "不正确的帐号或密码,请重新输入！"
            }
        },
        errorPlacement:function(error,element){
            var con =$(element).parent().next('.loginTip');
            con.html(error).addClass('error');
            $(".alLoginBtn").addClass('disabled');
        },
        success:function(element){
            $(element).parent().removeClass("error");
            $(element).parent().empty();
            checkComplete();
        },
        onkeyup:false

    });

    $(".alLoginBtn").on("click",function(){
        comm.creatEvent({
            triggerType:'CAOS授权登录(立即登录)',
            keyword:"CAOS授权登录(立即登录)",
            actionId:21
        });
        $("#loginForm").submit();
    });

    function loginSubmit(){
    	var email=$("#loginForm").find("[name=email]").val();
    	var password=$("#loginForm").find("[name=password]").val();
    	var type = checkAccountType(email);
        var param = {
        		j_username:"caos;"+email+";"+password+";"+type,
        		j_password:password
            };
        param.rememberMe=1;
        var url=customer.urlList.userLogin.url;
        //var data = { "paramJson": $.toJSON(param)};
        comm.loading.show();
        $.ajax({
            url: url,
            cache: false,
            data:param,
            dataType:'json',
            async:false,
            type:"POST",
            success: function(data){
                comm.loading.hide();
                  // 不正确的邮箱或密码,请重新输入！
                  var result = data.responseObject;
                  var resStatus=result.responseStatus;
                  var resCode=result.responseCode;
                  var resMessage=result.responseMessage;
                  if(!resStatus && resCode=="0A1004"){
                	  //存在相同的唯医帐号，未绑定，需要完善资料
                	  var from=comm.getpara().from;
                	  var email=$("#loginForm").find("[name=email]").val();
                    g_sps.jump(null,"/pages/passport/wanshan.html?caosId="+ resMessage + "&email=" + $("#loginForm").find("[name=email]").val()+"&from="+from);
                  }else if(!result.responseStatus){         // 登录失败
                      //comm.showPageError(result.responseMessage);
                      popup(result.responseMessage,3000)
                  }else{
                	  //绑定微信
                	  comm.bindWeixin();
                	  user.getSessionInfo();
                      user.success("登录成功，即将返回来源页");       //  登录成功                     
                  }
                    //事件埋点
                    comm.creatEvent({
                        triggerType:"登录",
                        keyword:"CAOS授权登录",
                        browType:148,
                        actionId:21,
                        locationId:3,
                        pushMessageId:TempCache.getItem("userId")
                    });
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



$(function(){
    loginPageInit();
    //Log.createBrowse(148,"联合登录-caos登录");
});




//window.onload = Log.createBrowse(27, '登录页面');

