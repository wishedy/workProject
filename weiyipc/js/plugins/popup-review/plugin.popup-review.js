/**
 * 功能描述：支持relation2 使用  适用于弹出回复表单模块 含添加图片及提醒谁看
 * 使用方法：support.popupReply(Obj);
 *               必备参数参照：opts
 *
 * Created by QiaoLiang on 2015-02-28.
 */

plugin.popupReview = function(obj){
	var controller = {
		path : {
			reply : PC_CALL + "review/createReview/"
		},
		opts : {
			selector : "",
			refId : "", //资源id
			reviewType : "", // 回复类型

			title : "",
			logoUrlHref : "", //一段html头像带链接
			name : "",
			time : "",
			content : "",
			reviewId : 0
		},
		el : {
			replyGlobal : ".plugin-popup-reply", //全局超元素
			showAction : ".reply-action-area",  //动作元素控制元素
			formParams : ".pluginPopupReplyParam" //表单参数存放hidden元素
		},
		temp : {
			picPub : "",  //添加图片
			contentPub : "", //回复内容
			cidArr : [] //提醒人的id数据
		},
		template : {
			form : function(kv){ //对话与回复
				var html = "<form class=\"plugin-popup-reply\" method=\"post\" enctype=\"multipart/form-data\">"+
					"<div>"+
					  "<div class=\"t_tc_top\">"+
					    "<div class=\"t_tc_title\"></div>"+ //"+kv.title+"
					    "<div class=\"t_tc_close\"><div class=\"close-popup-reply\"></div></div>"+
					  "</div>"+
					  "<div class=\"t_tc_main\">"+
					    "<div class=\"t_tc_content\" style=\"position: relative;\">"+
					      "<ul>"+
					        "<li>"+
					          "<div class=\"t_tc_left\">"+kv.logoUrlHref+"</div>"+
					          "<div class=\"t_tc_right\">"+
					            "<div class=\"p_list_top\">"+
					              "<div class=\"p_l_t_l font_yahei\">"+kv.name+"</div>"+
					              "<div class=\"p_l_t_r_case\">"+kv.time+"</div>"+
					              "<div class=\"clear\"></div>"+
					            "</div>"+
					            "<div class=\"t_tc_title\">"+kv.title+"</div>"+ //内容
					            "<div class=\"list_text font_yahei\">"+kv.content+"</div>"+ //图片
					          "</div>"+
					          "<div class=\"clear\"></div>"+
					        "</li>"+
					      "</ul>"+
					    "</div>"+
					    "<div class=\"tc_comment_content\">"+
					        "<div class=\"tc_active\"><textarea placeholder=\"回复@"+$(kv.name).text()+"\"></textarea></div>"+
					        "<div class=\"reply-action-area\" data-reviewId=\""+kv.reviewId+"\">"+
						        	  "<div class=\"upload_pic\"></div>" +
						        	  "<div class=\"remind_text hide\"></div>" + //提醒

						        	  "<div class=\"btn_place\">" +
						        	 		"<div class=\"photo_bg\">添加照片</div>"+
						        	  "</div>"+
						        	  "<div class=\"triggerEvents\">"+
							          "<div class=\"qx_but cancel-reply\">取 消</div>"+
							          "<div class=\"fb_but save-reply\">发 布</div>"+
							          "<div class=\"clear\"></div>"+
						          "</div>"+
					      "</div>"+
					      "<div class=\"clear\"></div>"+
					    "</div>"+
					  "</div>"+
					"</div>"+
					"<input class=\"pluginPopupReplyParam\" type=\"hidden\" name=\"paramJson\" value='' />" +
					"</form>"  ;
				return html;
			}
		},
		init : function(obj){
			var t =this;
			$.extend(t.opts,obj);

			comm.fastError.missParams(t.opts,"plugin.popup-reply.js");

			var createElement = $(t.template.form(t.opts));

			//点击与输入时触发
            createElement.find("textarea").on("click",function(){
            		t.fns.expandTextarea(this);
            }).on("input",function(){
            		t.temp.contentPub = $.trim($(this).val());
            		t.fns.submitStatus();
            		t.fns.updateParams();
            		t.fns.expandTextarea(this);
            }).on("propertychange",function(){
	            	t.temp.contentPub = $.trim($(this).val());
	        		t.fns.submitStatus();
	        		t.fns.updateParams();
	        		t.fns.expandTextarea(this);
            });

            //关闭回复  --执行移除
            createElement.find(".close-popup-reply,.cancel-reply").on("click",function(){
            		$("body").removeAttr("style");
            		$(".plugin-popup-reply").remove();
                    if(comm.LightBox.count>1){
                        comm.LightBox.count--;
                        comm.LightBox.zIndexDown();
                    }else{
                        comm.LightBox.hide();
                    }

            		return false;
            });

            //提交回复
            createElement.find(".save-reply").on("click",function(){
	            	if($(this).attr("class").indexOf("publish-ok") >-1){ //如果是发布
	            		//处理视频正在上传中的状态
	                	if($(".ev-processTips", t.opts.selector).text() === "视频正在处理中..."){
	                		alert("上传视频正在处理中，请等待上传完成后再进行发布操作！")
	                		return false;
	                	};
	                	
	            		$(this).removeClass("publish-ok").addClass("fb_but");
	            			var options = {
		                        url: t.path.reply,
		                        success: function (result) {
		                        		//IE时
		                        	  if(navigator.userAgent.indexOf("MSIE")>0){
		                        		  $.topTip({mark:"success",showTime:3,content:"发表回复成功！"});
			                        	  //初始化
		                        		  $(t.el.replyGlobal).remove();
									  $("body").removeAttr("style");
									  comm.LightBox.hide();
		                               return false;
		                        	  }

		                        	   var resultAs = $.parseJSON(result);

		                            if (resultAs.responseObject.responseStatus){
		                            	   $.topTip({mark:"success",showTime:3,content:"发表回复成功！"});

		                            		//将外部值＋1
										//判断外部是否存在查看对话 可能需要扩展的
										//初始化
										$(t.el.replyGlobal).remove();
										$("body").removeAttr("style");
										comm.LightBox.hide();
			                            	//需不需要刷新

		                            }else{
		                            		$.topTip({mark:"warn",showTime:3,content:"发表回复失败！"});
		                            }
		                        }
	            			};

	            			$(t.el.replyGlobal).ajaxSubmit(options);
	            	}
            });

            // 遮罩 设层高为遮罩+1
            if(comm.LightBox.count>0){
                comm.LightBox.count++;
                comm.LightBox.zIndexUp();
            }else{
                comm.LightBox.show();
            }
            $("#lightbox").css("background","#000").css("opacity","0.7");

            createElement.css("zIndex",comm.LightBox.getZIndex()+1);

			$(t.opts.selector).append(createElement); //输出结构

			t.fns.showCenter();//居中

			$("textarea",t.el.replyGlobal).focus(); //获取焦点

			//载入添加照片
            $(".plugin-popup-reply").find(".photo_bg").addRemoveablePic({
                container: $(".plugin-popup-reply").find(".upload_pic"),
                limit: 4,
                desc: "plugin.popup-review.js",
	            qiniuUploaderId:"#uploadVideoBtn_" + module.replyForm.qiniuUploaderId,
                html: "<div>添加图片</div>",
                onSizeChange: function (isExist) {
                    picCb(isExist);
                }
            });

            //载入提醒谁看
            $(t.el.replyGlobal).replyRemind({
                 callback: function () {
                    remindCb($(".plugin-popup-reply",t.opts.selector).find(".remind_name span"));
                 }
            });

            function picCb(isExist){ //接收回调 图片是否存在状态
            		t.temp.picPub = isExist;
            		t.fns.submitStatus();
            		t.fns.updateParams();
            }

            function remindCb(arr){//接收回调 提醒人
                //t.temp.cidArr = [];
                $.each(arr, function (i, el) {
                    t.temp.cidArr.push($(el).attr("customerid"));
                });
                t.fns.updateParams();
            }

		},
		fns : {
			expandTextarea : function(_this){ //文本区展开效果
				var t = controller;
		    		if($(_this).height()!==100){
		    			$(_this).animate({height:100},function(){
		    				$(t.el.showAction).show("fade");
		    			});
		    		}
			},
			submitStatus : function(){ //提交状态
				 var t = controller;
				 if (t.temp.picPub || t.temp.contentPub) $(".fb_but").addClass("publish-ok");
         			else $(".fb_but").removeClass("publish-ok");
			},
			updateParams : function(){
				var t = controller;

				var isUploadAttachment = 0,attachmentIds="";
                if(typeof FileReader != 'undefined') {  // 本地可预览模式
                    isUploadAttachment = 1;
                }

               attachmentIds = $(".imgPkList").val();
				$(t.el.formParams).val("" +
	                    "{'reviewType':" + t.opts.reviewType + "," +
	                    "'refId':" + t.opts.refId + "," +
	                    "'reviewContent':'" + t.temp.contentPub + "'," +
	                    "'imageType':5,'refCustomerIdList':'" + t.temp.cidArr.toString() + "'," +
						"'isUploadAttachment':"+ isUploadAttachment +"," +
						"'attachmentIds':'"+ attachmentIds +"'}");
			},
			showCenter : function(){ //居中显示 80%，并加入遮罩;
				var t = controller;

				var sysH = $(window).height()*0.8;
				var windowH = $(".t_tc_main").height();
				if(windowH>sysH){
					$(".t_tc_main").css({"height":sysH+"px","overflow-x":"hidden","overflow-y":"auto"});
				}else{
					$(".t_tc_main").css("height","auto");
				}

				var horizontal = $(window).width()/2,vertical = $(window).height()/2;
				var popupW = $(t.el.replyGlobal).width()/2,popupH = $(t.el.replyGlobal).height()/2;
				$(t.el.replyGlobal).css("left",horizontal-popupW).css("top",vertical-popupH);

				$("body").css("overflow","hidden");
			},
		}
	};

	controller.init(obj);
};