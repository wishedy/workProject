/**
 * 功能描述：支持relation2 使用  适用于非弹出回复表单模块 含添加图片及提醒谁看
 * 使用方法：support.replyForm(Obj);
 *                  必要参数：obj.selector 为当前模块摆放到的位置
 *                  			  	obj.parentEle 触发的来源li元素
 *                                        obj.type 资源类型
 *                                        obj.logoUrl 当前人头像
 *                                        obj.refid  为当前资源的ID
 *                                        obj.name 为当前人的称呼
 *
 * 提示：来源于moduel.replyForm的变种
 * 引入来源：plugin.add-removeable-group-pic.js与plugin.reply-remind.js plugin.top-tip.js  作用：添加图片及提醒谁看 提示
 *
 * Created by QiaoLiang on 2015-02-28.
 */
support.reviewForm = function (Obj) {
	if(!support.reviewForm.qiniuUploaderId){
		support.reviewForm.qiniuUploaderId=1;
	}else{
		support.reviewForm.qiniuUploaderId++;
	}
	
    var controller = {
        //如果涉及翻页之类，可配置参数，比如：翻页数量、播放时长、初始化位置等
        config: {pageSize: 4}, //翻页数量

        //如果涉及地址第一行必须写固定名字：path 定义地址
        path: {
            publish: PC_CALL+"review/createReview/" //发布回复
        },
        opts : {
        		selector : "",
        		outWidth : 715, //外框宽度
			inputWidth : 559, //文本框宽度
			type : 0, //资源类型
			refId : 0, //当前资源Id
			parentId : 0,//回复的父Id
			trendsId : 0,//动态的id
			name : "",
			isFocus : false, // 是否聚焦到文本框
        },
        //元素moduleReplyForm
        el: {
            outPlugin: ".upload_pic,.video_c_bf",  //外部插件元素 主要是用于显示隐藏
            textarea: ".evSupportReplyForm",  //文本域
            submit: ".evSupportReplySubmit", //提交发布
            cancel: ".evSupportReplyCancel", //取消发布
            form: "form", //表单名称
            formParams: ".supportReplyFormParam" //hidden掉的组装参数
        },
        //初始化时第一执行方法，固定格式
        init: function (Obj) {
            var t = this;
            $.extend(t.opts,Obj);// 本模块相关参数
            //检测参数是否合要求
            comm.fastError.missParams(t.opts,"relation2.reply.js");
            
            //删除 时需要传一个父元素
            if(t.opts.destroy){
            		var ele = $(t.opts.parentEle).find("form");
            		if(ele.length>0){ ele.remove(); return false; }
            	}

            var createElement = $(t.template.replyForm(t.opts));
            
            //追加文本框事件，点击或输入时都触发
            $(t.opts.selector).append(createElement).find("textarea").off("click").on("click", function () {
                $(t.el.outPlugin,t.opts.selector).show();
                $(this).animate({
                    height: 100
                }, 300);
            }).on("input",function(){
            		if($(this).height() === 100) return false;
                $(t.el.outPlugin,t.opts.selector).show();
                $(this).animate({
                    height: 100
                }, 300);
            }).on("propertychange",function(){
           		if($(this).height() === 100) return false;
                $(t.el.outPlugin,t.opts.selector).show();
                $(this).animate({
                    height: 100
                }, 300);
            });
            
            if(t.opts.isFocus){createElement.find("textarea").focus();}
            
            $(t.el.outPlugin,t.opts.selector).hide(); //隐藏

            t.ctrl();
        },
        //template 在模块或是插件中使用到DOM时配置
        template: {
            replyForm: function (kv) { 
                return "<form method=\"post\" enctype=\"multipart/form-data\">" +
                    "<div class=\"support-replyForm\">" +
                    "<div class=\"video_comment\" style=\"width:"+kv.outWidth+"px;\">" +
                    		       "<div class=\"p_hf_sj\"></div>"+
                    "			<div class=\"video_comment_l\"><img src=\"" + (kv.logoUrl.indexOf("user_img65.png")>-1?"//img10.allinmd.cn/default-user/mr_img.png":kv.logoUrl) + "\"></div>" +
                    "			<div class=\"video_comment_r\">" +
                    "<div>" +
                    "<textarea placeholder=\"回复@" + kv.name + "\" class=\"evSupportReplyForm\" style=\"width:"+kv.inputWidth+"px;\"></textarea>" +
                    "</div>" +
                    "<div class='upload_pic'></div>" +
                    "<div class='re_content_text peferRes_text hide'></div>"+//引用资源
					"<div class='re_content_text remind_text hide'></div>"+//提醒
					"<div class=\"video_c_bf\">" +
					"<div class=\"video_c_cz\">" +
					"	<div class=\"btn_place\">" + //提醒包装 btn_place
					"		<div class=\"photo_bg\">添加照片</div>" +
					"		<div class=\"add_video_bg\" id='uploadVideoBtn_"+support.reviewForm.qiniuUploaderId+"'>添加视频</div>" +
					"	</div>" +
					"</div>" +
                    "<div class=\"video_c_but\">" +
                    "<div class=\"qx_but evSupportReplyCancel\">取 消</div>" +
                    "<div class=\"fb_but evSupportReplySubmit\">发 布</div>" +
                    "<div class=\"clear\"></div>" +
                    "</div>" +
                    "<div class=\"clear\"></div>" +
                    "</div><div class=\"clear\"></div>" +
                    "</div>" +
                    "<div class=\"clear\"></div>" +
                    "</div></div>" +
                    "<input class=\"supportReplyFormParam\" type=\"hidden\" name=\"paramJson\" value='' />" +
                    "</form>";
            }
        },
        //自行业务逻辑区域
        ctrl: function () {

            var t = this;

            //添加图片
            $(".photo_bg",t.opts.selector).addRemoveablePic({
                container: $(".upload_pic",t.opts.selector),
                limit: 4,
                desc: "relation2.review.js",
	            qiniuUploaderId:"#uploadVideoBtn_" + support.reviewForm.qiniuUploaderId,
                html: "<div>添加图片</div>",
                onSizeChange: function (isExist) {
                    picCb(isExist);
                }
            });
            //资源引用
			$(".support-replyForm", t.opts.selector).referenceResource({
				customerId:"1399252409974",      //TODO
				callback:function(){
					resourceCb($(".support-replyForm",t.opts.selector).find(".Ev-resourceName span"));
				}
			});
			
            //提醒谁看
            $(".support-replyForm",t.opts.selector).replyRemind({
            	    //width : "575",
                callback: function () {
                    remindCb($(".support-replyForm",t.opts.selector).find(".remind_name span"));
                }
            });

            var cidArr = []; //被提醒人id
            var resourceIdArr = []; //被引用资源id
            //发布地址发布人
            $(t.el.submit,t.opts.selector).on("click", function () {
                if ($(this).attr("class").indexOf("fb_but-ok") > -1) {
                	
                	//处理视频正在上传中的状态
                	if($(".ev-processTips", t.opts.selector).text() === "视频正在处理中..."){
                		$.topTip({mark: "warn",showTime: 3, content: "上传视频正在处理中，请等待上传完成后再进行发布操作!"});
                		return false;
                	};
                	
                	   //提交后禁止再次提交
                	   $(t.el.submit,t.opts.selector).removeClass("fb_but-ok").addClass("fb_but");
                    var options = {
                        url: t.path.publish,
                        success: function (result) {
                        	
                        	 //IE时
                        	  if(navigator.userAgent.indexOf("MSIE")>0){
                        		  $.topTip({mark:"success",content:"发表回复成功！"});
                           	   //初始化
                           	   $(t.el.form).remove();
                           	   t.init(t.opts);
                           	   return false;
                        	  } 
                        	
                        	   var resultAs = $.parseJSON(result);
                            if (resultAs.responseObject.responseStatus) {
                            		
                            	   $.topTip({mark:"success",content:"发表回复成功！"});
                            	   //初始化
                            	   $(t.el.form).remove();
                            	   t.init(t.opts);
                            	   
                            } else {
                            		$.topTip({mark:"warn",content:"发表回复失败！"});
                            }
                        }
                    };
                    
                    $(t.el.form,t.opts.selector).ajaxSubmit(options);	
                    
                }
            });

            //取消发布
            $(t.el.cancel,t.opts.selector).on("click", function () {
            	if(!$(this).hasClass("qx_but_prohibit")){
            		$(t.el.form,t.opts.selector).remove();
            		t.init(t.opts);
            	}
            });


            //取出被提醒人id
            function remindCb(arr) {
                cidArr = [];
                $.each(arr, function (i, el) {
                    cidArr.push($(el).attr("customerid"));
                });
                updateParams();
            }

            //取出引用资源id
			function resourceCb(arr) {
				resourceIdArr = [];
				$.each(arr, function (i, el) {
					resourceIdArr.push($(el).attr("resourceid"));
				});
				updateParams();
			}
            
            //记录pic与content是否有值
            var pic = false, content = false;
            
            //图片触发切换发布
            function picCb(isExist) {
                pic = isExist;
                submitToggle();
                updateParams();
            }

            //文本域触发切换发布
            $(t.el.textarea,t.opts.selector).bind("input", function () {
                content = $(this).val();
                submitToggle();
                updateParams();
            }).bind("propertychange",function(){
                content = $(this).val();
                submitToggle();
                updateParams();
            });

            //切换发布
            function submitToggle() {
                if (pic || content)
                    $(t.el.submit,t.opts.selector).removeClass("fb_but").addClass("fb_but-ok");
                else
                    $(t.el.submit,t.opts.selector).removeClass("fb_but-ok").addClass("fb_but");
            }

            //组装提交参数
            function updateParams() {
            	 	var isUploadAttachment = 0,attachmentIds="";
                 if(typeof FileReader != 'undefined') {  // 本地可预览模式
                     isUploadAttachment = 1;
                 }
                 
                attachmentIds = $(".imgPkList",t.opts.selector).val();
               
                $(t.el.formParams,t.opts.selector).val("" +
                    "{'reviewType':" + t.opts.type + "," +
                    "'refId':" + t.opts.refId + "," +
                    "'parentId':"+ t.opts.parentId +","+
                    "'trendsId':"+ t.opts.trendsId + ","+
                    "'reviewContent':'" + $(t.el.textarea,t.opts.selector).val() + "'," +
                    "'imageType':5,'refCustomerIdList':'" + cidArr.toString() + "'," +
            		"'isUploadAttachment':"+ isUploadAttachment +"," +
            	    "'attachmentIds':'"+ attachmentIds +"'," +
            	    "'quoteIds':'" + resourceIdArr.join(",") + "'," +
					"'pvideoIds':'"+ $(".pvideoIds",t.opts.selector).val() +"'," +
					"'quoteType':'"+ $(".Ev-resourceName>span",t.opts.selector).attr("quotetypeid") +"',"+
					"'quoteName':'"+$(".Ev-resourceName>span",t.opts.selector).text()+"'}");
            }
        }
    };

    controller.init(Obj);

};
