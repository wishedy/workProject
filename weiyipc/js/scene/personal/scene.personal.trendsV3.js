$.getScript(window.paasFilePathObj.js,function() {
	$(function () {
		var pages = $('.pager');//翻页
		var customerId = $('#sesCustomerId').val();
		if (!customerId) {//未登录
			//return;
		}
		var dataFlag = 4;
		var url = PC_CALL + "customer/trends/getMapList/";
		if (location.pathname !== "/pages/personal/personal_active.html" && location.pathname !== "/pages/personal/friends_circle.html") {
			customerId = comm.getpara().cid;
			dataFlag = 5;
		}

		if (location.pathname == "/pages/personal/friends_circle.html") {
			dataFlag = 7;
		}


		var params = {
			paramJson: $.toJSON({
				customerId: customerId,
				sessionCustomerId: $('#sesCustomerId').val(),
				dataFlag: dataFlag, //             4本人（贡献）动态5他人（贡献）动态6我关注的人动态
				logoUseFlag: 3,
				attUseFlag: 2,
				visitSiteId: 1,
				scene: 2,
				pageIndex: 1,
				pageSize: 20
			})
		}

		var totalCount = 0; //统计总页数

		trendsInit();

		function trendsInit() {
			//var data= isExistData(Fns.ajax.sync(url,params));
			Fns.ajax.async(url, params, {
				success: function (data) {
					data = isExistData(data);
					if (!data) {
						if (location.pathname != "/pages/personal/friends_circle.html") {
							$(".ev-list").removeClass("al-NoContributionUser");
							$('.ev-list').html(module.list2Template.nullData('暂无数据!'));
						} else { //朋友圈
							$('.ev-list').parent().before(module.list2Template.friendCircleNullData());
							if ($("#sesDepartment").val() == 2) {//手外用户不推荐
								$(".al-contentItem").eq(2).hide();
								return false;
							}
							$('.ev-title h2').text('为你推荐');
							$.ajax({
								url: PC_CALL + "customer/trends/getMapList/",
								data: {
									paramJson: $.toJSON({
										dataFlag: 5, //             4本人（贡献）朋友圈无数据时5他人（贡献）动态7我关注的人动态
										logoUseFlag: 3,
										attUseFlag: 2,
										visitSiteId: 1,
										scene: 2,
										opId: 0,
										trendTypes: '1,2,4,7',
										pageIndex: 1,
										pageSize: 50
									})
								},
								type: 'POST',
								success: function (result) {
									result = isExistData(result);
									if (result) {
										$('.ev-list').removeClass('al-NoContributionUser');
										var html = [], tempHtml = '';
										result = result.data_list;
										for (var x = 0; x < result.length; x++) {
											var tempKV = adapter(result[x]);
											if (tempKV.refType == 8) {
												tempHtml = module.list2Template.review(tempKV);
												tempHtml = $(tempHtml);
												var callback = {
													Delete: function () {
														trendsInit();
													}
												};

												module.list2Template.socialSuite_bindEvents(tempHtml, tempKV, callback);
												module.list2Template.videoPicQuote_Sub(tempHtml, tempKV);

												tempHtml.find('.ev-content>a').on('click', function () {
													if($(this).attr('href')!=0){
														var href = "/pages/personal/others_contribution.html?cid=" + $(this).attr("href");
                                                        g_sps.jump(null,href);
													}
													return false;
												});

												html.push(tempHtml);
											} else {
												tempHtml = trendsResTemplate(tempKV);
												tempHtml = $(tempHtml);

												trendsCopyList2VideoPicQuote_Sub(tempKV, tempHtml);

												var callback = {
													Delete: function () {
														trendsInit();
													}
												};

												socialSuite_bindEvents(tempHtml, tempKV, callback);

												tempHtml.find(".ev-content").expandShrink({len: 124});

//									tempHtml.find('.viewBigImgDemo').on('click',function(){
//										module.viewBigImgAll({
//											container: $(this)
//										});
//									});

												html.push(tempHtml);
											}
										}
										$('.ev-list').html(html);
									}
								}
							})
						}
						return false;
					}
					//全部动态
					$('.ev-trendsNum').text(data.total_count);
					totalCount = Math.ceil(data.total_count / 20);
					pages.pager({pagenumber: 1, pagecount: totalCount, buttonClickCallback: pageAjax});
					controllerCenter(data.data_list);
				}
			})

		}

		function controllerCenter(data) {
			var tempHtml = '', html = [];
			for (var x = 0; x < data.length; x++) {
				var tempKV = adapter(data[x]);
				if (tempKV.refType == 8) {
					tempHtml = module.list2Template.review(tempKV);
					tempHtml = $(tempHtml);
					var callback = {
						Delete: function () {
							trendsInit();
						}
					};

					module.list2Template.socialSuite_bindEvents(tempHtml, tempKV, callback);
					module.list2Template.videoPicQuote_Sub(tempHtml, tempKV);

					tempHtml.find('.ev-videoAfter-content a').not('.ev_opId2').css("color", "#4c87d2");
					tempHtml.find('.ev-videoAfter-content a').not('.ev_opId2').on('click', function () {
						var href="/pages/personal/others_contribution.html?cid=" + $(this).attr("href");
                        g_sps.jump(null,href,true);
						return false;
					});

					//
					tempHtml.find('.ev-videoAfter-content').on('click', function (e) {
						if ($(this).attr('srcHref')) {
							var href=$(this).attr('srcHref');
                            g_sps.jump(null,href,true);
							return false;
						}
					});


					html.push(tempHtml);
				} else {
					tempHtml = trendsResTemplate(tempKV);
					tempHtml = $(tempHtml);

					trendsCopyList2VideoPicQuote_Sub(tempKV, tempHtml);

					var callback = {
						Delete: function () {
							trendsInit();
						}
					};

					socialSuite_bindEvents(tempHtml, tempKV, callback);

					tempHtml.find(".ev-content").expandShrink({len: 124});

//				tempHtml.find('.viewBigImgDemo').on('click',function(){
//					module.viewBigImgAll({
//						container: $(this)
//					});	
//				});

					html.push(tempHtml);
				}

			}

			$('.ev-list').removeClass('al-NoContributionUser').html(html).find('.ev-video').on('click', function () {
				module.backgroundVideo({videoSrc: $(this).attr('data-videoSrcUrl')});
			});

		}

		function pageAjax(pageclickednumber) { //翻页 取当前单击的数值
			var formatJson = $.parseJSON(params.paramJson);
			formatJson.pageIndex = parseInt(pageclickednumber);
			params.paramJson = $.toJSON(formatJson);
			$(window).scrollTop(0);

			//var data= isExistData(Fns.ajax.sync(url,params));
			Fns.ajax.async(url, params, {
				success: function (data) {
					data = isExistData(data);
					if (!data) {
						//console.log('无数据');
						return false;
					}
					controllerCenter(data.data_list);
					pages.pager({pagenumber: pageclickednumber, pagecount: totalCount, buttonClickCallback: pageAjax});
				}
			})


		}

	});
});


