
jQuery.validator.addMethod("registEmail", function(value, element) {
    var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    return this.optional(element) || (reg.test(value));
}, "不像是有效的电子邮箱。");

function registPageInit(){

    comm.initInputFocusEvent();
    comm.bindReturnBtn("");
    $("#registForm").validate({
        submitHandler : function() {
            registSubmit();
        },
        rules : {
            "email" : {
                "required" : true,
                "registEmail" : true,
                "rangelength" : [ 1, 50 ]
            },
            "passwd" : {
                "required" : true,
                "rangelength" : [ 6, 20 ]
               /* "chrnum":true*/
            },
            "passwdRepeat" : {
                "required" : true,
                "rangelength" : [ 6, 20 ],
                "equalTo":"#passwd"
            }
        },
        messages : {
            "email" : {
                "required" : "你还没填写邮箱。",
                "registEmail" : "不像是有效的电子邮箱。",
                "rangelength":"邮件地址不长于50位！"
            },
            "passwd" : {
                "required" : "请填写密码。",
                "rangelength" : "密码长度请保持在6-20位！"
            },
            "passwdRepeat" : {
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
        },
        onkeyup:false

    });

    $("input").on("focus",function(){
        $(".l_bottom").hide();
    });
    $("input").on("blur",function(){
        $(".l_bottom").show();
    });


    $("#registBtn").on("vclick",function(){
        $("#registForm").submit();
    });
    function registSubmit(){
        var param = {
                email:$("[name=email]").val(),
                passwd:$("[name=passwd]").val(),
                nickname: $("[name=nickname]").val()

            };
        var data = { "paramJson": $.toJSON(param)};
        $.ajax({
              url: "/mcall/web/user/userRegist/",
              cache: false,
              data:data,
              dataType:'json',
              type:"POST",
              success: function(data){
                  // 不正确的邮箱或密码,请重新输入！

                  var result = data.responseObject;
                  if(!result.responseStatus){
                	  popup(result.responseMessage);
                   //   $(".errorInfo").show().empty().append("<label>"+result.responseMessage+"</label>");
                  }else{
                	  var customerId=result.responsePk;
                	  //绑定微信
                	  comm.bindWeixin();
                	  //generatePersonPage(customerId);
                	  user.getSessionInfo();
                      user.registSuccess();
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



$("#registPage").live("pagecreate",function() {
    registPageInit();
    initShareWeixin();
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
//window.onload = Log.createBrowse(28, '注册页面');