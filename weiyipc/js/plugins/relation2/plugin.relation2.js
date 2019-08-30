/**
 * 功能描述：列表中的社交关系 现用场景：个人主页、个人首页
 * 使用方法：$("el").relation2({})
 *                    必需参数：参照下方otps 基础数据
 *
 * 注意事件：
 * 引入来源：relation2.review.js relation2.upstairs.js relation2.downstairs.js plugin.top-tip.js
 * 权限控制 user.login({})  提示：
 *
 * Created by QiaoLiang on 2015-04-02
 */

;(function ($) {
	$.fn.relation2 = function (obj) {
		var controller = {
			path: {
				reprint: PC_CALL + "reprint/create/",
				reprintC: PC_CALL + "reprint/delete/",
				praise: PC_CALL + "prefer/create/",
				praiseC: PC_CALL + "prefer/delete/",
				collection: PC_CALL + "collection/create/",
				collectionC: PC_CALL + "collection/delete/",

				//回复
				reviewC: PC_CALL + "review/delete/",
				recoverReview: PC_CALL + "review/recover/",

				//文库
				docC: PC_CALL + "customer/doc/delete/",
				docRecover: PC_CALL + "customer/doc/recover/",
				docGoTop: PC_CALL + "customer/doc/setFirst/",
				docGoTopC: PC_CALL + "customer/doc/removeFirst/",

				//视频
				videoC: PC_CALL + "customer/video/delete/",
				videoRecover: PC_CALL + "customer/video/recover/",
				videoGoTop: PC_CALL + "customer/video/setFirst/",
				videoGoTopC: PC_CALL + "customer/video/removeFirst/",

				//病例
				cazeC: PC_CALL + "case_baseinfo/delete/",
				cazeRecover: PC_CALL + "case_baseinfo/recover/",
				cazeGoTop: PC_CALL + "case_baseinfo/setFirst/",
				cazeGoTopC: PC_CALL + "case_baseinfo/removeFirst/",

				//话题
				topicC: PC_CALL + "topic/baseinfo/delete/",
				topicRecover: PC_CALL + "topic/baseinfo/recover/",
				topicGoTop: PC_CALL + "topic/baseinfo/setFirst/",
				topicGoTopC: PC_CALL + "topic/baseinfo/removeFirst/",
			},
			opts: {
				//TODO:位置
				_this: null, //源元素
				faceNum: 7, //头像数目
				//showreviewList : "off", //是否显示回复列表，on代表显示 未启用，未做处理
				reviewType: ResouceType.review, //回复类型
				attUseFlag: UseFlag.c, //图片规格
				dataFlag: 2, //
				callDialogueSource: null, //查看对话是否显示，根据这个调用来源
				userId: parseInt($("#sesCustomerId").val()), //当前人id从header.jsp中取的

				//基础数据
				callSource: null, //调用插件来源 refCidrefParentCId
				reprintNum: 0, //转发数
				reviewNum: 0, //回复数
				collectionNum: 0, //收藏数
				praiseNum: 0, //赞数
				browseNum: 0, //浏览数
				praiseVaild: 0, //赞状态
				reprintValid: 0,//转发状态
				headerValid: 0, //置顶状态
				parentReviewId: 0, //回复的父id
				collectionValid: 0,//收藏状态
				reviewPrivateType: 0,//回复的类型
				selector: null, //当前列表选择器
				trendsId: 0, //动态主键id
				reviewId: 76, //回复的主键id 76 119047
				opId: 0, //特指转发还是回复还是其它,0-发布、1-回应、2-转发、3-收藏、4-分享、5-赞
				refParentCid: 0, //被转发资源的作者id
				refCid: 1397640872703, //资源人id
				refType: 2, //资源类型
				refId: 1398583718434, //资源id
				logoUrl: "//img00.allinmd.cn/detail/user_img.png", //客户头像 在此场景中未用到
				nickname: "可可西里", //对方的称呼
				userLogoUrl: "//img00.allinmd.cn/detail/user_img.png" //当前人的头像
			},
			template: {
				configOperation: function () { //配置操作
					var t = controller;
					var kv = t.opts;
					var isSelf = t.opts.refCid == t.opts.userId; //

					//如果为动态调用
					var html = '<ul class="plugin-relation2">' +
						'<li class="cursor" data-event="reprint"><div class="reprint"><span><a href="javascript:;" class="' + this.valid(kv.reprintValid) + '" title="转发" alt="转发"></a></span>' + t.comm.initWordOrNum("reprint", true, kv.reprintNum) + '</div></li>' +
						this.review(kv.reviewNum) +
						'<li class="cursor" data-event="collection"><div class="collection"><span><a href="javascript:;" class="' + this.valid(kv.collectionValid) + '" title="收藏" alt="收藏"></a></span>' + t.comm.initWordOrNum("collection", true, kv.collectionNum) + '</div></li>' +
						'<div class="cursor ev-caseEdit" data-event="caseEdit" caseId="' + t.opts.refId + '"><div class="bianji"><span><a href="javascript:;" title="编辑" alt="编辑"></a></span><span>编辑</span></div></div>' +
						'<div class="cursor ev-docEdit" data-event="docEdit" docId="' + t.opts.refId + '"><div class="bianji"><span><a href="javascript:;" title="编辑" alt="编辑"></a></span><span>编辑</span></div></div>' +
						'<li class="cursor" data-event="del_review"><div class="shanchu"><span><a href="javascript:;" title="删除" alt="删除"></a></span><span>删除</span></div></li>' +
						'<li class="cursor" data-event="praise"><div class="praise"><span><a href="javascript:;" class="' + this.valid(kv.praiseVaild) + '" title="赞" alt="赞"></a></span>' + t.comm.initWordOrNum("praise", true, kv.praiseNum) + '</div></li>' +
						'<li class="cursor" data-event="goTop"><div class="zd"><span><a href="javascript:;" class="' + this.valid(kv.headerValid, "topic") + '" title="置顶" alt="置顶"></a></span><span>置顶</span></div></li>' +
						this.browse(kv) + this.dialogue();

					var createElement = $(html);

					//动态上下层回复 不存在编辑和置顶					 
					if (t.opts.callSource === "trends" || t.opts.callSource === "trendsMe" || t.opts.callSource === "reviewMe" || t.opts.callDialogueSource == "upstairs" || t.opts.callDialogueSource === "downstairs") { //只针对动态;
						//动态不存在置顶
						createElement.find("[data-event=goTop]").remove();

						//本人时并且是非转发删除，非本人是赞
						if (isSelf && t.opts.opId != 2 && t.opts.callSource !== "reviewMe") createElement.find("[data-event=praise]").remove();
						else createElement.find("[data-event=del_review]").remove();

						//动态时是自己的信息，摘掉赞与收藏 并且是非转发的
						if ((t.opts.callSource === "trends" || t.opts.callSource === "trendsMe") && isSelf && t.opts.opId != 2) {
							createElement.find("[data-event=praise]").remove();
							createElement.find("[data-event=collection]").remove();
						}

						if (isSelf) { //本人时
							var tempType = t.opts.refType;
							if (tempType === ResouceType.caze) createElement.find("[data-event=docEdit]").remove();
							else if (tempType === ResouceType.doc) createElement.find("[data-event=caseEdit]").remove();
							else {
								createElement.find("[data-event=docEdit]").remove();
								createElement.find("[data-event=caseEdit]").remove();
							}
						} else {
							createElement.find("[data-event=docEdit]").remove();
							createElement.find("[data-event=caseEdit]").remove();
						}

						//如果是转发的，但是转发的是自己的资源时，也摘掉赞与收藏 这时候取被转发人的客户id与本人的sessionID比对
						if (t.opts.opId == 2 && t.opts.refParentCid == t.opts.userId) {
							createElement.find("[data-event=praise]").remove();
							createElement.find("[data-event=collection]").remove();
						}

						//如果是转发的，但是转发的不是自己的资源时，摘掉编辑
						if (t.opts.opId == 2 && t.opts.refParentCid != t.opts.userId) {
							createElement.find("[data-event=docEdit]").remove();
							createElement.find("[data-event=caseEdit]").remove();
						}

						return createElement;
					}

					//非动态时其它场景－－>根据类型
					switch (t.opts.callSource) {
						case "remind" : // 提醒
							createElement.find("[data-event=caseEdit]").remove();
							createElement.find("[data-event=docEdit]").remove();
							createElement.find("[data-event=goTop]").remove();
							createElement.find("[data-event=del_review]").remove();
							if (t.opts.opId == 2 && t.opts.refParentCid == t.opts.refCid) {
								createElement.find("[data-event=praise]").remove();
								createElement.find("[data-event=collection]").remove();
							}
						case "video" :   //. 视频
							if (isSelf) {
								createElement.find("[data-event=praise]").remove();
								createElement.find("[data-event=collection]").remove();
								createElement.find("[data-event=caseEdit]").remove();
								createElement.find("[data-event=docEdit]").remove();
							} else {
								createElement.find("[data-event=caseEdit]").remove();
								createElement.find("[data-event=docEdit]").remove();
								createElement.find("[data-event=goTop]").remove();
								createElement.find("[data-event=del_review]").remove();
							}
							break;
						case "doc" :   //. 文库
							if (isSelf) {
								createElement.find("[data-event=praise]").remove();
								createElement.find("[data-event=collection]").remove();
								createElement.find("[data-event=caseEdit]").remove();
							} else {
								createElement.find("[data-event=caseEdit]").remove();
								createElement.find("[data-event=docEdit]").remove();
								createElement.find("[data-event=goTop]").remove();
								createElement.find("[data-event=del_review]").remove();
							}
							break;
						case "topic" :   //. 话题
							if (isSelf) {
								createElement.find("[data-event=praise]").remove();
								createElement.find("[data-event=collection]").remove();
								createElement.find("[data-event=caseEdit]").remove();
								createElement.find("[data-event=docEdit]").remove();
							} else {
								createElement.find("[data-event=caseEdit]").remove();
								createElement.find("[data-event=docEdit]").remove();
								createElement.find("[data-event=goTop]").remove();
								createElement.find("[data-event=del_review]").remove();
							}
							break;
						case "caze" :   //. 病例
							if (isSelf) {
								createElement.find("[data-event=praise]").remove();
								createElement.find("[data-event=collection]").remove();
								createElement.find("[data-event=docEdit]").remove();
							} else {
								createElement.find("[data-event=caseEdit]").remove();
								createElement.find("[data-event=docEdit]").remove();
								createElement.find("[data-event=goTop]").remove();
								createElement.find("[data-event=del_review]").remove();
							}
							break;
						case "review" :   //. 回复/回应/回复
							if (isSelf) {
								createElement.find("[data-event=praise]").remove();
								createElement.find("[data-event=collection]").remove();
								createElement.find("[data-event=caseEdit]").remove();
								createElement.find("[data-event=docEdit]").remove();
								createElement.find("[data-event=goTop]").remove();
							} else {
								createElement.find("[data-event=caseEdit]").remove();
								createElement.find("[data-event=docEdit]").remove();
								createElement.find("[data-event=goTop]").remove();
								createElement.find("[data-event=del_review]").remove();
							}
							break;
						case "collection" : // 收藏	
							if (isSelf) {
								createElement.find("[data-event=praise]").remove();
								createElement.find("[data-event=caseEdit]").remove();
								createElement.find("[data-event=docEdit]").remove();
								createElement.find("[data-event=goTop]").remove();
								createElement.find("[data-event=del_review]").remove();
							} else {
								createElement.find("[data-event=caseEdit]").remove();
								createElement.find("[data-event=docEdit]").remove();
								createElement.find("[data-event=goTop]").remove();
								createElement.find("[data-event=del_review]").remove();
							}
							break;
						case "reprint" : //转发
							if (isSelf) {
								createElement.find("[data-event=praise]").remove();
								createElement.find("[data-event=caseEdit]").remove();
								createElement.find("[data-event=docEdit]").remove();
								createElement.find("[data-event=goTop]").remove();
								createElement.find("[data-event=del_review]").remove();
							} else {
								createElement.find("[data-event=caseEdit]").remove();
								createElement.find("[data-event=docEdit]").remove();
								createElement.find("[data-event=goTop]").remove();
								createElement.find("[data-event=del_review]").remove();
							}
							break;
						case "relation" :  //与他相关
							createElement.find("[data-event=caseEdit]").remove();
							createElement.find("[data-event=docEdit]").remove();
							createElement.find("[data-event=goTop]").remove();
							createElement.find("[data-event=del_review]").remove();
							break;
					}

					return createElement;
				},
				dialogue: function () {
					var t = controller;
					//非动态时并且是回复的情况下
					if (t.opts.callDialogueSource === null && t.opts.refType === ResouceType.review
						&& (t.opts.parentReviewId > 0 || t.opts.reviewNum > 0)
						&& t.opts.callSource !== "trends" && t.opts.callSource !== "trendsMe") //非我的动态与我关注的动态
						return '<div class="ck_yw dialogue cursor">查看对话</div></ul>';
					return "</ul>";
				},
				review: function (reviewNum) { //辅助回复 回复有两种形式，根据调用来源区分：一种是非弹层，一种弹层
					var t = controller;
					if (t.opts.callDialogueSource === null)
						return '<li class="cursor" data-event="review"><div class="review"><span><a href="javascript:;" title="回复" alt="回复"></a></span>' + t.comm.initWordOrNum("review", true, reviewNum) + '</div></li>';
					return '<li class="cursor" data-event="popupReview"><div class="review"><span><a href="javascript:;" title="回复" alt="回复"></a></span>' + t.comm.initWordOrNum("review", true, reviewNum) + '</div></li>';
				},
				valid: function (key, ss) { //是否赞转收藏 置顶过
					if (key) return "ok";
					return "";
				},
				browse: function (kv) { //为资源时显示浏览数
					if (kv.refType != ResouceType.review && kv.callDialogueSource === null) {
						return "";//'<li>'+kv.browseNum+'次浏览</li>';
					}
					return "";
				}
			},
			init: function (obj, _this) {
				var t = this;
				t.opts._this = _this;
				$.extend(t.opts, obj);
				t.comm.personalOperation();
			},
			dataCtrl: function (type, kv, status, _this) { //事件类型 值 触发状态 触发的元素 只处理赞、转发、收藏头像列表
				var t = this;
				//元素名称来自module.list-template
				$(".faceList-warp", $(_this).parents(t.opts.selector)).faceList({
					num: t.comm.getTotal(_this),
					type: type,
					action: status,
					liNum: t.opts.faceNum,
					list: kv
				});

				t.opts.dialogueCallback && t.opts.dialogueCallback(); //调整对话线
			},
			//事件区
			events: {
				reprint: function (t, _this, status, params) {
					//参数1 url, 2ajax参数 3类型 4,触发状态 5触发的元素
					if (status) t.comm.ajaxSend("reprint", params, "reprint", status, _this);
					else t.comm.ajaxSend("reprintC", params, "reprint", status, _this);

				},
				collection: function (t, _this, status, params) {
					if (status) t.comm.ajaxSend("collection", params, "collection", status, _this);
					else t.comm.ajaxSend("collectionC", params, "collection", status, _this);
				},
				praise: function (t, _this, status, params) {
					if (status) t.comm.ajaxSend("praise", params, "praise", status, _this);
					else t.comm.ajaxSend("praiseC", params, "praise", status, _this);
				},
				goTop: function (t, _this, status) { //置顶 区分类型
					var url = "", params = {};
					switch (t.opts.refType) {
						case 1: //视频
							params = {videoId: t.opts.refId};
							if (status) url = t.path.videoGoTop;
							else url = t.path.videoGoTopC;
							break;
						case 2: //文章
							params = {docId: t.opts.refId};
							if (status) url = t.path.docGoTop;
							else url = t.path.docGoTopC;
							break;
						case 4: //话题
							params = {topicId: t.opts.refId};
							if (status) url = t.path.topicGoTop;
							else url = t.path.topicGoTopC;
							break;
						case 7: //病例
							params = {caseId: t.opts.refId};
							if (status) url = t.path.cazeGoTop;
							else url = t.path.cazeGoTopC;
							break;
					}

					if (status) { //置顶
						var win = function () {
							t.comm.goTop(_this); //置顶
							$.topTip({mark: "success", showTime: 3, content: "置顶成功！"});
						};

						var warn = function () {
							$.topTip({mark: "warn", showTime: 3, content: "置顶失败！"});
						};

					} else { //取消置顶
						var win = function () {
							t.comm.cancelGoTop(_this);//取消置顶
							$.topTip({mark: "success", showTime: 3, content: "取消置顶成功！"});
						};

						var warn = function () {
							$.topTip({mark: "warn", showTime: 3, content: "取消置顶失败！"});
						};
					}

					t.comm.onlyAjax(url, params, win, warn);
				},
				//TODO : 初始化时值状态得取出来 
				del_review: function (t, _this) { //回复 区分类型 有一种情况，删除最后一条数据
					var url = "", params = {};
					switch (t.opts.refType) {
						case 1: //视频
							url = t.path.videoC;
							params = {videoId: t.opts.refId};
							break;
						case 2: //文章
							url = t.path.docC;
							params = {docId: t.opts.refId};
							break;
						case 4: //话题
							url = t.path.topicC;
							params = {topicId: t.opts.refId};
							break;
						case 7: //病例
							url = t.path.cazeC;
							params = {caseId: t.opts.refId};
							break;
						case 8: //回复
							url = t.path.reviewC;
							params.paramJson = $.toJSON({id: t.opts.reviewId, trendsId: t.opts.trendsId});
							break;
					}

					var win = function (Type) { //触发类型
						//暂时采用刷新方式
						$.topTip({
							mark: "success",
							content: "删除成功！<span class=\"recoverData\" style=\"cursor:pointer;\">需要恢复?</span>",
							callback: function () {
								t.events.del_recover(_this); //调用恢复

								$("[data-events=" + t.opts.callSource + "]").click();
							}
						});

//						$.topTip({
//							mark:"success",
//							content:"删除成功！<span class=\"recoverData\" style=\"cursor:pointer;\">需要恢复?</span>",
//							callback : function(){
//								t.events.del_recover(_this); //调用恢复
//								$(_this).parents("li").animate({ //执行删除动效
//									height:0
//								},function(){
//									$(_this).parents("li").hide().css("height","");
//								})
//							}
//						})
					};

					var warn = function () {
						$.topTip({mark: "warn", content: "删除失败，请稍后再试！"})
					}
					t.comm.onlyAjax(url, params, win, warn);
				},
				del_recover: function (_this) { //有一种情况，恢复最后一条数据
					var t = controller;
					var url = "", params = {};
					$(".recoverData").off("click").on("click", function () {
						switch (t.opts.refType) {
							case 1: //视频
								url = t.path.videoRecover;
								params = {videoId: t.opts.refId};
								break;
							case 2: //文章
								url = t.path.docRecover;
								params = {docId: t.opts.refId};
								break;
							case 4: //话题
								url = t.path.topicRecover;
								params = {topicId: t.opts.refId};
								break;
							case 7: //病例
								url = t.path.cazeRecover;
								params = {caseId: t.opts.refId};
								break;
							case 8: //回复
								url = t.path.recoverReview;
								params.paramJson = $.toJSON({id: t.opts.reviewId, trendsId: t.opts.trendsId});
								break;
						}
						;

						var win = function () {
							$.topTip({
								mark: "success", content: "恢复成功！",
								callback: function () {
									$("[data-events=" + t.opts.callSource + "]").click();
								}
							});
						};

						var warn = function () {
							$.topTip({mark: "warn", content: "恢复失败！"})
						};
						t.comm.onlyAjax(url, params, win, warn);

						//恢复
						$(_this).parents("li").show("fade");
					});
				},
				edit: function (t, _this, status) { //编辑 区分类型
					//排除由外部处理
				},
				popupReview: function (t, _this, status) {    					//取出当前人头像名称及时间内容等信息 参照module.list-template元素
					var liInfo = $($(_this).parents("li").get(0));

					plugin.popupReview({ //TODO; 未取标题
						selector: "body",
						refId: t.opts.refId,
						reviewType: t.opts.refType,
						title: liInfo.find(".ev-title").text(),
						logoUrlHref: liInfo.find(".ev-logoUrlPath").html(),
						name: liInfo.find(".ev-nickname").html(),
						time: liInfo.find(".ev-time").html(),
						content: liInfo.find(".ev-content").prop("outerHTML"),
						reviewId: t.opts.reviewId
					});
				},
				review: function (t, _this, status) {
					//逻辑：先判断是否存在回复列表(查话对话也会激活回复列表)
					//回复只触发一次打开之后,之后再做就是打开的动作
					var triggerOne = $(_this).attr("data-show");
					if (triggerOne == "true") {
						$(_this).parents(t.opts.selector).find("textarea").focus().click();
						return false;
					}

					if (status && triggerOne === undefined) {
						$(_this).attr("data-show", true);

						//给顶部底部加高
						var liLen = $(_this).parents("li").parent().children("li").length;
						if ($(_this).parents("li").index() === 0) {
							$(_this).parents("li").addClass("plgin-relation2-li-margin20-onlyTop");
						} else if ($(_this).parents("li").index() === liLen - 1) {
							//$(_this).parents("li").parent().find("li:eq("+(liLen-2)+")").addClass("plgin-relation2-li-margin20-currUpAddBottomLine");
							$(_this).parents("li").addClass("plgin-relation2-li-margin20-onlyBottom");
						} else {
							//$(_this).parents("li").parent().find("li:eq("+($(_this).parents("li").index()-1)+")").addClass("plgin-relation2-li-margin20-currUpAddBottomLine");
							$(_this).parents("li").addClass("plgin-relation2-li-margin20");
						}

						//转义类型：针对动态回复时有所不同
						var reviewType = t.opts.refType;
						if (t.opts.refType === ResouceType.review) {
							reviewType = t.opts.reviewPrivateType;
						}

						//装载回复框
						support.reviewForm({
							selector: $(_this).parents(t.opts.selector),
							refId: t.opts.refId,
							trendsId: t.opts.trendsId,
							logoUrl: t.opts.userLogoUrl,
							name: t.opts.nickname,
							parentId: t.opts.reviewId,
							type: reviewType,
							isFocus: true
						});

						//装载下层回复列表
						support.downstairs({
							selector: t.opts.selector,
							parentEle: $(_this).parents("li"), //此处需要最高父级，下层
							refType: reviewType,
							refId: t.opts.refId,
							reviewId: t.opts.reviewId
						});
					}
				},
				dialogue: function (t, _this, status) { //查看对话
					//逻辑：先判断是否存在回复，如果存在只加载上层，不存在则上下及回复框全加载
					if (status) {
						$(".evBorder", $(_this).parents(t.opts.selector)).addClass("p_border_white");
						$(_this).addClass("dialogue-shrink").text("收起对话"); //切换状态

						//转义类型：针对动态回复时有所不同
						var reviewType = t.opts.refType;
						if (t.opts.refType === ResouceType.review) {
							reviewType = t.opts.reviewPrivateType;
						}

						//给顶部底部加高
						var liLen = $(_this).parents("li").parent().children("li").length;
						if ($(_this).parents("li").index() === 0) {
							$(_this).parents("li").addClass("plgin-relation2-li-margin20-onlyTop");
						} else if ($(_this).parents("li").index() === liLen - 1) {
							$(_this).parents("li").addClass("plgin-relation2-li-margin20-onlyBottom");
						} else {
							$(_this).parents("li").addClass("plgin-relation2-li-margin20");
						}

						//事实上：只要回复框不存在才去装载回复和下层
						if ($(_this).parents(t.opts.selector).find("textarea").length === 0) {
							//为了方便回复处激活联动，给回复赋值
							$(_this).parent().find("[data-event=review]").attr("data-show", true);

							//装载回复框
							support.reviewForm({
								selector: $(_this).parents(t.opts.selector),
								refId: t.opts.refId,
								trendsId: t.opts.trendsId,
								logoUrl: t.opts.userLogoUrl,
								name: t.opts.nickname,
								parentId: t.opts.reviewId,
								type: reviewType
								//isFocus : true 是否获取焦点
							});

							//装载下层回复列表
							support.downstairs({
								selector: t.opts.selector,
								parentEle: $(_this).parents("li"), //此处需要最高父级，下层
								refType: reviewType,
								refId: t.opts.refId,
								reviewId: t.opts.reviewId
							});
						}

						//复制当前标题到回复最顶一条加入标题 并移除当前标题
						var currLi = $(_this).parents("li").find(".evTitle");
						var cloneTitle = currLi.clone();
						currLi.remove();

						//装载上层回复列表 将上方传递的标题传入上层结构
						support.upstairs({
							selector: t.opts.selector,
							parentEle: $(_this).parents("li"), //此处需要最高父级，上层
							refType: reviewType,
							refId: t.opts.refId,
							reviewId: t.opts.reviewId,
							firstTitle: cloneTitle
						});

					} else {
						//从上层结构取回标题
						var getUpstairsTitle = $($(".upstairs").get(0)).find(".evTitle").clone();
						$(".ev-TitlePlaceDown", $(_this).parents(t.opts.selector)).after(getUpstairsTitle);

						$(".evBorder", $(_this).parents(t.opts.selector)).removeClass("p_border_white");
						$(_this).removeClass("dialogue-shrink").text("查看对话");
						//移除回复状态，恢复初始化
						$(_this).parent().find("[data-event=review]").removeAttr("data-show");
						//删除回复
						support.reviewForm({destroy: true, parentEle: $(_this).parents(t.opts.selector)});
						//删除上层
						support.upstairs({destroy: true, parentEle: $(_this).parents("li")});
						//删除下层
						support.downstairs({destroy: true, parentEle: $(_this).parents("li")});

						//移除加高
						var liLen = $(_this).parents("li").parent().children("li").length;
						if ($(_this).parents("li").index() === 0) {
							$(_this).parents("li").removeClass("plgin-relation2-li-margin20-onlyTop");
						} else if ($(_this).parents("li").index() === liLen - 1) {
							$(_this).parents("li").removeClass("plgin-relation2-li-margin20-onlyBottom");
						} else {
							$(_this).parents("li").removeClass("plgin-relation2-li-margin20");
						}
					}
				}
			},
			//方法区
			comm: {
				ajaxSend: function (url, params, type, status, _this) { //只发送不处理
					var t = controller;
					$.ajax({
						url: t.path[url],
						type: "POST",
						data: params,
						success: function (data) {
							if (data.responseObject.responseStatus)
								t.dataCtrl(type, data.responseObject.responseData.data_list, status, _this);
						}
					})
				},
				onlyAjax: function (url, params, callback, callbackError) {
					$.ajax({
						url: url,
						type: "POST",
						data: params,
						success: function (data) {
							if (data.responseObject.responseStatus) callback && callback();
							else callbackError && callbackError();
						},
						error: function () {
							callbackError && callbackError();
						}
					});
				},
				goTop: function (_this) { //置顶效果
					var t = controller;
					var _this = $(_this).parents("li");
					_this.animate({
						height: 0
					}, function () {
						_this.parent().prepend(_this);
						_this.css("height", "auto");
					})

					//记录位置
					//_this.attr("data-index",_this.index());
				},
				cancelGoTop: function (_this) {//取消置顶
					var t = controller;
					$("[data-events=" + t.opts.callSource + "]").click();

//					var index = parseInt($(_this).parents("li").attr("data-index"));
//					var _this = $(_this).parents("li");
//					
//					_this.animate({
//						height:0
//					},function(){
//						if(index===0) _this.parent().prepend(_this);
//						else _this.parent().children("li:eq("+index+")").after(_this);
//						_this.css("height","auto");
//					})
				},
				setTotal: function (_this, status, type, descriptor) { //模拟统计数
					var num = this.getTotal(_this); //计数

					//计数类判断增减
					if (type === "praise" || type === "reprint" || type === "collection") {
						if (!status && num === 0) {
							num = 0
						}
						else if (!status && num > 0) num--;
						else num++;
					}

					//计数类
					$("[data-total]", _this).attr("data-total", num).text(descriptor + "(" + num + ")");
					if (num === 0) $("[data-total]", _this).text(descriptor);

					//非计数类
					if (isNaN(num)) $("span:eq(1)", _this).text(descriptor);
				},
				getTotal: function (_this) { //计数规则 获取统计数 如果非汉字时直接取记录，汉字时取data-total值
					var num = $("[data-total]", _this).text().match(/\d+/);
					if (num === null) return parseInt($("[data-total]", _this).attr("data-total"));
					return parseInt(num.toString());
				},
				touchWordTips: function (_this, action) { //社交状态为取消时 提示
					//在激活状态时会加入ok类
					if ($(".ok", _this).size() === 0) return false; //如果不为激活状态时不提示
					var type = $(_this).attr("data-event");
					var value = "";
					if (action === "over") { //此处如果不写会造成空
						switch (type) {
							case "praise" :
								value = "取消赞";
								break;
							case "collection" :
								value = "取消收藏";
								break;
							case "reprint" :
								value = "取消转发";
								break;
							case "review" :
								value = "回复";
								break;
							case "popupreview" :
								value = "回复";
								break;
							case "goTop" :
								value = "取消置顶";
								break;
							case "del_review" :
								value = "删除";
								break;
							case "edit" :
								value = "编辑";
								break;
						}
					} else { //回复的激活状态不代表＋1,所以还是要判断当前是否为0
						var tempWord = "";
						switch (type) {
							case "praise" :
								tempWord = "赞";
								break;
							case "collection" :
								tempWord = "收藏";
								break;
							case "reprint" :
								tempWord = "转发";
								break;
							case "review" :
								tempWord = "回复";
								break;
							case "popupreview" :
								tempWord = "回复";
								break;
							case "goTop" :
								tempWord = "置顶";
								break;
							case "del_review" :
								tempWord = "删除";
								break;
							case "edit" :
								tempWord = "编辑";
								break;
						}
						//一种是类似回复不需要移动上去显示取消回复，一种类似置顶未加过数字
						if (this.getTotal(_this) === 0 || isNaN(this.getTotal(_this))) {
							value = tempWord;
						} else {
							value = tempWord + "(" + this.getTotal(_this) + ")";
						}
					}

					//如果涉及到计数的用第一种如：赞，第二种不计数如：置顶
					if ($("[data-total]", _this).length > 0) $("[data-total]", _this).text(value);
					else $(_this).find("span:eq(1)").text(value);
				},
				initWordOrNum: function (type, status, kv) { //初始化样式，社交统计数等于0时显示文字 status为取消时显示文字 1类型 2动作 3键值
					var tips = "";
					switch (type) {
						case "praise" :
							tips = "赞";
							break;
						case "collection" :
							tips = "收藏";
							break;
						case "reprint" :
							tips = "转发";
							break;
						case "review" :
							tips = "回复";
							break;
						case "popupreview" :
							tips = "回复";
							break;
						case "goTop" :
							tips = "置顶";
							break;
						case "edit" :
							tips = "编辑";
							break;
					}

					if (kv > 0 && status) return '<span data-total="' + kv + '">' + tips + '(' + kv + ')</span>';
					if (kv === 0 && !status) {
						console.log("异常报告：动作处理过数据依然是0..");
						return '<span data-total="+' + kv + '">' + tips + '(' + kv + ')</span>';
					}
					;

					return '<span data-total="' + kv + '">' + tips + '</span>';
				},
				personalOperation: function () { //非本人时社交操作
					var t = controller;

					$(t.opts._this).append(t.template.configOperation()).find("li").on("mouseover", function () {
						t.comm.touchWordTips(this, "over");
					}).on("mouseout", function () {
						t.comm.touchWordTips(this, "out");
					}).on("click", function () {
						var _this = this;


						var type = $(_this).attr("data-event");

						//根据样式判断触发状态
						var isOk = -1;
						if ($("a", _this).attr("class") !== undefined) isOk = $("a", _this).attr("class").indexOf("ok");

						//触发状态及添加样式
						var status = false;
						if (isOk > -1) $("a", _this).removeClass("ok");
						else {
							status = true;
							$("a", _this).addClass("ok");
						}

						//回复时refId为reviewId
						var refId = t.opts.refId;
						if (t.opts.refType === ResouceType.review) {
							refId = t.opts.reviewId;
						}

						//特指转发还是回复还是其它,0-发布、1-回应、2-转发、3-收藏、4-分享、5-赞
						var cid = t.opts.refCid;
						if (parseInt(t.opts.opId) === 2) cid = t.opts.refParentCid;

						//定制参数
						var params = {};
						params.paramJson = {
							dataFlag: t.opts.dataFlag,
							attUseFlag: t.opts.attUseFlag,
							refId: refId,
							trendsId: t.opts.trendsId,
							logoUseFlag: AttUseFlag.c,
							refCustomerId: cid,
							pageIndex: 1,
							pageSize: t.opts.faceNum
						};

						//描述
						var descriptor = "";
						var scene;
						switch (type) {
							case "praise" : //赞
								params.paramJson.usefulType = t.opts.refType;
								descriptor = "赞";
								scene = privilegeSceneConst.eSceneTypePraiseResourse;
								break;
							case "reprint" : //转发
								params.paramJson.reprintType = t.opts.refType;
								descriptor = "转发";
								scene = privilegeSceneConst.eSceneTypeTransmit;
								break;
							case "collection" : //收藏
								params.paramJson.collectionType = t.opts.refType;
								descriptor = "收藏";
								scene = privilegeSceneConst.eSceneTypeCollect;
								break;
							case "review" : //回复
								descriptor = "回复";
								scene = privilegeSceneConst.eSceneTypeReview;
								break;
							case "popupreview" :  //弹层回复
								descriptor = "回复";
								scene = privilegeSceneConst.eSceneTypeReview;
								break;
							case "del_review" : //删除
								descriptor = "删除";
								scene = privilegeSceneConst.eSceneTypeLogin;
								break;
							case "goTop" : //置顶
								descriptor = "置顶";
								scene = privilegeSceneConst.eSceneTypeLogin;
								break;
							case "edit" : //编辑
								descriptor = "编辑";
								scene = privilegeSceneConst.eSceneTypeLogin;
								break;
						}

						params.paramJson = $.toJSON(params.paramJson);

						t.comm.setTotal(_this, status, type, descriptor);

						user.login({
							callback: function () {
								t.events[$(_this).attr("data-event")](t, _this, status, params);
							},
							scene: scene // TODO: 需要将一个操作拆分成三种操作关系
						});


					}).siblings(".dialogue").toggle(function () {
						t.events.dialogue(t, this, true);
					}, function () {
						t.events.dialogue(t, this, false);
					});
				}

			}


		}

		controller.init(obj, this);
		return this;
	}
})(jQuery);