function trendsResTemplate(kv){
	return '<section class="al-contentComment">'+
		'<figure class="al-contentCommentUserImg">'+
		'<a target="_blank" href="'+kv.usernameUrl+'">'+
		'<img src="'+kv.logoUrl+'" alt="">'+
			//'<i class="al-contentCommentTips"></i>'+
		'</a>'+
		'</figure>'+
		'<section class="al-contentCommentMain">'+
		'<article class="al-contentCommentItem">'+
		'<article class="al-contentCommentItemTitle">'+
		'<a target="_blank" href="'+kv.usernameUrl+'" class="al-contentCommentUserName">'+kv.username+(kv.isVip?'<i class="al-vipUser"></i>':'')+'</a>'+
		(function(kv){
			if(kv.opId==2){
				return '<span>分享</span>';
			}
			return '';
		})(kv)+
		'<p class="al-contentCommentTime">'+kv.publishTime+'</p>'+
		'</article>'+
		'</article>'+
		trendsResContent(kv)+
			//trendsResVideoTemplate(kv) +
			//trendsResPicTemplate(kv)+
		(kv.tpl_Path==286?"":trendsResSocial(kv))+
		'</section>'+
		'</section>';
}

function trendsCopyList2VideoPicQuote_Sub(data, tempHtml){ //只会针对资源
	if(data.imgArr==undefined){data.imgArr=[]};
	if(data.resourceIsValid !=1 && !data.videoState && data.imgArr.length==0){ return ''} //资源类 信息状态判定

	var targetEle= tempHtml.find(".ev-videoAfter-content").length;
	if(targetEle>0){ targetEle= '.ev-videoAfter-content' } else { targetEle= '.ev-content' }

	//只针对活动
	if(data.refType==16){
		tempHtml.find(targetEle).after(module.list2Template.reviewActivityImg(data));
		return false;
	}

	//只针对文库
	if(data.refType==2 && data.imgArr.length!=0 ){
		tempHtml.find(targetEle).after(module.list2Template.reviewOneImg(data,'resource'));
		return false;
	}

	//只针对视频 
	if(data.refType==1 && data.imgArr.length!=0 ){  tempHtml.find(targetEle).after(module.list2Template.video(data));  return false;}

	//只针对话题与病例 仅存在视频
	if(data.refType!=1 && data.videoState && data.imgArr.length==0){
		tempHtml.find(targetEle).after(module.list2Template.video(data));
		tempHtml.find('.ev-imgAfter-video').on('click',function(){ //视频播放
			if($(this).attr('data-videoSrc')){
				module.backgroundVideo({videoSrc:$(this).attr('data-videoSrc')});
			}
		});
	}

	//只存在图片不存在视频时 /图片部分 加在视频之后
	if(data.refType!=1 && !data.videoState && data.imgArr.length>0){
		var imgsLen= data.imgArr.length;
		tempHtml.find(targetEle).after(module.list2Template.reviewImgWrap(data));

		if(imgsLen>1 && imgsLen !=3){
			for(var x=0; x<imgsLen;x++ ){ //子集里的区别只有图 attUrl
				if(x==3 && imgsLen>4){ //更多
					tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewImgMore(data.imgArr[x]));
					break;
				}else{
					tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewImg(data.imgArr[x]));
				};
			}
			$(tempHtml.find(".viewBigImgDemo").children()[2]).css('margin-top','5px');
			$(tempHtml.find(".viewBigImgDemo").children()[3]).css('margin-top','5px');
		}else if(imgsLen==3){
			tempHtml.find('.al-contentImagePart').removeClass('al-contentImagePart');
			tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewOneImg(data.imgArr[0]));
			$(tempHtml.find(".viewBigImgDemo").children()[0]).css('float','left');

			tempHtml.find('.ev-reviewImgWrap')
				.append(module.list2Template.reviewImg(data.imgArr[1])); //.css({'margin-top':'10px','padding-left':'5px'})
			tempHtml.find('.ev-reviewImgWrap')
				.append(module.list2Template.reviewImg(data.imgArr[2])); //.css({'margin-top':'10px','padding-left':'5px'})

			$(tempHtml.find('.viewBigImgDemo figure')[0]).removeAttr('style').css({'float':'left'}).find('img').css({'height':'218px','width':'327px'});
			$(tempHtml.find('.viewBigImgDemo figure')[1])
				.removeClass('al-contentImgBox').removeAttr('style')
				.css({'float':'left'}).find('img')
				.css({'height':'106px','width':'160px','padding-left':'5px'});
			$(tempHtml.find('.viewBigImgDemo figure')[2])
				.removeClass('al-contentImgBox').removeAttr('style')
				.find('img')
				.css({'height':'106px','width':'160px','padding-left':'5px','margin-top':'5px'});
		}else if(imgsLen==1){
			tempHtml.find('.al-contentImagePart').removeClass('al-contentImagePart');
			tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewOneImg(data.imgArr[0]));
		}

		tempHtml.find('.viewBigImgDemo figure').on('click',function(){
			module.viewBigImgAll({
				container: $(this).parent(),
				index:$(this).index()
			});
		});

		tempHtml.find('.viewBigImgDemo').removeAttr('reviewId');
		if(data.refType==7){ tempHtml.find('.viewBigImgDemo').attr('caseId',data.refId); }
		else if(data.refType==4) {tempHtml.find('.viewBigImgDemo').attr('topicId',data.refId);}
	}

	//当存在视频及图片时
	if(data.videoState && data.refType!=1 && data.imgArr.length>0){
		var imgsLen= data.imgArr.length;
		switch(imgsLen){
			case 1:
				tempHtml.find(targetEle).after(module.list2Template.reviewImgWrap(data));
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.videoExistImgs(data));
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewImg(data.imgArr[0]));
				break;
			case 2:
				tempHtml.find(targetEle).after(module.list2Template.video(data));
				tempHtml.find('.ev-imgAfter-video').append(module.list2Template.reviewImgWrap(data));
				tempHtml.find('.al-commentVideoItem').css('float','left');

				for(var x=0; x<imgsLen;x++ ){ //子集里的区别只有图 attUrl
					tempHtml.find('.ev-reviewImgWrap')
						.append(module.list2Template.reviewImg(data.imgArr[x]))
						.addClass('show_three')
						.css({'margin-top':'0','padding-left':'5px'});
				}

				$(tempHtml.find('.show_three').children()[0]).css({'height':'106px','width':'160px'});
				$(tempHtml.find('.show_three').children()[1]).css({'height':'106px','width':'160px','margin-top':'5px'});
				break;
			case 3:
				tempHtml.find(targetEle).after(module.list2Template.reviewImgWrap(data));
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.videoExistImgs(data)).css({'width':'500px'});
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewImg(data.imgArr[0]));
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewImg(data.imgArr[1]));
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewImg(data.imgArr[2]));

				$(tempHtml.find('.ev-reviewImgWrap').children()[2]).css({'margin-top':'4px'});
				$(tempHtml.find('.ev-reviewImgWrap').children()[3]).css({'margin-top':'4px'});
				break;
			default: //多张时
				tempHtml.find(targetEle).after(module.list2Template.reviewImgWrap(data));
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.videoExistImgs(data)).css({'width':'500px'});
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewImg(data.imgArr[0]));
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewImg(data.imgArr[1]));
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewImgMore(data.imgArr[2]));

				$(tempHtml.find('.ev-reviewImgWrap').children()[2]).css({'margin-top':'4px'});
				$(tempHtml.find('.ev-reviewImgWrap').children()[3]).css({'margin-top':'4px'});
		}

		//图片
		tempHtml.find('.viewBigImgDemo>figure').on('click',function(){
			if($(this).parent().hasClass('show_three')){//防止1视2图时结构
				module.viewBigImgAll({container: $(this).parent(), index: $(this).index()});
			}else{
				module.viewBigImgAll({container: $(this).parent(), index: $(this).index()-1});
			}
			return false;
		});

		//视频
		tempHtml.find('.ev-imgAfter-video').on('click',function(e){ //视频播放
			var r=/img05/g; //防止1视2图时结构
			if(!r.test(e.target.src) && $(this).attr('data-videoSrc')){
				module.backgroundVideo({videoSrc:$(this).attr('data-videoSrc')});
			}
		});

		tempHtml.find('.viewBigImgDemo').removeAttr('reviewId');
		if(data.refType==7){ tempHtml.find('.viewBigImgDemo').attr('caseId',data.refId); }
		else if(data.refType==4) {tempHtml.find('.viewBigImgDemo').attr('topicId',data.refId);}

	}
}

