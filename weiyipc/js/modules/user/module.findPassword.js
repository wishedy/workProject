module.findPassword = function () {
	//---------------忘记密码 发送邮件
	$("#resetPasswordEmailForm").validate({
		submitHandler: function () {
			SendEmail.submit();
		},
		rules: {
			"email": {
				"required": true,
				"allinEmail": true,
				"rangelength": [1, 50]
			}
		},
		messages: {
			"email": {
				"required": "登录邮箱必须输入！",
				"allinEmail": "不像是有效的电子邮箱。",
				"rangelength": "邮件地址不长于50位！"
			}
		},
		errorPlacement: function (error, element) {
			var p = $(element).parents(".inputParent");
			var con = p.find(".l_warning");
			con.append("<span></span>");
			con.find("span").html(error);
			p.find(".ok").hide();
			p.find(".jinggao").hide();
			p.find(".kuang").addClass("input_error");
			p.find(".jinggao").show();
			$(element).parent().parent().addClass("input_error");

		},
		success: function (element) {
			var p = $(element).parents(".inputParent");
			p.find(".jinggao").hide();
			p.find(".ok").show();
			p.find(".kuang").removeClass("input_error");
			$(element).parents(".input_error").removeClass("input_error");
			$(element).parent().parent().empty();

		},
		onkeyup: false
	});

	/** 又记起来了 */
	$("#rememberAgain").on("click", function () {
		user.login({
			callback: function () {
                g_sps.jump(null,"/");
			},
			scene: privilegeSceneConst.eSceneTypeLogin
		});
	});

	function bindActiveInput() {
		var t = this;
		$('input').on("focus", function () {
			$(this).parent().addClass("hover");
		});
		$('input').on("blur", function () {
			$(this).parent().removeClass("hover");
		});
	}

	bindActiveInput();


	var SendEmail = {
		form: '',
		submit: function () {
			var params = {};
			var data = {};
			data.email = $.trim($("#email").val());
			data.resetSite = $("#resetSite").val();
			data.applySource = 1;
			params.paramJson = $.toJSON(data);
			Common.showloading();

			$.ajax({
				type: 'POST',
				url: PC_CALL + "customer/reset/password/sendPasswordEmail/",
				cache: false,
				data: params,
				dataType: 'json',
				success: function (rep) {
					var message = rep.responseObject.responseMessage;
					if (rep && !rep.responseObject.responseStatus && rep.responseObject.responseCode == "0C0001") {
						Common.hideloading();
						alert("发送失败：" + message);
					} else {
						window.location = "/call/customer/reset/password/send_email_success/?email=" + message;
					}

				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					alert("邮件发送失败");
					Common.hideloading();
				}
			});
		}

	};

	//---------------提交重置密码
	$("#registForm").validate({
		submitHandler: function () {
			Register.submit();
		},
		rules: {
			"password": {
				"required": true,
				"rangelength": [6, 20],
				"chrnum": true
			},
			"passwordRepeat": {
				"required": true,
				"equalTo": "#password"
			}
		},
		messages: {
			"password": {
				"required": "请填写新密码。",
				"rangelength": "密码长度请保持在{0}-{1}位！"
			},
			"passwordRepeat": {
				"required": "请再次填写新密码。",
				"equalTo": "两次输入密码不一致！"
			}
		},
		errorPlacement: function (error, element) {
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
		},
		success: function (element) {
			var p = $(element).parents(".inputParent");
			var con = p.find(".l_warning");
			p.find(".jinggao").hide();
			p.find(".ok").show();
			p.find(".input-border").removeClass("input-error");
			con.hide();
			$(element).parents(".input-error").removeClass("input-error");
			$(element).parents(".l_warning").empty();
		}

	});


	//---------------提交重置密码
	$("#registFormNew").validate({
		submitHandler: function () {
			Register.submit();
		},
		rules: {
			"password": {
				"required": true,
				"rangelength": [6, 20],
				"chrnum": true
			}
		},
		messages: {
			"password": {
				"required": "请填写新密码。",
				"rangelength": "密码长度请保持在{0}-{1}位！"
			}
		},
		errorPlacement: function (error, element) {
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
		},
		success: function (element) {
			var p = $(element).parents(".inputParent");
			var con = p.find(".l_warning");
			p.find(".jinggao").hide();
			p.find(".ok").show();
			p.find(".input-border").removeClass("input-error");
			con.hide();
			$(element).parents(".input-error").removeClass("input-error");
			$(element).parents(".l_warning").empty();
		}

	});

	var Register = {
		form: '',
		submit: function () {
			var params = {};
			var data = {};
			data.password = $.trim($("#password").val());
			data.customerId = $("#customerId").val();
			data.resetSite = $("#resetSite").val();
			data.itemId = $("#itemId").val();
			params.paramJson = $.toJSON(data);

			var itemId = $("#itemId").val();
			if (itemId == -1) {
				alert("密码修改失败,请确保帐号正确！");
			} else {
				comm.LightBox.showloading();
				$.ajax({
					type: 'POST',
					url: PC_CALL + "customer/reset/password/updatePassword/",
					cache: false,
					data: params,
					dataType: 'json',
					success: function (rep) {
						if (rep) {
							if (rep.responseObject.responseStatus) {
								window.location = "/pages/singlePage/user/passport/reset_password_success.html";
							} else {
								alert("密码修改失败");
								comm.LightBox.hideloading();
							}
						} else {
							alert("密码修改失败");
							comm.LightBox.hideloading();
						}
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						alert("密码修改失败");
						comm.LightBox.hideloading();
					}
				});
			}

		}

	};

	$("#getmesg").on("click", getmsgHandle);

	function getmsgHandle() {

		$("#getmesg").off("click");
		$("#getmesg .btn").addClass("disabled");
		sendSms(1);
		countdownGetMsg();
	}

	function countdownGetMsg() {
		var t = 60;
		var a = setInterval(function () {
			if (t > 0) {
				$("#getmesg").text(t-- + "秒后重新获取");
			} else {
				clearInterval(a);
				$("#getmesg").removeClass("disabled");
				$("#getmesg").text("获取短信验证码");
				$("#getmesg").on("click", getmsgHandle);
			}
		}, 1000);
	}

	/**
	 * 跳转验证帐号页面
	 */
	function refAccount() {

		var account = $("#account").val();
		var emailPattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		// var mobilePattern = /^(127|13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/;
		var mobilePattern = /^1\d{10}$/;
		if (account !== "" && account !== null && (emailPattern.test(account) || mobilePattern.test(account))) {
			if (emailPattern.test(account)) {
				var params = {};
				var data = {};
				data.email = $.trim(account);
				data.resetSite = 1;
				data.applySource = 1;
				params.paramJson = $.toJSON(data);
				comm.LightBox.showloading();
				$.ajax({
					type: 'POST',
					url: PC_CALL + "customer/reset/password/sendPasswordEmail/",
					cache: false,
					data: params,
					dataType: 'json',
					success: function (rep) {
						window.location = PC_CALL + "customer/reset/password/send_email_success/?email=" + account;
					}
				});
				//customer.execute("/call/customer/reset/password/sendPasswordEmail/",data);

				//window.location="/call/customer/reset/password/send_account_input/?resetSite=1&type=email&account="+account;
			}
			if (mobilePattern.test(account)) {
				comm.customer.asyncExecute("getCustomerUnite", {
					account: account,
					mobile: account,
					isCheckMobile: 1
				}, function (obj) {
					if (obj === null || obj.isCheckMobile != 1) {
						$(".error_bg").show();
					} else {
						window.location = PC_CALL + "customer/reset/password/send_account_input/?resetSite=1&type=mobile&account=" + account;
					}
				});


			}
		} else {
			//alert("请输入正确的帐号！");

			$(".error_bg").show();
		}
	}

	/**
	 * 跳转手机找回页面
	 */
	function refMobile() {
		var mobile = $("#mobile").val();
		if (mobile && mobile !== "") {
			window.location = PC_CALL + "customer/reset/password/send_account_input/?resetSite=1&type=mobile&account=" + mobile;
		} else {
			window.location = "/pages/singlePage/user/passport/reset_password_account.html";
		}
	}

	/**
	 * 跳转手机找回页面
	 */
	function refToEmail() {
		var email = $("#email").val();
		if (email && email !== "") {
			window.location = PC_CALL + "customer/reset/password/send_account_input/?resetSite=1&type=email&account=" + email;
		} else {
			window.location = "/pages/singlePage/user/passport/reset_password_account.html";
		}
	}

	/**
	 * 发送手机验证吗
	 * @param siteId: 1-allin 2-caos
	 * @returns {Boolean}
	 */
	function sendSms(siteId) {
		var params = {};
		var data = {};
		data.siteId = siteId;
		data.account = $("#account").val();
		data.resetSite = 1;
		params.paramJson = $.toJSON(data);
		var b = false;
		$.ajax({
			type: 'POST',
			url: PC_CALL + "customer/reset/password/sendPasswordMobile/",
			async: false,
			data: params,
			dataType: 'json',
			success: function (rep) {
				if (rep) {
					if (rep.responseObject.responseStatus) {
						b = true;
						$("#registForm .phone_text").html("一封包含验证码的短信已发送至你的手机，请输入验证码，以重设你的密码。");
					} else {
						alert(rep.responseObject.responseMessage);
					}
				}

			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
			}
		});

		return b;
	}

	/**
	 * 校验验证码
	 */
	function validSms() {
		var params = {};
		var data = {};
		var validCode = $("#validCode").val();
		if (validCode.length < 6) {
			alert("请输入正确的验证码");
			return false;
		}
		var account = comm.getpara().account;
		data.validCode = validCode;
		data.type = "customer_reset_password";
		data.mobile = account;
		params.paramJson = $.toJSON(data);
		$.ajax({
			type: 'POST',
			url: PC_CALL + "customer/verification/validSms/",
			async: false,
			data: params,
			dataType: 'json',
			success: function (rep) {
				if (rep) {
					if (rep.responseObject.responseStatus) {
						var itemId = rep.responseObject.responseMessage;
						window.location = PC_CALL + "customer/reset/password/mobile_input/?itemId=" + itemId + "&validCode=" + validCode + "&account=" + account;
					} else {
						alert("验证码不正确！");
					}
				}

			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
			}
		});
	}


	$("#resetInvalidNextBtn").on("click", function () {
		refAccount();
	});

	$("#refMobile").on("click", function () {
		refMobile();
	});

	$("#setPassword").on("click", function () {
		$("#registForm").submit();
	});

	$("#setPasswordNew").on("click", function () {
		$("#registFormNew").submit();
	});


	$("#validSms").on("click", function () {
		validSms();
	});

};
