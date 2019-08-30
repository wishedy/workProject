/**
 * 功能描述：回复表单模块 含添加图片及提醒谁看
 * 使用方法：module.replyForm(Obj);
 *                  必要参数：obj.selector 为当前模块摆放到的位置
 *                                    obj.outWidth 外框宽度
 *                                    obj.inputWidth 文本框宽度
 *                                        obj.type 资源类型
 *                                        obj.logoUrl 当前人头像
 *                                        obj.refid  为当前资源的ID
 *                                        obj.authId 为当前资源作者id
 *                                        obj.name 为当前人的称呼
 *                                        obj.scene  默认或1为当前资源，2为回复列表
 *
 *                            callback 回调改变UI
 *
 * 注意事件：
 * 引入来源：plugin.add-removeable-group-pic.js与plugin.reply-remind.js plugin.top-tip.js  作用：添加图片及提醒谁看 提示
 *
 * Created by QiaoLiang on 2015-02-28.
 */
module.replyForm = function (Obj) {
	if(!module.replyForm.qiniuUploaderId){
		module.replyForm.qiniuUploaderId=1;
	}else{
		module.replyForm.qiniuUploaderId++;
	}

	var controller = {
		//如果涉及翻页之类，可配置参数，比如：翻页数量、播放时长、初始化位置等
		config: {pageSize: 4}, //翻页数量

        //如果涉及地址第一行必须写固定名字：path 定义地址
        path: {
            publish: PC_CALL+"review/createReview/" //发布回复
        },

		//元素
		el: {
			outPlugin: ".upload_pic,.video_c_bf",  //外部插件元素 主要是用于显示隐藏
			textarea: ".evModuleReplyForm",  //文本域
			submit: ".evModuleReplySubmit", //提交发布
			cancel: ".evModuleReplyCancel", //取消发布
			form: ".moduleReplyForm", //表单名称
			formParams: ".replyFormParam" //hidden掉的组装参数
		},

		//初始化时第一执行方法，固定格式
		init: function (Obj) {
			var t = this;
			t.opts = Obj;// 本模块相关参数

			//检测参数是否合要求
			if (!t.opts.selector || !t.opts.type || !t.opts.refId || !t.opts.logoUrl || !t.opts.name) {
				//("必填参数缺失！参考module.reply-form.js");
				return false;
			}

			if($(t.opts.selector).hasClass("maskShrinkageAction")){
				return false;
			}
			
			//作用于追加回复位置
			var ele = "";
			if ($(".downstairsUl", t.opts.selector).length === 0) {
				ele = $(t.opts.selector).append(t.template.replyForm(t.opts));
			} else {
				ele = $(".downstairsUl", t.opts.selector).prepend(t.template.replyForm(t.opts));
			}
			
			ele.find("textarea").on("click", function () {
				$(t.el.outPlugin, t.opts.selector).show();
				$(this).animate({
					height: "100px"
				}, 300);
				$(this).focus();
			});

			t.opts.callback && t.opts.callback();

			$(t.el.outPlugin, t.opts.selector).hide(); //隐藏

			//来源：终端页1默认回复(string) 2回复列表里的回复  
			if (typeof t.opts.selector === "object") { // object为回复列表回复
				$('textarea', t.opts.selector).trigger("click");
			}

			t.ctrl();
		},
		//template 在模块或是插件中使用到DOM时配置
		template: {
			replyForm: function (kv) {
				//临时处理头像，直接调用导航上的头像
				kv.logoUrl = $("#logo_src").attr("src");
				return "<form class=\"moduleReplyForm\" method=\"post\" enctype=\"multipart/form-data\">" +
					"<div class=\"module-replyForm\">" +
					"<div class=\"video_comment\" style=\"width:" + kv.outWidth + ";\">" +
					"			<div class=\"video_comment_l\"><img src=\"" + kv.logoUrl + "\"></div>" +
					"			<div class=\"video_comment_r\">" +
					"<div>" +
					"<textarea placeholder=\"回复@" + kv.name + "\" class=\"evModuleReplyForm\" style=\"width:" + kv.inputWidth + "\"></textarea>" +
					"</div>" +
					"<div class='upload_pic'></div>" +
					"<div class='re_content_text peferRes_text hide'></div>"+//引用资源
					"<div class='re_content_text remind_text hide'></div>"+//提醒
					"<div class=\"video_c_bf\">" +
					"<div class=\"video_c_cz\">" +
					"	<div class=\"btn_place\">" + //提醒包装 btn_place
					"		<div class=\"photo_bg Ev-addPicVideo\">添加照片</div>" +
					"		<div class=\"add_video_bg\" id='uploadVideoBtn_"+ module.replyForm.qiniuUploaderId +"'>添加视频</div>" +
					"	</div>" +
					"</div>" +
					"<div class=\"video_c_but\">" +
					"	<div class=\"qx_but evModuleReplyCancel\">取 消</div>" +
					"	<div class=\"fb_but evModuleReplySubmit\">发 布</div>" +
					"	<div class=\"clear\"></div>" +
					"</div>" +
					"</div>" +
					"<div class=\"clear\"></div>" +
					"</div><div class=\"clear\"></div>" +
					"</div>" +
					"<div class=\"clear\"></div>" +
					"</div></div>" +
					"<input class=\"replyFormParam\" type=\"hidden\" name=\"paramJson\" value='' />" +
					"</form>";
			}
		},
		//自行业务逻辑区域
		ctrl: function () {
			var t = this;
			
			//添加图片与视频
			$(".Ev-addPicVideo", t.opts.selector).addRemoveablePic({
				container: $(".upload_pic", t.opts.selector),
				limit: 4,
				desc: "module.reply-form.js",
				qiniuUploaderId: "#uploadVideoBtn_" + module.replyForm.qiniuUploaderId,
				html: "<div>添加图片</div>",
				onSizeChange: function (isExist) {
					picCb(isExist);
				},
				boxContainer:$('.evUploadVideoAndPic')
			});

			//资源引用
			$(".module-replyForm", t.opts.selector).referenceResource({
				customerId:"1399252409974",      //TODO
				callback:function(){
					resourceCb($(".module-replyForm", t.opts.selector).find(".Ev-resourceName span"));
				}
			});
			
			//提醒谁看
			$(".module-replyForm", t.opts.selector).replyRemind({
				callback: function () {
					remindCb($(".module-replyForm", t.opts.selector).find(".remind_name span"));
				}
			});

			var cidArr = []; //被提醒人id
			var resourceIdArr = []; //引用资源id
			//发布地址发布人
			$(t.el.submit, t.opts.selector).on("click", function () {
				var _this = this;
				user.login({
					callback: function () {
						if ($(_this).attr("class").indexOf("fb_but-ok") > -1) {
							
							//处理视频正在上传中的状态
		                	if($(".ev-processTips", t.opts.selector).text() === "视频正在处理中..."){
		                		alert("上传视频正在处理中，请等待上传完成后再进行发布操作！")
		                		return false;
		                	};
							
							//提交后禁止再次提交
							$(t.el.submit, t.opts.selector).removeClass("fb_but-ok").addClass("fb_but");
							var options = {
								url: t.path.publish,
								contentType: "multipart/form-data",
								dataType: "text",
								success: function (result) {

									//IE时
									if (navigator.userAgent.indexOf("MSIE") > 0) {
										$.topTip({mark: "success", content: "发布成功！"});
										//初始化
										$(t.el.form).remove();
										t.init(t.opts);

										//回应列表
										module.replyList({
											target: ".detail_replys", //瀑布流加载位置
											hint: ".reply-list-hint", //提示位置
											refId: t.opts.refId,
											authId: obj.authId,//作者ID
											type: t.opts.type,
											cid: t.opts.cid,
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
										$.topTip({mark: "success", content: "发布成功！"});

										//如果弄两句在，就移除并显示提示
										if ($(".v_all_list").length > 0) {
											$(".detail_replys").find("div:eq(0)").remove();//移除弄两句
											$(".reply-list-hint").show();
										}
										//初始化
										$(t.el.form, t.opts.selector).remove();
										t.init(t.opts);

										//回应列表
										module.replyList({
											target: ".detail_replys", //瀑布流加载位置
											hint: ".reply-list-hint", //提示位置
											authId: t.opts.authId,//作者ID
											refId: t.opts.refId,
											type: t.opts.type,
											cid: t.opts.cid,
											refresh: true, //刷新
											callback: function () {
												$(".evModuleReplyForm").click();
												$(".evModuleReplyForm").focus();
											}
										});

									} else {
										$.topTip({mark: "warn", content: "发布失败，请稍后再试！"});
									}
								}
							};

							$(t.el.form, t.opts.selector).ajaxSubmit(options);

						}

					},
					scene:privilegeSceneConst.eSceneTypeReview
				});
			});

			//取消发布
			$(t.el.cancel).on("click", function () {
				$(t.el.form, t.opts.selector).remove();
				t.init(t.opts);
			});
			
			//取出引用资源id
			function resourceCb(arr) {
				resourceIdArr = [];
				$.each(arr, function (i, el) {
					resourceIdArr.push($(el).attr("resourceid"));
				});
				updateParams();
			}

			//取出被提醒人id
			function remindCb(arr) {
				cidArr = [];
				$.each(arr, function (i, el) {
					cidArr.push($(el).attr("customerid"));
				});
				updateParams();
			}

			//记录pic与content是否有值
			var pic = false, content = false;

			//图片上传后触发发布按钮更新状态
			function picCb(isExist) {
				pic = isExist;
				submitToggle();
				updateParams();
			}

			//文本域触发切换发布
			$(t.el.textarea).bind("input", function () {
				content = $(this).val();
				submitToggle();
				updateParams();
			}).bind("propertychange", function () { //兼容IE
				content = $(this).val();
				submitToggle();
				updateParams();
			});

			//切换发布
			function submitToggle() {
				if (pic || content)
					$(t.el.submit).removeClass("fb_but").addClass("fb_but-ok");
				else
					$(t.el.submit).removeClass("fb_but-ok").addClass("fb_but");
			}

			//组装提交参数
			function updateParams() {
				var isUploadAttachment = 0, attachmentIds = "";
				if (typeof FileReader != 'undefined') {  // 本地可预览模式
					isUploadAttachment = 1;
				}

				var reviewContent = $(t.el.textarea, t.opts.selector).val();
				reviewContent  = htmlToString(reviewContent).replace(/&lt;br\/&gt;/g,'<br/>');

				attachmentIds = $(".imgPkList", t.opts.selector).val();
				pvideoIds = $(".pvideoIds", t.opts.selector).val();  // 视频Id
				
				//quoteIds = $(".quoteIds").val();
				$(t.el.formParams, t.opts.selector).val("" +
					"{'reviewType':" + t.opts.type + "," +
					"'refId':" + t.opts.refId + "," +
						//如果为回复时追加被回复内容的id
					(t.opts.scene === 2 ? "'parentId':" + parseInt(t.opts.selector.find('[data-reviewid]').attr('data-reviewid')) + "," : "") +
					"'reviewContent':'" + reviewContent + "'," +
					"'imageType':5,'refCustomerIdList':'" + cidArr.toString() + "'," +
					"'isUploadAttachment':" + isUploadAttachment + "," +
					"'attachmentIds':'" + attachmentIds + "'," +
					"'quoteIds':'" + resourceIdArr.join(",") + "'," +
					"'pvideoIds':'"+ pvideoIds +"'," +
					"'quoteType':'"+ $(".Ev-resourceName>span",t.opts.selector).attr("quotetypeid") +"',"+
					"'quoteName':'"+$(".Ev-resourceName>span",t.opts.selector).text()+"'}");
			}


		}
	};

	controller.init(Obj);

};