function trendsResContent(kv){
	var html='';

	var desc,refType= parseInt(kv.reviewType);
	switch(refType){
		case 1: desc="视频"; break;
		case 2:
			if(kv.tpl_Path==286){
				desc="书籍";
			}else{
				desc="文章";
			}
			break;
		case 4: desc="话题"; break;
		case 7: desc="病例"; break;
		case 17:desc = "书籍";break;
		case 18:desc ='文章';break;
		case 19:desc ="电子书视频";break;
		default: desc= "评论";
	}

	switch(kv.resourceIsValid){
		case 1: html= (kv.refName==''?'':'<a target="_blank" href="'+kv.refUrl+'" class="al-contentArticleTitle">《'+kv.refName+'》 </a>')+
			'<p class="al-contentCommentText ev-content" style="word-wrap: break-word;">'+kv.content+'</p>';
			break;
		case 2: html= '<article class="al-commentShareContent"><span style="font-size:16px;color:#aaaaaa;">该' + desc + '已被系统屏蔽</span></article>'; break;
		case 0: html= '<article class="al-commentShareContent"><span style="font-size:16px;color:#aaaaaa;">该' + desc + '已被系统屏蔽</span></article>'; break;
		case 3: html= '<article class="al-commentShareContent"><span style="font-size:16px;color:#aaaaaa;">该' + desc + '已被作者删除</span></article>'; break;
		default: html= '';
	}
	return html;
}

