/**
 * Created by liuyutao on 2015/9/3.
 */
module.findPassword_v2 = function (options) {
    var validData = {
        validCode: "",
        validCodeId: ""
    };
	var controller = {
		el: {
			close: null,
			back: null,
			main: null
		},
		init: function () {
			var t = this;
			t.showSelect();
		},
		config: {
			numberOfMessageInOneDay: 3,
			numberOfQuickLoginMessageInOneDay: 3 // TODO:it should be 4
		},
		path: {
			sendFindPasswdEmail: PC_CALL+"customer/reset/password/sendPasswordEmail/",// 发送找回密码邮件
			sendFindPasswdMobile: PC_CALL+"customer/reset/password/sendPasswordMobile/",// 发送找回密码手机验证码
			updatePasswd: PC_CALL+"customer/reset/password/updatePassword/",			// 更新密码
			getCount: PC_CALL+"customer/reset/password/getCount/",					// 获取发送过的短信次数
			validSMSMobile: PC_CALL+"customer/verification/validSms/",
			validSMSEmail: PC_CALL+"customer/verification/validEmailCode/"

		},
		templates: {
			initSelect: function () {
				return '<div class="title">无法登录</div>' +
					'<div class="text">医师你好，我们提供以下两种方式帮助你登录唯医</div>' +
					'<div class="btn find-back">找回密码</div>' +
					'<div class="btn phone-quick">手机验证码快速登录</div>';
			},
			/* 找回密码 */
			findBack: function () {
				return '<div class="title">找回密码</div>' +
					'<div class="text">医师你好，验证信息将发至你注册的手机或邮箱中</div>' +
					'<div class="username">' +
					'	<div class="input-parent" style="background: url(//modules.allinmd.cn/find-password-v2/images/user.png) 15px center no-repeat;height:38px; padding-left:43px;">' +
					'		<input type="text" name="email" id="mFindBackEmail" placeholder="手机号或邮箱" style="background: none;padding-left:0;"/>' +
					'	</div>' +
					'	<div class="valid-error"></div>' +
					'</div>' +
					'<div class="btn sendValidSMS">发送验证</div>';
			},

			/*重置密码*/
			resetPassword: function (email, type) {
				return '<div class="title">重置密码</div>' +
					'<div class="text">医师你好，验证信息已发至你的' + type + '请查收！</div>' +
					'<div class="username disable">' +
					'	<div class="input-parent">' +
					'		<input type="text" name="phoneQuick" disabled id="mPhoneQuick" value="' + email + '"/>' +
					'	</div>' +
					'</div>' +
					'<div class="password ev_password">' +
					'	<div class="input-parent" style="background:url(//modules.allinmd.cn/find-password-v2/images/pwd.png) no-repeat 15px center;height:38px; padding-left:43px;">' +
					'		<input type="text" name="password" id="mResetPassword" placeholder="设置密码（最少六位）" style="background: none;padding-left:0;"/>' +
					'       <div class="changePwd clear-pwd ev-changePwd"></div>'+
					'	</div>' +
					'	<div class="valid-error"></div>' +
					'	<div class="clear"></div>' +
					'</div>' +
					'<div class="password ev_repassword" style="margin-top: 0;">' +
					'	<div class="input-parent" style="background:url(//modules.allinmd.cn/find-password-v2/images/pwd.png) no-repeat 15px center;height:38px; padding-left:43px;">' +
					'		<input type="password" name="repassword" placeholder="确认密码" style="background: none;padding-left:0;"/>' +
					'	</div>' +
					'	<div class="valid-error"></div>' +
					'	<div class="clear"></div>' +
					'</div>' +
					'<div class="validate-box">' +
					'	<div class="code w-100">' +
					'		<div class="input-parent">' +
					'			<input type="text" placeholder="验证码" name="validCode" id="mFindValidCode"/>' +
					'		</div>' +
					'	</div>' +
					'	<div class="resend w-160">重新发送<span>(今天剩余2次)</span></div>' +
					'	<div class="clear"></div>' +
					'	<div class="valid-error"></div>' +
					'</div>' +

					'<div class="btn reset-confirm">确定重置</div>';
			},
			/* 手机快速登录 */
			phoneQuick: function () {
				return '<div class="title">手机快捷登录唯医</div>' +
					'<div class="text">医师您好，验证信息将发至你注册的手机号中</div>' +
					'<div class="username">' +
					'	<div class="input-parent" style="background: url(//modules.allinmd.cn/find-password-v2/images/user.png) 15px center no-repeat;height:38px; padding-left:43px;">' +
					'		<input type="text" name="phoneQuick" placeholder="已验证手机号" id="mPhoneQuick" style="background: none; padding-left:0;"/>' +
					'	</div>' +
					'<div class="valid-error"></div>' +
					'</div>' +
					'<div class="btn phone-quick">手机验证码快速登录</div>';
			},
			phoneQuickLogin: function (phone) {
				return '<div class="title">手机快捷登录唯医</div>' +
					'<div class="text">医师您好，验证信息已发至你的手机请查收！</div>' +
					'<div class="username disable">' +
					'	<div class="input-parent">' +
					'		<input type="text" name="phoneQuick" id="mPhoneQuick" disabled value="' + phone + '"/>' +
					'	</div>' +
					'</div>' +
					'<div class="validate-box" style="margin-top: 8px;">' +
					'	<div class="code w-100">' +
					'		<div class="input-parent">' +
					'			<input type="text"  placeholder="验证码" name="validCode" id="mFindValidCode" />' +
					'		</div>' +
					'	</div>' +
					'	<div class="resend w-160">重新发送</div>' +
					'	<div class="clear"></div>' +
					'	<div class="valid-error"></div>' +
					'</div>' +

					'<div class="btn phone-quick">登录唯医</div>';
			}
		},
		/**
		 * 选择找回密码，还是快速登录
		 */
		showSelect: function () {
			var t = this;
			$("body").append('	<div class="m-findPwd-pop">' +
				'				<div class="mask"></div>' +
				'          		<div class="center-box">' +
				'					<div class="top"></div>' +
				'          			<div class="close"></div>' +
				'          			<div class="back"></div>' +
				'					<div class="content"></div>' +
				'				</div>' +
				'         	</div>');


			t.el.main = $(".m-findPwd-pop");
			t.el.close = $(".close", t.el.main);
			$("body").css("overflow", "hidden");
			t.el.close.on("click", function () {
				t.close();
				//事件埋点
				comm.creatEvent({
					triggerType:"全站功能按钮点击",
					keyword:"找回密码关闭",
					browType:74,
					actionId:43
				});
			});
			setTimeout(function () {
				t.setPosition();
			},10);
			t.bindResize();
			t.bindSelect();
		},

		bindSelect: function () {
			var t = this;
			t.el.main.find(".content").html(t.templates.initSelect());
			t.el.main.find(".find-back").on("click", function () {
				t.changeFindBack();
			});
			t.el.main.find(".phone-quick").on("click", function () {
				t.changePhoneQuick();
			});
			t.el.main.find(".back").hide()
		},

		/**
		 * 跳转到 找回密码界面
		 * */
		changeFindBack: function (account) {
			var t = this;
			t.el.main.find(".content").html(t.templates.findBack());
			if(comm.Log){
				comm.Log.createBrowse({href:location.href,id:76,name:'手机验证-输入手机号'});
			}
			if(account){
				 $("#mFindBackEmail").val(account);
			}
			t.bindActiveInput();
			t.el.main.find(".back").show().on("click", function () {
				t.bindSelect();
			});
			// 发送按钮
			t.el.main.find(".sendValidSMS").on("click", function () {
				var account = $.trim($("#mFindBackEmail").val());
				var errors = "", number,
					/*是否已注册过*/
					registFlag=false;
				if (account == "" || account == null) {
					errors = "<span class='errBg'></span>请填写手机号或邮箱。"
				} else {
					if (account.length > 50) {
						errors = "<span class='errBg'></span>最长50个字符。"
					} else {
						if (!account.match(/.*@.+\..+/) && !account.match(/^1\d{10}$/)) {
							errors = "<span class='errBg'></span>请填写正确的手机号或邮箱。";
						} else {
							if (!t.checkAccountExist(account)) {	// 未注册用户
								errors = "<span class='errBg'></span>无此账户，想要<span>注册</span>吗？";
								registFlag = true;
							} else {
								number = t.getTodaySendedSMSNumber(account, "find-back");
								if (number >= t.config.numberOfMessageInOneDay) { // 超出限制
									errors = "<span class='errBg'></span>今日您找回密码请求已超出限制次数";
								}
							}
						}
					}
				}
			
				if (errors != "") {
					t.el.main.find(".valid-error").html(errors).show();
					//已注册过
					if(registFlag){  // 注册界面
						t.el.main.find(".valid-error").find("span").on("click", function () {
							if($("#allinRegist").size()>0){   // 普通登录弹层里的 注册tab点击。
								 $(".login_caos").click();
							}

							if($(".wxlogin_toggle").size()>0){ // 微信登录绑定 里的注册tab 点击
								$(".wxlogin_toggle").find(".evNewReg").click();
							}
							t.close();
						});
					}
					t.el.main.find(".username .input-parent").addClass("input-error");
				} else {
					t.el.main.find(".valid-error").hide();
					t.sendValidSMS(account, 'find-back');
				}
				t.resetHeight();
			});
		},

		/**
		 * 发送验证码 邮箱或手机
		 * @param account {String} 帐号
		 * @param action {String} 发送的类型 find-back|quick-login
		 * @param resend {Boolean} 是否重发
		 */
		sendValidSMS: function (account, action, resend) {
			var t = this;
			var type = comm.checkAccountType(account);
			var url = "";
			var param = {};
		
			comm.LightBox.showloading();
			if (type == "email") {
				url = t.path.sendFindPasswdEmail;
				param.email = account;
				param.applySource = 1;
				param.isNew = 1;
				param.codeLength = 4;
			} else {
				url = t.path.sendFindPasswdMobile;
				param.account = account;
				param.siteId = 1;
				param.codeLength = 4;
				param.typeId = 3;
				param.isNew = 1;
			}
			if (action == "quick-login") { // 快速登录发送验证码
				param.resetSite = 7;
			} else {
				param.resetSite = 1;
			}
			$.ajax({
				url: url,
				type: "POST",
				data: {
					paramJson: $.toJSON(param)
				},
				dataType: "JSON",
				success: function (data) {
					comm.LightBox.hideloading();
					if (data && data.responseObject && data.responseObject.responseStatus) {
						var itemId = data.responseObject.responsePk;
                        validData.validCode = data.responseObject.responseData.validCode?data.responseObject.responseData.validCode:"";
                        validData.validCodeId = data.responseObject.responseData.validCodeId?data.responseObject.responseData.validCodeId:"";
						var customerId = data.responseObject.responseData.customerId;
						// 发送成功
					
						// 第一次发送时 跳转到下个界面
						if (resend) {// 重新发送

						} else {
							if (action && action == "quick-login") { // 快速登录
								t.changeQuickLogin(account, itemId, customerId);
							} else {	// 找回密码
								t.changeResetPassword(account, type, itemId, customerId);
							}
						}

					} else {
						// TODO: 发送失败
						var text="";
                        if (type == "email"){
                        	text="发送失败，该邮箱未验证。";
						} else {
                        	text="发送失败，该手机号未验证。";
						}
						t.el.main.find(".valid-error").html(text).show();
					}
				}
			});
		},

		/**
		 * 切换到重置密码
		 * @param account
		 * @param type
		 * @param itemId
		 * @param customerId
		 */
		changeResetPassword: function (account, type, itemId, customerId) {
			var t = this;
			var str = (type == "email" ? "邮箱" : "手机");
			t.el.main.find(".content").html(t.templates.resetPassword(account, str));
			/*if(comm.Log){弹层先不加日志
				comm.Log.createBrowse({href:location.href,id:75,name:'找回密码-重设置密码'});
			}*/
			var changeBtn= t.el.main.find(".ev-changePwd");
			changeBtn.on("click",function(){
				if(t.el.main.find("[name=password]").val()){
					if($(this).hasClass("clear-pwd")){
						$("#mResetPassword")[0].type = "password";
						$(this).removeClass("clear-pwd").addClass("cipher-pwd");
					}else{
						$("#mResetPassword")[0].type = "text";
						$(this).removeClass("cipher-pwd").addClass("clear-pwd");
					}
				}
			});
			var btn = t.el.main.find(".resend");
			t.countdown(btn, account, 'find-back'); // 计数完会绑定重新发送按钮
			t.bindActiveInput();

			// 返回按钮
			t.el.main.find(".back").off("click").show().on("click", function () {
				//t.bindSelect();
				t.changeFindBack(account);
			});

			/*// 更新重新发送按钮
			t.updateResendBtn(btn, account, "find-back");*/

			// 确认重置按钮
			t.el.main.find(".reset-confirm").on("click", function () {
				var password = $.trim(t.el.main.find("[name=password]").val());
				var rePassword = $.trim(t.el.main.find("[name=repassword]").val());//确认密码
				var code = $.trim(t.el.main.find("[name=validCode]").val());
				var pw_err = "", rePw_err = "", code_err = "";
				if (password == "" || password == null) {
					pw_err = "<span class='errBg'></span>请填写新密码。"
				} else {
					if (password.length < 6 || password.length > 20) {
						pw_err = "<span class='errBg'></span>密码长度请保持在6-20位！";
					}
				}

				if (rePassword == "" || rePassword == null) {
					rePw_err = "<span class='errBg'></span>请填写确认密码。"
				} else {
					if (rePassword!=password) {
						rePw_err = "<span class='errBg'></span>两次输入密码不一致！";
					}
				}

				if (code == "" || code == null) {
					code_err = "<span class='errBg'></span>请输入验证码";
				} else {
					if (code.length != 4) {
						code_err = "<span class='errBg'></span>请输入正确的验证码!";
					}
				}
				if (code_err == "" && pw_err == "" && rePw_err == "") {	// 无错
					t.validSMS(account, type, itemId, customerId, "find-back");
				} else {
					if (code_err != "") {
						$(".validate-box .valid-error").html(code_err).show();
						$(".validate-box .input-parent").addClass("input-error");
					} else {
						$(".validate-box .valid-error").hide();
						$(".validate-box .input-parent").removeClass("input-error");
					}
					if (pw_err != "") {
						$(".ev_password .valid-error").html(pw_err).show();
						$(".ev_password .input-parent").addClass("input-error");
					} else {
						$(".ev_password .valid-error").hide();
						$(".ev_password .input-parent").removeClass("input-error");
					}
					if (rePw_err != "") {
						$(".ev_repassword .valid-error").html(rePw_err).show();
						$(".ev_repassword .input-parent").addClass("input-error");
					} else {
						$(".ev_repassword .valid-error").hide();
						$(".ev_repassword .input-parent").removeClass("input-error");
					}
					t.resetHeight();
				}

			});
		},
		resetHeight: function () {
			var t = this;
			if(t.el.main.find(".content").height()>350){
				t.el.main.find(".center-box").height(500);
			}else{
				t.el.main.find(".center-box").height(465);
			}
			comm.setCenter(t.el.main.find(".center-box"),true);
		},
		/**
		 * 重新发送按钮
		 * @param account
		 * @param action "find-back"|"quick-login"
		 */
		updateResendBtn: function (btn, account, action) {
			var t = this;
			// 处理重新发送按钮
			var number = t.getTodaySendedSMSNumber(account, action);
			//var configNumber = (action=="find-back"?t.config.numberOfMessageInOneDay: t.config.numberOfQuickLoginMessageInOneDay);
			if (number >= t.config.numberOfMessageInOneDay) {// 发送次数已够
				if(action=="find-back"){	// 找回密码显示剩余次数
					btn.off("click")
						.html("重新发送<span>(今日剩余0次)");
				}else{
					btn.off("click")		// 快速登录 显示登录频繁
						.html("重新发送");
					t.el.main.find(".valid-error").text("您的登录过于频繁，请稍后再试").show();
				}
			} else {
			
				var str = (action=="quick-login"?"重新发送":"重新发送<span>(今日剩余" + (t.config.numberOfMessageInOneDay - number ) + "次)");
				btn.on("click", function () {
					t.resend(btn, account, action);
				}).html(str);
			}
			t.counting = false;
		},

		/**
		 *
		 * @param btn
		 * @param account
		 */
		resend: function (btn, account, action) {
			var t = this;
			btn.off("click");
			t.countdown(btn, account, action);
			t.sendValidSMS(account, action, true);
		},

		/**
		 *
		 * @param btn
		 * @param account
		 * @param action
		 */
		countdown: function (btn, account, action) {
			var t = this;
			var time = 60;
			counting = true;
			btn.find("span").empty();
			btn.html(--time + "秒后重新获取");
			btn.off("click");
			var a = setInterval(function () {
				if (time > 0) {
					btn.html(--time + "秒后重新获取");
				} else {
					clearInterval(a);
					btn.removeClass("disabled");
					t.updateResendBtn(btn, account, action);
					counting = false;
				}
			}, 1000);
		},

		/**
		 * 较验验证码是否正确，及快速登录功能
		 * @param account
		 * @param type
		 * @param itemId
		 * @param customerId
		 * @param action {String}  find-back|quick-login
		 */
		validSMS: function (account, type, itemId, customerId, action) {
			var t = this;
			var url, param = {};
			if (type == "email") {
				url = t.path.validSMSEmail;
				param.email = account;
			} else {
				url = t.path.validSMSMobile;
				param.mobile = account;
			}
			param.validCode = t.el.main.find("#mFindValidCode").val();
			param.type = "customer_reset_password";
			if (action == "quick-login") {
				param.isNew = 1;
			}
			$.ajax({
				url: url,
				type: "POST",
				data: {
					paramJson: $.toJSON(param)
				},
				async: false,
				success: function (data) {
					if (data && data.responseObject && data.responseObject.responseStatus) {
						if (action == "find-back") {	// 找回密码
							t.resetPassword(itemId, customerId);
						} else {	// 快速登录 登录成功
							if(window.location.href.indexOf("regist")>0 || window.location.href.indexOf("login")>0){
								//regist 表示了微信登隶页面，login表示的联合登录界面。 若从这些页面的快速登录成功的话，则跳转。
                                g_sps.jump(null,"/");
							}else{  // 否则 刷新本页。
								window.location.reload();
							}
						}
					} else {
						if (action == "find-back") {	// 找回密码
							// 验证码错误
							t.el.main.find(".validate-box .valid-error").text("验证码错误！").show();
						} else {	// 快速登录
							t.el.main.find(".valid-error").text("验证码错误！").show();
						}
					}
				}
			});
		},

		/**
		 * 重置密码
		 * @param itemId
		 * @param customerId
		 */
		resetPassword: function (itemId, customerId) {
			var t = this;
			var data = {}, params = {};
			data.password = $.trim(t.el.main.find("[name=password]").val());
			data.customerId = customerId;
			data.resetSite = 1;
			data.itemId = itemId;
			data.validCodeId = validData.validCodeId;
			data.validCode = validData.validCode;
			data.flag = 1;
			$.ajax({
				url: t.path.updatePasswd,
				type: "POST",
				data: {
					paramJson: $.toJSON(data)
				},
				success: function (data) { // 修改成功。
					if (data && data.responseObject && data.responseObject.responseStatus) {
						alert("找回密码成功");
						comm.LightBox.hideloading();
						t.close();
					} else {
						// TODO: 修改失败
					}
				}
			});
		},

		/****************************** 快速登录 **************************************************/
		/**
		 * 打开快速登录
		 * */
		changePhoneQuick: function (account) {
			var t = this;
			t.el.main.find(".content").html(t.templates.phoneQuick());
			if(account){
				$("#mPhoneQuick").val(account);
			}
			t.bindActiveInput();
			t.el.main.find(".back").show().on("click", function () {
				t.bindSelect();
			});
			t.el.main.find(".phone-quick").on("click", function () {
				var account = $.trim($("#mPhoneQuick").val());
				var errors = "";
				if (account == "" || account == null) {
					errors = "<span class='errBg'></span>请填写手机号！";
				} else {
					if (!account.match(/^1\d{10}$/)) {
						errors = "<span class='errBg'></span>请填写正确的手机号";
					} else {
						if (!t.checkAccountExist(account)) { // 若不存在  // TODO: 不存在提示是否要注册
							errors = "<span class='errBg'></span>请输入已注册手机号!";
						} else {
							var number = t.getTodaySendedSMSNumber(account, "quick-login");
							if (number >= t.config.numberOfQuickLoginMessageInOneDay) {
								errors = "<span class='errBg'></span>您的登录过于频繁，请稍后再试";
							}
						}
					}
				}

				if (errors == "") {
					t.sendValidSMS(account, "quick-login");
				} else {
					t.el.main.find(".valid-error").html(errors).show();
					t.el.main.find(".username .input-parent").addClass("input-error");
				}
				t.resetHeight();
			})
		},

		/**
		 * 判断用户是否已存在
		 * @param phone {String}
		 * @returns {boolean} true 已存在，false 不存在
		 */
		checkAccountExist: function (phone) {
			var t = this;
			var rst = false; // 不存在
			$.ajax({
				url: PC_CALL+"customer/unite/isValidateAccount/",
				type: "POST",
				data: {"account": phone},
				async: false,
				success: function (data) {
					if (data && data.responseObject && !data.responseObject.responseStatus) {
						rst = true;// 已存在
					}
				}
			});
			return rst;
		},

		/**
		 * 跳转至验证码登录界面
		 * */
		changeQuickLogin: function (account, itemId, customerId) {
			var t = this;
		
			t.el.main.find(".content").html(t.templates.phoneQuickLogin(account));
			if(comm.Log){
				comm.Log.createBrowse({href:location.href,id:74,name:'找回密码-验证码输入'});
			}
			var btn = t.el.main.find(".resend");
			t.countdown(btn, account, 'quick-login'); // 倒计是结束时会重新绑定发送按钮
			t.bindActiveInput();

			// 返回按钮
			t.el.main.find(".back").off("click").show().on("click", function () {
				//t.bindSelect();
				t.changePhoneQuick(account);
			});

			// 更新重新发送按钮
			//t.updateResendBtn(btn, account, "quick-login");
			/*btn.on("click", function () {
				t.resend(btn, account, "quick-login");
			});*/


			// 验证码 改变 绑定 登按钮
			t.el.main.find("#mFindValidCode").on("change", function () {
				var code = $.trim($(this).val());
				var errors = "";
				if (code == "" || code == null) {
					errors = "<span class='errBg'></span>请输入验证码";
				} else {
					if (code.length != 4) {
						errors = "<span class='errBg'></span>请输入正确的验证码!";
					}
				}
				if (errors == "") { // 无错 快速登录
					t.el.main.find(".phone-quick").removeClass("disable").on("click", function () {
						t.validSMS(account, "mobile", itemId, customerId, "quick-login");
					});
				} else {
					t.el.main.find(".phone-quick").addClass("disable").off("click");
					t.el.main.find(".valid-error").html(errors).show();
					t.el.main.find(".code .input-parent").addClass("input-error");
				}
				t.resetHeight();
			});
			//	重新发送按钮
		},

		/**===================================================================*/
		/**
		 * 获取今天发送的次数
		 * */
		getTodaySendedSMSNumber: function (account, action) {
			var t = this;
			var rst = 0;
			$.ajax({
				url: t.path.getCount,
				type: "POST",
				async: false,
				data: {
					paramJson: $.toJSON({
						account: account,
						resetSite: (action == "quick-login" ? 7 : 1) // 区分找回密码，还是快速登录  // TODO: first should be 7
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

		setPosition: function () {
			var t = this;
			$(".m-findPwd-pop,.mask").css({
				width: $(window).width(),
				height: $(window).height()
			});
			comm.setCenter(controller.el.main.find(".center-box"),true);
		},

		bindActiveInput: function () {
			var t = this;
			t.el.main.find('input').on("focus", function () {
				$(this).parent().addClass("hover");
			});
			t.el.main.find('input').on("blur", function () {
				$(this).parent().removeClass("hover");
			});
		},

		/**
		 * 窗口改变大小
		 * */
		bindResize: function () {
			var t = this;
			$(window).bind("resize", t.setPosition);
		},

		/**
		 * 关闭弹窗
		 * */
		close: function () {
			var t = this;
			t.el.main.remove();
			if(!user.isRunning()){  // 若登录相关弹层正在显示
				$("body").css("overflow", "auto");
			}
			$(window).unbind("resize", t.resize);
			comm.LightBox.hide();
		}
	};

	controller.init();
};