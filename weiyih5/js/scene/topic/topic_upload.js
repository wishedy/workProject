$(function(){
	//user.privLogin();  //未登录跳转
	//Log.createBrowse(84,"话题编辑页");
	var topic={};
	topic={
		init:function(){
			var t=this;
			para=comm.getpara();
			this.topicId=para.topicId;
			this.draftEdit=para.draft;
			if(t.draftEdit){//草稿箱编辑
				$(".new_case_title").text("编辑话题");
				document.title="编辑话题";
			}
			if(!TempCache.getItem("prevTopicHref")){
				TempCache.setItem("prevTopicHref", document.referrer);//记录上传话题的来源页，以后用作返回依据
			}
			t.prevTopicHref=TempCache.getItem("prevTopicHref");
			if(t.prevTopicHref.indexOf("pages/upload-select.html")>0){
				t.prevTopicHref=localStorage.getItem('prevHref');
			}
			$("textarea").each(function(i,em){
				$(em).textareaAutoHeight();
				t.textChange($(em));
			});
			$("input").each(function(i,em){
				t.textChange($(em));
			});

			this.create();
			/*$(".case_tag").on("vclick",function(){
				t.setLocalStorage();
			 g_sps.jump(null,pageurl.urlList.toEditTocTag.url);
			});*/
			$(".remind").on("vclick",function(){
				t.setLocalStorage();
        g_sps.jump(null,pageurl.urlList.toRemind.url+"topic");
			});
			//this.cancel();
			$("#back").on("vclick",function(){//返回按钮
				//t.prevTopicHref=TempCache.getItem("prevTopicHref");
				comm.creatEvent({
					triggerType:'全站功能按钮点击',
					keyword:"返回",
					actionId:41,
					async:false
				});
				if(t.draftEdit){//话题的草稿编辑
					t.saveOrNoDraft();
				}else{
					t.saveOrNoDraft();
				}
			});
			$("#cancel").on("vclick",function(){//取消

				if(t.draftEdit){//话题的草稿编辑
					t.saveOrNoDraft();
				}else{
					t.saveOrNoDraft();
				}
			});
		},
		//是否需要创建
		create:function(){
			var t=this;
			if(this.draftEdit) {//修改草稿箱
				if(localStorage.getItem('topicStorage')) {
					this.getLocalStorage();
					this.uploadImg();
				}else{
					this.getTopic();
				}
				this.uploadSubmit();
				$("#delete").show();
				this.deleteToc();
			}else{//创建
				if(localStorage.getItem('topicStorage')){
					this.getLocalStorage();
					this.uploadImg();
					this.uploadSubmit();
				}else{
					$(":text").val("");
					$("textarea").val("");
					//创建一条病例
					$.ajax({
						url:"/mcall/cms/topic/base/create/",
						type:"post",
						dataType:"json",
						success:function(rep){
							if(rep.responseObject.responseStatus){
								t.topicId=rep.responseObject.responsePk;
								t.uploadImg();
								t.uploadSubmit();
								//t.setLocalStorage();
							}else{
								popup("创建话题失败");
							}
						}
					})
				}
			}
		},
		//清楚发布话题来源页
		removePrevHref:function(){
			TempCache.removeItem("prevTopicHref");
		},
		//保存草稿箱
		saveOrNoDraft:function(){
			var t=this;
			if($(".case_content input").val()||$(".case_content textarea").val()||$("#img_list .case_sc").length>0||$(".tag_li li").length>0||$(".rem_list li").length>0) {
				comm.draftAttention($(".case_content"), "是否要保存该话题至草稿箱？");
				$("#no_save_dra").on("vclick", function () {//不保存
					t.removePrevHref();
          g_sps.jump(null,t.prevTopicHref);
				});
				$("#save_dra").attr("on", "true");
				$("#save_dra").on("vclick", function () {//保存
					if ($("#save_dra").attr("on") == "true") {
						t.save();
					}
				})
			}else{
				t.removePrevHref();
        g_sps.jump(null,t.prevTopicHref);
			}
		},
		//删除草稿
		deleteToc:function(){
			var t=this;
			$("#delete").on("vclick",function(){
				comm.loading.show();
				var data={topicId:t.topicId,deleteFlag:1};
				var param={};
				param.paramJson= $.toJSON(data);
				$.ajax({
					type : "post",
					url : "/mcall/cms/topic/base/update/",
					data : param,
					dataType : "json",
					success : function(rep){
						comm.loading.hide();
						if(rep.responseObject.responseStatus){
							popup("删除成功");
              g_sps.jump(null,TempCache.getItem("prevTopicHref"));
							TempCache.removeItem("prevTopicHref");
							TempCache.removeItem("topicStorage");
							TempCache.removeItem("tocTagStorage");
							TempCache.removeItem("tocAttStorage");
						}else{
							popup("删除失败");
						}
					},
					error:function(){}
				});
			})
		},
		//草稿箱提交
		save:function(){
			var t=this;
			var content=[];
			var data={};
			var param={};
			var tagList='';
			$(".tag_li li div").each(function(i,em){
				tagname=$(em).attr("tagid")+'_'+$(em).text()+",";
				tagList+=tagname;
			});
			data.topicId=t.topicId;
			data.platformId = TempCache.getItem('department');
			data.isValid=0;
			data.isDraft=1;//草稿箱
			data.topicName=$("#topic_name").val();
			var topicDiscuss=$("#topic_discuss").val();
			data.topicType=1;
			content.push({"content":topicDiscuss,"contentType":"0","topicAttName":""});
			$.each($(".case_sc"),function(i,em){
				var src=$(em).find(".img_view").attr("src").replace("_c_t_200_200","");
				content.push({"content":src,"contentType":"1","topicAttId":$(em).find(".case_close").attr("imgid"),"topicAttName":""});
			});
			data.contentJson= content;
			//提醒
			if(this.attention){
				var attention=this.attention;
				attContent=attention.attContent;
				var idList="";
				$.each(attContent,function(i,n){
					idList+=attContent[i][0]+",";
				});
				data.refCustomerIdList=idList.substring(0,idList.length-1);
			}
			//data.tagList=tagList.substring(0, tagList.length-1);
			param.paramJson= $.toJSON(data);
			comm.loading.show();
			//话题提交
			$.ajax({
				url:"/mcall/cms/topic/base/update/",
				data:param,
				type:"post",
				dataType:"json",
				success:function(rep){
					comm.loading.hide();
					$("#save_dra").attr("on","true");
					if(rep.responseObject.responseStatus){
						popup("话题草稿箱保存成功!");
						//置空localStorage
						TempCache.removeItem("prevTopicHref");
						TempCache.removeItem("topicStorage");
						TempCache.removeItem("tocTagStorage");
						TempCache.removeItem("tocAttStorage");
						var da={topicId:data.topicId};
						var param={};
						param.paramJson= $.toJSON(da);
            g_sps.jump(null,t.prevTopicHref);
					}else{
						$("#atten").hide();
						popup("话题草稿箱保存失败!");
					}

				}
			});
		},
		//编辑获取病例信息
		getTopic:function(){
			var t=this;
			var data={topicId:t.topicId,attUseFlag:7};
			var param={};
			param.paramJson= $.toJSON(data);
			$.ajax({
				url:"/mcall/cms/topic/base/info/",
				type : 'POST',
				data : param,
				dataType:"json",
				async: false,
				success:function(rep){
					if(rep.responseObject.responseData&&rep.responseObject.responseData.data_list){
						if(rep.responseObject.responseData.data_list.length>0){
							TempCache.removeItem("topicStorage");
							topicCon=rep.responseObject.responseData.data_list[0].cms_topic;
							t.webStoragePath=rep.responseObject.responseData.data_list[0].cms_topic.webStoragePath;
							var contentList=rep.responseObject.responseData.data_list[0].contentList;
							topicDiscuss="";
							//上传的图片
							var imgList=[];
							$.each(contentList,function(i,em){
								if(em.contentType==0){//讨论
									topicDiscuss+=em.content;
								}else if(em.contentType==1){//图片
									imgList.push({"topicAttUrl":em.picAttUrl,"id":em.id});
								}
							});
							t.uploadImg();
							$("#topic_name").val(topicCon.topicName);
							$("#topic_discuss").val(topicDiscuss);

							$.each($(".input_title"),function(i,em){
								if($(this).find("input").val()!=''&&$(this).find("textarea").val()!=''){
									$(this).css("top","3.2em");
									$(this).next().show();
								}
							});
							$("textarea").each(function(i,em){
								if($(em).val()!=''){
									$(this).height(this.scrollHeight);
									$(this).parents(".case_title").css("height",$(this).parent().next().outerHeight(true)+$(this).height()+12);
								}
							});

							if(imgList&&imgList.length>0){
								html="";
								if(imgList.length>=9){
									$("#uploadify").parent().hide();
								}
								$.each(imgList,function(i,val){
									if(val.topicAttUrl){
										html+="<div class='case_sc'><div class='img_con'><img class='img_view' src='"+val.topicAttUrl+"' imgid='"+val.id+"'/></div><div class='case_close' imgid='"+val.id+"'><img src='//img50.allinmd.cn/case/close.png'/></div></div>";
									}
								});

								$("#img_list").html(html);
								$(".img_con").each(function(i,em){
									$(em).css("height",$(em).width());
								});
								t.imgHandle();
							}
							//标签
							/*tagContent=rep.responseObject.responseData.data_list[0].cms_topic_tag_list;
							if(tagContent.length>0){
								TempCache.removeItem("tocTagStorage");

								html="";
								t.tag={};
								t.tag.tagContent=[];
								$.each(tagContent,function(i,val){
									$("#tag_title").hide();
									$("#showTitle").show();
									t.tag.tagContent.push([val.tagId,val.tagName]);
									html+="<li><div class='tag_text' tagid="+val.tagId+">"+val.tagName+"</div></li>";
								});

								$(".tag_li").show().html(html+="<div class='clear'></div>");
							}*/
							//提醒谁看
							attContent=rep.responseObject.responseData.topic_remind_list;
							if(attContent&&attContent.length>0){
								 TempCache.removeItem("topicAttStorage");
								 html="";
								 t.attention={};
								 t.attention.attContent=[];
								 $.each(attContent,function(i,val){
									 $("#rem_title").hide();
									 $("#rem_show").show();
									 name=val.lastName+val.firstName;
									 t.attention.attContent.push([val.customerId,name]);
									 html+="<li customerid="+val.customerId+">"+name+"，</li>";
								 });
								 html+='<div class="clear"></div>';
								 $(".rem_list").show().append(html);
								 //localStorage.setItem("topicAttStorage", JSON.stringify(attention));
							 }
						}else{
							popup("获取信息失败");
							t.removePrevHref();//清楚来源页
              g_sps.jump(null,t.prevTopicHref);
						}
					}else{
						popup("获取信息失败");
						t.removePrevHref();//清楚来源页
            g_sps.jump(null,t.prevTopicHref);
					}
				}
			})
		},
		//取消
		cancel:function(){
			$("#cancel").on("vclick",function(){
				if($("#topic_name").val()||$("#topic_discuss").val()||$(".case_sc").length>0||$(".tag_li li").length>0||$(".rem_list li").length>0){
					$("#cancel_mask").show();
				}else{
					goback();
					return false;
				}
				
			});
			$(".jix_l").on("vclick", function () {
				goback();
				return false;
            });
			$("#continue_pub").on("vclick",function(){
				setTimeout(function(){
					$("#cancel_mask").hide();
				},400);
			});
			function goback(){
				t.removePrevHref();//清楚来源页
        g_sps.jump(null,t.prevTopicHref);
			}
		},

		//存储localStorage
		setLocalStorage:function(){
			var topicCon={};
			//设置topicStorage
			topicCon.topicId=this.topicId;
			topicCon.topicName=$("#topic_name").val();
			topicCon.topicDiscuss=[$("#topic_discuss").val(),$("#topic_discuss").height()];
			topicCon.imgList=[];
			$.each($(".case_sc"),function(i,em){
				if($(em).find(".img_view").attr("src")){
					topicCon.imgList.push({"src":$(em).find(".img_view").attr("src"),"topicAttId":$(em).find(".case_close").attr("imgid")});
				}
			});
			localStorage.setItem("topicStorage", JSON.stringify(topicCon));
			/*if(this.tag){
				localStorage.setItem("tocTagStorage", JSON.stringify(this.tag));
			}*/
			if(this.attention){
				localStorage.setItem("tocAttStorage", JSON.stringify(this.attention));
			}
		},
		//获取localStorage
		getLocalStorage:function(){
			//topicStorage
			if(localStorage.getItem('topicStorage')){
				var topicCon=JSON.parse(localStorage.getItem('topicStorage'));
				TempCache.removeItem("topicStorage");
				this.topicId=topicCon.topicId;
				
				$("#topic_name").val(topicCon.topicName);
				$("#topic_discuss").val(topicCon.topicDiscuss[0]).height(topicCon.topicDiscuss[1]);
				
				$.each($(".input_title"),function(i,em){
					if($(this).find("input").val()!=''&&$(this).find("textarea").val()!=''){
						$(this).css("top","3.2em");
						$(this).next().show();	
					}	
				});
				$("textarea").each(function(i,em){
					if($(em).val()!=''){
						$(this).parents(".case_title").css("height",$(this).parent().next().outerHeight(true)+$(this).height()+12);
					}
				});
				this.getImg();
			}
			//tagStorage
			/*if(localStorage.getItem("tocTagStorage")){
				var html="";
				this.tag=JSON.parse(localStorage.getItem("tocTagStorage"));
				TempCache.removeItem("tocTagStorage");
				tagContent=this.tag.tagContent;
				$.each(tagContent,function(i,n){
					$("#tag_title").hide();
					$("#showTitle").show();
					html+="<li><div class='tag_text' tagid="+tagContent[i][0]+">"+tagContent[i][1]+"</div></li>";
				});
				$(".tag_li").show().html(html+="<div class='clear'></div>");
			};*/
			//tocAttStorage
			if(localStorage.getItem("tocAttStorage")){
				$("#rem_title").hide();
				$("#rem_show").show();
				this.attention=JSON.parse(localStorage.getItem("tocAttStorage"));
				TempCache.removeItem("tocAttStorage");
				attContent=this.attention.attContent;
				var html="";
				$.each(attContent,function(i,n){
					html+="<li customerid="+attContent[i][0]+">"+attContent[i][1]+"，</li>";
				});
				html+="<div class='clear'></div>";
				$(".rem_list").show().append(html);
			}
		},
		//文本框改变检索
		textChange:function($text){
			var ie = jQuery.support.htmlSerialize; //是否ie
			var str = 0;//汉字的个数
			var abcnum = 0; //非汉字个数
			var maxNum = maxNum; //最大字符数
			//文本框字数计算和提示改变
			if(ie){
				$text.bind("input",function(){changeNum($text)});
			}else{
				$text.bind("propertychange",function(){changeNum($text)});
			}

			changeNum = function($text){
				//汉字的个数
				str = ($text.val().replace(/\w/g,"")).length;
				//非汉字的个数
				abcnum = $text.val().length-str;
				var total=str*2+abcnum;
				maxNum = $text.attr("max")*2;
				if(total==0){
					$text.parent().parent().find(".case_mr_title").hide();
					$text.parent().css("top","2em");
				}else{
					$text.parent().parent().find(".case_mr_title").show();
					$text.parent().css("top","3.2em");
				}
				if(total<maxNum || total == maxNum){//未超出

				}else{//超出
					$text.val(comm.cutstr($text.val(),maxNum));
				}

			}
		},
		//上传图片
		uploadImg:function(){
			var t=this;
			czyx.uploadReplace('#uploadify',{
		        url:'/mcall/cms/topic/attachment/create/', //文件处理的URL,
		        data:{topicId:t.topicId},
		        uploadReplaceCss:{
		        	//设置上传按钮图片
		            background:'url(//img50.allinmd.cn/case/xin_photo.png) center no-repeat',
		            backgroundSize:'100%',
		            width:"10.625em",             //上传按钮的宽度
		            height:"10.625em",              //上传按钮的高度
		            float:'left',
		            top:'1.875em',
		            marginBottom:'1.875em'
		        },
		        uploadInputCss:{
		            width:"100%",             //上传按钮的宽度
		            height:"100%"             //上传按钮的高度
		        },
		        uploadBefore:function(){
		            if(!/\.((JPEG)|(jpeg)(jpg)|(JPG)|(png)|(PNG))$/i.test(this.value)){
		                popup('只允许上传.jpg .jpeg .png类型的图片文件');
		                return false ;
		            }
					if(comm.getFileSize(document.getElementById("uploadify"))>1048576*10){
						popup('图片不能大于10M');
						$(this).val("");
						return false ;
					}
					comm.loading.show();
		        },
		        uploadEnd:function(serverJson){//上传完毕后调用
					comm.loading.hide();
		            try{
		                serverJson = $.parseJSON($(serverJson).html());
		                if(serverJson.responseObject.responseStatus) {
		                	t.getImg();
		                	popup('上传成功');
		                }else{
							popup('上传失败');
							return ;
						}
		            }catch(e){
		                popup('上传失败');
		                return ;
		            }
		        }
		    });
		},
		//获取图片信息
		getImg:function(){
			var t=this;
			var data={};
			data.topicId=this.topicId;
			data.userFlag=1;
			data.attUseFlag=7;
			$.ajax({
				url:"/mcall/cms/topic/attachment/json_list/",
				data:data,
				type:"post",
				dataType:"json",
	            success:function(rep){
	            	if(rep.responseObject&&rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
	            		var html="";
	            		var imgList=rep.responseObject.responseData.data_list;
	            		$.each(imgList,function(i,val){
	    					html+="<div class='case_sc'><img class='img_view' src='"+val.topicAttUrl+"'/><div class='case_close' imgid='"+val.id+"'><img src='//img50.allinmd.cn/case/close.png'/></div></div>";
	    				});
	    				$("#img_list").html(html);
	    				if(imgList.length>=9){
	    					$("#uploadify").parent().hide();
	    				}
	    				t.imgHandle();
	    				
	            	}
	            }
			});
		},
		//已上传图片的点击和删除按钮的点击
		imgHandle:function(){
			var t=this;
			$(".case_close").on("vclick",function(){//删除
				var $parent=$(this).parents(".case_sc");
				var data={};
				var param={};
				data.id=$(this).attr("imgid");
				param.paramJson= $.toJSON(data);
				comm.loading.show();
				$.ajax({
					url:"/mcall/cms/topic/attachment/delete/",
					data:param,
					type:"post",
					dataType:"json",
		            success:function(rep){
		            	comm.loading.hide();
		            	if(rep.responseObject.responseStatus){
							popup("删除图片成功!");
							$parent.remove();
							if($(".case_sc").length<9){
		    					$("#uploadify").parent().show();
		    				}
		            	}else{
							popup("删除图片失败!");
		            	}
		            }
				});
			});
		},
		uploadSubmit:function(){
			var t=this;
			$("#upload_btn").on("vclick",function(){
				if($("#topic_name").val()||$("#topic_discuss").val()||$(".case_sc").length>0){
					t.setLocalStorage();
          g_sps.jump(null,pageurl.urlList.toTocClass.url);
				}else{
					popup('话题标题/讨论/照片请至少填写一项！');
				}
			});
		}
	};
	user.privExecute({
		operateType:'auth',
		callback:function(){
			topic.init();
		}
	});
	
});
