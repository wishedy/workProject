/**
 * Created by Administrator on 2014/12/29.
 */
$(function () {
	toggleToPC();
	comm.bindNav(1, false, false);
  var amChannel = comm.getpara()._amChannel;
	var callAppOptions = {
		ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=7&sourceId=" + $("#resourceId").val() + "&tplPath=1"+(amChannel?"&_amChannel="+amChannel:''),
		android: "allin://com.allin.social:75235?data={scene:3,type:7,sourceId:"+  $("#resourceId").val()  +",tplPath:1"+(amChannel?",_amChannel:"+amChannel:'')+ "}",
		ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=7&sourceId=" + $("#resourceId").val() + "&tplPath=1"+(amChannel?"&_amChannel="+amChannel:''),
		runAtOnce: false
	};
	comm.recognizeAppShareLink(callAppOptions);
	//user.needRenZhengPop();
	if (comm.getparaNew() && comm.getparaNew().share && (comm.getparaNew().share.toLowerCase() == "app")){//app分享的链接

	}else{
		user.privExecute({
			operateType: 'auth',   //'login','auth','conference'
			callback: function () {
				comm.showAppDownload("topic");
				//comm.bindCallApp(callAppOptions);
				if(!TempCache.getItem("detailNoNeedApp")){
					comm.appWakeUp("confirm",callAppOptions);//唤醒app弹层
				}
				TempCache.removeItem("detailNoNeedApp");
			}
		});
	}


	var gallary = null;
	if ($(".imgs img").size() > 0) {
		$(".imgs").each(function (index, obj) {
			var $width = $(".detail_after_img").width();
			var $height = $width * 0.666;     // 371 /   580

			DrawImageLarge($(obj).find("img:eq(0)").get(0), $width, $height);
			$(this).on("vclick", function () {
				gallary = $(obj).picShow({open: 0});
				return false;
			});

			$(window).on("orientationchange", function () {
				if ($(".pswp").size() > 0) {
					gallary.updateSize();
				}
			});
		});
	}

	if ($(".case_detail_gz").length > 0) {//病例
		var refId = $("#resourceId").val();      //1411650111030
		var caseInfo = "/mcall/case/baseinfo/getCaseInfoById/";
		var result = CommService.getResponseData(caseInfo, {caseId: refId});
		var info = result.caseInfo;
		//把activityId赋值给input#resourceId属性
		$('#resourceId').attr('activityId', info.activityId);

		var type = $("#relationType").val();
		var followRef = "/mcall/customer/follow/resource/info/";
		//病例关注 回复数及关注或编辑病例

		$(".detail-reivew-num").text(info.reviewNum);
		$(".detail-follow-num").text(info.followFansNum);
		$(".detail-praise-num").text(info.preferUpNum);
		//新增病例页视频开始
		var qiniuId = '';
		if ($('.ev_vidMain').length>0) {
			qiniuId = $('.ev_vidMain').attr('data-qiniuId');
			if (qiniuId != ''&&qiniuId!=undefined) {
				$.ajax({
					url: "/mcall/qiniu/storage/getMapVideoList/",
					type: "post",
					data: {paramJson: $.toJSON({refType: 7, refId: refId, attUseFlag: 3, qiniuId: qiniuId})},
					dataType: 'json',
					success: function (data) {
						if (data && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.videoListMap.length) {
							var item = data.responseObject.responseData.videoListMap[0];
							if (item.qiniuStatus == 1) {
								$('.decorationBox .attLogo').attr('src','//img50.allinmd.cn/case/videoFormating.jpg');
								$('.decorationBox span').html('').hide();
							} else if (item.qiniuStatus == 2) {
								$('.decorationBox span').html(item.playTime);
								$('.decorationBox .attLogo').attr('src',item.logoUrl);
								var videoItem = '<video controls src="' + item.attUrl + '" style="width:100%;height:100%;"></video>';
								$('.ev_vidMain').on('touchend', function () {
									if($(this).find('video').length==0){
										$('.decorationBox').hide();
										$('.ev_vidMain .videoBox')
											.append(videoItem)
											.find('video')[0].play();

									}
								});
							}
						}else if(data.responseObject.responseStatus==false){
							$('.ev_vidMain').remove();
						}
					}
				})
			}
		}
		//新增病例页视频结束

		if (info.refCustomerId == localStorage.userId) {
			$(".detail-self").html("<div class=\"case_detail_gz_but case_bj_but\"><a href=\"/pages/case/case_upload.html?caseId=" + refId + "\" data-ajax=\"false\"></a></div>");
		} else {
			result = CommService.getResponseData(followRef, {
				refId: refId,
				followType: type,
				customerId: localStorage.userId!=null?localStorage.userId:''
			});
			var html = '<div class="case_detail_gz_but"><div class="case_detail_qxgz_but"><a href="#" id="close-relation"></a></div><a href="#" id="open-relation"></a></div>';
			var relationShip = result.data_list[0].relationShip;

			$(".detail-self").html(html);
			if (relationShip === 0) {
				$(".case_detail_qxgz_but").css("display", "none");
				$(".case_detail_gz_but").removeClass("gz_after_down");
			} else {
				$(".case_detail_gz_but").addClass("gz_after_up");
				$("#close-relation").hide();
			}

			var url = "";
			var params = {};
			params.paramJson = $.toJSON({refId: refId, dataFlag: 2, followType: type});//refId  被关注者ID

			//未关注
			$("#open-relation").on("click", function () {
				if ($(".gz_after_down").length === 0 && $(".gz_after_up").length === 0) { //未关注
					url = "/mcall/customer/follow/resource/create/";
					$(".case_detail_gz_but").addClass("gz_after_up");
					$(".case_detail_qxgz_but").show();
					$(".case_detail_qxgz_but>a").hide();

					$.ajax({
						url: url,
						type: "POST",
						data: params
					})

					$(".detail-follow-num").text(parseInt($(".detail-follow-num").text()) + 1);
				} else if ($(".gz_after_up").length > 0 && $(".case_detail_qxgz_but>a").attr("style") === "display: none;") {  //已关注时
					$(".case_detail_qxgz_but a").show();
					$(".case_detail_gz_but").removeClass("gz_after_up").addClass("gz_after_down");
				} else if ($(".gz_after_down").length > 0 && $(".case_detail_qxgz_but>a").attr("style") === "display: block;") {
					$(".case_detail_qxgz_but>a").hide();
					$(".case_detail_gz_but").removeClass("gz_after_down").addClass("gz_after_up");
				}
			});

			$("#close-relation").on("click", function () {
				$(".case_detail_gz_but").removeClass("gz_after_down").removeClass("gz_after_up");
				$(".case_detail_qxgz_but").hide();
				$(".case_detail_qxgz_but>a").show();
				url = "/mcall/customer/follow/resource/delete/";
				$.ajax({
					url: url,
					type: "POST",
					data: params
				})
				var count = parseInt($(".detail-follow-num").text());
				$(".detail-follow-num").text(count > 0 ? count - 1 : count);
			});

		}
		//@关注人跳转
		$('.detail_cont a').click(function(){
			var href = parseInt($(this).attr('href'));
			if(/^\d+$/.test(href)){//href只是数字
        g_sps.jump(null,'/pages/personal/personal_contribution.html?cid='+href);
				return false;
			}
		});
	}
	var caseBase = {
		init: function () {
			updateViewdNum();
			//判断是否是pK活动作品
			var shareTitle =($('.case_detail_title')[0].innerText).replace(/[\n|\s]/g, "");
			var authorName =($('.detail_name .ui-link')[0].innerText).replace(/[\n|\s]/g, "");
			var logo = $(".imgs img:eq(0)").attr("src");
			var imgUrl = '//img00.allinmd.cn/comm/header/logo.png';
			var resourceId = $('#resourceId').val();
			var refCustomerId = $('#authCustomerId').length>0?$('#authCustomerId').val():"";
			if (logo && logo != "undefined" && logo != "") {
				imgUrl = logo;
			}
			if ($('#resourceId').attr('activityId') == 1449026372937) {//1449026372937是视频病例PK活动ID
				wechat_share_pk({
					title: "参赛病例《" + shareTitle + "》",
					desc: authorName + '参加了“骨科示教病例及手术视频评选活动”， 快点赞支持他！点击进入作品',
					timeLineTitle: "参赛病例《" + shareTitle + "》，欢迎讨论！",
					imgUrl: imgUrl,
					fnMessageSuc:function(){
						comm.shareLog({
							shareType: 7,
							resourceId:resourceId ,
							resourceType: 7,
							refId: resourceId,
							isValid: 1,
							shareSence:10,
							shareChannel:4,
							shareContent:"参赛病例《" + shareTitle + "》",
							refCustomerId:refCustomerId
						});
					},
					fnTimelineSuc:function(){
						comm.shareLog({
							shareType: 7,
							resourceId:resourceId ,
							resourceType: 7,
							refId: resourceId,
							isValid: 1,
							shareSence:10,
							shareChannel:5,
							shareContent:"参赛病例《" + shareTitle + "》",
							refCustomerId:refCustomerId
						});
					}
				});
			} else {
				initShareWeixin();

			}

		}
	};
	caseBase.init();

	//草稿提示
	var resourceId = $("#resourceId").val();//资源id
	comm.draftRemind({
		url: "/mcall/customer/draft/reviewOperate/",
		data: {refId: resourceId, reviewType: 7, operateType: 1},//reviewType 4:话题 7:病例;
		type: 2, //1:频道页 2:详情页
		resourceId: resourceId,
		resourceType: 7,//resourceType 1-视频，2-文库，4-话题 ,7-病例
		data2: {refId: resourceId, reviewType: 7, operateType: 2}//operateType 1:说明执行的是判断是否加载提示操作 2:关闭提示
	});

	//window.onload = Log.createBrowse(10, "病例终端页面"); //	浏览日志
});


