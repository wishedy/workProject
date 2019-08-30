$(function(){
	//他人状态
	var cid= comm.getpara().cid;
	if(cid==$("#sesCustomerId").val()){ //如果为本人，则回自己首页
		location.href= '/pages/personal/personal_index.html';
	}
	
	var statisticUrl = PC_CALL+'customer/unite/getMapById/';
	var params= {
		paramJson: $.toJSON({"customerId": cid})
	};

	var data=responseData;
	var auth;
	//初始化
	if(data.responseObject && data.responseObject.responseStatus && data.responseObject.responseData.data_list){
		unit=data.responseObject.responseData.data_list[0].customer_unite;
		statistic= data.responseObject.responseData.data_list[0].customer_statistic;
		auth=data.responseObject.responseData.data_list[0].customer_auth;
		baseInfo = data.responseObject.responseData.data_list[0].customer_baseinfo;
		prefer = data.responseObject.responseData.data_list[0].customer_prefer;
		var name="";
		if(auth.state!==1 && auth.state!==2 && auth.state!==7 && auth.state!==8&& auth.state!==9 ) {//未认证
			name=unit.email||unit.mobile;
		}else{
			name=auth.lastName+auth.firstName;
		}
		document.title="［"+name+"］的学术专栏－唯医,allinmd";
		$("meta[name=Keywords]").attr("content","［"+name+"］，学术专栏，医学专栏，医师主页，医生专栏，医生交流，关注医师，唯医,allinmd");
		$(".preferNum").text(statistic.othersUpNum); //赞数
		$(".trendNum").text(statistic.trendsNum);
		att = data.responseObject.responseData.data_list[0].customer_att;

	    $(".ev-followStatus").follow({
	        fId: cid,
	        fStatus: data.responseObject.responseData.data_list[0].customer_follow_people.relationship,
	        picStyle: 6,
			needSure:1,
			name:$(".ev-name").text()
	    });
		//赞
		if(prefer.isValid){
			$("#ev-praise i").addClass("al_othersLike_On");
		}
		$("#ev-praise").on("click",function(){
			user.login({
				callback: function () {
					//判断是否赞过，未赞过 则赞
					if(!prefer.isValid){ //未赞过发送赞请求并＋1
						prefer.isValid=1;

						var praiseNum = parseInt($(".preferNum").text());
						$(".preferNum").text(praiseNum+1);
						$("i",$(this)).addClass("al-othersLikeOn");
						var url = PC_CALL+"prefer/create/";
						var params = {};
						params.paramJson = $.toJSON({
							"dataFlag":2,
							"attUseFlag":3,
							"refId":cid,
							"refCustomerId":parseInt($("#sesCustomerId").val()),
							"usefulType":9,
							"upDownType": 1
						});
						$.ajax({
							url : url,
							type : "POST",
							data : params
						})
					}else{ //取消赞
						prefer.isValid=0;

						var praiseNum = parseInt($(".preferNum").text());
						$(".preferNum").text(praiseNum-1>0?praiseNum-1:0);
						$("i",$(this)).removeClass("al-othersLikeOn");
						var url = PC_CALL+"prefer/delete/";
						var params = {};
						params.paramJson = $.toJSON({
							"dataFlag":2,
							"attUseFlag":3,
							"refId":cid,
							"refCustomerId":parseInt($("#sesCustomerId").val()),
							"usefulType":9,
							"upDownType": 0
						});
						$.ajax({
							url : url,
							type : "POST",
							data : params
						});

						//$(".ev-alreadyPraise").show(); //赞过提示
					}
				},
				scene: privilegeSceneConst.eSceneTypePraiseList,
				onClose:function(){
					history.back(-1);
				},
				noAuthReload:true
			});
		}).on("mouseleave",function(){
			$(".ev-alreadyPraise").hide();
		});
	}else{
        g_sps.jump(null,"/pages/personal/personal_index.html");
	};

});

