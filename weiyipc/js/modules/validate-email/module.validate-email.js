/**
 * 邮箱验证功能
 * 实现 1. 判断用户的邮箱是否验证：
 *        2. 发送验证邮件，
 *        3. 接收验证邮件。
 *        4. 更换邮箱
 *
 *样式借用了 找回密码的样式       v2/js/module/find-password-v2/module.find-password-v2.css
 *  相关页面
 * 验证地址           /call/customer/reset/password/email_input/?itemId=14799
 * 验证成功后地址     v2/pages/singlePage/user/passport/reset_password_success_new.html?account=361292910@qq.com
 * Created by Liuyutao on 2015/9/15.
 */
module.validateEmail = function (needProfessor) {
	var professor=needProfessor;
	var controller = {
		email: "",
		path: {
			updateEmail: PC_CALL+"customer/unite/update_email/", // 更换邮箱
			sendEmail: PC_CALL+"customer/reset/password/sendPasswordEmail3/",
			validatePassword: PC_CALL+"customer/unite/validatePassword/", // 较验
			isProfessor: PC_CALL+'activity/api/isProfessor/'//是否专家
		},
		templates: {
			init: function (options) {
				return '<nav class="al-personalUserNoQualification" id="mValidEmail">'+
						'<article>'+
						'我们需要认证您的邮箱<span class="al-personalUserEmail">' + options.email + '</span>,<a href="javascript:void(0)" id="mValidEmailResendBtn">点击发送验证邮件</a>。如果邮箱有误，您可以在<a href="javascript:void(0)" id="mValidEmailChangeEmailBtn">这里</a>更改邮箱地址'+
						'<i class="al-close test_mail_close">x</i>'+
						'</article>'+
						'</nav>'
				/*return '<div class="test_mail" id="mValidEmail">' +
					'       <div class="test_mail_content"><span class="text_mailSpan"></span><span>' + options.username + '</span>老师，你的邮箱<span>' + options.email + '</span>还未验证，请尽快查收邮件。若未收到邮件也可以尝试<a' +
					'               href="javascript:void(0)" id="mValidEmailResendBtn">重发邮件</a>或<a href="javascript:void(0)" id="mValidEmailChangeEmailBtn">更换邮箱</a></div>' +
					'				<span class="test_mail_close"></span>'+
					'       <div class="clear"></div>' +
					'   </div>';*/
			},
			//专家评分提示弹层
			expert: function(data){
				navText="?isFromPer=1";
				if(data.navText!=""){
					navText='?isFromPer=1#&navText='+data.navText;
				}
				return '<nav class="al-personalUserNoQualification" id="ev_expertCon">'+
					'<article>'+
					'亲爱的评委，您在 <span class="al-personalUserEmail">' + data.activityName + '</span> 中尚有'+data.resourceCount+'个作品待评审，<a href="/html/activity/'+data.activityId+'/activity_index.html'+navText+'">点击此处前往评分</a>'+
					'<i class="al-close test_mail_close">x</i>'+
					'</article>'+
					'</nav>';
			},
			resend: function () {
				return '<div class="title">重发邮件</div>' +
					'<div class="text">医师你好，验证邮箱的真实性有助于你的正常使用</div>' +
					'<div class="username disable">' +
					'	<div class="input-parent ">' +
					'		<input type="text" value="' + controller.account + '" name="email" disabled id="mFindBackEmail" placeholder="手机号或邮箱"/>' +
					'	</div>' +
					'	<div class="valid-error"></div>' +
					'</div>' +
					'<div class="btn sendValidSMS">发送验证</div>' +
					'<div class="bot-link">' +
					'	<a href="javascript:void(0)" id="mVeChangeEmail">更换邮箱</a>' +
					'</div>';
			},
			/**
			 *
			 * @param {Boolean} isChangeNewEmail  是否是更换邮箱功能
			 * @returns {string}
			 */
			sended: function (isChangeNewEmail) {
				return '<div class="title">发送成功</div>' +
					'<div class="text">医师你好，验证信息已发至你的'+ (isChangeNewEmail?'新':'') +'邮箱中</div>' +
					'<div class="username disable">' +
					'	<div class="input-parent ">' +
					'		<input type="text" value="' + controller.account + '" name="email" disabled id="mFindBackEmail" placeholder="手机号或邮箱"/>' +
					'	</div>' +
					'	<div class="valid-error"></div>' +
					'</div>' +
					'<div class="btn sendValidSMS">进入邮箱</div>';
			},
			changeEmail: function () {
				return '<div class="title">更换邮箱</div>' +
					'<div class="text">医师你好，验证信息将发至更换的邮箱中</div>' +
					'<div class="username disable">' +
					'	<div class="input-parent ">' +
					'		<input type="text" value="' + controller.account + '" name="email" disabled id="mFindBackEmail" placeholder="手机号或邮箱"/>' +
					'	</div>' +
					'	<div class="valid-error hide"></div>' +
					'</div>' +
					'<div class="password">' +
					'	<div class="input-parent">' +
					'		<input type="password" name="password" id="mVeCurrentPwd" placeholder="当前密码"/>' +
					'	</div>' +
					'	<div class="valid-error password-error hide"></div>' +
					'	<div class="clear"></div>' +
					'</div>' +
					'<div class="username new-email">' +
					'	<div class="input-parent">' +
					'		<input type="text" name="newEmail" id="mVeNewEmail" placeholder="更换邮箱"/>' +
					'	</div>' +
					'	<div class="valid-error email-error"></div>' +
					'	<div class="clear"></div>' +
					'</div>' +
					'<div class="btn sendValidSMS">发送验证</div>' +
					'<div class="bot-link">' +
					'	<a href="javascript:void(0)" id="mVeCancel">又不想更换了</a>' +
					'</div>';
			}
		},
		init: function () {
			var t = this;
			if(professor){
				t.isExpert();
			}else{//不需要判断专家再判断是否验证邮箱
				t.checkUserIfValid();
			}

		},
		el: {
			main: null,
			pop: null
		},
		//TODO:判断是否是专家给出活动评分引导提示
		isExpert:function(){
			var t=this;
			var obj = {
				customerId:$("#sesCustomerId").val(),
				visitSiteId:1
			};
			var param = {paramJson:$.toJSON(obj)};
			$.ajax({
			    type : "post",
			    url : t.path.isProfessor,
			    data : param,
			    dataType : "json",
			    success : function(rep){
					if(comm.hasResponseData(rep)){
						var data=rep.responseObject.responseData;
						if(data.navText&&data.navText!=''){//表示处于评审阶段
							if(data.isExpert=="1"&&data.resourceCount>0){//是专家并且未评作品大于0
								$(".al-mainInner").prepend(t.templates.expert(data));
								t.el.main = $("#ev_expertCon");
								/* 关闭 */
								t.el.main.find(".test_mail_close").on("click", function () {
									t.el.main.remove();
									//事件埋点
									comm.creatEvent({
										triggerType:"全站功能按钮点击",
										keyword:"专家评分提示层关闭",
										actionId:43
									});
								});
							}
						}else{//不是专家再判断是否验证邮箱
							t.checkUserIfValid();
						}
					}else{//不是专家再判断是否验证邮箱
						t.checkUserIfValid();
					}
			    },
			    error:function(){}
			});
		},
		/**
		 * 获取用户是否已验证邮箱
		 */
		checkUserIfValid: function () {
			var t = this;
			var checked = false;
			var webUser = comm.customer.getData("getWebUser");
			if (webUser.email == "" || webUser.email == null) {
				return;
			}


			if (webUser.isCheckEmail == "0") {   // 未验证邮箱
				var isClosed = $.cookie('isClosedvalidateEmailTip');
				if(isClosed!="" && isClosed!=null){  // 已关闭过
					return;
				}
				var username = "";
				if (webUser.trueName != "") {
					username = webUser.trueName;
				} else {
					username = webUser.email;
				}
				t.account = webUser.email;
				t.username = username;

				$(".al-mainInner").prepend(t.templates.init({username: username, email: t.account}));
				t.el.main = $("#mValidEmail");
				t.bindInitBtns();
			}
		},
		/**/
		bindInitBtns: function () {
			var t = this;
			/* 重新发送 */
			t.el.main.find("#mValidEmailResendBtn").on("click", function () {
				t.sendEmailPop();
			});

			/* 更换邮箱 */
			t.el.main.find("#mValidEmailChangeEmailBtn").on("click", function () {
				t.showChangeEmail();
			});

			/* 关闭 */
			t.el.main.find(".test_mail_close").on("click", function () {
				t.el.main.remove();
				$.cookie('isClosedvalidateEmailTip','closed',{expires:1});    //邮箱验证是否关闭过  1 天后过期
				//事件埋点
				comm.creatEvent({
					triggerType:"全站功能按钮点击",
					keyword:"邮箱验证提示层关闭",
					actionId:43
				});
			});
		},
		initPop: function () {
			var t = this;

			$("body").append('	<div class="m-findPwd-pop">' +
				'				<div class="mask"></div>' +
				'          		<div class="center-box">' +
				'					<div class="top"></div>' +
				'          			<div class="close"></div>' +
				'          			<div class="back"></div>' +
				'					<div class="content"></div>' +
				'				</div>' +
				'         	</div>').css("overflow", "hidden");

			t.setSize();
			t.bindResize();
			t.el.pop = $(".m-findPwd-pop");
			t.el.popContent = $(".m-findPwd-pop .content");
			t.el.close = $(".close", t.el.pop);
			t.el.close.on("click", function () {
				t.close();
				//事件埋点
				comm.creatEvent({
					triggerType:"全站功能按钮点击",
					keyword:"邮箱验证关闭",
					actionId:43
				});
			});
		},
		/* 发送邮件 */
		sendEmailPop: function () {
			var t = this;
			if (t.el.pop == null) {
				t.initPop();
			}
			t.el.popContent.html(t.templates.resend());
			t.bindSendMail();
		},
		bindSendMail: function () {
			var t = this;
			t.el.pop.find(".sendValidSMS").on("click", function () {
				t.sendEmailAjax(false);
			});

			/*更换邮箱*/
			t.el.pop.find("#mVeChangeEmail").on("click", function () {
				t.showChangeEmail();
			});
		},
		/**
		 * @desc 发送验证邮件
		 * @param {Boolean} isChangeNewEmail 是否是更换邮箱功能
		 */
		sendEmailAjax: function (isChangeNewEmail) {
			var t = this;
			$.ajax({
				url: t.path.sendEmail,
				type: "POST",
				data: {
					paramJson: $.toJSON({resetSite: 7, email: t.account, applySource: 1})
				},
				success: function (data) {  // 发送邮件成功
					if (data && data.responseObject && data.responseObject.responseStatus) {
						t.el.popContent.html(t.templates.sended(isChangeNewEmail));
						t.bindSended(t.account);
					}
				}
			});
		},
		/**
		 * @desc  绑定进入邮箱按钮
		 * @param {String} email
		 */
		bindSended: function (email) {
			var t = this;
			t.el.popContent.find(".sendValidSMS").on("click", function () {
				var emailUrl = "//mail." + email.substring(email.indexOf("@")+1);
				window.open(emailUrl);
			});
		},
		showChangeEmail: function () {
			var t = this;
			if (!t.el.pop) {
				t.initPop();
			}
			t.el.popContent.html(t.templates.changeEmail());
			t.el.popContent.find(".sendValidSMS").on("click", function () {
				var password = $.trim(t.el.popContent.find("#mVeCurrentPwd").val());
				var newEmail = t.el.popContent.find("#mVeNewEmail").val();
				var passwordError = "", emailError = "";
				if (password == "") {
					passwordError = "请填写密码。";
				} else {
					if (password.length < 6 || password.length > 20) {
						passwordError = "密码长度请保持在6-20位！";
					}
				}
				if (newEmail == "") {
					emailError = "请填写邮箱。";
				} else {
					if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(newEmail)) {
						emailError = "请输入正确的邮箱。";
					}
				}

				if (passwordError != "") {
					t.el.popContent.find(".password-error").text(passwordError).show();
					t.el.popContent.find(".password .input-parent").addClass("input-error");
				}

				if (emailError != "") {
					t.el.popContent.find(".email-error").text(emailError).show();
					t.el.popContent.find(".new-email .input-parent").addClass("input-error");
				}

				if (passwordError == "" && emailError == "") {
					$.ajax({
						type: "post",
						url: t.path.validatePassword,
						data: {"password": password},
						dataType: "json",
						success: function (rep) {
							if (rep && rep.responseObject.responseStatus) {//校验密码成功
								$.ajax({
									type: "post",
									url: t.path.updateEmail,
									data: {"email": newEmail,"isCheckEmail":0},
									dataType: "json",
									success: function (rep) {
										if (rep && rep.responseObject.responseStatus) {
											//$.topTip({content: "成功修改邮箱！"});


											t.account = newEmail;
											t.el.main.find("span:eq(1)").html(newEmail);
											if(t.username.indexOf("@")!=-1){
												t.el.main.find("span:eq(0)").html(newEmail);
											}
											t.sendEmailAjax(true);
										} else {
											t.el.popContent.find(".email-error").text(rep.responseObject.responseMessage).show();
											t.el.popContent.find(".new-email .input-parent").addClass("input-error");
										}
									},
									error: function () {
									}
								});
							} else {
								t.el.popContent.find(".password-error").text("当前密码错误").show();
								t.el.popContent.find(".password .input-parent").addClass("input-error");
							}
						},
						error: function () {
						}
					});
				}
			});

			t.el.popContent.find("#mVeCancel").on("click", function () {
				t.close();
			});
		},
		setSize: function () {
			$(".m-findPwd-pop,.mask").css({
				width: $(window).width(),
				height: $(window).height()
			});
			comm.setCenter($(".center-box"));
		},
		bindActiveInput: function () {
			var t = this;
			t.el.pop.find('input').on("focus", function () {
				$(this).parent().addClass("hover");
			});
			t.el.pop.find('input').on("blur", function () {
				$(this).parent().removeClass("hover");
			});
		},
		/**
		 * 窗口改变大小
		 * */
		bindResize: function () {
			var t = this;
			$(window).bind("resize", t.setSize);
		},
		/**
		 * 关闭弹窗
		 * */
		close: function () {
			var t = this;
			t.el.pop.remove();
			t.el.pop = null;
			t.el.popContent = null;
			$("body").css("overflow", "auto");
			$(window).unbind("resize", t.resize);
		}

	};
	controller.init();
};