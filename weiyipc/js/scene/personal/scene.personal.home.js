/**
 * 功能描述：个人主页
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by QiaoLiang on 2015-3-30.
 */

$(function(){
	
	//如果是手机端访问过来，转入手机端
	if(!comm.equipment.IsPC()){
		var cid = location.href.substr(location.href.indexOf("?cid=")+5);
        g_sps.jump(null,"//m.allinmd.cn/allin/personal/app/#/index?cid="+cid);
	}
	
	
	//获取cid 与 uid
	var cid = parseInt($.getUrlParam("cid"));
	var sesCustomerId = $("#sesCustomerId").val();
    var uid = parseInt(sesCustomerId);
	//var auth = parseInt($("#sesAuth").val());
	if(isNaN(cid) && sesCustomerId.length>0) cid = uid;
	
	//是否本人
	var isSelf = false;
	if(cid===uid) isSelf=true;
	
	//获取动作
	var action = $.getUrlParam("action");
	
	var obj = {
		action : action, //当前触发动作
		naviEl : $(".ev-personalNav"), //侧导航
		naviSunEl : $(".ev-personalSunNav"), //侧子导航
		naviTitleEl : $(".ev-navTitle"),//侧导航标题
		listAreaEl : $(".ev-listArea"), //列表区域
		listAreaTitleEl : $(".ev-listTitle"), //列表标题
		pagerEl : $(".pager"),//翻页元素
		cid : cid,
		uid : uid,
		isSelf : isSelf, //是否本人
		logoUrl : $(".ev-logoUrl"), //头像
		faceInfo : $(".ev-faceInfo"), //头像信息等区域
		praiseEvent : $(".ev-praise"), //赞事件
		vip : $(".ev-vip"), //认证vip标志
		nickname : $(".ev-nickname"), //名称
		companyMedicalTitle : $(".ev-companyMedicalTitle"), //公司及职称
		upNum : $(".ev-upNum"), //赞数
		fansNum : $(".ev-fansNum"), //粉丝数
		followNum : $(".ev-followNum"),  //关注数
		trendsNum : $(".ev-trendNum"), //动态数
		intro : $(".ev-intro"), //简介
		tags : $(".ev-tags"),  //擅长领域
		caseNum : $(".ev-caseNum"), //病例数量
		topicNum : $(".ev-topicNum"), //话题数量
		videoNum : $(".ev-videoNum"), //视频数量
		docNum : $(".ev-docNum"), //文库数量
		reviewNum : $(".ev-reviewNum"), // 回复数量
		collectionNum : $(".ev-collectionNum"), //收藏数量
		reprintNum : $(".ev-reprintNum"),//转发数量
		relationNum : $(".ev-relationNum"), //与他相关
		navNum:$(".p_nav_num")//数字列表
	};
	
	//初始化
	initPersonalHome(obj);

	//上传头像
	if(isSelf){
		$(".ev-logoUrl").selectCutUserPic({
	        callback: function () {
	            var obj = comm.getLogoUrlList(4,2,uid);
	            var url = obj[0].logoUrl;
	            $(".ev-logoUrl img, #logo_src").attr("src",url);
	        }
	    });
	}
		
	//当uid存在时才会出现 可能认识的人
	if(uid.toString().length>0){
		$(".module-familar").show();
		module.familiar({
			container : ".module-familiar-warp",
			toggleData : ".toggleData",
			uid : uid
		});
	}
	
	//所有查看大图功能
	$(document).on("click", ".viewBigImg", function (e) {
		var container = $(this);
		var index = 0;
		if($(e.target).parents("li").eq(0).index()>0){
			index = $(e.target).parents("li").eq(0).index();
		}
		module.viewBigImgAll({event: e, container: container,index:index});
	});

	//编辑文章
	module.docUpload({
        editBtn:$(".ev-docEdit"),//$("#doc_upload"),
        container:$(".personal_content"),
        top:0,
		left:143.5,
        userImg:0
	 });
	
	//编辑病例
    module.caseUpload({
    		editBtn:$(".ev-caseEdit"),//$("#case_upload"),
        container:$(".personal_content"),
        top:0,
		left:143.5,
        userImg:0
    });

});

