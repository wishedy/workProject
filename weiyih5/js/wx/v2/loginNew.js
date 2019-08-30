/**
 * Created by zhanghongda on 2017/12/11.
 */
$.ajax({
  url: "/mcall/web/user/checkSession/",
  dataType: "json",
  type: "post",
  async: false,
  success: function(result) {
    if (result && result.responseObject.responseMessage.status) { //已登录
      window.location.href="/";
    }
  }
});

$(function () {
    var login={};
    login={
        valid:{
            phone : /^1\d{10}$/,
            email : /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
            pswR : /^[A-Za-z0-9`~!@#$%^&*()-_=+{};:,.<>/?\|'"]{6,20}$/
        },
        param:{
            phoneNum:0,//定义两个全局的变量，用来保证手机号和验证码一致
            sendCode:0,
            errorPass:0,
            timer:''
        },
        path:{
            isExit:M_CALL+'customer/unite/validateAccount/',//判断帐号是否存在
            sendCode:M_CALL+"customer/unite/sendCode/",//发送短信验证码
            checkCode:M_CALL+"customer/unite/updateCode/",//校验发送短信验证码
            submit:M_CALL+"customer/verification/validSms/",//提交操作
            submitLogin:M_CALL+"passport/securitycheck",//提交按钮
            userRegist:M_CALL+"web/user/userRegist/"//注册按钮
        },
        init:function () {
            var t = this;
            t.checkLogin();
            t.tabCli();
            t.checkSendCode();
            TempCache.removeItem("firstRegist");
            if(location.hash.lastIndexOf("regist")>-1){
              $('.registerBtn span').click();
            }
            //alert("111"+TempCache.getItem("fromPageN"));
        },
        //微信授权登录
        weixinLogin:function(){
          var webdomain = '//' + location.host
          var appId = 'wx8d4a2df6fdc13658'
          var href = location.href
          var toUrl = 'http:' + webdomain + '/mcall/wx/allin/interact/view/?url=' + encodeURIComponent(href)
          window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(toUrl) + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
        },
        checkSendCode:function () {
            var t = this;
            $(".ev-sendCode,.ev-regSendCode").off("click").on("click",function () {//点击发送验证码
                var _t = $(this);
                _t.unbind('click');
                var phoneVal = $(this).parents('aside').find('.ev-PV').val();
                type = checkAccountType(phoneVal);
                if(t.valid.phone.test(phoneVal)){//如果输入的为正确的手机号
                    var param = {
                        account:phoneVal,
                        type:type
                    };
                    callback=function (data) {
                        if(data&&data.responseObject&&data.responseObject.responseStatus){//如果帐号存在
                            if(_t.attr("data-type")==2){//表示是注册的发送验证码,弹出了去登录弹层
                                t.popup({
                                    title:'该手机号已注册',
                                    firstBtn:'立即登录',
                                    firCallback:function () {//立即登录按钮
                                        $(".ev-phoneNotRegin").remove();//没有注册的弹层消失
                                        $('.ev-loginBox').show();
                                        $('.ev-registerBox').hide();
                                        $('.loginRegisterTab p[data-type=1]').click();
                                        $(".ev-loginInput").val(phoneVal);
                                        t.sendCode($('.ev-sendCode'),phoneVal,data.responseObject.responseData.customerUnite.customerId);
                                        // $('.ev-sendCode').click();
                                    },
                                    agaCallback:function () {
                                        $(".ev-phoneNotRegin").remove();//没有注册的弹层消失
                                        $(".ev-regPhoInput").val("");
                                        $(".ev-regEmaInput").val("");
                                        t.checkSendCode();
                                        // t.sendCode(phoneVal,data.responseObject.responseData.customerUnite.customerId,_t.attr("data-type"));//发送短信
                                    }
                                })
                            }else{
                                $(".ev-phoneNotRegin").hide();//没有注册的弹层消失
                                t.sendCode(_t,phoneVal,data.responseObject.responseData.customerUnite.customerId);//发送短信
                            }
                        }else{//手机号码不存在
                            if(_t.attr("data-type")==1){//1表示是登录操作
                                t.popup({
                                    title:'该手机号尚未注册',
                                    firstBtn:'立即注册',
                                    hasThreeBtn:1,
                                    firCallback:function () {
                                        $(".ev-phoneNotRegin").remove();//没有注册的弹层消失
                                        $(".ev-loginInput").val("");
                                        $('.ev-loginBox').hide();
                                        $('.ev-registerBox').show();
                                        $('.ev-regPhoInput').val(phoneVal);
                                        history.pushState({},"regist","#/regist");
                                        $(window).trigger("hashchange");
                                    },
                                    secCallback:function (){//邮箱登录
                                        $(".ev-phoneNotRegin").remove();//没有注册的弹层消失
                                        $(".ev-loginInput").val("");
                                        $('.loginRegisterTab p[data-type=2]').click();
                                    },
                                    agaCallback:function () {
                                        $(".ev-phoneNotRegin").remove();//没有注册的弹层消失
                                        $(".ev-loginInput").val("");
                                    }
                                });
                                t.checkSendCode();
                            }else{//表示注册操作，走入注册接口
                                t.sendCode(_t,phoneVal);
                            }
                        }
                    };
                    t.loginAjax(t.path.isExit,param,callback);
                }else {
                    popup("请填写正确的手机号码");
                    t.checkSendCode();
                }
            });
        },
        sendCode:function (dom,account,cId,type) {//发送验证码
            var t = this;
            var params = {
                siteId:2,
                typeId:type||3,
                account:account,
                codeLength:4,
                customerId:cId
            };
			var timestamp = new Date().getTime();
			params = $.extend(params,{
				timestamp:timestamp,
                ALLINACCESSTOKEN:allinaccesstoken(timestamp,account)
            });
            callbacks = function (data) {
                if(data&&data.responseObject&&data.responseObject.responseStatus){
                    popup("验证码已发送");
                    t.param.phoneNum = $(".ev-loginInput").val();
                    var time = 60;
                    t.param.timer = setInterval(function () {
                        time--;
                        dom.hide();
                        dom.next('.timeYZM').show().text(time+'s');
                        if(time<0){
                            dom.show();
                            dom.next('.timeYZM').hide().text(60+'s');
                            clearInterval(t.param.timer);
                            t.checkLogin(data.responseObject.responsePk);
                            t.tabCli();
                            t.checkSendCode();
                        }
                    },1000);
                    t.checkLogin(data.responseObject.responsePk);
                }else{
                    if(data&&data.responseObject.responseCode=='ERR_001'){
                        popup('您获取验证码过于频繁，请明天再试');
                    }else if( data && data.responseObject.responseMessage){
                        popup(data.responseObject.responseMessage);
                    }else{
                        popup("发送失败！");
                    }
                    t.checkLogin();
                    t.tabCli();
                    t.checkSendCode();
                }
            };
            t.loginAjax(t.path.sendCode,params,callbacks)//发送短信验证码的接口
        },
        checkLogin:function (id) {//提交登录信息
            var t = this;
            $(".ev-loginBtn").off("click").on("click",function (e) {//登录校验登录信息
                if($(this).attr('unbind')!=1){
                    // $(this).unbind("click");
                    $(this).attr("unbind",'1');
                    e.stopPropagation();
                    if($('.loginRegisterTab p[class=active]').attr("data-type")==1){//表示是快捷登录
                        var validCode = $(".ev-codeInput").val(),account = t.param.phoneNum;
                        var phone = $(this).parents('.al-login').find('.ev-loginInput').val(),code = $(this).parents('.al-login').find('.ev-codeInput').val();
                        if(phone==''){//用户名为空
                            comm.topShowPageErrorNew("请输入11位手机号码");
                            $('.ev-loginBtn').attr("unbind",'0');
                        }else if(!t.valid.phone.test(phone)){
                            comm.topShowPageErrorNew("请输入正确的手机号码");
                            $('.ev-loginBtn').attr("unbind",'0');
                        }else if(code==''){
                            comm.topShowPageErrorNew("请输入验证码");
                            $('.ev-loginBtn').attr("unbind",'0');
                        }else{
                            if($(".ev-loginInput").val()==t.param.phoneNum){
                                param={
                                    typeId:3,
                                    validCode:validCode,
                                    account:account,
                                    id:id,
                                    operateType:7
                                };
                                callback=function (data) {
                                    if(data&&data.responseObject&&data.responseObject.responseStatus){//验证码正确
                                        t.loginSubmit(data);
                                        comm.creatEvent({triggerType:'登录按钮', keyword:"登录按钮", actionId:16, locationId:1, pushMessageId:TempCache.getItem("userId")||''});
                                    }else{
                                        popupFn(data.responseObject.responseMessage,3000,function(){
                                            $(".ev-codeInput").val("");
                                            $('.timeYZM').hide();
                                            $('.ev-sendCode').show();
                                            clearInterval(t.param.timer);
                                        })
                                    }
                                    $('.ev-loginBtn').attr("unbind",'0');
                                };
                                t.loginAjax(t.path.checkCode,param,callback)
                            }else{
                                $('.ev-loginBtn').attr("unbind",'0');
                                popup("验证码错误");
                                t.checkSendCode();
                            }
                        }
                    }else{//表示帐号登录
                        var phone = $(this).parents('.al-login').find('.ev-logInp').val(),password = $(this).parents('.al-login').find('.ev-passInput').val();
                        if(phone==''){//用户名为空
                            comm.topShowPageErrorNew("请输入正确的手机号/邮箱");
                            $('.ev-loginBtn').attr("unbind",'0');
                        }else if(!(t.valid.phone.test(phone)||t.valid.email.test(phone))){
                            comm.topShowPageErrorNew("请输入正确的手机号/邮箱");
                            $('.ev-loginBtn').attr("unbind",'0');
                        }else if(phone.length>50){
                            comm.topShowPageErrorNew("帐号长度不超过50个字符");
                            $('.ev-loginBtn').attr("unbind",'0');
                        }else if(password==''){
                            comm.topShowPageErrorNew("请输入密码");
                            $('.ev-loginBtn').attr("unbind",'0');
                        }else if(password.length<6||password.length>20){
                            comm.topShowPageErrorNew("密码长度为6-20位");
                            $('.ev-loginBtn').attr("unbind",'0');
                        }else if(!t.valid.pswR.test(password)){
                            comm.topShowPageErrorNew("字母、数字或符号的组合");
                            $('.ev-loginBtn').attr("unbind",'0');
                        }else{
                            $('.topShowError').hide();
                            type = checkAccountType(phone);
                            var param = {
                                account:phone,
                                type:type
                            };
                            callback=function (data) {
                                var type;
                                var password=$.trim($('.ev-passInput').val());
                                var phone = $.trim($('.ev-logInp').val());
                                if(data&&data.responseObject&&data.responseObject.responseStatus){//如果帐号存在
                                    type = checkAccountType(phone);
                                    var param = {
                                        j_username:"website;"+phone+";"+password+";"+type,
                                        j_password:password,
                                        rememberMe:1
                                    };
                                    $.ajax({
                                        url: t.path.submitLogin,
                                        cache: false,
                                        data:param,
                                        dataType:'json',
                                        type:"POST",
                                        success: function(data){
                                            t.loginSubmit(data);
                                            comm.creatEvent({triggerType:'登录按钮', keyword:"登录按钮", actionId:16, locationId:1, pushMessageId:TempCache.getItem("userId")||''});
                                        },
                                        error:function (XMLHttpRequest, textStatus, errorThrown) {
                                            popup(textStatus + "   " +errorThrown);
                                        }
                                    });
                                    t.checkSendCode();
                                }else{//帐号不存在
                                    t.popup({
                                        title:'该帐号暂未注册',
                                        firstBtn:'立即注册',
                                        firCallback:function () {
                                            $(".ev-phoneNotRegin").remove();//没有注册的弹层消失
                                            $(".ev-loginInput").val("");
                                            $('.ev-loginBox').hide();
                                            $('.ev-registerBox').show();
                                            if(t.valid.phone.test(phone)){
                                                $('.ev-regPhoInput').val(phone);
                                            }else{
                                                $('.ev-regPhoInput').val('');
                                            }
                                            history.pushState({},"regist","#/regist");
                                            $(window).trigger("hashchange");
                                        },
                                        agaCallback:function () {
                                            $(".ev-phoneNotRegin").remove();//没有注册的弹层消失
                                            $(".ev-logInp").val("");
                                            $('.ev-passInput').val('');
                                        }
                                    });
                                    t.checkSendCode();
                                    $('.ev-loginBtn').attr("unbind",'0');
                                }
                            };
                            t.loginAjax(t.path.isExit,param,callback);
                        }
                    }
                }
            });
            $('.ev-reginBtn').off("click").on("click",function (e){//注册按钮
                if($(this).attr("unbind")!=1){
                    $(this).attr("unbind",'1');
                    e.stopPropagation();
                    if($('.al-indexHeaderItem h1').text()=='注册'){//表示是手机验证码注册
                        var phone = $(this).parents('.al-login').find('.ev-regPhoInput').val(),password = $(this).parents('.al-login').find('.ev-regPassInput').val(),code = $(this).parents('.al-login').find('.ev-codeInput').val();
                        type = checkAccountType(phone);
                        if(phone==''){//用户名为空
                            comm.topShowPageErrorNew("请输入11位手机号码");
                            $('.ev-reginBtn').attr("unbind",'0');
                        }else if(!t.valid.phone.test(phone)){
                            comm.topShowPageErrorNew("请输入正确手机号码");
                            $('.ev-reginBtn').attr("unbind",'0');
                        }else if(phone.length>50){
                            comm.topShowPageErrorNew("最多可输入50个字符");
                            $('.ev-reginBtn').attr("unbind",'0');
                        }else if(code==''){
                            comm.topShowPageErrorNew("请输入验证码");
                            $('.ev-reginBtn').attr("unbind",'0');
                        }else if(password==''){
                            comm.topShowPageErrorNew("请输入密码");
                            $('.ev-reginBtn').attr("unbind",'0');
                            $('.ev-reginBtn').attr("unbind",'0');
                        }else if(password.length<6||password.length>20){
                            comm.topShowPageErrorNew("密码长度为6-20位");
                            $('.ev-reginBtn').attr("unbind",'0');
                        }else if(!t.valid.pswR.test(password)){
                            comm.topShowPageErrorNew("字母、数字或符号的组合");
                            $('.ev-reginBtn').attr("unbind",'0');
                        }else{
                            param={
                                typeId:3,
                                validCode:code,
                                account:phone,
                                id:id,
                                operateType:7
                            };
                            callback=function (data) {
                                if(data&&data.responseObject&&data.responseObject.responseStatus){//验证码正确
                                    t.registerSubmit(phone,type,password,id,code);
                                }else{
                                    popupFn(data.responseObject.responseMessage,3000,function(){
                                        $(".ev-codeInput").val("");
                                        $('.ev-regSendCode').show();
                                        $('.timeYZM').hide();
                                        clearInterval(t.param.timer);
                                    });
                                    t.checkSendCode();
                                }
                                $('.ev-reginBtn').attr("unbind",'0');
                            };
                            t.loginAjax(t.path.checkCode,param,callback)
                        }
                    }else{//如果是邮箱登录
                        var phone = $(this).parents('.al-login').find('.ev-regEmaInput').val(),password = $(this).parents('.al-login').find('.ev-regEmaPasInput').val();
                        type = checkAccountType(phone);
                        if(phone==''){//用户名为空
                            comm.topShowPageErrorNew("请输入邮箱");
                            $(this).attr("unbind",'0');
                        }else if(!t.valid.email.test(phone)){
                            comm.topShowPageErrorNew("请输入正确的邮箱");
                            $(this).attr("unbind",'0');
                        }else if(phone.length>50){
                            comm.topShowPageErrorNew("邮箱长度不超过50个字符");
                            $(this).attr("unbind",'0');
                        }else if(password==''){
                            comm.topShowPageErrorNew("请输入登录密码");
                            $(this).attr("unbind",'0');
                        }else if(password.length<6||password.length>20){
                            comm.topShowPageErrorNew("密码长度为6-20位");
                            $(this).attr("unbind",'0');
                        }else if(!t.valid.pswR.test(password)){
                            comm.topShowPageErrorNew("字母、数字或符号的组合");
                            $(this).attr("unbind",'0');
                        }else{
                            var param = {
                                account:phone,
                                type:type
                            };
                            callback=function (data) {
                                if(data&&data.responseObject&&data.responseObject.responseStatus){//如果帐号存在
                                    t.popup({
                                        title:'该邮箱已注册',
                                        firstBtn:'立即登录',
                                        firCallback:function () {//立即登录按钮
                                            $(".ev-phoneNotRegin").remove();//没有注册的弹层消失
                                            $('.ev-loginBox').show();
                                            $('.ev-registerBox').hide();
                                            $('.loginRegisterTab p[data-type=2]').click();
                                            $(".ev-logInp").val(phone);
                                        },
                                        agaCallback:function () {
                                            $(".ev-phoneNotRegin").remove();//没有注册的弹层消失
                                            $(".ev-regPhoInput").val("");
                                            $(".ev-regEmaInput").val("");
                                        }
                                    })
                                    $('.ev-reginBtn').attr('unbind',0);
                                }else{//手机号码不存在
                                    t.registerSubmit(phone,type,password);
                                }
                                $(this).attr("unbind",'0');
                            };
                            t.loginAjax(t.path.isExit,param,callback);
                        }
                    }
                }
                //事件埋点
                comm.creatEvent({
                    triggerType:"注册",
                    keyword:"注册",
                    actionId:22,
                    locationId:1,
                    pushMessageId:TempCache.getItem("userId")
                });
            })
        },
        tabCli:function () {//顶部tab切换+一些点击效果
            var t = this;
            $(".inputBox").on("keyup propertyChange input",function () {
                $('.inputBox i').hide();
                 $(this).find("i").show();
            });
            $(".inputBox input").on("focus",function () {
                $('.inputBox i').hide();
                $(this).parents(".inputBox").find("i").show();
            });
            $(".inputBox .ev-closeIcon").on("click",function () {//清除按钮
                $(this).parents('.inputBox').find('i').hide();
                $(this).parents('.inputBox').find('input').val('');
            });
            $('.show_sign').on('click',function () {
                if($(this).hasClass("unshow_sign")){
                    $(this).removeClass('unshow_sign');
                    $(this).parents('.inputBox').find("input").attr("type",'text');
                }else{
                    $(this).addClass('unshow_sign');
                    $(this).parents('.inputBox').find("input").attr("type",'password');
                }
            });
            $(".inputBox input").on("blur",function () {
                // $(this).parents(".inputBox").find("i").hide();//不建议加上，可能会有引起很多问题
                $('.topShowError').hide();
            });
            function blurFn(dom, txt) {
                dom.off('blur').on('blur',function () {
                    if(dom.val()==''){
                        comm.topShowPageErrorNew(txt);
                    }
                });
            }
            // blurFn($('.ev-loginInput'),'请输入11位手机号');
            // blurFn($('.ev-logCode'),'请输入验证码');
            // blurFn($('.ev-logInp'),'请输入手机号/邮箱');
            // blurFn($('.ev-passInput'),'请输入密码');
            // blurFn($('.ev-regPhoInput'),'请输入11位手机号码');
            // blurFn($('.ev-regPassInput'),'请输入登录密码');
            // blurFn($('.ev-regEmaInput'),'请输入邮箱');
            // blurFn($('.ev-regEmaPasInput'),'请输入登录密码');
            // blurFn($('.ev-regCode'),'请输入验证码');
            $('.loginRegisterTab p').off('click').on('click',function () {
                $(this).addClass('active').siblings().removeClass('active');
                if($(this).attr("data-type")==1){//表示手机验证码登录
                    $(".accountLoginCont").hide();
                    $(".phoneLoginCont").show();
                }else{//帐号密码登录
                    $(".phoneLoginCont").hide();
                    $(".accountLoginCont").show();
                    clearInterval(t.param.timer);
                }
                $('.ev-loginBox input').val('');
                $('.ev-sendCode').show();
                $('.timeYZM').hide();
                t.checkSendCode();
            });
            $('.registerBtn span').on("click",function () {//点击注册按钮
                $('.ev-loginBox').hide();
                $('.ev-registerBox').show();
                $('.ev-loginBox input').val('');
                history.pushState({},"regist","#/regist");
                $(window).trigger("hashchange");
                $('title').text('注册');
                //alert("222"+TempCache.getItem("fromPageN"));
            });
            $('.ev_digHole').off('click').on('click',function () {//点击返回按钮
                if($('.al-indexHeaderItem h1').text()=='注册'){
                    $('.ev-loginBox').show();
                    $('.ev-registerBox').hide();
                    $('.ev-loginBox input').val('');
                    $('.ev-sendCode').show();
                    $('.timeYZM').hide();
                    clearInterval(t.param.timer);
                    $('title').text('登录');
                    history.back();
                }else{
                    $('.al-indexHeaderItem h1').text("注册");
                    $('.ev-regPhoInput').val('');
                    $('.ev-phoneReg').show();
                    $('.ev-emailReg').hide();
                    $(".ev-regSendCode").show();
                    $(".timeYZM").hide();
                    clearInterval(t.param.timer);
                }
                t.checkSendCode();
            });
            $('.ev-emailRegBtn').on("click",function () {
                $('.al-indexHeaderItem h1').text("邮箱注册");
                $('.ev-phoneReg').hide();
                $('.ev-emailReg').show();
                // $('.ev-regEmaInput').val();
                $('.ev-registerBox input').val('');
                $('.ev-sendCode').show();
                $('.timeYZM').hide();
                clearInterval(t.param.timer);
              //alert("333"+TempCache.getItem("fromPageN"));
            });
            $('.ev-questions').on('click',function () {//遇到问题点击
                comm.creatEvent({
                    triggerType:"认证",
                    triggerName:'认证-帮助',
                    keyword:'认证-帮助',
                    actionId:2514,
                    browType:$('.ev_authStepOne').is(":visible")?10001:10014
                });
                $('.al-authHelpBg').addClass('on');
            });
            $('.ev_helpClose').click(function(){
                $('.al-authHelpBg').removeClass('on');
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'继续体验',
                    actionId:41,
                    async:false
                });
            });
            $('.al-authHelpContact a').click(function(){
                comm.creatEvent({
                    triggerType:"认证",
                    triggerName:'认证-帮助电话呼叫',
                    keyword:'认证-帮助电话呼叫',
                    actionId:2515,
                    browType:$('.ev_authStepOne').is(":visible")?10001:10014
                });
            });
            $('.ev-goBack').on('click',function () {
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'继续体验',
                    actionId:41,
                    async:false
                });
                if(/message_index/.test(document.referrer)||
                    /html\/m\/(video|case|topic|doc)/g.test(document.referrer)||
                    /i_want.html/g.test(document.referrer)||
                    /friends_circle/g.test(document.referrer)||
                    /live-wrap/g.test(document.referrer)||
                    /_upload.html/g.test(document.referrer)||
                    /comment.html/g.test(document.referrer)
                ){
                    location.href = "/"
                }else{
                    history.go(-1);
                }
            });
            $('.ev-regPhoInput,.ev-codeInput,.ev-regPassInput,.ev-regEmaInput,.ev-regEmaPasInput').on('focus',function () {
                $('.agree').hide();
            });
            $('.ev-regPhoInput,.ev-codeInput,.ev-regPassInput,.ev-regEmaInput,.ev-regEmaPasInput').on('blur',function () {
                $('.agree').show();
            });
            $('.ev-passInput,.ev-regPassInput,ev-regEmaPasInput').on("keyup propertyChange input",function () {
                var _tt = this;
                setTimeout(function(){
                    $(_tt).val($(_tt).val().replace(/[\u4e00-\u9fa5]/g,''))
                },20);
            });
            $('.ev-logCode,.ev-regCode').on("keyup propertyChange input",function () {
                $(this).val($(this).val().replace(/[^\d]/g,''))
            });
        },
        popup:function (opt) {
            var t = this;
            var popHtml = '<section class="loginPopup ev-phoneNotRegin">'+
                '<aside class="loginPopupCont">'+
                '<div class="title"><i></i><span>'+opt.title+'</span></div>'+
                '<p class="registerBtn ev-registerBtn">'+opt.firstBtn+'</p>'+
                (opt.hasThreeBtn?'<p class="registerBtn ev-emailLogBtn">邮箱登录</p>':'')+
                '<p class="ev-againInput">重新输入</p>'+
                '</aside>'+
                '</section>';
            $('.ev-phoneNotRegin').remove();
            $('.al-mainInner').append(popHtml);
            $('.ev-registerBtn').off('click').on('click',function () {
                opt.firCallback&&opt.firCallback()
            });
            $('.ev-emailLogBtn').off('click').on('click',function () {
                opt.secCallback&&opt.secCallback()
            });
            $('.ev-againInput').off('click').on('click',function () {
                opt.agaCallback&&opt.agaCallback()
            })
        },
        loginSubmit:function(data) {
            var t = this;
            var result = data.responseObject;
            if (!result.responseStatus) {         // 登录失败
                $('.ev-loginBtn').attr("unbind",'0');
                comm.topShowPageErrorNew('密码错误，请重新输入');
                t.param.errorPass++;
                if(t.param.errorPass>=2){
                    comm.confirmBox({
                        title:'您已尝试多次，<br>是否忘记密码？',
                        cancel:'再试一次',
                        ensure:'找回密码',
                        cancelCallback:function () {
                            $('.ev-logInp').val('');
                            $('.ev-passInput').val('');
                            t.param.errorPass = 0;
                        },
                        ensureCallback:function () {
                            g_sps.jump(null,'/pages/passport/reset/reset_step1.html');
                            $('.ev-logInp').val('');
                            $('.ev-passInput').val('');
                        }
                    })
                }
            } else {
                var from=comm.getpara().from;
                var rep=customer.execute("updateWeixinUniteBind", null,null);
                if(rep.responseStatus){//绑定微信成功
                  if("subscribe"==from){
                    g_sps.jump(null,"/pages/personal/personal_myFollow.html");
                  }else if("message"==from){
                    g_sps.jump(null,"/pages/message/message_index.html");
                  }else{
                    user.getSessionInfo();
                    user.success("登录成功，即将返回来源页");       //  登录成功
                  }
                }else{//绑定失败
                  $('.ev-loginBtn').attr("unbind",'0');
                  customer.execute("logout",null);
                  popup(rep.responseMessage);
                  setTimeout(function(){
                    t.weixinLogin();
                  },2000);
                  return;
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
                  user.getSessionInfo();
                  user.success("登录成功，即将返回来源页");       //  登录成功
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
        keyCode:function(){
            var t = this;
            $('body').on("keyup",function () {
                if (event.keyCode == "13") {//keyCode=13是回车键
                    if($('.ev-registerBox').css('display')!='none'){//表示为注册
                        $('.ev-reginBtn').click();
                    }else{
                        $(".ev-loginBtn").click();
                    }
                }
            })
        },
        registerSubmit:function (account,type,psw,id,validCode){//注册提交
            var t=this;
            var param={account:account,type:type,passwd:psw,verificationId:id,validCode:validCode};
            var token = comm.getToken();
            var result =CommService.execute("/mcall/web/user/userRegist/?struts.token="+token,param);
            comm.loading.hide();
            $(this).removeClass('disabled');
            if(result && result.responseStatus){
              user.getSessionInfo();
              //alert("444"+TempCache.getItem('fromPageN'));
              if(comm.isWeiXin() ){
                var rep=comm.bindWeixin();//todo 上面是临时绑定，修改为绑定 sunhaibin
                if(!rep.responseStatus){//绑定微信失败
                  $('.ev-reginBtn').attr('unbind',0);
                  customer.execute("logout",null);
                  popup(rep.responseMessage);
                  setTimeout(function(){
                    t.weixinLogin();
                  },2000);
                }else{
                  TempCache.setItem('firstRegist',1);
                  user.registSuccess();
                }
              }else{
                TempCache.setItem('firstRegist',1);
                user.registSuccess();
              }
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
        },
        notRegin:function (statue) {//用来封装是否注册过的结构展示
            var t = this;
            if(statue){//表示没有注册

            }else{

            }
        },
        loginAjax:function (url,param,callback) {
            var params={};
            params.paramJson= $.toJSON(param);
            $.ajax({
                url:url,
                type : 'POST',
                data : params,
                dataType:"json",
                async: false,
                success:function(rep){
                    callback&&callback(rep)
                }
            })
        }
    };
    // user.privExecute({
    //     operateType:'auth',
    //     callback:function(){
            login.init();
            // http:'/pages/passport/auth/regist_tag.html'//选择标签
    //     }
    // });
});