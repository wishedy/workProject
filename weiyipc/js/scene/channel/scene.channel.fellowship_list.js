/**
 * Fellow
 * */
$(function(){
	var fellowApply={};
	fellowApply={
		init:function(){
			var webUser=comm.customer.getData("getWebUser");
			this.isAuth=webUser.isAuth;
			this.customerId=$("#sesCustomerId").val();
			//this.applyClick();
		},
		applyClick:function(){
			var t=this;
			$(".apply").on("click",function(){
				var $this=$(this);
				
				if(t.customerId&&t.isAuth==1){//已登录并且认证
					var param={};
					var data={};
					data.customerId=$("#sesCustomerId").val();
					data.fellowshipId=$this.attr("fellowshipid");
					param.paramJson = $.toJSON(data);
					$.ajax({                     
						url:PC_CALL+"customer/fellowship/base/create/",
						dataType:"json",
						type:"post",
						data:param,
						success:function(rep){
							if(rep&&rep.responseObject.responseStatus){	
								if(rep.responseObject.responseCode=="exist"){
									//已报名
									href="/call/customer/fellowship/base/page_list/?index="+$this.attr("index");
									addHtml(hasApply());
									$("#page_href").attr("href",href);
									var i=3;
									timer=setInterval(function(){
										i--
										$(".second").text(i);
										if(i==0){
											clearInterval(timer);
                                            g_sps.jump(null,href);
										}	
									},1000);	
								}else{
									//未报过名
									addHtml(zhiliaotishi());
									$(".tc_but a").attr("href","/pages/personal/customerInfo.html?fellowId="+$("#fellowShipMainId").val()+"&index="+$this.attr("index"));
								}
							}	
						}	
					});	
				}else{//未登录
					user.login({
						callback:function(){
							t.customerId=$("#sesCustomerId").val();
							t.isAuth=1;
						},operateType : "auth"
					})
				}
			});	
		}	
	};

	//拜耳
	var apply={};
	apply={
		path:{
			getFellowStatus:PC_CALL+"customer/baseinfo/getFellowStatus/",
			fellowCreate:PC_CALL+"customer/fellowship/base/create/"
		},
		init:function(){
			this.isAuth=$("#sesAuth").val();
			this.customerId=$("#sesCustomerId").val();
			//this.applyClick();
		},
		applyClick:function(){
			var t=this;
			var status;
			$("#fellow_list li").on("click",function(){
				var $this=$(this);
				if(t.customerId&&t.isAuth==1){//已登录并且认证
					//判断资料是否完善
					$.ajax({
						url: t.path.getFellowStatus,
						dataType:"json",
						type:"POST",
						async: false,
						success:function(rep){
							status=rep.responseObject.responseStatus;
						}
					});
					if(status){//资料以完善
						addHtml(applySure());
						$(".company").text($this.find(".fs_hospital_name").text());
						$("#yes").on("click",function(){
							t.applyCreate($this);
						});
					}else{//资料未完善
						addHtml(zhiliaotishi());
						$(".tc_but a").attr("href","/pages/personal/customerInfo.html?fellowId="+$("#fellowShipMainId").val());
					}

				}else{//未登录
					user.login({
						callback:function(){
							location.reload();
						},operateType : "auth"
					})
				}
			});
		},
		applyCreate:function(obj){
			var t=this;
			var param={};
			var data={};
			data.customerId=$("#sesCustomerId").val();
			data.fellowShipMainId=$("#fellowShipMainId").val();
			data.fellowshipId=$("#fellowshipId").val();
			data.fellowshipSubId=obj.find(".fellowshipSubId").val();
			param.paramJson = $.toJSON(data);
			$.ajax({
				url: t.path.fellowCreate,
				dataType:"json",
				type:"post",
				data:param,
				success:function(rep){
					if(rep&&rep.responseObject.responseStatus){
						//未报过名
						addHtml(baierApply());
					}else{
						//已报名
						addHtml(baierApply(1));
					}
					href="/call/customer/fellowship/base/page_list/?fellowshipMainId="+data.fellowShipMainId;
					$("#page_href").attr("href",href);
					var i=3;
					timer=setInterval(function(){
						i--;
						$(".second").text(i);
						if(i==0){
							clearInterval(timer);
                            g_sps.jump(null,href);
						}
					},1000);
				}
			});
		}
	};

	if($("#fellowShipMainId").val()=="1429334241535"){
		fellowApply.init();
	}else{
		apply.init();
	}

})