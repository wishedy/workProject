$(function(){
	var tocClass={};
	tocClass={
		init:function(){
			//this.getTag();
			this.classSelect();
			this.getLocalStorage();
			this.uploadSubmit();
		},
		//话题类别点击
		classSelect:function(){
			var t=this;
			t.type=1;
			//专业话题点击
			$("#spe_btn").on("vclick",function(){
				//setTimeout(function(){
					$("#type1").hide();
					$("#type2").show();
					t.type=2;
				//},300);
			});
			//随便聊聊
			$("#cas_btn").on("vclick",function(){
				$("#type1").show();
				$("#type2").hide();
				t.type=1;
			});
		},
		//tag数据初始化
		getTag:function(){
			var t=this;
			var html="";
			var data={};
			data.treeLevel=2;
			data.pageIndex=1;
			data.pageSize=100;
			//var param={};
			//param.paramJson= $.toJSON(data);
			comm.loading.show();
			$.ajax({
				url:"/mcall/comm/data/tag/json_list/",
				data : data,
				type:"get",
				dataType:"json",
				timeout:10000,
				success : function(rep){
					comm.loading.hide();
					if(rep&&rep.responseObject.responseStatus){
						$.each(rep.responseObject.responseData.data_list,function(i,val){
							html+='<li tagid="'+val.id+'"><div class="text" >'+val.tagName+'</div></li>';
						});
						
					}
					$("#expertList").html(html);
					$("#expertList li").height( $("#expertList li:eq(0)").width());
					marginLeft=($("#expertList").width()/100-4*$("#expertList li").eq(0).width()/100)*$(".content-page").width()/9;
					$("#expertList li").css({marginLeft:marginLeft,marginRight:marginLeft});
					t.tagOnclick();
					t.getLocalStorage();
					t.uploadSubmit();
				}
			});
			
			
		},
	    tagOnclick:function(){
	    	$("#expertList li").attr("select","no");
	    	$("#expertList li").on("vclick",function(){
	    		var $this=$(this);
    			if($this.attr("select")=="no"){
    				setTimeout(function(){
	    				$this.attr("select","yes");
	    				$this.addClass("active");
    				},300);
	    		}else{
	    			setTimeout(function(){
		    			$this.attr("select","no");
		    			$this.removeClass("active");
	    			},300);
	    		}
	    	});
	    },
		//获取localStorage
		getLocalStorage:function(){
			var t=this;
			t.tagList="";
			if(localStorage.getItem("tocTagStorage")){
				var tag=JSON.parse(localStorage.getItem("tocTagStorage"));
				tagContent=tag.tagContent;
				$.each(tagContent,function(i,n){
					tagname=tagContent[i][0]+'_'+tagContent[i][1]+",";
					t.tagList+=tagname;
					/*$.each($("#expertList li"),function(j,em){
						if(tagContent[i][0]==$(em).attr("tagid")){
							$(em).attr("select","yes");
							$(em).addClass("active");
						}
					})*/
				})
			}
		},
		uploadSubmit:function(){
			var t=this;
			$("#upload_btn").attr("on","true");
			$("#upload_btn").on("vclick",function(){
				if($(this).attr("on")=="true"){
					if(localStorage.getItem('topicStorage')){

						var topicCon=JSON.parse(localStorage.getItem('topicStorage'));
						var content=[];
						var data={};
						var param={};
						data.topicId=topicCon.topicId;
						data.platformId = TempCache.getItem('department');
						data.isValid=1;
						data.isDraft=0;//非草稿箱
						data.topicName=topicCon.topicName;
						var topicDiscuss=topicCon.topicDiscuss[0];
						data.topicType=t.type;
						content.push({"content":topicDiscuss,"contentType":"0","topicAttName":""});
						var imgList=topicCon.imgList;
						$.each(imgList,function(i,val){
							content.push({"content":val.src.replace("_c_t_200_200",""),"contentType":"1","topicAttId":val.topicAttId,"topicAttName":""});
						});
						data.contentJson= content;
						if(t.type==2){//专业话题
							/*var tagList='';
							 $("#expertList li").each(function(i,em){
							 if($(em).attr("select")=="yes"){
							 tagname=$(em).attr("tagid")+'_'+$(em).find("div").text()+",";
							 tagList+=tagname;
							 }
							 });*/
							data.tagList=t.tagList.substring(0, t.tagList.length-1);
							/*if(!data.tagList){
							 popup("请至少选择一个学组！");
							 return;
							 }*/
						}else{
							data.tagList=t.tagList.substring(0, t.tagList.length-1);
						}
						//提醒
						if(localStorage.getItem("tocAttStorage")){
							var attention=JSON.parse(localStorage.getItem("tocAttStorage"));
							attContent=attention.attContent;
							var idList="";
							$.each(attContent,function(i,n){
								idList+=attContent[i][0]+",";
							});
							data.refCustomerIdList=idList.substring(0,idList.length-1);
						}

						//TODO 新版活动增加参数
						var activity=JSON.parse(localStorage.getItem("activity"));
						if(activity){
							data.activityId= activity.activityId;          //是否活动上传  不传表示普通上传
							data.property= activity.property;//JSON.stringify(activity.property);              //新版活动类别
							data.property_area= activity.property_area;//JSON.stringify(activity.property_area);    //新版活动赛区参数
						}
						param.paramJson= $.toJSON(data);
						comm.loading.show();
						$("#upload_btn").attr("on","false");
						//话题提交
						$.ajax({
							url:"/mcall/cms/topic/base/update/",
							data:param,
							type:"post",
							dataType:"json",
							success:function(rep){
								$("#upload_btn").attr("on","true");
								comm.loading.hide();
								if(rep.responseObject.responseStatus){
									popup("话题发布成功!");
									//置空localStorage
									//TempCache.removeItem("prevTopicHref");
									TempCache.removeItem("topicStorage");
									TempCache.removeItem("tocTagStorage");
									TempCache.removeItem("tocAttStorage");
									TempCache.removeItem("activity");              //清楚活动的缓存
									var da={topicId:data.topicId};
									var param={};
									param.paramJson= $.toJSON(da);
									//获取话题终端页
									$.ajax({
										url:"/mcall/cms/topic/base/info/",
										data:param,
										type:"post",
										dataType:"json",
										success:function(rep){
											if(rep.responseObject.responseData.data_list){
                        g_sps.jump(null,rep.responseObject.responseData.data_list[0].cms_topic.webStoragePath.replace("https:",""));
												return ;
											}
										}
									});
								}else{
									popup("话题发布失败!");
								}

							}
						});

					}
				}

			});
		}
	};
	
	
	tocClass.init();
})
