var exception=function(obj,fn,cusRole){
    var unusual = {};
    unusual = {
        param:{
            account : '',
            type : 1,//帐号类型
            cId:'',//customerId
            errorPass:0,//忘记密码次数
            timer:'',
            codeVal:'',
            codeId:'',//发送验证码Id
        },
        path:{
            sendCode:M_CALL+"customer/unite/sendCode/",//发送短信验证码
            checkCode:M_CALL+"customer/unite/updateCode/",//校验发送短信验证码
            submit:M_CALL+"customer/verification/validSms/",//提交操作
            submitLogin:M_CALL+"passport/securitycheck",//提交按钮
            uploadPass:M_CALL+"customer/reset/password/updatePassword/",//重置密码
            uploadPassEmil:M_CALL+"customer/unite/update/",//邮箱重置密码
            passPhoneCode:M_CALL+"customer/reset/password/sendPasswordMobile/",//重置密码手机号发送验证码
            cheRestPhoCode:M_CALL+"customer/verification/validSms/",//校验重置密码中手机号的验证码
            passEmilCode:M_CALL+"customer/reset/password/sendPasswordEmail/",//邮箱验证码
            cheRestemilCode:M_CALL+'customer/reset/password/checkEmailCode/',//验证邮箱验证码
            isMatch:M_CALL+"customer/unite/getCustomerMatch/",//判断是否帐号匹配
            creatMerge:M_CALL+'customer/merge/v3/create/',//请求合并接口
            loginOut:M_CALL+'web/user/logout/',//退出登录
            isLogin:M_CALL+'customer/unite/checkLoginAccount/',//校验帐号是否可登录
        },
        valid:{
            // phone : /^(127|13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/,
            phone : /^1\d{10}$/,
            email : /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
            pswR : /^[A-Za-z0-9`~!@#$%^&*()-_=+{};:,.<>/?\|'"]{6,20}$/
        },
        init:function (param,fn,cusRole) {//cusRole代表身份1是医生 2是护士
            var t = this;
            //相同账号检测埋点
            setTimeout(function () {
                if (g_sps) {
                    g_sps.createBrowse({pageId: 486,param:{ userRoleType: cusRole}});
                }
            }, 2000);
            t.param.account = param.account;
            t.param.cId = param.customerId;
            t.param.type = param.accountType;
            $('.un-userName').text($('#fullName').val());
            $('.ev_authStepOne,.ev-headerOne').hide();
            $('.ev_authStepOne').hide();
            if(t.param.type=='1'){
                $('.un-phoNum').text(t.param.account);
                $('.loginRegisterTab[data-type=2]').attr('notCli',0);
                $('.ev-fogetPassInp').attr({'maxlength':11,'placeholder':'请输入手机号'});
                $('.ev-findPassCodeHead').find('li').eq(1).text('验证手机号');
            }else{
                $('.un-phoNum').text(t.param.account);
                $('.loginRegisterTab p[data-type=1]').attr('notCli',1);
                $('.ev-fogetPassInp').attr({'maxlength':50,'placeholder':'请输入邮箱'});
                $('.ev-findPassCodeHead').find('li').eq(1).text('验证邮箱');
            }
            t.jumpFn(fn);
            t.checkActive();
            t.backFn();
            t.checkLogin();
        },
        checkActive:function () {//此方法用来校验是否可以被激活
            var t = this;
            var codePhone = false,codeNum = false,passPhone = false,passNum = false;
            $('.ev-loginInput').off().on('keyup change input cut paste drop',function () {
                // $(this).val($(this).val().replace(/[^\d]/g,''));
                if(t.valid.phone.test($('.ev-loginInput').val())){codePhone = true}else{codePhone = false}
                if($('.ev-codeInput').val().length>0){codeNum = true;}else{codeNum = false;}
                if(codePhone&&codeNum){
                    $('.ev-loginBtn').addClasses('active');
                }else{
                    $('.ev-loginBtn').removeClass('active');}
            });
            $('.ev-codeInput').off().on('keyup change input cut paste drop',function () {
                // $(this).val($(this).val().replace(/[^\d]/g,''));
                if(t.valid.phone.test($('.ev-loginInput').val())){codePhone = true}else{codePhone = false}
                if($('.ev-codeInput').val().length>0){codeNum = true;}else{codeNum = false;}
                if(codePhone&&codeNum){
                    $('.ev-loginBtn').addClass('active');
                }else{
                    $('.ev-loginBtn').removeClass('active');
                }
            });
            $('.ev-logInp').off().on('keyup change input cut paste drop',function () {
                // $(this).val($(this).val().replace(/[\u4e00-\u9fa5]/g,''));
                // $(this).val($(this).val().replace(/ /g,''));
                if(t.param.type=='1'){//如果是手机号
                    $('.ev-logInp').attr('maxlength',11);
                    if(t.valid.phone.test($('.ev-logInp').val())){passPhone = true}else{passPhone = false}
                }else{
                    if(t.valid.email.test($('.ev-logInp').val())){passPhone = true}else{passPhone = false}
                }
                if($('.ev-passInput').val().length>=6&&$('.ev-passInput').val().length<=20){passNum = true;}else{passNum = false;}
                if(passPhone&&passNum){
                    $('.ev-loginPassBtn').addClass('active');
                }else{
                    $('.ev-loginPassBtn').removeClass('active');
                }
            });
            $('.ev-passInput').off().on('keyup change input cut paste drop',function () {
                // $(this).val($(this).val().replace(/[\u4e00-\u9fa5]/g,''));
                // $(this).val($(this).val().replace(/ /g,''));
                if(t.param.type=='1'){//如果是手机号
                    if(t.valid.phone.test($('.ev-logInp').val())){passPhone = true}else{passPhone = false}
                }else{
                    if(t.valid.email.test($('.ev-logInp').val())){passPhone = true}else{passPhone = false}
                }
                if($('.ev-passInput').val().length>=6&&$('.ev-passInput').val().length<=20){passNum = true;}else{passNum = false;}
                if(passPhone&&passNum){
                    $('.ev-loginPassBtn').addClass('active');
                }else{
                    $('.ev-loginPassBtn').removeClass('active');
                }
            });
        },
        jumpFn:function (fn) {//一些页面切换方法
            var t = this;
            $('.ev-useOld').off('click').on('click',function () {//点击原帐号登录
                $('.un-sameAccount,.ev-sameAccountHead').hide();
                $('.ev-loginBox,.ev-loginBoxHead').show();
                if(t.param.type=='1'){//表示是手机号
                    $('.ev-logInp').attr('placeholder','请输入手机号');
                    $('.accountLoginCont').hide();
                    $('.loginRegisterTab p').removeClass('active');
                    $('.loginRegisterTab p[data-type=1]').addClass('active');
                    $('.phoneLoginCont').show();
                    $('.ev-sendCode').off('click').on('click',function () {
                        var _t = $(this);
                        var phoneNum = $('.ev-loginInput').val();
                        if(phoneNum==''){
                            comm.topShowPageErrorNewAuth("请输入11位的正确手机号");
                        }else{
                            if(t.valid.phone.test(phoneNum)){
                                if(t.isMatch(phoneNum)){
                                    if(_t.attr('data-unCli')!=1){
                                        _t.attr('data-unCli',1);
                                        t.sendCode(_t,phoneNum,t.param.cId);//发送短信
                                    }
                                }else{
                                    comm.topShowPageErrorNewAuth("请按照提示输入正确帐号");
                                }
                            }else{
                                comm.topShowPageErrorNewAuth("请按照提示输入正确帐号");
                            }
                        }

                    })
                }else{
                    $('.ev-logInp').attr('placeholder','请输入邮箱');
                    $('.loginRegisterTab[data-type=1]').attr('notCli',1);
                    $('.phoneLoginCont').hide();
                    $('.loginRegisterTab p').removeClass('active');
                    $('.loginRegisterTab p[data-type=2]').addClass('active');
                    $('.accountLoginCont').show();
                }
            });
            $('.un-useNew').off('click').on('click',function () {
                fn&&fn();
            });
            $('.ev-noCode').off('click').on('click',function () {
                $('.ev-codePopup').show();
                $('.popBottom').animate({bottom:'0px'},200)
            });
            $('.cancle').off('click').on('click',function () {
                $('.ev-codePopup').hide();
                $('.popBottom').animate({bottom:'-578px'},200)
            });
            //点击帮助Begin
            $('.ev-findAccount').off('click').on('click',function () {//点击找回帐号
                $('.al-authHelpBg').addClass('on');
            });
            $('.ev_helpClose').click(function(){
                $('.al-authHelpBg').removeClass('on');
                $('.ev-codePopup').hide();
                $('.popBottom').css('bottom','-578px');
            });
            //复制
            var clipboard = new ClipboardJS('.ev-copy');
            clipboard.on('success', function() {
                popup('复制成功')
            });
            clipboard.on('error', function() {
                popup('复制失败')
            });
            //复制end
            //点击帮助end
            //顶部导航点击begin
            $('.loginRegisterTab p').off('click').on('click',function (e) {
                if($(this).attr('data-type')==1){//1表示是验证码登录
                    if($(this).attr('notCli')!=1){
                        $('.accountLoginCont').hide();
                        $('.loginRegisterTab p').removeClass('active');
                        $('.loginRegisterTab p[data-type=1]').addClass('active');
                        $('.phoneLoginCont').show();
                    }
                }else{
                    $('.phoneLoginCont').hide();
                    $('.loginRegisterTab p').removeClass('active');
                    $('.loginRegisterTab p[data-type=2]').addClass('active');
                    $('.accountLoginCont').show();
                }

            });
            //顶部导航点击end
            $('.ev-IKnow').off('click').on("click",function () {//点击我知道了，调用帐号合并接口，请求成功后返回上一页
                t.backResource();
            });
            t.voiceCode();//语音验证码
            t.fogetPass();//忘记密码发送验证码
        },
        //语音验证码操作
        voiceCode:function () {
            var t = this;
            $('.voiceCode').off('click').on('click',function () {//点击发送语音验证码
                if(t.valid.phone.test($('.ev-loginInput').val())){
                    if(t.isMatch($('.ev-loginInput').val())){
                        comm.confirmBox({
                            title:'您将会接听到含有语音验证码的电话',
                            cancel:'取消',
                            ensure:'验证',
                            ensureCallback:function () {
                                t.voiceSendCode(t.param.account);//发送语音验证码
                                $('.ev-codePopup').hide();
                                $('.popBottom').animate({bottom:'-578px'})
                            },
                            cancelCallback:function () {
                                $('.ev-codePopup').hide();
                                $('.popBottom').css('bottom','-578px');
                            }
                        })
                    }else{
                        popup('请按照提示输入正确帐号');
                    }
                }else{
                    popup('请输入11位的正确手机号');
                }
            });
        },
        //点击发送语音验证码
        voiceSendCode:function () {
            var t = this;
            var params = {
                siteId:2,
                typeId:5,
                account:$('.ev-loginInput').val(),
                codeLength:4,
                customerId:t.param.cId,
                isVoice:1
            };
            var timestamp = new Date().getTime();
            params = $.extend(params,{
                timestamp:timestamp,
                ALLINACCESSTOKEN:allinaccesstoken(timestamp,$('.ev-loginInput').val())
            });
            callbacks = function (data) {
                if(data&&data.responseObject&&data.responseObject.responseStatus){
                    popup("验证码已发送");
                    t.param.codeVal = $('.ev-restPassOne').val();
                    t.voiceFn(data.responseObject.responsePk);
                }else{
                    if(data&&data.responseObject.responseCode=='ERR_001'){
                        popup('您获取验证码过于频繁，请明天再试');
                    }else if( data && data.responseObject.responseMessage){
                        popup(data.responseObject.responseMessage);
                    }else{
                        popup("发送失败！");
                    }
                }
                $('.ev-voiceSendCode').attr('unBind',0);
            };
            t.loginAjax(t.path.sendCode,params,callbacks)//发送短信验证码的接口
        },
        //语音验证码，在发送验证码完成后转入的操作
        voiceFn:function (id) {
            var t = this;
            $('.ev-loginBox,.ev-loginBoxHead').hide();
            $('.ev-voiceCode,.ev-voiceCodeHead').show();
            $('.ev-voiceSendCode').hide();
            $('.ev-voiveCode').show();
            var time = 60;
            clearInterval(t.param.timer);
            t.param.timer = setInterval(function () {
                time--;
                $('.codeTime span').text(time);
                if(time<0){
                    $(this).attr('unBind',0);
                    $('.ev-voiceSendCode').show();
                    $('.ev-voiveCode').hide();
                    $('.ev-voiveCode span').text(60);
                    clearInterval(t.param.timer);
                }
            },1000);
            $('.ev-voiceSendCode').off("click").on('click',function () {
                if($(this).attr('unBind')!=1){
                    $(this).attr('unBind',1);
                    t.voiceSendCode();//发送语音验证码
                }
            });
            t.checkCode(id);
        },
        //语音验证码，输入四位后进行校验
        checkCode:function (id) {
            var t = this;
            $('.ev-inpVoiceCode').off('input').on('input',function () {//点击语音验证码
                if($(this).val().length==4){//证明输入完成,在此处判断验证码的正确性
                    $(this).blur();
                    param={
                        typeId:5,
                        validCode:$(this).val(),
                        account:$('.ev-loginInput').val(),
                        id:id,
                        operateType:7
                    };
                    callback=function (data) {
                        if(data&&data.responseObject&&data.responseObject.responseStatus){//验证码正确
                            //登录成功，此处调用接口，帐号合并完成,显示提示，点击知道了返回上一步
                            t.creatMerge($('.ev-loginInput').val());
                            t.clearTimer($('.ev-voiceSendCode'),$('.ev-voiveCode'),$('.ev-inpVoiceCode'));
                            $('.ev-voiceCode,.ev-voiceCodeHead').hide();
                            $('.mergeTip,.mergeTipHead').show();
                        }else{
                            popup("验证码错误");
                            $(this).val('');//将验证码页面置空
                        }
                    };
                    t.loginAjax(t.path.checkCode,param,callback);
                }
            });
        },
        //忘记密码
        fogetPass:function () {
            var t = this;
            //忘记密码按钮点击
            $('.ev-fogetPass').off('click').on('click',function () {
                $('.ev-loginBox,.ev-loginBoxHead').hide();
                $('.un-findPass,.ev-findPassHead').show();
            });
            //忘记密码帐号输入
            $('.ev-fogetPassInp').on('keyup change input cut paste drop',function () {
                // $(this).val($(this).val().replace(/[\u4e00-\u9fa5]/g,''));
                // $(this).val($(this).val().replace(/ /g,''));
                if(t.param.type=='1'){
                    // $(this).val($(this).val().replace(/[^\d]/g,''));
                    if(t.valid.phone.test($(this).val())){
                        $(this).parents('.inputBox').next('button').addClass('active');
                    }else{
                        $(this).parents('.inputBox').next('button').removeClass('active');
                    }
                }else{
                    if(t.valid.email.test($(this).val())){
                        $(this).parents('.inputBox').next('button').addClass('active');
                    }else{
                        $(this).parents('.inputBox').next('button').removeClass('active');
                    }
                }
            });
            //忘记密码帐号提交按钮点击
            $('.ev-fogetSendCode').off('click').on('click',function () {
                if($(this).hasClass('active')&&$(this).attr('unbind')!=1){
                    $(this).attr('unbind',1);
                    if(t.isMatch($('.ev-fogetPassInp').val())){//表示帐号输入正确
                        t.restSendCode();
                    }else{
                        comm.topShowPageErrorNewAuth("请按照提示输入正确帐号");
                        $(this).attr('unbind',0);
                    }
                }
            });
            //忘记密码重新发送按钮
            $('.ev-passSendCode').off('click').on('click',function () {
                if($(this).attr('unCli')!=1){
                    $(this).attr('unCli',1);
                    $('.ev-passSendCode').hide();
                    $('.ev-passCode').show();
                    var time = 60;
                    clearInterval(t.param.timer);
                    t.param.timer = setInterval(function () {
                        time--;
                        $('.ev-passCode span').text(time);
                        if(time<0){
                            $('.ev-passSendCode').show();
                            $('.ev-passCode').hide();
                            $('.ev-passCode span').text(60);
                            $(this).attr('unCli',0);
                            clearInterval(t.param.timer);
                        }
                    },1000);
                    t.restSendCode();
                }
            });
        },
        //重置密码发送验证码
        restSendCode:function () {
            var t = this;
            var path = t.path.passEmilCode;
            var txt = '超出邮件可发送数量';
            var param={
                resetSite:2,
                email:$('.ev-fogetPassInp').val(),
                applySource:2,
                isNew:1,
                codeLength:4
            };
           if (t.param.type == '1'){
               var timestamp = new Date().getTime();
               path = t.path.passPhoneCode;
               param={
                   resetSite:2,
                   siteId:2,
                   account:$('.ev-fogetPassInp').val(),
                   codeLength:4,
                   timestamp:timestamp,
                   ALLINACCESSTOKEN:allinaccesstoken(timestamp,t.param.account)
               };
               txt = '您获取验证码过于频繁，<br/>请于24小时后再试。'
           }
            callback=function (data) {
                if(data&&data.responseObject&&data.responseObject.responseStatus){//发送验证码成功
                    t.param.codeId = data.responseObject.responsePk;
                    t.checkRestCode(data.responseObject.responsePk);
                }else{
                    popup(txt);
                }
                $('.ev-passSendCode').attr('unbind',0);
                $('.ev-fogetSendCode').attr('unbind',0);//将重置密码发送验证码按钮置为可以点击
            };
            t.loginAjax(path,param,callback);
        },
        //校验重置密码的验证码
        checkRestCode:function (id) {
            var t = this;
            $('.un-findPass,.ev-findPassHead').hide();
            $('.ev-findPassCode,.ev-findPassCodeHead').show();
            $('.ev-passSendCode').hide();
            $('.ev-passCode').show();
            var time = 60;
            clearInterval(t.param.timer);
            t.param.timer = setInterval(function () {
                time--;
                $('.codeTime span').text(time);
                if(time<0){
                    $('.ev-passSendCode').show();
                    $('.ev-passCode').hide();
                    $('.ev-passCode span').text(60);
                    $(this).attr('unCli',0);
                    clearInterval(t.param.timer);
                }
            },1000);
            $('.ev-inpPassCode').off('input').on('input',function () {//点击语音验证码
                if($(this).val().length==4){//证明输入完成,在此处判断验证码的正确性
                    $(this).blur();
                    var path = '',param={};
                    if(t.param.type==1){//表示是手机号
                        path = t.path.cheRestPhoCode;
                        param={
                            validCode:$(this).val(),
                            type:"customer_reset_password",
                            flag:1,
                            validCodeId:id
                        };
                    }else{
                        path = t.path.cheRestemilCode;
                        param={
                            validCode:$(this).val(),
                            itemId:id
                        };
                    }
                    callback=function (data) {
                        if(data&&data.responseObject&&data.responseObject.responseStatus){//验证码正确
                            //验证码正确进入重置密码
                            t.param.codeVal = $('.ev-inpPassCode').val();
                            t.clearTimer($('.ev-passSendCode'),$('.ev-passCode'),$('.ev-inpPassCode'));
                            t.fogetPass();
                            $('.ev-findPassCode,.ev-findPassCodeHead').hide();
                            $('.un-resetting,.un-resettingHead').show();
                        }else{
                            popup("验证码错误");
                            $(this).val('');//将验证码页面置空
                        }
                    };
                    t.loginAjax(path,param,callback);
                }
            });
            //重置密码input输入
            $('.ev-restPassOne,.ev-restPassTwo').on('keyup input change',function () {
                // $(this).val($(this).val().replace(/[\u4e00-\u9fa5]/g,''));
                // $(this).val($(this).val().replace(/ /g,''));
                if($('.ev-restPassOne').val().length>=6&&$('.ev-restPassOne').val().length<=20&&$('.ev-restPassTwo').val().length>=6&&$('.ev-restPassTwo').val().length<=20&&pswR.test($('.ev-restPassTwo').val())&&pswR.test($('.ev-restPassOne').val())){
                    $('.ev-restBtn').addClass('active');
                }else{
                    $('.ev-restBtn').removeClass('active');
                }
            });
            //点击重置按钮
            $('.ev-restBtn').off('click').on('click',function () {//点击重置按钮成功后
                if($(this).attr('unbind')!=1&&$(this).hasClass('active')){
                    $(this).attr('unbind',1);
                    if(!t.valid.pswR.test($('.ev-restPassOne').val())||!t.valid.pswR.test($('.ev-restPassTwo').val())){
                        comm.topShowPageErrorNew("字母、数字或符号的组合");
                        $('.ev-restBtn').attr("unbind",'0');
                    }else if($('.ev-restPassOne').val()!=$('.ev-restPassTwo').val()){
                        comm.topShowPageErrorNewAuth("两次密码不一致");
                        $('.ev-restBtn').attr("unbind",'0');
                    }else{//重置成功后跳转到登录页！
                        var path = '';
                        if(t.param.type==1){
                            path = t.path.uploadPass;
                            param={
                                itemId:t.param.codeId,
                                password:$('.ev-restPassOne').val(),
                                customerId:t.param.cId,
                                validCode:t.param.codeVal,
                            };
                        }else{
                            path = t.path.uploadPassEmil;
                            param={
                                account:$('.ev-fogetPassInp').val(),
                                passwd:$('.ev-restPassOne').val(),
                                customerId:t.param.cId,
                            };
                        }
                        function callback(data){
                            if(data&&data.responseObject&&data.responseObject.responseStatus){//验证码正确
                                popupFn('密码修改成功',3000, function(){
                                    $('.ev-restBtn').attr("unbind",'0');
                                    $('.un-resetting,.un-resettingHead').hide();
                                    $('.ev-loginBox,.ev-loginBoxHead').show();
                                    if(t.param.type=='1'){
                                        $('.ev-logInp').attr('placeholder','请输入手机号');
                                    }else{
                                        $('.ev-logInp').attr('placeholder','请输入邮箱');
                                    }
                                    $('.ev-logInp').val($('.ev-fogetPassInp').val());
                                    $('.ev-loginInput').val($('.ev-fogetPassInp').val());
                                    $('.loginRegisterTab[data-type=1]').attr('notCli',1);
                                    $('.phoneLoginCont').hide();
                                    $('.loginRegisterTab p').removeClass('active');
                                    $('.loginRegisterTab p[data-type=2]').addClass('active');
                                    $('.accountLoginCont').show();
                                    $('.ev-loginBoxHead').attr('isFromPass',1)
                                });
                            }else{
                                popup('密码修改失败');
                                $('.ev-restBtn').attr("unbind",'0');
                            }
                        }
                        t.loginAjax(path,param,callback);
                    }
                }
            })
        },
        //发送验证码
        sendCode:function (dom,account,cId,type) {
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
                    // t.param.codeId = data.responseObject.responsePK;
                    t.param.codeId = data.responseObject.responsePk;
                    t.param.codeVal = $('.ev-restPassOne').val();
                    var time = 60;
                    clearInterval(t.param.timer);
                    t.param.timer = setInterval(function () {
                        time--;
                        if(dom){
                            dom.hide();
                            dom.next('.timeYZM').show().text(time+'s');
                            dom.attr('data-uncli',0);
                        }
                        if(time<0){
                            if(dom){
                                dom.show();
                                dom.next('.timeYZM').hide().text(60+'s');
                                dom.attr('data-uncli',0);
                            }
                            clearInterval(t.param.timer);
                            t.checkLogin(data.responseObject.responsePk);
                        }
                    },1000);
                    t.checkLogin(data.responseObject.responsePk);//点击立即进入按钮
                }else{
                    if(data&&data.responseObject.responseCode=='ERR_001'){
                        popup('您获取验证码过于频繁，请明天再试');
                    }else if( data && data.responseObject.responseMessage){
                        popup(data.responseObject.responseMessage);
                    }else{
                        popup("发送失败！");
                    }
                    if(dom){
                        dom.show();
                        dom.next('.timeYZM').hide().text(60+'s');
                        dom.attr('data-uncli',0);
                    }
                }
            };
            t.loginAjax(t.path.sendCode,params,callbacks)//发送短信验证码的接口
        },
        //提交登录信息
        checkLogin:function (id) {
            var t = this;
            $(".ev-loginBtn,.ev-loginPassBtn").off("click").on("click",function (e) {//登录校验登录信息
                if($(this).attr('unbind')!=1&&$(this).hasClass('active')){
                    // t.loginOut();//退出登录
                    $(this).attr("unbind",'1');
                    e.stopPropagation();
                    if($('.loginRegisterTab p[class=active]').attr("data-type")==1){//表示是快捷登录
                        var validCode = $(".ev-codeInput").val(),account = $('.ev-loginInput').val();
                        var phone = $(this).parents('.al-login').find('.ev-loginInput').val(),code = $(this).parents('.al-login').find('.ev-codeInput').val();
                        if(!t.isMatch(phone)){//用户名填写错误
                            comm.topShowPageErrorNewAuth("请按照提示输入正确帐号");
                            $('.ev-loginBtn').attr("unbind",'0');
                        }else if(code=='') {
                            comm.topShowPageErrorNewAuth("请输入验证码");
                            $('.ev-loginBtn').attr("unbind", '0');
                        }else{
                            param={
                                typeId:3,
                                validCode:validCode,
                                account:account,
                                id:id,
                                operateType:7
                            };
                            callback=function (data) {
                                if(data&&data.responseObject&&data.responseObject.responseStatus){//验证码正确
                                    t.loginSubmit(data,account);
                                }else{
                                    popupFn(data.responseObject.responseMessage,3000,function(){
                                        $(".ev-codeInput").val("");
                                        $('.timeYZM').hide();
                                        $('.ev-sendCode').show();
                                        clearInterval(t.param.timer);
                                    });
                                    $('.ev-loginBtn').attr("unbind",'0');
                                }
                            };
                            t.loginAjax(t.path.checkCode,param,callback)
                        }
                    }else{//表示帐号登录
                        var phone = $(this).parents('.al-login').find('.ev-logInp').val(),password = $(this).parents('.al-login').find('.ev-passInput').val();
                        if(!t.isMatch(phone)){//用户名为空
                            comm.topShowPageErrorNewAuth("请按照提示输入正确帐号");
                            $('.ev-loginPassBtn').attr("unbind",'0');
                        }else if(password==''){
                            comm.topShowPageErrorNewAuth("请输入密码");
                            $('.ev-loginPassBtn').attr("unbind",'0');
                        }else if(password.length<6||password.length>20){
                            comm.topShowPageErrorNewAuth("密码长度为6-20位");
                            $('.ev-loginPassBtn').attr("unbind",'0');
                        }else if(!t.valid.pswR.test(password)){
                            comm.topShowPageErrorNewAuth("字母、数字或符号的组合");
                            $('.ev-loginPassBtn').attr("unbind",'0');
                        }else{
                            $('.topShowError').hide();
                            if(t.isLogin(2,phone,password)){
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
                                        t.loginSubmit(data,phone);
                                    },
                                    error:function (XMLHttpRequest, textStatus, errorThrown) {
                                        popup(textStatus + "   " +errorThrown);
                                    }
                                });
                            }
                        }
                    }

                }
            });
        },
        isLogin:function (opType,account,word) {
            var t = this,isLoginFlag=false;
            var param = {
                customerId:t.param.cId,
                opType:opType,
            };
            if(t.param.type==1){
                param.mobile=account;
            }else{
                param.email = account;
            }
            if(opType==1){
                param.validCode =word;
            }else{
                param.passwd =word;
            }
            callback=function (data) {
                if(data&&data.responseObject&&data.responseObject.responseData.loginFlag){
                    isLoginFlag = true;
                    t.creatMerge(account);
                    t.loginOut();//退出登录
                }else{
                    isLoginFlag = false;
                    popup(data&&data.responseObject.responseMessage);
                    $(".ev-loginBtn,.ev-loginPassBtn").attr('unbind',0)
                }
            };
            t.loginAjax(t.path.isLogin,param,callback,'',true);
            return isLoginFlag;
        },
        loginSubmit:function(data,account) {
            var t = this;
            var result = data.responseObject;
            if (!result.responseStatus) {         // 登录失败
                comm.topShowPageErrorNewAuth('密码错误');
                $('.ev-loginBtn').attr("unbind",'0');
                $('.ev-loginPassBtn').attr("unbind",'0');
                t.checkLogin();
            } else {
                if (comm.isWeiXin()) { //绑定微信操作
                } else {
                    comm.bindWeixin();//绑定微信
                }
                // 此次登录是否需要认证
                var needAuth = TempCache.getItem("needAuth");
                var needConferenceAuth = TempCache.getItem("needConferenceAuth");
                var auth = user.getRenZhengInfo();
                if (needConferenceAuth != undefined && needConferenceAuth == "true") {
                    TempCache.removeItem("needConferenceAuth");
                    user.needConferenceAuthHandler();
                } else {
                    if (needAuth != undefined && needAuth != null) {
                        TempCache.removeItem("needAuth");
                    }
                    if (needAuth != undefined && needAuth == "true") {
                        if (auth == null || $.isEmptyObject(auth)) {
                            comm.redirect("/pages/passport/auth/auth.html");
                        } else {
                            user.getSessionInfo();
                            t.clearTimer($('.ev-voiceSendCode'),$('.ev-voiveCode'),$('.ev-inpVoiceCode'));
                            $('.ev-loginBoxHead,.ev-loginBox').hide();
                            $('.mergeTip,.mergeTipHead').show();
                        }
                    } else {
                        user.getSessionInfo();
                        t.clearTimer($('.ev-voiceSendCode'),$('.ev-voiveCode'),$('.ev-inpVoiceCode'));
                        $('.ev-loginBoxHead,.ev-loginBox').hide();
                        $('.mergeTip,.mergeTipHead').show();
                    }
                }
            }
        },
        //判断输入帐号是否一致
        isMatch:function (account) {
            var t = this;
            var isMatch = false;
            var param = {};
            if(t.param.type=='1'){
                param={
                    customerId:t.param.cId,
                    mobile:account,
                };
            }else{
                param={
                    customerId:t.param.cId,
                    email:account
                };
            }
            callback = function (data) {
                if(data&&data.responseObject&&data.responseObject.responseStatus&&data.responseObject.responseData){
                    if(data.responseObject.responseData.isMatch==1){
                        isMatch = true;
                    }else{
                        isMatch = false;
                    }
                }else{
                    isMatch = false;
                }
            };
            t.loginAjax(t.path.isMatch,param,callback,'get',true);
            return isMatch;
        },
        //退出登录
        loginOut:function () {
            var param = {};
            var callback = function (data) {
                if (data&&data.responseObject&&data.responseObject.responseStatus){
                    TempCache.clear();
                }
            };
            this.loginAjax(this.path.loginOut,param,callback,'',true);
        },
        //合并请求
        creatMerge:function (account) {//todo update by lichunhui 20180916
            var params = {
                mainCustomerId:localStorage.getItem('userId'),
                mergeCustomerId:this.param.cId,
                mergeState:1,
                mergeType:1,
                resourceType:1,
                isValid:1,
                visitSiteId:2,
            };
            var callbacks = function (data) {
                if(data&&data.responseObject&&data.responseObject.responseStatus){

                }
            };
            this.loginAjax(this.path.creatMerge,params,callbacks,'',true);
        },
        //清除定时器方法
        clearTimer:function (cliDom,timeDom,inpDom) {
            clearInterval(this.param.timer);
            cliDom.show();
            timeDom.hide();
            timeDom.find('span').text(60);
            inpDom.val('');
        },
        //返回上一步检测
        backFn:function () {
            var t = this;
            $(".ev_exceptionBackBtn").off('click').on('click',function () {
                var dom = $(this).parents('.al-idSureHead');
                clearInterval(t.param.timer);
                $('.ev-sendCode,.ev-voiceSendCode,.ev-passSendCode').show();
                $('.timeYZM,.codeTime').hide().find('span').text('60');
                if(dom.hasClass('ev-sameAccountHead')){
                    $('.ev-sameAccountHead,.un-sameAccount,.ev-exceptionCon').hide();
                    $('.ev-headerOne,.ev_authStepOne').show();
                    if(comm.getpara().reAuth){//申请认证变更的情况，返回按钮第一步显示成取消变更
                        $('.ev_skipAuth').show().text("取消变更").siblings('img').hide();
                    }else{
                        // $('.ev_skipAuth').show().text("暂不认证").siblings('img').hide();
                    }
                    $("body").css("background-color","#fff");//增加一个一本信息页面背景色修改
                }else if(dom.hasClass('ev-loginBoxHead')){
                    $('.ev-loginBoxHead,.ev-loginBox').hide();
                    if(dom.attr('isFromPass')==1){
                        dom.attr('isFromPass',0);
                        $('.ev-resettingHead,.ev-resetting').show();
                    }else{
                        $('.ev-sameAccountHead,.un-sameAccount').show();
                    }
                }else if(dom.hasClass('ev-findPassHead')){
                    $('.ev-findPassHead,.un-findPass').hide();
                    $('.ev-loginBoxHead,.ev-loginBox').show();
                }else if(dom.hasClass('ev-findPassCodeHead')){
                    $('.ev-findPassCodeHead,.ev-findPassCode').hide();
                    $('.ev-findPassHead,.un-findPass').show();
                }else if(dom.hasClass('un-resettingHead')){
                    $('.un-resettingHead,.un-resetting').hide();
                    $('.ev-findPassHead,.un-findPass').show();
                }else if(dom.hasClass('ev-voiceCodeHead')){
                    $('.ev-voiceCodeHead,.ev-voiceCode').hide();
                    $('.ev-loginBoxHead,.ev-loginBox').show();
                }else if(dom.hasClass('mergeTipHead')){
                    t.backResource();
                }
            })
        },
        backResource:function () {
            var fromPage = TempCache.getItem('fromPage') || TempCache.getItem('fromPageN');
            if (/message_main/.test(fromPage) ||
                /html\/m\/(video|case|topic|doc)/g.test(fromPage) ||
                /i_want.html/g.test(fromPage) ||
                /friends_circle/g.test(fromPage) ||
                /_upload.html/g.test(fromPage)
            ) {
                g_sps.jump(null, "/");
            } else if (/live-wrap/g.test(fromPage)) {
                history.go(-2);
            } else if (/login.html/.test(document.referrer) || /register.html/.test(document.referrer)) {//注册或登录之后直接认证，返回fromPage页，或上一页
                if (fromPage) {
                    g_sps.jump(null, fromPage);
                } else {
                    history.back();
                }
            } else {
                history.back();
            }
        },
        loginAjax:function (url,param,callback,type,async) {
            var params={};
            params.paramJson= $.toJSON(param);
            $.ajax({
                url:url,
                type : type?type:'POST',
                data : params,
                dataType:"json",
                async: async?false:true,
                success:function(rep){
                    callback&&callback(rep)
                }
            })
        },
    };
    // unusual.init({account:'zhd@h.com',customerId:'1506065952621',accountType:'2'});
    unusual.init(obj,fn,cusRole);
};