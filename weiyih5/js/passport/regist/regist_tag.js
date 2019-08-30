$(function(){
	var selectTag={};
	selectTag={
		init:function(){
			this.getTag();
			this.bindReturnBtn();
		},
		//取消
		bindReturnBtn: function () {
            var t = this;
            comm.history.setFrom();
            $(".quxiao").on("vclick", function () {
				var _href= TempCache.getItem('fromPage');
            	if(_href&&_href.indexOf('/html/')>-1){
					comm.redirect(_href,0);
					TempCache.removeItem('fromPage');
				}else{
					comm.redirect("/",0);
				}

            });
        },
		//数据初始化
		getTag:function(){
			var t=this;
			var html="";
			$.mobile.loading("show");
			$.ajax({
				url:commdata.urlList.tagJsonList.url,
				data : {treeLevel:"2",pageIndex:1,pageSize:50,platformId:comm.getpara().platformId},
				type:"get",
				dataType:"json",
				timeout:10000,
				success : function(rep){
					$.mobile.loading("hide");
					if(rep&&rep.responseObject.responseStatus){
						var tName="";
						var len=0;
						$.each(rep.responseObject.responseData.data_list,function(i,val){
							tName = comm.getStrLen(val.tagName,30);
							len = tName.length;
							if(len>5&&len<=10){
								tName = tName.substring(0,parseInt(len/2))+'<br/>'+tName.substring(parseInt(len/2));
							}else if(len>10&&len<15){
								tName = tName.substring(0,parseInt(len/3))+'<br/>'+tName.substring(parseInt(len/3),2*parseInt(len/3))+"<br/>"+tName.substring(2*parseInt(len/3));
							}else if(len>=15){
								tName = tName.substring(0,parseInt(len/3))+'<br/>'+tName.substring(parseInt(len/3),2*parseInt(len/3))+"<br/>"+tName.substring(2*parseInt(len/3))+"..";
							}
							html+='<li tagid="'+val.id+'"><div class="text" >'+tName+'</div></li>';
						});
					}
					$("#expertList").html(html);
					$("#expertList li").height( $("#expertList li:eq(0)").width());
					t.tagOnclick();
					t.createFollowTag();
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
    				},100);
	    		}else{
	    			setTimeout(function(){
		    			$this.attr("select","no");
		    			$this.removeClass("active");
	    			},100);
	    		}
	    	});
	    },
	    createFollowTag:function(){
			var tagIds="";
			var tagNames="";
			$("#success").on("vclick",function(){                  $("#expertList li").each(function(i,em){
					if($(em).attr("select")=="yes"){
						var tagId=$(em).attr("tagid");
						var tagName=$(em).find("div").text();
						tagIds+=tagId+",";
						tagNames+=tagName+",";
					}
				});
				if(tagIds!=""){
		        	tagIds=tagIds.substring(0,tagIds.length-1);
		        }
		        if(tagNames!=""){
		        	tagNames=tagNames.substring(0,tagNames.length-1);
		        }
				//跳转到上传页
				if(tagIds.length>0){
					$.mobile.loading("show");
					//如果是微信浏览器
					var result=WeixinJSApi.is_weixin();
					var flag=comm.getpara().flag;
					//if(result && flag!="1"){
					//	//var name=comm.getpara().name;
					//	//g_sps.jump(null,"/pages/wx/welcome.html?name="+name); 之前用于绑定公众号而设置，现在有绿屏不存在此步骤；
					//	window.location.href="/";
					//}else{
						customer.asyncExecute("createFollowResource",{dataFlag:2,refId:tagIds,refName:tagNames,followType:6},function(rep){
							$.mobile.loading("hide");
							user.success("认证成功，即将返回来源页");
						});
					//}
				}else{
					popup("请选择专业!");
				}
				
			});
			
		}
	
	};
	
	selectTag.init();
})

/**
 * 微信分享
 */
function initShareWeixin(){
	window.weiXinTitle="我发现了一个很专业的医生社区。一起来看看吧。";	
	window.weiXinDesc="唯医网是专门的医生互动社区。更汇集海量手术视频、病例讨论、会议回放哦～";
}
initShareWeixin();

