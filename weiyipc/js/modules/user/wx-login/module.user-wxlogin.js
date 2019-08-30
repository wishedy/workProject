/**
 * 功能描述：微信绑定登录
 * 使用方法：module.userWXLogin(position);
 * 							position 位置
 *
 * 注意事件：
 * 引入来源：无
 *
 * Created by QiaoLiang on 2015-09-08.
 */
var module  = module || {};

module.userWXLogin = function(position){

	function validateShowErr(element, error) {
		var p = $(element).parents(".inputParent");
		var con = p.find(".l_warning");
		con.empty();
		con.append("<span></span>");
		con.find("span").html(error);
		con.show();
		p.find(".ok").hide();
		p.find(".input-border").addClass("input-error");
		p.find(".jinggao").show();
		$(element).parent().parent().addClass("input-error");
	}

	function validateHideErr(element) {
		var p = $(element).parents(".inputParent");
		var con = p.find(".l_warning");
		p.find(".jinggao").hide();
		p.find(".ok").show();
		p.find(".input-border").removeClass("input-error");
		con.hide();
		$(element).parents(".input-error").removeClass("input-error");
		$(element).parents(".l_warning").empty();
	}

	var controller = {
		path : {
			checkIsBindWX : PC_CALL+"wx/allin/interact/checkIfBind/",
			loginBindWX : PC_CALL+"wx/allin/interact/loginBind/",
			registBindWX : PC_CALL+"wx/allin/interact/registBind/",
			regist : PC_CALL+"web/user/userRegist/",
			login : PC_CALL+"passport/securitycheck"
		},
		clazz : { //外部类(css)
			//导航左右切换
			leftOn : ".wxlogin_left_on",
			leftOff : ".wxlogin_left_off",
			rightOn : ".wxlogin_right_on",
			rightOff : ".wxlogin_right_off",

			//error提示
			loginTips : ".wxlogin_error",
			registTips : ".wxregist_error"

			//登录样式
			//loginOn : "" 

		},
		el : { // 元素区
			loginRegist : ".wxlogin_toggle",
			login : ".evLoginAcc",
			regist : ".evNewReg",
			loginView : "#wxLoginForm",
			registView : "#wxRegistForm",
			loginViceTitle : ".evLoginViceTitle",
			registViceTitle : ".evRegistViceTitle",
			WXLogin : ".evWXLogin",
			WXRegistBind : ".evWXRegist",
			loginErrTips : ".wxlogin_tips",
			registErrTips : ".wxregist_tips"
		},
		template : function(){ // 模版
			return '<div class="wxlogin_title-area">'+
         	 '<div class="wxlogin_title evLoginViceTitle">你的微信还未绑定唯医帐号</div>'+
			 '<div class="wxlogin_title hide evRegistViceTitle">你的微信还未绑定唯医帐号</div>'+
          	 '<div class="wxlogin_vice-title evLoginViceTitle">轻松绑定，下次就可以使用微信快速登录</div>'+
          	 '<div class="wxlogin_regist-vice-tite hide evRegistViceTitle">轻松绑定，下次就可以使用微信快速登录</div>'+
      	 '</div>'+
      	 '<div class="wxlogin_toggle">'+
      			'<div class="evLoginAcc wxlogin_left_on">已有唯医帐号</div>'+
      			'<div class="evNewReg wxlogin_right_off">新用户注册</div>'+
      	 '</div> '+

         '<form action="" id="wxLoginForm">'+
              '<div class="wxlogin_error hide"><img src="//modules.allinmd.cn/user/images/jinggao2.png" alt=""/>'+
                  '<div class="error_biao wxlogin_tips" style="font-size: 12px;">用户名或密码不正确。是否<span class="Ev-indexCantLogin" style="text-align: right;"><a href="javascript:;" style="color: #3484c9;font-size: 12px;">无法登录？</a></span></div> '+
              '</div> '+
              '<div class="inputParent login_input">'+
              	'<div style="background-color:#fff;">'+
                  '<div class=" input-wrap input-border ">'+
                      '<div class="warn hide"></div> '+
                      '<div class="succ hide"></div> '+
					  '<span class="loginSpan" style="margin:16px 14px 0;"></span>'+
                      '<input type="text" name="loginEmail" placeholder="邮箱或已验证手机" maxlength="50" style="width:271px;padding-left:0;"/>'+
                  '</div> '+
                 '</div> '+
                  '<div class="l_warning" style="font-size: 12px;"></div>'+
              '</div>'+
			  //'<div class="weixinlogin_traffic">什么是<a href="/pages/help/allin_pass.html">唯医通行证？</a></div>'+
              '<div class="inputParent password_input">'+
              '<div style="background-color:#fff;">'+
                  '<div class=" input-wrap input-border "> '+
                      '<div class="warn hide"></div> '+
                      '<div class="succ hide"></div> '+
					  '<span class="loginPwdSpan" style="margin:16px 14px 0;"></span>'+
                      '<input type="password" name="loginPasswd" placeholder="请输入密码" maxlength="20" style="width:271px;padding-left:0;"/>'+
                  '</div> '+
                  '</div> '+
                  '<div class="l_warning" style="font-size: 12px;"></div>'+
              '</div> '+
              '<div class="Ev-indexCantLogin" style="text-align:right;"><a href="javascript:;" style="color: #3484c9;font-size:12px;">无法登录？</a></div>'+
              '<div class="login_but"><div class="v2-blue-btn v2-login evWXLogin">立即绑定</div></div>'+
        '</form>'+

		'<form action="" id="wxRegistForm" class="hide">'+
		 	  '<div class="wxregist_error hide"><img src="//modules.allinmd.cn/user/images/jinggao2.png" alt=""/>'+
         		'<div class="error_biao wxregist_tips" style="font-size: 12px;">验证码不正确，请重新确认！</div> '+
         	  '</div> '+
              '<div class="inputParent login_input"> '+
              '<div style="background-color:#fff;">'+
                  '<div class=" input-wrap input-border ">'+
                      '<div class="warn hide"></div> '+
                      '<div class="succ hide"></div> '+
					  '<span class="loginSpan" style="margin:16px 14px 0;"></span>'+
                      '<input type="text" name="registEmail" id="registEmail" placeholder="手机号或邮箱" maxlength="50" style="width:271px;padding-left:0;"/>'+
                  '</div> '+
                  '</div> '+
                  '<div class="l_warning" style="background-color:bule;font-size: 12px;"></div>'+
              '</div> '+
              '<div class="inputParent password_input">'+
              '<div style="background-color:#fff;">'+
                  '<div class=" input-wrap input-border "> '+
                      '<div class="warn hide"></div> '+
                      '<div class="succ hide"></div> '+
					  '<span class="loginPwdSpan" style="margin:16px 14px 0;"></span>'+
                      '<input type="text" name="registPasswd" placeholder="设置密码（至少6位）" maxlength="20" style="width:271px;padding-left:0;"/> '+
                  '</div> '+
                  '</div> '+
                  '<div class="l_warning" style="font-size: 12px;"></div>'+
              '</div>'+
          	  '<div class="Ev-validCodeAppear placeHolderStyle" style="display:none;">'+
          	  	'<div style="height: 48px;margin-bottom: 15px;width: 178px;float: left;color: #9eafc2;padding-left: 15px;border: 1px solid #C2CAD3;border-radius: 4px;line-height: 48px; background-color:#fff;">'+
          	  		'<input style="font-size: 16px;float: left;color: #7a8795 !important;line-height: 46px;border: none;" type="text" name="validCode" placeholder="请输入验证码" class="font_yahei" >'+
          	  	'</div>'+
          	  	'<div class="Ev-SendSms" data-status="unlock" style="margin-bottom: 15px;width: 123px;border: 1px solid #dcdcdc;border-radius: 4px;float: left;text-align: center;line-height: 48px;margin-left: 20px;background-color: #fbfbfb;">'+
          	  		'<a style="display: block;color: #565656;font-size: 16px;" href="javascript:;">发送验证码</a>'+
          	  	'</div>'+
          	  	'<div class="clear"></div>'+
          	  '</div>'+
              '<div class="forget_password font_song wxlogin_agree">'+
                  '我已阅读并同意 '+
                  '<a href="/pages/help/service.html" target="_blank">服务条款</a> 和'+
                  '<a href="/pages/help/statement.html" target="_blank">隐私声明</a>'+
              '</div>'+
              '<div class="login_but"><div class="v2-blue-btn v2-login evWXRegist">立即绑定</div></div>'+
        '</form>'+

	    '<div class="forget_password font_song wxlogin_reject">'+
           '<a href="#" onclick="javascript:history.go(-2);">残忍拒绝</a>'+
        '</div>';
		},
		init : function(position){
			var t = this;
			//先判断是否存在session 防乱入
			$(position).append(this.template());
			this.events.load(t);

			/*$('#registEmail').focus(function () {
			 if (!t.registBind) {
			 t.registBind = true;
			 $(this).autoMail({
			 emails: ['qq.com', '163.com', '126.com', 'sina.com', 'sohu.com', 'yahoo.cn', 'gmail.com', 'hotmail.com', 'live.cn']
			 });
			 }
			 });*/
		},
		events : {
			load : function(t){ //装载事件
				//this.bindActiveInput(t);
				this.bindCantLogin(t);
				this.bindRegistPhone(t);
				this.bindSendSMS(t);
				this.toggleTab();
				this.login();
				this.regist();
			},
			/* 激活输入框 */
			bindActiveInput: function(t){
				$(t.el.loginView+","+t.el.registView).find("input").on("input", function(){
					var imgSrc; whatEle= $(this).attr("name");
					if(whatEle === "loginEmail" || whatEle === "registEmail"){
						if($.trim($(this).val()).length > 0){
							imgSrc= "//img00.allinmd.cn/weixin/inputUserActive.png";
						}else {
							imgSrc= "//img00.allinmd.cn/weixin/inputUser.png";
						}
					}else if(whatEle === "loginPasswd" || whatEle === "registPasswd"){
						if($.trim($(this).val()).length > 0){
							imgSrc= "//img00.allinmd.cn/weixin/inputPasswdActive.png";
						}else {
							imgSrc= "//img00.allinmd.cn/weixin/inputPasswd.png";
						}
					}

					if(whatEle !== "validCode"){
						$(this).parent().css("background","url("+imgSrc+") no-repeat 10px 16px");
					}
				});
			},
			//手机号时出现验证码
			bindRegistPhone: function(t){
				$(t.el.registView).find("#registEmail").on("input", function(){
					if($.trim($(this).val()).length === 11){
						// var phoneReg = /^(127|13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
						var phoneReg = /^1\d{10}$/;
						var isPhone = phoneReg.test($.trim($(this).val()));
						if(isPhone) {
							$(".Ev-validCodeAppear").show();
						}
					}else{
						$(".Ev-validCodeAppear").hide();
					}
				});
			},
			/* 无法登录 */
			bindCantLogin: function (t) {
				$(t.el.loginView).find(".Ev-indexCantLogin").on("click", function () {
					module.findPassword_v2();
				});
			},
			/* 发送短信验证码 */
			bindSendSMS: function(_this){
				$(_this.el.registView).find(".Ev-SendSms").on("click",function(){
					var type = comm.checkAccountType($.trim($("#registPhone").val()));
					if (type == "mobile") {
						$(this).attr("data-status","unlock");
					}
					if($(this).attr("data-status") === "unlock"){
						var url= PC_CALL+"customer/verification/sendSms/";
                        var timestamp = new Date().getTime();
						var params= {};
							params.paramJson= $.toJSON({
								siteId:1,
								account: $.trim($("#registEmail").val()),
								isNew:1,
								codeLength:4,
                                timestamp:timestamp,
                                ALLINACCESSTOKEN: comm.allinaccesstoken(timestamp,$.trim($("#registEmail").val()))
							});
						var promise= $.ajax({url: url,data: params});
						var callback= {
							succ:function(data){
								if(!data.responseObject.responseStatus){
									alert(data.responseObject.responseMessage);
								}else{
									$(".Ev-SendSms").attr("data-status","lock");
									countdown(60);
								}
							}
						};
						promise.done(callback.succ);
					}
				});

				function countdown(t){
					$(".Ev-SendSms a").text(t+"秒后重新获取");
					var s= setInterval(function(){
						$(".Ev-SendSms a").text(($(".Ev-SendSms").text().match(/\d*/g).join("")-1)+"秒后重新获取");
						if($(".Ev-SendSms").text().match(/\d*/g).join("")==0){
							clearInterval(s);
							$(".Ev-SendSms>a").text("重新发送");
							$(".Ev-SendSms").attr("data-status","unlock");
						}
					},1000);
				}
			},
			toggleTab : function(){ //切换tab
				var t = controller;
				$(t.el.login).off("click").on("click",function(){ //登录
					if($(this).attr("class").indexOf(t.clazz.leftOn.substr(1)) === -1){ //状态未激活时
						$(this).addClass(t.comm.clipClassDot(t.clazz.leftOn)).removeClass(t.comm.clipClassDot(t.clazz.leftOff));
						$(t.clazz.rightOn).addClass(t.comm.clipClassDot(t.clazz.rightOff)).removeClass(t.comm.clipClassDot(t.clazz.rightOn));

						$(t.el.loginRegist).removeAttr("style");
						$(t.el.loginViceTitle).removeClass("hide");
						$(t.el.registViceTitle).addClass("hide");
						$(t.el.loginView).removeClass("hide");
						$(t.el.registView).addClass("hide");
					}
				});

				$(t.el.regist).off("click").on("click",function(){ //注册
					if($(this).attr("class").indexOf(t.clazz.rightOn.substr(1)) === -1){ //状态未激活时
						$(this).addClass(t.comm.clipClassDot(t.clazz.rightOn)).removeClass(t.comm.clipClassDot(t.clazz.rightOff));
						$(t.clazz.leftOn).addClass(t.comm.clipClassDot(t.clazz.leftOff)).removeClass(t.comm.clipClassDot(t.clazz.leftOn));

						//$(t.el.loginRegist).css({"margin-top":"90px"});
						$(t.el.loginViceTitle).addClass("hide");
						$(t.el.registViceTitle).removeClass("hide");
						$(t.el.loginView).addClass("hide");
						$(t.el.registView).removeClass("hide");
					}
				});
			},
			login : function(){ //登录绑定
				var t = controller;

				$("#wxLoginForm").validate({
					submitHandler: function () {
						LoginSubmit();
					},
					rules: {
						"loginEmail": {
							"required": true,
							"emailOrPhone": true,
							"rangelength": [ 1, 50 ]
						},
						"loginPasswd": {
							"required": true,
							"rangelength": [ 6, 20 ]
						}
					},
					messages: {
						"loginEmail": {
							"required": "请填写邮箱或已验证手机。",
							"emailOrPhone": "请输入正确的手机号或邮箱。",
							"rangelength": "最多可输入50个字符。"
						},
						"loginPasswd": {
							"required": "请填写密码。",
							"rangelength": "密码长度在{0}-{1}位！",
							"remote": "不正确的帐号或密码,请重新输入！"
						}
					},
					errorPlacement: function (error, element) {
						validateShowErr(element, error);
					},
					success: function (element) {
						validateHideErr(element);
					},
					onkeyup: false,
					onsubmit: true

				});
				$(t.el.WXLogin).off("click").on("click", function () {
					$("#wxLoginForm").submit();
				});
				function LoginSubmit(){
					comm.LightBox.showloading();
					var loginParam = {};
					loginParam.url = t.path.login;
					loginParam.data = {};

					var email = $("[name=loginEmail]").val();
					var password = $("[name=loginPasswd]").val();
					var type = comm.checkAccountType(email);
					loginParam.data.j_username = "website;" + email + ";" + password + ";" + type;
					loginParam.data.j_password = password;
					loginParam.data.rememberMe = 1;

					var result = t.comm.ajax(loginParam);
					result = typeof result === "string" ? $.parseJSON(result) : result;

					if(result.responseObject.responseStatus){ //登录成功
						t.events.WXBindANDRegistComm("login");
					}else{ //登录失败
						comm.LightBox.hideloading();
						$(t.clazz.loginTips).removeClass("hide");
					}
				}
			},
			regist : function(){ //注册绑定
				var t = controller;
				var validateReg = {
					submitHandler: function () {
						registSubmit();
					},
					rules: {
						"registEmail": {
							"required": true,
							"emailOrPhone": true,
							"rangelength": [ 1, 50 ],
							"remote": {
								"url": PC_CALL+"customer/unite/isValidateAccount/",
								"type": "POST",
								"data": { "account": function () {
									return $("#registEmail").val();
								} }
							}
						},
						"registPasswd": {
							"required": true,
							"rangelength": [6, 20],
							"chrnum": true
						}

					},
					messages: {
						"registEmail": {
							"required": "请填写手机号或邮箱。",
							"emailOrPhone": "请填写正确的手机号或邮箱。",
							"rangelength": "最多可输入50个字符。",
							"remote": function () {
								var type = comm.checkAccountType($.trim($("#popEmail").val()));
								if (type != "email") {
									$("#getmesg").off("click");
								}
								return "此邮箱或手机号已被注册。<span>想要 " + //(type === "email" ? "邮箱" : "手机")
									"<a href='javascript:void(0)' class='login-btn' onclick='$(\".evLoginAcc\").click();'>登录</a> 或 " +
									"<a href='javascript:void(0)' onclick='module.findPassword_v2()'>恢复密码</a> 吗？</span>";
							}
						},
						"registPasswd": {
							"required": "请填写密码。",
							"rangelength": "密码长度请保持在{0}-{1}位！",
							"chrnum":"字母、数字或符号的组合！"
						}


					},
					errorPlacement: function (error, element) {
						validateShowErr(element, error);
					},
					success: function (element) {
						validateHideErr(element);
					},
					onkeyup: false,
					onsubmit: true
				};
				// 较验
				$("#wxRegistForm").validate(validateReg);

				$(t.el.WXRegistBind).off("click").on("click",function() {
					$("#wxRegistForm").submit();
				});

				function registSubmit(){
					comm.LightBox.showloading();
					var registParam = {};
					registParam.url = t.path.regist;
					registParam.data = {};

					var account = $("[name=registEmail]").val();
					var data = {
						account: $.trim(account),
						type: comm.checkAccountType(account),
						passwd: $.trim($("[name=registPasswd]").val()),
						ref: "",
						validCode: $.trim($("[name=validCode]").val())
					};
					registParam.data.paramJson = $.toJSON(data);

					var result = t.comm.ajax(registParam);
					result = typeof result === "string" ? $.parseJSON(result) : result;

					if(result.responseObject.responseStatus){ //注册成功
						t.events.WXBindANDRegistComm("regist");
					}else{ //注册失败
						$(t.clazz.registTips).removeClass("hide");
						comm.LightBox.hideloading();
					}
				}
			},
			WXBindANDRegistComm : function(type){
				var t = controller;
				var param = {};
				param.url = t.path.checkIsBindWX; //TODO :
				param.data = {};
				var result = t.comm.ajax(param);
				result = typeof result === "string" ? $.parseJSON(result) : result;

				var errTips = "",clazz = "";
				if(type === "regist"){
					errTips = $(t.el.registErrTips);
					clazz = $(t.clazz.registTips);
					param.url = t.path.registBindWX;
				}else{
					errTips = $(t.el.loginErrTips);
					clazz = $(t.clazz.loginTips);
					param.url = t.path.loginBindWX;
				}

				if(!result.responseObject.responseStatus){ //未绑定过
					var isBindWX = t.comm.ajax(param);
					if(isBindWX.responseObject.responseStatus){ //绑定成功
						//发送邮件 如果注册为邮箱时发送邮件
						comm.authInfo=null;//清除authInfo
						var account= $(t.el.registView).find("[name=registEmail]").val();
						comm.LightBox.hideloading();
						$.ajax({
							type: 'POST',
							url: PC_CALL + "customer/unite/getCustomerUnite/",
							dataType: 'json',
							async: false,
							success: function (rep) {
								if (rep && rep.responseObject) {
									unite = rep.responseObject;
									if (unite != null && unite != undefined) {
										TempCache.setItem("platformType",unite.platformType);//1唯医 2医栈 3医鼎
									}
								}
							},
							error: function (XMLHttpRequest, textStatus, errorThrown) {
							}
						});
						t.events.registerSuccess();
						if(type === "regist" && comm.checkAccountType(account)=== "email"){
							// 注册成功后发送验证邮箱邮件
							$.ajax({
								url: PC_CALL + "customer/reset/password/sendPasswordEmail/",
								type: "POST",
								data: {
									paramJson: $.toJSON({resetSite: 7, email: account, applySource: 1})
								},
								success: function (data) {  // 发送邮件成功
									//location.href="/";
								},
								error: function(err){
									location.href="/";
								}
							});
						}

					}else{//绑定失败
                        $.ajax({
                            type: 'POST',
                            url: PC_CALL + "customer/unite/logout/",
                            cache: false,
                            dataType: 'json',
                            success: function (rep) {
                                if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                                    TempCache.clear();
                                }
                            }
                        });
						errTips.html("绑定失败！").show();
						clazz.removeClass("hide");
						comm.LightBox.hideloading();
					}
				}else{ //已绑过 报提示
                    $.ajax({
                        type: 'POST',
                        url: PC_CALL + "customer/unite/logout/",
                        cache: false,
                        dataType: 'json',
                        success: function (rep) {
                            if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                                TempCache.clear();
                            }
                        }
                    });
					errTips.html("此邮箱（手机）已绑定过微信！").show();
					clazz.removeClass("hide");
					comm.LightBox.hideloading();
				}
			},
			//通行证创建(注册)成功
			registerSuccess:function(){
				history.go(-2);
				/*comm.LightBox.show(60,"#000");
				comm.LightBox.setZIndex(8);
				$("body").append('<section class="alPopupMain ev_trafficPop">'+
				'<figure class="close ev_trafficClose"><i></i></figure>'+
				'<article class="passSuccess"><i></i>成功创建了唯医通行证</article>'+
				'<article class="passSuccessText">您可使用通行证登录唯医、医栈、医鼎</article>'+
				'<button class="know ev_trafficClose">知道了</button>'+
				'</section>');
				comm.setCenter($(".ev_trafficPop"));
				$(".ev_trafficPop").css("zIndex",9);
				$(".ev_trafficClose").on("click",function(){
					$(".ev_trafficPop").remove();*/
					//取到需要的权限做是否认证的依据
					/*var privilegeScene=TempCache.getItem("privilegeScene");
					TempCache.removeItem("privilegeScene");
					if(privilegeScene!="undefined"){
						user.login({
							callback: function () {

							},
							onLoginClose: function () { // 取消登录   在这里可以理解为登录后的完善资料的跳过按钮
								history.go(-2);
							},
							onAuthCancel:"back",
							scene:privilegeScene||privilegeSceneConst.eSceneTypeLogin
						});
					}*/
					/*if($(this).hasClass("close")){
						//事件埋点
						comm.creatEvent({
							triggerType:"全站功能按钮点击",
							keyword:"唯医通行证确认弹层关闭",
							actionId:43
						});
					}
				})*/
			}
		},
		comm : {
			clipClassDot : function(str){
				return str.substr(1);
			},
			ajax : function(obj){
				var result = {};
				$.ajax({
					url : obj.url,
					type : "POST",
					data : obj.data,
					async : false,
					success : function(data){
						result = data;
					}
				});
				return result;
			}
		}

	}

	controller.init(position);
};

//module.userWXLogin(".login_content");