/**
 * 功能描述：个人首页
 * 使用方法：
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by QiaoLiang on 2015-3-30.
 */

$(function () {

	//获取当前人id
	var uid = parseInt($("#sesCustomerId").val());

	if (isNaN(uid) || uid.toString().length !== 13) g_sps.jump(null,"/");

	//判断是否PC端
	if (!comm.equipment.IsPC()) {
        g_sps.jump(null,"//m.allinmd.cn");
		return false;
	}

	//引入三步曲
	module.trilogy({
		customerId: uid,
		callback: function () {
			//可能认识的人
			module.familiar({
				container: ".module-familiar-warp",
				toggleData: ".toggleData",
				uid: uid
			});

			$(".module-familar").show();
			$(".ev-mainNav").show();
		}
	});

	module.validateEmail(); // 验证邮箱是否已验证

	var obj = {
		uid: uid, //当前人id
		faceInfo: $(".ev-faceInfo"), //头像信息元素
		logoUrl: $(".ev-logoUrl"),//头像元素
		vip: $(".ev-vip"), // vip元素
		nickname: $(".ev-nickname"), //姓名元素
		companyMedicalTitle: $(".ev-companyMedicalTitle"), //职称 医院
		followNum: $(".ev-followNum"), //关注数
		fansNum: $(".ev-fansNum"), //粉丝数
		trendsNum: $(".ev-trendsNum"), //全部动态数
		trendsMeNum: $(".ev-trendsMeNum"), //动态数
		remindNum: $(".ev-remindNum"),//提醒数
		reviewNum: $(".ev-reviewNum"),//回复数
		praiseNum: $(".ev-praiseNum"),//赞数
		totalMessagesNum: $(".ev-totalMessagesNum"),//提醒/回复/赞数累加
		collectionNum: $(".ev-collectionNum"),//收藏数
		discussNum: $(".ev-discussNum"), //讨论数
		navi: $(".ev-navi"), //导航
		naviSun: $(".ev-sunNavi"), //子导航
		listAreaTitle: $(".ev-listAreaTitle"),//列表标题
		listArea: $(".ev-listArea"), //列表区域
		pager: $(".pager"), //翻页
		navNum: $(".p_nav_num"),//数字列表
		recommendForYouMore: $(".Ev-recommendForYouMore"), //为你推荐时的更多按钮
		forYouEle: $(".Ev-recommendForYou"), //为你推荐结构
		friendTrendsEle: $(".Ev-friendTrends") //好友动态结构
	};

	//初始化
	initPersonalIndex(obj);
	
	//视频和更多的点击
	$(".toBeContinue").each(function (i, em) {
		var $this = $(this);
		$(this).click(function () {
			$(".continue_img").remove();
			$this.append('<img class="continue_img" src="//img00.allinmd.cn/personal/jqqd.png"/ style="width:214px;">');
			$(".continue_img").animate({height: 32}, 500);
			$this.timer = null;
			clearTimeout($this.timer);
			$this.timer = setTimeout(function () {
				$this.find(".continue_img").animate({height: 0}, 500);
			}, 2000);
		});
	});
	
	//编辑文章
	module.docUpload({
		editBtn: $(".ev-docEdit"),//$("#doc_upload"),
		container: $(".personal_content"),
		top: 0,
		userImg: 0
	});

	//编辑病例
	module.caseUpload({
		editBtn: $(".ev-caseEdit"),//$("#case_upload"),
		container: $(".personal_content"),
		top: 0,
		userImg: 0
	});

	//所有查看大图功能
	$(document).on("click", ".viewBigImg", function (e) {
		var container = $(this);
		var index = 0;
		if ($(e.target).parents("li").eq(0).index() > 0) {
			index = $(e.target).parents("li").eq(0).index();
		}
		module.viewBigImgAll({event: e, container: container, index: index});
	});

});