function trendsResSocial(kv){
	var html='';
	switch(kv.resourceIsValid){
		case 1:
			html=  '<article class="al-contentCommentOtherMsg ev-socialOper">'+
				'<i class="ev-delete"><i class="al-commentDeleteBtn">删除</i></i>'+
					//'<a href="javascript:void(0)" class="al-coomentWatchBtn ev-viewDialog" style="display:none;">查看评论</a>'+
				'<span class="ev-review"><i class="al-commentBtn"></i><b>评论</b><i style="width:11px;'+(kv.reviewNum==0?'display:none;':'')+'">'+kv.reviewNum+'</i></span>'+

				'<span class="ev-prefer">'+
				'<span vns-social-toggle-default><i class="al-likeBtn"></i>'+
				'<i vns-social-toggle-total style="margin-left:5px;width: 0px;'+(kv.preferNum==0?'display:none;':'')+'">'+kv.preferNum+'</i></span>'+
				'<span vns-social-toggle-activation class="active"><i class="al-likeBtn"></i>'+
				'<i vns-social-toggle-total style="margin-left:5px;width: 0px;'+(kv.preferNum==0?'display:none;':'')+'">'+kv.preferNum+'</i></span>'+
				'</span>'+

				'<span class="ev-collection">'+
				'<span vns-social-toggle-default><i class="al-collectBtn"></i>'+
				'<i vns-social-toggle-total style="margin-left:5px;width: 0px;'+(kv.collectNum==0?'display:none;':'')+'">'+kv.collectNum+'</i></span>'+
				'<span vns-social-toggle-activation class="active"><i class="al-collectBtn"></i>'+
				'<i vns-social-toggle-total style="margin-left:5px;width: 0px;'+(kv.collectNum==0?'display:none;':'')+'">'+kv.collectNum+'</i></span>'+
				'</span>'+

				'<span class="ev-share"><i class="al-shareBtn"></i><b>分享</b></span>'+
				'</article>';
			break;
		case 0:
		case 3:
		default:
			html= '';
	}
	return html;
}

