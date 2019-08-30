/**
 * 功能描述： 跟踪用户操作记录 埋点
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiuYuTao on 2016/8/3.
 */

/*
 *
 *  `id` bigint(20) NOT NULL AUTO_INCREMENT,
 `customer_id` bigint(20) DEFAULT NULL COMMENT '会员id',
 `session` varchar(100) DEFAULT NULL COMMENT '用户session',
 `location_id` bigint(20) DEFAULT NULL COMMENT '区块id',
 `channel_id` bigint(20) DEFAULT NULL COMMENT '频道id',
 `column_id` bigint(20) DEFAULT NULL COMMENT '栏目id',
 `recommend_id` bigint(20) DEFAULT NULL COMMENT '推荐资源位id',
 `ad_id` bigint(20) DEFAULT NULL COMMENT '广告位id',
 `ad_position` varchar(100) DEFAULT NULL COMMENT '广告图片位置（宽高坐标，以字符分割）',
 `trigger_type` int(2) DEFAULT '0' COMMENT '触发方式（1-左键点击、2-右键点击、3-上滑、4-下滑、5-左滑、6-右滑、7-列表上拉、8-列表下拉、9-页面打开、10-页面关闭、11-双击、12-双指外滑、13-双指内滑、14-拖动、15-跳转页面、16-大图缩放）',
 `trigger_name` varchar(2000) DEFAULT NULL COMMENT '触发对象的名称or内容（按钮文字、图片地址、文字内容...）',
 `action_id` varchar(200) DEFAULT NULL COMMENT '动作：action   （prefer、search、reprint、review）',
 `param` varchar(2000) DEFAULT '' COMMENT '携带的参数字符串',
 `ref_id` bigint(20) DEFAULT NULL COMMENT '关联id',
 `ref_type` bigint(20) DEFAULT '0' COMMENT '关联类型（1-视频，2-文库，3-会议，4-话题 ,6-标签，7-病例，8-评论）',
 `src_location` varchar(200) DEFAULT NULL COMMENT '外部来源url｜落地url    ：  来源的H5页面链接',
 `to_location` varchar(200) DEFAULT NULL COMMENT '跳转链接',
 `op_ip` varchar(50) DEFAULT NULL COMMENT '操作来源（ip）',
 `ip_org` varchar(100) DEFAULT NULL,
 `area_code` varchar(100) DEFAULT NULL,
 `city` varchar(200) DEFAULT NULL COMMENT '城市',
 `country_code` varchar(50) DEFAULT NULL COMMENT '国家编码',
 `country_name` varchar(100) DEFAULT NULL COMMENT '国家',
 `latitude` varchar(50) DEFAULT NULL COMMENT '纬度',
 `longitude` varchar(50) DEFAULT NULL COMMENT '经度',
 `postal_code` varchar(20) DEFAULT NULL COMMENT '邮编',
 `region` varchar(30) DEFAULT NULL,
 `time_zone` varchar(100) DEFAULT NULL COMMENT '时区',
 `pro_version` varchar(20) DEFAULT NULL COMMENT 'app、项目版本号',
 `os_version` varchar(50) DEFAULT NULL COMMENT '操作系统版本',
 `t_version` varchar(50) DEFAULT NULL COMMENT '浏览器型号',
 `net_version` int(2) DEFAULT '0' COMMENT '网络状态1-wifi   2-2G  3-3G、4-4G',
 `telecom` int(2) DEFAULT '0' COMMENT '运营商（1-移动、2-联通、3-电信）',
 `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
 `site_id` int(6) DEFAULT '0' COMMENT '发送渠道',
 *
 *
 * */
