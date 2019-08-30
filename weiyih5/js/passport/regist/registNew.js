/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2017/4/13
 * @author: sunhaibin
 */

jQuery.validator.addMethod("alPhone", function(value, element) {
    var phone = /^1\d{10}$/;
    var email = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    return this.optional(element) || (phone.test(value)) || (email.test(value));
}, "手机");
jQuery.validator.addMethod("alPswd", function(value, element) {
    var psw = /^[A-Za-z0-9`~!@#$%^&*()-_=+{};:,.<>/?\|'"]+$/;

    return this.optional(element) || (psw.test(value));
}, "密码");

$(function(){
    var flag=comm.getpara().flag;
    var phone = /^1\d{10}$/;
    var email = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    var account = comm.getpara().account;
    if(account&&(phone.test(account)||email.test(account))){
        $('#phoneNumber').val(account);
    }
    var registing = false;

    $("#registForm").validate({
        submitHandler : function() {
            var type = 'mobile';
            var account = $("#phoneNumber").val();
            if(email.test(account)){
                type = 'email'
            }
            var result = customer.execute("validateAccount",{account:$("#phoneNumber").val(), type:type});

            if(result.responseStatus){  // 存在
                popupFn('该帐号已存在，可直接登录',3000,function(){
                    if(comm.isApp()){
                        comm.callAppLogin();
                    }else{
                        if(g_sps){
                            g_sps.jump(null,"/pages/passport/login.html?account="+account);
                        }else{
                            window.location.href = "/pages/passport/login.html?account="+account;
                        }

                    }
                });
            }else{ // 不存在
                if(type=="mobile"){// 手机发送验证码
                  g_sps.jump(null, "/pages/passport/get_code.html?account="+account+"&psw="+$('input[name=password]').val());
                }else{
                    registSubmit(account,$('#password').val());
                }
            }
        },
        rules : {
            "phoneNumber" : {
                "required" : true,
                "alPhone" : true
                //"rangelength" : [11,11]
            },
            "password" : {
                "required" : true,
                "alPswd":true,
                "rangelength" : [ 6, 20 ]
            }
        },
        messages : {
            "phoneNumber" : {
                "required" : "请填写手机号或邮箱",
                "alPhone" : "请输入正确的手机号或邮箱"
                //"rangelength":"请输入正确的手机号"
            },
            "password":{
                "required" : "请输入密码",
                "alPswd": "字母、数字或符号的组合",
                "rangelength" : "密码长度请保持在6-20位！",
                "remote" : "用户名或密码不正确,请重新输入!"
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
    function checkComplete(){
        var phone = /^1\d{10}$/;
        var email = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
        if(
            (phone.test($('input[name=phoneNumber]').val())||email.test($('input[name=phoneNumber]').val()))
            &&$('input[name=password]').val()
            &&$('input[name=password]').val().length>=6
            &&$('input[name=password]').val().length<=20
        ){
            $(".alLoginBtn").removeClass('disabled');
        }
    }
    $('.ev_digHole').click(function(){
        var _fromPage = TempCache.getItem('fromPage');
        comm.creatEvent({
            triggerType:'全站功能按钮点击',
            keyword:'继续体验',
            actionId:41,
            async:false
        });
        if(/message_main/.test(document.referrer)||
            /html\/m\/(video|case|topic|doc)/g.test(document.referrer)||
            /i_want.html/g.test(document.referrer)||
            /friends_circle/g.test(document.referrer)||
            /live-wrap/g.test(document.referrer)||
            /_upload.html/g.test(document.referrer)
        ){
          g_sps.jump(null, "/");
        }else{
            history.go(-2);
        }
    });
    //input切换
    var mTop = $('.loginRegistText').offset().top;
    var mTop = $('.loginRegistText').offset().top;
    var phoneR = /^1\d{10}$/;
    var pswR = /^[A-Za-z0-9`~!@#$%^&*()-_=+{};:,.<>/?\|'"]{6,20}$/;
    var _passport="";
    var _passwd = "";
    $("input").on("focus",function(){
        $(this).parent().addClass('focus');
        //$('html body').stop().animate({scrollTop:mTop},20);
        if(!comm.browser.versions.ios){
            $('.alTry,.alLoginLogo').hide();
        }else{
            $('html body').stop().animate({scrollTop:mTop},20);
        }

        $(this).on("blur",function(){
            $('.alTry,.alLoginLogo').show();
            $(this).parent().removeClass('focus');
        });
    }).on('input',function(){
        if($(this).val()){
            $(this).parent().find(".close").show();
        }else{
            $(this).parent().find(".close").hide();
        }
        _passport = $('input[name=phoneNumber]').val();
        _passwd = $('input[name=password]').val();
        if((phoneR.test(_passport)||email.test(_passport))&&pswR.test(_passwd)){
            $('.alLoginBtn').removeClass('disabled');
        }else{
            $('.alLoginBtn').addClass('disabled');
        }
    });
    //点x清空input
    $('#registForm i.close').click(function(){
        $(this).siblings('input').val("");
        //$(this).parent().next().removeClass('error');
    });
    //
    //密码明文暗文切换
    $('.ev_toggleEye').click(function(){
        if($(this).hasClass('eyeOpen')){
            $(this).addClass('eyeClose').removeClass('eyeOpen');
            $(this).siblings('input').attr('type','password');
        }else{
            $(this).addClass('eyeOpen').removeClass('eyeClose');
            $(this).siblings('input').attr('type','text');
        }
    });
    $(".alLoginBtn").on("click",function(e){
        if(!$(this).hasClass('disabled')&&!registing){
			registing = true;
            comm.loading.show();
            $(this).addClass('disabled');
            $("#registForm").submit();
        }
        e.preventDefault();
    });
    function registSubmit(account,psw,id,validCode){
        var param={account:account,type:'email',passwd:psw,verificationId:id,validCode:validCode};
        var token = comm.getToken();
        var result =CommService.execute("/mcall/web/user/userRegist/?struts.token="+token,param);
        comm.loading.hide();
        console.log(registing);

        $(this).removeClass('disabled');
        if(result && result.responseStatus){
            var customerId=result.responsePk;
            user.getSessionInfo();

            if(comm.isWeiXin() ){
                var wxBindUrl = "/mcall/wx/allin/interact/registTempStorage/";
                $.ajax({url: wxBindUrl, type: "POST", data:{} }).done(function(rs){ localStorage.removeItem("flagWXRegist"); });
            }
            TempCache.setItem('firstRegist',1);
            var fromPage = TempCache.getItem('fromPage');
            TempCache.setItem('fromPageN',fromPage);
            user.registSuccess();
        }else{
            if(result && result.responseMessage){
                popup(result.responseMessage);
            }
            registing = true;
        }
        //事件埋点
        comm.creatEvent({
            triggerType:"注册",
            keyword:"注册",
            actionId:22,
            locationId:1,
            pushMessageId:TempCache.getItem("userId")
        });
    }
    // window.onload = Log.createBrowse(28, "注册页面"); //	浏览日志
});
