/**
 * 功能描述：  个人主页（设置）
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/2.
 */
$(function(){
    var obj = {
        cid : $("#sesCustomerId").val(),
        userName : $(".ev-name"),//用户名
        companyMedicalTitle:$(".ev-companyMedicalTitle"),//职称//医院
        logoUrl : $(".ev-logoUrl"), //头像
        upNum : $(".ev-upNum"), //赞数
        fansNum : $(".ev-fansNum"), //粉丝数
        followNum : $(".ev-followNum")  //关注数
    };
    if(!obj.cid){//未登录
        user.login({
            callback: function () {
                location.reload();
            },
            scene: privilegeSceneConst.eSceneTypeLogin,
            onClose:function(){
                g_sps.jump(null,"/");
            },
            noAuthTip:1
        });
        return false;
    }
    var path={
        out: PC_CALL + "customer/unite/logout/",//退出登录
        validatePassword: PC_CALL + "customer/unite/validatePassword/",//验证密码
        updatePwd: PC_CALL + "customer/unite/update_passwd/",//修改密码
        bindCaos: PC_CALL + "customer/unite/bindCaosAccount/",
        updateEmail: PC_CALL + "customer/unite/update_email/",//修改邮箱
        initCore : PC_CALL+"customer/unite/getMapById/",//个人信息
        sugSubmit: PC_CALL+"customer/suggestion/create/"//意见反馈
    };
    var unit;
    // var reg = /^(127|13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/;//验证手机
    var reg = /^1\d{10}$/;//验证手机
    var allinEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    /*$(".ev-logoUrl").selectCutUserPic({
        callback: function (data) {
            if(data.responseObject && data.responseObject.responseStatus && data.responseObject.responseMessage){
                $(".ev-logoUrl img, #logo_src").attr("src",data.responseObject.responseMessage.url);
            };
            comm.showSuccessPop({
                title:'更新头像成功',//标题
                content:'现在其他医师可以看到您的新头像了',//内容
                second:3,//时间
                obj:$(".ev-logoUrl").parent()//存放dom的父元素
            });
        }
    });*/
    //获取基本信息
    $.ajax({
        url: path.initCore,
        type: "POST",
        data: {paramJson: $.toJSON({isCustomer:"1",customerId: obj.cid,"logoUseFlag": UseFlag.e})},
        dataType: "json",
        success: function (data) {
            if (!data || !data.responseObject.responseStatus) {
                g_sps.jump(null,"/");
                return false;
            }
            var audit=false;
            if(obj.cid){
                $.ajax({
                    url:PC_CALL + "customer/revise/auth/getMapList/",//获取申请审核状态
                    type: "POST",
                    data: {paramJson: $.toJSON({isCustomer:1,customerId: obj.cid})},
                    dataType: "json",
                    async:false,
                    success: function (data) {
                        if(data&&data.responseObject&&data.responseObject.responseStatus){
                            audit=true;
                        }else{
                            audit=false;
                        }
                    }
                });
            }
            var list = data.responseObject.responseData.data_list[0];
            unit = list.customer_unite;
            baseInfo = list.customer_baseinfo;
            authInfo = list.customer_auth;
            authInfo.state = parseInt(authInfo.state,10);
            csc = list.customer_statistic;
            att = list.customer_att;
            var prompt = list.comm_data_prompt;
            var content="审核将在1-3个工作日内完成，请耐心等待";
            /*if(list.authFlag==1){//四证齐全
                content="执业医师审核将在3个工作日内完成，请耐心等待";
            }*/
            //判断头像
            var logoUrl = "<img src=\"//img10.allinmd.cn/default-user/user_img65.png\">";
            if (att.logoUrl !== "") logoUrl = att.logoUrl;
            obj.logoUrl.html("<img src=\"" + logoUrl + "\"/>");

            module.logoReplace({
                container: $(".ev-logoUrl"),
                callback: function (data) {
                    if(data.responseObject && data.responseObject.responseStatus && data.responseObject.responseMessage){
                        $(".ev-logoUrl img, #logo_src").attr("src",data.responseObject.responseMessage.url);
                    };
                    comm.showSuccessPop({
                        title:'更新头像成功',//标题
                        content:'现在其他医师可以看到您的新头像了',//内容
                        second:3,//时间
                        obj:$(".ev-logoUrl").parent()//存放dom的父元素
                    });
                }
            });

            // console.log(unit.customerRole)
            var manufacturerOnOff = unit.customerRole!==3;
            var reminderBar = $(".al-auth-reminder");//补全四证或者认证失败的提示
            if ( authInfo.state !== 2&&authInfo.state !== 7 && authInfo.state !== 8&& authInfo.state !== 9) {//未认证
                var nickname = authInfo.lastName+authInfo.firstName;
                if (nickname === "") nickname = comm.getRegisterName(unit.email,unit.mobile);;
                obj.userName.text(nickname);
                var desStr = "";
                function goAuth() {
                    var noAuthTemplate = "<section class='al-not-auth'><span>" + desStr + "</span><button class='al-go-auth ev-go-auth'>去认证</button></section>";
                    obj.companyMedicalTitle.html(noAuthTemplate);
                    $(".ev-go-auth").off("click").on("click", function () {
                        user.login({
                            callback: function () {
                                window.location.reload();
                            },
                            scene: privilegeSceneConst.eSceneTypeAuth,
                            noAuthTip:1
                        });
                        //事件埋点
                        comm.creatEvent({
                            triggerType: "认证",
                            keyword: "去认证",
                            actionId: 23
                        });
                    });
                }
                if ((authInfo.state === 3)&&manufacturerOnOff) {
                    desStr = prompt.promptMessage;
                    goAuth();
                    $(".ev-noAuth-hide").show();//显示姓名，粉丝行
                    reminderBar.addClass('al-reminder-no-auto');
                    reminderBar.find(".al-auth-reminder-content").html('<em>'+prompt.promptMessage+'</em>');
                    prompt.promptMessage.length>0? reminderBar.show(300).off("click").on("click", function () {
                        user.login({
                            callback: function () {
                                window.location.reload();
                            },
                            scene: privilegeSceneConst.eSceneTypeAuth,
                            noAuthTip:1
                        });
                        //事件埋点
                        comm.creatEvent({
                            triggerType: "认证",
                            keyword: "去认证",
                            actionId: 23
                        });
                    }):'';
                    $(".al-auth-reminder-close").off("click").on("click", function (e) {
                        $(".al-auth-reminder").hide();
                        e.stopPropagation();
                    });
                } else if ((authInfo.state === -1 || authInfo.state === 0)&&manufacturerOnOff) {
                    $(".ev-noAuth-hide").hide();//隐藏姓名，粉丝行
                    desStr = prompt.promptMessage;
                    reminderBar.addClass('al-reminder-no-auto');
                    reminderBar.find(".al-auth-reminder-content").html('<em>'+prompt.promptMessage+'</em>');
                    prompt.promptMessage.length>0?reminderBar.show(300).off("click").on("click", function () {
                        user.login({
                            callback: function () {
                                window.location.reload();
                            },
                            scene: privilegeSceneConst.eSceneTypeAuth,
                            noAuthTip:1
                        });
                        //事件埋点
                        comm.creatEvent({
                            triggerType: "认证",
                            keyword: "去认证",
                            actionId: 23
                        });
                    }):'';
                    $(".al-auth-reminder-close").off("click").on("click", function (e) {
                        $(".al-auth-reminder").hide();
                        e.stopPropagation();
                    });
                    goAuth();
                    $(".ev-noAuth-hide").hide();//隐藏姓名，粉丝行
                }else{
                    $(".ev-noAuth-hide").show();//显示姓名，粉丝行
                }
                if(authInfo.state===1){
                    $(".ev-noAuth-hide").hide();
                    if(list.authFlag==1){
                        $(".al-certification-status").html('<p>'+content+'</p>').show().addClass("al-certification-v2Status");
                    }else{
                        $(".al-certification-status").html('<p>'+content+'</p>').show().addClass("al-certification-v1Status");
                    }
                }
            } else {
                $(".ev-noAuth-hide").show();//显示姓名，粉丝行
                var name = authInfo.lastName + authInfo.firstName;
                obj.userName.html(name + '<i class="al-vipBigUser al-vipNewBigUser"></i>');
                if(authInfo.medicalTitleShow){
                    obj.companyMedicalTitle.html('<p class="ev-medical">'+authInfo.medicalTitleShow+'</p><p class="ev-company">'+authInfo.workplace+'</p>');
                }else{
                    obj.companyMedicalTitle.html('<p class="ev-company">'+authInfo.workplace+'</p>');
                }
                if((  authInfo.state === 2||authInfo.state === 7 || authInfo.state === 9)&&manufacturerOnOff){
                    $(".al-vipBigUser").css({"background":"url('/images/img10/authentication/V1.png') no-repeat 50% 50%"});
                }
                if((authInfo.state===2)&&manufacturerOnOff){
                    var authHelpTemplate = '<section class="al-auth-grade" style="display: block;">'+
                        '<section class="al-auth-grade-details">'+
                        '<h1 class="al-auth-grade-title">认证等级规则</h1>'+
                        '<p class="al-auth-grade-produce">'+
                        '	认证等级是用户在唯医、医鼎、医栈、唯医骨科所具有的统一认证等级。包括：'+
                        '</p>'+
                        '<div class="al-auth-grade-des">'+
                        '	<h1><i></i>V1-认证医师</h1>'+
                        '	<p>'+
                        '		拥有在唯医、医鼎、医栈的医师操作权限'+
                        '	</p>'+
                        '</div>'+
                        '<div class="al-auth-grade-des">'+
                        '	<h1><i></i>V2-执业医师</h1>'+
                        '	<p>'+
                        '		拥有V1权限的同时，还具有在唯医骨科进行执业诊疗的权限'+
                        '	</p>'+
                        '</div>'+
                        '<div class="al-auth-grade-close">'+
                        '</div>'+
                        '</section>'+
                        '</section>';
                    if(TempCache.getItem("isFirstAuthHelp")){
                        // return false;
                    }else{
                        $(".al-auth-grade").remove();
                        $("body").append(authHelpTemplate);
                        $(".al-auth-grade-close").off("click").on("click",function(){
                            $(".al-auth-grade").remove();
                        });
						TempCache.setItem("isFirstAuthHelp","true");
                    }
                }
                if((authInfo.state === 8)&&manufacturerOnOff ){
                    $(".al-vipBigUser").css({"background":"url('/images/img10/authentication/V2.png') no-repeat 50% 50%"});
                }
                if((authInfo.state===9)&&manufacturerOnOff){
                    //desStr ="v2认证未通过审核,请重新认证";
                    reminderBar.addClass("al-auth-reminder-failed").find(".al-auth-reminder-content").html(prompt.promptMessage);
                    prompt.promptMessage.length>0?reminderBar.show(300).off("click").on("click",function(){
                        g_sps.jump(null,"/pages/singlePage/user/auth.html");
                    }):'';
                    $(".al-auth-reminder-close").off("click").on("click", function (e) {
                        e.stopPropagation();
                        $(".al-auth-reminder").hide();
                    });
                }
                if(((  authInfo.state === 2)&&authInfo.state != 7)&&manufacturerOnOff&&!audit){
                    reminderBar.addClass('al-reminder-no-auto');
                    reminderBar.find(".al-auth-reminder-content").html('<em>'+prompt.promptMessage+'</em>');
                    prompt.promptMessage.length>0?reminderBar.show(300).off("click").on("click",function(){
						TempCache.setItem("userInfoTrigger","true");
                        g_sps.jump(null,$(".al-customer-info a").attr("href"));
                    }):'';
                    $(".al-auth-reminder-close").off("click").on("click", function (e) {
                        e.stopPropagation();
                        $(".al-auth-reminder").hide();
                    });
                }
                if(authInfo.state===7&&manufacturerOnOff){
                    $(".al-certification-status").html('<p>'+content+'</p>').show().addClass("al-certification-v2Status");
                }
                if(authInfo.state==2&&audit){//修改认证审核中
                    $(".al-certification-status").html('<p>'+content+'</p>').show().addClass("al-certification-v2Status");
                }
            }
            obj.fansNum.text(csc.fansNum);
            // obj.followNum.text(csc.followpeopleNum);
            obj.followNum.text(csc.followOrgNum?csc.followOrgNum:csc.followpeopleNum);
            obj.upNum.text(csc.othersUpNum);

            weixin.init();
            bindPhone.init();
            bindEmail.init();
            bindCaos.init();
            updatePwd.init();
            suggest.init();

            //退出登录
            $("#login_out").on("click", function () {
                if (confirm("确认退出?")) {
                    $.ajax({
                        type: 'POST',
                        url: path.out,
                        cache: false,
                        dataType: 'json',
                        success: function (rep) {
                            if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                                TempCache.clear();
                                comm.cookie.deleteFn("userId");//todo :病历夹子站删除cookie
                                g_sps.jump(null,'/');
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                        }
                    });
                }
                return false;
            });

        }
    });
    //微信绑定
    var weixin = {
        init: function () {
            //初始化是否绑定过微信
            this.isBindWeixin();
            //事件处理
            this.bindEvent();
        },
        isBindWeixin: function () {
            var status = false;
            $.ajax({
                url: PC_CALL + "wx/allin/interact/checkIfBind/",
                type: "POST",
                data: {},
                async: false,
                success: function (data) {
                    status = data.responseObject.responseStatus;
                }
            });

            if (status) $(".ev-bindWeixinTips").text("已绑定");
            else $(".ev-bindWeixinTips").text("绑定微信");
        },
        bindEvent: function () {
            var t = this;
            $("#bind-weixin").on("mouseover", function () {
                if ($(".ev-bindWeixinTips").text() === "已绑定") {
                    $(".ev-bindWeixinTipsStatus").show();
                }
            }).on("mouseout", function () {
                $(".ev-bindWeixinTipsStatus").hide();
            });
            $("#bind-weixin").on("click", function () {
                //已绑定时
                if ($(".ev-bindWeixinTips").text() === "已绑定") { //已绑定
                    $(this).after(t.template.isCancelBindWeixin());

                    $(".ev-confirmCancelBindWeixin").on("click", function () {
                        $(".ev-bindWeixinTips").text("绑定微信");
                        $(".ev-weixinPopWindow").remove(); //移除弹出层

                        $.ajax({
                            url: PC_CALL + "wx/allin/interact/cancleBind/",
                            type: "POST",
                            data: {}
                        });
                        //事件埋点
                        comm.creatEvent({
                            triggerType:"全站功能按钮点击",
                            keyword:"绑定微信取消",
                            browType:106,
                            actionId:45
                        });
                    }).siblings(".ev-confirmBindWeixin").on("click", function () {
                        $(".ev-weixinPopWindow").remove(); //移除弹出层
                    });
                    return false;
                }

                //未绑定时
                $(this).after(t.template.weixinImg());

                var obj = {};
                obj.size = 104;

                module.welcome(obj); //引入二维码

                //调用查询用户信息的方法
                function getResult() {
                    var result = module.weixin();
                    if (result != null) {
                        if (result) {
                            $(".ev-weixinPopWindow").html(t.template.weixinSucc());
                            t.weixinTipsCountdown();
                            $(".ev-bindWeixinTips").text("已绑定"); //
                        } else {
                            $(".ev-weixinPopWindow").html(t.template.weixinError());
                            t.weixinTipsCountdown();
                        }
                    } else {
                        setTimeout(function () {
                            if (getResult != null) getResult();
                        }, 3000);
                    }
                }

                getResult();

                //移除弹出层
                $(".ev-weixinPopWindow").on("mouseleave", function () {
                    $(".ev-weixinPopWindow").remove();
                    getResult = null;
                });
                //comm.Log.createBrowse({href:location.href,id:106,name:'绑定微信'});
            });
        },
        weixinTipsCountdown: function () {
            var num = 3;
            $(".ev-countdown").text(num);
            var a = setInterval(function () {
                if (num > 0) {
                    $(".ev-countdown").text(--num);
                } else {
                    $(".ev-weixinPopWindow").remove(); //移除弹出层
                    clearInterval(a);
                }
            }, 1000);
        },
        template: {
            weixinImg: function () {
                return "<div class=\"ev-weixinPopWindow weixin_border_cont\">" +
                    "<div class=\"weixin_border_jt\"></div>" +
                    "<div class=\"weixin_border_t\"></div>" +
                    "<div class=\"weixin_border_c\">" +
                    "<div class=\"wx_ewm weixin_erweima\"></div>" +
                    "<div class=\"wx_ewm_text\">" +
                    "<div class=\"wx_ewm_text_t\">用微信扫一扫绑定帐号</div>" +
                    "<div class=\"wx_ewm_text_b\">" +
                    "<div>登录唯医总是输入帐号密码太麻烦？</div>" +
                    "<div>关注唯医服务号，微信扫码一键登录！</div>" +
                    "</div>" +
                    "</div>" +
                    "<div class=\"clear\"></div>" +
                    "</div>" +
                    "<div class=\"weixin_border_b\"></div>" +
                    "</div>";
            },
            weixinSucc: function () {
                return '<div class="weixin_border_jt"></div>' +
                    '<div class="weixin_border_t"></div>' +
                    '<div class="weixin_border_c">' +
                    '<div class="weixin_border_c_text">' +
                    '<div class="weixin_border_c_text_t">绑定成功!</div>' +
                    '<div class="weixin_border_c_text_c">您现在可以使用微信扫码登录唯医<br/>随时接收唯医上的新动态啦！</div>' +
                    '<div class="weixin_border_c_text_b"><span class="ev-countdown">3</span>秒后自动关闭</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="weixin_border_b"></div>';
            },
            weixinError: function () {
                return '<div class="weixin_border_jt"></div>' +
                    '<div class="weixin_border_t"></div>' +
                    '<div class="weixin_border_c">' +
                    '<div class="weixin_border_c_text">' +
                    '<div class="weixin_border_c_text_t">opps，没有绑定成功哦！</div>' +
                    '<div class="weixin_border_c_text_c">您的此微信号已经绑定过其他唯医帐号</div>' +
                    '<div class="weixin_border_c_text_b"><span class="ev-countdown">3</span>秒后自动关闭</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="weixin_border_b"></div>';
            },
            isCancelBindWeixin: function () {
                return '<div class="ev-weixinPopWindow weixin_border_cont">' +
                    '<div class="weixin_border_jt"></div>' +
                    '<div class="weixin_border_t"></div>' +
                    '<div class="weixin_border_c">' +
                    '<div class="weixin_border_c_text">' +
                    '<div class="weixin_border_c_text_t wx_t_line_height">解绑后将无法使用微信扫码登录唯医<br/>确定解除绑定么？</div>' +
                    '<div class="wx_popup_but">' +
                    '<div class="wx_popup_but_common wx_popup_but01 ev-confirmCancelBindWeixin">确定</div>' +
                    '<div class="wx_popup_but_common wx_popup_but02 ev-confirmBindWeixin">取消</div>' +
                    '<div class="clear"></div>' +
                    '</div> ' +
                    '</div>' +
                    '</div>' +
                    '<div class="weixin_border_b"></div>' +
                    '</div>'
            }

        }
    };
    //绑定手机
    var bindPhone = {};
    bindPhone = {
        init: function () {
            this.phoneInit();
            this.bindEditBtn();
            this.bindCancel();
            this.bindSendBtn();
            this.bindValidMobile();
        },
        //判断是否已绑定手机
        phoneInit: function () {
            if (unit && unit.mobile) {
                $("#phone_show").addClass("al-hasBinded");
                mobile = comm.getRegisterName('',unit.mobile);
                $(".hasphone").text(mobile);
                if (unit.isCheckMobile == "1") {//手机号已激活
                    $("#changephone_btn").text("更换号码");
                } else {
                    $("#changephone_btn").text("激活手机号码");
                }
                $("#phone_number").attr("placeholder", "新手机号码");
            } else {
                $("#phone_number").attr("placeholder", "你的手机号码");
            }
        },
        bindEditBtn: function () {
            $("#bindphone_edit_btn").bind("click", function () {
                $("#phone_show").hide();
                $("#phone_edit").show();
                //comm.Log.createBrowse({href:location.href,id:107,name:'绑定手机'});
            });
            $("#changephone_btn").on("click", function () {
                $("#phone_show").hide();
                $("#phone_edit").show();
            });
        },
        //放弃
        bindCancel: function () {
            var t = this;
            $("#bindphone_cancel").bind("click", function () {
                t.clearData();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"绑定手机取消",
                    browType:107,
                    actionId:45
                });
            })
        },
        clearData: function () {
            var t=this;
            if(t.timer){
                clearInterval(t.timer);
            }
            $("#phone_show").show();
            $("#phone_edit").hide();
            $("#validCode").val("");
            $("#phone_number").val("");
            $(".error_phonemsg").removeClass("showIb");
            $("#phone_number").parents("article").removeClass("error");
            $("#send_validCode").show().text("发送验证码");
            $("#send_validCode").attr("on", "true");
            $("#countdown").hide();
        },
        //发送验证码按钮
        bindSendBtn: function () {
            var t = this;
            $("#send_validCode").on("click",function () {
                var mobile = $("#phone_number").val();
                if (mobile) {
                    $(".error_phonemsg").removeClass("showIb");
                    if (!reg.test(mobile)) {
                        $(".error_phonemsg").addClass("showIb");
                        $(".error_phonemsg").html("<i></i>手机号码格式错误");
                        $("#phone_number").parents("article").addClass("error");
                        return;
                    } else if ($(this).attr("on") == "true") {
                        $(this).attr("on", "false");
                        $(".error_phonemsg").removeClass("showIb");
                        $("#phone_number").parents("article").removeClass("error");
                        comm.customer.asyncExecute("validateCustomerAccount", {
                            "type": "mobile",
                            "account": mobile
                        }, function (rep) {
                            $("#send_validCode").attr("on","true");
                            if (rep.responseStatus) {
                                //给手机发短信
                                $("#send_validCode").hide();
                                var timestamp = new Date().getTime();
                                comm.customer.asyncExecute("sendSms", {
                                    "siteId": 1,
                                    "typeId": 2,
                                    "account": mobile,
                                    "codeLength": 4,
                                    "timestamp":timestamp,
                                    "ALLINACCESSTOKEN": comm.allinaccesstoken(timestamp,mobile)
                                }, function (data) {
                                    if (!data.responseStatus) {
                                        $("#send_validCode").show().text("重新发送");
                                        alert(data.responseMessage);
                                        return false;
                                    }else{
                                        t.countdown();//倒计时
                                    }
                                });

                            } else {
                                $(".error_phonemsg").addClass("showIb");
                                $(".error_phonemsg").html("<i></i>"+rep.responseMessage);
                                $("#phone_number").parents("article").addClass("error");
                                return;
                            }
                        });

                    }
                } else {
                    $(".error_phonemsg").addClass("showIb");
                    $(".error_phonemsg").html("<i></i>请输入手机号码");
                    $("#phone_number").parent().addClass("baseinfo_error_red");
                    return;
                }
            });
        },
        //验证手机
        bindValidMobile: function () {
            var t = this;
            $("#valide_mobile").attr("on","true");
            $("#valide_mobile").on("click", function () {
                var validCode = $("#validCode").val();
                var mobile = $("#phone_number").val();
                if (!reg.test(mobile)) {
                    $(".error_phonemsg").addClass("showIb");
                    $(".error_phonemsg").html("<i></i>请输入正确手机号码");
                    $("#phone_number").parents("article").addClass("error");
                    return;
                } else if($(this).attr("on")=="true"){
                    $(this).attr("on","false");
                    if (validCode && mobile) {//验证码不为空
                        $(".error_validCodemsg").removeClass("showIb");
                        $(".error_phonemsg").removeClass("showIb");
                        $("#phone_number").parents("article").removeClass("error");
                        $("#phone_edit").mask("");
                        comm.customer.asyncExecute("updateMobile", {
                            "mobile": mobile,
                            "siteId": 1,
                            "validCode": validCode
                        }, function (data) {
                            $("#valide_mobile").attr("on","true");
                            if (data.responseStatus) {
                                t.clearData();
                                $("#bindphone_edit_btn").remove();
                                $(".hasphone").text(comm.getRegisterName('',mobile));
                                //$.topTip({mark: "success", content: "成功绑定手机！"});
                                comm.showSuccessPop({
                                    title:'绑定手机成功',//标题
                                    content:'现在您可以使用手机号登录唯医了',//内容
                                    second:3,//时间
                                    obj:$("#phone_show")//存放dom的父元素
                                });
                            } else {
                                if(data.responseCode=="0B0002"){
                                    $(".error_validCodemsg").addClass("showIb");
                                }else{
                                    $.topTip({mark: "warn", content: "绑定手机失败！"});
                                }

                            }
                            $("#phone_edit").unmask();
                        });
                    }
                }
            });
        },
        //倒计时
        countdown: function () {
            var t=this
            $("#countdown").show().text("60秒后重新发送");
            t.timer = null;
            var num = 60;
            t.timer = setInterval(function () {
                num--;
                if (num == 0) {
                    clearInterval(t.timer);
                    $("#countdown").hide();
                    $("#send_validCode").show().text("重新发送");
                    $("#send_validCode").attr("on", "true");
                }
                $("#countdown").text(addZero(num) + "秒后重新发送");
            }, 1000);

            function addZero(n) {
                if (n < 10) {
                    return '0' + n;
                } else {
                    return n;
                }
            };
        }
    };

    //绑定邮箱
    var bindEmail = {};
    bindEmail = {
        init: function () {
            this.emailInit();
        },

        emailReplace: function (email) {
            /*email1 = email.split("@")[0];
            if (email1.length > 3) {
                email1_replace = email1.replace(email1.substring(3, email1.length), "***");
            } else {
                email1_replace = email1.replace(email1.substring(1, email1.length), "***");
            }
            newEmail = email1_replace + "@" + email.split("@")[1];*/
            newEmail=comm.getRegisterName(email);
            return newEmail;
        },
        emailInit: function () {
            if (unit && unit.email) {//已绑定邮箱
                $("#email_show").addClass("al-hasBinded");
                newEmail = this.emailReplace(unit.email);
                $("#bind_email_btn").hide();
                $(".hasEmail").text(newEmail);
                this.updateEmail();
            } else {//未绑定邮箱
                this.bindEmail1();
            }
        },
        bindEmail1: function () {
            var t = this;
            $("#bind_email_btn").on("click", function () {
                $("#email_show").hide();
                $("#emialBind_edit").show();
                //comm.Log.createBrowse({href:location.href,id:108,name:'绑定邮箱'});
            });
            $("#emial_cancel").on("click", function () {
                $("#email_show").show();
                $("#emialBind_edit").hide();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"绑定邮箱取消",
                    browType:108,
                    actionId:45
                });
            });
            $("#email_save").attr("on","true");
            $("#email_save").on("click", function () {
                if($(this).attr("on")=="true"){
                    $("#email_form").submit();
                }
                return false;
            });
            $("#email_form").validate({
                submitHandler: function () {
                    $(this).attr("on","false");
                    $("#emialBind_edit").mask("");
                    $.ajax({
                        type: "post",
                        url: path.updateEmail,
                        data: {"email": $("#email_bin").val(),"isCheckEmail":0},
                        dataType: "json",
                        success: function (rep) {
                            $("#email_save").attr("on","true");
                            $("#emialBind_edit").unmask();
                            if (rep && rep.responseObject.responseStatus) {
                                $("#email_show").show().addClass("al-hasBinded");
                                $("#emialBind_edit").hide();
                                newEmail = t.emailReplace($("#email_bin").val());
                                //$(".hasEmail").parent().show();
                                $("#bind_email_btn").hide();
                                // $(".hasEmail").text("当前邮箱" + newEmail);
                                $(".hasEmail").text(newEmail);
                                //$.topTip({mark: "success", content: "成功绑定邮箱！"});
                                comm.showSuccessPop({
                                    title:'绑定邮箱成功',//标题
                                    content:'现在您可以使用邮箱登录唯医了',//内容
                                    second:3,//时间
                                    obj:$("#email_show")//存放dom的父元素
                                });
                                t.updateEmail();
                                $("#email_bin").parents("article").removeClass("error");
                                $("#email_bin").parents("article").find(".al-tableErrorTips").removeClass("showIb");
                            } else {
                                $("#email_bin").parents("article").addClass("error");
                                $("#email_bin").parents("article").find(".al-tableErrorTips").addClass("showIb");
                                $("#email_bin").parents("article").find(".al-tableErrorTips em").html("<label>" + rep.responseObject.responseMessage + "</label>");
                            }
                        },
                        error: function () {
                        }
                    });
                },
                rules: {
                    "email": {
                        "required": true,
                        "allinEmail": true
                    }
                },
                messages: {
                    "email": {
                        "required": "请填写邮箱！",
                        "allinEmail": "邮箱格式不正确！"
                    }
                },
                errorPlacement: function (error, element) {
                    var p = $(element).parents("article");
                    p.addClass("error");
                    p.find(".al-tableErrorTips").addClass("showIb");
                    p.find(".al-tableErrorTips em").html(error);
                },
                success: function (element) {
                    var p = $(element).parents("article");
                    p.removeClass("error");
                    p.find(".al-tableErrorTips").removeClass("showIb");
                    p.find(".al-tableErrorTips em").empty();
                },
                onkeyup: false
            });
        },
        updateEmail: function () {
            var t = this;
            $("#update_email_btn").on("click", function () {
                $("#email_show").hide();
                $("#emialUpa_edit").show();
            });
            $("#emialUpa_cancel").on("click", function () {
                $("#email_show").show();
                $("#emialUpa_edit").hide();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"绑定邮箱取消",
                    browType:107,
                    actionId:45
                });
            });
            $("#emailUpa_save").attr("on","true");
            $("#emailUpa_save").on("click", function () {
                if($(this).attr("on")=="true"){
                    $("#emailUpa_form").submit();
                }
                return false;
            });
            $("#emailUpa_form").validate({
                submitHandler: function () {
                    $(this).attr("on","false");
                    $("#emialUpa_edit").mask("");
                    $.ajax({
                        type: "post",
                        url: path.validatePassword,
                        data: {"password": $("#pwd").val()},
                        dataType: "json",
                        success: function (rep) {
                            $("#emailUpa_save").attr("on","true");
                            if (rep && rep.responseObject.responseStatus) {//校验密码成功
                                $.ajax({
                                    type: "post",
                                    url: path.updateEmail,
                                    data: {"email": $("#email_upa").val(),"isCheckEmail":0},
                                    dataType: "json",
                                    success: function (rep) {
                                        $("#emialUpa_edit").unmask();
                                        if (rep && rep.responseObject.responseStatus) {
                                            $("#email_show").show().addClass("al-hasBinded");
                                            $("#emialUpa_edit").hide();
                                            newEmail = t.emailReplace($("#email_upa").val());
                                            $(".hasEmail").text(newEmail);
                                            $("#emailUpa_form input").val("");
                                            $("#email_upa").parents("article").removeClass("error");
                                            $("#email_upa").parents("article").find(".al-tableErrorTips").removeClass("showIb");
                                            //$.topTip({mark: "success", content: "成功修改邮箱！"});
                                            comm.showSuccessPop({
                                                title:'修改邮箱成功',//标题
                                                content:'现在您可以使用新邮箱登录唯医了',//内容
                                                second:3,//时间
                                                obj:$("#email_show")//存放dom的父元素
                                            });
                                        } else {
                                            $("#email_upa").parents("article").addClass("error");
                                            $("#email_upa").parents("article").find(".al-tableErrorTips").addClass("showIb");
                                            $("#email_upa").parents("article").find(".al-tableErrorTips em").html("<label>" + rep.responseObject.responseMessage + "</label>");
                                        }
                                    },
                                    error: function () {
                                    }
                                });
                            } else {
                                $("#emialUpa_edit").unmask();
                                $("#email_upa").parents("article").addClass("error");
                                $("#email_upa").parents("article").find(".al-tableErrorTips").addClass("showIb");
                                $("#email_upa").parents("article").find(".al-tableErrorTips em").html("<label>密码错误</label>");
                            }
                        },
                        error: function () {
                        }
                    });

                },
                rules: {
                    "password": {
                        "required": true,
                        "chrnum": true,
                        "rangelength": [6, 20]
                    },
                    "email": {
                        "required": true,
                        "allinEmail": true
                    }

                },
                messages: {
                    "password": {
                        "required": "请填写当前密码！",
                        "chrnum": "密码格式不正确！",
                        "rangelength": "密码长度请保持在{0}-{1}位！"
                    },
                    "email": {
                        "required": "请填写邮箱！",
                        "allinEmail": "请填写正确邮箱！"
                    }
                },
                errorPlacement: function (error, element) {
                    var p = $(element).parents("article");
                    p.addClass("error");
                    p.find(".al-tableErrorTips").addClass("showIb");
                    p.find(".al-tableErrorTips em").html(error);
                },
                success: function (element) {
                    var p = $(element).parents("article");
                    p.removeClass("error");
                    p.find(".al-tableErrorTips").removeClass("showIb");
                    p.find(".al-tableErrorTips em").empty();
                },
                onkeyup: false
            });
        }
    };

    //CAOS绑定
    var bindCaos = {};
    bindCaos = {
        init: function () {
            this.validate();
            this.cancel();
            if (unit && unit.uniteNameCaos) {//已绑定
                $("#bind_caos").hide();
                $("#caosAccountShow").html("已绑定" + unit.uniteNameCaos);
            } else {
                this.editBtn();
            }
        },
        editBtn: function () {
            $("#bind_caos").on("click", function () {
                $("#caos_show").hide();
                $("#caos_edit").show();
                $("#caos_form input").val("");
                $("#caos_form article").removeClass("error");
                $("#caos_form .al-tableErrorTips").removeClass("showIb");
                //comm.Log.createBrowse({href:location.href,id:109,name:'绑定CAOS'});
            })
        },
        validate: function () {
            var t = this;
            $("#caos_save").on("click", function () {
                $("#caos_form").submit();
                return false;
            });
            $("#caos_form").validate({
                submitHandler: function () {
                    t.save();
                },
                rules: {
                    "caosAccount": {
                        "required": true,
                        "emailOrPhone": true
                    },
                    "caosPwd": {
                        "required": true,
                        "chrnum": true,
                        "rangelength": [6, 20]
                    }

                },
                messages: {
                    "caosAccount": {
                        "required": "请填写caos帐号！",
                        "emailOrPhone": "帐号格式不正确！"
                    },
                    "caosPwd": {
                        "required": "请填写密码！",
                        "chrnum": "密码格式不正确！",
                        "rangelength": "密码长度请保持在{0}-{1}位！"
                    }
                },
                errorPlacement: function (error, element) {
                    var p = $(element).parents("article");
                    p.addClass("error");
                    p.find(".al-tableErrorTips").addClass("showIb");
                    p.find(".al-tableErrorTips em").html(error);
                },
                success: function (element) {
                    var p = $(element).parents("article");
                    p.removeClass("error");
                    p.find(".al-tableErrorTips").removeClass("showIb");
                    p.find(".al-tableErrorTips em").empty();
                },
                onkeyup: false
            });
        },
        save: function () {
            var data = {};
            var param = {};
            data.caosAccount = $("#caosAccount").val();
            data.password = $("#caosPwd").val();
            param.paramJson = $.toJSON(data);
            $("#caos_edit").mask("");
            $.ajax({
                url: path.bindCaos,
                type: "POST",
                dataType: "json",
                data: param,
                success: function (rep) {
                    $("#caos_edit").unmask("");
                    if (rep.responseObject.responseStatus) {
                        //$.topTip({mark: "success", content: "成功绑定caos帐号！"});
                        $("#caos_show").show();
                        $("#caos_edit").hide();
                        $("#caos_show .p_c_cont_bj_mail_bj").text("已绑定" + data.caosAccount);
                        comm.showSuccessPop({
                            title:'绑定CAOS成功',//标题
                            content:'现在您可以使用CAOS帐号登录唯医了',//内容
                            second:3,//时间
                            obj:$("#caos_show")//存放dom的父元素
                        });
                    } else {
                        $.topTip({mark: "warn", content: rep.responseObject.responseMessage});
                    }
                }
            });
        },
        cancel: function () {
            $("#caos_cancel").on("click", function () {
                $("#caos_show").show();
                $("#caos_edit").hide();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"绑定CAOS取消",
                    browType:109,
                    actionId:45
                });
                return false;
            });
        }
    };

    //修改密码
    var updatePwd = {};
    updatePwd = {
        init: function () {
            this.bindPwdEdit();
            this.cancelEdit();
            this.validate();
        },
        bindPwdEdit: function () {
            $("#pwd_btn").on("click", function () {
                $("#password_show").hide();
                $("#password_edit").show();
                $("#pwd_form input").val("");
                $("#pwd_form article").removeClass("error");
                $("#pwd_form .al-tableErrorTips").removeClass("showIb");
                //comm.Log.createBrowse({href:location.href,id:110,name:'密码修改'});
            })
        },
        cancelEdit: function () {
            $("#pwd_cancel").on("click", function () {
                $("#password_show").show();
                $("#password_edit").hide();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"修改密码取消",
                    browType:110,
                    actionId:45
                });
                return false;
            })
        },
        validate: function () {
            var t = this;
            $("#pwd_save").on("click", function () {
                $("#pwd_form").submit();
                return false;
            });
            $("#pwd_form").validate({
                submitHandler: function () {
                    t.save();
                },
                rules: {
                    "password": {
                        "required": true,
                        "chrnum": true,
                        "rangelength": [6, 20]
                    },
                    "newpassword": {
                        "required": true,
                        "chrnum": true,
                        "rangelength": [6, 20]
                    },
                    "repassword": {
                        "required": true,
                        "equalTo": "#newpassword"
                    }
                },
                messages: {
                    "password": {
                        "required": "请填写当前密码！",
                        "chrnum": "密码格式不正确！",
                        "rangelength": "密码长度请保持在{0}-{1}位！"
                    },
                    "newpassword": {
                        "required": "请填写新密码！",
                        "chrnum": "密码格式不正确！",
                        "rangelength": "密码长度请保持在{0}-{1}位！"
                    },
                    "repassword": {
                        "required": "请再次填写密码！",
                        "equalTo": "两次输入密码不一致！"
                    }
                },
                errorPlacement: function (error, element) {
                    var p = $(element).parents("article");
                    p.addClass("error");
                    p.find(".al-tableErrorTips").addClass("showIb");
                    p.find(".al-tableErrorTips em").html(error);
                },
                success: function (element) {
                    var p = $(element).parents("article");
                    p.removeClass("error");
                    p.find(".al-tableErrorTips").removeClass("showIb");
                    p.find(".al-tableErrorTips em").empty();
                },
                onkeyup: false
            });
        },
        save: function () {
            //密码修改保存
            var data = {
                "oldPasswd": $("#password").val(),
                "newPasswd": $("#newpassword").val(),
                "rePasswd": $("#repassword").val()
            };
            $("#password_edit").mask("");
            $.ajax({
                type: "get",
                url: path.updatePwd,
                data: data,
                dataType: "json",
                success: function (data) {
                    $("#password_edit").unmask("");
                    if (!data.rows.responseStatus) {
                        $("#password").parents("article").addClass("error");
                        $("#password").parents("article").find(".al-tableErrorTips").addClass("showIb");
                        $("#password").parents("article").find(".al-tableErrorTips em").html("当前密码错误!");
                        return false;
                    } else {
                        $("#password_edit").hide();
                        $("#password_show").show();
                        comm.showSuccessPop({
                           title:'修改密码成功',//标题
                           content:'现在您可以使用新密码登录唯医了',//内容
                           second:3,//时间
                           obj:$("#password_show")//存放dom的父元素
                        });
                        setTimeout(function(){
                            $.ajax({
                                type: 'POST',
                                url: path.out,
                                cache: false,
                                dataType: 'json',
                                success: function (rep) {
                                    if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                                        TempCache.removeItem("authInfo");
                                        TempCache.removeItem("userId");
                                        TempCache.removeItem("userName");
                                        TempCache.removeItem("privData");
                                        TempCache.removeItem("mobile");
                                        TempCache.removeItem("email");
                                        TempCache.removeItem("sesDepartment");
                                        TempCache.removeItem("isFirstAuthHelp");
                                        TempCache.removeItem("passwd");
                                        g_sps.jump(null, '/');
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                }
                            });
                        },3000);
                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert(textStatus + " " + errorThrown);
                }
            });

        }
    };

    //建议反馈
    var suggest={
        init:function(){
            var textareaVal=$("#Ev-settingSuggest");
            comm.textChange({'$tex':textareaVal,'$num':$("#Ev-settingSugNum"),'noTop':1,maxTop:0});
            //提交
            $(".Ev-setSubmitBtn").off("click").on("click",function(){
                if($.trim(textareaVal.val())&&comm.getByteLen($.trim(textareaVal.val()))>=10){
                    if($(this).attr("data-flag")==1){
                        $(this).attr("data-flag","0");
                        var param={};
                        param.customerId=obj.cid;
                        param.suggestion=textareaVal.val();
                        param.customerName=obj.userName.text();
                        param.suggestionType=1;
                        param.visitSiteId=1;//1.PC 2.h5
                        $.ajax({
                            url:path.sugSubmit,
                            type:"POST",
                            data:{paramJson: $.toJSON(param)},
                            dataType:"json",
                            success:function(data){
                                if(data&&data.responseObject&&data.responseObject.responseStatus){
                                    $("#Ev-settingSugNum").text("500");
                                    $.topTip({mark:"success",showTime:"3",content:"感谢您的反馈，我们会尽快处理！"});
                                    textareaVal.val("");
                                }else{
                                    $.topTip({mark:"warn",showTime:"3",content:"提交失败，请稍后重试！"});
                                }
                                $(".Ev-setSubmitBtn").attr("data-flag","1");
                            }
                        });
                       // comm.Log.createBrowse({href:location.href,id:113,name:'意见反馈'});
                    }
                }else{
                    if($.trim(textareaVal.val())&&comm.getByteLen($.trim(textareaVal.val()))<=10){
                        $.topTip({mark:"warn",showTime:"3",content:"请至少输入5个字！"});
                    }else{
                        $.topTip({mark:"warn",showTime:"3",content:"请填写反馈内容！"});
                    }
                }
                return false;
            });
            //取消
            $(".Ev-setCancelBtn").off("click").on("click",function(){
                if(textareaVal.val()!=""){
                    textareaVal.val("");
                    $("#Ev-settingSugNum").text("500");
                    //事件埋点
                    comm.creatEvent({
                        triggerType:"全站功能按钮点击",
                        keyword:"意见反馈取消",
                        browType:113,
                        actionId:45
                    });
                }
                return false;
            });
      }
    };

});