function trendsResVideoTemplate(kv){
	if(kv.resourceIsValid !=1){ return ''}
	
	if(kv.videoState == 1){
		return '<section style="margin-top: 10px;" class="al-commentVideoPart">'+
				'<figure class="al-commentVideoItem">'+
				'<img src="//img10.allinmd.cn/default/qiniu296_196.jpg" alt="">'+
			'</figure>'+
		'</section>';
	}else if(kv.videoState == 2){
		return '<section style="margin-top: 10px;" class="al-commentVideoPart ev-video" data-videoSrcUrl='+ kv.videoSrcUrl +'>'+
			'<figure class="al-commentVideoItem">'+
				'<img src="'+ kv.videoLogoUrl +'" alt="">'+
				'<i class="al-contentVideoBtn"><img src="//img10.allinmd.cn/v3/common/icon/video_btn.png" alt=""></i>'+
			'</figure>'+
		'</section>';
	}else{
		return '';
	}
}

function trendsResPicTemplate(kv){
	if(kv.resourceIsValid !=1){ return ''}
	if(!kv.imgArr || kv.imgArr.length===0){ return '' }
	else{
		var imgProperty,viewBig;
		switch(kv.refType){
			case 1: imgProperty='videoAttUrl'; break;
			case 2: imgProperty='docAttUrl'; break;	
			case 8: imgProperty='attUrl'; viewBig= ' reviewId="'+kv.reviewId+'"'; break;
			case 4: imgProperty='topicAttUrl'; viewBig= ' topicId="'+kv.refId+'"'; break;
			case 7: imgProperty='attUrl'; viewBig= ' caseId="'+kv.refId+'"'; break;
			default:
		}
		
		var srcKV= kv;
		var kv= kv.imgArr,html= '';
		
		if(kv.length===1){
			if(srcKV.refType==1 && srcKV.opId==2){ //当分享为视频资源时，视频显示图片，直接跳资源页
				return '<section class="al-commentVideoPart">'+
					'<figure class="al-commentVideoItem">'+
					    '<a target="_blank" href="'+srcKV.refUrl+'">'+
					    	'<img src="'+kv[0][imgProperty]+'">'+
					    	'<i class="al-contentVideoBtn"><img src="//img10.allinmd.cn/v3/common/icon/video_btn.png" alt=""></i>'+
					    '</a>'+
					'</figure>'+
				'</section>';
			}else{
				return '<section class="al-contentImagePart viewBigImgDemo" '+viewBig+'>'+
					'<figure class="al-contentImgBox">'+
					    '<img src="'+kv[0][imgProperty]+'">'+
					'</figure>'+
				'</section>';
			}
		}else if(kv.length===2){
			return '<section class="al-contentImagePart viewBigImgDemo" '+viewBig+'>'+
				'<figure class="al-contentImgBox">'+
				    '<img src="'+kv[0][imgProperty]+'" alt="">'+
				'</figure>'+
				'<figure class="al-contentImgBox">'+
				    '<img src="'+kv[1][imgProperty]+'" alt="">'+
				'</figure>'+
			'</section>';
		}else if(kv.length>2){
			return '<section class="al-contentImagePart viewBigImgDemo" '+viewBig+'>'+
				'<figure class="al-contentImgBox">'+
				    '<img src="'+kv[0][imgProperty]+'" alt="">'+
				'</figure>'+
				'<figure class="al-contentImgBox">'+
				    '<img src="'+kv[1][imgProperty]+'" alt="">'+
				    '<i class="al-contentImgMask">更多</i>'+
				'</figure>'+
			'</section>';
		} 
	}
}

