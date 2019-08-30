/*
* 认证异常流程
*
* */
var exception = function(options){
    var controller = {};
    controller = {
        config:{
            numberOfMessageInOneDay: 3
        },
        path: {
            sendFindPasswdEmail: PC_CALL+"customer/reset/password/sendPasswordEmail/",   // 发送找回密码邮件
            sendFindPasswdMobile: PC_CALL+"customer/reset/password/sendPasswordMobile/", // 发送找回密码手机验证码
            updatePasswd: PC_CALL+"customer/reset/password/updatePassword/",			 // 更新密码
            getCount: PC_CALL+"customer/reset/password/getCount/",					     // 获取发送过的短信次数
            validSMSMobile: PC_CALL+"customer/verification/validSms/",                   // 手机验证码校验
            validSMSEmail: PC_CALL+"customer/verification/validEmailCode/",              // 邮箱验证码校验
            sendVerification:PC_CALL+'customer/verification/sendSms/',                   // 发送验证码（手机登录）
            matchAccount:PC_CALL+"customer/unite/getCustomerMatch/",                     // 判断customerId与mobile、email是否匹配
            login: PC_CALL+"passport/securitycheck",                                     // 账号登录
            getCustomerUnite: PC_CALL + "customer/unite/getCustomerUnite/",              // 获取当前登录用户信息
            mergeCreate: PC_CALL + 'customer/merge/v3/create/',                          // 账号合并请求
            out: PC_CALL + "customer/unite/logout/",                                     // 退出登录
            checkLoginAccount: PC_CALL+"customer/unite/checkLoginAccount/"               // 校验账号是否可登陆
        },
        init:function(){
            this.passwdReg = /^[A-Za-z0-9`~!@#$%^&*()-_=+{};:,.<>/?\|'"]+$/g;
            this.options = options;
            if(this.options.sameAccount.accountType==1){//手机
                this.exp = allinMobileExp;
            }else{
                this.exp = allinEmailExp;
            }
            registName = this.options.sameAccount.account;
            this.name = $("#fullName").val();
            this.cId  = localStorage.getItem('userId');
            this.customerId = this.options.sameAccount.customerId;//老账号用户ID
            $(".ev_exception").show();
            $(".ev_expUserName").text(this.name);
            this.authContinue();
            this.exceptionLogin();
            this.changeTab();
            if(this.options.sameAccount.accountType==1){//手机
                $(".ev_expAccount").attr("placeholder","请输入手机号");
                $(".ev_findAccountPwd").attr("placeholder","请输入手机号");
                $(".ev_expUpdateTip").text("医师你好，验证信息已发至你的手机请查收！");
            }else{
                $(".ev_expTab p").removeClass("exception_active");
                $(".ev_expTab p").eq(1).addClass("exception_active");
                $(".ev_expTabCon").hide();
                $(".ev_expTabCon").eq(1).show();
                $(".ev_expAccount").attr("placeholder","请输入邮箱");
                $(".ev_findAccountPwd").attr("placeholder","请输入邮箱");
                $(".ev_expUpdateTip").text("医师你好，验证信息已发至你的邮箱请查收！");
            }
            $(".ev_expRegistName").text(registName);
            this.goNoCode();
            this.gradClose();
            this.watchAccountBtn();
            this.accountLogin();
            this.showFindPwd();
            this.updateBtn();
        },
        //继续认证
        authContinue:function(){
            var t=this;
            $(".ev_expAuthContinue").off("click").on("click",function(){
                $(".ev_exception").hide();
                t.options.continueAuth&&t.options.continueAuth();
            })
        },
        //手机验证登录与账户密码登录TAB切换
        changeTab:function(){
            var t=this;
            $(".ev_expTab p").each(function(i,em){
                $(em).off("click").on("click",function(){
                    if(t.options.sameAccount.accountType==1) {
                        if (!$(this).hasClass("exception_active")) {
                            $(".ev_expTab p").removeClass("exception_active");
                            $(this).addClass("exception_active");
                            $(".ev_expTabCon").hide();
                            $(".ev_expTabCon").eq(i).show();
                            clearInterval(t.seta);
                            $(".ev_expGetCode").text("获取验证码").attr("on", "false");
                        }
                    }
                })
            });
        },
        //使用该账号登录
        exceptionLogin:function(){
            var t=this;
            $(".ev_expLogin").off("click").on("click",function(){
                $(".ev_exceptionMain").hide();
                $(".ev_exceptionPhone").show();
                if(t.options.sameAccount.accountType==1) {//手机
                    $(".ev_expTab p").removeClass("exception_active");
                    $(".ev_expTab p").eq(0).addClass("exception_active");
                    $(".ev_expTabCon").hide();
                    $(".ev_expTabCon").eq(0).show();
                }
                clearInterval(t.seta);
                $(".ev_expGetCode").text("获取验证码").attr("on","false");
                $(".ev_exception input").val("");
                $(".error_tip").hide().parent().removeClass("exception_error");
                $(".login_btn").removeClass("active").removeAttrs("on");
                $('.exception_grade').hide()
            });
            this.getCode();
            this.watchBtnStatus();
            this.phoneLogin();
        },
        //获取验证码次数
        getTodaySendedSMSNumber: function (resetSite,account) {
            var t = this;
            var rst = 0;
            $.ajax({
                url: t.path.getCount,
                type: "POST",
                async: false,
                data: {
                    paramJson: $.toJSON({
                        account: account,
                        resetSite: resetSite   //找回密码 1   手机验证  7
                    })
                },
                success: function (data) {
                    if (data && data.responseObject && data.responseObject.responseStatus) {
                        rst = data.responseObject.responseData.sendNum;
                    }
                }
            });
            return rst;
        },
        //显示错误信息
        showError:function(obj,text){
            obj.show();
            obj.parent().addClass("exception_error");
            obj.find("span").text(text);
        },
        //隐藏错误信息
        hideError:function(obj){
            obj.hide();
            obj.parent().removeClass("exception_error");
        },
        //倒计数
        countdown: function (btn,fn) {
            var t = this;
            var time = 60;
            btn.html(--time + "秒后重新获取");
            btn.off("click");
            clearInterval(t.seta);
            t.seta = setInterval(function () {
                if (time > 0) {
                    btn.html(--time + "秒后重新获取");
                } else {
                    btn.html("获取验证码");
                    clearInterval(t.seta);
                    btn.attr("on","false");
                    fn&&fn();
                }
            }, 1000);
        },
        //手机登录获取验证码
        getCode:function(){
            var t=this;
            $(".ev_expGetCode").attr("on","false");
            $(".ev_expGetCode").off("click").on("click",function(){
                if($(this).attr("on")=="false"){
                    if(!$(".ev_expPhone").val()||!$(".ev_expPhone").val().match(t.exp)){//todo 需要校验输入账号是否是正确
                        t.showError($(".ev_loginPhoneError"),'请按照提示输入正确帐号');
                    }else if(t.comparison($(".ev_expPhone").val())==0){//校验输入账号是否是正确
                        t.showError($(".ev_loginPhoneError"),'请按照提示输入正确帐号');
                    }else{
                        t.hideError($(".ev_loginPhoneError"));
                       /* t.sendCmsCode({
                            btn:$(".ev_expGetCode"),
                            errorEm:$(".ev_loginPhoneError"),
                            resetSite:7,
                            account:$(".ev_expPhone").val(),
                            countDown:function(){
                                t.getCode()
                            },
                            sendSuccess:function(){}//验证码发送成功
                        });*/
                        t.sendVerificationCode({
                            typeId:3,
                            btn:$(".ev_expGetCode"),
                            account:$(".ev_expPhone").val(),
                            countDown:function(){
                                t.getCode();
                            },
                            sendSuccess:function(){

                            },
                            sendError:function(){
                                clearInterval(t.seta);
                                $(".ev_expGetCode").attr("on","false").text("获取验证码");
                                t.showError($(".ev_loginPhoneError"),'超过三次明天再试');
                                t.getCode();
                            }
                        });
                    }
                }
            })
        },
        //校验立即进入按钮状态
        watchBtnStatus:function(){
            var t=this;
            $(".ev_expPhone").on("keyup",function(){
                var phone = $(".ev_expPhone").val();
                if(phone&&phone.match(t.exp)&&$(".ev_expCode").val()){
                    $(".ev_expLoginBtn").addClass("active").attr("on","false");
                }else{
                    $(".ev_expLoginBtn").removeClass("active").removeAttrs("on");
                }
            });
            $(".ev_expCode").on("keyup",function(){
                var phone = $(".ev_expPhone").val();
                if(phone&&phone.match(t.exp)&&$(".ev_expCode").val()){
                    $(".ev_expLoginBtn").addClass("active").attr("on","false");
                }else{
                    $(".ev_expLoginBtn").removeClass("active").removeAttrs("on");
                }
            })
        },
        //手机验证登录 立即进入
        phoneLogin:function(){
            var t=this;
            $(".ev_expLoginBtn").off("click").on("click",function(){
                if($(this).attr("on")=="false"){
                    $(this).attr("on","true");
                    t.validSMS(1,$(".ev_expPhone").val());
                }
            })
        },
        //手机验证码登录
        validSMS: function (action,account) {
            var t = this;
            var param = {};
            if (t.options.sameAccount.accountType==1) {//手机
                url = t.path.validSMSMobile;
                param.mobile = account;
            } else {
                url = t.path.validSMSEmail;
                param.email = account;
            }
            if(action==1){//手机验证码登录
                param.validCode = $(".ev_expCode").val();
                param.isNew = 1;
            }else if(action==2){//找回密码弹层
                param.validCode = $(".ev_expUpdateCode").val();
            }else if(action==3){//语音验证
                param.validCode = $(".ev_expVoiceCode").val();
                param.isNew = 1;
            }
            param.type = "customer_reset_password";
            comm.LightBox.showloading();
            $.ajax({
                url: url,
                type: "POST",
                data: {
                    paramJson: $.toJSON(param)
                },
                async: false,
                success: function (data) {
                    comm.LightBox.hideloading();
                    if(action==1) {//手机验证码登录
                        $(".ev_expLoginBtn").attr("on", "false");
                    }else if(action==3){//语音验证码登录
                        $(".ev_voiceCodeSure").attr("on","false");
                    }
                    if (data && data.responseObject && data.responseObject.responseStatus) {//登录成功
                        if(action==1||action==3) {//手机验证码登录，语音验证码登录
                            TempCache.clear();
                            comm.cookie.deleteFn("userId");//todo :病历夹子站删除cookie
                            t.sendHebing();
                        }else{//找回密码弹层
                            t.updatePwd();
                        }
                    } else {
                        if(action==1) {//手机验证码登录
                            t.showError($(".ev_loginCodeError"), '验证码错误');
                        }else if(action==2){//找回密码弹层
                            t.showError($(".ev_expUpdateCodeError"), '验证码错误');
                        }else if(action==3){
                            t.showError($(".ev_voiceError"), '验证码错误');
                        }
                    }
                }
            });
        },
        //弹层关闭
        gradClose:function(){
            $(".grade_close").off("click").on("click",function(){
                $(this).parents('.exception_grade').hide();
            })
        },
        //收不到验证码
        goNoCode:function(){
            var t=this;
            $(".ev-findCode").off("click").on("click",function(){
                if(!$(".ev_expPhone").val()||!$(".ev_expPhone").val().match(t.exp)){//todo 需要校验输入账号是否是正确
                    t.showError($(".ev_loginPhoneError"),'请按照提示输入正确帐号');
                }else if(t.comparison($(".ev_expPhone").val())==0){//校验输入账号是否是正确
                    t.showError($(".ev_loginPhoneError"),'请按照提示输入正确帐号');
                }else{
                    t.hideError($(".ev_loginPhoneError"));
                    $(".ev_expNoCode").show();
                }
            });
            this.goVoice();
            this.goService();
        },
        //语音验证弹层
        goVoice:function(){
            var t=this;
            $(".ev_getVoiceCode").off("click").on("click",function(){
                $(".ev_expNoCode").hide();
                $(".ev_expVoice").show();
                t.hideError($(".ev_voiceError"));
                $(".ev_voiceCodeSure").attr("on","false");
                $(".ev_expVoiceCode").val("");
            });
            this.sendVoiceCode();
            this.voiceCodeLogin();
        },
        //忘记账户，我要找回
        goService:function(){
            $(".ev_getService").off("click").on("click",function(){
                $(".ev_expNoCode").hide();
                $(".ev_expService").show();
            })
        },
        //发送语音验证码
        sendVoiceCode:function(){ //todo 需要接口
            var t=this;
            $(".ev_sendVoiceCode").attr("on","false");
            $(".ev_sendVoiceCode").off("click").on("click",function(){
                if($(this).attr("on")=="false"){
                    t.sendVerificationCode({
                        typeId:5,
                        btn:$(".ev_sendVoiceCode"),
                        account:$(".ev_expPhone").val(),
                        sendSuccess:function(){
                            $(".ev_expVoice").hide();
                            $(".ev_expVoiceInput").show();
                            t.hideError($(".ev_voiceError"));
                            $(".ev_voiceCodeSure").attr("on","false");
                        },
                        sendError:function(){
                            $(".ev_expVoice").hide();
                            t.showError($(".ev_loginPhoneError"),'超过三次明天再试');
                        }
                    });
                }
            })
        },
        //语音验证码登录
        voiceCodeLogin:function(){
            var t=this;
            t.hideError($(".ev_voiceError"));
            $(".ev_voiceCodeSure").attr("on","false");
            $(".ev_voiceCodeSure").off("click").on("click",function(){
                if($(this).attr("on")=="false"){
                    $(this).attr("on","true");
                    t.validSMS(3,$(".ev_expPhone").val());
                }
            })
        },
        //账号密码 立即进入button按钮激活校验
        watchAccountBtn:function(){
            var t=this;
            $(".ev_expAccount").off("keyup").on("keyup",function(){
                if($(this).val()&&$(this).val().match(t.exp)&&$(".ev_expPwd").val().length>=6){
                    $(".ev_expAccountLogin").addClass("active").attr("on","false");
                }else{
                    $(".ev_expAccountLogin").removeClass("active").removeAttrs("on");
                }
            });
            $(".ev_expPwd").off("keyup").on("keyup",function(){
                if($(".ev_expAccount").val()&&$(".ev_expAccount").val().match(t.exp)&&$(this).val().length>=6){
                    $(".ev_expAccountLogin").addClass("active").attr("on","false");
                }else{
                    $(".ev_expAccountLogin").removeClass("active").removeAttrs("on");
                }
            })
        },
        //账号密码登录
        accountLogin:function(){
            var t=this;
            $(".ev_expAccountLogin").off("click").on('click',function(){
                var account = $(".ev_expAccount").val();
                var password = $(".ev_expPwd").val();
                if($(this).attr("on")=="false"){
                    if(t.comparison(account)==0){//todo 需要校验输入账号是否是正确
                        t.showError($(".ev_accountError"),'请按照提示输入正确帐号');
                    }else if(password.length < 6 || password.length > 20){
                        t.showError($(".ev_pwdError"),'密码长度请保持在6-20位！');
                    }else if(!password.match(t.passwdReg)){
                        t.showError($(".ev_pwdError"),'字母、数字或符号的组合！');
                    }else{
                        t.hideError($(".ev_accountError"));
                        var type = comm.checkAccountType(account);
                        $(this).attr("on","true");
                        t.checkLoginAccount({
                            opType:2,
                            account:account,
                            passwd:password,
                            success:function(){
                                t.hideError($(".ev_pwdError"));
                                var data = {};
                                var site = "website;";
                                data.j_username = site + account + ";" + password + ";" + type;
                                data.j_password = password;
                                data.rememberMe = true;
                                comm.LightBox.showloading();
                                $.ajax({
                                    url: t.path.login,
                                    type: "POST",
                                    data: data,
                                    dataType: "json",
                                    success: function (data) {
                                        comm.LightBox.hideloading();
                                        if (data && data.responseObject.responseStatus) {
                                            t.sendHebing(function () {
                                                $(".ev_expAccountLogin").attr("on","false");
                                            });
                                            $.ajax({
                                                type: 'POST',
                                                url: t.path.getCustomerUnite,
                                                cache: false,
                                                dataType: 'json',
                                                success: function (rep) {
                                                    if (rep && rep.responseObject) {
                                                        unite = rep.responseObject;
                                                        if (unite != null && unite != undefined) {
                                                            TempCache.setItem("customerRole",unite.customerRole);
                                                            if(!TempCache.getItem("passwd")){
                                                                TempCache.setItem("passwd",unite.passwd);
                                                            }
                                                            if(unite.mobile){
                                                                TempCache.setItem("mobile",unite.mobile);
                                                            }
                                                            if(unite.email){
                                                                TempCache.setItem("email",unite.email);
                                                            }
                                                        }
                                                    }
                                                }
                                            });
                                            TempCache.removeItem("authInfo");//清除authInfo
                                            //TODO 回调函数 返回来源页
                                            /*if (options.callback) { // 弹层
                                                options.callback();
                                            }*/
                                        } else {// 登录失败
                                            $(".ev_expAccountLogin").attr("on","false");
                                            comm.LightBox.hideloading();
                                            t.showError($(".ev_pwdError"),'密码错误');
                                        }
                                    }
                                });
                            },
                            error:function(){
                                $(".ev_expAccountLogin").attr("on","false");
                                comm.LightBox.hideloading();
                                t.showError($(".ev_pwdError"),'密码错误');
                            }
                        });

                    }
                }
            })
        },
        //账号密码登录 找回密码弹层
        showFindPwd:function(){
            var t=this;
            $(".ev_findPwdBtn").off("click").on("click",function(){
                $(".ev_expFindPwd").show();
                $(".ev_findAccountPwd").val("");
                t.hideError($(".ev_findPwdError"));
                $(".ev_sendCode").removeClass("active").removeAttrs("on");
            });
            this.watchFindPwd();
        },
        //找回密码弹层 发送验证码按钮激活校验
        watchFindPwd:function(){
            var t=this;
            $(".ev_findAccountPwd").off("keyup").on("keyup",function(){
                if($(this).val()&&$(this).val().match(t.exp)){
                    $(".ev_sendCode").addClass("active").attr("on","false");
                }else{
                    $(".ev_sendCode").removeClass("active").removeAttrs("on");
                }
            });
            this.getAccountCode();
        },
        //找回密码发送验证码
        getAccountCode:function(){
            var t=this;
            $(".ev_sendCode").off("click").on("click",function(){//todo 需要校验输入账号是否是正确
                if($(this).attr("on")=="false"){
                    if(t.comparison($(".ev_findAccountPwd").val())==0){
                        t.showError($(".ev_findPwdError"),'请按照提示输入正确账号');
                    }else{
                        t.sendCmsCode({
                            btn:$(this),
                            errorEm:$(".ev_findPwdError"),
                            resetSite:1,
                            account:$(".ev_findAccountPwd").val(),
                            sendSuccess:function(){
                                $(".ev_expFindPwd").hide();
                                t.goUpdatePwd();
                                t.countdown($(".ev_expGetUpdateCode"),function(){
                                    t.updatePwdSendCodeAgin();
                                })
                            }//验证码发送成功
                        });
                    }
                }
            })
        },
        //重置密码再次发送验证码
        updatePwdSendCodeAgin:function(){
            var t=this;
            $(".ev_expGetUpdateCode").off("click").on("click",function(){
                if($(this).attr("on")=="false") {
                    t.sendCmsCode({
                        btn: $(".ev_expGetUpdateCode"),
                        errorEm: $(".ev_expUpdateCodeError"),
                        resetSite: 1,
                        account:$(".ev_expUpdatePwdAccount").val(),
                        countDown: function () {
                            t.updatePwdSendCodeAgin();
                        },
                        sendError:function(){
                            clearInterval(t.seta);
                            $(".ev_expGetUpdateCode").attr("on","false").text("获取验证码");
                            t.updatePwdSendCodeAgin();
                        }
                    });
                }
            });
        },
        //重置密码
        goUpdatePwd:function(){
            var t=this;
            $(".ev_expUpdatePwdAccount").val($(".ev_findAccountPwd").val());
            $(".ev_expUpdatePwd").show();
            $(".ev_expUpdate").attr("on","false");
            t.hideError($(".ev_newPwdError"));
            t.hideError($(".ev_RepPwdError"));
            t.hideError($(".ev_expUpdateCodeError"));
            clearInterval(t.seta);
            $(".ev_expGetUpdateCode").text("获取验证码").attr("on","false");
        },
        //确认重置按钮点击
        updateBtn:function(){
            var t=this;
            $(".ev_expUpdate").attr("on","false");
            $(".ev_expUpdate").off("click").on("click",function(){
                if($(this).attr("on")=="false"){
                    var password = $.trim($(".ev_expNewPwd").val());
                    var rePassword = $.trim($(".ev_expRepPwd").val());//确认密码
                    var code = $.trim($(".ev_expUpdateCode").val());//验证码
                    var errorStatus = 0;
                    t.hideError($(".ev_newPwdError"));
                    t.hideError($(".ev_RepPwdError"));
                    t.hideError($(".ev_expUpdateCodeError"));
                    if (password == "" || password == null) {
                        t.showError($(".ev_newPwdError"),'请填写新密码。');
                        errorStatus = 1;
                    } else {
                        if (password.length < 6 || password.length > 20) {
                            t.showError($(".ev_newPwdError"),'密码长度请保持在6-20位！');
                            errorStatus = 1;
                        }else if(!password.match(t.passwdReg)){
                            t.showError($(".ev_newPwdError"),'字母、数字或符号的组合！');
                            errorStatus = 1;
                        }
                    }

                    if (rePassword == "" || rePassword == null) {
                        t.showError($(".ev_RepPwdError"),'请填写确认密码。');
                        errorStatus = 1;
                    } else {
                        if (rePassword!=password) {
                            t.showError($(".ev_RepPwdError"),'两次输入密码不一致！');
                            errorStatus = 1;
                        }
                    }

                    if (code == "" || code == null) {
                        t.showError($(".ev_expUpdateCodeError"),'请输入验证码');
                        errorStatus = 1;
                    }
                    //表单验证成功
                    if(!errorStatus){
                        t.validSMS(2,$(".ev_findAccountPwd").val());
                    }
                }
            })
        },
        //重置密码
        updatePwd:function(){
            comm.LightBox.showloading();
            var t = this;
            var data = {};
            data.password = $.trim($(".ev_expNewPwd").val());
            data.customerId = t.customerId;
            data.resetSite = 1;
            data.itemId = t.itemId;
            data.validCodeId = t.validCodeId;
            data.validCode = t.validCode;
            data.flag = 1;
            $.ajax({
                url: t.path.updatePasswd,
                type: "POST",
                data: {
                    paramJson: $.toJSON(data)
                },
                success: function (data) { // 修改成功。
                    comm.LightBox.hideloading();
                    if (data && data.responseObject && data.responseObject.responseStatus) {
                        comm.surePop({
                            icon:1,
                            contentCss:'text-align:center;width:320px;text-indent:0',
                            title:"找回密码成功",
                            close:function(){

                            },
                            success:function(){

                            }
                        });
                        $('.exception_grade').hide()
                    } else {

                    }
                }
            });
        },
        //发送验证码
        sendVerificationCode:function(obj){
            var t=this;
            obj.btn.attr("on","true");
            obj.countDown&&t.countdown(obj.btn,function(){
                obj.countDown&&obj.countDown();
            });
            comm.LightBox.showloading();
            var timestamp = new Date().getTime();
            var param = {};
            if(obj.typeId==5){
                param.isVoice=1;
            }
            param.siteId=1;
            param.account=obj.account;
            param.typeId=obj.typeId;
            param.isNew=1;
            param.codeLength=4;
            param.customerId = t.customerId;
            param.timestamp=new Date().getTime();
            param.ALLINACCESSTOKEN=comm.allinaccesstoken(timestamp,obj.account);
            $.ajax({
                url: t.path.sendVerification,
                type: "POST",
                data: {
                    paramJson: $.toJSON(param)
                },
                async: false,
                success: function (data) {
                    comm.LightBox.hideloading();
                    obj.btn.attr("on","false");
                    if (data && data.responseObject && data.responseObject.responseStatus) {
                        t.itemId = data.responseObject.responsePk;
                        obj.sendSuccess&&obj.sendSuccess();
                    } else {
                        obj.sendError&&obj.sendError();
                    }
                },
                error:function(){
                    comm.LightBox.hideloading();
                    obj.sendError&&obj.sendError();
                }
            });
        },
        //发送找回密码验证码公共方法
        sendCmsCode:function(obj){
            var t=this;
            var number=t.getTodaySendedSMSNumber(obj.resetSite,obj.account);
            if (number >= t.config.numberOfMessageInOneDay) { // 超出限制
                t.showError(obj.errorEm,'超过三次明天再试');
            }else{
                obj.btn.attr("on","true");
                t.hideError(obj.errorEm);
                obj.countDown&&t.countdown(obj.btn,function(){
                    obj.countDown&&obj.countDown();
                });
                var param = {};
                if (t.options.sameAccount.accountType==1) {//手机
                    url = t.path.sendFindPasswdMobile;
                    param.account = obj.account;
                    param.siteId = 1;
                    param.typeId = 3;
                    errorText = '发送失败，该手机号未验证。';
                } else {
                    url = t.path.sendFindPasswdEmail;
                    param.email = obj.account;
                    param.applySource = 1;
                    errorText = '发送失败，该邮箱未验证。';
                }
                param.isNew = 1;
                param.codeLength = 4;
                param.resetSite = obj.resetSite;
                $.ajax({
                    url: url,
                    type: "POST",
                    data: {
                        paramJson: $.toJSON(param)
                    },
                    dataType: "JSON",
                    success: function (data) {
                        !obj.countDown&&obj.btn.attr("on","false");
                        if (data && data.responseObject && data.responseObject.responseStatus) {
                            t.itemId = data.responseObject.responsePk;
                            t.validCode = data.responseObject.responseData.validCode?data.responseObject.responseData.validCode:"";
                            t.validCodeId = data.responseObject.responseData.validCodeId?data.responseObject.responseData.validCodeId:"";
                            obj.sendSuccess&&obj.sendSuccess();
                        } else {
                            // TODO: 发送失败
                            obj.sendError && obj.sendError();
                            t.showError(obj.errorEm,errorText);
                        }
                    }
                });
            }
        },
        //比对手机或者邮箱输入是否正确
        comparison:function(account){
            var t=this;
            var param = {};
            param.customerId = this.customerId;
            if(this.options.sameAccount.accountType==1){
                param.mobile = account;
            }else{
                param.email = account;
            }
            $.ajax({
                url: t.path.matchAccount,
                type: "POST",
                data: {
                    paramJson: $.toJSON(param)
                },
                dataType: "JSON",
                async: false,
                success: function (data) {
                    isMatch = data.responseObject.responseData.isMatch;
                }
            });
            return isMatch;
        },
        //发送合并请求
        sendHebing:function(callback){
            $(".exception_grade").hide();
            var t=this,postData={};
            postData={
                mainCustomerId:t.cId,//当前用户ID
                mergeCustomerId:t.options.sameAccount.customerId,//相同用户名的用户ID
                mergeState:'1',
                mergeType:'1',
                resourceType:1,
                isValid:1,
                visitSiteId:1,
            };
            $.ajax({
                url:t.path.mergeCreate,
                type:'post',
                data:{
                    paramJson:JSON.stringify(postData)
                },
                dataType:'json',
                success:function (data) {
                    callback&&callback();
                    if(data&&data.responseObject.responseStatus){
                        comm.surePop({
                            icon:1,
                            contentCss:'text-align:center;width:285px;text-indent:0',
                            title:"原帐号登录成功",
                            content:"您的合并申请已收到，后续唯医客服将与您联系",
                            close:function(){
                                t.back();
                            },
                            success:function(){
                                t.back();
                            }
                        });
                    }
                }
            });
        },
        //返回来源页
        back:function(){
            if (document.referrer) {
                if (document.referrer.lastIndexOf("html") > -1) {
                    if (document.referrer.indexOf("pages/singlePage/upload-case.html") > -1) {//来源页为病例发布页面，跳转回首页
                        setTimeout(function () {
                            g_sps.jump(null, "/");
                        }, 500);
                    } else {
                        setTimeout(function () {
                            g_sps.jump(null, document.referrer);
                        }, 500)
                    }
                } else {
                    history.go(-1);
                }
            } else {
                setTimeout(function () {
                    g_sps.jump(null, "/");
                }, 500)
            }
        },
        //退出登录
        logout:function(){
            var t=this;
            $.ajax({
                type: 'POST',
                url: t.path.out,
                cache: false,
                dataType: 'json',
                success: function (rep) {
                    if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                        TempCache.clear();
                        comm.cookie.deleteFn("userId");//todo :病历夹子站删除cookie
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                }
            });
        },
        //检测账号是否可以登录
        checkLoginAccount:function(obj){
            var t=this;
            var param = {};
            param.customerId = t.customerId;
            param.opType = obj.opType;
            if(t.options.sameAccount.accountType==1){//手机
                param.mobile = obj.account;
            }else{//邮箱
                param.email = obj.account;
            }
            if(obj.opType==2){//账号密码登录
                param.passwd = obj.passwd;
            }else{
                param.id = obj.id;
                param.validCode = obj.validCode;
            }
            $.ajax({
                type: 'POST',
                url: t.path.checkLoginAccount,
                data:{paramJson:JSON.stringify(param)},
                dataType: 'json',
                success: function (rep) {
                    if (rep && rep.responseObject && rep.responseObject.responseData.loginFlag) {
                        t.logout();
                        obj.success && obj.success();
                    } else{
                        obj.error && obj.error();
                    }
                },
            });
        }
    };
    controller.init();
};

