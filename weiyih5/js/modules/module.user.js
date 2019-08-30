/**
 * 使用方法  user.privExecute({
 *              noNeedBack:true,      //传值 点击暂不认证回退来源页
				operateType: 'auth',   //'login','auth','conference'
				noAuthTip:1,           //默认不传  不需要认证提示弹窗
				callback: function () {

				}
			});
 * @author liuyutao
 */
localStorage.removeItem('auth');


var user = {
	isRenZhengStatus: false,
	//TODO:add by lichunhui time:2018-05-23 微信授权登录根据登录状态判断
	weixinLogin:function(obj){
		if(weixinFlag&&location.href.lastIndexOf("login.html")==-1&&location.href.lastIndexOf("passport")==-1) {//是微信并且不是登录页
			TempCache.setItem("fromPageN", window.location.href);
			var appId = "wx8d4a2df6fdc13658";
			var href = location.href;
			var toUrl = "http:"+webdomain+"/mcall/wx/allin/interact/view/?url=" + encodeURIComponent(href);
			window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" + encodeURIComponent(toUrl) + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
		}else{
			(obj&&obj.callback)&&obj.callback();
		}
	},
	checkStatus: function() {
		var t = this;
		if(TempCache.getItem("userId")&&TempCache.getItem("userId")!="null"){
			t.callback();
			return false;
		}
		$.ajax({
			url: "/mcall/web/user/checkSession/",
			dataType: "json",
			type: "post",
			success: function(result) {
				if (result && result.responseObject.responseMessage.status) { //已登录
					t.callback();
				} else {
					user.redirectLogin();
				}
			}
		});
	},
	/**
	 * @description 判断是否登录
	 * @returns {boolean}
	 */
	checkSession: function() {
		var status;
		var t = this;
		if(TempCache.getItem("userId")){
			status = 1;
			return status == 1;
		}
		$.ajax({
			url: "/mcall/web/user/checkSession/",
			dataType: "json",
			type: "post",
			async: false,
			success: function(result) {
				if (result && result.responseObject != null) { //已登录
					status = result.responseObject.responseMessage.status;
				} else {
					status = 0;
				}
			}
		});
		return status == 1;
	},
	/**
	 * @desc  获取登录用户的信息  获取完设置到localStorage里
	 */
	getSessionInfo: function() {
		var t = this;
		$.ajax({
			url: "/mcall/web/user/getSessionUser/",
			type: "get",
			async: false,
			dataType: "json",
			success: function(data) {
				if (data.responseObject != null) {
					//if(data.responseObject.isAuth ==1 ){
					var params={};
					params.paramJson= $.toJSON({"customerId":data.responseObject.userId,"logoUseFlag":4});
					$.ajax({
						url: M_CALL+'customer/unite/getMapById/',
						data: params,
						async:false,
						success: function(rep){
							TempCache.setItem("passwd",rep.responseObject.responseData.data_list[0].customer_unite.passwd);
							TempCache.setItem("department", rep.responseObject.responseData.data_list[0].customer_auth.platformId);
							if(TempCache.getItem('auth')!=null){
								var _auth = JSON.parse(TempCache.getItem('auth'));
								_auth.state = rep.responseObject.responseData.data_list[0].customer_auth.state;
								TempCache.setItem('auth',JSON.stringify(_auth));
							}
						}
					});
					//}else{
					//	//TempCache.setItem("department", 1);
					//}
					TempCache.setItem("userId", data.responseObject.userId?data.responseObject.userId:'');
					TempCache.setItem("email", data.responseObject.email);
					TempCache.setItem("webSource", data.responseObject.webSource);
				} else {
					TempCache.removeItem("userId");
					TempCache.removeItem("trueName");
					TempCache.removeItem("email");
					TempCache.removeItem("department");
				}
			}
		});
	},
	login: function() {
		var t = this,
			type, page, options;
		if (arguments.length > 0) {
			TempCache.setItem("UserCallback", Array.apply(this, arguments));
		}
		TempCache.setItem("fromPage", window.location.href);
		t.checkStatus();

	},
	// 获取认证信息    获取用户认证详情
	getAuthInfo: function() {
		var t = this;
		var state = null;
		$.ajax({
			url: "/mcall/web/user/getCustomerAuth/",
			type: "get",
			async: false,
			dataType: "json",
			success: function(data) {
				if (data && data.responseObject != null) {
					state = data.responseObject.state;
				}
			}
		});
		return state;
	},
	checkAllinUserAuth: function() {
		var t = this;
		t.getSessionInfo();
		var info;
		var webSource = TempCache.getCache("webSource");
		if (webSource == "website") { // 网站用户才可以
			info = t.getAuthInfo();
			if (info.customerId <= 0 || info.state == 3) {
				// 未申请  || 被拒绝
				//alert("您的认证申请正在审枋中。无法进行相关操作");
				return true;
			} else if ( state == 2 ||state ==7 ||state ==8 ||state ==9) {
				//认证已经通过，此时不允许再次认证 7-执业医师申请 8-执业医师确认 9-执业医师拒绝
				g_sps.jump(null,'/');
			} else if (state == 1 ||state == 0) {
				//已经提交申请 未审核 ，此时不允许再次认证
				//alert("你已经提交过认证，不能重复认证")
				popup("您的申请正在审核中");
			}
		} else {
			setTimeout(function(){
				g_sps.jump(null,'/');
			},1000);
		}
	},
	getRenZhengInfo: function() {
		var t = this;
		var auth;
		if(TempCache.getItem('auth')){
			auth = JSON.parse(TempCache.getItem('auth'));
		}else{
			auth = customer.getData("getCustomerAuth");
			if(!$.isEmptyObject(auth)){
				TempCache.setItem('auth',JSON.stringify(auth));
			}
		}
		if (auth != null && !$.isEmptyObject(auth) && (auth.lastName || auth.firstName)) {//auth.state == 1
			TempCache.setItem("trueName", auth.lastName + auth.firstName);
		}
		return auth;
	},
	//主方法
	privExecute: function(options) {
		// 厂商权限在病例终端页时直接倒计时退出,不管认证与否
		if((location.href.indexOf('/case/') >-1) &&
			(TempCache.getItem('customerRole') === '14' ||
				TempCache.getItem('customerRole') === '15' ||
				TempCache.getItem('customerRole') === '13')){
			comm.toastFactoryAuth(null, true);
			return false;
		}else if((location.href.indexOf('/doc/') >-1) &&
			TempCache.getItem('customerRole') === '14'){

			// 审核与二次认证
			if(user.getRenZhengInfo().state === 0 || user.getRenZhengInfo().state === 1){
				comm.alertBox({
					"title":"认证资料审核将在1-3个工作日内完成，请耐心等待 ",
					"ensure":"知道了",
					ensureCallback: function () {
						location.href = '//m.allinmd.cn/dist/channel/doc_index.html';
					}
				});
			}else{
				// 厂商未认证时,直接去APP认证,认证后可以看
				var androidParam = "{}";
				var iosParam = "";
				comm.factoryForceBox({
					imgPath:"/images/img50/case/release.png",
					title:"厂商认证需使用唯医骨科App",
					solidBtnTitile:"立即使用",
					data:{
						el: ".solidBtn",
						ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
						ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
						android: "allin://com.allin.social:75235?data="+androidParam
					}
				})
			}

		}else{
			var t = this;
			if (t.isRunning) {
				return;
			} else {
				t.isRunning = true;
				if (!options) {
					return;
				} else {
					t.options = options;
					// console.log(t.options);
					if (options.operateType != "" && options.callback != null) {
						t.checkPriv();
					}
				}
			}
		}
	},
	//	比较权限
	checkPriv: function() { // 遇到检验与会议时,厂商与医助不做处理
		var t = this,
			operateItem;
		if (t.options.operateType == "") {
			return;
		}
		if (t.options.operateType === "login" || t.options.operateType === "auth" || t.options.operateType === "conference") {
			t.isNeedLogin = true;
		}
		if (t.options.operateType === "auth" && (
			TempCache.getItem('customerRole') !== '14' &&
			TempCache.getItem('customerRole') !== '15' &&
			TempCache.getItem('customerRole') !== '13') ) {
			t.isNeedRenZheng = true;
		}
		if (t.options.operateType === "conference" && (
			TempCache.getItem('customerRole') !== '14' &&
			TempCache.getItem('customerRole') !== '15' &&
			TempCache.getItem('customerRole') !== '13')) {
			t.isNeedLogin = true;
			t.isNeedConferenceWanShan = true;
		}

		if (t.isNeedLogin && !t.isNeedRenZheng) { //需要登录
			t.privCheckLogin();
		} else if (t.isNeedRenZheng) { //需要认证
			t.privCheckAuth();
			if(!TempCache.getItem('userId')){
				TempCache.setItem('needAuthRegist','need');//需认证
			}
		} else {
			t.privCheckSuccess(); // 需要登录
		}
	}, //	权限较验成功后处理
	privCheckSuccess: function() {
		var t = this;
		t.isRunning = false;

		function isEmptyObj(obj) {
			for (var key in obj) {
				return false;
			}
			return true;
		}

		if (typeof t.options != "undefined" && typeof t.options.callback != "undefined") {
			t.options.callback();
		} else {
			setTimeout(function() {
				g_sps.jump(null, "/");
			},1000);
		}

	},
	privCheckLogin: function() {
		var t = this;
		t.isRunning = false;
		$.ajax({
			url: "/mcall/web/user/checkSession/",
			dataType: "json",
			type: "post",
			success: function(result) {

				if (result && result.responseObject.responseMessage.status) { //已登录
					t.options && t.options.callback();
					t.logOut();
				} else {
					/*if(!weixinFlag){
						user.redirectLogin();
					}*/
					//todo update by lichunhui 20180812
					t.weixinLogin({
						callback:function(){
							user.redirectLogin();
						}
					});
				}
			}
		});
	},
	privCheckConference: function() {
		var t = this;
		if (t.checkSession()) {
			var auth = user.getRenZhengInfo();
			if (auth.firstName == "" || auth.lastName == "" ||
				(auth.company == "" && auth.schoolName == "") || auth.medicalTitle == "") {
				t.redirectConferenceWanShan();
			}
		} else {
			user.redirectLogin();
		}
	},
	//无效用户以及其他端修改密码后本地需要退出登录
	logOut:function(){
		var isValid,passwd;
		$.ajax({
			url:M_CALL+'customer/unite/getCustomerUnite/',
			data:{paramJson:JSON.stringify({customerId:TempCache.getItem('userId'),logoUseFlag:4})},
			dataType:'json',
			async:false,
			type:'post',
			success:function(res){
				if(comm.hasResponseMessage(res)){
					passwd=res.responseObject.responseMessage.passwd;
					if(!TempCache.getItem("passwd")||TempCache.getItem("passwd")!="undefined"){
						TempCache.setItem("passwd",passwd);
					}
					isValid = res.responseObject.responseMessage.isValid;
					if(isValid==0 || (TempCache.getItem("passwd")!="undefined"&&(passwd!=TempCache.getItem("passwd")))){//TODO:无效用户以及其他端修改密码后本地需要退出登录
						$.ajax({
							url:M_CALL+"/web/user/logout/",
							data:null,
							dataType:'json',
							type:'post',
							async:false,
							success:function(){
								comm.loading.hide();
								TempCache.clear();
								if(comm.isWeiXin()){
									comm.redirect("/pages/wx/v2/login.html");
								}else{
									comm.redirect("/pages/passport/loginV2/login.html");
								}
							}
						});

						//customer.execute("logout",null,function(re){
						//	comm.loading.hide();
						//	TempCache.clear();
						//	comm.redirect("/");
						//});

					}
				}
			}
		});
		if(isValid==0 || passwd!=TempCache.getItem("passwd")) {
			return false;
		}
	},
	privCheckAuth: function() {
		var t = this;
		t.isRunning = false;
		var _role = TempCache.getItem('customerRole');
		if (t.checkSession()) {
			t.logOut();
			if(_role==2||_role==3||_role==4||_role==13 || _role==14 || _role==15){//增加医助角色
				popup("你没有此操作权限");
				return false;
			}
			var auth = user.getRenZhengInfo();
			if (auth != null && !$.isEmptyObject(auth) && ( auth.state == 2 ||auth.state ==7 ||auth.state ==8 ||auth.state ==9)) {//auth.state == 1
				if (!user.getWanShanStatus()) { // 未完善
					setTimeout(function(){
						g_sps.jump(null, "/pages/passport/wanshanInfo.html?redirect=1");
					},1000);

				}else{
					TempCache.setItem("trueName", auth.lastName + auth.firstName);
					t.options && t.options.callback();
				}
			} else if (auth.state == "0" ||auth.state == 1 ) {
				//popup("很抱歉！我们正在加紧审核您的认证信息，请耐心等待... ");
				// $("body").on("touchmove", function(e) {
				// 	e.preventDefault();
				// 	return false;
				// });

				comm.alertBox({
					// "title":"很抱歉！我们正在加紧审核您的认证信息，请耐心等待... ",
					"title":"认证医师审核将在1-3个工作日内完成，请耐心等待 ",
					"ensure":"知道了",
					ensureCallback:function(){
						//if(/passport/.test(document.referrer)){
						//	window.location.href="/";
						//	return false;
						//}
						TempCache.removeItem('autoplay');
						if($(".al-mainInner").hasClass('al-fullBlur')){
							$('.al-authFailBox').removeClass('show');
							$(".al-mainInner").removeClass('al-fullBlur');
							$('.al-releasePageMask').removeClass('show');
							if (comm.browser.versions.ios) {
								$("body").css("overflow", "auto");
								$(".al-releasePageMask").removeClass('show');
								$(".al-mainInner").removeClass('al-fullBlur');
							} else {
								$("body").css("overflow", "auto");
								$(".al-mainInner").removeClass('al-fullBlurAndroid');
								$(".al-releasePageMask").removeClass('al-fullBlurAndroid');
							}
						}else if(t.options.noNeedBack){
							// $('.al-authFailBox').removeClass('show');
							// $(".al-mainInner").removeClass('al-fullBlur');
							// $('.al-releasePageMask').removeClass('show');
							$(".al-releasePageMask").removeClass('show');
							if (comm.browser.versions.ios) {
								$("body").css("overflow", "auto");
								$(".al-releasePageMask").removeClass('show');
								$(".al-mainInner").removeClass('al-fullBlur');
							} else {
								$("body").css("overflow", "auto");
								$(".al-mainInner").removeClass('al-fullBlurAndroid');
								$(".al-releasePageMask").removeClass('al-fullBlurAndroid');
							}
						}else{
							if(TempCache.getItem('fromPage')&&TempCache.getItem('fromPage')!=null){//被动登录有来源页，加来源页，没有按当前url判断
								g_sps.jump(null,TempCache.getItem('fromPage'));
							}else{
								if(
									/html\/m\/(video|case|topic|doc)/g.test(location.href)||
									/i_want.html/g.test(location.href)||
									/friends_circle/g.test(location.href)||
									/_upload.html/g.test(location.href)
								){
									g_sps.jump(null,"/");
								}else if(/conference_live/.test(location.href)){
									g_sps.jump(null,'/pages/conference/meeting_detail.html?conId='+comm.getpara().conId);
									// if(/login.html|auth.html/.test(document.referrer)){
									// 	history.go(-3);
									// }else{
									// 	history.back();
									// }
								}else if(/comment.html/.test(location.href)){
									if(/login.html/.test(document.referrer)){
										history.go(-3);
									}else{
										history.back();
									}
								}else if(/meeting_detail.html|discover_index.html/.test(location.href)){//[会议日程页关注| 标签专题页关注]无需返回上一页

								}else if(/login.html|auth.html/.test(document.referrer)){
									history.go(-2);
								}else{
									history.back();
								}
							}

						}
					}
				});
				comm.layerBottomFixed({
					layerDom:$('.al-alertModalMask'),
					closeBtn:$('.al-confirmModalEnsureBtn')
				});
				if(t.options){
					t.options.reAuthCallback&&t.options.reAuthCallback();
				}
				return false;
			} else if (auth.state == "3"){//认证拒绝
				/*comm.authFail();
				if($('video').length){
					$('video').hide();
				}
				$("body,html,.al-mainInner").css({
                    overflow:"hidden",
                    height:"100%"
                });
				if(window.location.href.indexOf('case_upload.html')>-1){
					$('html').css('font-size','8px');
				}
				$("#now_goAuth").on("click",function(){//去认证
					comm.creatEvent({
						triggerType:'认证',
						keyword:"现在认证",
						actionId:25
					});
					TempCache.setItem("fromPage", window.location.href);
					comm.redirect("/pages/passport/auth/auth.html", 0);
				});
				$(".al-authGiveUp").on("click",function(e){
					  $("body,html,.al-mainInner").css({
						overflow:"auto",
						height:"auto"
					  });
					comm.creatEvent({
						triggerType:'认证',
						keyword:"暂不认证",
						actionId:26
					});
					if(t.options && t.options.noNeedBack){//不需要返回 隐藏发布层
						e.stopPropagation();
						$('.al-authFailBox').removeClass('show');
						$(".al-mainInner").removeClass('al-fullBlur');
						$('.al-releasePageMask').removeClass('show');
                        t.options.noCallback&&t.options.noCallback();
					}else{//默认返回上一页
						if(
							/html\/m\/(video|case|topic|doc)/g.test(location.href)||
							/i_want.html/g.test(location.href)||
							/friends_circle/g.test(location.href)||
							/_upload.html/g.test(location.href)
						){
              g_sps.jump(null,"/");
						}else if(/live-wrap/.test(location.href)){
              g_sps.jump(null,'/pages/conference/meeting_detail.html?conId='+comm.getpara().conId);
						}else if(/comment.html/.test(location.href)){
							if(/login.html/.test(document.referrer)){
								history.go(-3);
							}else{
								history.back();
							}
						}else if(/meeting_detail.html|discover_tagSubject.html|discover_index.html/.test(location.href)){//[会议日程页关注| 标签专题页关注\发现首页关注收藏]无需返回上一页

						}else if(/login.html|auth.html/.test(document.referrer)){
							history.go(-2);
						}else{
							history.back();
						}
					}
				});*/
				//TODO edit by lichunhui 20180914 认证弹窗不走拒绝弹窗
				var _role = TempCache.getItem('customerRole')
				if (_role != 2 && _role != 3 && _role != 4) {
					t.redirectToRenZheng()
				}
				return false;
			} else {
				//新增组织2，厂商3，患者4 不用认证可观看权限
				var _role = TempCache.getItem('customerRole');
				if(_role!=2&&_role!=3&&_role!=4){
					t.redirectToRenZheng();
				}
			}
		} else {
			//popup("您尚未登录,即将跳转至登录页");
			/*if(!weixinFlag){
              TempCache.setItem("needAuth", "true");
              TempCache.setItem("fromPage", window.location.href);
              comm.redirect("/pages/passport/loginV2/login.html");
            }*/
			//todo update by lichunhui 20180812
			t.weixinLogin({
				callback:function(){
					user.redirectLogin();
				}
			});

		}

	},
	needRenZhengHandler: function() {
		var t=this;
		var href = "";
		if (user.getLoginStatus()) { // 已登录
			if (user.getRenZhengStatus()) { // 已认证
				if (!user.getWanShanStatus()) { // 未完善
					href = "/pages/passport/wanshanInfo.html?redirect=1";
				}
			} else { // 未认证
				//user.redirectToRenZheng();
				//href = "/pages/passport/auth/information.html";
				if(t.options.noAuthTip){
					comm.redirect('/pages/passport/auth/auth.html', 0);
				}else {
					comm.confirmAuthBox({
						ensureCallback: function () {
							TempCache.setItem('fromPage', location.href);
							href = '/pages/passport/auth/auth.html';
						},
						cancelCallback: function () {
							t.cancelAuth();
						}
					})
				}
			}
		} else { // 未登录
			href = "/pages/passport/loginV2/login.html";
		}

		if (href != "") {
			TempCache.setItem("needAuth", "true");
			TempCache.setItem("autoPlay", "true");
			TempCache.setItem("fromPage", window.location.href);
			comm.redirect(href, 0);
		}
	},
	getConferenceWanShanStatus: function() {
		var t = this;
		var auth = user.getRenZhengInfo();
		if (auth == undefined || $.isEmptyObject(auth) || auth.firstName == "" || auth.lastName == "" ||
			(auth.company == "" && auth.schoolName == "") || auth.medicalTitle == "" ) {
			return false;
		} else {
			return true;
		}
	},
	needConferenceAuthHandler: function() {
		var href = "";

		if (user.getLoginStatus()) { // 已登录
			if (user.getRenZhengStatus()) { // 已认证
				/*if (!user.getWanShanStatus()) { // 未完善
				 href = "/pages/passport/wanshanInfo.html?redirect=1";
				 }*/
			} else { // 未认证
				TempCache.setItem('fromPageConference',location.href);
				user.redirectToRenZheng();
			}
		} else { // 未登录
			href = "/pages/passport/loginV2/login.html";
		}

		if (href != "") {
			if (window.location.href.indexOf("login.html") < 0) {
				TempCache.setItem("fromPage", window.location.href);
			}
			TempCache.setItem("needConferenceAuth", "true");
			comm.redirect(href);
			return false;
		}
		return true;
	},
	/**
	 * 需认证，如未认证弹出全屏遮罩
	 */
	needRenZhengPop: function() {


		var userInfo = user.getRenZhengInfo();
		if (!user.getLoginStatus() || !user.getRenZhengStatus() || $.isEmptyObject(userInfo) || userInfo.medicalTitle == "" || (userInfo.company == "" && userInfo.schoolName == "") ) { // 未登录或未认证

			var type;
			if (!user.getLoginStatus()) {
				type = 1;
				$("body").append('<div class="v3-check-renzheng" id="checkRenZhengBox">' +
					'   <div class="alpha-bg"></div>' +
					'   <div class="center-img login-type"></div>' +
					'</div>').css("overflow", "hidden");
			} else if (!user.getRenZhengStatus()) {
				type = 2;
				$("body").append('<div class="v3-check-renzheng" id="checkRenZhengBox">' +
					'   <div class="alpha-bg"></div>' +
					'   <div class="center-img "></div>' +
					'</div>');
			} else if (user.getRenZhengStatus()) {
				if (userInfo.medicalTitle == "" || (userInfo.company == "" && userInfo.schoolName == "") ) {
					type = 3;
					$("body").append('<div class="v3-check-renzheng" id="checkRenZhengBox">' +
						'   <div class="alpha-bg"></div>' +
						'   <div class="center-img wanshan-type"></div>' +
						'</div>');
				}
			}
			$("#checkRenZhengBox,#checkRenZhengBox .alpha-bg,#checkRenZhengBox .center-img").height($(window).height());
			$("#checkRenZhengBox").on("vclick", function() {
				TempCache.setItem("needAuth", "true");
				TempCache.setItem("autoPlay", "true");
				TempCache.setItem("fromPage", window.location.href);

				if (type == 2) { // 已登录
					if (!user.getRenZhengStatus()) {
						user.redirectToRenZheng();
					}
				} else if (type == 1) {
					comm.redirect("/pages/passport/loginV2/login.html");
				} else if (type == 3) {
					comm.redirect("/pages/passport/wanshanInfo.html", 0);
				}
			});

			$("body").on("vmousemove scroll", function() {
				return false;
			})
		}
	},
	getLoginStatus: function() {
		var t = this;
		var isLoginStatus = false;
		//TODO 2017.10.19 lichunhui修改 因为浏览器关闭后session取不到了所以每次进入页面都需要重新获取session
		/*if(TempCache.getItem("userId")){
			isLoginStatus = true;
			return isLoginStatus;
		}*/

		$.ajax({
			url: "/mcall/web/user/checkSession/",
			dataType: "json",
			type: "post",
			async: false,
			success: function(result) {
				if (result && result.responseObject != null && result.responseObject.responseMessage.status == 1) { //已登录
					isLoginStatus = true;
				} else {
					isLoginStatus = false;
				}
			}
		});
		return isLoginStatus;
	},
	getRenZhengStatus: function() {
		var t = this;
		var isRenZhengStatus = false;

		var webUser = customer.getData("getWebUser");

		if (webUser && webUser != null && (!$.isEmptyObject(webUser)) && webUser.userId > 0) {
			//webUser.customerRole	//0游客 1系统 2组织 3厂商 4患者 5普通医师 6认证医师 14厂商未注册
			TempCache.setItem('customerRole',webUser.customerRole);
			TempCache.setItem("userId", webUser.userId?webUser.userId:'');
			TempCache.setItem("username", webUser.username);
			TempCache.setItem('weixinOpenId', webUser.weixinOpenId);
		} else {
			TempCache.removeItem("userId");
			TempCache.removeItem("username");
		}

		var auth;
		if(TempCache.getItem('auth')){
			auth = JSON.parse(TempCache.getItem('auth'));
		}else{
			if(TempCache.getItem('userId')){	//如果用户登录再取认证信息，否则不取
				auth = customer.getData("getCustomerAuth");
				if(!$.isEmptyObject(auth)){
					TempCache.setItem('auth',JSON.stringify(auth));
				}
			}
		}

		if (auth&& auth != null && !$.isEmptyObject(auth) && (auth.state==2||auth.state ==7 ||auth.state ==8 ||auth.state ==9)) {//auth.state==1||
			isRenZhengStatus = true;
		}
		if(webUser.customerRole==2||webUser.customerRole==4||webUser.customerRole==3
			|| webUser.customerRole == 15 || webUser.customerRole == 13){
			isRenZhengStatus =true;
		}
		t.isRenZhengStatus = isRenZhengStatus;
		return isRenZhengStatus;
	},
	getWebUser: function() {
		var t = this;
		var isRenZhengStatus = false;
		var webUser = customer.getData("getWebUser");
		return webUser;
	},
	getWanShanStatus: function() {
		var t = this;
		var isWanShanStatus = false;
		var auth;
		if(TempCache.getItem('auth')){
			auth = JSON.parse(TempCache.getItem('auth'));
		}else{
			auth = customer.getData("getCustomerAuth");
			if(!$.isEmptyObject(auth)){
				TempCache.setItem('auth',JSON.stringify(auth));
			}
		}
		if (auth != null && (!$.isEmptyObject(auth)) && auth.medicalTitle != "" && (auth.company != ""||auth.schoolName != "")) {
			isWanShanStatus = true;
		}
		//0游客 1系统 2组织 3厂商 4患者 5普通医师 6认证医师
		if(TempCache.getItem('customerRole')==1||TempCache.getItem('customerRole')==2||TempCache.getItem('customerRole')==3||TempCache.getItem('customerRole')==4){
			isWanShanStatus = true;
		}
		t.isWanShanStatus = isWanShanStatus;
		return isWanShanStatus;
	},
	redirectLogin: function() {
		var t=this;
		//popup("您尚未登录,即将跳转至登录页");
		TempCache.removeItem('needAuth')
		TempCache.setItem('fromPage', window.location.href)
		comm.redirect('/pages/passport/loginV2/login.html')
	},
	//跳转到登录页并记录来源页（被动)
	redirectToLogin: function() {
		var t=this;
		TempCache.removeItem('needAuth')
		TempCache.setItem('fromPage', window.location.href)
		comm.redirect('/pages/passport/loginV2/login.html')
	},
	success: function(s) {
		var t = TempCache.getItem("fromPage")||TempCache.getItem('fromPageN');
		//alert("444"+TempCache.getItem("fromPageN"));
		if(!t){
			if(document.referrer&&document.referrer.indexOf('personal/personal_')>-1&&location.href.indexOf('auth/auth.html')>-1){
				history.go(-2);
				return false;
			}else{
				g_sps.jump(null,"/");
			}
		}

		if((t&&t.lastIndexOf("personal/personal_")>-1)||(t&&t.lastIndexOf("/sns.html")>-1)){//从个人中心跳过来
			t="/dist/personal/personal_index.html";
		}
		if(t&&t.lastIndexOf("message_")>-1){//从消息跳过来
			t="/dist/message/message_index.html";
		}
		//TempCache.removeItem("fromPage");
		TempCache.removeItem("needAuth");

		if (t && typeof t != "undefined" && t != "" &&t!='null') {
			//TempCache.setItem("fromPage", "");
			//TempCache.removeItem("fromPage");
		} else {
			t = "/";
			if (!s || s == "") {
				s = "登录成功，即将返回首页";
			}

		}
		if(s){
			popup(s);
		}
		setTimeout(function() {
			g_sps.jump(null,t);
		}, 1000);
	},
	registSuccess: function() {
		var t;
		var self = this;
		var s="";
		var needConferenceAuth = TempCache.getItem("needConferenceAuth");
		var flag = comm.getpara().flag;
		var stopTimeout = false;
		if (needConferenceAuth != undefined && needConferenceAuth == "true") {
			console.log("818--->",location.href);
			s = "注册成功，即将跳转至完善资料页";
			t = "/pages/passport/wanshanInfoConference.html?isFollow=1";
		} else {
			console.log("822--->",location.href);
			var fromPage = TempCache.getItem('fromPageN');
			if(fromPage && typeof fromPage != "undefined" && fromPage != "" &&fromPage!='null'){ //如果有来源页
				if(TempCache.getItem('needAuthRegist')=='need'){   //需要认证权限
					s = "注册成功，即将跳转至身份认证页";
					t = '/pages/passport/auth/auth.html?isFollow=1';
				}else{  //跳转到标签选择页面（选择感兴趣的标签）
					s = "注册成功，即将跳转至来源页";
					t = fromPage;
				}

			}else{
				if(TempCache.getItem('needAuthRegist')=='need'){   //需要认证权限 跳认证页，否则跳首页
					s = "注册成功，即将跳转至身份认证页";
					t = '/pages/passport/auth/auth.html?isFollow=1';
				}else{          //跳转到感兴趣的标签页
					s = "注册成功，即将跳转至来源页";
					t = "/";
				}

			}
		}


		if(!stopTimeout){
			if(s){popup(s);}
			setTimeout(function() {
				g_sps.jump(null,t);
			}, 3000);
		}

	},
	redirectRenZheng: function() {
		var t=this;
		popup("您尚未通过医师认证");
		TempCache.setItem("fromPage", window.location.href);
		setTimeout(function() {
			if(TempCache.getItem('auth')&&JSON.parse(TempCache.getItem('auth')).state==3){//认证拒绝
				//comm.redirect("/pages/passport/auth/information.html?reAuth=1", 0);
				if(t.options.noAuthTip){
					console.log("862--->",location.href);
					comm.redirect('/pages/passport/auth/auth.html?isFollow=1', 0);
				}else {
					comm.confirmAuthBox({
						ensureCallback: function () {
							console.log("867--->",location.href);
							TempCache.setItem('fromPage', location.href);
							comm.redirect("/pages/passport/auth/auth.html?isFollow=1", 0);
						},
						cancelCallback: function () {
							// TempCache.removeItem('needAuthRegist');
							// if($(".al-releasePageMask").hasClass('show')){
							// 	$(".al-releasePageMask").removeClass('show');
							// 	if (comm.browser.versions.android) {
							// 		$(".al-releasePageMask").removeClass('al-fullBlurAndroid')
							// 	} else {
							// 		$(".al-mainInner").removeClass('al-fullBlur');
							// 	}
							// }else{
							// 	//history.back();
							// 	t.backFn();
							// }
							TempCache.removeItem('needAuthRegist');
							if ($(".al-releasePageMask").hasClass('show')) {
								$(".al-releasePageMask").removeClass('show');
								if (comm.browser.versions.ios) {
									$("body").css("overflow", "auto");
									$(".al-releasePageMask").removeClass('show');
									$(".al-mainInner").removeClass('al-fullBlur');
								} else {
									$("body").css("overflow", "auto");
									$(".al-mainInner").removeClass('al-fullBlurAndroid');
									$(".al-releasePageMask").removeClass('al-fullBlurAndroid');
								}
							} else if (t.options.noNeedBack) {
								e.stopPropagation();
								$('.al-authFailBox').removeClass('show');
								$(".al-mainInner").removeClass('al-fullBlur');
								$('.al-releasePageMask').removeClass('show');
								if (comm.browser.versions.ios) {
									$("body").css("overflow", "auto");
									$(".al-releasePageMask").removeClass('show');
									$(".al-mainInner").removeClass('al-fullBlur');
								} else {
									$("body").css("overflow", "auto");
									$(".al-mainInner").removeClass('al-fullBlurAndroid');
									$(".al-releasePageMask").removeClass('al-fullBlurAndroid');
								}
							} else {
								//history.back();
								if (
									/html\/m\/(video|case|topic|doc)/g.test(location.href) ||
									/i_want.html/g.test(location.href) ||
									/friends_circle/g.test(location.href) ||
									/_upload.html/g.test(location.href)
								) {
									g_sps.jump(null, "/");
								} else if (/live-wrap/.test(location.href)) {
									g_sps.jump(null, '/dist/conference/meeting_detail.html?conId=' + comm.getpara().conId);
								} else if (/comment.html/.test(location.href)) {
									if (/login.html/.test(document.referrer)) {
										history.go(-3);
									} else {
										history.back();
									}
								} else if (/meeting_detail.html|discover_tagSubject.html|discover_index.html/.test(location.href)) {//[会议日程页关注| 标签专题页关注\发现首页关注收藏]无需返回上一页

								} else if (/login.html|auth.html/.test(document.referrer)) {
									history.go(-2);
								} else {
									history.back();
								}
							}
						}
					});
				}
			}else if(TempCache.getItem('needAuthRegist')){	//第一次认证
				//comm.redirect("/pages/passport/auth/information.html?isFollow=1", 0);
				//comm.redirect("/pages/passport/auth/auth.html?isFollow=1", 0);
				if(t.options.noAuthTip){
					console.log("942--->",location.href);
					comm.redirect('/pages/passport/auth/auth.html?isFollow=1', 0);
				}else {
					comm.confirmAuthBox({
						ensureCallback: function () {
							console.log("947--->",location.href);
							TempCache.setItem('fromPage', location.href);
							comm.redirect("/pages/passport/auth/auth.html?isFollow=1", 0);
						},
						cancelCallback: function () {
							// TempCache.removeItem('needAuthRegist');
							// if($(".al-releasePageMask").hasClass('show')){
							// 	$(".al-releasePageMask").removeClass('show');
							// 	if (comm.browser.versions.android) {
							// 		$(".al-releasePageMask").removeClass('al-fullBlurAndroid')
							// 	} else {
							// 		$(".al-mainInner").removeClass('al-fullBlur');
							// 	}
							// }else{
							// 	//history.back();
							// 	t.backFn();
							// }
							t.cancelAuth();
						}
					});
				}
			}else{
				//comm.redirect("/pages/passport/auth/information.html", 0);
				//comm.redirect("/pages/passport/auth/auth.html", 0);
				if(t.options.noAuthTip){
					comm.redirect('/pages/passport/auth/auth.html', 0);
				}else {
					comm.confirmAuthBox({
						ensureCallback: function () {
							TempCache.setItem('fromPage', location.href);
							comm.redirect("/pages/passport/auth/auth.html", 0);
						},
						cancelCallback: function () {
							// TempCache.removeItem('needAuthRegist');
							// if($(".al-releasePageMask").hasClass('show')){
							// 	$(".al-releasePageMask").removeClass('show');
							// 	if (comm.browser.versions.android) {
							// 		$(".al-releasePageMask").removeClass('al-fullBlurAndroid')
							// 	} else {
							// 		$(".al-mainInner").removeClass('al-fullBlur');
							// 	}
							// }else{
							// 	//history.back();
							// 	t.backFn();
							// }
							t.cancelAuth();
						}
					});
				}
			}
		}, 3000);
	},
	//直接跳转至认证
	redirectToRenZheng: function() {
		var t=this;
		TempCache.setItem("fromPage", window.location.href);
		if(TempCache.getItem('auth')&&JSON.parse(TempCache.getItem('auth')).state==3){//认证拒绝
			//comm.redirect("/pages/passport/auth/information.html?reAuth=1", 0);
			//comm.redirect("/pages/passport/auth/auth.html", 0);
			if(t.options.noAuthTip){
				comm.redirect('/pages/passport/auth/auth.html', 0);
			}else {
				comm.confirmAuthBox({
					ensureCallback: function () {
						TempCache.setItem('fromPage', location.href);
						comm.redirect("/pages/passport/auth/auth.html", 0);
					},
					cancelCallback: function () {
						// TempCache.removeItem('needAuthRegist');
						// if($(".al-releasePageMask").hasClass('show')){
						// 	$(".al-releasePageMask").removeClass('show');
						// 	if (comm.browser.versions.android) {
						// 		$(".al-releasePageMask").removeClass('al-fullBlurAndroid')
						// 	} else {
						// 		$(".al-mainInner").removeClass('al-fullBlur');
						// 	}
						// }else{
						// 	//history.back();
						// 	t.backFn();
						// }
						t.cancelAuth();
					}
				});
			}
		}else if(TempCache.getItem('needAuthRegist')){	//第一次认证
			//comm.redirect("/pages/passport/auth/information.html?isFollow=1", 0);
			//comm.redirect("/pages/passport/auth/auth.html?isFollow=1", 0);
			if(t.options.noAuthTip){
				comm.redirect('/pages/passport/auth/auth.html?isFollow=1', 0);
			}else {
				comm.confirmAuthBox({
					ensureCallback: function () {
						TempCache.setItem('fromPage', location.href);
						comm.redirect("/pages/passport/auth/auth.html?isFollow=1", 0);
					},
					cancelCallback: function () {
						// TempCache.removeItem('needAuthRegist');
						// if($(".al-releasePageMask").hasClass('show')){
						// 	$(".al-releasePageMask").removeClass('show');
						// 	if (comm.browser.versions.android) {
						// 		$(".al-releasePageMask").removeClass('al-fullBlurAndroid')
						// 	} else {
						// 		$(".al-mainInner").removeClass('al-fullBlur');
						// 	}
						// }else{
						// 	//history.back();
						// 	t.backFn();
						// }
						t.cancelAuth();
					}
				});
			}
		}else{
			//comm.redirect("/pages/passport/auth/information.html", 0);
			if(/html\/m\/video/.test(location.href)&&$('#goLogin').length){//视频终端页 弹出认证层时候处理
				comm.redirect("/pages/passport/auth/auth.html", 0);
			}else{
				if(t.options.noAuthTip){
					comm.redirect('/pages/passport/auth/auth.html', 0);
				}else {
					comm.confirmAuthBox({
						ensureCallback: function () {
							TempCache.setItem('fromPage', location.href);
							comm.redirect("/pages/passport/auth/auth.html", 0);
						},
						cancelCallback: function () {
							// TempCache.removeItem('needAuthRegist');
							// if($(".al-releasePageMask").hasClass('show')){
							// 	$(".al-releasePageMask").removeClass('show');
							// 	if (comm.browser.versions.android) {
							// 		$(".al-releasePageMask").removeClass('al-fullBlurAndroid')
							// 	} else {
							// 		$(".al-mainInner").removeClass('al-fullBlur');
							// 	}
							// }else{
							// 	//history.back();
							// 	t.backFn();
							// }
							t.cancelAuth();
						}
					});
				}
			}

		}
	},
	redirectConferenceWanShan: function() {
		//popup("您尚未完善资料");
		if (window.location.href.indexOf("login.html") < 0) {
			TempCache.setItem("fromPage", window.location.href);
		}
		TempCache.setItem("needConferenceAuth", true);
		TempCache.setItem("fromPageConference", location.href);
		setTimeout(function() {
			comm.redirect("/pages/passport/wanshanInfoConference.html?redirect=1", 0);
		}, 3000);
	},
	privLogin: function(isAuth) {
		var t=this;
		if (!this.getLoginStatus()) {

			TempCache.setItem("fromPage", window.location.href);
			if (isAuth != undefined && isAuth) {
				TempCache.setItem("needAuth", "true");
			}
			comm.redirect('/pages/passport/loginV2/login.html');
		}
	},
	backFn:function(){
		var fromPage = TempCache.getItem('fromPage');
		if(/message_index/.test(fromPage)||
			/html\/m\/(video|case|topic|doc)/g.test(fromPage)||
			/i_want.html/g.test(fromPage)||
			/friends_circle/g.test(fromPage)||
			/_upload.html/g.test(fromPage)
		){
			g_sps.jump(null,"/");
		}else if(/live-wrap/g.test(fromPage)){
			if(/login.html/.test(document.referrer)||/register.html/.test(document.referrer)){
				history.go(-2);
			}else{
				history.back();
			}

		}else{
			history.back();
		}
	},
	cancelAuth:function(){
		var t =this;
		TempCache.removeItem('needAuthRegist');
		if($(".al-releasePageMask").hasClass('show')){
			$(".al-releasePageMask").removeClass('show');
			if (comm.browser.versions.android) {
				$(".al-releasePageMask").removeClass('al-fullBlurAndroid')
			} else {
				$(".al-mainInner").removeClass('al-fullBlur');
			}
		}else if(t.options.noNeedBack){
			$('.al-authFailBox').removeClass('show');
			$(".al-mainInner").removeClass('al-fullBlur');
			$('.al-releasePageMask').removeClass('show');
			t.options.noCallback&&t.options.noCallback();
		}else{
			if(
				/html\/m\/(video|case|topic|doc)/g.test(location.href)||
				/i_want.html/g.test(location.href)||
				/friends_circle/g.test(location.href)||
				/_upload.html/g.test(location.href)
			){
				g_sps.jump(null,"/");
			}else if(/conference_live/.test(location.href)){
				if(TempCache.getItem("caosreferrer")){
					TempCache.removeItem("caosreferrer");
					history.back();
					//g_sps.jump(null,'/pages/conference/live_list.html');
				}else{
					history.back();
					//g_sps.jump(null,'/dist/conference/meeting_detail.html?conId='+comm.getpara().conId);
				}
			}else if(/comment.html/.test(location.href)){
				if(/login.html/.test(document.referrer)){
					history.go(-3);
				}else{
					history.back();
				}
			}else if(/login.html|auth.html/.test(document.referrer)){
				history.go(-2);
			}else{
				history.back();
			}
		}
	},
};

user.getLoginStatus();
user.getRenZhengStatus();
//alert('module.user');

