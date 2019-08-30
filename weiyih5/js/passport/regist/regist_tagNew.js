$(function(){
	var selectTag={};
	selectTag={
		init:function(){
			this.getTag();
			this.fromPage = TempCache.getItem('fromPageN');
		},
		//数据初始化
		getTag:function(){
			var t=this;
			var html="";
			comm.loading.show();
			$.ajax({
				url:commdata.urlList.tagJsonList.url,
				data : {treeLevel:"2",pageIndex:1,pageSize:50,platformId:comm.getpara().platformId||1},
				type:"get",
				dataType:"json",
				timeout:10000,
				success : function(rep){
					comm.loading.hide();
					if(rep&&rep.responseObject.responseStatus){
						var tName="";
						var len=0;
						$.each(rep.responseObject.responseData.data_list,function(i,val){
							html+='<span tagId="'+val.id+'">'+comm.getStrLen(val.tagName,40)+'</span>';
						});
					}
					$("#expertList").html(html);
					t.tagOnclick();
				}
			});
		},
	    tagOnclick:function(){
			var t=this;
	    	$("#expertList span").attr("select","no");
	    	$("#expertList span").on("click",function(){
	    		var $this=$(this);
    			if($this.attr("select")=="no"){
					$this.attr("select","yes");
					$this.addClass("active");
	    		}else{
	    			$this.attr("select","no");
					$this.removeClass("active");
	    		}
				if($("#expertList span.active").length){
					$('.ev_nextStep').addClass('active').off('click').on('click',function(){
						comm.creatEvent({
							triggerType:'全站功能按钮点击',
							keyword:'选择标签页-下一步',
							actionId:44
						});
						t.createFollowTag();
					});
				}else{
					$('.ev_nextStep').removeClass('active');
				}
	    	});
	    },
	    createFollowTag:function(){
			var t=this;
			var tagIds="";
			var tagNames="";
			var tagId="",tagName="";
			$("#expertList span.active").each(function(i,em){
					tagId=$(em).attr("tagid");
					tagName=$(em).text();
					tagIds+=tagId+",";
					tagNames+=tagName+",";
			});
			if(tagIds!=""){
				tagIds=tagIds.substring(0,tagIds.length-1);
			}
			if(tagNames!=""){
				tagNames=tagNames.substring(0,tagNames.length-1);
			}
			//跳转到上传页
			if(tagIds.length>0){
				comm.loading.show();
				//如果是微信浏览器
				var result=comm.isWeiXin();
				var flag=comm.getpara().flag;
				//if(result && flag!="1"){
				//	//var name=comm.getpara().name;
				//	//g_sps.jump(null,"/pages/wx/welcome.html?name="+name); 之前用于绑定公众号而设置，现在有绿屏不存在此步骤；
				//	window.location.href="/";
				//}else{
					//$.ajax({
					//	url:M_CALL+"customer/follow/resource/create/",
					//	type:"post",
					//	data:{paramJson:$.toJSON({"followType":61,"customerId":TempCache.getItem('userId'),"refId":tagIds,"refName":tagNames})},
					//	dataType:"json",
					//	async:false,
					//	success:function(){
                    //
					//	}
					//});
					customer.asyncExecute("createFollowResource",{dataFlag:2,refId:tagIds,refName:tagNames,followType:6},function(rep){
						comm.loading.hide();
						if(TempCache.getItem('needAuthRegist')=="need"){//需要认证并认证成功
							TempCache.setItem('needAuthCompleted','needAuthCompleted');
						}
						if(t.fromPage==null||t.fromPage=='null'){
							user.success("注册成功，即将返回首页");
						}else{
							popup('注册成功，即将返回来源页');
              g_sps.jump(null, t.fromPage);
							//user.success("注册成功，即将返回来源页");
						}
					});
				//}
			}else{
				popup("请选择专业!");
			}
		}
	};
	selectTag.init();
});


