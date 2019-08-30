if(TempCache.getItem('userId')){    //已登录，返回来源页
    history.back();
}
jQuery.validator.addMethod("emailOrPhone", function(value, element) {
    var phone = /^1\d{10}$/;
    var email = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    return this.optional(element) || (phone.test(value)) || (email.test(value));
}, "手机或者邮箱");
jQuery.validator.addMethod("alPswd", function(value, element) {
    var phone = /^[A-Za-z0-9`~!@#$%^&*()-_=+{};:,.<>/?\|'"]+$/;
    return this.optional(element) || (phone.test(value));
}, "密码");
function allinLoginPageInit(){

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
                "alPswd":true,
                "rangelength" : [ 6, 20 ]
            }
        },
        messages : {
            "email" : {
                "required" : "请填写唯医通行证",//通行证。
                "emailOrPhone" : "请输入正确的唯医通行证",//通行证。
                "rangelength":"最多可输入50个字符"
            },
            "password" : {
                "required" : "请填写密码。",
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
    //注册过程中注册帐号已存在，跳转带过来的参数放到input里
    if(comm.getpara().account){
        $('input[name=email]').val(comm.getpara().account);
    }
    //初始化时判断登录按钮是否可点

    //参数是否带type = needAuth
    if(comm.getpara().type=="needAuth"){
        TempCache.setItem('needAuthRegist','need');
    }

    //登录
    $(".alLoginBtn").on("click",function(){
        // $("#allinLoginForm").submit();
    });
    $('.ev_digHole').click(function(){
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
          g_sps.jump(null,"/");
        }else{
            history.go(-1);
        }
    });
    //input切换
    var mTop = $('.loginRegistText').offset().top;
    var phoneR = /^1\d{10}$/;
    var emailR = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    var pswR = /^[A-Za-z0-9`~!@#$%^&*()-_=+{};:,.<>/?\|'"]{6,20}$/;
    var _passport="";
    var _passwd = "";
    $("input").on("focus",function(){
        $(this).parent().addClass('focus');
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
        _passport = $('input[name=email]').val();
        _passwd = $('input[name=password]').val();
        if((phoneR.test(_passport)||emailR.test(_passport))&&pswR.test(_passwd)){
            $('.alLoginBtn').removeClass('disabled');
        }else{
            $('.alLoginBtn').addClass('disabled');
        }
    });
    //点x清空input
    $('#allinLoginForm i.close').click(function(){
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
                    comm.topShowPageError(result.responseMessage);
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
                          //if(needAuth!=undefined && needAuth=="true"){
                          //    if(auth==null || $.isEmptyObject(auth)) {
                          //        comm.redirect("/pages/passport/auth/information.html");
                          //    }else{
                          //        user.getSessionInfo();
                          //        user.success("登录成功，即将返回来源页");       //  登录成功
                          //    }
                          //}else{
                              user.getSessionInfo();
                              user.success("登录成功，即将返回来源页");       //  登录成功
                          //}
                      }


                  }
                  comm.creatEvent({
                      triggerType:'登录按钮',
                      keyword:"登录按钮",
                      actionId:16,
                      locationId:1,
                      pushMessageId:TempCache.getItem("userId")||''
                  });
              },
              error:function (XMLHttpRequest, textStatus, errorThrown) {

                  popup(textStatus + "   " +errorThrown);
              }
        });
        
    }


}
function checkComplete(){
    var phone = /^1\d{10}$/;
    var email = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    if((phone.test($('input[name=email]').val())||email.test($('input[name=email]').val()))&&$('input[name=password]').val()&&$('input[name=password]').val().length>=6&&$('input[name=password]').val().length<=20){
        $(".alLoginBtn").removeClass('disabled');
    }
}
$(".caosLogin").click(function(){
    //事件埋点
    comm.creatEvent({
        triggerType:"登录",
        keyword:"CAOS登录",
        locationId:3,
        actionId:20,
        async:false
    });
});
//无法登录
$('.alLoginNone').click(function(){
    $('.al-bottomSelectorListMask').addClass('on');
});
// 取消
$('#ev-retrieveCancel').click(function(){
    $('.al-bottomSelectorListMask').removeClass('on');
    comm.creatEvent({
        triggerType:'全站功能按钮点击',
        keyword:'无法登录取消',
        actionId:45
    });
});



$("#allinLoginPage").ready(function(){
    allinLoginPageInit();
});


//window.onload = Log.createBrowse(27, '登录页面');