function adapter(data){
	var trends= data.customer_trends;
	var refType= data.customer_trends_type;
	var resourceValid = data.resource_valid;
	var kv= {};
	var cAuth=data.customer_auth;
	var authorName = '';
	if(trends.resourceType==1){
        authorName = comm.getStrLen(data.parentOwnerNameStr,30);
	}else{
        authorName = data.parent_customer_auth.lastName+data.parent_customer_auth.firstName;
	}
	switch(refType){
	case 8:
		kv={
		reviewStatus: data.customer_review.reviewStatus,
		opId: trends.opId,	
		isValid: trends.isValid,
		customerId: trends.customerId,
		refUsername: authorName,
		usernameUrl: (cAuth.customerId&&cAuth.customerId!=0)?'/pages/personal/others_contribution.html?cid='+data.customer_auth.customerId:'javascript:;',
		trendsId: trends.id,
		refType: 8,
		reviewType: trends.resourceType,
		isSelf: $("#sesCustomerId").val()==trends.customerId,
		uid:$("#sesCustomerId").val(), //当前人id
		refCustomerId: data.parent_customer_auth.customerId,//资源人id 
		id: trends.citeId,//当前评论id
		refUrlPc: trends.parentCiteId==0?trends.headerUrl:trends.headerUrl+"#reviewArea", //资源地址
		logoUrl: data.customer_att.logoUrl, //评论人头像
		username: data.customer_auth.lastName+data.customer_auth.firstName, //评论人名字
		publishTime: comm.date.diffDay_one(trends.opDate,comm.date.local_time()), //评论时间
		reviewContent: symbolToString(trends.trendContent).replace(/(&lt;br\/&gt;)+/g,'<br/>'), //评论的内容
		reviewNum: trends.reviewNum?trends.reviewNum.toWK():0, //收藏数
		preferNum: trends.upNum?trends.upNum.toWK():0, //赞数
		collectNum: trends.collectionNum?trends.collectionNum.toWK():0, //收藏数
		preferState: data.customer_prefer.isValid, //赞状态
		collectState: data.customer_collection.isValid, //收藏状态
		refName: (function(data){
			if(data.customer_trends.parentCiteId ==0){
				return comm.getStrLen(trends.resourceName,68);
			}else{
				return $.isEmptyObject(data.parent_customer_review)?'':symbolToString(comm.getStrLen(data.parent_customer_review.reviewContent,78));
			}
		})(data), //被回复的资源内容
		parentId: trends.parentCiteId,//评论的父评论id 不存在为0
		bId:data.customer_review.refId,
		refId: trends.resourceId, //资源id
		//资源缩略图,分享使用
		refLogoUrl: data.customer_review_attachment_list?data.customer_review_attachment_list.length>0?data.customer_review_attachment_list[0].attUrl:'//img10.allinmd.cn/default/loading/225_150.jpg':'//img10.allinmd.cn/default/loading/225_150.jpg',
		parentRefId: trends.resourceId, //评论的父评论资源id,事实应该是和refId一样
		//附件区
		videoIsExist: data.customer_review_video_list?data.customer_review_video_list.length>0:false, //是否存在礼频
		videoSrcUrl: data.customer_review_video_list?data.customer_review_video_list[0]?data.customer_review_video_list[0].attUrl:'':'', //视频源地址
		videoState: data.customer_review_video_list?data.customer_review_video_list[0]?data.customer_review_video_list[0].qiniuStatus:'':'', //视频处理状态
		videoLogoUrl: data.customer_review_video_list?data.customer_review_video_list[0]?data.customer_review_video_list[0].attLogoUrl:'':'', //视频缩略图地址
		imgIsExist: data.customer_review_attachment_list?data.customer_review_attachment_list.length>0:false, //是否存在图片
		imgsArr: data.customer_review_attachment_list?data.customer_review_attachment_list:[], //图片集 //子集数组
		quoteIsExist: data.customer_quote?data.customer_quote.length>0:false, //是否存在引用
		refQuoteType: data.customer_quote?data.customer_quote[0]?data.customer_quote[0].refQuoteType:'':'', //引用的资源类型
		refQuoteUrl: data.customer_quote?data.customer_quote[0]?data.customer_quote[0].pageStoragePath: '': '', //引用的资源地址
		refQuoteName: data.customer_quote?data.customer_quote[0]?symbolToString(data.customer_quote[0].refQuoteName):'': '',  //引用的资源标题
		resourceIsValid: parseInt(data.resource_valid.resourceValid),//0被系统屏蔽 1有效 3用户删除
		tpl_Path:data.resource_valid.tpl_Path
		}
			break;
	default: //资源类不存在引用 不存在回复id
		kv={
			opId: trends.opId,
			isValid: trends.isValid,
			refUsername: authorName,
			usernameUrl: (function(data){
				if(cAuth.customerId&&cAuth.customerId!=0){
                    if($("#sesCustomerId").val()==data.customer_auth.customerId){
                        return '/pages/personal/personal_index.html';
                    }else{
                        return '/pages/personal/others_contribution.html?cid='+data.customer_auth.customerId;
                    }
				}else{
                    return 'javascript:;'
				}
			})(data),
			trendsId: trends.id? trends.id:"",
			operId: trends.resourceId, //操作id 资源时赋资源id
			refType: refType, //资源类型
			reviewType: trends.resourceType,
			refCustomerId: data.parent_customer_auth.customerId,//资源人id
			uid: $("#sesCustomerId").val(), //当前人id
			isVip: data.customer_auth?true:false, //是否vip
			logoUrl: data.customer_att.logoUrl, //用户头像
			username: data.customer_auth.lastName+data.customer_auth.firstName, //名字
			preferState: data.customer_prefer.isValid, //赞状态
			collectState: data.customer_collection.isValid, //收藏状态
			content: symbolToString(trends.trendContent).replace(/(&lt;br\/&gt;)+/g,'<br/>'), //回复内容
			publishTime: comm.date.diffDay_one(trends.opDate,comm.date.local_time()), //发布时间
			refId: trends.resourceId, //当前资源id
			parentId: trends.parentCiteId, //父id
			refUrl: data.resource_valid.tpl_Path==286?'/pages/eBook/eBook_details.html?bId='+trends.resourceId:trends.headerUrl, //资源引用地址
			refCustomerId: trends.parentCustomerId, //资源作者id
			refName: symbolToString(comm.getStrLen(trends.resourceName,68)), //资源名称
			reviewNum: resourceValid.reviewNum?resourceValid.reviewNum.toWK():0,
			collectNum: resourceValid.collectionNum?resourceValid.collectionNum.toWK():0, //收藏数
			preferNum: resourceValid.preferUpNum?resourceValid.preferUpNum.toWK():0, //赞数
			videoState: getRefVideo(refType, data, "qiniuStatus"), //视频状态
			videoSrcUrl: getRefVideo(refType, data, "attUrl"), //视频资源地址
			videoLogoUrl: getRefVideo(refType, data, "logoUrl"), //视频Logo地址
			videoPlayTime: getRefVideo(refType, data, "playTime"),	//视频时长
			imgArr: getRefImgs(refType,data), //图片集
			resourceIsValid: parseInt(data.resource_valid.resourceValid),//0被系统屏蔽 1有效 3用户删除
			activity: data.activity,
			tpl_Path:data.resource_valid.tpl_Path
		}
		}
		
	return kv;
}

