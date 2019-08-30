jQuery.validator.addMethod("chrnum", function(value, element) {
    var chrnum = /^([a-zA-Z0-9]+)$/;
    return this.optional(element) || (chrnum.test(value));
}, "只能输入数字和字母(字符A-Z, a-z, 0-9)");

function registPageInit(){
    var caosId = comm.getpara().caosId;
    var email =   comm.getpara().email;
    var type = checkAccountType(email);
    $("#account").text(email);
    comm.bindReturnBtn("");
    $("#loginForm").validate({
        submitHandler : function() {
            registSubmit();
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
                "rangelength" : "密码长度请保持在6-20位！",
                "remote" : "密码不正确。想要 <a href='/mcall/customer/reset/password/send_email_input/?resetSite=2'> 恢复密码 </a>吗？"
            }
        },
        errorPlacement:function(error,element){
            var con = $(element).parent().parent().find(".l_warning");
            con.append("<span></span>");
            con.find("span").html(error);

            $(element).parent().parent().addClass("input_error");

        },
        success:function(element){
            $(element).parents(".input_error").removeClass("input_error");
            $(element).parent().parent().empty();
        },
        onkeyup:false
    });
    $("#loginBtn").on("vclick",function(){
        $("#loginForm").submit();
    });
    function registSubmit(){
        var param = {
        		type:type,
                email:email,
                passwd:$("[name=passwd]").val() ,
                caosCustomerId:caosId
            };
        var data = { "paramJson": $.toJSON(param)};
        $.ajax({
              url: customer.urlList.userValidAndBind.url,
              cache: false,
              data:data,
              dataType:'json',
              type:"POST",
              success: function(data){
                  // 不正确的邮箱或密码,请重新输入！
                  var result = data.responseObject;
                  if(!result.responseStatus){
                      //popup(result.responseMessage);
                      //$(".errorInfo").show().empty().append(' <div class="l_warning"><span><label>'+result.responseMessage+'</label></span></div>');
                      comm.showPageError(result.responseMessage);
                  }else{
                      localStorage.setItem("userId",customer.getData("getWebUser").userId);
                      user.success("登录成功，即将返回来源页");
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



$(function() {
    registPageInit();
});