function updateViewdNum() {
	commdata.asyncExecute("updateCaseNum", {
		"propertyKey": "browseNum",
		"type": "plus",
		"caseId": $("#resourceId").val()
	});
}
/*
 * 判断是否是PK活动作品，是返回true，
 */

function wechat_share_pk(obj) {
	var data = WeixinJSApi.getWxJSConfig();
	var controller = {
		init: function (obj) {
			var t = this;
			t.options = {};
			var shareData = {
				title: document.title,
				desc: "",
				link: window.location.href,
				imgUrl: 'https://m.allinmd.cn/image/allin_logo.png',
				timeLineTitle: "",			//朋友圈标题，没有使用默认title
				fnSuc: function () {
					if ($('.dk-result-pointer').length) {
						$('.dk-result-pointer,.dk-result-pointer-bg').remove();
					}
				},
				fnCancel: function () {
					if ($('.dk-result-pointer').length) {
						$('.dk-result-pointer,.dk-result-pointer-bg').remove();
					}
				},
				fnMessageSuc: function () {

				},
				fnTimelineSuc: function () {

				}
			};
			t.options = $.extend(shareData, obj);
			t.getWxConfig();
		},
		getWxConfig: function () {
			var t = this;
			wx.config({
				debug: false,
				appId: "wx8d4a2df6fdc13658",
				timestamp: data.timestamp,
				nonceStr: data.noncestr,
				signature: data.signature,
				jsApiList: [
					'onMenuShareTimeline',
					'onMenuShareAppMessage'
				]
			});
			setTimeout(function () {
				t.shareContent();
			}, 500)
		},
		shareContent: function () {
			var t = this;
			wx.ready(function () {
				wx.onMenuShareAppMessage({
					title: t.options.title,
					desc: t.options.desc,
					link: t.options.link,
					imgUrl: 'https:' + t.options.imgUrl,
					success: function () {
						if (t.options.fnSuc) {
							t.options.fnSuc();
						}
						if(t.options.fnMessageSuc){
							t.options.fnMessageSuc();
						}
					},
					cancel: function () {
						if (t.options.fnCancel) {
							t.options.fnCancel();
						}
					}
				});
				wx.onMenuShareTimeline({
					title: t.options.timeLineTitle === "" ? t.options.title : t.options.timeLineTitle,
					desc: t.options.desc,
					link: t.options.link,
					imgUrl: 'https:' + t.options.imgUrl,
					success: function () {
						if (t.options.fnSuc) {
							t.options.fnSuc();
						}
						if(t.options.fnTimelineSuc){
							t.options.fnTimelineSuc();
						}
					},
					cancel: function () {
						if (t.options.fnCancel) {
							t.options.fnCancel();
						}
					}
				});
			})
		}
	};
	controller.init(obj);
}
/**
 * 微信分享
 */

