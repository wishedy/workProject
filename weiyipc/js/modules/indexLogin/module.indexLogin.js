/**
 * 功能描述： 首页登录模块
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiuYuTao on 2015/4/17.
 *
 */
/**
 * @desc v2
 * @param Obj
 *       Obj{
 *          container:$(el), // optional
 *          callback:function(){ 登錄成功回調函數。}   // optional 無回調時返回首頁
 *          }
 */
module.indexLogin_v2 = function (Obj) {
	// var phoneReg = /^(127|13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
	var phoneReg = /^1\d{10}$/;
	var defaults = {};
	var options = $.extend(defaults, Obj);
	var container;
	if (options.container) {
		container = options.container;
	} else {
		container = $(".main_width");
	}
	var controller = {
		path: {
			login: PC_CALL+"passport/securitycheck",
            getCustomerUnite: PC_CALL + "customer/unite/getCustomerUnite/",     //获取当前登录用户信息
		},
		template: {},
		el: {
			main: container
		},
		continuousCheckingLogin: false,
		continuousCheckingRegist: false,
		init: function (Obj) {
			var t = this;
			t.initHtml();
			t.bindTab();
			t.bindActiveInput();
			t.bindRememberMe();
			t.bindSendSMS();
			t.bindPicValidCode();
			t.bindSubmitBtns();
			t.bindKeyBoard();
			t.bindExistErrorBtns();
			t.bindCantLogin(); // 无法登录
			t.bindWeiXinLogin(); // 微信登录
			t.bindContinuousChecking(); // 持续较验
		},
		isSubmitting: false,
		initHtml: function () {
			var t = this;
			var loginL = $(".index_login_l");
			var loginR = $(".index_login_r");
			var v3Flag = loginL.hasClass('v3'); //是否是第3版
			loginL.addClass("index_v2");      // 新版样式标记
			loginR.addClass("index_v2");
			loginL.html('<form action="" class="allinRegist">' +
				'           <div class="login-box">' +
				'               <div class="login_title font_yahei">' +
				'                   <div class="login_allin">唯医会员登录</div>' +
				'                   <div class="login_caos">免费注册</div>' +
				'                   <div class="clear"></div>' +
				'               </div>' +
				'               <div class="error-wrap">' +
				'                   <div class="error_bg errorMsg ">' +
				'                       <img src="//modules.allinmd.cn/indexLogin/images/jinggao2.png" alt=""/>' +
				'                       <div class="error_biao"></div>' +
				'                   </div>' +
				'               </div>' +
				'               <div class="login_input">' +
				'                  <div class="exist-error">' +
				'                      <div class="inner-wrap">' +
				'                          <span>此邮件地址已被使用。</span>想要<a ' +
				'								href="javascript:void(0)" class="text-login registLoginBtn ">登录</a>吗？' +
				'  或<a ' + 'href="javascript:void(0)" id="registFindPassword">恢复密码</a>吗？' +
				'                      <div class="arrow"></div>' +
				'                  </div>' +
				'               </div>' +
				'               <div class="rules-error">' +
				'                   <div class="inner-wrap">' +
				'                       <div class="error-title"><span class="errorTipsSpan"></span>错误提示</div>' +
				'                       <ul></ul>' +
				'                       <div class="arrow"></div>' +
				'                   </div>' +
				'               </div>' +
				'				<span class="loginSpan"></span>'+
			'               <input type="text" name="email" class="registEmail" placeholder="'+(v3Flag==true?'电子邮箱/手机号码':'已验证手机号或邮箱')+'" class="font_yahei"/>' +
				'               </div>' +
				'               <div class="login_input_password register_margin">' +
				'				<span class="loginPwdSpan"></span>'+
				'               <input type="text" class="font_yahei registPassword" name="password" placeholder="设置密码（至少6位）"/>' +
				'               </div>' +
			'				<div class="login_input_verl Ev-validCodeAppear" style="display:none;">'+
				'					<div class="login_input_ver">'+
				'						<input type="text" name="validCode" placeholder="验证码" class="font_yahei" >'+
				'					</div>'+
			'					<div class="login_input_bot Ev-SendSms" data-status="unlock"><a href="javascript:;">发送验证码</a></div>'+
				'					<div class="clear"></div>'+
				'				</div>'+
				'               <div class="iread">' +
				'                      我已阅读并同意唯医的<a ' +
				'							href="/pages/help/service.html">服务条款</a>和<a ' +
				'							href="/pages/help/statement.html">保密协议</a>' +
				'               </div>' +
				'               <div class="login_but registBtn">' +
				'                   <div class="blue-btn">创建唯医帐号</div>' +
				'               </div>' +
				'           </div>' +
			'           <div class="third-party Ev-thirdParty"  style="margin-top:'+(v3Flag==true?'30px':'77px')+'";>' +
				// '               <div class="third-title">无需注册直接登录</div>' +
				'               <div class="weixin"><a href="javascript:void(0)"><span></span>微信登录</a></div>' +
				// '               <div class="caos ev_caos"><a href="/pages/singlePage/user/login.html?action=union"><span></span>CAOS会员登录</a></div>' +
				'           </div>' +
				'       </form>');
			loginR.html('<form action="" class="allinLogin">' +
				'           <div class="login-box">' +
				'               <div class="login_title font_yahei">' +
				'                   <div class="login_allin">唯医会员登录</div>' +
				'                   <div class="login_caos">免费注册</div>' +
				'                   <div class="clear"></div>' +
				'               </div>' +
				'               <div class="error-wrap">' +
				'                 <div class="error_bg errorMsg ">' +
				'                     <img src="//modules.allinmd.cn/indexLogin/images/jinggao2.png" alt=""/>' +
				'                     <div class="error_biao"></div>' +
				'                 </div>' +
				'               </div>' +
				'               <div class="login_input">' +
				'					<span class="loginSpan"></span>'+
				'                   <input type="text" name="email" placeholder="'+(v3Flag==true?'请输入唯医帐号':'已验证手机号或邮箱')+'" class="font_yahei"/>' +
				'                  <div class="exist-error">' +
				'                      <div class="inner-wrap">' +
				'                          <span></span>' +
				'                          <div class="arrow"></div>' +
				'                       </div>' +
				'                   </div>' +
				'                   <div class="rules-error">' +
				'                       <div class="inner-wrap">' +
				'                           <div class="error-title"><span class="errorTipsSpan"></span>错误提示</div>' +
				'                           <ul></ul>' +
				'                           <div class="arrow"></div>' +
				'                       </div>' +
				'                   </div>' +
				'               </div>' +
				//'               <div class="login_traffic">什么是<a href="/pages/help/allin_pass.html">唯医通行证？</a></div>'+
				'               <div class="login_input_password">' +
				'				  <span class="loginPwdSpan"></span>'+
				'                 <input type="password" name="password" placeholder="请输入密码" class="font_yahei"/>' +
				'               </div>' +
				'               <div class="index_forget_password">' +
				/*'                   <div class="time_login">' +
				'<a href="javascript:;" id="rememberMe" data-status="true"><span class="checkboxImgDefault checkboxImgActive" style="margin: -1px 6px 0 0;"></span><span>三十天内免登录</span></a>' +
				//'					  <input type="checkbox" id="" class="rememberMe"/>' +
				'                     ' +
				'					<div class="clear"></div>'+
				'                   </div>' +*/
				'                   <div class="jz_password"><a' +
				'                         href="javascript:void(0)" class="indexCantLogin">无法登录？</a>' +
				'                 </div>' +
				'                 <div class="clear"></div>' +
				'               </div>' +
				'               <div class="login_but allinSubmitBtn">' +
				'                   <div class="blue-btn">登录</div>' +
				'               </div>' +
				'           </div>' +
			'           <div class="third-party" style="margin-top:'+(v3Flag==true?'30px':'53px')+'";>' +
				// '               <div class="third-title">第三方联合登录</div>' +
				'               <div class="weixin">' +
				' 				<a href="javascript:void(0)"><span></span>'+
				'				<i>微信登录</i></a>' +
				'</div>' +
				// '               <div class="caos ev_caos"><a href="/pages/singlePage/user/login.html?action=union"><span></span>CAOS会员登录</a></div>' +
				'           </div>' +
				'     </form>');
			t.el.login = $(".allinLogin",options.container);
			t.el.regist = $(".allinRegist",options.container);
			if(comm.Log){
				//comm.Log.createBrowse({href:location.href,id:72,name:'登录选择页'});
			}
			if(options.action!=undefined && options.action=="quickAuth"){ //快速认证  邮件中点过来
				//t.el.login.find("[name='email']").val(options.account);  // 预填用户名
			}
			//$("input[placeholder], textarea[placeholder]")
			//	.placeholder({style:{
			//		lineHeight:"36px"
			//}});	// 表单默认值 插件
			if(comm.browser.isIe8()){
				$.fn.placeH=function(){
					$(this).parent().css({position:'relative'});
					var _w =$(this)[0].style.width;

					var _h =$(this).parent().outerHeight();
					$(this).parent().append('<div class="pHolder" style="position:absolute;z-index:'+($(this).css('zIndex')-1)+';left:44px;top:0;height:'+_h+'px; width:'+_w+'px">'+$(this).attr('placeholder')+'</div>');
					$('.pHolder').click(function(){
						$(this).hide().siblings('input').focus();
					});
					$(this).focus(function(){
						$(this).siblings('.pHolder').hide();
					}).blur(function(){
						if($(this).val()===""){
							$(this).siblings('.pHolder').show();
						}
					});
					return $(this);
				};
				$('input[placeholder]').each(function(){
					$(this).placeH();
				})
			}
			t.bindRegistAutoMail(); // 邮箱自动填写
		},
		/*左右切换*/
		bindTab: function () {
			var t = this;
			t.form = "allin";
			t.el.main.find(".index_login_l").find(".login_allin").on("click", function () {
				t.el.main.find(".index_login_r").show();
				$('.index_login_l.v3 .third-party',options.container).css({marginTop:30});
				t.el.main.find(".index_login_l").hide();
				t.form = "allin";
			});
			t.el.main.find(".index_login_r").find(".login_caos").on("click", function () {
				t.el.main.find(".index_login_l").show();
				t.el.main.find(".index_login_r").hide();
				t.form = "caos";
			});
		},
		/* 发送短信验证码 */
		bindSendSMS: function () {
			var t=this;
			$(".Ev-SendSms").on("click", function () {
				var isPhone = phoneReg.test(t.el.regist.find(".registEmail").val());
				/*if(isPhone){
					$(this).attr("data-status","unlock");
				}*/
				if ($(this).attr("data-status") === "unlock") {
					var url = PC_CALL + "customer/verification/sendSms/";
					var params = {};
					var timestamp = new Date().getTime();
					params.paramJson = $.toJSON({
						siteId: 1,
						account: $.trim(t.el.regist.find(".registEmail").val()),
						isNew: 1,
						codeLength: 4,
                        timestamp: timestamp,
						ALLINACCESSTOKEN: comm.allinaccesstoken(timestamp,$.trim(t.el.regist.find(".registEmail").val()))
					});
					var promise = $.ajax({url: url, data: params});
					var callback = {
						succ: function (data) {
							if (!data.responseObject.responseStatus) {
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

			function countdown(t) {
				$(".Ev-SendSms a").text(t + "秒后重新获取");
				var s = setInterval(function () {
					t--;
					$(".Ev-SendSms a").text(t + "秒后重新获取");
					if (t == 0) {
						clearInterval(s);
						$(".Ev-SendSms a").text("重新发送");
						$(".Ev-SendSms").attr("data-status", "unlock");
					}
				},1000);
			}
		},
		/* 图形验证码换一换 */
		bindPicValidCode: function(){
			$(".Ev-changeValidCode").on("click",function(){
				$("#Ev-picValidCode").attr("src","/call/randomValidCode/create/?"+new Date().getTime());
			});
		},
		/* 绑定记住我  将复选框改为图片呈现*/
		bindRememberMe: function(){
			$("#rememberMe").on("click",function(){
				var imgSrc;
				if ($(this).attr("data-status") === "true") {
					$(this).attr("data-status", "false");
					$(this).find('.checkboxImgDefault').removeClass('checkboxImgActive');
					//imgSrc = "//img00.allinmd.cn/weixin/userbtn02.png";
					imgSrc = '/js/modules/indexLogin/images/userbtn02.png';
				} else {
					$(this).attr("data-status", "true");
					$(this).find('.checkboxImgDefault').addClass('checkboxImgActive');
					//imgSrc = "//img00.allinmd.cn/weixin/userbtn01.png";
					imgSrc = '/js/modules/indexLogin/images/userbtn01.png';
				}
				$(this).attr("src", imgSrc);
			});
		},
		/**
		 * @desc  注册时邮箱自动填写
		 */
		bindRegistAutoMail: function () {
			var t = this;
			$('.registEmail').focus(function () {
				if (!t.registBind) {
					t.registBind = true;
					$(this).autoMail({
						emails: ['qq.com', '163.com', '126.com', 'sina.com', 'sohu.com', 'yahoo.cn', 'gmail.com', 'hotmail.com', 'live.cn']
					});
				}
			});
		},
		bindWeiXinLogin: function () {
			var t = this;
			//微信登录

			t.el.main.find(".weixin").off("click").on("click", function () {
				var url = location.href;
				if (url.lastIndexOf("login.html") > 0) {//在登录页
					window.location.href = "https://open.weixin.qq.com/connect/qrconnect?appid=wx9bf385b65d0ae649&redirect_uri=http%3a%2f%2f"+location.hostname+"%2fcall%2fwx%2fallin%2finteract%2fconfirmLogin%2f&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect";
				} else {//登录弹层
                    /*20181130 判断活动页面进行微信登录跳转url单独处理 change by HJ*/
					if(url.indexOf("activity_index.html")>-1){
						url=url.substr(0,url.indexOf("#"));
					}
					window.location.href = "https://open.weixin.qq.com/connect/qrconnect?appid=wx9bf385b65d0ae649&redirect_uri=http%3a%2f%2f"+location.hostname+"%2fcall%2fwx%2fallin%2finteract%2fweixinLogin%2f?url=" + url + "&response_type=code&scope=snsapi_login&state=START#wechat_redirect";
				}
				TempCache.removeItem("authInfo");//清除authInfo
				//点击微信登录记下当前需要的权限
				//TempCache.setItem("privilegeScene", options.scene);
				//事件埋点
				comm.creatEvent({
					triggerType:"登录",
					keyword:"微信登录",
					locationId:2,
					actionId:19,
					pushMessageId:TempCache.getItem("userId")
				});
			});
			//caos登录
			t.el.main.find(".ev_caos").off("click").on("click",function(){
				//事件埋点
				comm.creatEvent({
					triggerType:"登录",
					keyword:"CAOS登录",
					locationId:3,
					actionId:20,
					pushMessageId:TempCache.getItem("userId")
				});
			})
		},
		/**
		 * @desc 激活输入框
		 */
		bindActiveInput: function () {
			var t= this;
			t.el.main.find('input').on("input", function(){
				if($.trim($(this).val()).length > 0){
					if($(this).attr("name") === "password") $(this).prev().addClass("loginPwdSpanHover");
						else $(this).prev().addClass("loginSpanHover")
				}else{
					if($(this).attr("name") === "password") $(this).prev().removeClass("loginPwdSpanHover");
						else $(this).prev().removeClass("loginSpanHover")
				}

				if($(this).attr("name") === "email" && $.trim($(this).val()).length === 11){

					var isPhone = phoneReg.test($.trim($(this).val()));
					if(isPhone) {
						// $(".Ev-thirdParty",options.container).removeAttr("style");
                        // $(".Ev-thirdParty",options.container).css("margin-top","30px");
						$(".Ev-validCodeAppear",options.container).show();
						// $(".index_login_l.v3",options.container).height(414);
					}
				}else if($(this).attr("name") === "email" && $.trim($(this).val()).length !== 11){
					$(".Ev-validCodeAppear",options.container).hide();
					// $(".index_login_l.v3",options.container).height(384);
					if($(".Ev-thirdParty",options.container).parents('.module-index-login').hasClass('v3')){//v3版
						$(".Ev-thirdParty",options.container).css("margin-top","30px");
					}else{
						$(".Ev-thirdParty",options.container).css("margin-top","77px");
					}

				}
			}).on("change", function(){ //注册判断手机号时显示验证码

				var isPhone = phoneReg.test($(".allinRegist",options.container).find("[name=email]").val());
				if (isPhone) {
					// $(".Ev-thirdParty",options.container).removeAttr("style");
					$(".Ev-validCodeAppear",$(".allinRegist",options.container)).show();
				}else{
					$(".Ev-validCodeAppear",$(".allinRegist",options.container)).hide();
					if($(".Ev-thirdParty").parents('.module-index-login').hasClass('v3')){//v3版
						$(".Ev-thirdParty").css("margin-top","30px");
					}else{
						$(".Ev-thirdParty").css("margin-top","77px");
					}
				}

			});

//			var t = this;
//			t.el.main.find('input').on("focus", function () {
//				$(this).parent().addClass("hover");
//			});
//			t.el.main.find('input').on("blur", function () {
//				$(this).parent().removeClass("hover");
//			});
		},

		/**绑定提交按钮*/
		bindSubmitBtns: function () {
			var t = this;
			//debugger;
			t.el.main.find(".registBtn").on("click", function () {
				if (t.isSubmitting) {
					return;
				} else {
					t.isSubmitting = true;
					t.registSubmit();
				}
			});

			//console.log(t.el.main.login);
			t.el.main.find(".allinSubmitBtn").on("click", function () {
				t.submit("allin");
			});
			t.el.login.find('input').on('input keyup',function(e){
				if(e.which==13){
					t.submit('allin');
				}
			});
			t.el.regist.find('input').on('input keyup',function(e){
				if(e.which==13){
					t.registSubmit();
				}
			});

		},
		/**
		 * @desc  邮箱已存在的错误提示 按钮绑定
		 */
		bindExistErrorBtns: function () {
			var t = this;
			$(".registLoginBtn").on("click", function () {
				t.el.main.find(".index_login_l").find(".login_allin").click();
			});

			$("#registFindPassword").on("click", function () {
				module.findPassword_v2();
			});

		},
		/* 无法登录 */
		bindCantLogin: function () {
			var t = this;
			t.el.main.find(".indexCantLogin").on("click", function () {
				module.findPassword_v2();
			});
		},
		/**
		 * @desc 注册帐号
		 */
		registSubmit: function () {
			var t = this;
			t.el.regist.find(".exist-error").hide();
			t.el.regist.find(".rules-error").hide();
			t.el.regist.find(".error_bg").hide();
			if (t.validateRules("regist")) {  // 较验规则
				var account = $.trim(t.el.regist.find(".registEmail").val());
				var existerror = t.el.regist.find(".exist-error");
				if (t.validateExist(account)) {// 邮箱已使用
					if (comm.checkAccountType(account) == "email") {
						existerror.find("span").html('<span class="errorSpan"></span>此邮件地址已被使用。');
					} else {
						existerror.find("span").html('<span class="errorSpan"></span>此手机号已被使用。');
					}
					existerror.show();
					t.isSubmitting = false;
				} else {
					var data = {
						account: account,
						type: comm.checkAccountType(account),
						passwd: $.trim(t.el.regist.find(".registPassword").val()),
						ref: $.trim(t.el.regist.find("#ref").val()),
						validCode: $.trim($("[name=validCode]",t.el.regist).val())
					};
					var params = {};
					params.paramJson = $.toJSON(data);
					comm.LightBox.showloading();
					$.ajax({
						type: 'POST',
						url: PC_CALL+"web/user/userRegist/",
						cache: false,
						data: params,
						dataType: 'json',
						success: function (data) {
							comm.LightBox.hideloading();
							t.isSubmitting = false;
							if (data && data.responseObject && data.responseObject.responseStatus) {
								//comm.authInfo=null;//清除authInfo
								TempCache.removeItem("authInfo");//清除authInfo
								comm.getHeaderLogin&&comm.getHeaderLogin();
								var customerId = data.responseObject.responsePk;
								var result = data.responseObject;
								/**
								 * 注册成功后要发邮件 提示用户进行验证。
								 * */
								if (comm.checkAccountType(account) == "email") {
									$.ajax({
										url: PC_CALL + "customer/reset/password/sendPasswordEmail/",
										type: "POST",
										data: {
											paramJson: $.toJSON({resetSite: 7, email: account, applySource: 1})
										},
										success: function (data) {  // 发送邮件成功

										}
									});
								}
								var param = {};
								var password=$.trim(t.el.regist.find(".registPassword").val());
								param.j_username = "website;" + account + ";" + password + ";" + comm.checkAccountType(account);
								param.j_password = password;
								param.rememberMe = true;
								$.ajax({
									url: t.path.login,
									type: "POST",
									data: param,
									dataType: "json",
									success: function (data) {

									}
								});
								/*if(options.noAuthReload&&options.noAuthReload==true){//如果刷新页面，不执行showAuthPage

								}else{*/
									$('.m-UserPop-v2').remove();
									//options.callback();
									t.registerSuccess();
									/*auth.showAuthPage({
										callback:options.callback,
										//onAuthCancel:'back',
										indexRegisterAuthcancel:options.indexRegisterAuthcancel,
										onAuthCancel:(!/www.allinmd.cn\/?$/.test(window.location.href))?options.onAuthCancel:'stay',//"back", 首页取消认证留在原页面，其他返回上一个
										privCheckFailed: function () {
											window.location.href = "/"
										}
									});*/
								//}
							} else {
								t.continuousCheckingLogin = true;//$("#allinRegist")
								t.el.regist.find(".rules-error ul").html('<li>'+data.responseObject.responseMessage+'</li>');
								t.el.regist.find(".rules-error").show();
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
						error: function (XMLHttpRequest, textStatus, errorThrown) {
							$("#popImageSubmit").attr("on", "true");
							alert("注册失败！");
							t.isSubmitting = false;
							comm.LightBox.hideloading();
						}
					});
				}
			} else {
				t.isSubmitting = false;
				t.continuousCheckingRegist = true;
				t.el.regist.find(".rules-error").show();
				//事件埋点
				comm.creatEvent({
					triggerType:"注册",
					keyword:"注册",
					actionId:22,
					locationId:1
				});
			}
		},
		//通行证创建(注册)成功
		registerSuccess:function(){
			comm.alertBox({
				title:'成功创建了唯医帐号',
				content:'您可使用唯医帐号登录唯医、医栈、医鼎',
				ensure:'知道了',
				ensureCallback:function(){
					if (options.callback) {
						options.callback();
					}
				}
			});
		},
		/**
		 * @desc 较验规则
		 * @param type {String} 类型 ["login","regist"]
		 */
		validateRules: function (type) {
			var t = this;
			var errors = [];
			var email = $.trim(t.el[type].find("[name=email]").val());
			var password = $.trim(t.el[type].find("[name=password]").val());
			var validCode = $.trim(t.el[type].find("[name=validCode]").val());
			var emailErrorFlag = false, passwdErrorFlag = false, validCodeErrorFlag = false;
			var emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;  // sinaReg  /^[0-9a-z_][_.0-9a-z-]{0,31}@([0-9a-z][0-9a-z-]{0,30}\.){1,4}[a-z]{2,4}$/
			var passwdReg = /^[A-Za-z0-9`~!@#$%^&*()-_=+{};:,.<>/?\|'"]+$/g;

			// 帐号
			if (email == "" || email == null) {
				if (type == "regist") {
					errors.push("请填写手机号或邮箱。");
				} else {
					errors.push("请填写邮箱或已验证手机。");
				}
				emailErrorFlag = true;
			} else {
				if (email.length > 50) {
					errors.push("最长50个字符。");
					emailErrorFlag = true;
				} else {
					if (!email.match(emailReg) && !email.match(phoneReg)) {
							errors.push("请填写正确的手机号或邮箱。");
							emailErrorFlag = true;
						}
					}
				}

			// 密码
			if (password == "" || password == null) {
				errors.push("请填写密码。");
				passwdErrorFlag = true;
			} else {
				if (password.length < 6 || password.length > 20) {
					errors.push("密码长度请保持在6-20位！");
					passwdErrorFlag = true;
				}else if(!passwdReg.test(password)){
					errors.push("字母、数字或符号的组合！");
					passwdErrorFlag = true;
				}
			}

			//检测验证码是否隐藏
			if($(".Ev-validCodeAppear", t.el[type]).length > 0 && !$(".Ev-validCodeAppear", t.el[type]).is(":hidden")){
				if(validCode == "" || validCode == null){
					errors.push("请填写验证码。");
					validCodeErrorFlag = true;
				}else{
					if(validCode.length != 4 ){
						errors.push("验证码长度为4位！");
						validCodeErrorFlag = true;
					}
				}

				if(validCodeErrorFlag){
					t.el[type].find("[name=validCode]").parent().addClass("input-error");
				} else {
					t.el[type].find("[name=validCode]").parent().removeClass("input-error");
				}
			}

			var html = "";
			$.each(errors, function (index, str) {
				html += "<li>" + (index + 1) + "、" + str + "</li>";
			});
			t.el[type].find(".rules-error ul").html(html);

			if (emailErrorFlag) { t.el[type].find("[name=email]").parent().addClass("input-error");
			} else { t.el[type].find("[name=email]").parent().removeClass("input-error"); }

			if (passwdErrorFlag) { t.el[type].find("[name=password]").parent().addClass("input-error");
				} else { t.el[type].find("[name=password]").parent().removeClass("input-error"); }

			if (errors.length > 0) {
				return false;
			} else {
				return true;
			}
		},
		/**
		 * @desc 较验是否存在相同邮箱
		 */
		validateExist: function (email) {
			var t = this;
			var rst = false;
			$.ajax({
				url: PC_CALL+"customer/unite/isValidateAccount/",
				type: "POST",
				async: false,
				data: {account: email},
				success: function (data) {
					if (data && data.responseObject && !data.responseObject.responseStatus) { // 已存在
						rst = true;
					}
				}
			});
			return rst;
		},
		bindKeyBoard: function () {
			var t = this;
			$(".allinLogin,.allinRegist").on('keyup.keyboard', $.proxy(keyboardAction, t));
			function keyboardAction() {
				var t = this;
				var KEYCODE_ESC = 27;
				var KEYCODE_ENTER = 13;
				var keycode = event.keyCode;
				var key = String.fromCharCode(keycode).toLowerCase();
				if (keycode === KEYCODE_ENTER) {             // 提交
					t.submit(t.form);
				}
			}
		},
		/* 登录提交 */
		submit: function (form) {
			var t = this, url;
			var formEl = ($('.module-login-box').length>0&&$('.module-index-login-area').length>0)?$("." + form).eq(1):$("." + form);	//如果是v3首页，则form选择新增的弹层中表单
			var username = $.trim(formEl.find("[name=email]").val());
			var password = $.trim(formEl.find("[name=password]").val());
			//var rememberMe = formEl.find(".rememberMe").attr("checked") ? true : false;
			var rememberMe = true;//$("#rememberMe").attr("data-status") === "true" ? true : false;
			var type = comm.checkAccountType(username);

			t.el.login.find(".exist-error").hide();
			t.el.login.find(".rules-error").hide();
			if (t.validateRules("login")) {  //较验成功
				var data = {};
				var site = form == "caos" ? "caos;" : "website;";
				data.j_username = site + username + ";" + password + ";" + type;
				data.j_password = password;
				data.rememberMe = rememberMe;
				comm.LightBox.showloading();
				$.ajax({
					url: t.path.login,
					type: "POST",
					data: data,
					dataType: "json",
					success: function (data) {
						var result = data.responseObject;
						var resStatus = result.responseStatus;
						var resCode = result.responseCode;
						var resMessage = result.responseMessage;
						comm.LightBox.hideloading();
						if (data && data.responseObject.responseStatus) {
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
							//comm.authInfo=null;//清除authInfo
							TempCache.removeItem("authInfo");//清除authInfo
							comm.getHeaderLogin&&comm.getHeaderLogin(1);//修改站点id参数  changeSite
							if (options.callback) { // 弹层
								options.callback();
							} else { // 首页
								if (options.action != undefined && options.action == "quickAuth") {   // 快速认证    2016-5-13忘了是干嘛的说法了。
									if (!user.getRenZhengStatus()) { //  未认证
										/*auth.showAuthPage({
											onAuthCancel:"back",       // 暂不认证相关的两个参数。
											privCheckFailed: function () {
												window.location.href = "/"
											}
										});*/
										//新版认证
										window.location = '/pages/singlePage/user/auth.html?onAuthCancel=back';
									} else {
										alert('已认证通过');
										window.location = '/pages/personal/personal_index.html';
									}
								}else{
									window.location = '/pages/personal/personal_index.html';
								}
							}

						} else {// 登录失败
							comm.LightBox.hideloading();
							t.el.login.find(".exist-error .inner-wrap span").html('<span class="errorSpan"></span>不正确的帐号或密码,请重新输入！').parent().parent().show();
						}
						//事件埋点
						comm.creatEvent({
							triggerType:"登录",
							keyword:"登录",
							actionId:16,
							locationId:1,
							pushMessageId:TempCache.getItem("userId")
						});
					}
				});
			} else { // 未较验成功
				//formEl.find(".error_biao").html(rst.message).parent().show();
				t.continuousCheckingLogin = true;
				t.el.login.find(".rules-error").show();
				//事件埋点
				comm.creatEvent({
					triggerType:"登录",
					keyword:"登录",
					actionId:16,
					locationId:1
				});
			}
		},
		/**
		 * 开始持续较验
		 * */
		bindContinuousChecking: function () {
			var t = this;
			t.el.login.find("input").on("keyup", function () {
				if (t.continuousCheckingLogin) {
					if (!t.validateRules("login")) {
						t.el.login.find(".rules-error").show();
					} else {
						t.continuousCheckingLogin = false;
						t.el.login.find(".rules-error").hide();
					}
				}
			});
			t.el.regist.find("input").on("keyup", function () {
				if (t.continuousCheckingRegist) {
					if (!t.validateRules("regist")) {
						t.el.regist.find(".rules-error").show();
					} else {
						t.continuousCheckingRegist = false;
						t.el.regist.find(".rules-error").hide();
					}
				}
			});
		}

		/*	,validate: function (username, passwd) {
		 var obj = {status: false, message: ""};
		 var phoneReg = /^(127|13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
		 var emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
		 if (username === "") {
		 obj.message = "用户名不能为空!";
 		 } else if (passwd === "") {
		 obj.message = "密码不能为空!";
		 } else if (!emailReg.test(username) && !phoneReg.test(username)) {
		 obj.message = "用户名格式不正确!";
		 } else if (passwd.length < 6 || passwd.length > 20) {
		 obj.message = "密码长度不正确!";
		 } else {
		 obj.status = true;
		 }
		 return obj;
		 }*/

	};

	controller.init(Obj);

};