;(function () {
	var config = {
		path: PC_CALL + "log/track/create/"
	};


	// TODO: 精细化组合事件 ,以免绑定事件过多
	var eventRules = {
		pages: {
			personalIndex: [],
			searchPage: [],
			list: []
		},
		modules: {
			users: [],
			comment: [],
			socail: [],
			menu: [],
			picShow: []
		}
	};

	//

	var AllEventRule = [
		/*公共模块*/
		{
			name: "v3-登录选项卡点击",
			selector: ".login-box .login_allin",
			event: "click"
		},
		{
			name: "v3-注册选项卡点击",
			selector: ".login-box .login_caos",
			event: "click"
		},
		{
			name: "v3-顶部导航菜单链接点击",
			selector: ".al-headerContainer ul li",
			event: "click",
			param: "href|text"
		}, {
			name: "v3-导航菜单搜索按钮点击",
			selector: "#search_Form",
			event: "click"
		}, {
			name: "v3-导航菜单搜索表单提交",
			selector: "#search_Form",
			event: "submit",
			param: "form"
		},  {
			name: "v3-左边侧栏导航链接点击",
			selector: ".al-mainSidebarList .al-mainSidebarItem a",
			event: "click"
		},
		/*{
			name: "v3-左边侧栏-滑过-hover",
			selector: ".al-mainSidebarList",
			event: "hover"
		},*/	{
			name: "v3-顶部浏览记录-滑过-hover",
			selector: ".al-headerSearchRecord",
			event: "hover"
		},	{
			name: "v3-顶部浏览记录条目-点击-click",
			selector: ".al-contentBrowse article",
			event: "click"
		},{
			name: "v3-左边侧栏-发布按钮-点击-click",
			selector: ".al-release_popBox a",
			event: "click",
			param: "text"
		},{
			name: "v3-关注按钮-点击-click",
			selector: ".ev-followBtn",
			event: "click"
		},{
			name: "v3-页面底部链接-点击-click",
			selector: ".al-mainFooterLinks a",
			event: "click"
		},{
			name: "v3-分页-页码按钮-点击-click",
			selector: ".page-container .pages li",
			event: "click"
		},{
			name: "v3-换一换按钮-点击-click",
			selector: "#ev_randomChange",
			event: "click"
		},{
			name: "v3-页面右侧栏链接-点击-click",
			selector: ".al-indexSidebar a",
			event: "click"
		},

		/* 个人中心 */
		{
			name: "v3-个人中心-为你推荐-Tab-Click",
			selector: ".personal_recommend .Ev-clickRecommend",
			event: "click",
			param: "text"
		},
		{
			name: "v3-个人中心-好友动态-Tab-Click",
			selector: ".personal_recommend .Ev-clickFriendTrend",
			event: "click",
			param: "text"
		},
		{
			name: "v3-个人中心-发布病例-Btn-Click",
			selector: ".personal_index_channel_fl #case_upload",
			event: "click",
			param: "text"
		},
		{
			name: "v3-个人中心-聊话题-Btn-Click",
			selector: ".personal_index_channel_fl #topic_upload",
			event: "click",
			param: "text"
		},
		{
			name: "v3-个人中心-写文章-Btn-Click",
			selector: ".personal_index_channel_fl #doc_upload",
			event: "click",
			param: "text"
		},
		{
			name: "v3-个人中心-传视频-Btn-Click",
			selector: ".personal_index_channel_fl #video_upload",
			event: "click",
			param: "text"
		},
		{
			name: "v3-个人中心-更多-Btn-Click",
			selector: ".personal_index_channel_fl .toBeContinue",
			event: "click",
			param: "text"
		},
		/*我的消息*/
		{
			name: "v3-我的消息-内容项-Links-Click",
			selector: ".Ev-mesReviewListCon .Ev-mesListBox",
			event: "click",
			param: "text"
		},
		/*频道页 ------*/
		{
			name: "v3-首页主内容区链接点击-Links-Click",
			selector: ".al-indexMainContent .al-contentText a",
			event: "click",
			param: "href|text"
		},		{
			name: "v3-首页主内容区推荐链接点击-Links-Click",
			selector: ".al-indexMainContent .al-recommendLinks a",
			event: "click",
			param: "href|text"
		},	{
			name: "v3-首页右侧个人头像信息链接点击-Links-Click",
			selector: ".al-index-mesMainR .al-recommendLinks a",
			event: "click",
			param: "href|text"
		},	{
			name: "v3-首页右侧个人头像信息链接点击-Links-Click",
			selector: ".al-allActive .ev_dynamicBox a",
			event: "click",
			param: "href|text"
		},		{
			name: "v3-频道页-标签-Links-Click",
			selector: ".video_tag a,.floor_tag a",
			event: "click",
			param: "href|"
		},
		{
			name: "v3-频道页-幻灯片-Links-Click",
			selector: ".swiper-wrapper a",
			event: "click",
			param: "href|title"
		},
		{
			name: "v3-频道页-编辑推荐-Links-Click", //
			selector: ".bianji a,.doc_cont_left a",
			event: "click",
			param: "href|title"
		}, {
			name: "v3-频道页-视频频道-个人定制-Tabs-Click", //
			selector: "#recommendForYou .video_tj_li ul li",
			event: "click",
			param: "text"
		}, {
			name: "v3-频道页-视频频道-个人定制-Links-Click", //
			selector: "#recommendForYou .v_tj_list ul li",
			event: "click",
			param: "text"
		}, {
			name: "v3-频道页-浏览排行-Tabs-Click", //
			selector: "#channelChart .ll_mourth_text,.ll_week_text",
			event: "click",
			param: "text"
		}, {
			name: "v3-频道页-浏览排行-Links-Click", //
			selector: "#channelChart ul li a",
			event: "click",
			param: "text|href"
		}, {
			name: "v3-频道页-最新发布-Links-Click", //
			selector: ".news_sc .v_h_main .days-list .day-item a",
			event: "click",
			param: "text|href"
		}, {
			name: "v3-频道页-发布按钮-Links-Click", //
			selector: "#case_upload_btn,#topic_upload_btn,#video_upload_btn",
			event: "click",
			param: "text"
		},  	{
			name: "v3-发现页-主内容按XX链接-Links-Click", //
			selector: ".al_dis_searchLists .al_dis_item a",
			event: "click",
			param: "text|href"
		},	{
			name: "v3-发现页-列表内容链接点击-Links-Click", //
			selector: ".al-disMajorMainBox .al-disMajorMainBox_body a",
			event: "click",
			param: "text|href"
		},	{
			name: "v3-发现页-按类型列表侧栏类型筛选-Btn-Click", //
			selector: ".al-firstFloorTag li",
			event: "click",
			param: "text"
		},   {
			name: "v3-发现页-按标签列表侧栏标签筛选-Btn-Click", //
			selector: ".al-discover_sidebar .discover_hotTag_ul li",
			event: "click",
			param: "text"
		},{
			name: "v3-发现页-右侧推荐权威专家-Links-Click", //
			selector: ".al-discover_know .al-discover_knowZj a",
			event: "click",
			param: "text|href"
		},{
			name: "v3-发现页-右侧他们都在看-Links-Click", //
			selector: ".ev_allSee a",
			event: "click",
			param: "text|href"
		},{
			name: "v3-发现页-列表头部排序选择-tabs-Click", //
			selector: ".al-disMajorMainBox_head li a",
			event: "click",
			param: "text"
		},{
			name: "v3-会议页-会议链接-Links-Click", //
			selector: ".meeting_wrap a",
			event: "click",
			param: "text|href"
		},
		/* 个人主页*/
		{
			name: "v3-个人主页-右侧导航-Nav-Click", //
			selector: ".personal_right .personal_nav_list .ev-navTitle",
			event: "click",
			param: "text|"
		},	{
			name: "v3-个人主页-Ta的XX导航-Nav-Click", //
			selector: ".al-personalNavbar .al-personalNavbarItem",
			event: "click",
			param: "text|"
		},
		{
			name: "v3-个人主页-个人动态-Links-Click", //
			selector: ".personal_left .p_content_list a",
			event: "click",
			param: "text|href"
		},
		/*列表页*/
		{
			name: "v3-列表页-排序Tabs-Click", //
			selector: ".list_main .list_cont_list_nav .list_cont_nav_li",
			event: "click",
			param: "text"
		}, {
			name: "v3-列表页-筛选项-options-Click", //
			selector: ".list_top_cont .down-select-item a",
			event: "click",
			param: "text"
		}, {
			name: "v3-列表页-分页-pages-Click", //
			selector: ".list_content .page-container .page-number,.list_content .page-container .pgNext",
			event: "click",
			param: "text"
		}, {
			name: "v3-列表页-资源条目-links-Click", //
			selector: ".list_cont_list .list ul li a",
			event: "click",
			param: "text|href"
		},
		/*搜索页*/
		{
			name: "v3-搜索页左侧导航-ResourceType-Click", //
			selector: "#bodybox .list_cont_left ul li",
			event: "click",
			param: "text"
		},
		{
			name: "v3-搜索页右侧资源-Resources-Click", //
			selector: "#bodybox .list_cont_right .search_floor a,#bodybox .list_cont_right .search_floor_user a",
			event: "click",
			param: "text|href"
		},
		/* 交互模块*/
		{
			name: "v3-交互模块-功能-Click", //
			selector: ".plugin-relation li div",
			event: "click",
			param: "text"
		},
		{
			name: "v3-交互模块-底部分享-Click", //
			selector: ".module-floatRelation ul li,.module-floatRelation .fx_b_jh div",
			event: "click",
			param: "text"
		},
		/*登录注册、认证、弹层*/
		{
			name: "v3-权限模块-登录注册-Tabs-Click", //
			selector: ".m-UserPop-v2 .login_title .login_allin,.m-UserPop-v2 .login_title .login_caos",
			event: "click",
			param: "text"
		},
		{
			name: "v3-权限模块-登录注册-Btn-Click", //
			selector: "#allinSubmitBtn,#registBtn,#indexCantLogin,.m-UserPop-v2 .third-party a",
			event: "click",
			param: "text"
		}, {
			name: "v3-权限模块-登录注册-close-Click", //
			selector: ".m-UserPop-v2 .close",
			event: "click"
		},
		/*组织页*/
		{
			name: "v3-组织页面-links-Click", //
			selector: ".organization_list li a",
			event: "click",
			param: "text"
		},
		/*会议页*/
		{
			name: "v3-会议页面-模板导航-links-Click", //
			selector: ".evNaviTab li a",
			event: "click",
			param: "text|href"
		},
		{
			name: "v3-会议页面-模板内容区-links-Click", //
			selector: "#meeting_content a",
			event: "click",
			param: "text|href"
		},
		{
			name: "v3-页面底部-Links-Click", //
			selector: ".footer_center a",
			event: "click",
			param: "text|href"
		}
	];

	//（1-左键点击、2-右键点击、3-上滑、4-下滑、5-左滑、6-右滑、7-列表上拉、8-列表下拉、9-页面打开、10-页面关闭、11-双击、12-双指外滑、13-双指内滑、14-拖动、15-跳转页面、16-大图缩放）
	var triggerTypes = {
		"left_click": 1,
		"right_click": 2,
		"up_scroll": 3,
		"down_scroll": 4,
		"left_scroll": 5,
		"right_scroll": 6,
		"list_swipe_up": 7,
		"list_swipe_down": 8,
		"page_open": 9,
		"page_close": 10,
		"double_click": 11,
		"pinch_out": 12,
		"pinch_in": 13,
		"drag": 14,
		"page_jump": 15,
		"hover": 16
	};

	var baseParams = {};

	function locationError(error) {
		/*	switch(error.code) {
		 case error.TIMEOUT:
		 console.log("A timeout occured! Please try again!");
		 break;
		 case error.POSITION_UNAVAILABLE:
		 showError('We can\'t detect your location. Sorry!');
		 break;
		 case error.PERMISSION_DENIED:
		 showError('Please allow geolocation access for this to work.');
		 break;
		 case error.UNKNOWN_ERROR:
		 showError('An unknown error occured!');
		 break;
		 }*/
		baseParams.latitude = "";
		baseParams.longitude = "";
	}

	function locationSuccess(position) {
		var coords = position.coords;
		baseParams.latitude = coords.latitude;
		baseParams.longitude = coords.longitude;
		localStorage.setItem("latitude", coords.latitude);
		localStorage.setItem("longitude", coords.longitude);
	}

	if (navigator.geolocation) {
		if (window.localStorage && !window.localStorage.getItem("latitude")) {
			navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {
				// 指示浏览器获取高精度的位置，默认为false
				enableHighAccuracy: true,
				// 指定获取地理位置的超时时间，默认不限时，单位为毫秒
				timeout: 5000,
				// 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
				maximumAge: 3000
			});
		} else {
			baseParams.latitude = localStorage.getItem("latitude");
			baseParams.longitude = localStorage.getItem("longitude");
		}
	} else {
		//alert("Your browser does not support Geolocation!");
	}


	function getOS() {
//获取用户代理
		var ua = navigator.userAgent;
		if (ua.indexOf("Windows NT 5.1") != -1) return "Windows XP";
		if (ua.indexOf("Windows NT 6.0") != -1) return "Windows Vista";
		if (ua.indexOf("Windows NT 6.1") != -1) return "Windows 7";
		if (ua.indexOf("Windows NT 6.3") != -1) return "Windows 8";
		if (ua.indexOf("Windows NT 6.4") != -1) return "Windows 10";
		if (ua.indexOf("Windows NT 10.0") != -1) return "Windows 10";
		if (ua.indexOf("(Macintosh;") != -1) return "Macbook";
		if (ua.indexOf("iPhone") != -1) return "iPhone";
		if (ua.indexOf("iPad") != -1) return "iPad";
		if (ua.indexOf("Linux") != -1) {
			var index = ua.indexOf("Android");
			if (index != -1) {
//os以及版本
				var os = ua.slice(index, index + 13);

//手机型号
				var index2 = ua.indexOf("Build");
				var type = ua.slice(index + 1, index2);
				return type + os;
			} else {
				return "Linux";
			}
		}
		return "未知操作系统";
	}

	function getTimeZone() {
		var d = new Date();
		return d.getTimezoneOffset() / 60
	}

	baseParams.osVersion = getOS();//getSystem().system; // 系统版本
	baseParams.timeZone = "GMT " + getTimeZone();
	baseParams.siteId = '1';        //唯医网
	baseParams.tVersion = navigator.appCodeName + " " + navigator.appVersion;   // 浏览器版本


	function track(trigger_type, trigger_name, trigger_param) {
		var src_location = document.referrer || window.location.href;
		var to_location = window.location.href;
		var tp = trigger_param ? trigger_param : "";

		var params = $.extend(baseParams, {
			"triggerType": trigger_type,
			"triggerName": trigger_name,
			"srcLocation": src_location,
			"toLocation": to_location,
			"param": tp
		});

		var asyncType = true;
		if (trigger_type == triggerTypes.page_close) {
			asyncType = false;
		}

		var paramJson = {
			paramJson: $.toJSON(params)
		};
		sendTrack(paramJson);
	}

	/*发送*/
	function sendTrack(params, asyncType) {
		$.ajax({
			url: config.path,
			data: params,
			type: "post",
			async: asyncType,
			success: function (data) {
			}
		});
	}


	function getTriggerType(event) {
		switch (event) {
			case "click":
				return triggerTypes.left_click;
			case "hover":
				return triggerTypes.hover;
			default :
				return triggerTypes.left_click;
		}
	}


	function bindBodyEvent() {
		for (var i = 0; i < AllEventRule.length; i++) {
			var obj = AllEventRule[i];
			(function (obj) {
				switch (obj.event) {
					case "click":
						$(document).on(obj.event, obj.selector, function (e) {
							var trigger_type = getTriggerType(obj.event);
							var param = "";
							if (obj.param) {
								var arr = obj.param.split("|");
								for (var j = 0; j < arr.length; j++) {
									var obj1 = arr[j];
									switch (obj1) {
										case 'text':
											param += "|innerText=" + $.trim($(this).text());
											break;
										case 'href':
											param += "|href=" + $(this).attr("href");
											break;
										default:
											break;
									}
								}
							}
							track(trigger_type, obj.name, param);
						});
						break;
					case "hover":
						$(document).on(obj.event, obj.selector, function (e) {
							var trigger_type = getTriggerType(obj.event);
							var param = "";
							if (obj.param) {
								var arr = obj.param.split("|");
								for (var j = 0; j < arr.length; j++) {
									var obj1 = arr[j];
									switch (obj1) {
										case 'text':
											param += "|innerText=" + $.trim($(this).text());
											break;
										case 'href':
											param += "|href=" + $(this).attr("href");
											break;
										default:
											break;
									}
								}
							}
							track(trigger_type, obj.name, param);
						});
						break;
					case "submit":
						$(obj.selector).on(obj.event, function (e) {
							var inputs = $(obj.selector).find("input");
							$.each(inputs, function (index, item) {
								param += $(item).attr("name") + "=" + $(item).val();
							});
							track(trigger_type, obj.name, param);
						});
						break;
				}

			})(obj);
		}
	}

	function bindPageLeave() {
		$(window).on("unload", function () {
			track(triggerTypes.page_close, "v3-页面关闭或者跳转了");
		});
	}


	function bindBodyAllClickEvent() {
		(function ($) {

			jQuery.fn.extend({
				domPath: function (options) {
					var opDefault, fullPaths, $this;
					// ton push all elements short path as string
					fullPaths = [];

					// default options
					opDefault = {
						tag             :   true,   // get dom tag
						lowerCase       :   true,   // get tag in lower or upper case
						//class           :   true,   // get element class
						clazz			:true,			//class为保留关键字，换成clazz
						id              :   true,   // get element id
						index			: 	true,	// get index in a list ,don't append  when it don't have siblings
						body            :   false,  // show body in dom full path
						idBeforeClass   :   true,   // display id before class
						oneResult       :   false,  // get only the first result(as string)
						scaleType       :   false   // if the result contains only one element get it as string and not array
					};

					var ops = $.extend(opDefault, options);

					// get dom path depending on options
					var getDomPath = function (el) {

						var elString, elId, elClass, elIdClass,elIndex;
						elString = elId = elClass = '';

						// if the tag option is enabled
						if(ops.tag){
							// get the tag name in lower or upper case
							elString = ops.lowerCase ? el.tagName.toLowerCase() : el.tagName.toUpperCase();
						}

						if (ops.id && el.id) {
							elId = '#' + el.id;
						}

						// concat class names
						if (ops.clazz && el.className) {
							elClass = '.' + $.trim(el.className).replace(/ /g, '.');
						}

						// if it is in a list
						if (ops.index && $(el).siblings(el.tagName).size()>0) {
							elIndex = '[' + $(el).index() + ']';
						}

						// to display id before or after class name
						elIdClass = ops.idBeforeClass ? elId.concat(elClass) : elClass.concat(elId);
						elString += elIdClass;


						if(elIndex!=undefined){
							elString += elIndex;
						}
						return elString;

					};

					// if the oneResult option is enabled work only in the first element
					$this = ops.oneResult ?  $(this[0]) : this;

					// do it for all elements
					$this.each(function () {

						var current, domPathItem, pathArray;
						// to don't confuse the this scopes
						current = $(this);
						pathArray = [];

						//pathify also the first element and not only parents
						domPathItem = getDomPath(current.get(0));
						if(domPathItem === ''){
							return [];
						}

						pathArray.push(domPathItem);
						// for every parent inside body
						$this.parents(':not(html)').each(function () {
							if(this.tagName) {
								domPathItem = getDomPath(this);
								// if the tag option is disabled, it might return empty
								if(domPathItem !== ''){
									pathArray.push(domPathItem);
								}
							}

						});

						// reverse array ton contact it to string
						pathArray.reverse();

						// if the body option is disabled, check first if the
						// pathArray is not empty and shift its first element
						if (!ops.body  && pathArray.length > 0 && pathArray[0].toLowerCase().search('body') === 0) {
							pathArray.shift();
						}

						// concat with > only if the pathArray has two elements or more
						fullPaths.push(pathArray.length > 1 ? pathArray.join(' > ') : pathArray[0]);

					});

					// if the option oneResult or scaleType is enabled return only one/first result as string
					if(ops.oneResult || (fullPaths.length === 1 && ops.scaleType)){
						fullPaths = fullPaths[0];
					}

					return fullPaths;
				}
			});

			jQuery.fn.extend({
				domPath: jQuery.fn.domPath
			});

		})(jQuery);

		$("body").on("click", function (e) {
			var param = "";
			var elPath = $(e.target).domPath()[0];
			var donotTrackTheseContainersWhenClick = [
				"section.al-mainIndex",	//主内容区域
				"section.al-mainSidebar",	//主侧边栏
				"section.al-indexInner",	// 频道页点击右侧空白区时容器
				"header.al-header.al-indexHeader", // 产品页头部空白
				"header.al-header",	//	消息页头部空白
				"section.al-headerContainer", // 顶部容器
				"div.fellowship_main",	// fellow页
				"section.al-mainInner", 	// 发现页
				"div.mask",	// 遮罩
				"aside.al-mainSidebar.al-mainSidebarCollapse", // 左侧栏
				"section.al-mainSidebarList", // 左侧栏2
				"ul",		// 列表空白区
				"div.meeting_wrap", // 会议页空白区
				"footer.al-mainFooter", // 底部空白区
				"div.organization_mian", // 组织页空白区
				"section.al-pageMainBox", // 终端页空白区
				"div.doctor_test", // 医师定考空白
				"section.al-personal" // 个人中心空白
			];
			var eLArr = elPath.split(">");
			var lastNode = null;
			if(eLArr.length>0){
				lastNode = eLArr[eLArr.length-1];
			}else{
				lastNode = elPath;
			}

			var lastNodeStr = lastNode.replace(/(\[[0-9]\])+/,"");
			lastNodeStr = lastNodeStr.replace(/\s/,"");
			if($.inArray(lastNodeStr,donotTrackTheseContainersWhenClick)<0){
				track(triggerTypes.left_click, elPath);
			}
		})
	}

	/*$(function () {
		track(triggerTypes.page_open, "v3-页面打开");
		bindBodyAllClickEvent();
		bindPageLeave();
		bindBodyEvent();
	});*/


})();