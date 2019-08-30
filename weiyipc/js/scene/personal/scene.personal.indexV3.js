/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/8.
 */
$.getScript(window.paasFilePathObj.js,function() {
	$(function () {
		var unit;
		var baseInfo;
		var auth;
		var csc;
		var att;
		var para = comm.getpara();
		var obj = {
			//action : action, //当前触发动作
			naviEl: $(".ev-personalNav"), //侧导航
			listAreaEl: $(".ev-listArea"), //列表区域
			listAreaTitleEl: $(".ev-listTitle"), //列表标题
			pagerEl: $(".pager"),//翻页元素
			cid: $("#sesCustomerId").val(),
			//uid : uid,
			userName: $(".ev-name"),//用户名
			companyMedicalTitle: $(".ev-companyMedicalTitle"),//职称//医院
			logoUrl: $(".ev-logoUrl"), //头像
			upNum: $(".ev-upNum"), //赞数
			fansNum: $(".ev-fansNum"), //粉丝数
			followNum: $(".ev-followNum"),  //关注数
			trendsNum: $(".ev-trendNum"), //动态数
			followAllNum: $(".ev-followAllNum"),//我关注的数量
			collectionNum: $(".ev-collectionNum"), //收藏数量
			reviewNum: $(".ev-reviewNum"), // 回复数量
			browseNum: $(".ev-browseNum"),//浏览数量
			draftNum: $(".ev-draftNum")//草稿数量
		};
		var _scrTop = $('.al-personalNavbar').offset().top;//424
		var container = {

			path: {
				initCore: PC_CALL + "customer/unite/getMapById/", //个人信息
				browseNum: PC_CALL + "log/customer/browse/getCount/",//浏览数(20180606 本js未发现调用)
				browse: PC_CALL + "log/customer/browse/json_list/",//浏览记录
				draft: PC_CALL + "customer/draft/getCustomerDraftList/",//草稿列表
				caseUpdate: PC_CALL + "case_baseinfo/update/",//删除病例草稿
				trends: PC_CALL + "customer/trends/json_list/", //动态
				caze: PC_CALL + "case_baseinfo/json_list/", //病例(20180608 本js未发现调用)
				topic: PC_CALL + "topic/baseinfo/json_list/",//话题(20180608 本js未发现调用)
				video: PC_CALL + "customer/video/json_list/",//视频(20180608 本js未发现调用)
				doc: PC_CALL + "customer/doc/json_list/",//文章(20180608 本js未发现调用)
				review: PC_CALL + "review/json_list/",//回复
				collection: PC_CALL + "customer/trends/json_list/",//收藏
				reprint: PC_CALL + "customer/trends/json_list/",//转发(20180608 本js未发现调用)
				relation: PC_CALL + "search/list_other/"  //与他相关(20180608 本js未发现调用)
			},
			init: function () {
				var t = this;
				if (obj.cid) {//已登录
					this.leftBtnClick();
					this.initPageAjax();
					//获取资料完整度
					customerInforate();

					//获取首页数据
					t.getIndex();
					module.validateEmail(1);
				}
				$('body').on('click', '.ev-videoAfter-content', function () {
					var srcHref = $(this).attr('srcHref');
					if (srcHref) {
						g_sps(null,srcHref,true);
					}
				});
			},
			//左侧导航点击
			leftBtnClick: function () {
				var t = this;
				$(".ev-leftSide figure").attr("on", "true");
				$(".ev-leftSide figure").on("click", function () {
					if ($(this).attr("on") == "true") {
						$(".ev-leftSide figure").attr("on", "true");
						$(this).attr("on", "false");
						$(".al-personalInnerBasePage").hide();
						var tabRole = $(this).data("role");
						$(this).addClass('active').siblings().removeClass('active');
						$(".al-personalInnerSidebarChange").removeClass('active');
						$('.al-personalInnerSidebarChange[data-role=' + tabRole + ']').addClass('active');
						switch (tabRole) {
							case "browsed":
								comm.creatEvent({
									triggerType: "浏览记录点击",
									keyword: "浏览记录",
									actionId: 39
								});
								$("[name=description]").attr('content', '浏览记录－唯医,allinmd');
								//comm.Log.createBrowse({href:location.href,id:98,name:'浏览记录页'});
								t.getBrowse();
								break;
							case "draft":
								$("[name=description]").attr('content', '我的草稿－唯医,allinmd');
								//comm.Log.createBrowse({href:location.href,id:88,name:'草稿页'});
								t.getdraft();
								break;
							case "comment":
								$("[name=description]").attr('content', '我的评论－唯医,allinmd');
								//comm.Log.createBrowse({href:location.href,id:99,name:'我的评论页'});
								t.getReview();
								break;
							case "collect":
								$("[name=description]").attr('content', '收藏－收藏的资源汇总,唯医,allinmd');
								//comm.Log.createBrowse({href:location.href,id:95,name:'我的收藏页'});
								TempCache.setItem('readCollectionTime', comm.date.local_time());    //cookie记录上次查看收藏的时间
								t.getCollectionInitTotalAndTabNav();
								t.getCollection();
								break;
							case "follow":
								$("[name=description]").attr('content', '我关注的－唯医,allinmd');
								//comm.Log.createBrowse({href:location.href,id:97,name:'关注资源页'});
								t.getFollowInitTotalAndTabNav();
								t.getFollow();
								break;
							default:
								break;
						}
					}

				});
			},
			initPageAjax: function () {
				var t = this;
				//获取基本信息
				var data = responseData;
				var dataList = data.responseObject.responseData.data_list[0];
				unit = dataList.customer_unite;
				baseInfo = dataList.customer_baseinfo;
				auth = dataList.customer_auth;
				csc = dataList.customer_statistic;
				att = dataList.customer_att;

				//  如果是厂商角色的话，跳转到首页、暂时不能够访问个人中心 2019-04-11
				if(unit.customerRole==14 || unit.customerRole==15){
					window.location = "/";	// 如果是厂商角色的话，跳转到首页、暂时不能够访问个人中心
				}

				if (auth.state !== 2 && auth.state !== 7 && auth.state !== 8 && auth.state !== 9) {//未认证
					if(auth.state!==1){//V1审核
                        $(".ev-authOrNo").html();
                        $("#ev-goAuth").show();
                        $("#ev-goAuth").on("click", function () {
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
                        })
					}
				} else {
					$(".ev-authOrNo").html('认证用户<i class="al-vipBigUser"></i>');
				}

				obj.collectionNum.attr("num", csc.collectionNum).text(csc.collectionNum);
				followAllNum = parseInt(csc.followCaseNum,10) + parseInt(csc.followtopicNum,10) + parseInt(csc.followTagNum,10);
				obj.followAllNum.attr("num", followAllNum).text(followAllNum);

				obj.reviewNum.attr("num", csc.reviewNum).text(csc.reviewNum);

				//obj.draftNum.attr("num", list.draftCount).text(list.draftCount);

				$.ajax({
					type: "post",
					url: t.path.browse,
					data: t.browseParam(1, 20),
					dataType: "json",
					success: function (rep) {
						if (rep && rep.responseObject.responseData) {
							browseCount = rep.responseObject.responseData.total_count;
							if (!browseCount) {
								browseCount = 0;
							}
							obj.browseNum.attr("num", browseCount).text(browseCount.toW());
							if (!para.action) {//导航不带参数
								//if (obj.draftNum.attr("num")) {
									//默认草稿
									t.getdraftDefault();
								//}
								if (obj.browseNum.attr("num")) {
									//默认浏览记录
									t.getBrowseDefault(rep);
								}
							}
						}
					},
					error: function () {
					}
				});

				if (para.action) {
					$(".ev-leftSide figure[data-role=" + para.action + "]").click();
				}

				$(".al-more").on("click", function () {
					var tabRole = $(this).data("role");
					$(".ev-leftSide figure[data-role=" + tabRole + "]").click();
				})
			},
			getIndex: function () {
				var _this = this;
				comm.LightBox.showloading();
				//我的收藏
				var $myCollect = $(".ev-mycollecIndex"), $myCollectMore = $(".ev-mycollectIndexMore");
				var indexCollectUrl = PC_CALL + "collection/json_list/";
				var indexCollectParams = {
					//collectionType: ,//	类型1视频2文库4话题7病例8评论
					//sessionCustomerId: $("#sesCustomerId").val();
					attUseFlag: 2,
					logoUseFlag: 3,
					customerId: obj.cid,
					pageIndex: 1,
					pageSize: 4
				}
				$.ajax({
					type: "post",
					url: indexCollectUrl,
					data: indexCollectParams,
					dataType: "json",
					success: function (rep) {
						var collectData = _this.isExistData(rep);
						var seriesData = [];
						if (collectData) {
							var html = '', HTML = [], reviewNum = 0;
							var _html2 = [], commentIndex = [];
							for (var i = 0; i < collectData.length; i++) {
								var dataList = collectData[i];
								if (dataList.customer_collection.collectionType == 8) {
									collectCommentIndex = i;
									commentIndex.push(i);
									reviewNum++;
								} else {
									var data = {};
									switch (dataList.customer_collection.collectionType) {
										case 1:
											data = {
												publishTime: dataList.cms_video.publishTime,
												refId: dataList.cms_video.videoId,
												refName: symbolToString(dataList.cms_video.videoName),
												refContent: symbolToString(dataList.cms_video.videoAbstract).replace(/&lt;br\/&gt;/g, '<br/>'),
												author:comm.getStrLen((dataList.cms_video.ownerNameStr), 20),
												browseNum: dataList.cms_video.playNum.toWK(),
												pic: dataList.cms_video_attachment.videoAttUrl,
												playTime: dataList.cms_video.playTime,
												refUrl: dataList.cms_video.pageStoragePath,
												refCustomerId: dataList.cms_video.refCustomerId,
												resourceIsValid: parseInt(dataList.resource_valid.resourceValid),
												score: dataList.cms_video.currentStarLevel,
												videoType:dataList.cms_video.videoType,
												scoreNum: dataList.cms_video.currentScoreNum
											};
											break;
										case 2:
											data = {
												publishTime: dataList.cms_doc.publishTime,
												refId: dataList.cms_doc.docId,
												refName: symbolToString(dataList.cms_doc.docName),
												refContent: symbolToString(dataList.cms_doc.docAbstract),
												author: comm.getStrLen((dataList.publish_customer.lastName + dataList.publish_customer.firstName), 20),
												browseNum: dataList.cms_doc.browseNum.toWK(),
												pic: dataList.cms_doc_attachment.docAttUrl,
												refUrl: dataList.cms_doc.pageStoragePath,
												refCustomerId: dataList.cms_doc.refCustomerId,
												resourceIsValid: parseInt(dataList.resource_valid.resourceValid),
												score: dataList.cms_doc.currentStarLevel,
												videoType:dataList.cms_doc.videoType,
												scoreNum: dataList.cms_doc.currentScoreNum
											}
											break;
										case 4:
											data = {
												publishTime: dataList.cms_topic.publishTime,
												refId: dataList.cms_topic.topicId,
												refName: symbolToString(dataList.cms_topic.topicName),
												refContent: symbolToString(dataList.cms_topic.topicDiscuss),
												author: dataList.publish_customer.lastName + dataList.publish_customer.firstName,
												browseNum: dataList.cms_topic.browseNum.toWK(),
												pic: dataList.cms_topic_attachment.topicAttUrl,
												refUrl: dataList.cms_topic.pageStoragePath,
												refCustomerId: dataList.cms_topic.customerId,
												videoType:dataList.cms_topic.videoType,
												resourceIsValid: parseInt(dataList.resource_valid.resourceValid)
											};
											break;
										case 7:
											data = {
												publishTime: dataList.case_baseinfo.publishTime,
												refId: dataList.case_baseinfo.caseId,
												refName: symbolToString(dataList.case_baseinfo.caseName),
												refContent: symbolToString(dataList.customer_collection.refContent),
												author: dataList.publish_customer.lastName + dataList.publish_customer.firstName,
												browseNum: dataList.case_baseinfo.browseNum.toWK(),
												pic: dataList.case_attachment.attUrl,
												refUrl: dataList.case_baseinfo.pageStoragePath,
												refCustomerId: dataList.case_baseinfo.refCustomerId,
												resourceIsValid: parseInt(dataList.resource_valid.resourceValid),
												score: dataList.case_baseinfo.currentStarLevel,
												videoType:dataList.case_baseinfo.videoType,
												scoreNum: dataList.case_baseinfo.currentScoreNum
											};
											break;
										case 8:
											//回复调用
											//	        		data= {
											//	        			refId: dataList.case_baseinfo.caseId,
											//	        			refName: dataList.case_baseinfo.caseName,
											//	        			refContent: dataList.customer_collection.refContent,
											//	        			author: dataList.publish_customer.lastName+dataList.publish_customer.firstName,
											//	        			browseNum: dataList.case_baseinfo.browseNum,
											//	        			pic: dataList.case_attachment.attUrl,
											//	        			refUrl: dataList.case_baseinfo.pageStoragePath
											//	        		}

											break;
										case 17:
											data = {
												publishTime: dataList.cms_book.publishTime,
												refId: dataList.cms_book.docId,
												refName: symbolToString(dataList.cms_book.docName),
												refContent: symbolToString(dataList.customer_collection.refContent),
												author: dataList.publish_customer.lastName + dataList.publish_customer.firstName,
												browseNum: dataList.cms_book.browseNum.toWK(),
												pic: dataList.cms_book_attachment.docAttUrl,
												refUrl: "/pages/eBook/eBook_details.html?bId=" + dataList.cms_book.docId,
												refCustomerId: dataList.cms_book.refCustomerId,
												videoType:dataList.cms_book.videoType,
												resourceIsValid: parseInt(dataList.resource_valid.resourceValid)
											};
											break;
										case 18:
											seriesData.push(dataList.customer_collection);
											break;
										default:
									}
									if (dataList.customer_collection.collectionType != 18) {
										if (dataList.customer_collection.collectionType == 8) {
											var collectCommentIndex = i;
										}
										var isNew, tempTime = comm.date.diffDay_one(data.publishTime, comm.date.local_time());
										if (!tempTime) {
											tempTime = "";
										}
										if (tempTime == "刚刚" || tempTime.indexOf("分钟前") > -1 || tempTime.indexOf("小时前") > -1) {
											isNew = 1;
										} else if (tempTime.indexOf("天前") > -1 && parseInt(tempTime) < 4) {
											isNew = 1;
										} else {
											isNew = 0;
										}

										html = module.resourceListTemplate({tempName: "resource"})({
											isNew: isNew,//传0或1 最新标识
											isHost: 0,//传0或1 最热标识
											resourceIsValid: data.resourceIsValid, //当前资源状态
											//cancelText:'取消收藏',//是否需要取消类的按钮
											resType: dataList.customer_collection.collectionType,//资源类型传数字  1-视频，2-文库，3-会议，4-话题 ,7-病例,
											resId: data.refId,//资源id
											resName: symbolToString(data.refName),//标题
											resContent: symbolToString(data.refContent),//内容
											userName: data.author,//作者
											reviewNum: data.browseNum.toWK(),//观看数
											resPic: data.pic,//缩略图
											videoType:data.videoType,
											playNum: data.playTime,//视频的时长   有值才传
											resUrl: data.refUrl,//资源链接
											score: data.score,
											scoreNum: data.scoreNum
										});
										html = $(html);
										HTML.push(html);
										_html2[i] = html;
									} else {
										if (seriesData.length) {
											$.each(seriesData, function (i, v) {
												if (parseInt(v.isValid) == 1) {
													var borNum = (v.totalLearnNum).toWK();
													html = '<section class="al-tableBox">' +
													'<div class="al-tableBoxInnerWrap">' +
													'	<article class="al-contentText">' +
													'<a target="_blank" href="/pages/discover/series/discover_series_details.html?tId=' + v.refId + '" class="al-contentTitle" style="margin-bottom:80px;">' + v.refName + '</a>' +
													'	<p class="al-contentOtherMsg">' +
													'		<span><i class="al-contentWatchedNum"></i>' + borNum + '</span>' +
													'		<span class="al-contentAuthorBox">' + v.catalogNum + '节课</span>' +
													'	</p>' +
													'	</article>' +
													'	<figure class="al-contentImgBox">' +
													'	<a target="_blank" href="/pages/discover/series/discover_series_details.html?tId=' + v.refId + '">' +
													'		<img src="' + v.coverPicUrl + '" alt="">' +
													'	</a>' +
													'	</figure>' +
													'</div></section>'
												}
											});
											html = $(html);
											HTML.push(html);
											_html2[i] = html;
										}
									}
								}


							}

							//处理回复类
							if (reviewNum > 0) {
								module.reviewPage({
									$context: $myCollect,
									scene: "collectReview",
									pageSize: reviewNum,
									special: true,
									callback: function () {
										for (j = 0; j < reviewNum; j++) {
											_html2[commentIndex[j]] = $('.Ev-mesListBox').eq(j);
											// $myCollect.find('.Ev-mesListBox').remove();
										}
										$myCollect.append(_html2);
									}
								});
							} else {
								$myCollect.append(HTML);
							}

							//移除首页推荐中的社交删除  4条
							$myCollect.find(".ev-delete").remove();

							if (collectData.length === 4) {
								$myCollectMore.show();
								$myCollectMore.on("click", function () {
									$(".ev-leftSide figure").eq(0).click();
								});
							}
						} else {
							$myCollect.parent().hide();
						}

						/*if (auth.state === 1 || auth.state === 2 || auth.state === 7 || auth.state === 9) {
							$(".al-vipBigUser").css({"background": "url('/images/img10/authentication/V1.png') no-repeat 50% 50%"});
							$(".al-vipUser").css({"background": "url('/images/img10/authentication/V1.png') no-repeat 50% 50%"});
						}
						if (auth.state === 8) {
							$(".al-vipBigUser").css({"background": "url('/images/img10/authentication/V2.png') no-repeat 50% 50%"});
							$(".al-vipUser").css({"background": "url('/images/img10/authentication/V2.png') no-repeat 50% 50%"});
						}*/
					},
					error: function () {
					}
				});
				//var collectData= _this.isExistData(Fns.ajax.sync(indexCollectUrl,indexCollectParams));

				//我关注的病例
				var type = 7;
				var $myFollow = $(".ev-myFollowIndex"), $myFollowMore = $(".ev-myFollowIndexMore");
				var url = PC_CALL + 'customer/follow_resource/getMapList/'
				var params = {
					paramJson: $.toJSON({
						customerId: obj.cid,
						followType: type,
						pageIndex: 1,
						pageSize: 4,
						logoUseFlag: 3,
						attUseFlag: 2,
						visitSiteId: 1
					})
				};
				$.ajax({
					type: "post",
					url: url,
					data: params,
					dataType: "json",
					success: function (rep) {
						var data = _this.isExistData(rep);
						if (data) {
							ctrlCenter(7, data);
							if (data.length === 4) {
								$myFollowMore.show();
								$myFollowMore.on('click', function () {
									$(".ev-leftSide figure").eq(1).click();
									$(window).scrollTop(_scrTop);
								});
							}
						} else {
							$myFollow.parent().hide();
						}
						;
					},
					error: function () {
					}
				});
				//var data= _this.isExistData(Fns.ajax.sync(url, params));

				function ctrlCenter(type, dataList) {
					var tempHtml = null;
					HTML = [];
					for (var i = 0; i < dataList.length; i++) {
						if ($.trim(dataList[i].resource) != "") {
							html = module.resourceListTemplate({tempName: "resource"})({
								isNew: 0,//传0或1 最新标识
								isHost: 0,//传0或1 最热标识
								resourceIsValid: dataList[i].resource.isValid, //当前资源状态
								//cancelText:'取消关注',//是否需要取消类的按钮
								resType: type,//资源类型传数字  1-视频，2-文库，3-会议，4-话题 ,7-病例,
								resId: dataList[i].resource.refCustomerId,//资源id
								resName: symbolToString(dataList[i].resource.resourceName),//标题
								resContent: symbolToString(dataList[i].resource["abstract"]),//内容
								userName:symbolToString(dataList[i].customer_auth.lastName + dataList[i].customer_auth.firstName),//作者
								reviewNum: dataList[i].resource.browseNum.toWK(),//观看数
								resPic: dataList[i].resource_att.attUrl,//缩略图
								resUrl: dataList[i].resource.pageStoragePath,//资源链接
								score: dataList[i].currentStarLevel,
								videoType:dataList[i].videoType,
								scoreNum: dataList[i].currentScoreNum
							});

							html = $(html);
							/*html.find('.ev-wrapSocial').VNS_SocialFollow({
							 $UI_Obj: {},
							 Action_Type: 'resource',
							 Oper_Boo_Mouse: {
							 state: true,
							 ele: html
							 },
							 AJAX_Obj_Params: {
							 create: {
							 followType: 7,
							 refName: dataList[i].resource.resourceName,
							 refId:dataList[i].resource.refCustomerId,
							 },
							 cancel: {
							 followType: 7,
							 refId:dataList[i].resource.refCustomerId,
							 }
							 },
							 AJAX_Obj_Callback: {
							 cancel: {
							 success: function(){
							 window.location.href= "personal_index.html";
							 }
							 }
							 },
							 Param_Num_State: 2
							 });*/
							HTML.push(html);
						}
					}
					$myFollow.html(HTML);
					$myFollow.find(".ev-resourceList:last .al-contentText").css("borderBottom", "none");
					$myFollow.find(".ev-resourceList:last .al-tableBoxInnerWrap").css("borderBottom", "none");
					$myFollow.find(".ev-resourceList:last").css("borderBottom", "1px solid #ecf0f2");
				}

				//我关注的话题
				var type = 4;
				var $myFollowTopic = $(".ev-myFollowTopic"), $myFollowTopicMore = $(".ev-myFollowTopicMore");
				var url = PC_CALL + 'customer/follow_resource/getMapList/';
				var params = {
					paramJson: $.toJSON({
						customerId: obj.cid,
						followType: type,
						pageIndex: 1,
						pageSize: 4,
						logoUseFlag: 3,
						attUseFlag: 2,
						visitSiteId: 1
					})
				}
				$.ajax({
					type: "post",
					url: url,
					data: params,
					dataType: "json",
					success: function (rep) {
						var data = _this.isExistData(rep);
						if (data) {
							topicCtrlCenter(4, data);
							if (data.length === 4) {
								$myFollowTopicMore.show();
								$myFollowTopicMore.on('click', function () {
									$(".ev-leftSide figure").eq(1).click();
									$('.al-contentTabsItem[data-role=tabTopic]').click();
									$(window).scrollTop(_scrTop);
								});
							}

						} else {
							$myFollowTopic.parent().hide();
						}
						;
					},
					error: function () {
					}
				});
				//var data= _this.isExistData(Fns.ajax.sync(url, params));

				function topicCtrlCenter(type, dataList) {
					var tempHtml = null;
					HTML = [];
					for (var i = 0; i < dataList.length; i++) {
						if ($.trim(dataList[i].resource) != "") {
							html = module.resourceListTemplate({tempName: "resource"})({
								isNew: 0,//传0或1 最新标识
								isHost: 0,//传0或1 最热标识
								resourceIsValid: dataList[i].resource.isValid, //当前资源状态
								//cancelText:'取消关注',//是否需要取消类的按钮
								topicMask: 1,//话题图标
								resType: type,//资源类型传数字  1-视频，2-文库，3-会议，4-话题 ,7-病例,
								resId: dataList[i].resource.refCustomerId,//资源id
								resName: symbolToString(dataList[i].resource.resourceName),//标题
								resContent: symbolToString(dataList[i].resource["abstract"]),//内容
								userName: symbolToString(dataList[i].customer_auth.lastName + dataList[i].customer_auth.firstName),//作者
								reviewNum: dataList[i].resource.browseNum.toWK(),//观看数
								resPic: dataList[i].resource_att.topicAttUrl,//缩略图
								videoType:dataList[i].videoType,
								resUrl: dataList[i].resource.pageStoragePath//资源链接
							});

							html = $(html);
							/*html.find('.ev-wrapSocial').VNS_SocialFollow({
							 $UI_Obj: {},
							 Action_Type: 'resource',
							 Oper_Boo_Mouse: {
							 state: true,
							 ele: html
							 },
							 AJAX_Obj_Params: {
							 create: {
							 followType: 4,
							 refName: dataList[i].resource.resourceName,
							 refId:dataList[i].resource.refCustomerId,
							 },
							 cancel: {
							 followType: 4,
							 refId:dataList[i].resource.refCustomerId,
							 }
							 },
							 AJAX_Obj_Callback: {
							 cancel: {
							 success: function(){
							 window.location.href= "personal_index.html";
							 }
							 }
							 },
							 Param_Num_State: 2
							 });*/
							HTML.push(html);
						}
					}
					$myFollowTopic.html(HTML);
					$myFollowTopic.find(".ev-resourceList:last .al-contentText").css("borderBottom", "none");
					$myFollowTopic.find(".ev-resourceList:last .al-tableBoxInnerWrap").css("borderBottom", "none");
					$myFollowTopic.find(".ev-resourceList:last").css("borderBottom", "1px solid #ecf0f2");
				}

				//我关注的标签
				var type = 61;
				var $myFollowTag = $(".ev-myFollowTag"), $myFollowTagMore = $(".ev-myFollowTagMore");
				var url = PC_CALL + 'customer/follow_resource/getMapList/'
				var params = {
					paramJson: $.toJSON({
						customerId: obj.cid,
						followType: type,
						pageIndex: 1,
						pageSize: 4,
						logoUseFlag: 3,
						attUseFlag: 2,
						visitSiteId: 1
					})
				}
				$.ajax({
					type: "post",
					url: url,
					data: params,
					dataType: "json",
					success: function (rep) {
						var data = _this.isExistData(rep);
						if (data) {
							tagCtrlCenter(61, data);
							if (data.length === 4) {
								$myFollowTagMore.show();
								$myFollowTagMore.on('click', function () {
									$(".ev-leftSide figure").eq(1).click();
									$('.al-contentTabsItem[data-role=tabTag]').click();
									$(window).scrollTop(_scrTop);
								});
							}
						} else {
							$myFollowTag.parent().hide();
						}
						;
					},
					error: function () {
					}
				});
				//var data= _this.isExistData(Fns.ajax.sync(url, params));

				function tagCtrlCenter(type, dataList) {
					var tempHtml = null;
					HTML = [];
					for (var i = 0; i < dataList.length; i++) {
						if ($.trim(dataList[i].resource) != "") {
							html = module.resourceListTemplate({tempName: "tagList"})({
								tagName: symbolToString(dataList[i].resource.propertyName),
								tagRefNum: dataList[i].resourceNum,
								videoType:dataList[i].videoType,
								tagId: dataList[i].resource.propertyId
							});

							html = $(html);
							/*html.find('.ev-wrapSocial').VNS_SocialFollow({
							 $UI_Obj: {},
							 Action_Type: 'resource',
							 Oper_Boo_Mouse: {
							 state: true,
							 ele: html
							 },
							 AJAX_Obj_Params: {
							 create: {
							 followType: 7,
							 refName: dataList[i].resource.resourceName,
							 refId:dataList[i].resource.refCustomerId,
							 },
							 cancel: {
							 followType: 7,
							 refId:dataList[i].resource.refCustomerId,
							 }
							 },
							 AJAX_Obj_Callback: {
							 cancel: {
							 success: function(){
							 window.location.href= "personal_index.html";
							 }
							 }
							 },
							 Param_Num_State: 2
							 });*/
							HTML.push(html);

						}
					}
					$myFollowTag.html(HTML);
					//注释取消关注功能
					$myFollowTag.find('.ev-wrapSocial').hide();
				}

				//我的评论
				var $myReview = $(".ev-myReviewIndex"), $myReviewMore = $(".ev-myReviewIndexMore");
				module.reviewPage({$context: $myReview, customerId: obj.cid, pageSize: 4, scene: "myReview"});
				$myReviewMore.show();
				$myReviewMore.on("click", function () {
					$(".ev-leftSide figure").eq(3).click();
					$(window).scrollTop(_scrTop);
				});

				comm.LightBox.hideloading();
			},
			//浏览记录参数
			browseParam: function (pageIndex, pageSize) {
				var data = {};
				data.browseTypes = "4,5,9,10";
				data.customerId = obj.cid;
				data.dataFlag = 3;
				data.groupType = 1;
				data.pageIndex = pageIndex;
				data.pageSize = pageSize;
				var param = {};
				param.paramJson = $.toJSON(data);
				return param;
			},
			//获取默认主页的浏览记录
			getBrowseDefault: function (rep) {
				var t = this;

				if (rep && rep.responseObject.responseData && rep.responseObject.responseData.data_list) {
					if (rep.responseObject.responseData.data_list.length > 0) {
						var list = rep.responseObject.responseData.data_list;
						var html = t.getBroweHtml(list, 4);
						$(".ev-browseDefaultBox").html(html);
						if (list.length > 4) {
							$(".ev-moreBrowse").show();
						}
					} else {
						$(".ev-browseDefaultBox").parent().hide();
					}
				} else {
					$(".ev-browseDefaultBox").parent().hide();
				}

			},
			//获取浏览记录
			getBrowse: function () {
				var pageSize = 20;
				var pagecount = Math.ceil(obj.browseNum.attr("num") / pageSize);
				var t = this;
				if (pagecount == 0) {
					$(".ev-browseContentBox").prev().hide();
					$(".ev-browseContentBox").html('<section class="al-contentItem al-NoContributionUser ev-noContent">' +
					'<article class="al-noFansTips ">' +
					'<p>暂无历史记录</p>' +
					'</article>' +
					'</section>');
					return;
				}
				comm.LightBox.showloading();
				$.ajax({
					type: "post",
					url: t.path.browse,
					data: t.browseParam(1, pageSize),
					dataType: "json",
					success: function (rep) {
						comm.LightBox.hideloading();
						if (rep && rep.responseObject.responseData && rep.responseObject.responseData.data_list) {
							pagecount = Math.ceil(rep.responseObject.responseData.total_count / pageSize);
							if (rep.responseObject.responseData.data_list.length > 0) {
								obj.pagerEl.show();
								var html = t.getBroweHtml(rep.responseObject.responseData.data_list);
								$(".ev-browseContentBox").html(html);
								obj.pagerEl.pager({
									pagenumber: 1,
									pagecount: pagecount,
									buttonClickCallback: PageClick
								});
							} else {
								$(".ev-browseContentBox").prev().hide();
								$(".ev-browseContentBox").html('<section class="al-contentItem al-NoContributionUser ev-noContent">' +
								'<article class="al-noFansTips ">' +
								'<p>暂无历史记录</p>' +
								'</article>' +
								'</section>');
							}

						} else {
							$(".ev-browseContentBox").prev().hide();
							$(".ev-browseContentBox").html('<section class="al-contentItem al-NoContributionUser ev-noContent">' +
							'<article class="al-noFansTips ">' +
							'<p>暂无历史记录</p>' +
							'</article>' +
							'</section>');
						}
					},
					error: function () {
					}
				});
				PageClick = function (pageclickednumber) {
					comm.LightBox.showloading();
					$.ajax({
						type: "post",
						url: t.path.browse,
						data: t.browseParam(pageclickednumber, pageSize),
						dataType: "json",
						success: function (rep) {
							comm.LightBox.hideloading();
							if (rep && rep.responseObject.responseData && rep.responseObject.responseData.data_list) {
								pagecount = Math.ceil(rep.responseObject.responseData.total_count / pageSize);
								if (rep.responseObject.responseData.data_list.length > 0) {
									var html = t.getBroweHtml(rep.responseObject.responseData.data_list);
									$(".ev-browseContentBox").html(html);
									obj.pagerEl.pager({
										pagenumber: pageclickednumber,
										pagecount: pagecount,
										buttonClickCallback: PageClick
									});
								} else {

								}
							} else {

							}
						},
						error: function () {
						}
					});
				};
			},
			getBroweHtml: function (data, n) {
				result = data;
				//计算今天日期     [{dayDescription : "今天",list: {数据}},]
				var currDate = comm.date.local_time().substr(0, 10);
				//组装数据
				var groupData = [
					{dayDescription: "今天", dataStatus: false, list: []},
					{dayDescription: "昨天", dataStatus: false, list: []},
					{dayDescription: "更早以前", dataStatus: false, list: []}
				];

				for (var i = 0; i < result.length; i++) {
					if (n && i >= n) {
						break;
					}
					var srcDate = result[i].openTime.substr(0, 10);
					if (currDate == srcDate) {//今天
						groupData[0].dataStatus = true;
						groupData[0].dayDescription = "今天";
						groupData[0].list.push(result[i]);
					} else if (Date.parse(currDate) - Date.parse(srcDate) == 86400000) { //昨天
						groupData[1].dataStatus = true;
						groupData[1].dayDescription = "昨天";
						groupData[1].list.push(result[i]);
					} else { //更早以前
						groupData[2].dataStatus = true;
						groupData[2].dayDescription = "更早以前";
						groupData[2].list.push(result[i]);
					}
				}
				;
				var html = "";
				$.each(groupData, function (i, val) {
					html2 = '';
					if (val.dataStatus) {
						$.each(val.list, function (j, o) {
							if (o.browseType) {
								switch (o.browseType) {
									case 4:
										browseType = '视频';
										break;
									case 5:
										browseType = '文库';
										break;
									case 9:
										browseType = '话题';
										break;
									case 10:
										browseType = '病例';
										break;
									default :
										break;
								}
								html2 += '<article class="al-contentBrowseItem">' +
								'<span>' + browseType + '</span><a href="' + o.browseUrl + '" target="_blank">' + comm.getStrLen(o.refName, 60) + '</a>' +
								'</article>'
							}

						})
					}
					if (html2) {
						html += '<section class="al-contentBrowse"><h2>' + val.dayDescription + '</h2>' + html2 + '</section>';
					}

				});
				return html;
			},

			//草稿参数
			draftParam: function (pageIndex, pageSize) {
				var data = {};
				data.attUseFlag = AttUseFlag.c;
				data.useFlag = UseFlag.c;
				data.sortType = 1;
				//data.refTypeList="1,2,4,7";
				data.pageIndex = pageIndex;
				data.pageSize = pageSize;

				var param = {};
				param.paramJson = $.toJSON(data);
				return param;
			},
			//获取默认主页的草稿
			getdraftDefault: function () {
				var t = this;
				$.ajax({
					type: "post",
					url: t.path.draft,
					data: t.draftParam(1, 5),
					dataType: "json",
					success: function (rep) {
						if (rep && rep.responseObject.responseData && rep.responseObject.responseData.data_list) {
							if (rep.responseObject.responseData.data_list.length > 0) {
								var list = rep.responseObject.responseData.data_list;
								var html = t.getDraftHtml(list, 4);
								$(".ev-draftDefaultBox").html(html);
								if (list.length > 4) {
									$(".ev-moreDraft").show();
								}
							} else {
								$(".ev-draftDefaultBox").parent().hide();
							}
						} else {
							$(".ev-draftDefaultBox").parent().hide();
						}
					},
					error: function () {
					}
				});
			},
			//点击我的草稿获取草稿列表
			getdraft: function () {
				var t = this;
				var pageSize = 20;
				var pagecount = Math.ceil(obj.draftNum.attr("num") / pageSize);
				comm.LightBox.showloading();
				obj.pagerEl.hide();
				$.ajax({
					type: "post",
					url: t.path.draft,
					data: t.draftParam(1, pageSize),
					dataType: "json",
					success: function (rep) {
						comm.LightBox.hideloading();
						if (rep && rep.responseObject.responseData && rep.responseObject.responseData.data_list) {
							if (rep.responseObject.responseData.data_list.length > 0) {
								obj.pagerEl.show();
								var html = t.getDraftHtml(rep.responseObject.responseData.data_list);
								$(".ev-draftContentBox").html(html);
								t.deleteDraft();
								obj.pagerEl.pager({
									pagenumber: 1,
									pagecount: pagecount,
									buttonClickCallback: PageClick
								});
							} else {
								$(".ev-draftContentBox").html('<section class="al-contentItem al-NoContributionUser ev-noContent">' +
								'<article class="al-noFansTips ">' +
								'<p>保存为草稿的内容都在草稿箱</p>' +
								'</article>' +
								'</section>');
							}

						} else {
							$(".ev-draftContentBox").html('<section class="al-contentItem al-NoContributionUser ev-noContent">' +
							'<article class="al-noFansTips ">' +
							'<p>保存为草稿的内容都在草稿箱</p>' +
							'</article>' +
							'</section>');
						}
					},
					error: function () {
					}
				});
				PageClick = function (pageclickednumber) {
					comm.LightBox.showloading();
					$.ajax({
						type: "post",
						url: t.path.draft,
						data: t.draftParam(pageclickednumber, pageSize),
						dataType: "json",
						success: function (rep) {
							comm.LightBox.hideloading();
							if (rep && rep.responseObject.responseData && rep.responseObject.responseData.data_list) {
								if (rep.responseObject.responseData.data_list.length > 0) {
									var html = t.getDraftHtml(rep.responseObject.responseData.data_list);
									$(".ev-draftContentBox").html(html);
									t.deleteDraft();
									obj.pagerEl.pager({
										pagenumber: pageclickednumber,
										pagecount: pagecount,
										buttonClickCallback: PageClick
									});
								} else {

								}
							} else {

							}
						},
						error: function () {
						}
					});
				};
			},
			//草稿列表的dom操作
			getDraftHtml: function (data, n) {
				var html = "";
				$.each(data, function (i, val) {
					if (n && i >= n) {
						return false;
					}
					title = "";
					url = "javascript:void(0);";
					draftId = "";
					deleteHtml = "";
					defaultClass = "";
					switch (val.refType) {
						case 7://病例
							if (symbolToString(val.case_baseinfo.caseName)) {
								title = symbolToString(comm.getStrLen(val.case_baseinfo.caseName, 70));
							} else if (symbolToString(val.case_baseinfo.mainNarrate)) {
								var sexId = val.case_baseinfo.sexId;
								var sex = "";
								var age = "";
								var massage = "";
								if (sexId == 1) {
									sex = "男";
								} else if (sexId == 2) {
									sex = "女";
								}
								if (val.case_baseinfo.age) {
									age = val.case_baseinfo.age + "岁 ";
								}
								if (sex || age) {
									massage = "患者信息:" + sex + age;
								}
								var content = massage + "主诉:" + symbolToString(val.case_baseinfo.mainNarrate);
								title = comm.getStrLen(content, 70);
							} else {
								title = "【影像】";
							}
							publishTime = val.last_update_time ? val.last_update_time : val.case_baseinfo.publishTime;
							time = publishTime.substring(0, 4) + '/' + publishTime.substring(5, 7) + '/' + publishTime.substring(8, 10) + '&nbsp;' + publishTime.substring(11, 16);
							if(val.case_baseinfo.activityId=="1513149467288"){// 线下：1509331335386  线上：1513149467288
                                url = "/pages/singlePage/upload-activityCase.html?caseId=" + val.case_baseinfo.caseId + "&isDraft=1";
							}else{
                                url = "/pages/singlePage/upload-case.html?caseId=" + val.case_baseinfo.caseId + "&isDraft=1";
							}

							draftId = val.case_baseinfo.caseId;
							deleteHtml = '<span class="al-contentDelete ev-deletDraft">删除</span>';
							break;
						case 4://话题
							title = val.cms_topic.topicName;
							publishTime = val.last_update_time ? val.last_update_time : val.cms_topic.publishTime;
							time = publishTime.substring(0, 4) + '/' + publishTime.substring(5, 7) + '/' + publishTime.substring(8, 10) + '&nbsp;' + publishTime.substring(11, 16);
							draftId = val.cms_topic.caseId;
							defaultClass = "al-contentInAlineDefault";
							break;
						case 8://评论
							if (symbolToString(val.customer_review.reviewContent)) {
								var content = val.customer_review.reviewContent.replace(/<a/g, "<p style='display:inline-block'").replace(/a>/g, "p>");
								title = symbolToString(comm.getStrLen(content, 70));
							} else {
								title = "【影像】";
							}
							publishTime = val.last_update_time ? val.last_update_time : val.customer_review.publishTime;
							time = publishTime.substring(0, 10);
							draftId = val.customer_review.id;
							defaultClass = "al-contentInAlineDefault";
							break;
					}
					html += '<section class="al-contentInALine ' + defaultClass + '" refType="' + val.refType + '" draftId="' + draftId + '"><article class="al-contentText">' +
					'<a href="' + url + '" class="al-contentTitle"><span>' + title + '</span></a>' +
					'<p class="al-contentOtherMsg">' +
					'<span class="al-draftWriteTime">' + time + '</span>' +
					(n ? '' : deleteHtml) +
					'</p>' +
					'</article></section>';
				});
				return html;
			},
			//删除草稿
			deleteDraft: function () {
				var t = this;
				$(".ev-deletDraft").on("click", function () {
					var _par = $(this).parents(".al-contentInALine");
					if (_par.attr("refType") == 7) {//病例允许删除草稿
						var data = {};
						data.caseId = _par.attr("draftId");
						data.deleteFlag = 1;
						$.makeSurePopup({
							title: "删除草稿",
							content: "确定删除该项吗？",
							url: t.path.caseUpdate,//ajax请求接口（可不传，不传就不发请求）
							param: data,//ajax请求参数(可不传)
							callback: function () {//点击确认后执行的方法（有发送请求时，是请求成功后执行的方法)
								t.getdraft();
								$.topTip({mark: "success", content: "草稿删除成功！"});
							},
							error: function () {//ajax请求失败后执行的方法(可不传)
								$.topTip({mark: "warn", content: "草稿删除失败！"});
							}
						});
					}
				})
			},
			getReview: function () {
				module.reviewPage({
					$context: $(".ev-listReview"),
					$pages: obj.pagerEl,
					rsCount: parseInt(obj.reviewNum.text()),
					scene: "myReview"
				});
			},
			getCollectionInitTotalAndTabNav: function () {
				var countUrl = PC_CALL + 'collection/getResourceNum/';
				var collectCount = Fns.ajax.sync(countUrl).responseObject.responseData.data_list;
				$('.collectVideoNum').text(collectCount.videoNum);
				$('.collectCaseNum').text(collectCount.caseNum);
				$('.collectDocNum').text(collectCount.docNum);
				$('.collectTopicNum').text(collectCount.topicNum);
				$(".collectSeriesNum").text(collectCount.courseNum);
				$('.collectDiscussNum').text(collectCount.reviewNum);
				$('.collectBookNum').text(collectCount.ebookNum);
				var _this = this;
				$(".ev-clickCollectionTab").find('[data-role]').off('click').on('click', function () {
					$(this).addClass('active').siblings().removeClass('active');
					switch ($(this).attr('data-role')) {
						case "tabVideo":
							_this.getCollection(1);
							break;
						case "tabCase":
							_this.getCollection(7);
							break;
						case "tabDoc":
							_this.getCollection(2);
							break;
						case "tabTopic":
							_this.getCollection(4);
							break;
						case "tabDiscuss":
							_this.getCollection(8);
							break;
						case "tabBook":
							_this.getCollection(17);
							break;
						case "tabSeries":
							_this.getCollection(18);
							break;
						default:
					}
				});

			},
			getCollection: function (type, pageIndex) {
				var _this = this;
				//收藏无数据时
				var totalCollectionNum = parseInt($('.collectVideoNum').text()) + parseInt($('.collectDocNum').text()) + parseInt($('.collectTopicNum').text()) + parseInt($('.collectCaseNum').text()) + parseInt($('.collectDiscussNum').text() + parseInt($('.collectBookNum').text())) + parseInt($(".collectSeriesNum").text());
				if (totalCollectionNum == 0) {
					$(".ev-clickCollectionTab").hide();
					$('.ev-collectList').html(module.list2Template.nullData('您还没有收藏'));
					return false;
				}

				//默认视频
				if (!type) {
					type = 1;
					$('[data-role=tabVideo]').addClass('active').siblings().removeClass('active');
				}

				var rsCount = 0, typeDesc = '';
				switch (type) {
					case 1:
						rsCount = $('.collectVideoNum').text();
						typeDesc = '视频';
						break;
					case 2:
						rsCount = $('.collectDocNum').text();
						typeDesc = '文库';
						break;
					case 4:
						rsCount = $('.collectTopicNum').text();
						typeDesc = '话题';
						break;
					case 7:
						rsCount = $('.collectCaseNum').text();
						typeDesc = '病例';
						break;
					case 8:
						rsCount = $('.collectDiscussNum').text();
						typeDesc = '评论';
						break;
					case 18:
						rsCount = $('.collectSeriesNum').text();
						typeDesc = '系列课';
						break;
					case 17:
						rsCount = $('.collectBookNum').text();
						typeDesc = '书籍';
						break;
					default:
				}
				rsCount = Math.ceil(parseInt(rsCount) / 20);
				obj.pagerEl.pager({pagenumber: 1, pagecount: rsCount, buttonClickCallback: pageAjax});
				if (pageIndex != undefined) { //重设翻页数
					var a = $(".pages>.page-number");
					for (var x = 0; x < a.length; x++) {
						if ($($(".pages>.page-number")[x]).text() == pageIndex) {
							$($(".pages>.page-number")[x]).addClass("pgCurrent").siblings().removeClass("pgCurrent");
						}
					}
				}

				var url = PC_CALL + 'collection/json_list/';
				var params = {
					collectionType: type,//	类型1视频2文库4话题7病例8评论
					attUseFlag: 2,
					logoUseFlag: 3,
					sortType: 2,
					customerId: obj.cid,
					pageIndex: pageIndex == undefined ? 1 : pageIndex,
					pageSize: (type == 18) ? 15 : 20
				};

				if (rsCount > 0) {
					comm.LightBox.showloading();
					var data = Fns.ajax.sync(url, params);
					comm.LightBox.hideloading();
					if (data && data.responseObject.responseStatus && data.responseObject.responseData.data_list) {
						obj.pagerEl.show();

						if (type == 8) {
							module.reviewPage({
								$context: $('.ev-collectList'),
								$pages: obj.pagerEl,
								scene: "collectReview",
								rsCount: $(".collectDiscussNum").text()
							});
						} else if (type == 18) {
							$(".ev-collectList").html('<ul class="classesListUl au-series-container">' + ctrlCourse(data.responseObject.responseData.data_list) + '</ul>');
							var pageClick = function () {

							};
						} else {
							ctrlCenter(type, data.responseObject.responseData.data_list);
						}
					} else {
						obj.pagerEl.hide();
						$('.ev-collectList').html(module.list2Template.nullData('您还没有收藏' + typeDesc));
					}
				} else {
					obj.pagerEl.hide();
					$('.ev-collectList').html(module.list2Template.nullData('您还没有收藏' + typeDesc));
				}
				function ctrlCourse(data) {
					function dealData(indata) {
						var returnData = [];
						$.each(indata, function (i, v) {
							var dataJson = {};
							var timeLimit = (v.customer_collection.price > 0) ? "0" : "1";
							dataJson.collect = {};
							dataJson.collect.state = "1";
							dataJson.courseNum = v.customer_collection.catalogNum;
							dataJson.reviewNum = (v.customer_collection.totalLearnNum).toWKH();
							dataJson.title = v.customer_collection.refName;
							dataJson.id = v.customer_collection.refId;
							dataJson.timeLimit = timeLimit;
							dataJson.imgSrc = v.customer_collection.coverPicUrl;
							dataJson.linkUrl = "/pages/discover/series/discover_series_details.html?tId=" + v.customer_collection.refId;
							returnData.push(dataJson);
						});
						return returnData;
					}

					function demoStr(strdata) {
						var str = "";
						$.each(strdata, function (i, v) {
							str += '<li data-href="' + v.linkUrl + '" data-seriesId="' + v.id + '">' +
							'<a href="' + v.linkUrl + '">' +
							'<img src="' + v.imgSrc + '">' +
							'<aside class="title">' + v.title + '</aside>' +
							'<aside class="classNum"><i></i>' + v.reviewNum + '<span>' + v.courseNum + '节课</span></aside>' +
							'<aside class="function"><span class="timeLimit ' + v.timeLimitClass + '">限时免费</span><span class="collection ' + v.collectClass + '" data-collectId="' + v.collectId + '"><i></i>已收藏</span></aside>' +
							'</a>' +
							'</li>';
						});
						return str;
					}

					return demoStr(dealData(data));
				}

				function ctrlCenter(type, dataList) {
					var tempHtml = null;
					HTML = [];
					for (var i = 0; i < dataList.length; i++) {
						data = typeData(type, dataList[i]);
						var isNew, tempTime = comm.date.diffDay_one(data.publishTime, comm.date.local_time());
						if (tempTime && (tempTime == "刚刚" || tempTime.indexOf("分钟前") > -1 || tempTime.indexOf("小时前") > -1)) {
							isNew = 1;
						} else if (tempTime && tempTime.indexOf("天前") > -1 && parseInt(tempTime) < 4) {
							isNew = 1;
						} else {
							isNew = 0;
						}
						tempHtml = module.resourceListTemplate({tempName: "resource"})({
							isNew: isNew,//传0或1 最新标识
							isHost: 0,//传0或1 最热标识
							cancelText: '取消收藏',//是否需要取消类的按钮
							resourceIsValid: data.resourceIsValid, //当前资源状态
							resType: type,//资源类型传数字  1-视频，2-文库，3-会议，4-话题 ,7-病例,
							resId: data.refId,//资源id
							resName: symbolToString(data.refName),//标题
							resContent: symbolToString(data.refContent),//内容
							userName: data.author,//作者
							reviewNum: data.browseNum.toWK(),//观看数
							videoType:data.videoType,
							resPic: data.pic,//缩略图
							playNum: data.playTime,//视频的时长   有值才传
							resUrl: data.refUrl,//资源链接
							score: data.score,
							scoreNum: data.scoreNum
						});

						tempHtml = $(tempHtml);

						tempHtml.find('.ev-collection').VNS_SocialToggle({
							$UI_Obj: {},
							AJAX_Obj_Params: {
								create: {
									refId: data.refId,
									refCustomerId: data.refCustomerId,
									collectionType: type
								},
								cancel: {
									//refId:data.id,
									refId: data.refId,
									refCustomerId: data.refCustomerId,
									collectionType: type
								}
							},
							AJAX_Obj_Callback: {
								cancel: {
									success: function () {
										if ($(".ev-collectList").children().length > 1) {
											_this.getCollection(type, $(".pages>.pgCurrent").text());
										} else {
											_this.getCollection(type, $(".pages>.pgCurrent").text() - 1);
										}
										_num = parseInt($('.ev-clickCollectionTab .al-contentTabsItem.active .ev_c_name').html()) - 1;
										if (_num < 0) {
											_num = 0;
										}
										$('.ev-clickCollectionTab .al-contentTabsItem.active .ev_c_name').html(_num);
										_cNum = parseInt($('.ev-leftSide .ev_c_name').html()) - 1;
										if (_cNum < 0) {//==0
											_cNum = 0;
										}
										$('.ev-leftSide .ev_c_name').html(_cNum);
									}
								}
							},
							Action_State: 1,
							Action_Type: 'collection'
						});

						HTML.push(tempHtml);
					}
					$('.ev-collectList').html(HTML);
					$(".ev-collectList .ev-resourceList:last .al-contentText").css("borderBottom", "none");
					$(".ev-collectList .ev-resourceList:last .al-tableBoxInnerWrap").css("borderBottom", "none");
					$(".ev-collectList .ev-resourceList:last").css("borderBottom", "1px solid #ecf0f2");
				}

				function pageAjax(pageclickednumber) { //翻页 取当前单击的数值  测取消收藏翻页
					params.pageIndex = parseInt(pageclickednumber);
					$(window).scrollTop(0);
					var data = Fns.ajax.sync(url, params);
					if (params.collectionType == 18) {
						$(".ev-collectList").html('<ul class="classesListUl au-series-container">' + ctrlCourse(data.responseObject.responseData.data_list) + '</ul>');
					} else {
						ctrlCenter(params.collectionType, data.responseObject.responseData.data_list);
					}
					obj.pagerEl.pager({
						pagenumber: pageclickednumber,
						pagecount: rsCount,
						buttonClickCallback: pageAjax
					});
				}

				function typeData(type, dataList) {
					var data = {};
					switch (type) {
						case 1:
							data = {
								publishTime: dataList.cms_video.publishTime == "" ? dataList.cms_video.createTime : dataList.cms_video.publishTime,
								refId: dataList.cms_video.videoId,
								refName: symbolToString(dataList.cms_video.videoName),
								refContent: symbolToString(dataList.cms_video.videoAbstract),
								author: comm.getStrLen((dataList.cms_video.ownerNameStr), 30),
								// author: comm.getStrLen(('测试名字，测试名字，测试名字，测试名字'), 24),
								browseNum: dataList.cms_video.playNum.toWK(),
								pic: dataList.cms_video_attachment.videoAttUrl,
								playTime: dataList.cms_video.playTime,
								videoType:dataList.cms_video.videoType,
								refUrl: dataList.cms_video.pageStoragePath,
								refCustomerId: dataList.cms_video.refCustomerId,
								resourceIsValid: parseInt(dataList.resource_valid.resourceValid),
								score: dataList.cms_video.currentStarLevel,
								scoreNum: dataList.cms_video.currentScoreNum
							};
							break;
						case 2:
							data = {
								publishTime: dataList.cms_doc.publishTime == "" ? dataList.cms_doc.createTime : dataList.cms_doc.publishTime,
								refId: dataList.cms_doc.docId,
								refName: symbolToString(dataList.cms_doc.docName),
								refContent: symbolToString(dataList.cms_doc.docAbstract),
								author: comm.getStrLen(dataList.publish_customer.lastName+dataList.publish_customer.firstName, 20),
								browseNum: dataList.cms_doc.browseNum.toWK(),
								videoType:dataList.cms_doc.videoType,
								pic: dataList.cms_doc_attachment.docAttUrl,
								refUrl: dataList.cms_doc.pageStoragePath,
								refCustomerId: dataList.cms_doc.refCustomerId,
								resourceIsValid: parseInt(dataList.resource_valid.resourceValid),
								score: dataList.cms_doc.currentStarLevel,
								scoreNum: dataList.cms_doc.currentScoreNum
							}
							break;
						case 4:
							data = {
								publishTime: dataList.cms_topic.publishTime == "" ? dataList.cms_topic.createTime : dataList.cms_topic.publishTime,
								refId: dataList.cms_topic.topicId,
								refName: symbolToString(dataList.cms_topic.topicName),
								refContent: symbolToString(dataList.cms_topic.topicDiscuss),
								author: dataList.publish_customer.lastName + dataList.publish_customer.firstName,
								browseNum: dataList.cms_topic.browseNum.toWK(),
								pic: dataList.cms_topic_attachment.topicAttUrl,
								videoType:dataList.cms_topic.videoType,
								refUrl: dataList.cms_topic.pageStoragePath,
								refCustomerId: dataList.cms_topic.customerId,
								resourceIsValid: parseInt(dataList.resource_valid.resourceValid)
							}
							break;
						case 7:
							data = {
								publishTime: dataList.case_baseinfo.publishTime == "" ? dataList.case_baseinfo.createTime : dataList.case_baseinfo.publishTime,
								refId: dataList.case_baseinfo.caseId,
								refName: symbolToString(dataList.case_baseinfo.caseName),
								refContent: symbolToString(dataList.customer_collection.refContent),
								author: dataList.publish_customer.lastName + dataList.publish_customer.firstName,
								browseNum: dataList.case_baseinfo.browseNum.toWK(),
								pic: dataList.case_attachment.attUrl,
								videoType:dataList.case_baseinfo.videoType,
								refUrl: dataList.case_baseinfo.pageStoragePath,
								refCustomerId: dataList.case_baseinfo.refCustomerId,
								resourceIsValid: parseInt(dataList.resource_valid.resourceValid),
								score: dataList.case_baseinfo.currentStarLevel,
								scoreNum: dataList.case_baseinfo.currentScoreNum
							}
							break;
						case 8:
							//回复调用
//	        		data= {
//	        			refId: dataList.case_baseinfo.caseId,
//	        			refName: dataList.case_baseinfo.caseName,
//	        			refContent: dataList.customer_collection.refContent,
//	        			author: dataList.publish_customer.lastName+dataList.publish_customer.firstName,
//	        			browseNum: dataList.case_baseinfo.browseNum,
//	        			pic: dataList.case_attachment.attUrl,
//	        			refUrl: dataList.case_baseinfo.pageStoragePath
//	        		} 
							break;
						case 17:
							data = {
								publishTime: dataList.cms_book.publishTime == "" ? dataList.cms_book.createTime : dataList.cms_book.publishTime,
								refId: dataList.cms_book.docId,
								refName: symbolToString(dataList.cms_book.docName),
								refContent: symbolToString(dataList.customer_collection.refContent),
								author: dataList.publish_customer.lastName + dataList.publish_customer.firstName,
								browseNum: dataList.cms_book.browseNum.toWK(),
								videoType:dataList.cms_book.videoType,
								pic: dataList.cms_book_attachment.docAttUrl,
								//refUrl: "/pages/eBook/eBookReading.html?bId="+dataList.cms_book.docId+"bName="+dataList.cms_book.docName,//全书阅读
								refUrl: '/pages/eBook/eBook_details.html?bId=' + dataList.cms_book.docId,		//书籍详情
								refCustomerId: dataList.cms_book.refCustomerId,
								resourceIsValid: parseInt(dataList.resource_valid.resourceValid)
							}
							break;
						default:
					}
					return data;
				}
			},
			getFollowInitTotalAndTabNav: function () {
				var countUrl = PC_CALL + 'customer/follow_resource/getResourceNum/';
				var followCount = Fns.ajax.sync(countUrl).responseObject.responseData.data_list;
				$('.followCaseNum').text(followCount.caseNum);
				$('.followTopicNum').text(followCount.topicNum);
				$('.followTagNum').text(followCount.propertyNum);

				var _this = this;
				$(".ev-clickFollowNav").find('[data-role]').on('click', function () {
					$(this).addClass('active').siblings().removeClass('active');
					switch ($(this).attr('data-role')) {
						case "tabCase":
							_this.getFollow(7);
							break;
						case "tabTopic":
							_this.getFollow(4);
							break;
						case "tabTag":
							_this.getFollow(61);
							break;
						default:
					}
				});

			},
			getFollow: function (type, pageIndex) { //
				var _this = this;
				//默认病例
				if (!type) {
					type = 7;
					$('[data-role="tabCase"]').addClass('active').siblings().removeClass('active');
				}

				var rsCount = 0, typeDesc = '', typeDesc2, typeDesc3;
				switch (type) {
					case 4:
						rsCount = parseInt($('.followTopicNum').text());
						typeDesc = '话题';
						break;
					case 7:
						rsCount = parseInt($('.followCaseNum').text());
						typeDesc = '病例';
						break;
					default:
						typeDesc = '标签';
						typeDesc2 = '关注标签发现更多有价值的资料';
						typeDesc3 = '<a href="/pages/discover/discover_tag.html">全部标签</a>';
						rsCount = parseInt($('.followTagNum').text());
				}

				if (rsCount === 0) {
					obj.pagerEl.hide();
					$('.ev-followList').html(module.list2Template.nullData('您还没有关注' + typeDesc, typeDesc2, typeDesc3));
				} else {
					obj.pagerEl.show();
					rsCount = Math.ceil(rsCount / 20);
					//装载翻页 
					obj.pagerEl.pager({pagenumber: 1, pagecount: rsCount, buttonClickCallback: pageAjax});

					if (pageIndex != undefined) { //重设翻页数
						var a = $(".pages>.page-number");
						for (var x = 0; x < a.length; x++) {
							if ($($(".pages>.page-number")[x]).text() == pageIndex) {
								$($(".pages>.page-number")[x]).addClass("pgCurrent").siblings().removeClass("pgCurrent");
							}
						}
					}

					var url = PC_CALL + 'customer/follow_resource/getMapList/'
					var params = {
						paramJson: $.toJSON({
							customerId: obj.cid,
							followType: type, // 4/7/61
							pageIndex: pageIndex == undefined ? 1 : pageIndex,
							pageSize: 20,
							sortType: 2,
							logoUseFlag: 3,
							attUseFlag: 2,
							visitSiteId: 1
						})
					}
					var data = _this.isExistData(Fns.ajax.sync(url, params));
					if (data) {
						ctrlCenter(type, data);
					} else {
						obj.pagerEl.hide();
						switch (type) {
							case 4:
								if ($('.followTopicNum').text() == 1) {
									$('.followTopicNum').text(0);
								}
								break;
							case 7:
								if ($('.followCaseNum').text() == 1) {
									$('.followCaseNum').text(0);
								}
								break;
							default:
								if ($('.followTagNum').text() == 1) $('.followTagNum').text(0);
						}
						$('.ev-followList').removeClass("al-personalFollowTag");
						$('.ev-followList').html(module.list2Template.nullData('您还没有关注' + typeDesc, typeDesc2, typeDesc3));
					}
					;
				}

				function ctrlCenter(type, dataList) {
					var tempHtml = null;
					HTML = [], isTag = false;
					;
					for (var i = 0; i < dataList.length; i++) {
						if ($.trim(dataList[i].resource) != "") {
							var refId = '', refName = '';
							if (dataList[i].resourceType == 61) {
								isTag = true;
								refId = dataList[i].resource.id;
								refName = dataList[i].resource.propertyName;
								html = module.resourceListTemplate({tempName: 'tagList'})({
									tagName: symbolToString(dataList[i].resource.propertyName),
									tagRefNum: dataList[i].resourceNum,
									tagId: dataList[i].resource.propertyId
								});
							} else {
								refName = dataList[i].resource.resourceName;
								refId = dataList[i].resource.resourceId;
								html = module.resourceListTemplate({tempName: "resource"})({
									isNew: 0,//传0或1 最新标识
									isHost: 0,//传0或1 最热标识
									resourceIsValid: dataList[i].resource.isValid, //当前资源状态
									cancelText: '取消关注',//是否需要取消类的按钮
									topicMask: 1,//话题图标
									resType: type,//资源类型传数字  1-视频，2-文库，3-会议，4-话题 ,7-病例,
									resId: dataList[i].resource.resourceId,//资源id
									resName: symbolToString(dataList[i].resource.resourceName),//标题
									resContent: symbolToString(dataList[i].resource["abstract"]),//内容
									userName: dataList[i].customer_auth.lastName + dataList[i].customer_auth.firstName,//作者
									reviewNum: dataList[i].resource.browseNum.toWK(),//观看数
									resPic: type == 4 ? dataList[i].resource_att.topicAttUrl : dataList[i].resource_att.attUrl,//缩略图
									resUrl: dataList[i].resource.pageStoragePath,//资源链接
									score: dataList[i].currentStarLevel,
									videoType:data.videoType,
									scoreNum: dataList[i].currentScoreNum
								});
							}

							html = $(html);
							html.find('.ev-wrapSocial').VNS_SocialFollow({
								$UI_Obj: {},
								Action_Type: 'resource',
								Oper_Boo_Mouse: {
									state: true,
									ele: html
								},
								AJAX_Obj_Params: {
									create: {
										followType: type,
										refId: refId,
										refName: refName
									},
									cancel: {
										followType: type,
										refId: refId
									}
								},
								AJAX_Obj_Callback: {
									cancel: {
										success: function () {
											if ($(".ev-followList").children().length > 1) {
												_this.getFollow(type, $(".pages>.pgCurrent").text());
											} else {
												_this.getFollow(type, $(".pages>.pgCurrent").text() - 1);
											}
										}
									}
								},
								Param_Num_State: 2
							});

							HTML.push(html);
						}

					}

					$('.ev-followList').html(HTML);

					if (isTag) {
						$('.ev-followList').addClass('al-personalFollowTag');
					} else {
						$('.ev-followList').removeClass('al-personalFollowTag');
					}


				}

				function pageAjax(pageclickednumber) { //翻页 取当前单击的数值
					var type = 0;
					//if(!params.pageIndex){
					params.paramJson = JSON.parse(params.paramJson);
					params.paramJson.pageIndex = parseInt(pageclickednumber);
					type = params.paramJson.followType;
					params.paramJson = $.toJSON(params.paramJson);
					//}else{
					//params.pageIndex = parseInt(pageclickednumber);
					//}
					$(window).scrollTop(0);

					var data = Fns.ajax.sync(url, params);
					ctrlCenter(type, data.responseObject.responseData.data_list);
					obj.pagerEl.pager({
						pagenumber: pageclickednumber,
						pagecount: rsCount,
						buttonClickCallback: pageAjax
					});
				}

			},
			isExistData: function (data) {
				if (data.responseObject && data.responseObject.responseStatus && data.responseObject.responseData.data_list) {
					return data.responseObject.responseData.data_list;
				} else {
					return false;
				}
			}

		};

		container.init();
	});
});