function initShareWeixin() {
	var weiXinTitle = "";
	var weiXinDesc = "";
	var weiXinLogo = "//m.allinmd.cn/image/allin_logo.png";
	var resourceId = $('#resourceId').val();
	var refCustomerId = $('#authCustomerId').length>0?$('#authCustomerId').val():"";
	WeixinJSApi.title = function () {
		var resourceTitle = $(".case_detail_title").text().trim();
		var nameCard = $('.user_fabu_sq a').eq(0).text().trim();//作者名称
		nameCard = ((nameCard == '唯医小编' || nameCard == "") ? "" : nameCard + ":");//作者名称为唯医小编时为空
		if (comm.getLength(resourceTitle) > 30) {
			resourceTitle = comm.cutstr(resourceTitle, 30) + "..."
		}
		if (resourceTitle && resourceTitle != "") {
			weiXinTitle = nameCard + "《" + resourceTitle + "》 —唯医病例, allinmd";
		} else {

		}
		return weiXinTitle;
	};
	WeixinJSApi.desc = function () {
		var resourceNarrate = $(".detail_cont:eq(1)").text().trim();
		if (comm.getLength(resourceNarrate) > 55) {
			resourceNarrate = comm.cutstr(resourceNarrate, 52) + "..."
		}
		if (resourceNarrate && resourceNarrate != "")
			weiXinDesc = resourceNarrate;
		return weiXinDesc;
	};

	WeixinJSApi.imgUrl = function () {
		weiXinLogo = $('#shareImgSrc').val();
		return weiXinLogo;
	};
	WeixinJSApi.appSuc = function(){
		comm.shareLog({
			shareType: 7,
			resourceId:resourceId ,
			resourceType: 7,
			refId: resourceId,
			isValid: 1,
			shareSence:10,
			shareChannel:4,
			shareContent:weiXinTitle,
			refCustomerId:refCustomerId
		});
	};
	WeixinJSApi.timeLineSuc = function(){
		comm.shareLog({
			shareType: 7,
			resourceId:resourceId ,
			resourceType: 7,
			refId: resourceId,
			isValid: 1,
			shareSence:10,
			shareChannel:5,
			shareContent:weiXinTitle,
			refCustomerId:refCustomerId
		});
	}
}