function initPersonalIndex(obj) { //好友动态
	var controller = {
		path: {
			initCore: PC_CALL + "customer/unite/json_info/", //个人信息
			recommendForYou: PC_CALL + "cms/recommend/getMapListDynamic/", //为你推荐
			recommendAD: PC_CALL + "cms/recommend/getADPositionMapList/", //为你推荐 中广告
			trends: PC_CALL + "customer/trends/json_list/", //全部动态
			trendsMy: PC_CALL + "customer/trends/json_list/", //动态
			remind: PC_CALL + "customer/trends/json_list/",//提醒
			review: PC_CALL + "review/json_list/",//回复
			collection: PC_CALL + "customer/trends/json_list/",//收藏
			discuss: PC_CALL + "customer/message/json_grouplist/", // 关注提醒
			getActivity: PC_CALL + "cms/activity/getMapList/",//获取活动信息
			getRegisterStatus: PC_CALL + "activity/register/getRegisterStatus/",//获取报名状态
			getActivityStatus: PC_CALL + "activity/event/isSignUpOver/"
		},
		opts: {
			uid: 0,//当前人id
			logoUrl: "",//头像元素
			nickname: "", //姓名元素
			vip: null,
			companyMedicalTitle: "", //职称 医院
			followNum: 0, //关注数
			fansNum: 0, //粉丝数
			trendsNum: 0, //全部动态数
			trendsMeNum: 0, //动态数
			remindNum: 0,//提醒数
			reviewNum: 0,//回复数
			praiseNum: 0,//赞数
			totalMessagesNum: 0, //提醒数/回复/赞数 累加 --消息数
			collectionNum: 0,//收藏数
			discussNum: 0, //讨论数,
			recommendForYouMore: null, //为你推荐时的更多按钮
			forYouEle: null, //结构
			friendTrendsEle: null,
			faceInfo: null,
			navi: null,
			naviSun: null,
			listArea: null,
			listAreaTitle: null,
			pager: null
		},
		config: {
			PAGE_SIZE: 20,
			CARD_PAGE_SIZE: 12
		},
		init: function (obj) {
			var t = this;
			$.extend(t.opts, obj);

			//页面初始化基础数据 及执行列表
			t.initPageAjax();
			
			//副导航事件
			t.opts.naviSun.children("div").off("click").on("click", function () {
				//清除消息
				t.opts.forYouEle.hide();
				t.opts.friendTrendsEle.show();
				t.opts.pager.parent().show();
				t.toggleRecommendAndTrends(".Ev-clickFriendTrend","trends"); //置为好友动态
				
				var chooseNav = $(this).attr("data-events");

				//将初始化后需要的统计值及地址参数统一存入临时变量库中
				var temp = t.getTotalTitleUrlParams(chooseNav);

				//将标题替换为当前执行导航名
				t.opts.listAreaTitle.text(temp.title);
				
				//如果消息列表打开则收缩
				if($("[data-events=messages]").attr("data-trigger") === "on"){ 
					$("[data-events=messages]").removeClass("liActive");
					$("img", $("[data-events=messages]")).attr("src", "//img00.allinmd.cn/personal/xiasanjiao.png");
					$("dl", $("[data-events=messages]")).hide();
				}
				//移除导航划亮状态
				t.opts.navi.find("[data-trigger]").removeClass("hover").removeAttr("data-trigger");
				
				//调用粉丝 关注列表
				if (chooseNav === "fans" || chooseNav === "follow") {
					if (temp.totalNum > 0) {
						//启用翻页
						t.opts.pager.parent().show();
						module.userList({
							customerId: t.opts.uid, //本人id
							type: chooseNav,//类型
							container: t.opts.listArea,//存放列表的容器
							pageTotal: temp.totalNum,//总页数
							pageSize: t.config.CARD_PAGE_SIZE,//每页的数量
							pagination: t.opts.pager//分页容器
						});
					} else {
						var tips = "粉丝";
						if (chooseNav === "follow") tips = "关注过";
						t.opts.listArea.html("<div class=\"no_dongtai font_yahei\">你还没有" + tips + "哦～</div>");
						//禁用翻页
						t.opts.pager.parent().hide();
					}
				}else{ //动态
					//划亮到首页
					//t.opts.navi.find("[data-events=trends]").addClass("hover").attr("data-trigger","on");

					//输出列表
					t.getListData(temp);
				}
			});

			//主导航事件
			t.opts.navi.find("li").on("mouseover", function () {
				if ($(this).attr("data-trigger") !== "on") {
					$(this).addClass("hover");
					
					if($("div",this).eq(0).find("img").length > 0){ // 带箭头消息
						$("div",this).eq(0).find("img").attr("src","//img00.allinmd.cn/personal/baixiasan.png");
					}
				}
			}).on("mouseout", function () {
				if ($(this).attr("data-trigger") !== "on") {
					$(this).removeClass("hover");
					
					if($("div",this).eq(0).find("img").length > 0){ // 带箭头消息
						$("div",this).eq(0).find("img").attr("src","//img00.allinmd.cn/personal/xiasanjiao.png");
					}
				}
			}).on("click", function () {
				$(this).attr("data-trigger", "on").siblings("li").attr("data-trigger", "off").removeClass("hover");
				var chooseNav = $(this).attr("data-events");
				var getT2UP = t.getTotalTitleUrlParams(chooseNav);
				
				if(chooseNav === "messages"){ //消息 二级菜单处理 因将事件绑定到子元素下的div所以会是undefined,只用来处理显示与隐藏消息二级菜单
					if( $(this).attr("class").indexOf("liActive") >0 ){
						$(this).removeClass("liActive");
						$("img", this).attr("src", "//img00.allinmd.cn/personal/baixiasan.png");
						$("dl", this).hide();
					}else{
						$(this).addClass("liActive");
						$("img", this).attr("src", "//img00.allinmd.cn/personal/baishangsan.png");
						$("dl", this).show();
					}
				} else { //非消息下 菜单情景
					t.toggleRecommendAndTrends(".Ev-clickFriendTrend","trends"); //置为好友动态
					t.opts.forYouEle.hide();
					t.opts.friendTrendsEle.show();
					t.opts.pager.parent().show();
					//清除消息
					$(this).parent().find("[data-events=messages]").removeClass("liActive");
					$("img", $(this).parent().find("[data-events=messages]")).attr("src", "//img00.allinmd.cn/personal/xiasanjiao.png");
					$("dl", $(this).parent().find("[data-events=messages]")).hide();
					
					//将标题替换为当前执行导航名
					t.opts.listAreaTitle.text(getT2UP.title);

					//输出列表
					t.getListData(getT2UP);
				}
			}).find("dd").on("click", function(e){ //用来处理消息下的二级菜单
				t.opts.forYouEle.hide();
				t.opts.friendTrendsEle.show();
				t.opts.pager.parent().show();
				t.toggleRecommendAndTrends(".Ev-clickFriendTrend","trends"); //置为好友动态
				
				var chooseNav = $(this).attr("data-events");
				var getT2UP = t.getTotalTitleUrlParams(chooseNav);
				
				//将标题替换为当前执行导航名
				t.opts.listAreaTitle.text(getT2UP.title);
				//调用赞列表
				if (chooseNav === "praise") {
					if (getT2UP.totalNum > 0) {
						//启用翻页
						t.opts.pager.parent().show();
						module.userList({
							customerId: t.opts.uid, //本人id
							type: chooseNav,//类型
							container: t.opts.listArea,//存放列表的容器
							pageTotal: getT2UP.totalNum,//总页数
							pageSize: t.config.CARD_PAGE_SIZE,//每页的数量
							pagination: t.opts.pager//分页容器
						});
					} else {
						//禁用翻页
						t.opts.pager.parent().hide();
						t.opts.listArea.html("<div class=\"no_dongtai font_yahei\">你还没有被赞过哦～</div>");
					}
				} else { //非赞场景
					//输出列表
					t.getListData(getT2UP);
				}
				
				//阻止父级事件触发
				e.preventDefault();
				e.stopPropagation();
				
			});
		},
		initCtrlCenter: function (kv) { //初始化页面元素值
			var t = this;
			var cue = kv.customer_unite;
			var cah = kv.customer_auth;
			var csc = kv.customer_statistic;
			var cbo = kv.customer_baseinfo;
			//判断头像
			var logoUrl = "//img10.allinmd.cn/default-user/user_img65.png";
			if (!$.isEmptyObject(kv.customer_att.logoUrl) && kv.customer_att.logoUrl !== "") logoUrl = kv.customer_att.logoUrl;

			//未认证
			if (cah.state !== 1 && cah.state !== 2) {
				var nickname = cah.lastName + cah.firstName;
				var companyMedicalTitle = t.opts.companyMedicalTitle.text(comm.strHandle.cutDoctorTitle(comm.cutLine(cah.medicalTitle, "_", ",")) + " " + cah.company);
				t.opts.nickname.html('未认证用户');
				t.opts.companyMedicalTitle.html('你还没有认证身份哦，<span style="color:#659BE1" class="cursor">立即认证</span>').on("click", function () {
					user.login({               // 认证后
						callback: function () {
							t.opts.nickname.html(nickname);
							t.opts.companyMedicalTitle.html(companyMedicalTitle);
						},
						scene: privilegeSceneConst.eSceneTypeAuth
					});
				});
			} else {
				t.opts.vip.html("<img src=\"//img00.allinmd.cn/personal/vip.png\" />");
				t.opts.nickname.html("<a href=\"/pages/personal/home.html?cid=" + t.opts.uid + "\">" + cah.lastName + cah.firstName + "</a>");
				t.opts.companyMedicalTitle.text(comm.strHandle.cutDoctorTitle(comm.cutLine(cah.medicalTitle, "_", ",")) + " " + cah.company);
			}

			t.opts.logoUrl.html("<a href=\"/pages/personal/home.html?cid=" + t.opts.uid + "\"><img src=\"" + logoUrl + "\"/></a>");
			t.opts.fansNum.text(csc.fansNum);
			// t.opts.followNum.text(csc.followpeopleNum);
            t.opts.followNum.text(csc.followOrgNum?csc.followOrgNum:csc.followpeopleNum);//关注数
			t.opts.trendsMeNum.text(csc.trendsNum);
			t.opts.trendsNum.text(csc.trendsNum + csc.followTrendsNum); //首页
			t.opts.collectionNum.text(csc.collectionNum); //收藏数量
			csc.othersUpNum>0?t.opts.praiseNum.text(csc.othersUpNum):t.opts.praiseNum.remove(); //赞数量
			csc.respondReviewNum>0?t.opts.reviewNum.text(csc.respondReviewNum):t.opts.reviewNum.remove(); // 回复数量
			csc.remindResourceNum + csc.remindReviewNum>0?t.opts.remindNum.text(csc.remindResourceNum + csc.remindReviewNum):t.opts.remindNum.remove();//提醒数
			csc.othersUpNum + csc.respondReviewNum + csc.remindResourceNum + csc.remindReviewNum>0
					?t.opts.totalMessagesNum.text(csc.othersUpNum + csc.respondReviewNum + csc.remindResourceNum + csc.remindReviewNum)
					:t.opts.totalMessagesNum.remove();//消息总数
			t.opts.discussNum.text(csc.followCaseNum + csc.followDocNum + csc.followVideoNum + csc.followtopicNum); //讨论数
			
			//找数字最大值
			var maxNum = 0;
			var index = 0;
			$.each(t.opts.navNum, function (i, em) {
				num = parseInt($(em).find("span").text());
				if (num > maxNum) {
					maxNum = num;
					index = i;
				}
			});
			
			//给右侧导航数字一栏赋值最大宽度
			$.each(t.opts.navNum, function (i, em) {
				$(em).css({width: t.opts.navNum.eq(index).width() + 1});
			});

			//判断是否加载pk活动的提示
			var activityId = "";
			var activityStatus = "";
			$.ajax({
				type: "post",
				url: t.path.getActivity,
				data: {paramJson: $.toJSON({pageIndex: 1, pageSize: 1})},
				dataType: "json",
				async: false,
				success: function (rep) {
					if (!$.isEmptyObject(rep.responseObject.responseData)) {
						if (rep.responseObject.responseData.list.length > 0) {
							activityId = rep.responseObject.responseData.list[0].activityId;
						}
					}
					;
				}
			});
			$.ajax({
				type: "post",
				url: t.path.getActivityStatus,
				data: {activityId: activityId},
				dataType: "json",
				async: false,
				success: function (rep) {
					if (rep.responseObject.responseData && rep.responseObject.responseData) {
						activityStatus = rep.responseObject.responseData.expireStatus.toString();//0:未知错误 1:未截止 -1:截止
					}
				},
				error: function () {
				}
			});

			var $personalContent = $(".personal_content");

			if (activityStatus != -1) {//活动未截止
				if ($.cookie("vPKclose") == 1) {//有cookie

				} else {
					$.ajax({
						type: "post",
						url: t.path.getRegisterStatus,
						data: {paramJson: $.toJSON({customerId: t.opts.uid, activityId: activityId})},
						dataType: "json",
						success: function (rep) {
							if (rep.responseObject.responseData && rep.responseObject.responseData.registerStatus == 2) {//已经报名没有上传作品,
								$(".videoPK_ts").show();

								module.videoCasePk({
									enrollBtn: $(".vPK_but"),
									container: $personalContent,
									top: 56,
									userImg: logoUrl,
									activityId: activityId,
									isEnroll: 1
								});
								$(".vPK_close").on("click", function () {
									$(this).parent().remove();
									$.cookie("vPKclose", 1, {expires: 1});//记录cookie 1天
								})
							}
						}
					});
				}
				if ($.cookie("vPKbanner") == 1) {//有cookie

				} else {
					$.ajax({
						type: "post",
						url: t.path.getRegisterStatus,
						data: {paramJson: $.toJSON({customerId: t.opts.uid, activityId: activityId})},
						dataType: "json",
						success: function (rep) {
							if (rep.responseObject.responseData && rep.responseObject.responseData.registerStatus == 1) {//没有报过名
								$(".personal_pk").show();
								$(".personal_pk_close").on("click", function () {
									$(this).parent().remove();
									$.cookie("vPKbanner", 1, {expires: 1});//记录cookie 1天
								})
							}
						}
					});
				}
			}


			//载入上传 
			//上传病例
			module.selectType({
				uploadBtn: $("#case_upload"),
				container: $personalContent,
				type: "case",
				top: 56,
				userImg: logoUrl,
				activityId: activityId,
				activityStatus: activityStatus,
				publishBack: function () {
					$("[data-events=trends]").click();
				}
			});
			/*module.caseUpload({
			 caseBtn: $("#case_upload"),
			 container: $personalContent,
			 top: 56,
			 userImg: logoUrl,
			 publishBack: function () {
			 $("[data-events=trends]").click();
			 }
			 });*/
			//上传话题
			module.topicUpload({
				topicBtn: $("#topic_upload"),
				container: $personalContent,
				top: 56,
				userImg: logoUrl,
				publishBack: function () {
					$("[data-events=trends]").click();
				}
			});
			//上传文档
			module.docUpload({
				docBtn: $("#doc_upload"),
				container: $personalContent,
				top: 56,
				userImg: logoUrl,
				publishBack: function () {
					$("[data-events=trends]").click();
				}
			});
			//上传视频
			module.selectType({
				uploadBtn: $("#video_upload"),
				container: $personalContent,
				type: "video",
				top: 56,
				userImg: logoUrl,
				activityId: activityId,
				activityStatus: activityStatus,
				publishBack: function () {
					//$("[data-events=trends]").click();
				}
			});
			
			
			
			//载入头像信息区域
			//t.opts.faceInfo.fadeIn();
			
			$(".Ev-clickFriendTrend").on("click", function(){ //好友动态
				if($(this).attr("class").indexOf("recoLeftHover") === -1){
					t.opts.forYouEle.hide();
					t.opts.friendTrendsEle.show();
					t.opts.pager.parent().show();
					t.toggleRecommendAndTrends(this,"trends");
					var temp = t.getTotalTitleUrlParams("nothing");	  //将初始化后需要的统计值及地址参数统一存入临时变量库中
					t.setNavLight(temp.opType);						  //将导航划亮 过滤类型 
					t.opts.listAreaTitle.text(temp.title);            //将标题替换为当前执行导航名
					t.getListData(temp);                              //输出列表
				}
			});
			
			$(".Ev-clickRecommend").on("click", function(){  //为你推荐
				if($(this).attr("class").indexOf("recoLeftHover") === -1){
					t.opts.friendTrendsEle.hide();
					t.opts.forYouEle.show();
					t.opts.pager.parent().hide();
					
					t.toggleRecommendAndTrends(this,"recommend");
					t.getRecommend();
				}	
			});
			
			window[0] = t.opts.forYouEle.clone(); //设置全局引用
			$(".Ev-clickRecommend").trigger("click");
		},
		toggleRecommendAndTrends: function(ele,type){ //切换为你推荐与动态
			$(ele).addClass("recoLeftHover").siblings().removeClass("recoLeftHover");
			$("img",ele).attr("src","//img00.allinmd.cn/personal/sanjiao.png");
			$(ele).siblings().find("img").attr("src","");
			
			if(type==="trends") this.opts.recommendForYouMore.hide();
				else this.opts.recommendForYouMore.show();
		},
		getRecommend: function(){ //为你推荐
			comm.LightBox.showloading();
			var _t = this;
			var newStruct= window[0];	//复制页面元素
			//处理推荐数据
			var params= {dataFlag:2, channelId:134,recommendNumber:10,logoUseFlag:3};
			$.ajax({url: _t.path.recommendForYou, type: "POST",data:params, originT:_t, constructEle: newStruct}).done(function(res){
				if(res !== null && res.responseObject.responseStatus){
					var _t= this.originT, constructEle= this.constructEle;
					var data= res.responseObject.responseData.data_list;
					var html="", li="",ADObj= {},ADArr= [];
					for(var i=0;i<data.length;i++){
						if(data[i].column_type in {2:"视频",5:"文库",7:"病例",8:"话题"}){ //资源 
							var newStruct= $(constructEle).clone();
							li="";
							for(var j=0,len=data[i].column_data.length;j<len;j++){
								li+= _t.getRecommendTemplate(_t.getRecommendDataConvert(data[i].column_type,data[i].column_data[j]),j);
							}
							$(newStruct).find(".ev-listAreaTitle").html(data[i].column_name); 	//小标题
							$(newStruct).find(".ev-listArea").html(li);							//数据列表
							
							if(data[i].column_type ==2 && data[i].column_data.length < 7){ //视频小于6条移除显示更多
								$(newStruct).find(".ev-listArea").attr("style","margin-bottom:20px").attr("data-admark","true");
								$(newStruct).find(".Ev-recommendForYouMore").remove();
							}else if(data[i].column_type !=2 && data[i].column_data.length < 5){ //文库/病例/话题小于4条移除显示更多
								$(newStruct).find(".ev-listArea").attr("style","margin-bottom:20px").attr("data-admark","true");
								$(newStruct).find(".Ev-recommendForYouMore").remove();
							}else{
								$(newStruct).find(".Ev-recommendForYouMore").show();
							}
							
							html+= $(newStruct).html();
						}else if(data[i].column_type in {13:"推广AD"}){ //AD
							var tempData= data[i].column_data;
							if(tempData.length > 0){
								for(var x=0;x<tempData.length;x++){
									ADObj.id= _t.getRecommendDataConvert(13,tempData[x]).id;
									ADObj[tempData[x].sortId]=_t.getRecommendADTemplate(_t.getRecommendDataConvert(13,tempData[x]));
									ADArr.push(ADObj);
								}
							}
						}
					}
					
					//展开收起
					_t.opts.forYouEle.html(html).find(".Ev-recommendForYouMore").on("click",function(){
						if($.trim($(this).text()) === "展开更多"){
							$(this).prev().children().show();
							$(this).prev().children().last().attr("style","padding-bottom:30px");
							//$(this).next().attr("style","margin-bottom:20px");
							$("a",this).removeClass("perListMore").addClass("perListClose").html("收起<span></span>");
						}else{
							$(this).prev().children("li:gt(5)").hide();
							$("a",this).removeClass("perListClose").addClass("perListMore").html("展开更多<span></span>");
						}
					});
					
					//处理AD广告
					_t.handleRecommendForYouAD(ADArr);
					
					comm.LightBox.hideloading();
				}else{
					comm.LightBox.hideloading();
					typeof console !="undefined" && console.log("接口返回异常，请检查");
				}
			});
			
		},
		handleRecommendForYouAD: function(ADArr){ //为你推荐广告功能 利用元素id COOKIE实现关闭一次,一天停用
			var _t= this;
			if(ADArr.length>0){
				var tempKey=[],getCookieAdKeyArr= $.cookie("recommendForYouAdIDs")===undefined?null:$.cookie("recommendForYouAdIDs").split(",");
				if(getCookieAdKeyArr){
					for(var i=0;i<ADArr.length;i++){
						tempKey= Object.keys(ADArr[i]);
						for(var j=0;j<getCookieAdKeyArr.length;j++){
							if(ADArr[i][tempKey[1]] != getCookieAdKeyArr[j]){
								$(_t.opts.forYouEle.find("[data-admark=true]")[tempKey[0]-1]).after(ADArr[i][tempKey[0]]);
							}
						}
					}
				}else{
					for(var i=0;i<ADArr.length;i++){
						tempKey= Object.keys(ADArr[i]);
						$(_t.opts.forYouEle.find("[data-admark=true]")[tempKey[0]-1]).after(ADArr[i][tempKey[0]]);
					}
				}
				
				$(".Ev-remmendADClose").on("click", function(){
					var tempCookie= $(this).attr("data-id");
					if($.cookie("recommendForYouAdIDs") !== undefined){
						tempCookie= $.cookie("recommendForYouAdIDs")+","+tempCookie;
					}
					$.cookie("recommendForYouAdIDs",tempCookie,{path:"/",expires:1}); //加上当前
					$(".Ev-remmendADArea").remove();
				});
			}
		},
		getRecommendDataConvert: function(columnType,data){
			var result= {};
			switch(columnType){
			case 13: //AD
				result= {
					id: data.id,
					href: data.linkUrl,
					pic: data.adAttUrl,
					desc: data.adAttName
				};
				break;
			case 2: //视频
				result= {
					type: "video",
					title: comm.getStrByteLen(data.name,48),
					pic: data.logoUrl,
					videoTime: data.playTime,
					author: comm.getStrByteLen(data.author,8),
					totalNum: data.browseNum,
					origin: comm.getStrByteLen(data.videoSource,16),
					time: comm.date.diffDay_one(data.publishTime,comm.date.local_time()),
					summary: comm.getStrByteLen(data.videoAbstract,150),
					href: data.pageStoragePath
				}; 
				break;
			case 5: //文库
				result= {
					type: "doc",
					title: comm.getStrByteLen(data.name,48),
					pic: data.logoUrl,
					author: comm.getStrByteLen(data.author,8),
					totalNum: data.browseNum,
					origin: comm.getStrByteLen(data.docSource,16),
					time: comm.date.diffDay_one(data.publishTime,comm.date.local_time()),
					summary: comm.getStrByteLen(data.docAbstract,150),
					href: data.pageStoragePath
				}; 
				break;
			case 7: //病例 无来源
				result= {
					type: "case",
					title: comm.getStrByteLen(data.name,48),
					pic: data.logoUrl,
					author: comm.getStrByteLen(data.author,8),
					totalNum: data.browseNum,
					time: comm.date.diffDay_one(data.publishTime,comm.date.local_time()),
					summary: comm.getStrByteLen(data.mainNarrate,150),
					href: data.pageStoragePath
				}; 
				break;
			case 8: //话题 无来源
				result= {
					type: "topic",
					title: comm.getStrByteLen(data.name,48),
					pic: data.logoUrl,
					author: comm.getStrByteLen(data.author,8),
					totalNum: data.browseNum,
					time: comm.date.diffDay_one(data.publishTime,comm.date.local_time()),
					summary: comm.getStrByteLen(data.topicDiscuss,150),
					href: data.pageStoragePath
				}; 
				break;
			default:
			}
			return result;
		},
		getRecommendADTemplate: function(kv){ //为你推荐 广告
              return '<div class="Ev-remmendADArea personal_active">'+
                  '<a href="'+kv.href+'" class="personal_activeImg"><img src="'+kv.pic+'"  alt="'+kv.desc+'"/></a>'+
                  '<a href="javascript:;" class="Ev-remmendADClose activeClose" data-id="'+kv.id+'"><img src="//img00.allinmd.cn/personal/close.png"/></a>'+
              '</div>'
		},
		getRecommendTemplate: function(kv,i){ //为你推荐 内部小模板
			function belongToVideoTemplate(time){return '<div class="perMainBg"></div><div class="perMainTime">'+time+'</div>';}
			function undefinedSource(origin){ return '<li class="pointer"></li><li>来源：'+origin+'</li>'; }
			
			return '<li class="'+( (kv.pic==='' || kv.isValid === 0)?'perMainLi01':'perMainLi')+'" '+this.differentiateVideoFromOtherTotality(kv.type,i)+'>'+
				( (kv.pic==='' || kv.isValid === 0) ? '':
            	'<div class="perMainLeft">'+
		            '<div class="perMainImg"><a href="'+kv.href+'" target="_blank"><img src="'+kv.pic+'"></a>'+
		            (kv.type==="video"?belongToVideoTemplate(kv.videoTime):'')+
		            '</div>'+
		        '</div>')+
		        '<div class="perMainRight">'+
		            '<div class="perMainTit"><a href="'+kv.href+'" target="_blank">'+kv.title+'</a></div>'+
		            '<div class="perMainMid">'+
		                '<ul>'+
		                    '<li>'+kv.author+'</li>'+
		                    ((kv.type!=="topic" && kv.type!== "case") ? undefinedSource(kv.origin) : '')+
		                    '<li class="pointer"></li>'+
		                    '<li>'+(kv.type==="video"?'播放：':'浏览：')+'<span class="playNum">'+kv.totalNum+'</span></li>'+
		                    '<li class="time">'+kv.time+'</li>'+
		                    '<div class="clear"></div>'+
		                '</ul>'+
		            '</div>'+
		            '<div class="perMainBot">'+kv.summary+'</div>'+
		        '</div>'+
		        '<div class="clear"></div>'+
		    '</li>';
		},
		differentiateVideoFromOtherTotality: function(type,i){ //区分视频与其它资源总数
			if( ((type === "video" || type === 2) && i>5) || ((type !== "video" && type !== 2 ) && i>3) )
				return 'style="display:none;"';
				else return '';
		},
		getTotalTitleUrlParams: function (chooseNav) { //根据类型返回对应的当前统计数，标题、地址与参数
			var t = this, url = "", parameter = {}, params = {};
			switch (chooseNav) {
				case "remind" :
					title = "提醒你看";
					total = t.opts.remindNum.text()==""?0:t.opts.remindNum.text();
					url = t.path.remind;
					parameter = {
						pageIndex: 1,
						pageSize: t.config.PAGE_SIZE,
						scene: 2,
						attUseFlag: AttUseFlag.c,
						logoUseFlag: UseFlag.c,
						dataFlag: 8,
						customerId: t.opts.uid,
						isRemind: 1,
						sessionCustomerId: t.opts.uid
					};
					params.paramJson = $.toJSON(parameter);
					break;
				case "reviewMe" :
					title = "回复你的";
					total = t.opts.reviewNum.text()==""?0:t.opts.reviewNum.text();
					url = t.path.review;
					parameter = {
						pageIndex: 1,
						pageSize: t.config.PAGE_SIZE,
						sortType: 7,
						attUseFlag: AttUseFlag.c,
						logoUseFlag: UseFlag.c,
						dataFlag: 1,
						refCustomerId: t.opts.uid,
						scene: Scene.b,
						reviewStatus: 1
					};
					params = parameter;
					break;
				case "collection" :
					title = "你的收藏";
					total = t.opts.collectionNum.text();
					url = t.path.collection;
					parameter = {
						pageIndex: 1,
						pageSize: t.config.PAGE_SIZE,
						scene: 2,
						attUseFlag: AttUseFlag.c,
						logoUseFlag: UseFlag.c,
						dataFlag: 8,
						customerId: t.opts.uid,
						isCollection: 1,
						sessionCustomerId: t.opts.uid
					};
					params.paramJson = $.toJSON(parameter);
					break;
				case "discuss" :
					title = "关注提醒";
					total = t.opts.discussNum.text();
					url = t.path.discuss;
					parameter = {
						dataFlag: 2,
						messageType: 1,
						logoUseFlag: UseFlag.c,
						pageIndex: 1,
						pageSize: t.config.PAGE_SIZE,
						sortType: 2
					}; //,isShowRef:1,isShowAtt:0,isRemind:1
					params.paramJson = $.toJSON(parameter);
					break;
				case "praise" :
					title = "收到的赞";
					total = t.opts.praiseNum.text()==""?0:t.opts.praiseNum.text();
					break;
				case "fans" :
					title = "你的粉丝";
					total = t.opts.fansNum.text();
					break;
				case "follow" :
					title = "你关注的人";
					total = t.opts.followNum.text();
					break;
				case "trendsMe" :
					title = "你的动态";
					total = t.opts.trendsMeNum.text();
					url = t.path.trendsMy;
					parameter = {
						pageIndex: 1,
						pageSize: t.config.PAGE_SIZE,
						attUseFlag: AttUseFlag.c,
						logoUseFlag: UseFlag.c,
						dataFlag: 5,
						customerId: t.opts.uid,
						sessionCustomerId: t.opts.uid
					};
					params.paramJson = $.toJSON(parameter);
					break;
				default :  //trends
					if (chooseNav !== "trends") chooseNav = "trends";
					title = "你关注的动态";
					total = t.opts.trendsNum.text();
					url = t.path.trends;
					parameter = {
						pageIndex: 1,
						pageSize: t.config.PAGE_SIZE,
						attUseFlag: AttUseFlag.c,
						logoUseFlag: UseFlag.c,
						dataFlag: 7,
						customerId: t.opts.uid,
						sessionCustomerId: t.opts.uid
					};
					params.paramJson = $.toJSON(parameter);
			}
			return {
				totalNum: total,
				total: Math.ceil(total / t.config.PAGE_SIZE),
				opType: chooseNav,
				title: title,
				url: url,
				params: params
			};
		},
		getListData: function (T2UP) { //利用模块获取数据
			var t = this;
			var obj = {
				listSelectorEl: t.opts.listArea,
				scrollPlace: t.opts.listAreaTitle,
				pagerEl: t.opts.pager,
				tempLib: T2UP, 	//total opType title url params
				isSelfUseTips: true
			};
			scene.personalNavExecuteList(obj);
		},
		setNavLight: function (opType) {
			$("[data-events=" + opType + "]", this.naviEl).addClass("hover").attr("data-trigger", "on");
		},
		initPageAjax: function () {
			var t = this;
			var onSuccess = function (data) {
				if (!data || !data.responseObject.responseStatus) {
                    g_sps.jump(null,"/pages/not_found.html");
					return false;
				}
				t.initCtrlCenter(data.responseObject.responseData.data_list[0]);
			}

			var $promise = $.ajax({
				url: t.path.initCore,
				type: "POST",
				data: {paramJson: $.toJSON({customerId: t.opts.uid})},
				dataType: "json"
			});
			$promise.done(onSuccess);

		}
	}
	controller.init(obj);
};


