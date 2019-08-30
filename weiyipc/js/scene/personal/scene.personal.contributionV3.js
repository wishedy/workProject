$(function(){
	comm.LightBox.showloading();
	var uid= $('#sesCustomerId').val();
	var pages= $('.ev-contributionPager');
	var statisticUrl = PC_CALL+'customer/unite/getMapById/';
	var params= {
		paramJson: $.toJSON({"customerId": uid})
	};

	//  如果是厂商角色的话，跳转到首页、暂时不能够访问个人中心 2019-04-11
	var customerRole = TempCache.getItem("customerRole");
	if(customerRole==14 || customerRole==15){
		window.location = "/";	// 如果是厂商角色的话，跳转到首页、暂时不能够访问个人中心
	}



	//var data= Fns.ajax.sync(statisticUrl,params);
	var data=responseData;
	//初始化
	var statistic= {};
	var type="1,2,4,7";
	if(data.responseObject && data.responseObject.responseStatus && data.responseObject.responseData.data_list){
		statistic= data.responseObject.responseData.data_list[0].customer_statistic;
		cauth=data.responseObject.responseData.data_list[0].customer_auth;
		baseInfo = data.responseObject.responseData.data_list[0].customer_baseinfo;

	};
	//获取贡献数量
	function getConNum(){
		var params= {
			paramJson: $.toJSON({
				customerId: uid,
				opId: 0,
				trendTypes: "1,2,4,7",
				dataFlag: 4,
				sortType:2,
				logoUseFlag: 3,
				attUseFlag: AttUseFlag.d,
				visitSiteId: 1,
				pageIndex:1,
				pageSize:20
			})
		};
		var countUrl= PC_CALL+'customer/trends/getResourceNum/';
		Fns.ajax.async(countUrl,params,{success:function(d){
			var contriCount= d.responseObject.responseData.data_list;
			$(".contributionNum").text(contriCount.topicNum+contriCount.videoNum+contriCount.docNum+contriCount.caseNum); //贡献总数
			$(".videoNum").text(contriCount.videoNum);
			$(".caseNum").text(contriCount.caseNum);
			$(".topicNum").text(contriCount.topicNum);
			$(".docNum").text(contriCount.docNum);


			//获取贡献数量

			if($(".contributionNum").text()>0){
				ctrlCenter(type);
				comm.LightBox.hideloading();
			}else{
				pages.hide();
				$(".Ev-tabToggle").parent().hide();
				$(".ev-nothing").show();
				upload();
				comm.LightBox.hideloading();
			}
		}});


	};

	var url= PC_CALL+'customer/trends/getMapList/';
	getConNum();
	function upload(){
		module.videoUpload({
			videoBtn:$(".ev-uploadVideo"),
			needAuth:1
		})
		//上传视频
		/*module.selectType({
			uploadBtn: $(".ev-uploadVideo"),
			type: "video"
		});*/
		//上传病例
		/*$(".ev-uploadCase").on("click",function(){
			window.location.href="/pages/singlePage/upload-case.html";
		});*/
		/*module.caseUpload({
			caseBtn: $(".ev-uploadCase"),
			needAuth:1
		});*/
		//上传话题
		/*module.topicUpload({
			topicBtn: $(".ev-uploadTopic")
		});*/
		//上传文档
		module.docUpload({
			docBtn: $(".ev-uploadDoc")
		});
	}
	
	
	function ctrlCenter(type, data){
		if(type==null) { type= '' };
		if(!getTotal(type)){
			if(type==4){
				$('.Ev-list').html(module.list2Template.nullData('你还没有贡献的话题'));
			}else{
				$('.Ev-list').html(module.list2Template.nullData('快来贡献'+getTypeWord(type)+'，和大家一起讨论 '+setPublish(type)));
				upload();
			}
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
					customerId: uid,
					opId: 0,
					trendTypes: type,
					dataFlag: 4,
					sortType:2,
					logoUseFlag: 3,
					attUseFlag: AttUseFlag.d,
					visitSiteId: 1,
					pageIndex:1,
					pageSize:20
				})	
			};
			
			data= Fns.ajax.sync(url, params);
		};
		
		if(data.responseObject && data.responseObject.responseStatus && data.responseObject.responseData.data_list){
			data= data.responseObject.responseData.data_list;
			var tempHtml= '', HTML= [];
			for(var x=0;x<data.length;x++){
				var isNew,tempTime= comm.date.diffDay_one(data[x].customer_trends.opDate,comm.date.local_time());
				if(tempTime=="刚刚" || tempTime.indexOf("分钟前")>-1 || tempTime.indexOf("小时前") >-1){
					isNew=1;
				}else if(tempTime.indexOf("天前")>-1 && parseInt(tempTime)<4){
					isNew=1;
				}else{
					isNew=0;
				}
				tempHtml= module.resourceListTemplate({tempName : "resource"})({
	                isNew:isNew,//传0或1 最新标识
	                isHost:0,//传0或1 最热标识
	                cancelText:'删除',//是否需要取消类的按钮
	                resourceIsValid: data[x].resource_valid.resourceValid,
	                resType: data[x].customer_trends_type,//资源类型传数字  1-视频，2-文库，3-会议，4-话题 ,7-病例,
	                resId: data[x].customer_trends.resourceId,//资源id
	                resName:(data[x].customer_trends.resourceName),//标题
	                resContent:(data[x].customer_trends.trendContent).replace(/&lt;br\/&gt;/g,'<br/>'),//内容
	                userName:data[x].customer_auth.ownerNameStr==''?'唯医小编':comm.getStrLen(data[x].customer_auth.ownerNameStr,30),//作者
	                reviewNum: data[x].resource_valid.browseNum.toWK(),//观看数
	                resPic:Attachment(data[x].customer_trends_type,data[x]),//缩略图
	                playNum:data[x].resource_valid && data[x].resource_valid.playTime,//视频的时长   有值才传
	                resUrl:data[x].resource_valid.tpl_Path==286?"/pages/eBook/eBook_details.html?bId="+data[x].customer_trends.resourceId:data[x].customer_trends.resourceUrl,//资源链接
					score:data[x].currentStarLevel,
					scoreNum:data[x].currentScoreNum,
					isShowActivityTag:data[x].resource_valid.isShowActivityTag,
					activityTagName:data[x].resource_valid.activityTagName,
					activityTagColor:data[x].resource_valid.activityTagColor
	            });
				
				tempHtml= $(tempHtml);
				tempHtml.find('.ev-collection').VNS_SocialDelete({
					$UI_Obj:{},
					AJAX_Obj_Params: deleteParams(data[x].customer_trends_type, data[x]),
					Action_Type: data[x].customer_trends_type,
					Oper_Boo_Mouse: {
						state: true,
						ele:tempHtml
					},
					AJAX_Obj_Callback: {
						success: function(){
							// ctrlCenter(type);
							getConNum();
						}
					}
				});
				if(data[x].customer_trends.resourceType==1&&(data[x].customer_auth.ownerNameStr.indexOf(',')>-1)){
                    tempHtml.find('.ev-collection').each(function(){
                        $(this).off("click").on("click",function(){
                            $.topTip({mark: "warn", content: "该内容属于多作者，您无法删除！"});
                        })
                    });
				}
				HTML.push(tempHtml);
			}
			$('.Ev-list').removeClass("al-NoContributionUser").html(HTML);
			$(".ev-resourceList:last .al-contentText").css("borderBottom","none");
			$(".ev-resourceList:last .al-tableBoxInnerWrap").css("borderBottom","none");
			$(".ev-resourceList:last").css("borderBottom","1px solid #ecf0f2");
		}else{
			if(!type||type=="1,2,4,7"){ //为全部时不存在数据，但是总数又有时
				pages.hide();
				$(".Ev-tabToggle").parent().hide();
				$(".ev-nothing").show();
				upload();
				comm.LightBox.hideloading();
			}else{
				$('.Ev-list').html(module.list2Template.nullData('快来贡献'+getTypeWord(type)+'，和大家一起讨论 '+setPublish(type)));
				upload();
			}
			
		}
	}
	
	function pageAjax(pageclickednumber){
		var getType= $(".Ev-tabToggle").find(".active").attr("data-role");
		switch(getType){
		case "tabAll": getType="1,2,4,7"; break;
		case "tabVideo": getType=1; break;
		case "tabCase": getType=7; break;
		case "tabDoc": getType=2; break;
		case "tabTopic": getType=4; break;
		default: getType=null;
		}
		
		var params= {
			paramJson: $.toJSON({
				customerId: uid,
				opId: 0,
				trendTypes: getType,
				dataFlag: 4,
				logoUseFlag: 3,
				attUseFlag: AttUseFlag.d,
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
			fn= '<a href="/pages/singlePage/upload-case.html" class="ev-uploadCase">发病例</a>';
			break;
		default:
			break;
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
        case 'tabAll': ctrlCenter(); type="1,2,4,7";break;
        case 'tabVideo': ctrlCenter(1); type=1; break;
        case 'tabCase': ctrlCenter(7); type=7; break;
        case 'tabDoc': ctrlCenter(2); type=2; break;
        case 'tabTopic': ctrlCenter(4); type=4; break;
        default: ctrlCenter();
        }
    });
});