function getRefVideo(type,data,key){
	var value;
	switch(type){
	case 1: value= ''; break; 
	case 2: value= ''; break;
	case 4: 
		value= data.cms_topic_video.length>0?data.cms_topic_video[0][key]:'';
		break;
	case 7:
		value= data.case_video_list.length>0?data.case_video_list[0][key]:''; 
		break;
	default:
	}
	return value;
}

function getRefImgs(type, data){
	var value;
	switch(type){
	case 1: value=data.cms_video_attachment; break; 
	case 2: value=data.cms_doc_attachment; break;
	case 4: value=data.cms_topic_attachment; break;
	case 7: value=data.case_attachment_list; break;
		default:
	}
	return value;
}

function getShareLogo(data){
	var imgProperty;
	switch(data.refType){
		case 1: imgProperty='videoAttUrl'; break;
		case 2: imgProperty='docAttUrl'; break;	
		case 8: imgProperty='attUrl'; break;
		case 4: imgProperty='topicAttUrl'; break;
		case 7: imgProperty='attUrl'; break;
		default:
	}
	var logo='';
	if(data.imgArr && data.imgArr.length>0){ logo= data.imgArr[0][imgProperty]; }
	if(!logo || logo=='') { logo= data.videoLogoUrl;}
	return logo;
}