function initPersonalHome(obj){
	var controller = {
		path : {
			initCore : PC_CALL+"customer/unite/json_info/", //个人信息
			trends : PC_CALL+"customer/trends/json_list/", //动态
			caze : PC_CALL+"case_baseinfo/json_list/", //病例
			topic : PC_CALL+"topic/baseinfo/json_list/",//话题
			video : PC_CALL+"customer/video/json_list/",//视频
			doc : PC_CALL+"customer/doc/json_list/",//文章
			review : PC_CALL+"review/json_list/",//回复
			collection : PC_CALL+"customer/trends/json_list/",//收藏
			reprint : PC_CALL+"customer/trends/json_list/",//转发
			relation : PC_CALL+"search/list_other/"  //与他相关 
		},
		opts : {
			action : "",
			cid : 0,
			uid : 0,
			isSelf : false,
			logoUrl : "",
			vip : "",
			nickname : "",
			companyMedicalTitle : "",
			upNum : 0,
			fansNum : 0,
			followNum : 0,
			trendsNum : 0,
			intro : "",
			tags : "",
			caseNum : 0, //病例数量
			topicNum : 0, //话题数量
			videoNum : 0, //视频数量
			docNum : 0, //文库数量
			reviewNum : 0, // 回复数量
			collectionNum : 0, //收藏数量
			reprintNum : 0,//转发数量
			relationNum : 0, //与他相关
			naviEl : null,
			naviSunEl : null,
			listAreaEl : null,
			listAreaTitleEl : null,
			pagerEl : null,
			faceInfo : null,
			praiseEvent : null
		},
		config : {
			PAGE_SIZE : 20,
			CARD_PAGE_SIZE : 12
		},
		init : function(obj){
			var t = this;
			$.extend(t.opts,obj);
			
			//页面初始化基础数据 及执行列表
			t.initPageAjax();
			
			//副导航事件
			t.opts.naviSunEl.find("li").off("click").on("click",function(){

				var chooseNav = $(this).attr("data-events");
				
				//将初始化后需要的统计值及地址参数统一存入临时变量库中
				var temp = t.getTotalTitleUrlParams(chooseNav);
					
				//将标题替换为当前执行导航名
				t.opts.listAreaTitleEl.text(temp.title);
				
				
				if(chooseNav === "follow" || chooseNav === "fans"){
					if(temp.totalNum>0){
						//启用翻页
						t.opts.pagerEl.parent().show();
						module.userList({
				               customerId:t.opts.cid, //本人id
				               type:chooseNav,//类型
				               container: t.opts.listAreaEl,//存放列表的容器
				               pageTotal:temp.totalNum,//总页数
				               pageSize:t.config.CARD_PAGE_SIZE,//每页的数量
				               pagination:t.opts.pagerEl//分页容器
			             });
					}else{
						//禁用翻页
						t.opts.pagerEl.parent().hide();
						
						var tips = "被关注";
						if(chooseNav==="fans") tips = "粉丝";
						t.opts.listAreaEl.html("<div class=\"no_dongtai font_yahei\">还没有"+tips+"哦～</div>");
					}
				}else{
					//输出列表
					t.getListData(temp);
				}	
			});
			
			//主导航事件
			t.opts.naviEl.find("li").on("mouseover",function(){
				if($(this).attr("data-trigger") !== "on"){
					$(this).addClass("hover");
				}
			}).on("mouseout",function(){
				if($(this).attr("data-trigger") !== "on"){
					$(this).removeClass("hover");
				}	
			}).on("click",function(){
				$(this).attr("data-trigger","on").siblings("li").attr("data-trigger","off").removeClass("hover");
				var chooseNav = $(this).attr("data-events");
				var getT2UP = t.getTotalTitleUrlParams(chooseNav);
				
				//将标题替换为当前执行导航名
				t.opts.listAreaTitleEl.text(getT2UP.title);
				
				//输出列表
				t.getListData(getT2UP);
			});
		},
		initCtrlCenter : function(kv){ //初始化页面元素值
			var t = this;
			var cue = kv.customer_unite;
			var cah = kv.customer_auth;
			var csc = kv.customer_statistic;
			var catt = kv.customer_att;
			var cbo = kv.customer_baseinfo;
			
			//如果非本人看未认证过用户直接跳到无访问权限
			if(!t.opts.isSelf) t.getIsAuth(cah.state);
			
			//判断头像
			var logoUrl = "<img src=\"//img10.allinmd.cn/default-user/user_img65.png\">";
			if(catt.logoUrl !== "") logoUrl = catt.logoUrl;
			
			//未认证
			if(cah.state!==1 && cah.state!==2 ){
				var nickname = cah.lastName+cah.firstName;
				if(nickname ==="") nickname = cue.email.substr(0,2)+"****@***"+cue.email.substring(cue.email.length-3);
				t.opts.nickname.html(nickname);
				t.opts.companyMedicalTitle.text(comm.strHandle.cutDoctorTitle(comm.cutLine(cah.medicalTitle,"_",","))+" "+cah.company);
			}else{
				t.opts.vip.html("<img src=\"//img00.allinmd.cn/personal/vip.png\" />");
				t.opts.nickname.text(cah.lastName+cah.firstName);
				t.opts.companyMedicalTitle.text(comm.strHandle.cutDoctorTitle(comm.cutLine(cah.medicalTitle,"_",","))+" "+cah.company);
			}
			//处理关注事件
			t.events.follow(cah.state,kv.customer_follow_people.relationship);
			
			//更改标题与关键字
			$("title").text(cah.lastName+cah.firstName+"医生的学术专栏 - 唯医,allinmd");
			$("[name=Keywords]").attr("content",cah.lastName+cah.firstName+","+(cbo.areasExpertise==""?"":cbo.areasExpertise+",")+"资料,百科,个人主页,学术专栏,病例讨论,唯医,allinmd");
			
			//处理赞事件
			t.events.praise(kv.customer_prefer.isValid);
			
			//4-5位数字变化处理
			// if(csc.followpeopleNum.length>4){
			// 	$(".gz_num").addClass("gz_num_20");
			// }
            if(csc.followOrgNum&&csc.followOrgNum.length>4||csc.followpeopleNum.length>4){
            	$(".gz_num").addClass("gz_num_20");
            }
            // if(csc.followpeopleNum.length>5){
            //     $(".gz_num").addClass("gz_num_18");
            // }
            if(csc.followOrgNum&&csc.followOrgNum.length>5||csc.followpeopleNum.length>5){
                $(".gz_num").addClass("gz_num_18");
            }
			t.opts.logoUrl.html("<img src=\""+logoUrl+"\"/>");
			t.opts.upNum.text(csc.othersUpNum);
			t.opts.fansNum.text(csc.fansNum);
			// t.opts.followNum.text(csc.followpeopleNum);
            t.opts.followNum.text(csc.followOrgNum?csc.followOrgNum:csc.followpeopleNum);
			t.opts.trendsNum.text(csc.trendsNum);
			
			//载入头像信息区域
			//t.opts.faceInfo.fadeIn();
			
			//简介
			var summary = "你还没有填写个人简介哦~";
			if(cbo.summary.length>0) summary = "<span>简介：</span>"+comm.getStrLen(cbo.summary,200);	
			t.opts.intro.html(summary);
			
			//标签
			var tags = "你的专业领域是什么？";
			if(cbo.areasExpertise.length>0) tags = "<span>擅长领域：</span>"+comm.cutLine(cbo.areasExpertise,"_","、");
			t.opts.tags.html(tags);
			
			//变更与他还是与我相关的侧导航标题文字
			$("[data-events=relation]").find(".ev-navTitle").text("与他相关");
			if(t.opts.isSelf) $("[data-events=relation]").find(".ev-navTitle").text("与我相关");
				
			t.opts.caseNum.text(csc.caseNum);
			t.opts.topicNum.text(csc.topicNum); //话题数量
			t.opts.videoNum.text(csc.videoNum); //视频数量
			t.opts.docNum.text(csc.docNum); //文库数量
			t.opts.reviewNum.text(csc.reviewNum); // 回复数量
			t.opts.collectionNum.text(csc.collectionNum); //收藏数量
			t.opts.reprintNum.text(csc.reprintNum); //转发数量
			t.opts.relationNum.text(csc.firstAuthorNum+csc.uniteAuthorNum+csc.firstTranslatorNum+csc.uniteTranslatorNum); //与他相关
			//找数字最大值
			var maxNum= 0;
			var index=0;
			$.each(t.opts.navNum,function(i,em){
				num=parseInt($(em).find("span").text());
				if(num>maxNum){
					maxNum=num;
					index=i;
				}
			});
			//给右侧导航数字一栏赋值最大宽度
			$.each(t.opts.navNum,function(i,em){
				$(em).css({width:t.opts.navNum.eq(index).width()+1});
			});
			//SEO
			//$("title").text(t.opts.nickname.text()+"医生的学术专栏 - 唯医,allinmd"); IE下有问题
			
			//将初始化后需要的统计值及地址参数统一存入临时变量库中
			var temp = t.getTotalTitleUrlParams(t.opts.action);
			
			//将导航划亮
			t.setNavLight(temp.opType);//过滤类型 
			
			//将标题替换为当前执行导航名
			t.opts.listAreaTitleEl.text(temp.title);

			if(t.opts.action=="follow" || t.opts.action=="fans"){ //捕捉地址栏为副导航列表时触发
				t.opts.naviSunEl.find("[data-events="+t.opts.action+"]").click();
			}else{
				t.getListData(temp);
			}
		},
		getTotalTitleUrlParams : function(chooseNav){ //根据类型返回对应的当前统计数，标题、地址与参数
				var t=this,url = "",parameter={},params={};
				
				//全局
				var dataFlag = 2;
				if(!t.opts.isSelf) dataFlag = 3;
				//本人动态 5 －－不载入粉丝关注人的信息
				//本人动态 7 －－载入粉丝及关注人的信息
				//非以上两种场景并含有isXXXX-Review等 为 8
				
				switch(chooseNav){
					case "follow" : 
						title = "关注的人";
						total = t.opts.followNum.text();
						break;
					case "fans" : 
						title = "粉丝";
						total = t.opts.fansNum.text();
						break;
					case "praise" : 
						title = "赞过的人";
						total = t.opts.upNum.text();
						break;
					case "caze" :
						title = "发布的病例";
						total = t.opts.caseNum.text();
						url = t.path.caze;
						
						if(t.opts.isSelf){
							parameter = {pageIndex:1,pageSize:t.config.PAGE_SIZE,sortType:12,attUseFlag:2,dataFlag:dataFlag,logoUseFlag:UseFlag.c,customerId:t.opts.cid,isValid:1};
						}else{
							parameter = {pageIndex:1,pageSize:t.config.PAGE_SIZE,sortType:2,attUseFlag:2,dataFlag:dataFlag,logoUseFlag:UseFlag.c,customerId:t.opts.cid,isValid:1};
						}
						
						params.paramJson = $.toJSON(parameter);
						break;
					case "topic" : 
						title = "发布的话题";
						total = t.opts.topicNum.text();
						url = t.path.topic;
						
						if(t.opts.isSelf){
							parameter = {pageIndex:1,pageSize:t.config.PAGE_SIZE,sortType:12,attUseFlag:2,dataFlag:dataFlag,logoUseFlag:UseFlag.c,customerId:t.opts.cid,isValid:1};	
						}else{
							parameter = {pageIndex:1,pageSize:t.config.PAGE_SIZE,sortType:2,attUseFlag:2,dataFlag:dataFlag,logoUseFlag:UseFlag.c,customerId:t.opts.cid,isValid:1};
						}
						
						params = parameter;
						break;
					case "video" : 
						title = "发布的视频";
						total = t.opts.videoNum.text();
						url= t.path.video; 
						
						if(t.opts.isSelf){
							parameter = {pageIndex:1,pageSize:t.config.PAGE_SIZE,sortType:12,useFlag:2,dataFlag:dataFlag,logoUseFlag:UseFlag.c,customerId:t.opts.cid,isValid:1};	
						}else{
							parameter = {pageIndex:1,pageSize:t.config.PAGE_SIZE,sortType:2,useFlag:2,dataFlag:dataFlag,logoUseFlag:UseFlag.c,customerId:t.opts.cid,isValid:1};
						}
						
						params.paramJson = $.toJSON(parameter);
						break;
					case "doc" :
						title = "发布的文章";
						total = t.opts.docNum.text();
						url = t.path.doc; 
						
						if(t.opts.isSelf){
							parameter = {pageIndex:1,pageSize:t.config.PAGE_SIZE,sortType:12,useFlag:2,dataFlag:dataFlag,logoUseFlag:UseFlag.c,customerId:t.opts.cid,isValid:1};	
						}else{
							parameter = {pageIndex:1,pageSize:t.config.PAGE_SIZE,sortType:2,useFlag:2,dataFlag:dataFlag,logoUseFlag:UseFlag.c,customerId:t.opts.cid,isValid:1};
						}
						
						params.paramJson = $.toJSON(parameter);
						break;
					case "review" :
						title = "回复的内容";
						total = t.opts.reviewNum.text();
						url=t.path.review; 
						parameter = {pageIndex:1,pageSize:t.config.PAGE_SIZE,sortType:7,attUseFlag:AttUseFlag.c,logoUseFlag:UseFlag.c,customerId:t.opts.cid,scene:Scene.b,reviewStatus :1,isValid:1};
						params = parameter;
						break;
					case "collection" :
						title = "收藏的内容";
						total = t.opts.collectionNum.text();
						url=t.path.collection; 
						parameter = {pageIndex:1,pageSize:t.config.PAGE_SIZE,scene:2,attUseFlag:AttUseFlag.c,logoUseFlag:UseFlag.c,dataFlag:8,customerId:t.opts.cid,isCollection:1,sessionCustomerId:t.opts.uid,isValid:1};
						params.paramJson = $.toJSON(parameter);
						break;
					case "reprint" :
						title = "转发的内容";
						total = t.opts.reprintNum.text();
						url = t.path.reprint; 
						parameter = {pageIndex:1,pageSize:t.config.PAGE_SIZE,scene:2,attUseFlag:AttUseFlag.c,logoUseFlag:UseFlag.c,dataFlag:8,customerId:t.opts.cid,isReprint:1,sessionCustomerId:t.opts.uid,isValid:1};
						params.paramJson = $.toJSON(parameter);
						break;
					case "relation" :
						title = "与他相关";
						if(t.opts.isSelf) title = "与我相关";
						total = t.opts.relationNum.text();
						url = t.path.relation; 
						parameter = {pageIndex:1,pageSize:t.config.PAGE_SIZE,customerId:t.opts.cid,sortType:7};
						params = parameter;
						break;
					default :  //trends
						if(chooseNav!=="trends") chooseNav="trends";
						title = "全部动态";
						total = t.opts.trendsNum.text();
						url = t.path.trends;
						parameter = {pageIndex:1,pageSize:t.config.PAGE_SIZE,attUseFlag:AttUseFlag.c,logoUseFlag:UseFlag.c,dataFlag:5,customerId:t.opts.cid,sessionCustomerId:t.opts.uid};
						params.paramJson = $.toJSON(parameter);
				}
				
				return {totalNum:total,total:Math.ceil(total/t.config.PAGE_SIZE),opType:chooseNav,title:title,url:url,params:params};
		},
		getListData : function(T2UP){ //利用模块获取数据
			var t = this;
			var obj = {
				listSelectorEl : t.opts.listAreaEl,
				scrollPlace : t.opts.listAreaTitleEl,
				pagerEl : t.opts.pagerEl,
				isSelfUseTips : t.opts.isSelf,
				tempLib : T2UP 	//total opType title url params
			};
			
			scene.personalNavExecuteList(obj);
		},
		getIsAuth : function(key){ //检测被观看人是否认证过，非本人观看未认证用户直接跳到无访问权限
			if(key!==1 && key!==2){
                g_sps.jump(null,"/pages/without_permission.html");
				return false;
			}
		},
		setNavLight : function(opType){
			$("[data-events="+opType+"]",this.naviEl).addClass("hover").attr("data-trigger","on");
		},
		events : {
			follow : function(auth,relationship){ //判断顶部是否显示他的主页或是添加关注 立即认证 显示编辑资料还是查看更多
				var t = controller;
				//具体元素对照home.html元素
				if(t.opts.isSelf){ //本人时
					//显示编辑资料
					$(".ev-editOrView-info").html("<a href=\"/pages/personal/customerInfo.html\">编辑资料</a>");
					
					if(auth!==1 && auth!==2){	 //非认证
						$(".ev-homeFollowBtn").html("<div class=\"p_b_but_my_home-only ev-auth\"><img src=\"//img00.allinmd.cn/personal/ljrz_but.png\"/></div><div class=\"p_b_but_my_home ev-iOrHePic\"><a href=\"/pages/personal/home.html?cid="+t.opts.cid+"\"><img src=\"//img00.allinmd.cn/personal/my_home.png\"/></a></div>");
						
						//绑定认证事件
						$(".ev-auth").on("click",function(){
						    user.login({
				                callback:function(){
				                		$(".ev-homeFollowBtn").html("<div class=\"p_b_but_my_home-only ev-iOrHePic\"><a href=\"/pages/personal/home.html?cid="+t.opts.cid+"\"><img src=\"//img00.allinmd.cn/personal/my_home.png\"/></a></div>");
				                },
				                scene:privilegeSceneConst.eSceneTypeAuth,
				                t : t
				            });
						});
						
					}else{ //认证后
						$(".ev-homeFollowBtn").html("<div class=\"p_b_but_my_home-only ev-iOrHePic\"><a href=\"/pages/personal/home.html?cid="+t.opts.cid+"\"><img src=\"//img00.allinmd.cn/personal/my_home.png\"/></a></div>");
						
					}
				}else{
					$(".ev-editOrView-info").html("<a href=\"/pages/personal/baseInfo.html?cid="+t.opts.cid+"\">查看更多</a>");
					$(".ev-homeFollowBtn").html("<div class=\"p_b_but_gz ev-followStatus\"></div><div class=\"p_b_but_my_home ev-iOrHePic\"><a href=\"/pages/personal/home.html?cid="+t.opts.cid+"\"><img src=\"//img00.allinmd.cn/personal/he_home.png\"/></a></div>");
					
					//引入关注
					$(".ev-followStatus").follow({
						fId : t.opts.cid,
						fStatus : relationship,
						picStyle : 2
					});
				}
			},
			praise : function(praiseValid){ //FACEINFO处赞事件
				var t = controller;
				//给赞加事件
				if(t.opts.isSelf){ //本人时
					t.opts.praiseEvent.on("click",function(){ //跳到赞列表
						//将初始化后需要的统计值及地址参数统一存入临时变量库中
						var temp = t.getTotalTitleUrlParams("praise");
							
						//将标题替换为当前执行导航名
						t.opts.listAreaTitleEl.text(temp.title);
						
						if(temp.totalNum>0){
							t.opts.pagerEl.parent().show();
							module.userList({
					               customerId:t.opts.cid, //本人id
					               type:"praise",//类型
					               container: t.opts.listAreaEl,//存放列表的容器
					               pageTotal:temp.totalNum,//总页数
					               pageSize:t.config.CARD_PAGE_SIZE,//每页的数量
					               pagination:t.opts.pagerEl,//分页容器
				             });
						}else{
							t.opts.pagerEl.parent().hide();
							t.opts.listAreaEl.html("<div class=\"no_dongtai font_yahei\">还没有被赞过哦～</div>");
						}
					});
				}else{
					t.opts.praiseEvent.on("click",function(){ //赞事件
						user.login({
		                    callback: function () {
								//判断是否赞过，未赞过 则赞
								if(!praiseValid){ //未赞过发送赞请求并＋1
									if(t.opts.upNum.attr("data-trigger") != "true"){ //刚刚未赞过
										t.opts.upNum.attr("data-trigger","true");
										var praiseNum = parseInt(t.opts.upNum.text());
										t.opts.upNum.text(praiseNum+1);
										var url = PC_CALL+"prefer/create/";
										var params = {};
										params.paramJson = $.toJSON({
											"dataFlag":2,
											"attUseFlag":3,
											"refId":t.opts.cid,
											"refCustomerId":t.opts.uid,
											"usefulType":9,
											"upDownType":1
										});
										t.ajaxSend(url,params);
									}else{//赞过
										$(".ev-alreadyPraise").show();	
									}
								}else{ //赞过提示
									$(".ev-alreadyPraise").show();
								}
		                    },
		                    scene: privilegeSceneConst.eSceneTypePraiseResourse // 赞
		                });
					}).on("mouseleave",function(){
						$(".ev-alreadyPraise").hide();
					});
				}
			}
		},
		ajaxSend : function(url,params){
			$.ajax({
				url : url,
				type : "POST",
				data : params
			})
		},
		initPageAjax : function(){
			var t = this;
			$.ajax({
				url : t.path.initCore,
				type : "POST",
				data : {paramJson:$.toJSON({customerId:t.opts.cid})},
				dataType : "json",
				success : function(data){
					if(!data || !data.responseObject.responseStatus){
                        g_sps.jump(null,"/pages/not_found.html");
						return false;
					}
					
					t.initCtrlCenter(data.responseObject.responseData.data_list[0]);
					//分享
					module.personalShare({title:obj.nickname.text()+"个人主页——唯医网",content:obj.companyMedicalTitle.text(),selector:"#personal_share"});
				}
			})
		}
	};
	controller.init(obj);
};

