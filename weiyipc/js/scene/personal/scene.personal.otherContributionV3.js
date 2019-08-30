$(function(){
	comm.LightBox.showloading();
	var cid= comm.getpara().cid;
	var pages= $('.ev-contributionPager');
	var statisticUrl = PC_CALL+'customer/unite/getMapById/';
	var params= {
		paramJson: $.toJSON({"customerId": cid})
	};

	if(TempCache.getItem("userId")==cid){//是自己的情况
        g_sps.jump(null, "/pages/personal/personal_contribution.html");
	}

	var data= responseData;
	
	//初始化
	var statistic= {};
	if(data.responseObject && data.responseObject.responseStatus && data.responseObject.responseData.data_list){
		unit=data.responseObject.responseData.data_list[0].customer_unite;
		statistic= data.responseObject.responseData.data_list[0].customer_statistic;
		auth=data.responseObject.responseData.data_list[0].customer_auth;
		baseInfo = data.responseObject.responseData.data_list[0].customer_baseinfo;
		prefer = data.responseObject.responseData.data_list[0].customer_prefer;
		$(".fansNum").text(statistic.fansNum); //粉丝数
		// $(".followNum").text(statistic.followpeopleNum); //关注数
        $(".followNum").text(statistic.followOrgNum?statistic.followOrgNum:statistic.followpeopleNum); //关注数
		$(".collectNum").text(statistic.collectionNum); //收藏数 
		$(".preferNum").text(statistic.othersUpNum); //赞数

		var name="";
		if(auth.state!==1 && auth.state!==2 &&auth.state!=7&&auth.state!=8&&auth.state!=9) {//未认证
			name=unit.email||unit.mobile;
		}else{
			name=auth.lastName+auth.firstName;
		}
		document.title="［"+name+"］的学术专栏－唯医,allinmd";
		$("meta[name=Keywords]").attr("content","［"+name+"］，学术专栏，医学专栏，医师主页，医生专栏，医生交流，关注医师，唯医,allinmd");
		$(".preferNum").text(statistic.othersUpNum); //赞数
		$(".trendNum").text(statistic.trendsNum);
		
		att = data.responseObject.responseData.data_list[0].customer_att;
		//判断头像
		var logoUrl = "<img src=\"//img10.allinmd.cn/default-user/user_img65.png\">";
		if (att.logoUrl !== "") logoUrl = att.logoUrl;
		
		 //关注
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
					if(!parseInt(prefer.isValid,10)){ //未赞过发送赞请求并＋1
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
	};
    //获取贡献数量
	function getConNum(){
		var params= {
			paramJson: $.toJSON({
				customerId: cid,
				opId: 0,
				trendTypes: "1,2,4,7",
				dataFlag: 5,
				logoUseFlag: 3,
				attUseFlag: 2,
				visitSiteId: 1,
				pageIndex:1,
				pageSize:20
			})
		};
		var countUrl= PC_CALL+'customer/trends/getResourceNum/';
		var contriCount= Fns.ajax.sync(countUrl,params).responseObject.responseData.data_list;
		$(".contributionNum").text(contriCount.topicNum+contriCount.videoNum+contriCount.docNum+contriCount.caseNum); //贡献总数
		$(".videoNum").text(contriCount.videoNum);
		$(".caseNum").text(contriCount.caseNum);
		$(".topicNum").text(contriCount.topicNum);
		$(".docNum").text(contriCount.docNum);

	};

	var type="1,2,4,7";
	var url= PC_CALL+'customer/trends/getMapList/';
	//获取贡献数量
	getConNum();
	if($(".contributionNum").text()>0){
		ctrlCenter(type);
		comm.LightBox.hideloading();
	}else{
		pages.hide();
		$(".Ev-tabToggle").parent().hide();
		$(".ev-nothing").show();
		comm.LightBox.hideloading();
	}
	
	function pageAjax(pageclickednumber){
		var getType= $(".Ev-tabToggle").find(".active").attr("data-role");
		switch(getType){
		case "tabAll": getType=type; break;
		case "tabVideo": getType=1; break;
		case "tabCase": getType=7; break;
		case "tabDoc": getType=2; break;
		case "tabTopic": getType=4; break;
		default: getType=null;
		}
		
		var params= {
			paramJson: $.toJSON({
				customerId: cid,
				opId: 0,
				trendTypes: getType,
				dataFlag: 5,
				logoUseFlag: 3,
				attUseFlag: 2,
				visitSiteId: 1,
				pageIndex:parseInt(pageclickednumber),
				pageSize:20
			})	
		}
		
		$(window).scrollTop(0);
		var data= Fns.ajax.sync(url,params);
		ctrlCenter(getType,data);
		pages.pager({pagenumber: pageclickednumber, pagecount: Math.ceil(getTotal(getType)/20), buttonClickCallback: pageAjax});
	}
	
	function ctrlCenter(type, data){
		if(!getTotal(type)){
			$('.Ev-list').html(module.list2Template.nullData('暂未贡献'+getTypeWord(type)+'资源'));
			pages.hide();
			return false;
		}else{
			pages.show();
		}
		
		//装载翻页 总数这儿有问题 每个选项卡有自己的总数
		pages.pager({pagenumber: 1, pagecount:Math.ceil(getTotal(type)/20), buttonClickCallback: pageAjax});
		
		if(!data){
			var params= {
				paramJson: $.toJSON({
					customerId: cid,
					opId: 0,
					trendTypes: type,
					dataFlag: 5,
					logoUseFlag: 3,
					attUseFlag: 2,
					visitSiteId: 1,
					pageIndex:1,
					pageSize:20
				})	
			};
			data= Fns.ajax.sync(url, params);
		};
		
		if(data.responseObject && data.responseObject.responseStatus && data.responseObject.responseData.data_list){
			data= data.responseObject.responseData.data_list;
			var tempHtml= '';
			for(var x=0;x<data.length;x++){
				var isNew,tempTime= comm.date.diffDay_one(data[x].customer_trends.opDate,comm.date.local_time());
				if(tempTime=="刚刚" || tempTime.indexOf("分钟前")>-1 || tempTime.indexOf("小时前") >-1){
					isNew=1;
				}else if(tempTime.indexOf("天前")>-1 && parseInt(tempTime)<4){
					isNew=1;
				}else{
					isNew=0;
				}
				tempHtml+= module.resourceListTemplate({tempName : "resource"})({
	                isNew:isNew,//传0或1 最新标识
	                isHost:0,//传0或1 最热标识
	                cancelText:'',//是否需要取消类的按钮
	                resourceIsValid: data[x].resource_valid.resourceValid,
	                resType: data[x].customer_trends_type,//资源类型传数字  1-视频，2-文库，3-会议，4-话题 ,7-病例,
	                resId: data[x].customer_trends.resourceId,//资源id
	                resName:data[x].customer_trends.resourceName,//标题
	                resContent:data[x].customer_trends.trendContent,//内容
	                userName:data[x].customer_auth.ownerNameStr==''?'唯医小编':comm.getStrLen(data[x].customer_auth.ownerNameStr,30),//作者
	                reviewNum: data[x].resource_valid.browseNum.toWK(),//观看数
	                resPic:Attachment(data[x].customer_trends_type,data[x]),//缩略图
	                playNum:data[x].resource_valid && data[x].resource_valid.playTime,//视频的时长   有值才传
	                resUrl:data[x].resource_valid.tpl_Path==286?"/pages/eBook/eBook_details.html?bId="+data[x].customer_trends.resourceId:data[x].customer_trends.resourceUrl,//资源链接
					isShowActivityTag:data[x].resource_valid.isShowActivityTag,
					activityTagName:data[x].resource_valid.activityTagName,
					activityTagColor:data[x].resource_valid.activityTagColor
	            });
				
			}
			$(".Ev-list").removeClass("al-NoContributionUser").html(tempHtml);
			$(".ev-resourceList:last .al-contentText").css("borderBottom","none");
			$(".ev-resourceList:last .al-tableBoxInnerWrap").css("borderBottom","none");
			$(".ev-resourceList:last").css("borderBottom","1px solid #ecf0f2");
		}else{
			$('.Ev-list').html(module.list2Template.nullData('暂未贡献'+getTypeWord(type)+'资源'));
		}
	}
	
	function getTypeWord(type){
		var rsCount='';
		switch(type){
		case 1: rsCount= '视频'; break;
		case 2: rsCount= '文库'; break;
		case 4: rsCount= '话题'; break;
		case 7: rsCount= '病例'; break;
		default:
			rsCount= '全部'
		}
		return rsCount;
	}
	
	function setPublish(type){
		var fn= null;
		switch(type){
		case 1:
			fn= '<a href="javascript:;" class="ev-uploadVideo">传视频</a>';
			break;
		case 2:
			fn= '<a href="javascript:;" class="ev-uploadDoc">写文章</a>';
			break;
		case 4: 
			fn= '<a href="javascript:;" class="ev-uploadTopic">聊话题</a>';
			break;
		case 7: 
			fn= '<a href="javascript:;" class="ev-uploadCase">发病例</a>';
			break;
		default:
		}
		return fn;
	}
	
	function getTotal(type){
		var rsCount=0;
		switch(type){
		case 1: rsCount= parseInt($(".videoNum").text()); break;
		case 2: rsCount= parseInt($('.docNum').text()); break;
		case 4: rsCount= parseInt($('.topicNum').text()); break;
		case 7: rsCount= parseInt($('.caseNum').text()); break;
		default:
			rsCount= parseInt($(".contributionNum").eq(0).text());
		}
		return rsCount;
	}
	
	function Attachment(type,data){
		var logoUrl='';
		switch(type){
		case 1: logoUrl= data.cms_video_attachment_logo?data.cms_video_attachment_logo.videoAttUrl:''; break;
		case 2: logoUrl= data.cms_doc_attachment_logo?data.cms_doc_attachment_logo.docAttUrl: ''; break;
		case 4: logoUrl= data.cms_topic_attachment_logo?data.cms_topic_attachment_logo.topicAttUrl :''; break;
		case 7: logoUrl= data.case_attachment_logo? data.case_attachment_logo.attUrl : ''; break;
		default:
		}
		return logoUrl;
	}
	
	function deleteParams(type,data){
		var params= {};
		switch(type){
		case 1: 
			params= {videoId: data.customer_trends.resourceId, trendsId:data.customer_trends.id};
			break;
		case 2:
			params= {docId: data.customer_trends.resourceId, trendsId:data.customer_trends.id};
			break;
		case 4: 
			params= {topicId: data.customer_trends.resourceId, trendsId:data.customer_trends.id};
			break;
		case 7:
			params= {caseId: data.customer_trends.resourceId, trendsId:data.customer_trends.id};
			break;
		}
		return params;
	}
    //tab切换
    $(".Ev-tabToggle").find('figure').on("click", function(e) {
        var tabRole = $(this).data("role");
        $(this).addClass('active').siblings().removeClass('active');
        switch(tabRole){
        case 'tabAll': ctrlCenter(); break;
        case 'tabVideo': ctrlCenter(1); break;
        case 'tabCase': ctrlCenter(7); break;
        case 'tabDoc': ctrlCenter(2); break;
        case 'tabTopic': ctrlCenter(4); break;
        default: ctrlCenter();
        }
    });
});