function socialSuite_bindEvents(tempHtml, data, callback){
	tempHtml.find(".ev-review").on('click',function(){
		if(tempHtml.find('form').length===0){
			module.reviewBox({
				context: tempHtml,
				refId: data.operId,
				type: data.refType,
				reviewUsername: tempHtml.find(".al-contentCommentUserName").text(),
				callback:function () {  // 评论成功回调 刷新
					window.location.reload();
				}
			});
		}else{
			tempHtml.find('form').show();
		}
	});

	var WXTitle,WXContent, SinaTitle, SinaContent, QQTitle, QQContent;
	function getTypeDesc(refType){
        var refTypeDesc= ''; //类型描述
        switch(parseInt(refType)){
            case 1: refTypeDesc="视频"; break;
            case 2:
				//if(kv.tpl_Path==286){
				//	refTypeDesc="书籍";
				//}else{
					refTypeDesc="文库";
				//}
				break;
            case 4: refTypeDesc="话题"; break;
            case 7: refTypeDesc="病例"; break;
            case 8: refTypeDesc="评论"; break;
            case 16: refTypeDesc="活动"; break;
            default: refTypeDesc="活动";
        }
        return refTypeDesc;
    }
	
	var refType= parseInt(data.refType);
	data.reviewContent= data.content.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "");
	switch(refType){ //发布1247 未用微信
     case 1:
     case 2:
     case 4:
     case 7:
         QQTitle= "["+data.refUsername+"]发布《"+data.refName+"》";
         QQContent= data.reviewContent;
         WXTitle = "["+data.refUsername+"]发布了["+getTypeDesc(refType)+"]《"+data.refName+"》";
         WXContent = data.reviewContent;
         SinaTitle= "["+data.refUsername+"]发布了["+getTypeDesc(refType)+"]《"+data.refName+"》，点击链接查看详情：";
         SinaContent= "["+data.refUsername+"]发布了["+getTypeDesc(refType)+"]《"+data.refName+"》，点击链接查看详情：";
         break;
     case 16: //活动
         QQTitle= '['+data.username+']分享"['+data.refName+']';  //[参加者姓名]参加了"[活动title]"活动
         QQContent= data.reviewContent;
         WXTitle = '['+data.username+']分享了"['+data.refName+']"活动';
         WXContent = data.reviewContent;
         SinaTitle= '['+data.username+']分享了"['+data.refName+']"活动，点击链接查看详情：';
         SinaContent= '['+data.username+']分享了"['+data.refName+']"活动，点击链接查看详情：';
         break;
     default:
	}
	module.share({
		container:tempHtml.find(".ev-share"),//存放分享组件的父级
        type:1,//默认为1  1：社交分享  2：页面左下角全站分享
        url:data.refUrl,//分享链接， 默认取当前页链接
		h5Url:data.refUrl.replace("www","m").replace("/html/","/html/m/"),
        title:QQTitle,//分享标题
        shareTrend:1,//0:不需要站内动态分享  1：需要站内动态分享
        trendUrl:PC_CALL+"reprint/create/",//分享到站内动态的接口
        data:{customerId: data.uid, reprintType: refType, refId: data.refId},//分享到站内动态的接口参数
        callback:function(){},//分享到站内动态成功后回调函数
        pic:getShareLogo(data),//分享图片
        sinaTitle:SinaTitle,//新浪分享标题     不传的话取上面传的title值
        sinaSummary:SinaContent,//新浪分享描述
        qqTitle:QQTitle,//qq好友分享标题     不传的话取上面传的title值
        qqSummary:QQContent,//qq好友分享描述
        qqZoneTitle:QQTitle,//qq空间分享标题  不传的话取上面传的title值
        qqZoneSummary:QQContent//qq空间分享描述
    });
	
	
	function socialShowHideNum(tempHtml){
		var vstt_Arr= tempHtml.find('[vns-social-toggle-total]');
		for(var x=0;x<vstt_Arr.length;x++){
			if(tempHtml.find(vstt_Arr[x]).text()>0){
				tempHtml.find(vstt_Arr[x]).show();
			}else{
				tempHtml.find(vstt_Arr[x]).hide();
			}
		}
	}
	
	tempHtml.find('.ev-prefer').VNS_SocialToggle({
		$UI_Obj: {},
		AJAX_Obj_Params: {
			create: {
				refId:data.operId,
				refCustomerId:data.refCustomerId,
				usefulType:data.refType,
				upDownType:1
			},
			cancel: {
				refId:data.operId,
				refCustomerId:data.refCustomerId,
				usefulType:data.refType,
				upDownType:0
			}
		},
		Action_State: data.preferState,
		Action_Type: 'prefer',
		AJAX_Obj_Callback: {
			create: {
				success: function(){
					socialShowHideNum(tempHtml);
				}
			},
			cancel: {
				success: function(){
					socialShowHideNum(tempHtml);
				}
			}
		}
	});
	
	tempHtml.find('.ev-collection').VNS_SocialToggle({
		$UI_Obj: {},
		AJAX_Obj_Params: {
			create: {
				trendsId: data.trendsId,
				refId:data.operId,
				refCustomerId:data.refCustomerId,
				//usefulType:data.refType,
				collectionType:data.refType
			},
			cancel: {
				trendsId: data.trendsId,
				refId:data.operId,
				refCustomerId:data.refCustomerId,
				//usefulType:data.refType,
				collectionType:data.refType
			}
		},
		Action_State: data.collectState,
		Action_Type: 'collection',
		AJAX_Obj_Callback: {
			create: {
				success: function(){
					socialShowHideNum(tempHtml);
				}
			},
			cancel: {
				success: function(){
					socialShowHideNum(tempHtml);
				}
			}
		}
	});
	
	if(data.isSelf){
		tempHtml.find('.ev-delete').VNS_SocialDelete({
			$UI_Obj:{},
			AJAX_Obj_Params: {id:data.operId},
			Action_Type: data.refType,
			Oper_Boo_Mouse: {
				state: true,
				ele:tempHtml
			},
			AJAX_Obj_Callback: {
				success: function(){
					callback.Delete && callback.Delete();
				}
			}
		});
	}else{
		tempHtml.find('.ev-delete').hide();
	}
}

function isExistData(data){
	if(data.responseObject && data.responseObject.responseStatus && data.responseObject.responseData.data_list){
 		return data.responseObject.responseData;
 	}else{
 		return false;
 	}
}

