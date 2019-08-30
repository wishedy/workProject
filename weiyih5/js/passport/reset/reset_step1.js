/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2017/4/17
 * @author: sunhaibin
 */
jQuery.validator.addMethod("emailOrPhone", function(value, element) {
    var phone = /^1\d{10}$/;
    var email = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    return this.optional(element) || (phone.test(value)) || (email.test(value));
}, "手机或者邮箱");
$(function(){
    var resetAccount=$("input[name=email]").val();
    //flag表示微信服务号打开的
    var flag=$("#flag").val();
    var flagWeixin=comm.getpara().flag;
    if(resetAccount && resetAccount!="null"){
        $("#account").val(resetAccount);
    }
    $("#loginForm").validate({
        submitHandler : function() {
            comm.loading.show();
            var account = $("input[name=email]").val(),type;
            if(/^1\d{10}$/.test(account)){
                type="mobile"
            }else{
                type="email"
            }
            var result = customer.execute("validateAccount",{account:account, type:type});
            comm.loading.hide();
            if(!result.responseStatus){  // 不存在
                comm.topShowPageError(result.responseMessage);
            }else{// 存在
                if(type=="email"){
                    var obj=customer.getData("getCustomerUnite",{email:account});
                    if(obj && obj!=null && obj.mobile && obj.mobile!=""){
                      g_sps.jump(null,"/pages/passport/reset/reset_step2.html?_="+Math.random()+"&account="+obj.mobile+"&email="+account+"&flag="+flag);
                    }else{
                        var rep=customer.execute("sendPasswordEmail",{"resetSite":2,email:account,applySource:2,emailFlag:flag});
                        if(flagWeixin!=""){
                            flag=flagWeixin;
                        }

                        if(rep && rep.responseStatus){
                            comm.redirect("/pages/passport/findPassword/findPassword-step3-email.html?account="+account+"&flag="+flag); // 已发送
                        }else{
                            popup("超出邮件可发送数量");
                        }
                    }
                }else{
                    var obj=customer.getData("getCustomerUnite",{mobile:account});
                    comm.loading.hide();
                    if(obj==null || obj.isCheckMobile!=1){
                        comm.topShowPageError('无此帐号');
                    }else{
                      g_sps.jump(null,"/pages/passport/reset/reset_step2.html?_="+Math.random()+"&account="+account+"&flag="+flag);
                    }

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
            comm.topShowPageError($(error).text());
            if($("input[name=email]").val()==""){
                $('.topShowError').remove();
            }
            $(".alLoginBtn").addClass('disabled');
        },
        success:function(element){
            $('.topShowError').remove();
            $(".alLoginBtn").removeClass('disabled');
        },
        onkeyup:false
    });
    $("input[name=email]").on('focus',function(){
        $(this).parents('form').siblings('span').addClass('icon-mobileOn').removeClass('icon-mobile');
    }).on('blur',function(){
        $(this).parents('form').siblings('span').addClass('icon-mobile').removeClass('icon-mobileOn');
    }).on('input propertychange',function(){
        var phone = /^1\d{10}$/;
        var email = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
        if(phone.test($(this).val())||email.test($(this).val())){
            $(".alLoginBtn").removeClass('disabled');
        }else{
            $(".alLoginBtn").addClass('disabled');
        }
    });
    $(".quickLoginBtn").on("click",function(){
        if(!$(this).hasClass('disabled')){
            $("#loginForm").submit();
        }
    });
    //window.onload = Log.createBrowse(29, '找回密码');
});