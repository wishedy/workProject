$(function(){
	var caseTag={};
	caseTag={
		init:function(){
			var t=this;
			this.scrollpage=2;
			this.pageSize=10;
			this.getInitTag();
			this.hasTagClick();
		},
		//
		initHandle:function(){
			var t=this;
			this.addTag();
			this.keyUp();
			$("#success").off("vclick").on("vclick",function(){
				t.setLocalStorage();
				//跳转到上传页
				//window.location.href=document.referrer;//pageurl.urlList.toCaseUpload.url;   TODO: 回退
				goBack(document.referrer);
			});
			this.getLocalStorage();
		},
		//初始化
		getInitTag:function(){
			var t=this;
			var url="/mcall/comm/data/tag/json_list/";
			var data={treeLevel:2,pageIndex:1,pageSize:100};
			//var param={};
			//param.paramJson= $.toJSON(data);
			$(".add_tag_li_loading").show();
			$.ajax({
				url: url,
				data:data,
	            type:"get",
	            dataType:"json",
	            success:function(data){
	            	$(".add_tag_li_loading").hide();
	            	if(data&&data.responseObject.responseStatus&&data.responseObject.responseData){
	            		$(".add_tag_li").html(t.addHtml(data));
	            		t.initHandle();
	            	}else{
	            		
	            	}
	            },
	            error:function(){
	            	popup("没有内容了");
					return false;
	            }
			});
		},
		addHtml:function(data){
			var html="";
			var dataRows=data.responseObject.responseData.data_list;
			$.each(dataRows,function(i,val){
				html+='<li select="no"><div class="add_tag_mr" tagid="'+val.id+'">'+val.tagName+'</div></li>';
			});
			return html;
		},
		addTag:function(){
			var t=this;
			//$(".add_tag_li li").attr("select","no");
			$(".add_tag_li li").off("vclick").on("vclick",function(){
				var $this=$(this);
				if($this.attr("select")=="no"){
					setTimeout(function(){
						if($("#tagList li").length<20){
							$this.attr("select","yes");
							$this.find("div").removeClass("add_tag_mr").addClass("add_tag_xz");
							$("#tagList li").each(function(i,em){
								if($(em).attr("tagid")==$this.find("div").attr("tagid")){
									$(em).remove();
								}
							});
							t.getTagHtml($this.find("div").attr("tagid"),$this.find("div").text());
						}
						
					},300)
				}else{
					setTimeout(function(){
						$this.attr("select","no");
						$this.find("div").removeClass("add_tag_xz").addClass("add_tag_mr");
						$("#tagList li").each(function(i,em){
							if($(em).attr("tagid")==$this.find("div").attr("tagid")){
								$(em).remove();
							}
						});
					},300)
					//t.setLocalStorage();
				}
			});
		},
		//已选tag点击事件
		hasTagClick:function(){
			$("#tagList li").die("vclick").live("vclick",function(){
				$("#seach_tag").focus();
				$(this).addClass("tag_li_hover");
			});
		},
		//键盘事件
		keyUp:function(){
			var t=this;
			this.input=$("#seach_tag");
			var val = "",val2 = "",changeInterval;
            t.input.on("focus",function(){

                changeInterval = setInterval(function(){
                    val2 = t.input.val();
                    if(val != val2){
                        changeHandler(t.input.val());
                    }
                },500);
            });
            t.input.on("blur",function(){
                clearInterval(changeInterval);
            });
            t.input.on("change",function(){
            	if(val != val2){
            		changeHandler(t.input.val());
            	}
            });
            function changeHandler(keyWord){
            	if(keyWord!=""){
					$(".add_tag_li").hide();
					$(".add_tag_li_loading").show();
					var data={searchParam:$("#seach_tag").val(),pageIndex:1,pageSize:t.pageSize};
					$.ajax({
						url: "/mcall/comm/data/tag/json_list/",
						data:data,
			            type:"get",
			            dataType:"json",
			            success:function(data){
			            	var html="";
			            	$(".add_tag_li_loading").hide();
			            	if(data&&data.responseObject.responseStatus&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length>0){
			            		$.each(data.responseObject.responseData.data_list,function(i,val){
			        				html+='<li><div class="add_tag_sr" tagid="'+val.id+'">'+val.tagName+'</div></li>';
			        			});
			            	}
			            	if($("#seach_tag").val()!==""){
			            		$(".add_tag_li_sr").show().html(html);
			            	}
			            	val = val2;
			            	t.seachClick();
			            }
					});
				}else{
					$(".add_tag_li_sr").hide().html("");
					$(".add_tag_li").show();
				}
            }
			$("#seach_tag").keyup(function(ev){
				//alert(ev.keyCode);   //13:enter键,188:逗号
				if($(this).val()!=""){
					if(ev.keyCode=="13"){
						if($(this).val().length>50){
							popup("标签最多50个字");
							return;
						}
						if($("#tagList li").length<20){
							t.getTagHtml(0,$(this).val());
							$(this).val("");
						}
					}
					if(ev.keyCode=="188"&&$(this).val().length>1){
						if($(this).val().length>50){
							popup("标签最多50个字");
							return;
						}
						if($("#tagList li").length<20){
							t.getTagHtml(0,$(this).val().substring(0,$(this).val().length-1));
							$(this).val("");
						}
					}
				}else{
					//删除
					if(ev.keyCode=="8"){
						setTimeout(function(){
							var hoverList=$("#tagList .tag_li_hover");
							if(hoverList.length>0){
								var last=hoverList.eq(hoverList.length-1);
								last.remove();
								$.each($(".add_tag_li li"),function(i,em){
									if($(em).find("div").attr("tagid")==last.attr("tagid")){
										$(em).attr("select","no");
										$(em).find("div").removeClass("add_tag_xz").addClass("add_tag_mr");
										return;
									}
								})
								return;
							}
							//已选标签列表
							var lastList=$("#tagList li").eq($("#tagList li").length-1);
							lastList.addClass("tag_li_hover");
						},300);
					}
				}
			});
		},
		//搜索列表点击
		seachClick:function(){
			var t=this;
			$(".add_tag_li_sr li").off("vclick").on("vclick",function(){
				$("#seach_tag").val("");
				var $this=$(this);
				var has=false;
				setTimeout(function(){
					$("#tagList li").each(function(i,em){
						if($(em).attr("tagid")==$this.find("div").attr("tagid")){
							$(em).remove();
							has=true;
							return;
						}
					});
					$.each($(".add_tag_li li"),function(i,em){
						if($(em).find("div").attr("tagid")==$this.find("div").attr("tagid")){
							if($(em).attr("select")=="no"){
								$(em).attr("select","yes");
								$(em).find("div").removeClass("add_tag_mr").addClass("add_tag_xz");
							}else{
								$(em).attr("select","no");
								$(em).find("div").removeClass("add_tag_xz").addClass("add_tag_mr");
							}
						}
					});
					if(!has){
						if($("#tagList li").length<20){
							t.getTagHtml($this.find("div").attr("tagid"),$this.find("div").text());
						}
					}
				},300)
			})
		},
		//点击完成并且存储localStorage
		setLocalStorage:function(){
			var tag={};
			tag.tagContent=[];
			if($("#tagList li").length>0){
				$("#tagList li").each(function(i,em){
					var tagId=$(em).attr("tagid");
					var tagName=$(em).find("div").text();
					
					tag.tagContent.push([tagId,tagName]);
				});
				localStorage.setItem("tagStorage", JSON.stringify(tag));
			}else{
				TempCache.removeItem("tagStorage");
			}
			
		},
		//获取localStorage
		getLocalStorage:function(){
			var t=this;
			if(localStorage.getItem("tagStorage")){
				var tag=JSON.parse(localStorage.getItem("tagStorage"));
				tagContent=tag.tagContent;
				$.each(tagContent,function(i,n){
					t.getTagHtml(tagContent[i][0],tagContent[i][1]);
					$.each($(".add_tag_li li"),function(j,em){
						if(tagContent[i][0]==$(em).find("div").attr("tagid")){
							$(em).attr("select","yes");
							$(em).find("div").removeClass("add_tag_mr").addClass("add_tag_xz");
						}
					})
				});
			}
		},
		getTagHtml:function(tagId,tagName){
			$("#tagList").append("<li class='tag_li_link' tagid="+tagId+"><div class='tag_text'>"+tagName+"</div></li>");
		}
	};
	
	caseTag.init();
	
});
