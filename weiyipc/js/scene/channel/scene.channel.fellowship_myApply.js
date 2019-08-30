// JavaScript Document
$(function(){

	var fellowship={};
	fellowship={
		init:function(){
			this.fellowshipMainId=comm.getpara().fellowshipMainId;
			this.customerId=$("#sesCustomerId").val();
			this.isLogin();
			this.defaultDown();
			this.uploadResume();
			this.uploadRecommend();
			this.downAndUp();
			this.mouse();
			this.addBase();
			this.editBase();	
			this.editResume();
			this.editRecommend();
			this.applySubmit();
		},
		
		
		//判断登录与否
		isLogin:function(){
			if(!this.customerId){
				$(".f_content").eq(0).show();
				$(".f_content").eq(1).hide();	
			}else{
				$(".f_content").eq(0).hide();
				$(".f_content").eq(1).show();	
			}	
			$("#login_btn").on("click",function(){
				user.login({
					callback:function(){
						location.reload();
					},
					scene:privilegeSceneConst.eSceneTypeLogin
				})	
			})
		},
		//默认展开
		defaultDown:function(){
			index=comm.getpara().index;
			$.each($(".floor01"),function(i,em){
				if(i==index){
					down=$(em).find(".down");
					down.attr("src","//img00.allinmd.cn/fellow/jy_jt_s.jpg").attr("isup","true");
					down.removeClass("down").addClass("up");
					if($(em).find(".floor01_02").attr("class")=="floor01_02"){
						$(em).find(".floor01_02").css("height",448);	
					}else{
						$(em).find(".floor01_04").css("height",41);	
					}
				}
			})	
		},
		//展开和收起
		downAndUp:function(){
			if(this.fellowshipMainId=="1429334288079"){//拜耳
				h=294;
			}else{//进修
				h=448;
			}
			$(".down").attr("isup","false");
			$(".down").live("click",function(){
				if($(this).attr("isUp")=="false"){
					var $this=$(this);
					$(this).attr("src","//img00.allinmd.cn/fellow/jy_jt_s.jpg");
					$(this).removeClass("down").addClass("up");	
					if($(this).parents(".floor01").find(".floor01_02").attr("class")=="floor01_02"){
						$(this).parents(".floor01").find(".floor01_02").animate({height:h},800,function(){
							$this.attr("isup","true");	
						});	
					}else{
						$(this).parents(".floor01").find(".floor01_04").animate({height:41},200,function(){
							$this.attr("isup","true");	
						});		
					}
				}
			});
			$(".up").live("click",function(){
				if($(this).attr("isup")=="true"){
					var $this=$(this);
					$(this).attr("src","//img00.allinmd.cn/fellow/jy_jt_x.jpg");	
					$(this).removeClass("up").addClass("down");	
					if($(this).parents(".floor01").find(".floor01_02").attr("class")=="floor01_02"){
						$(this).parents(".floor01").find(".floor01_02").animate({height:0},800,function(){
							$this.attr("isUp","false");	
						});
					}else{
						$(this).parents(".floor01").find(".floor01_04").animate({height:0},200,function(){
							$this.attr("isup","false");	
						});		
					}	
				}
			})		
		},
		//未完善前的鼠标移入和移出
		mouse:function(){
			$.each($(".ws"),function(i,em){
				$(em).on("mouseover",function(){
					$(".ws").removeClass("wanshan_click").addClass("wanshan_normal");
					$(this).removeClass("wanshan_normal").addClass("wanshan_click");	
				});
				$(em).on("mouseout",function(){
					$(this).removeClass("wanshan_click").addClass("wanshan_normal");
				});	
			})	
		},
		//完善报名基本信息
		addBase:function(){
			var t=this;
			$(".fellow_base").on("click",function(){
				if(t.fellowshipMainId=="1429334288079") {//拜耳
					has=1;
				}else{
					has=0;
				}
				addHtml(fellowBase(has));
				if(has){
					$("#company").text($(".fellowName").eq(0).text().split("-")[1]);
					ymd({
						year:$("#syear"),
						month:$("#smonth"),
						day:$("#sday"),
						startYear:2015,
						startMonth:5,
						endMonth:10,
						startDay:20,
						endDay:30
					});
					ymd({
						year:$("#eyear"),
						month:$("#emonth"),
						day:$("#eday"),
						startYear:2015,
						startMonth:5,
						endMonth:10,
						startDay:20,
						endDay:30
					});
				}
				//省市区联动
				$(".select_cont").ProvinceCity({
					province:'110000',
					city:'110100',
					district:'110101',
					provinceChange:function(){
						$("#provinceId").val($(".province option:selected").attr("provinceid"));	
						$("#cityId").val($(".city option:selected").attr("cityid"));
						$("#districtId").val($(".district option:selected").attr("districtid"));		
					},
					cityChange:function(){
						$("#cityId").val($(".city option:selected").attr("cityid"));
						$("#districtId").val($(".district option:selected").attr("districtid"));	
					},
					districtChange:function(){
						$("#districtId").val($(".district option:selected").attr("districtid"));	
					}	
				});
				$('input, textarea').placeholder();
				$("#save").on("click",function(){
					$("#base").submit();	
				});
				t.valid($(this));
				$("#cancel").on("click",function(){
					if($("#mobile").val()||$("#email").val()||$("#weixinCode").val()||$("#detailAddress").val()||$("#zipCode").val()){
						$(".cancel_mask").show();
						$(".jxl_after").show();	
					}else{
						closeShade();
					}
				});
				$("#continue_write").on("click",function(){
					$(".cancel_mask").hide();
					$(".jxl_after").hide();	
				});
				$("#cancel_write").on("click",function(){
					closeShade();
				});
			});	
		},
		//修改报名基本信息
		editBase:function(){
			var t=this;
			$(".fellow_base_edit").on("click",function(){
				if(t.fellowshipMainId=="1429334288079") {//拜耳
					has=1;
				}else{
					has=0;
				}
				addHtml(fellowBase(has));
				if(has){
					$("#company").text($(".fellowName").eq(0).text().split("-")[1]);
					ymd({
						year:$("#syear"),
						month:$("#smonth"),
						day:$("#sday"),
						startYear:2015,
						startMonth:5,
						endMonth:10,
						startDay:20,
						endDay:30
					});
					ymd({
						year:$("#eyear"),
						month:$("#emonth"),
						day:$("#eday"),
						startYear:2015,
						startMonth:5,
						endMonth:10,
						startDay:20,
						endDay:30
					});
				}
				var param={};
				param.paramJson = $.toJSON({id:$(this).attr("shipid")});
				id=$(this).attr("shipid");
				$.ajax({
					url:PC_CALL+"customer/fellowship/base/info/",
					dataType:"json",
					type:"post",
					data:param,
					success:function(rep){	
						if(rep&&rep.responseObject.responseData.data_list[0]){
							//省市区联动
							var info=rep.responseObject.responseData.data_list[0].customer_fellowship;
							if(has){
								gettime($("#syear"),info.statYear);
								gettime($("#smonth"),info.statMonth);
								gettime($("#sday"),info.statDay);
								gettime($("#eyear"),info.endYear);
								gettime($("#emonth"),info.endMonth);
								gettime($("#eday"),info.endDay);
							}
							$("#mobile").val(info.mobile);
							$("#email").val(info.email);
							$("#weixinCode").val(info.weixinCode);
							$("#provinceId").val(info.provinceId);
							$("#cityId").val(info.cityId);
							$("#districtId").val(info.districtId);
							$("#detailAddress").val(info.detailAddress);
							$("#zipCode").val(info.zipCode);
							$(".select_cont").ProvinceCity({
								province:info.provinceId,
								city:info.cityId,
								district:info.districtId,
								provinceChange:function(){
									$("#provinceId").val($(".province option:selected").attr("provinceid"));	
									$("#cityId").val($(".city option:selected").attr("cityid"));
									$("#districtId").val($(".district option:selected").attr("districtid"));		
								},
								cityChange:function(){
									$("#cityId").val($(".city option:selected").attr("cityid"));
									$("#districtId").val($(".district option:selected").attr("districtid"));	
								},
								districtChange:function(){
									$("#districtId").val($(".district option:selected").attr("districtid"));	
								}	
							});	
						}
					}	
				});
				$('input, textarea').placeholder();
				$("#save").on("click",function(){
					$("#base").submit();	
				});
				t.valid($(this));
				$("#cancel").on("click",function(){
					if($("#mobile").val()||$("#email").val()||$("#weixinCode").val()||$("#detailAddress").val()||$("#zipCode").val()){
						$(".cancel_mask").show();
						$(".jxl_after").show();	
					}else{
						closeShade();
					}
				});
				$("#continue_write").on("click",function(){
					$(".cancel_mask").hide();
					$(".jxl_after").hide();	
				});
				$("#cancel_write").on("click",function(){
					closeShade();
				});
			});		
		},
		valid:function($this){
			var t=this;
			$("#base").validate({
				submitHandler : function() {

					var data={};
					var param={};
					data.id=$this.attr("shipid");
					data.mobile=$("#mobile").val();
					data.email=$("#email").val();
					data.weixinCode=$("#weixinCode").val();
					data.provinceId=$("#provinceId").val();
					data.province=$(".province option:selected").val();
					data.cityId=$("#cityId").val();
					data.city=$(".city option:selected").val();
					data.districtId=$("#districtId").val();
					data.district=$(".district option:selected").val();
					data.detailAddress=$("#detailAddress").val();
					data.zipCode=$("#zipCode").val();
					if(t.fellowshipMainId=="1429334288079") {//拜耳
						data.statYear=$("#syear option:selected").val();
						data.statMonth=$("#smonth option:selected").val();
						data.statDay=$("#sday option:selected").val();
						data.endYear=$("#eyear option:selected").val();
						data.endMonth=$("#emonth option:selected").val();
						data.endDay=$("#eday option:selected").val();
						if(!checkEndTime(data.statYear+"-"+data.statMonth+"-"+data.statDay,data.endYear+"-"+data.endMonth+"-"+data.endDay)){
							alert("意向结束时间应大于开始时间");
							return;
						}
					}
					param.paramJson = $.toJSON(data);
					comm.LightBox.showloading();
					$.ajax({
						url:PC_CALL+"customer/fellowship/base/update/",
						dataType:"json",
						type:"post",
						data:param,
						success:function(rep){	
							if(rep&&rep.responseObject.responseStatus){
								comm.LightBox.hideloading();
								closeShade();
								addHtml(saveSuccess());
								timer=setInterval(function(){
									closeShade();
									$this.parents(".ws").find(".ws_default").hide();
									$this.parents(".ws").find(".ws_edit").show();
									$this.parents(".ws").find(".status").val(1);
									$this.parents(".wanshan_normal").addClass("wanshan_after").removeClass("ws").removeClass("wanshan_normal");
									$this.parents(".wanshan_click").addClass("wanshan_after").removeClass("ws").removeClass("wanshan_click");
									
									t.applyBtnShow($this);
									clearInterval(timer);
								},3000);	
							}
						}
					})
				},
				rules : {
					"email" : {
						"required" : true,
						"allinEmail" : true,
						"rangelength": [ 1, 50 ]
					},
					"mobile":{
						"required":true,
						"mobile":true	
					},
					"zipCode":{
						"required":true,
						"zip":true		
					},
					"detailAddress":{
						"required":true,
						"rangelength":[1,50]
					}
				},
				messages : {                                                            
					"email" : {
						"required" : "你的邮件是什么？",
						"allinEmail" : "不像是有效的电子邮箱。",
						"rangelength":"邮件地址不长于50位！"
					},
					"mobile":{
						"required":"请输入手机号!",
						"mobile":"请输入正确的手机号!"	
					},
					"zipCode":{
						"required":"请输入邮政编码!",
						"zip":"请输入正确的邮政编码!"		
					},
					"detailAddress":{
						"required":"请填写具体地址！",
						"rangelength":"具体地址最长50个汉字"	
					}
				},
				showErrors : poshyTipShowErrors,
           		hideErrors : poshyTipHideErrors
			})	
		},
		//简历编辑按钮
		editResume:function(){
			var t=this;
			$(".resume_edit").on("click",function(){
				addHtml(resumeShade());
				$(".tc_but02 a").attr("href",$(this).attr("docUrl"));
				data={customerId:t.customerId,fellowshipId:$(this).attr("fellowshipId"),useFlag:'2'};
				
				$.ajax({
					url:PC_CALL+"customer/fellowship/attachment/json_list/",
					dataType:"json",
					type:"post",
					data:data,
					success:function(rep){	
						if(rep&&rep.responseObject.responseData.data_list){
							var html="";
							var id;
							$.each(rep.responseObject.responseData.data_list,function(i,val){
								info=val.customer_fellowship_attachment;
								id=info.id;
								attFormat=info.fellowshipAttFormat.toLowerCase();
								if(attFormat=="doc".toLowerCase()||attFormat=="docx".toLowerCase()){
									img="word";	
								}
								if(attFormat=="ppt".toLowerCase()||attFormat=="pptx".toLowerCase()){
									img="ppt";	
								}
								if(attFormat=="pdf".toLowerCase()){
									img="pdf";	
								}
								if(info.fellowshipAttName.split(".")[0].length>15){
									name=info.fellowshipAttName.split(".")[0].substring(0,16)+"...";	
								}else{
									name=info.fellowshipAttName.split(".")[0];		
								}
								html+='<div class="tc_bg_bg">'+
								'<div class="wd_lx"><img src="//img00.allinmd.cn/fellow/'+img+'.png" /></div>'+
								'<div class="wd_text">'+
									'<div>'+name+'</div>'+
									'<div>'+info.createTime.substring(0,10)+'</div>'+
								'</div>'+
								'<div class="clear"></div>'+
							'</div>';	
							});	
							$(".resume_list").html(html);
							t.newUpload("newResume","update",{id:id},"fellow/tc_cx_sc.png");	
						}
					}	
				});
			})	
		},
		//推荐信编辑按钮
		editRecommend:function(){
			var t=this;
			$(".recommend_edit").on("click",function(){
				var $that=$(this);
				docUrl=$(this).attr("docUrl");
				addHtml(recommendShade());
				$(".tc_but02 a").attr("href",docUrl);
				data={customerId:t.customerId,fellowshipId:$(this).attr("fellowshipId"),useFlag:'3'};
				t.newUpload("conRecommend","create",data,"fellow/jx_sc.png");
				$.ajax({
					url:PC_CALL+"customer/fellowship/attachment/json_list/",
					dataType:"json",
					type:"post",
					data:data,
					success:function(rep){	
						var html="";
						if(rep.responseObject.responseData.data_list.length>=10){
							$("#conRecommend").parent().hide();
							$(".jx_sc").show();	
						}
						$.each(rep.responseObject.responseData.data_list,function(i,val){
							info=val.customer_fellowship_attachment;
							attFormat=info.fellowshipAttFormat.toLowerCase();
							if(attFormat=="doc".toLowerCase()||attFormat=="docx".toLowerCase()){
								img="word";	
							}
							if(attFormat=="ppt".toLowerCase()||attFormat=="pptx".toLowerCase()){
								img="ppt";	
							}
							if(attFormat=="pdf".toLowerCase()){
								img="pdf";	
							}
							if(info.fellowshipAttName.split(".")[0].length>15){
								name=info.fellowshipAttName.split(".")[0].substring(0,16)+"...";	
							}else{
								name=info.fellowshipAttName.split(".")[0];		
							}
							html+='<div class="tc_bg_bg">'+
							'<div class="wd_lx"><img src="//img00.allinmd.cn/fellow/'+img+'.png" /></div>'+
							'<div class="wd_text">'+
								'<div>'+name+'</div>'+
								'<div>'+info.createTime.substring(0,10)+'</div>'+
							'</div>'+
							'<div class="tc_delete" delid='+info.id+'>删除</div>'+
							'<div class="clear"></div>'+
						'</div>';	
						});	
						$(".recom_list").html(html);
						
						$(".tc_delete").on("click",function(){
							var $this=$(this)
							$(".cancel_mask").show();
							$(".jxl_after").show();	
							$("#delete").off("click").on("click",function(){
								comm.LightBox.showloading();
								var param={};
								var da={};
								da.id=$this.attr("delid");
								param.paramJson = $.toJSON(da);
								$.ajax({
									url:PC_CALL+"customer/fellowship/attachment/delete/",
									dataType:"json",
									type:"post",
									data:param,
									success:function(rep){	
										if(rep.responseObject.responseStatus){
											comm.LightBox.hideloading();
											$("#lightbox").css("z-index",9);
											$(".cancel_mask").hide();
											$(".jxl_after").hide();
											$this.parents(".tc_bg_bg").remove();
											if($(".tc_bg_bg").length>0&&$(".tc_bg_bg").length<10){
												$("#conRecommend").parent().show();
												$(".jx_sc").hide();		
											}	
											if($(".tc_bg_bg").length==0){
												$that.parents(".wanshan_after").find(".ws_default").show();
												$that.parents(".wanshan_after").find(".uploadIng").hide();
												$that.parents(".wanshan_after").find(".recommend").parent().show();
												$that.parents(".wanshan_after").find(".ws_edit").hide();
												$that.parents(".wanshan_after").addClass("wanshan_normal").addClass("ws").removeClass("wanshan_after");
												$that.parents(".floor01").find(".status").eq(3).val(2);
												t.applyBtnShow($that);
												closeShade();
												addHtml(noRecommend());
												$(".tc_but02 a").attr("href",docUrl);
												t.newUpload("newRecommend","create",data,"fellow/tc_cx_sc.png",function(){
													$that.parents(".ws").find(".ws_default").hide();
													$that.parents(".ws").find(".ws_edit").show();
													$that.parents(".ws").find(".status").val(1);
													$that.parents(".wanshan_normal").addClass("wanshan_after").removeClass("ws").removeClass("wanshan_normal");
													$that.parents(".wanshan_click").addClass("wanshan_after").removeClass("ws").removeClass("wanshan_click");
													t.applyBtnShow($that);	
												});	
											}
											alert("删除成功");
										}
									}	
								});
							});	
						});
					}	
				});	
				
				$("#cancel_del").on("click",function(){
					$(".cancel_mask").hide();
					$(".jxl_after").hide();	
				});
			})	
		},
		//提交申请
		applySubmit:function(){
			$(".can_submit").on("click",function(){
				var $this=$(this);
				addHtml(apply());
				$(".apply_con").on("click",function(){
					closeShade();
					$this.hide();
					$this.next().show();
					var data={};
					var param={};
					data.id=$this.attr("shipid");
					data.state=2;
					param.paramJson = $.toJSON(data);
					$.ajax({
						url:PC_CALL+"customer/fellowship/base/update/",
						dataType:"json",
						type:"post",
						data:param,
						success:function(rep){	
							if(rep&&rep.responseObject.responseStatus){
								$this.parents(".floor01").find(".zt_text_normal").text("等待初审");	
								$this.parents(".floor01").find(".floor01_04").css("height",41);
								$this.parents(".floor01_02").remove();
							}
						}
					})	
				});
				$(".no_apply").on("click",function(){
					closeShade();
				})	
			})	
		},
		uploadResume:function(){
			var t=this;
			fellowshipid="";
			$.each($(".resume"),function(i,em){
				fellowshipid=$(em).attr("fellowshipId");
				czyx.uploadReplace("#"+$(em).attr("id"),{
					url:PC_CALL+"customer/fellowship/attachment/create/", //文件处理的URL
					data:{customerId:t.customerId,fellowshipId:fellowshipid,useFlag:'2'},
					uploadReplaceCss:{
						//设置上传按钮图片
						background:'url(//img00.allinmd.cn/fellow/sc_jl.png) center no-repeat',
						width:75,             //上传按钮的宽度
						height:25              //上传按钮的高度
					},
					uploadInputCss:{
						width:75,             //上传按钮的宽度
						height:25              //上传按钮的高度
					},
					uploadBefore:function(){
						if(!/\.((doc)|(docx)|(pdf)|(ppt)|(pptx))$/i.test(this.value)){
							alert('只允许上传.doc .docx .pdf .ppt .pptx类型的文档文件');
							return false ;
						}
						var fileSize =comm.file.getFileSize(document.getElementById($(em).attr("id")));
						if(fileSize>10485760){
							alert('文件不能大于'+10485760/1048576+"M");
							$(this).val("");
							return false;
						}
						$(this).parent().hide();
						$(this).parent().next().show();
					},
					uploadEnd:function(serverJson){//上传完毕后调用
						try{
							resulteJson = $.parseJSON(serverJson);
							if(resulteJson.result) {
								$(this).val("");
								$(this).parents(".ws").find(".ws_default").hide();
								$(this).parents(".ws").find(".ws_edit").show();
								$(this).parents(".ws").find(".status").val(1);
								$(this).parents(".wanshan_normal").addClass("wanshan_after").removeClass("ws").removeClass("wanshan_normal");
								$(this).parents(".wanshan_click").addClass("wanshan_after").removeClass("ws").removeClass("wanshan_click");
								t.applyBtnShow($(this));
								alert("上传成功");
							}
						}catch(e){
							alert('上传失败');
							return ;
						}
						
					}
				});		
			});
		},
		uploadRecommend:function(){
			var t=this;
			fellowship="";
			$.each($(".recommend"),function(i,em){
				fellowshipid=$(em).attr("fellowshipId");
				czyx.uploadReplace("#"+$(em).attr("id"),{
					url:PC_CALL+"customer/fellowship/attachment/create/", //文件处理的URL
					data:{customerId:t.customerId,fellowshipId:$(this).attr("fellowshipId"),useFlag:'3'},
					uploadReplaceCss:{
						//设置上传按钮图片
						background:'url(//img00.allinmd.cn/fellow/sc_tjx.png) center no-repeat',
						width:88,             //上传按钮的宽度
						height:25              //上传按钮的高度
					},
					uploadInputCss:{
						width:88,             //上传按钮的宽度
						height:25              //上传按钮的高度
					},
					uploadBefore:function(){
						if(!/\.((doc)|(docx)|(pdf)|(ppt)|(pptx))$/i.test(this.value)){
							alert('只允许上传.doc .docx .pdf .ppt .pptx类型的文档文件');
							return false ;
						}
						var fileSize =comm.file.getFileSize(document.getElementById($(em).attr("id")));
						if(fileSize>10485760){
							alert('文件不能大于'+10485760/1048576+"M");
							$(this).val("");
							return false;
						}
						$(this).parent().hide();
						$(this).parent().next().show();
					},
					uploadEnd:function(serverJson){//上传完毕后调用
						try{
							resulteJson = $.parseJSON(serverJson);
							if(resulteJson.result) {
								$(this).val("");
								$(this).parents(".ws").find(".ws_default").hide();
								$(this).parents(".ws").find(".ws_edit").show();
								$(this).parents(".ws").find(".status").val(1);
								$(this).parents(".wanshan_normal").addClass("wanshan_after").removeClass("ws").removeClass("wanshan_normal");
								$(this).parents(".wanshan_click").addClass("wanshan_after").removeClass("ws").removeClass("wanshan_click");
								t.applyBtnShow($(this));
								alert("上传成功");
							}
						}catch(e){
							alert('上传失败');
							$(this).parent().show();
							$(this).parent().next().hide();
							return ;
						}
						
					}
				});		
			});
		},
		newUpload:function(obj,url,data,img,fn){
			var t=this;
			czyx.uploadReplace("#"+obj,{
				url:PC_CALL+"customer/fellowship/attachment/"+url+"/", //文件处理的URL
				data:data,
				uploadReplaceCss:{
					//设置上传按钮图片
					background:'url(//img00.allinmd.cn/'+img+') center no-repeat',
					width:75,             //上传按钮的宽度
					height:25              //上传按钮的高度
				},
				uploadInputCss:{
					width:75,             //上传按钮的宽度
					height:25              //上传按钮的高度
				},
				uploadBefore:function(){
					if(!/\.((doc)|(docx)|(pdf)|(ppt)|(pptx))$/i.test(this.value)){
						alert('只允许上传.doc .docx .pdf .ppt .pptx类型的文档文件');
						return false ;
					}
					var fileSize =comm.file.getFileSize(document.getElementById(obj));
					if(fileSize>10485760){
						alert('文件不能大于'+10485760/1048576+"M");
						$(this).val("");
						return false;
					}
					$(this).parent().hide();
					$(this).parent().next().show();
				},
				uploadEnd:function(serverJson){//上传完毕后调用
					try{
						resulteJson = $.parseJSON(serverJson);
						if(resulteJson.result) {
							$(this).val("");
							closeShade();
							fn && fn();
                            alert("上传成功");
		                }
					}catch(e){
						alert('上传失败');
						return ;
					}
					
				}
        	});	
		},
		applyBtnShow:function($this){
			var status=1;
			$this.parents(".floor01_h02").find(".status").each(function(i,em){
				if($(em).val()==2){//有一个信息未完善
					status=2;	
					return;
				}	
			});	
			if(status==1){
				$this.parents(".floor01_02").find(".no_submit").hide();
				$this.parents(".floor01_02").find(".can_submit").show();	
			}else{
				$this.parents(".floor01_02").find(".no_submit").show();
				$this.parents(".floor01_02").find(".can_submit").hide();		
			}
		}
	};
	
	fellowship.init();	
});