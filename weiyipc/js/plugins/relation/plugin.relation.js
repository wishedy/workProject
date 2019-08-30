/**
 * 功能描述：弹层式的社交关系 现用场景：终端页
 * 使用方法：$("el").relation({})
 *                    参数参照下方18-29行
 *
 * 注意事件：
 * 调用外部文件 relpy-list.js plugin.top-tip.js module.report.js 原因：在回复时需要刷新列表与提示
 * 引入来源：权限控制 user.login({})  提示：$.topTip
 *
 * Created by QiaoLiang on 2014.
 */
;(function ($) {
	$.fn.extend({
		"relation": function (options) {
			var s = $.extend({
				t: this,
				praiseNum: 0,
				reviewNum: 0,
				reprintNum: 0,
				collectionNum: 0,
				praiseValid: 0,
				reprintValid: 0,
				collectionValid: 0,
				isCollect: false,
				customerId: 0,
				authId: 0, // 作者id
				refId: 0,
				type: 0,
				reviewType: 8, //这条不需要
				reviewId: 0,
				reviewStatus: 0, //1为显示
				userId: 0, //当前人id
				name: 0, //当前人名称
				logoUrl: '' //当前人头像
			}, options);

			var p = {
				praiseNum: s.praiseNum,
				reviewNum: s.reviewNum,
				reprintNum: s.reprintNum,
				collectionNum: s.collectionNum,
				praiseValid: s.praiseValid,
				reprintValid: s.reprintValid,
				collectionValid: s.collectionValid,
				isCollect: s.isCollect,
				customerId: s.customerId,
				refId: s.refId,
				authId: s.authId,
				reviewId: s.reviewId,
				parentId: s.parentId,
				userId: s.userId,
				name: s.name,
				logoUrl: s.logoUrl
			};

			var m = {
				el: {
					waterfallPlace: ".detail_replys", //瀑布流加载位置 －－此处用于删完最后一条数据时替换为空时
					waterfallHint: ".reply-list-hint", //瀑布流数据提示位置 －－此处用于恢复完最后一条数据时提示
					replyList: ".module-replyList", //回复列表最外层类名
					replyForm: "#pluginRelation", //回复弹层最外层
					replyFormParam: "#pluginRelationParam", //回复参数
					replyContent: "#doc_abstract" //回复框
				},
				//初始化
				init: function () {
					var t = this;

					//是自己的情况下显示删除按钮
					var removeStatus;
					if (s.userId == p.customerId) {
						removeStatus = true;
					}

					//计数集合
					var setNum = {
						reviewNum: p.reviewNum,
						reprintNum: p.reprintNum,
						praiseNum: p.praiseNum,
						collectionNum: p.collectionNum,
						parentId: p.parentId
					};
					//TODO :
					s.t.append(t.common.template.relation(setNum, p.reviewId, removeStatus, s.reviewStatus, "init")).find("li").on("click", function () {
						if ($(this).find('div').attr('class').substr(8) !== "") {
							t.controller.events[$(this).find("div").attr("class").substr(8)](t, this);
						}
					}).on("mouseover", function () {
						t.common.touchWordTips(this, $(this).find("div").attr("class").substr(8), "over");
					}).on("mouseout", function () {
						t.common.touchWordTips(this, $(this).find("div").attr("class").substr(8), "out");
					});
					
					s.t.find(".article_report").on("click", function(){ //举报
						module.report({refType:s.type,refId:p.refId,reviewId:p.reviewId});
					});

					s.t.find(".ck_dh").on("click", function () {
						user.login({
							callback:function(){
								t.controller.events.chat(t, this);
							},
							scene:12
						})

					});
					
				},
				opts: {},
				//控制区
				controller: {
					events: {//事件区
						praise: function (t, _this) { //赞
							user.login({
								callback: function () {
									var url = "", params = {};
									if ($(_this).find("a").attr("class") != "ok") {
										params.paramJson = $.toJSON({
											customerId: p.customerId,
											usefulType: s.reviewType,
											upDownType: 1,
											refId: p.reviewId
										});
										url = t.common.supportUrl.praise;
										t.common.setTotal(_this, true, "praise");
										$(_this).find("a").addClass("ok");
									} else {
										params.paramJson = $.toJSON({
											customerId: p.customerId,
											usefulType: s.reviewType,
											upDownType: 1,
											refId: p.reviewId
										});
										url = t.common.supportUrl.praiseCancel;
										t.common.setTotal(_this, false, "praise");
										$(_this).find("a").removeClass("ok");
									}

									t.common.ajaxSend(url, params);
								},
								scene: privilegeSceneConst.eSceneTypePraiseResourse,
								_this: _this,
								t: t,
								p: p
							});
						},
						forward: function (t, _this) { //转发
							user.login({
								callback: function () {
									var url = "", params = {};
									params.paramJson = $.toJSON({
										customerId: p.customerId,
										reprintType: s.reviewType,
										refId: p.reviewId
									});

									if ($(_this).find("a").attr("class") != "ok") {
										t.common.setTotal(_this, true, "forward");
										$(_this).find("a").addClass("ok");
										url = t.common.supportUrl.forward;
									} else {
										t.common.setTotal(_this, false, "forward");
										$(_this).find("a").removeClass("ok");
										url = t.common.supportUrl.forwardCancel;
									}
									t.common.ajaxSend(url, params);
								},
								scene: privilegeSceneConst.eSceneTypeTransmit,
								_this: _this,
								t: t,
								p: p
							});

						},
						collect: function (t, _this) { //收藏
							user.login({
								callback: function () {
									var url = "", params = {};
									params.paramJson = $.toJSON({
										customerId: p.customerId,
										collectionType: s.reviewType,
										refId: p.reviewId
									});

									if ($(_this).find("a").attr("class") != "ok") {
										url = t.common.supportUrl.collect;
										t.common.setTotal(_this, true, "collect");
										$(_this).find("a").addClass("ok");
									} else {
										url = t.common.supportUrl.collectCancel;
										t.common.setTotal(_this, false, "collect");
										$(_this).find("a").removeClass("ok");
									}

									t.common.ajaxSend(url, params);
								},
								scene: privilegeSceneConst.eSceneTypeCollect,
								_this: _this,
								t: t,
								p: p
							});
						},
						reply: function (t, _this, source) { //回复 版本1
							$(_this).parents("li").removeClass("maskShrinkageAction");
							user.login({
								callback: function () {
									var currEl, currLi, nameHref, name, content, time, logoUrlHref, reviewId;
									//从当前页面取回当前回复的基础信息 与页面元素一一对应
									if ($(_this).parents(".children").length > 0) { //在外部列表时
										currEl = $(_this).parents("li");
										nameHref = currEl.find(".v_all_name").html();
										name = currEl.find(".v_all_name").text();
										content = currEl.find(".evContent").html();
										time = currEl.find(".v_all_list_l").text();
										logoUrlHref = currEl.find(".v_all_user").html();
										imgList = currEl.find(".ev-picParentPlace").html();
										reviewId = currEl.find(".plugin-relation").attr("data-reviewid");
									} else { //在查看对话时
										currLi = $(_this).parents("li");
										nameHref = currLi.find(".p_l_t_l").html();//没名字链接
										name = currLi.find(".p_l_t_l").text();
										content = currLi.find(".list_text").html();
										time = currLi.find(".p_l_t_r_case").text();
										logoUrlHref = currLi.find(".t_tc_left").html();
										imgList = currLi.find(".ev-picPlace").html();
										reviewId = currLi.find(".plugin-relation").attr("data-reviewId");
									}

									//变更reviewId 赋给回复框接值
									$(".video_c_but").attr("data-reviewid", reviewId);

									//清除格式
									content = t.common.wordLen(t.common.clearFormatWord(content), 176);

									//暂时先为空图片
									var kv = {
										name: name, nameHref: nameHref, content: content, imgList: imgList,
										time: time, logoUrlHref: logoUrlHref, reviewId: reviewId
									};

									//是否对话上层点击或是下层点击回复 作交互效果处理
									if (source == "chatDown") { //查看对话时触发回复
										var currLi = $(_this).parents("li");
										currLi.removeAttr("style");//移除当前背景色
										currLi.find(".line_place").removeClass("reply_bottom_line"); //移除下方线条
										if (currLi.find('.line_place').length === 0) { //对话回复上层回复时
											currLi.append('<div class="line_place"></div>');
										}
										currLi.siblings().fadeOut();
										$(_this).parent().hide();
										$("#reply_area").show();
										t.common.textareaAct("expand");

										//如果为展开时则触发，不展开则不触发
										if (currLi.find(".expandOrShrink").text() == "收起") {
											currLi.find(".list_text").find("span:eq(0)").show();
											currLi.find(".list_text").find("span:eq(1)").hide();
											currLi.find(".expandOrShrink").text("展开");
										}

										var b = $(currLi).height() + 40 + 178; //40为上下间距各20 回复框定高178px
										$(".t_tc_main").animate({
											height: b + "px",
										});

										$("#reply_area").show(); //秀回复区
										$("#widget").hide();//隐社交区
										t.common.showCenter(); //
										t.common.textareaAct("expand"); //展开回复区
									} else { //在外部列表直接点回复

										//检测是否已经存在回复表单
										var len = $(_this).parents("li").find('.moduleReplyForm').length;
										if (len > 0) {
											return false
										}

										//追加外部间距
										if ($(_this).parents('li').index() === 0) {
											$(_this).parents('li').addClass('plgin-relation2-li-margin20-onlyTop');
										} else {
											$(_this).parents('li').addClass('plgin-relation2-li-margin20');
										}

										module.replyForm({
											selector: $(_this).parents("li"),
											refId: p.refId,
											logoUrl: p.logoUrl,
											authId: p.authId,
											name: p.name,
											type: s.type,
											scene: 2,
											callback: appendUI
										});

										//扩展UI
										function appendUI() {
											//背景色类
											$('.video_comment', this.selector).addClass('detail_comm_cont');
											//小箭头
											$('.video_comment', this.selector).prepend('<div class=\"p_hf_sj_v2\"></div>')
										}

										//接入下层回复
										if ($('[data-total]', _this).attr('data-total') > 0) {
											support.downstairs({
												selector: $(_this).parents("li").find(".moduleReplyForm"),
												parentEle: $(_this).parents("li"), //此处需要最高父级，下层
												refType: s.type,
												refId: s.refId,
												reviewId: s.reviewId,
												uiCallback: callback_shrink
											});

											//回调方法追加右侧收起及处理回复收起事件
											function callback_shrink(ele) {
												return ele.append('<div class="close_hf cursor">收起回复</div>')
													.find('[class="close_hf cursor"]').on('click', function () {
														//移除外边框
														$(this).parents(".children").removeClass('plgin-relation2-li-margin20-onlyTop')
															.removeClass('plgin-relation2-li-margin20');
														
														//标识收起动作
														$(this).parents("li").addClass("maskShrinkageAction");
														
														//应急处理:移除回复框
														$(this).parent().siblings('.moduleReplyForm').remove();
														//移除回复列表
														$(this).parent().remove();
													});
											}
										}
									}

									//添加图片 不存在列表多条时的场景，自然无需uploadVideoBtn自增
									if($("#pluginRelation .Ev-relationAddPicVideo").length > 0){
										$("#pluginRelation .Ev-relationAddPicVideo").addRemoveablePic({
											container: $("#pluginRelation .upload_pic"),
											limit: 4,
											desc: "plugin.relation.js",
											qiniuUploaderId:"#uploadVideoBtn",
											html: "<div>添加图片</div>",
											onSizeChange: function (isExist) {
												picCb(isExist);
											}
										});
									}
									
									//资源引用
									$("#pluginRelation").referenceResource({
										customerId:"1399252409974",      //TODO
										callback:function(){
											resourceCb($(t.el.replyForm).find(".Ev-resourceName span"));
										}
									});

									//提醒谁看
									$("#pluginRelation").replyRemind({
										//width : "558",
										callback: function () {
											remindCb($(t.el.replyForm).find(".remind_name span"));
										}
									});

									//记录pic与content是否有值
									var pic = false, content = false;
									//添加图片及提醒谁看内部回调方法
									function remindCb(arr) { //取出被提醒人id
										t.opts.cidArr = [];
										$.each(arr, function (i, el) {
											t.opts.cidArr.push($(el).attr("customerid"));
										});
										t.common.updateParams();
									}
									//取出引用资源id
									function resourceCb(arr) {
										t.opts.resourceIdArr = $(arr).attr("resourceid");
										/*$.each(arr, function (i, el) {
											t.opts.resourceIdArr.push();
										});*/
										t.common.updateParams();
									}

									function picCb(isExist) {//图片触发切换发布
										t.opts.picPub = isExist;
										t.common.submitToggle();
										t.common.updateParams();
									}

									//回复时清掉对话线
									$(".chat_line").remove();
									var $docAbstract = $("#doc_abstract");
									$docAbstract.attr("placeholder", "回复@" + kv.name);

									$docAbstract.focus();
									t.common.changeTitle("reply", kv.name);
									t.common.closeWindow();

									//事件区*************************
									$docAbstract.on("focus", function () {
										$docAbstract.css({"line-height": "normal"});
										//如果没有找到收起展开，不执行
										var els = $(this).parents(".t_tc_main");
										if (els.find(".list_text>span:eq(2)").length > 0) {
											t.common.textareaAct("expand");

											//清理结构
											$.each(els.find("#reply_list li"), function (i, el) {
												if ($(el).attr("style") !== undefined) {
													$(el).remove();
												}
											});

											//假设当前为收起
											if (els.find(".list_text>span:eq(2)").text() == "收起") {
												els.find(".list_text>span:eq(0)").show();
												els.find(".list_text>span:eq(1)").hide();
												els.find(".list_text>span:eq(2)").text("展开");
											}

											if ($(this).css("height") != "97px") {
												var a = els.css("height", "auto").height();
												els.animate({
													height: a + 40 + 23 + "px" // 不进行97px判断会出现白背景   40上下20间距 23为回复框间距
												});
											}
										}

									}).on("input", function () {
										t.opts.contentPub = $(t.el.replyContent).val();
										t.common.submitToggle();
										t.common.updateParams();
									}).on("propertychange", function () { //兼容ie
										t.opts.contentPub = $(t.el.replyContent).val();
										t.common.submitToggle();
										t.common.updateParams();
									});

									//取消
									$("#cancel_reply").on("click", function () { //是为关闭功能
										$(".remind_text>.tx_who_look").css("width", "864px");
										comm.LightBox.hide();
										$("#pluginRelation").remove();
										$("body").removeAttr("style");
									});

									//保存
									$("#save_reply").on("click", function () {
										if ($(this).attr("class").indexOf("publish-ok") > -1) { //如果是发布
											
											//处理视频正在上传中的状态
						                	if($(".ev-processTips", t.opts.selector).text() === "视频正在处理中..."){
						                		alert("上传视频正在处理中，请等待上传完成后再进行发布操作！")
						                		return false;
						                	};
											
											//提交后禁止再次提交
											$(this).removeClass("publish-ok").addClass("fb_but");
											var options = {
												url: t.common.supportUrl.reply,
												success: function (result) {

													//IE时
													if (navigator.userAgent.indexOf("MSIE") > 0) {
														$.topTip({mark: "success", showTime: 3, content: "发表回复成功！"});
														//初始化
														comm.LightBox.hide();
														$(t.el.replyForm).remove();
														$("body").removeAttr("style");

														//回应列表
														module.replyList({
															target: t.el.waterfallPlace, //瀑布流加载位置
															hint: t.el.waterfallHint, //提示位置
															authId: p.authId,
															refId: s.refId,
															type: s.type,
															refresh: true, //刷新
															callback: function () {
																$(".evModuleReplyForm").click();
																$(".evModuleReplyForm").focus();
															}
														});

														return false;
													}

													var result = $.parseJSON(result);
													if (result.responseObject.responseStatus) {
														$.topTip({mark: "success", showTime: 3, content: "发表回复成功！"});

														//将外部值＋1
														$(currEl).find(".plugin-relation>li:eq(1) span:eq(1)").text(parseInt($(currEl).find(".plugin-relation>li:eq(1) span:eq(1)").text()) + 1);

														//判断外部是否存在查看对话
														if ($(currEl).find(".ck_dh").length === 0) {
															var html = "<div class=\"ck_dh\">查看对话</div>";
															$(currEl).find(".widget_v2").after(html);
															$(currEl).find(".ck_dh").on("click", function () {
																t.controller.events.chat(t, this);
															});
														}

														//初始化
														comm.LightBox.hide();
														$(t.el.replyForm).remove();
														$("body").removeAttr("style");

														//回应列表
														module.replyList({
															target: t.el.waterfallPlace, //瀑布流加载位置
															hint: t.el.waterfallHint, //提示位置
															refId: s.refId,
															authId: p.authId,
															type: s.type,
															cid: s.userId,
															refresh: true, //刷新
															callback: function () {
																$(".evModuleReplyForm").click();
																$(".evModuleReplyForm").focus();
															}
														});

													} else {
														$.topTip({mark: "warn", showTime: 3, content: "发表回复失败！"});
													}
												}
											};

											$(t.el.replyForm).ajaxSubmit(options);

										}
									});
								},
								scene: privilegeSceneConst.eSceneTypeReview,
								_this: _this,
								t: t,
								p: p
							});
						},
						del_reply: function (t, _this) { //删除回应
							var params = {};
							params.paramJson = $.toJSON({id: s.reviewId});
							t.common.ajaxSend(t.common.supportUrl.delreply, params);

							$(_this).parents(".children").animate({height: 0}, 500, function () {
								$(_this).parents(".children").hide();
								$(_this).parents(".children").css("height", "auto");

								$.topTip({
									mark: "success",
									showTime: 5,
									content: "删除成功！<span id=\"recoverReply\" class=\"recoverData cursor\">需要恢复?</span>",
									callback: function () {
										t.controller.events.recover();
									}
								});

								//判断是否没有一条数据
								var reviewListBox = $(t.el.replyList).find(".children");
								var signMark = false;
								for (var i = 0; i < reviewListBox.length; i++) {
									var currStatus = $($(t.el.replyList).find(".children")[i]).css("display");
									if (currStatus != "none") {
										signMark = true;
										break;
									}
								}

								if (!signMark) { //当无数据时显示并注入直接点击到回复
									$(t.el.waterfallPlace).prepend(t.common.template.nullData());
									$(t.el.waterfallHint).hide();
									$(".sayReply").on("click", function () {
										$(".evModuleReplyForm").click();
										$(".evModuleReplyForm").focus();
									})
								}

							});
						},
						recover: function () { //恢复回应
							var t = m;
							$("#recoverReply").off("click").on("click", function () { //对应恢复按钮
								var params = {};
								params.paramJson = $.toJSON({id: s.reviewId});
								t.common.ajaxSend(t.common.supportUrl.recover, params);
								var $reviewId = $("[data-reviewId='" + s.reviewId + "']");
								var $reviewIdPrt = $reviewId.parents(".children");
								var h = $reviewIdPrt.height();
								$reviewIdPrt.css("height", 0).show();
								$reviewIdPrt.animate({height: h + "px"});

								if ($(t.el.waterfallPlace).find("div:eq(0)").text() === "暂时还没有回应哦~你来说几句吧！") {//恢复最后一条时
									$(t.el.waterfallPlace).find("div:eq(0)").remove();
									$(t.el.waterfallHint).show();
									$(t.el.waterfallHint).find("div").text("最后一页了");
								}
							});
						},
						chat: function (t, _this) { //查看对话
							
							//从社交中取出当前id
							var reviewId = s.reviewId; //$(_this).parent().find("ul").attr("data-reviewId");
							var paramJson = {
								dataFlag: 3,
								useFlag: 1,
								attUseFlag: AttUseFlag.c,
								logoUseFlag: AttUseFlag.c,
								refId: p.refId,
								scene: Scene.b,
								currentReviewId: reviewId,
								pageIndex: 1,
								pageSize: 10
							};

							var result = t.common.ajaxResult(t.common.supportUrl.chat, paramJson);
							var html = "",
								fitting = "",
								dataList = result.responseObject.responseData.data_list;

							$.each(dataList, function (i, el) {
								if (i === 0)
									html += t.common.template.reply(t.common.adapter(t, el));
								else
									fitting += t.common.template.addReply(t.common.adapter(t, el));
							});

							//计算展开和收起时对话线的问题
							$("body").prepend(html);
							
							var $replyList = $("#reply_list");
							
							//输出的同时移除举报功能
							$replyList.append(fitting).find(".article_report").remove();

							//TODO 只差多条数据触发时高度控制
							$replyList.find(".expandOrShrink").on("click", function () { //只针对上层

								if ($(this).text() == "展开") {
									$(this).attr("chat-line", parseInt($(".chat_line").css("height"))); //记录下当前对话线长度,供恢复时使用
									$(this).parent().find("span:eq(0)").hide();
									$(this).parent().find("span:eq(1)").show();
									$(this).text("收起");

									t.common.textareaAct("shrink");

									//先判断是否只有一条数据，如果只有一条数据，不变更对话线
									var lis = $replyList.children(), chatLineChange = false;
									if ($(lis[1]).attr("class") == "reply_space") chatLineChange = false;
									else chatLineChange = true;

									var selfLi = $(this).parents("li");
									for (var i = 0; i < lis.length; i++) {
										if ($(lis[i]).text() == selfLi.text()) {//如果触发数据等于被遍历的数据
											if ($(lis[i + 1]).attr("class") == "reply_space") chatLineChange = false; //下一层为下层
											else if (i == (lis.length - 1)) chatLineChange = false; //记录尾
										}
									}

									//是否变更对话线 78原高
									if (chatLineChange) {
										$(".chat_line").css("height", parseInt($(".chat_line").css("height")) + $(this).parent().height() - 78 + "px");
									}

									//重新计算高度
									var sysH = $(window).height() * 0.8;
									var windowH = $("#reply_list").height();//$(".t_tc_main").height();
									if (windowH > sysH) {
										$(".t_tc_main").css({"overflow-x": "hidden", "overflow-y": "auto"});
										$(".t_tc_main").animate({height: sysH + "px"});
									} else {
										$(".t_tc_main").css("height", "auto");
									}

								} else {
									$(this).parent().find("span:eq(0)").show();
									$(this).parent().find("span:eq(1)").hide();
									$(this).text("展开");
									t.common.textareaAct("expand");

									//恢复对话线
									$(".chat_line").css("height", parseInt($(this).attr("chat-line")) + "px");

									//重新计算高度
									var sysH = $(window).height() * 0.8;
									var windowH = $("#reply_list").height(); //$(".t_tc_main").height();
									if (windowH > sysH) {
										$(".t_tc_main").css({"overflow-x": "hidden", "overflow-y": "auto"});
										$(".t_tc_main").animate({height: sysH + "px"});
									} else {
										$(".t_tc_main").css("height", "auto");
									}
								}
							});

							//给对话上层绑事件
							$replyList.find(".widget_v2 li").on("click", function () {
								t.controller.events[$(this).find("div").attr("class").substr(8)](t, this, "chatDown");
							});

							//视频播放
							$replyList.find(".evBgVideo").on("click", function(){
								$("#pluginRelation").remove();
								module.backgroundVideo({videoSrc:$(this).attr("data-videosrc")});
							});
							
							//计算列表总数及产生对话线长度
							var replyListCount = $replyList.children("li").length;
							var chatLineHeight = 0; //统计对话线长度
							if (replyListCount > 3) {
								var total = replyListCount - 3;
								var showNum = total + "条更多回复";
								var moreHtml = "<div class=\"more_reply_num\"><span id=\"expand_reply\">" + showNum + "</span></div>";
								//循环遍历小于的都隐藏，等于的则在其上追加显示记录注册事件
								var arrList = $("#reply_list").children("li");
								for (var i = 0; i < replyListCount; i++) {
									if (i < total && i != 0) {
										$($(arrList)[i]).addClass("hidden_reply_li");
									} else if (i == total) {
										$($(arrList)[i]).addClass("hidden_reply_li");

										$($(arrList)[i]).after(moreHtml);

										$("#expand_reply").on("click", function () { //给记录条数绑事件 秀全部记录 并删除自身 计算对话线
											//查看全部对话线时
											var childs = $("#reply_list").children(), childsHeight = 0;
											for (var i = 0, len = childs.length; i < len; i++) {
												if ($($(childs)[i]).attr("class") == "reply_space") {
													childsHeight += (i - 1) * 20; //计算总条数的边距
													break;
												} else childsHeight += $($(childs)[i]).height();
											}

											$(".hidden_reply_li").removeClass("hidden_reply_li");
											$(this).parent().remove();

											$(".chat_line").animate({height: childsHeight + "px"});//24的显示条数高度

										});
									} else {
										var currLiH = $($(arrList)[i]).height();
										chatLineHeight += currLiH;
									}
								}
							} else if (replyListCount < 4 && replyListCount > 1) {
								var arrList = $("#reply_list").children("li");
								for (var i = 0; i < replyListCount; i++) {
									if (i < replyListCount - 1) {
										var currLiH = $(arrList[i]).height();
										chatLineHeight += currLiH;
									} else if (i == replyListCount - 1) {
										chatLineHeight += 65; //40边距＋头像60一半30
									}
								}
							}

							//初始化查看对话时对话线
							$(".chat_line").animate({height: chatLineHeight + "px"});//24的显示条数高度

							//t.common.expandOrShrink($(html).find(".expandOrShrink"));
							//t.common.expandOrShrink($(fitting).find(".expandOrShrink"));

							$("#reply_area").hide();
							$("#widget").show();
							t.common.closeWindow();
							t.common.changeTitle("chat");
							t.common.showCenter();

							//加载瀑布流
							var params = {
								dataFlag: 3,
								useFlag: 1,
								attUseFlag: AttUseFlag.c,
								logoUseFlag: AttUseFlag.c,
								refId: p.refId,
								sortType: 1,
								scene: Scene.b,
								parentId: reviewId,//         当前回复Id
								isCurrentRow: 0,
								pageIndex: 1, //
								pageSize: 20
							};
							t.waterfallPage(t, t.common.supportUrl.chat, params);
						}
					}
				},

				//公共
				common: {
					template: {//模版
						nullData: function () { //删除完最后数据时
							return "<div class=\"v_all_list\">" +
								"<div class=\"v_all_none font_yahei\">暂时还没有回应哦~<a class=\"sayReply\" href=\"javascript:;\">你来说几句吧！</a></div>" +
								"</div>";
						},
						relation: function (kv, reviewId, isRemove, reviewStatus, src) { //社交 TODO:
							var t = m;
							var html = "";
							if (reviewStatus == 1) {
								html = "<ul class=\"plugin-relation\" data-reviewId=\"" + reviewId + "\">" +
									"<li class=\"cursor\"><div class=\"article_forward\"><span><a class=\"" + t.common.isValidAddOk(p.reprintValid) + "\" href=\"javascript:;\" title=\"转发\"></a></span>" + t.common.initWordOrNum("forward", kv.reprintNum) + "</div></li>" +
									"<li class=\"cursor\"><div class=\"article_reply\"><span><a href=\"javascript:;\" title=\"回复\"></a></span>" + t.common.initWordOrNum("reply", kv.reviewNum) + "</div></li>";
								//判断是否满足查看对话条件 缺标识
								if (kv.parentId === 0 && kv.reviewNum === 0 && isRemove === true && src == "init") {
									html += "<li class=\"cursor\"><div class=\"article_del_reply\"><span><a class=\"off\" href=\"javascript:;\" title=\"删除\"></a></span><span>删除</span></div></li></ul>";
								} else if ((kv.parentId !== 0 || kv.reviewNum > 0) && isRemove === true && src == "init") {
									html += "<li class=\"cursor\"><div class=\"article_del_reply\"><span><a class=\"off\" href=\"javascript:;\" title=\"删除\"></a></span><span>删除</span></div></li><li class=\"look_sx\"><div class=\"ck_dh\">查看上下文</div></li></ul>";
								} else if ((kv.parentId !== 0 || kv.reviewNum > 0) && isRemove === undefined && src == "init") {
									html += "<li class=\"cursor\"><div class=\"article_collect\"><span><a class=\"" + t.common.isValidAddOk(p.collectionValid) + "\" href=\"javascript:;\" title=\"收藏\"></a></span>" + t.common.initWordOrNum("collect", kv.collectionNum) + "</div></li>";
									html += "<li class=\"cursor\"><div class=\"article_praise\"><span><a class=\"" + t.common.isValidAddOk(p.praiseValid) + "\" href=\"javascript:;\" title=\"赞\"></a></span>" + t.common.initWordOrNum("praise", kv.praiseNum) + "</div></li><li class=\"look_sx\"><div class=\"ck_dh\">查看上下文</div></li>";
									html += "</ul><div class=\"cursor article_report\" style=\"margin-top: 12px;font-size:13px;float:right;color: #808080;\">举报</div><div class=\"clear\"></div>";
								} else { //终端页查看对话时
									//非自己时
									if (p.userId != kv.customerId) {
										html += "<li class=\"cursor\"><div class=\"article_collect\"><span><a class=\"" + t.common.isValidAddOk(p.collectionValid) + "\" href=\"javascript:void(0);\" title=\"收藏\"></a></span>" + t.common.initWordOrNum("collect", kv.collectionNum) + "</div></li>";
										html += "<li class=\"cursor\"><div class=\"article_praise\"><span><a class=\"" + t.common.isValidAddOk(p.praiseValid) + "\" href=\"javascript:;\" title=\"赞\"></a></span>" + t.common.initWordOrNum("praise", kv.praiseNum) + "</div></li>";
										html +=	"</ul><div class=\"cursor article_report\" style=\"margin-top: 12px;font-size:13px;float:right;color: #808080;\">举报</div><div class=\"clear\"></div>"; //
									} else {
										html += "</ul>"; //<div class=\"cursor article_report\" style=\"margin-top: 12px;font-size:13px;float:right;color: #808080;\">举报</div><div class=\"clear\"></div>
									}
								}
							}
							return html;
						},
						addReply: function (kv) { //追加回复
							function isVideo(videoSrc){
								if(videoSrc) return '<div style="margin-top:12px;">'+videoSrc+'</div>';
								return '';
							}
							function isQuote(quote){
								if(quote) return '<div style="font-size: 14px;color: #333;margin-top:12px;">'+quote+'</div>';
								return '';
							}
							var html = "<li>" +
								"<div class=\"t_tc_left\">" + kv.logoUrlHref + "</div>" +
								"<div class=\"t_tc_right\">" +
								"<div class=\"p_list_top\">" +
								"<div class=\"p_l_t_l font_yahei\">" + kv.nameHref + "</div>" +
								"<div class=\"p_l_t_r_case\">" + kv.time + "</div>" +
								"<div class=\"clear\"></div>" +
								"</div>" +
								"<div class=\"list_text font_yahei\">" + kv.content + "</div>" +
								'<div class="clear"></div>'+
								"<ul class=\"case_img_list viewBigImg personal_home_img_ads ev-picParentPlace\" reviewId='" + kv.reviewId + "'>" + kv.imgList + "</ul>" +
								'<div class="clear"></div>'+
								 isVideo(kv.videoSrc) + 
				                 isQuote(kv.quote) +
								"<div id=\"widget\" class=\"widget_v2\">" +
								this.relation(kv, kv.reviewId, undefined, kv.reviewStatus) + 	//不显示查看对话0 、加入社交模版
								"</div>" +
								"</div>" +
								"<div class=\"clear\"></div>" +
								"<div class=\"line_place\"></div>"+
							"</li>";
							return html;
						},
						reply: function (kv) { //对话与回复
							function isVideo(videoSrc){
								if(videoSrc) return '<div style="margin-top:12px;">'+videoSrc+'</div>';
								return '';
							}
							function isQuote(quote){
								if(quote) return '<div style="font-size: 14px;color: #333;margin-top:12px;">'+quote+'</div>';
								return '';
							}
							
							var html = "<form id=\"pluginRelation\" method=\"post\" enctype=\"multipart/form-data\">" +
								"<div id=\"reply_context\" class=\"topic_tc\">" +
								"<div class=\"t_tc_top\">" +
								"<div class=\"t_tc_title\">" + kv.title + "</div>" +
								"<div id=\"close_reply\" class=\"t_tc_close\"><div class=\"relation-reply-close\"></div></div>" +
								"</div>" +
								"<div class=\"t_tc_main\">" +
								"<div class=\"t_tc_content no_border\" style=\"position: relative;\">" +
								"<div class=\"chat_line\"></div>" +
								"<ul id=\"reply_list\" class=\"module-replyList\" style=\"width:auto;\">" + //想用原module-replyList类又不想要宽度
								"<li>" +
								"<div class=\"t_tc_left\">" + kv.logoUrlHref + "</div>" +
								"<div class=\"t_tc_right\">" +
								"<div class=\"p_list_top\">" +
								"<div class=\"p_l_t_l font_yahei\">" + kv.nameHref + "</div>" +
								"<div class=\"p_l_t_r_case\">" + kv.time + "</div>" +
								"<div class=\"clear\"></div>" +
								"</div>" +
								"<div class=\"list_text font_yahei\">" + kv.content + "</div>" +
								'<div class="clear"></div>'+
								"<ul class=\"case_img_list personal_home_img_ads viewBigImg ev-picParentPlace\"  reviewId='" + kv.reviewId + "'>" + kv.imgList + "</ul>" +
								 '<div class="clear"></div>'+
								 isVideo(kv.videoSrc) + 
				                 isQuote(kv.quote) +
								"<div id=\"widget\" class=\"widget_v2\">" +
								this.relation(kv, kv.reviewId, undefined, kv.reviewStatus) + 	//不显示查看对话0 、加入社交模版
								"</div>" +
								"</div>" +
								"<div class=\"clear\"></div>" +
								"</li>" +
								"</ul>" +
								"</div>" +
								"<div id=\"reply_area\" class=\"tc_comment_content\">" +
								"<div class=\"tc_active\"><textarea placeholder=\"回复@\" style=\"width:533px;\" id=\"doc_abstract\"></textarea></div>" +
								"<div class=\"video_c_but\" data-reviewId=\"" + kv.reviewId + "\">" +
								"<div class=\"upload_pic\"></div>" +
								"<div class='re_content_text peferRes_text hide'></div>"+//引用资源
								"<div class='re_content_text remind_text hide'></div>"+//提醒
								"<div class=\"video_c_bf\">" +
								"<div class=\"video_c_cz\">" +
								"<div class=\"btn_place\">" + //提醒包装 btn_place
								"<div class=\"photo_bg Ev-relationAddPicVideo\">添加照片</div>" +
									"<div class=\"add_video_bg\" id='uploadVideoBtn'>添加视频</div>" +
								"</div>" +
								"</div>" +
								"<div class=\"triggerEvents\">" +
								"<div class=\"qx_but\" id=\"cancel_reply\">取 消</div>" +
								"<div class=\"fb_but\" id=\"save_reply\">发 布</div>" +
								"<div class=\"clear\"></div>" +
								"</div>" +
								"</div>" +
								"<div class=\"clear\"></div>" +
								"</div>" +
								"</div>" +
								"</div>" +
								"<input id=\"pluginRelationParam\" type=\"hidden\" name=\"paramJson\" value='' />" +
								"</form>";
							return html;
						},
						outReply: function (kv) { //外部回复
							var html = "";

//									"<form id=\"pluginRelation\" method=\"post\" enctype=\"multipart/form-data\">" +
//								  "<div class=\"support-replyForm\"><div class=\"video_comment_v2\">"+			
//					              "<div class=\"video_comment_l\"><img src=\"//img05.allinmd.cn/public1/M00/03/2C/ooYBAFU811eAdrnrAAC_4nGaKOo686_c_p_150_150.jpg\"></div>"+			
//					              "<div class=\"video_comment_r\"><div><textarea placeholder=\"回复@曹力\" class=\"evSupportReplyForm\" style=\"width:850px;\"></textarea></div>"+
//					              "<div class=\"upload_pic\" style=\"display: none;\"><div class=\"add_photo hide\"><div class=\"hn_add\">还能添加4张</div> "+               
//					              "<ul>"+
//					              "<div class=\"clear\"></div>"+
//					              "</ul>"+
//					              "<input type=\"hidden\" id=\"imgType\" value=\"local\"><input type=\"hidden\" id=\"imgPkList\" class=\"imgPkList\">     </div></div>"+
//					              "<div class=\"remind_text hide\"><div class=\"tx_who_look\"><div class=\"tx_title\">提醒谁看</div><div class=\"tx_text remind_name\"></div>"+
//					              "<input type=\"text\" class=\"remind_input\"><div class=\"tx_num\">（<span class=\"remind_num\">0</span>/10）</div><div class=\"clear\"></div>"+
//					              "<div class=\"at_personal_name\" style=\"display: none;\"><ul class=\"remind_list\"></ul></div></div></div><div class=\"video_c_bf\" style=\"display: none;\">"+
//					              "<div class=\"video_c_cz\"><div class=\"btn_place\"><div class=\"photo_bg\"><div style=\"width: 50px; height: 30px; overflow: hidden; position: relative; font-size: 12px;\">添加图片"+
//					              "<input type=\"file\" name=\"file\" style=\"font-size: 12px; cursor: pointer; position: absolute; right: 0px; opacity: 0; outline: none; width: 50px; height: 30px;\"></div> </div>"+
//					              "<div class=\"at_bg remindBtn\">提醒谁看</div><div class=\"clear\"></div></div><div class=\"clear\"></div></div><div class=\"video_c_but\">"+
//					              "<div class=\"qx_but evSupportReplyCancel\">取 消</div><div class=\"fb_but evSupportReplySubmit\">发 布</div><div class=\"clear\"></div></div>"+
//					              "<div class=\"clear\"></div></div><div class=\"clear\"></div></div><div class=\"clear\"></div></div></div>"+


							/*"<div id=\"reply_area\" class=\"tc_comment_content\">"+
							 "<div class=\"tc_active\"><textarea placeholder=\"回复@\" id=\"doc_abstract\"></textarea></div>"+
							 "<div class=\"video_c_but\" data-reviewId=\""+kv.reviewId+"\">"+
							 "<div class=\"upload_pic\"></div>" +
							 "<div class=\"remind_text hide\"></div>" + //提醒
							 "<div class=\"btn_place\">" +
							 "<div class=\"photo_bg\">添加照片</div>"+
							 "</div>"+
							 "<div class=\"triggerEvents\">"+
							 "<div class=\"qx_but\" id=\"cancel_reply\">取 消</div>"+
							 "<div class=\"fb_but\" id=\"save_reply\">发 布</div>"+
							 "<div class=\"clear\"></div>"+
							 "</div>"+
							 "</div>"+
							 "<div class=\"clear\"></div>"+
							 "</div>"+
							 "</div>"+
							 "</div>"+
							 "<input id=\"pluginRelationParam\" type=\"hidden\" name=\"paramJson\" value='' />" +
							"</form>";  */
							return html;
						}
					},
					setTotal: function (_this, status, type) { //模拟统计数  赞 转发 收藏
						var num = this.getTotal(_this); //计数

						//计数类判断增减
						if (type === "praise" || type === "forward" || type === "collect") {
							if (!status && num === 0) {
								console.error("数据异常！");
								return false;
							}
							else if (!status && num > 0) num--;
							else num++;
						}

						//描述定义
						var descriptor = "";
						switch (type) {
							case "praise":
								descriptor = "赞";
								break;
							case "forward":
								descriptor = "转发";
								break;
							case "collect":
								descriptor = "收藏";
								break;
						}

						//将值推回给隐藏处
						if (num > -1) {
							$("[data-total]", _this).attr("data-total", num);
						}

						//计数类
						if (num === 0) $("[data-total]", _this).text(descriptor);
						else $("[data-total]", _this).text(descriptor + "(" + num + ")");
					},
					getTotal: function (_this) { //计数规则 获取统计数 如果非汉字时直接取记录，汉字时取data-total值
						var num = $("[data-total]", _this).text().match(/\d+/);
						if (num === null) return parseInt($("[data-total]", _this).attr("data-total"));
						return parseInt(num.toString());
					},
					touchWordTips: function (_this, type, action) { //社交状态为取消时 提示
						var t = m;
						//在激活状态时会加入ok类
						if ($(".ok", _this).size() === 0) return false; //如果不为激活状态时不提示
						var value = "";
						if (action === "over") { //此处如果不写会造成空
							switch (type) {
								case "praise" :
									value = "取消赞";
									break;
								case "collect" :
									value = "取消收藏";
									break;
								case "forward" :
									value = "取消转发";
									break;
								case "reply" :
									value = "回复";
									break;
								case "del_reply" :
									value = "删除";
									break;
							}
						} else {
							switch (type) {
								case "praise" :
									value = "赞";
									break;
								case "collect" :
									value = "收藏";
									break;
								case "forward" :
									value = "转发";
									break;
								case "reply" :
									value = "回复";
									break;
								case "del_reply" :
									value = "删除";
									break;
							}
							if (t.common.getTotal(_this) !== 0 && !isNaN(t.common.getTotal(_this))) {
								value = value + "(" + t.common.getTotal(_this) + ")";
							}
						}
						//如果涉及到计数的用第一种如：赞，第二种不计数如：置顶
						$("[data-total]", _this).text(value);
					},
					//初始化数字或文字
					initWordOrNum: function (type, num) {
						var tips = "";
						switch (type) {
							case "praise" :
								tips = "赞";
								break;
							case "collect" :
								tips = "收藏";
								break;
							case "forward" :
								tips = "转发";
								break;
							case "reply" :
								tips = "回复";
								break;
						}
						if (num > 0) return '<span data-total="' + num + '">' + tips + '(' + num + ')</span>';
						return '<span data-total="' + num + '">' + tips + '</span>';
					},
					isValidAddOk: function (key) { //根据状态值来确定是否添加类ok
						if (key) return "ok";
						return "";
					},
					adapter: function (t, kv) {
						//对图片进行循环
						var imgArr = kv.customer_review_insite_attachment, html = "";
						if (imgArr !== undefined && imgArr.length > 0 && imgArr.length < 10) {
							$.each(imgArr, function (i, el) {
								html += "<li class=\"personal_ads ev-picPlace\"><img style='width:150px;height:150px;' src='" + el.attUrl + "'/></li>";
							});
						};
						var criav= kv.customer_review_insite_attachment_video;
						return {
							name: kv.customer_auth.lastName + kv.customer_auth.firstName,
							nameHref: "<a href=\"/pages/personal/home.html?cid=" + kv.customer_auth.customerId + "\">" + kv.customer_auth.lastName + kv.customer_auth.firstName + "</a>",
							time: comm.date.diffDay_one(kv.customer_review.publishTime, comm.date.local_time()),
							content: t.common.wordLen(kv.customer_review.reviewContent, 176),  //字数控制
							logoUrl: "<img src='" + kv.customer_att.logoUrl + "'/>",
							logoUrlHref: "<a href=\"/pages/personal/home.html?cid=" + kv.customer_auth.customerId + "\"><img src='" + kv.customer_att.logoUrl + "'/></a>",
							imgList: html,
							reviewId: kv.customer_review.id,
							reviewStatus: kv.customer_review.reviewStatus,
							customerId: kv.customer_review.customerId,

							parentId: kv.customer_review.parentId,

							//计数
							reviewNum: kv.customer_review.reviewNum,
							collectionNum: kv.customer_review.collectionNum,
							praiseNum: kv.customer_review.upNum,
							reprintNum: kv.customer_review.reprintNum,
							
							//引用与视频
							quote : (function(){
								if(kv.customer_quote.length===0){ return ''; }
								
								var data= kv.customer_quote[0];
								var result = '引用',tempPrefix= '';
								switch(data.refQuoteType){
								case 1: tempPrefix = '视频'; break;
								case 2: tempPrefix = '文库'; break;
								case 4: tempPrefix = '话题'; break;
								case 7: tempPrefix = '病例'; break;
								}
								return result+tempPrefix+ '<a href="'+data.pageStoragePath+'" target="_blank" style="color:#3d84c6;">《'+data.refQuoteName+'》</a>';
							})(),
							videoSrc: (function(){
								console.log("plugin.relation.js")
								if(criav.length>0 && criav[0].qiniuStatus == "2")
									return '<div style="margin-top:12px;width:225px;position:relative;" class="evBgVideo" data-videosrc="'+criav[0].attUrl+'"><img src="//img00.allinmd.cn/meeting/player.png" style="position: absolute;top:0;left:0;z-index:2;cursor:pointer;"><img style="width:225px;height:150px;" src="'+criav[0].attLogoUrl+'"/></div>';
									else if(criav.length>0 && criav[0].qiniuStatus == "1")
										return '<div><img src="//img10.allinmd.cn/default/qiniu225_150.jpg"/></div>';
										else return '';
							})()
						}
					},
					submitToggle: function () {
						var t = m;
						if (t.opts.picPub || t.opts.contentPub) $(".fb_but").addClass("publish-ok");
						else $(".fb_but").removeClass("publish-ok");
					},
					updateParams: function () {
						var t = m;
						var isUploadAttachment = 0, attachmentIds = "";
						if (typeof FileReader != 'undefined') {  // 本地可预览模式
							isUploadAttachment = 1;
						}

						attachmentIds = $(".imgPkList","#pluginRelation").val();
						pvideoIds = $(".pvideoIds", "#pluginRelation").val();  // 视频Id
						
						$(t.el.replyFormParam).val("" +
							"{'reviewType':" + s.type + "," +
							"'refId':" + p.refId + "," +
							"'parentId':" + p.reviewId + "," +
							"'reviewContent':'" + $(t.el.replyContent,"#pluginRelation").val() + "'," +
							"'imageType':5,'refCustomerIdList':'" + (typeof t.opts.cidArr == "undefined" ? "" : t.opts.cidArr) + "'," +
							"'isUploadAttachment':" + isUploadAttachment + "," +
							"'attachmentIds':'" + attachmentIds + "',"+
							"'quoteIds':'" + t.opts.resourceIdArr + "'," +
							"'pvideoIds':'"+ pvideoIds +"'," +
							"'quoteType':'"+ $(".Ev-resourceName>span","#pluginRelation").attr("quotetypeid") +"',"+
							"'quoteName':'"+ $(".Ev-resourceName>span","#pluginRelation").text()+"'}");
					},
					getCount: function (str) { //计数，统计中英转换后一共多少个字符
						var len = 0;
						var str = $.trim(str);
						for (var i = 0; i < str.length; i++) {
							if (str.charCodeAt(i) > 128)len += 2;
							else len += 1;
						}
						return len;
					},
					closeWindow: function (t) {//关闭窗口
						$("#close_reply").on("click", function () {
							comm.LightBox.hide();
							$("#reply_context").remove();
							$("body").removeAttr("style");
						});
					},
					wordLen: function (str, len) {//文字长度
						var count = 0; //计数
						var strings = ""; //拼接字符串
						for (var i = 0; i < str.length; i++) {
							if (str.charCodeAt(i) > 128) count += 2;
							else count += 1;
							if (count > len) {
								strings += "<span>......</span><span style=\"display:none;\">" + str.substr(i) + "</span><span class=\"expandOrShrink\">展开</span>";
								break;
							} else {
								strings += str.substr(i, 1);
							}
						}
						return strings;
					},
					expandOrShrink: function (el) { //展开或收起  防冲突失效
						$(el).on("click", function () { //区分是回复与查看对话

							if ($(this).text() == "展开") {
								$(this).parent().find("span:eq(0)").hide();
								$(this).parent().find("span:eq(1)").show();
								$(this).text("收起");
								_this.common.textareaAct("shrink");

								//取出回复高度 回复框73定高
								if ($(".t_tc_title").text() != "查看对话") {
									$(".t_tc_main").animate({
										height: $("#reply_list").height() + 73 + "px"
									});
								}
								;
							} else {
								$(this).parent().find("span:eq(0)").show();
								$(this).parent().find("span:eq(1)").hide();
								$(this).text("展开");
								_this.common.textareaAct("expand");

								//取出回复高度 回复框178定高
								if ($(".t_tc_title").text() != "查看对话") {
									$(".t_tc_main").animate({
										height: $("#reply_list").height() + 178 + "px"
									});
									$("#doc_abstract").focus();
								}
								;

							}
						});
					},
					showCenter: function () { //居中显示 80%;
						var sysH = $(window).height() * 0.8;
						var windowH = $(".t_tc_main").height();
						if (windowH > sysH) {
							$(".t_tc_main").css({"height": sysH + "px", "overflow-x": "hidden", "overflow-y": "auto"});
						} else {
							$(".t_tc_main").css("height", "auto");
						}

						var horizontal = $(window).width() / 2, vertical = $(window).height() / 2;
						comm.LightBox.show();
						var popupW = $("#reply_context").width() / 2, popupH = $("#reply_context").height() / 2;
						$("#reply_context").css("left", horizontal - popupW).css("top", vertical - popupH);

						$("#reply_context").css("zIndex", comm.LightBox.getZIndex() + 1);

						$("#lightbox").css("background", "#000").css("opacity", "0.7");
						$("body").css("overflow", "hidden");
					},
					clearFormatWord: function (dom) { //处理拷贝DOM结构
						if (dom.indexOf(">......<") > -1) {
							dom = dom.replace("<span>......</span>", "");
							dom = dom.replace("<span style=\"display:none;\"", "");
							dom = dom.replace("<span style=\"display: none;\">......</span><span style=\"display: inline;\">", "");
							dom = dom.replace("<span style=\"display: inline;\">......</span><span style=\"display: none;\">", "");
							dom = dom.replace("</span><span class=\"expandOrShrink cursor\">展开</span>", "");
							dom = dom.replace("</span><span class=\"expandOrShrink cursor\">收起</span>", "");
						}
						return dom;
					},
					textareaAct: function (action) { //文本区域
						if (action == "expand") {
							$("#doc_abstract").animate({height: "97px"});
							$(".video_c_but").fadeIn();
						} else {
							$("#doc_abstract").animate({height: "35px"});
							$(".video_c_but").fadeOut();
						}
					},
					changeTitle: function (src, name) { //改变标题
						var word = "";
						if (src == "chat") {
							word = "查看对话";
						} else {
							word = "回复给<span>" + name + "</span>";
						}
						$("#reply_context .t_tc_title").html(word);
					},
					supportUrl: {
						praise: PC_CALL + "prefer/create/", 	  //赞
						praiseCancel: PC_CALL + "prefer/delete/", //取消赞
						reply: PC_CALL + "review/createReview/",  //回复
						collect: PC_CALL + "collection/create/", //收藏
						collectCancel: PC_CALL + "collection/delete/",//收藏取消
						forward: PC_CALL + "reprint/create/", //转发
						forwardCancel: PC_CALL + "reprint/delete/",//取消转发
						chat: PC_CALL + "review/json_list/", //对话
						delreply: PC_CALL + "review/delete/", //删除
						recover: PC_CALL + "review/recover/",   //恢复
						baseInfo: PC_CALL + "web/user/getWebUser/" //获取当前人信息
					},
					ajaxSend: function (url, params) {
						$.ajax({
							url: url,
							type: "post",
							data: params
						});
						return false;
					},
					ajaxResult: function (url, params) {
						var result = {};
						$.ajax({
							url: url,
							type: "post",
							data: params,
							async: false,
							dataType: "json",
							success: function (data) {
								result = data;
							}
						})
						return result;
					},
					isEmptyObject: function (obj) {
						for (var i in obj) {
							return false;
						}
						return true;
					}
				},
				waterfallPage: function (t, url, paramJson) { //引入瀑布流
					var scrollpage = 1;
					paramJson.pageIndex = function () {
						return scrollpage++;
					};
					$("#reply_context").scrollPaginationT({
						'contentPage': url,
						'contentData': paramJson,
						'scrollTarget': $(window),
						'heightOffset': 0,
						'beforeLoad': function () {
						},
						'afterLoad': function (elementsLoaded) {
						},
						'loader': function (data) {
							if ($(".t_tc_title").text() === "") {
								return false;
							}
							if (!data.responseObject.responseStatus) { //当返回的状态为false
								return false;
							}
							;
							var data = data.responseObject.responseData;
							if (t.common.isEmptyObject(data)) { //当数据为空时
								$("#reply_context").attr('scrollPaginationT', 'disabled');
								return false;
							} else {
								if (data.data_list.length < paramJson.pageSize) {//不为空但小于数据请求数
									$("#reply_context").attr('scrollPaginationT', 'disabled');
								} else {//加载中
									//$("#reply_context").siblings("#EQ_Flag").html(common.TITLE_TEXT.LOAD);
								}
							}
							t.dataCtrl(t, data);
						}
					});
				},
				dataCtrl: function (t, kv) { //瀑布流数据处理
					var html = "<div class=\"reply_space\"></div>";
					$.each(kv.data_list, function (i, el) {
						html += t.common.template.addReply(t.common.adapter(t, el));
					})

					html = $(html).css({"background": "#f8f7fd"});
					$(html).find(".t_tc_left img").css("border", "none");
					$(html).find(".line_place").addClass("reply_bottom_line");

					t.common.expandOrShrink($(html).find(".expandOrShrink"));

					//只对下层社交起作用
					$(html).find(".widget_v2 li").on("click", function () {
						t.controller.events[$(this).find("div").attr("class").substr(8)](t, this, "chatDown");
					});
					
					$(html).find(".evBgVideo").on("click", function(){
						//清除弹出的对话列表
						$("#reply_context").remove();
						$("body").removeAttr("style");
						
						module.backgroundVideo({videoSrc:$(this).attr("data-videosrc")});
					});

					$("#reply_list").append(html).find(".article_report").remove();;

					$(".reply_space").removeAttr("style");

					//重新计算高度
					var sysH = $(window).height() * 0.8;
					var windowH = $(".t_tc_main").height();
					if (windowH > sysH) {
						$(".t_tc_main").css({"overflow-x": "hidden", "overflow-y": "auto"});
						$(".t_tc_main").animate({height: sysH + "px"}, 500);
					} else {
						$(".t_tc_main").css("height", "auto");
					}
					//－－－

				}

			}

			m.init();

			return this;
		}
	});

})(jQuery);