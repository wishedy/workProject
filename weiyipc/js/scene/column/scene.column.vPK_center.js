/**
 * 功能描述：videoPK-个人作品列表及分享
 * 使用方法:
 * 注意事件：
 * 引入来源： module.videoPKShare 作用：
 * created by Sunhaibin on 2015-11-20
 * */
function videoPK_personal_center(){
	module.videoPKShare({
		//pic:"http://img10.allinmd.cn/common/header/logo.png"
	});
	var vPK_mywork={
		config:{
			left:($(window).width()-713)/2,
			top:$(document).scrollTop()+100,
			$showArea:$('.gr_down_list'),
			url:PC_CALL+"customer/trends/json_list/",
			pageIndex:1,
			pageSize:50,
			attUseFlag:AttUseFlag.c,
			logoUseFlag:3,
			dataFlag:4,
			customerId:$("#sesCustomerId").val(),
			sessionCustomerId:$("#sesCustomerId").val(),
			activityId:$("#activityId").val(),
			width:100,
			height:100
		},
		init:function(){
			var t=this;
			var o =t.config;
			$(".video_pk_shouye_navhuodongjianjie").show();
			//$(".pagination").css("padding","5px 0");
			//$(".ev_vcPK3").show();//导航和顶部的显示
			t.ajaxFn({
				url:o.url,
				param:{
					pageIndex:o.pageIndex,
					pageSize:o.pageSize,
					attUseFlag:o.attUseFlag,
					logoUseFlag:o.attUseFlag,
					dataFlag:o.dataFlag,
					customerId:o.customerId,
					sessionCustomerId:o.sessionCustomerId,
					activityId:o.activityId
				},
				fn:function(data){
					t.addHtml(data);
				}

			})
			t.shareQQ();
			t.shareWeibo();
			t.shareQzone();
			t.shareWeixin();
			t.documentClick();
		},
		ajaxFn:function(opt){
			comm.LightBox.showloading();
			var o=opt;
			$.ajax({
				url:o.url,
				type:'post',
				data:{paramJson:$.toJSON(o.param)},
				dataType:'json',
				success:function(data){
					comm.LightBox.hideloading();
					if(data) o.fn(data);
				}//,
				//error:function(XMLHttpRequest,textStatus,errorThrown){
//      			alert(textStatus+" "+errorThrown);
				//}
			})
		},
		addHtml:function(data){
			var t =this;
			var content="";
			if(data&&data.responseObject.responseData){
				var dataItem=data.responseObject.responseData.data_list;
				if(dataItem&&dataItem.length>0){//存在数据

					for(var i=0,l=dataItem.length;i<l;i++){
						var item = dataItem[i],
							state = item.approvalStatus,
							finalScore = item.score,		//得分
							authName=item.customer_auth.lastName+item.customer_auth.firstName,	//作者名称
							auth_report="",					//审核状态
							shareBtns="",					//分享按钮
							playTime='',					//播放时间及背景
							imgUrl='//img10.allinmd.cn/default/225_150.jpg',						//图片链接
							deadLink="javascript:;",		//无效链接
							titleTip="",
							shareBtn_suc = "<li class='gr_pointer'></li>"+
								"<li class='new_li'>"+
								"<div class='fenxiang'>"+
								"<span>分享至：</span>"+
								"<a href='javascript:;' class='shareToWeibo'><img src='/image/img00/column/videoPK/weibo.png' alt='' /></a>"+
								"<a href='javascript:;' class='shareWx'><div class='Pk_ewm_cont'><div class='pk_ewm_text'>使用微信扫描二维码</div></div><img src='/image/img00/column/videoPK/wechat.png' alt='' /></a>"+
								"<a href='javascript:;' class='shareQQ'><img src='/image/img00/column/videoPK/gr_qq.png' alt='' /></a>"+
								"<a href='javascript:;' class='shareQzone'><img src='/image/img00/column/videoPK/kongjian.png' alt='' /></a>"+
								"</div>"+
								"</li>",
							auth_report_ing="<div class='zp_state  zp_state_d'>待审核</div>",
							auth_report_suc="<div class='zp_state'>审核已通过</div>",
							auth_report_fail="<div class='zp_state  zp_state_sb'>审核未通过<span class='refusal_rea'>拒绝原因："+(jQuery.isEmptyObject(item.approvalReason)?'':item.approvalReason.substring(0,31))+"</span><a href='javascript:;' class='upload_again' type='"+(item.customer_trends_type==1?'video':'case')+"'>再次上传</a></div>";

						//判断是视频还是病例，如果是视频：
//					1 :有播放时间playTime，2:获取视频图片，3:如果状态为有效则有链接，有分享、判断审核状态
						if(item.customer_trends_type&&item.customer_trends_type===1){						//customer_trends_type===1为视频

							//有无播放时间
							playTime="<div class='hm'></div>"+"<p class='tu_time'>"+(item.resource_valid.playTime==undefined?'00:00:00':item.resource_valid.playTime)+"</p>";
//						2:获取视频图片
							if(item.cms_video_attachment){												// 	视频图片是否存在
								for(var k=0,len=item.cms_video_attachment.length;k<len;k++){
									if(item.cms_video_attachment[k].videoAttUrl&&item.cms_video_attachment[k].videoAttUrl!=""){			//视频图片存在&&不为空
										imgUrl = item.cms_video_attachment[k].videoAttUrl;				//imgUrl = 视频图片
										break;
									}
								}
							}
//						3:如果状态为有效则有链接，有分享、判断审核状态
							//4期新加，如果activityId的属性isResultShowBegin存在，则显示分数
							if(item.customer_trends.isValid===1){										//视频有效
								deadLink=item.customer_trends.headerUrl;
								shareBtns=shareBtn_suc;
								//1-提交审核、2-审核通过，4-审核拒绝'
								if($('#activityId').attr('isResultShowBegin')){
									/**审核通过显示评分，拒绝显示拒绝*/
									switch(state){
										case 4:
											auth_report =auth_report_fail;
											break;
										case 2:
											auth_report='<div class="vedioT_scoreBtn avePer_scoreBox"><div class="vedioT_num">总分：<span>'+finalScore+'</span></div><div class="clear"></div></div>';
											break;
										default:
											auth_report =auth_report_ing;
									}
								}else{
									switch(state){
										case 4:
											auth_report =auth_report_fail;
											break;
										case 2:
											auth_report =auth_report_suc;
											break;
										default:
											auth_report =auth_report_ing;
									}
								}

							}else{
								//1-提交审核、2-审核通过，4-审核拒绝'
								switch(state){
									case 4:
										auth_report =auth_report_fail;
										break;
									case 2:
										auth_report =auth_report_suc;
										break;
									default:
										auth_report =auth_report_ing;
								}
							}
							if(item.customer_trends.headerUrl==""){										//视频转码之前没有url，链接不能点击，加提示
								titleTip="视频正在审核中，请耐心等待...";
							}

						}else if(item.customer_trends_type&&item.customer_trends_type===7){											//	customer_trends_type===7病例
//						1：获取病例图片
							if(item.case_attachment_list){
								for(var n=0,le=item.case_attachment_list.length;n<le;n++){
									if(item.case_attachment_list[n].attUrl&&item.case_attachment_list[n].attUrl!=""){				//病例图片存在&&不为空
										imgUrl = item.case_attachment_list[n].attUrl;												//imgUrl = 病例图片
										break;
									}
								}
							}
//						2：病例有效则有链接与分享
							if(item.customer_trends.isValid===1){																	//病例有效
								deadLink=item.customer_trends.headerUrl;
								shareBtns=shareBtn_suc;
								//1-提交审核、2-一级审核通过，3-审核拒绝'
								if($('#activityId').attr('isResultShowBegin')){//评分开始，审核通过显示评分结果
									switch (state) {
										case 3:
											auth_report = auth_report_fail;
											break;
										case 2:
											auth_report='<div class="vedioT_scoreBtn avePer_scoreBox"><div class="vedioT_num">总分：<span>'+finalScore+'</span></div><div class="clear"></div></div>';
											break;
										default:
											auth_report = auth_report_ing;
									}
								}else {
									switch (state) {
										case 3:
											auth_report = auth_report_fail;
											break;
										case 2:
											auth_report = auth_report_suc;
											break;
										default:
											auth_report = auth_report_ing;
									}
								}
							}else{
								switch(state){
									case 3:
										auth_report =auth_report_fail;
										break;
									case 2:
										auth_report =auth_report_suc;
										break;
									default:
										auth_report =auth_report_ing;
								}
							}
						}

						//添加dom
						content +=  "<div class='gr_list'>"+
							"<div class='gr_list_l'>"+
							"<a target='_blank' href='"+deadLink+"'><img  class='tu' src='"+imgUrl+"'/></a>"+
							playTime+
							"</div>"+
							"<div class='gr_list_r'>"+
							"<h3 authName='"+authName+"'><a target='_blank' href='"+deadLink+"' title="+titleTip+">"+comm.getStrLen(item.customer_trends.resourceName,80)+"</a></h3>"+
							"<div class='gr_fb'>"+
							"<ul>"+
							"<li>浏览："+(item.resource_valid.browseNum==undefined?0:item.resource_valid.browseNum)+"</li>"+
							"<li class='gr_pointer'></li>"+
							"<li>赞："+(item.customer_trends.upNum==undefined?0:item.customer_trends.upNum)+"</li>"+
							shareBtns+
							"<li class='gr_time'>"+item.customer_trends.opDate.substring(0,10)+"</li>"+
							"<div class='clear'></div>"+
							"</ul>"+
							"</div>"+
							"<p class='gr_con_p'>"+(item.customer_trends.trendContent!="该用户发言已被管理员屏蔽！"?comm.getStrLen(item.customer_trends.trendContent,200):"已被管理员屏蔽！")+"</p>"+
							auth_report+
							"</div>"+
							"<div class='clear'></div>"+
							"</div>";
					}
					$(".gr_center_con").show();//外层的大div显示，html中隐藏了
					$(".gr_center_main").eq(1).show();
					t.config.$showArea.html(content);
					$('.gr_down_list .gr_list').last().css('border','none');
					$(".gr_down_list img").lazyload({
						effect:"fadeIn",
						event:"scrollstop"
					});
					$.each($(".upload_again"),function(i,em){
						module.videoCasePk({
							enrollBtn:$(em),
							//container: $(".personal_content"),
							toTop:1,
							top: 100,
							left: t.config.left,
							type:$(em).attr("type"),
							activityId: t.config.activityId,
							needGoDetail:1,//需要跳终端
							isEnroll:1,
							publishBack:function(){
								t.init();
							},
							videoPKList:function(){
								t.init();
							}
						});
					})

				}else{//不存在数据
					$(".gr_center_con").eq(0).show();
					$(".gr_center_main").eq(0).show();
					$('.gr_cen_ts').eq(0).show();
					if($('#activityId').attr('isResultShowBegin')){//如果结果公示开始//0:未知错误 1:结果公示中 -1:过期
						$('.gr_cen_ts').eq(0).find('.mark_words').text('活动已结束，一大波获奖作品已经袭来').css('width','350px');
						$('#gr_upload_now')
							.css({'background':'url("//img00.allinmd.cn/column/videoPK/gr_upl04.png") no-repeat'})
							.off('click')
							.attr('href',"/pages/column/videoPK/pk4_results.html?activityId="+$("#activityId").val());
					}else{
						//如果（评分开始）//1:开始 -1:未开始，//或如果上传截止//0:未知错误 1:未截止 -1:截止
						if($('#activityId').attr('isReviewBegin')==1||$('#activityId').attr('isSignUpOver')==-1){
							$('.gr_cen_ts').eq(0).find('.mark_words').text('活动已结束，评审正在紧张进行中...').css('width','330px');
							$('#gr_upload_now')
								.css({'background':'url("//img00.allinmd.cn/column/videoPK/gr_upl03.png") no-repeat'})
								.off('click')
								.attr('href',"/pages/column/videoPK/personal_works.html?activityId="+$("#activityId").val());
						}else{
							module.videoCasePk({
								enrollBtn:$("#gr_upload_now"),
								//container: $(".personal_content"),
								toTop:1,
								top: 100,
								left: t.config.left,
								activityId: t.config.activityId,
								needGoDetail:1,//需要跳终端
								enrollCallBack:function(){//报名成功后回调
									$(".nav_bm a").text("立即上传");
								},
								publishBack:function(){
									t.init();
								},
								videoPKList:function(){
									t.init();
								}
							});
						}

					}

				}
			}
		},
		shareQQ:function(){
			$(".gr_center_main").on('click','.shareQQ',function(e){
				var $this =  $(this).parents('.gr_list');
				var cs_vi='病例';
				if($this.find('.hm').length>0){cs_vi = '视频';}	//判断是否有div.hm，如果有说明有播放时间，则为视频
				var imgSource =$this.find('.tu').eq(0).attr('data-original');
				if(imgSource==undefined||imgSource==""){
					imgSource=$this.find('.tu').eq(0).attr('src');
				}
				var url=encodeURIComponent($this.find('h3').children('a').attr("href"))
				t=encodeURIComponent($this.find('h3').attr('authName')+"参加了#骨科示教病例及手术视频参选活动#，参赛"+cs_vi+"《"+$this.find('h3').text()+"》，快点赞支持他! 点击进入作品"),
					pSrc=encodeURIComponent(imgSource),
					openurl = 'http://connect.qq.com/widget/shareqq/index.html?',
					desc = encodeURIComponent($this.find('.gr_con_p').text());

				var alink = openurl+"url="+url+"&pics="+pSrc+"&title="+t+"&desc="+desc;
				window.open(alink,'_blank');
				return false;
			})
		},
		shareWeibo:function(){
			$(".gr_center_main").on('click','.shareToWeibo',function(e){
				var $this =  $(this).parents('.gr_list');
				var cs_vi='病例';
				if($this.find('.hm').length>0){cs_vi = '视频';}
				var imgSource =$this.find('.tu').eq(0).attr('data-original');
				if(imgSource==undefined||imgSource==""){
					imgSource=$this.find('.tu').eq(0).attr('src');
				}
				var t=encodeURIComponent($this.find('h3').attr('authName')+"参加了#骨科示教病例及手术视频参选活动#，参赛"+cs_vi+"《"+$this.find('h3').text()+"》"),
					pSrc=encodeURIComponent(imgSource),
					href="http://v.t.sina.com.cn/share/share.php?&appkey=895033136",
					desc = encodeURIComponent($this.find('.gr_con_p').text()),
					url=encodeURIComponent($this.find('h3').children('a').attr("href"));

				var	alink=href+"&url="+url+"&title="+t+"&pic="+pSrc+"&desc="+desc;

				window.open(alink,'_blank');

				return false;
			})
		},
		shareQzone:function(){
			var t = this;
			$(".gr_center_main").on('click','.shareQzone',function(e){
				var $this =  $(this).parents('.gr_list');
				var cs_vi='病例';
				if($this.find('.hm').length>0){cs_vi = '视频';}			//如果存在视频播放时间则为视频
				var imgSource =$this.find('.tu').eq(0).attr('data-original');
				if(imgSource==undefined||imgSource==""){
					imgSource=$this.find('.tu').eq(0).attr('src');
				}

				var t=encodeURIComponent($this.find('h3').attr('authName')+"参加了#骨科示教病例及手术视频参选活动#，参赛"+cs_vi+"《"+$this.find('h3').text()+"》"),
					pSrc=encodeURIComponent(imgSource),
					url=encodeURIComponent($this.find('h3').children('a').attr("href")),
					desc =encodeURIComponent($this.find('.gr_con_p').text()),
					openUrl;
				if(comm.equipment.IsPC()){
					openurl="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?";
					var aLink = openurl+"url="+url+"&summary="+desc+"&pics="+pSrc+"&title="+t;
					window.open(aLink,'_blank');
				}else{
					openurl="http://qzs.qzone.qq.com/open/connect/widget/mobile/qzshare/index.html?";
					var aLink = openurl+"desc="+"&summary="+"&imageUrl="+pSrc+"&pics="+pSrc+"&title="+t+"&url="+url;
					window.open(aLink,'_blank');
				}
			})
		},

		shareWeixin:function(){
			var t = this;
			var render='canvas';
			if(navigator.appName.indexOf("Microsoft") != -1){render='table';}
			$(".gr_center_main").on('click','.shareWx',function(e){
				var e=event||window.event;
				var hr = $(this).parents('.gr_list').find('h3').children('a').attr('href');
				if ($(this).children('.Pk_ewm_cont').is(':visible')) {

					$(this).children('.Pk_ewm_cont').hide();
					$(this).children('.Pk_ewm_cont').children(render).remove(render);
					if(window.event){
						e.cancelBubble=true;
					}else{
						e.stopPropagation();
					}


					return false;
				}else{
					$(this).children('.Pk_ewm_cont').qrcode({width:140,height:140,text:hr,render:render}).show();
					setTimeout(function(){
						$('.Pk_ewm_cont').children(render).remove(render).end().hide();
					},10000);
					if(window.event){
						e.cancelBubble=true;
					}else{
						e.stopPropagation();
					}
				}

			})

		},
		documentClick:function(){
			var t=this;
			var render='canvas';
			if(navigator.appName.indexOf("Microsoft") != -1){render='table';}
			$(document).on('click',function(){
				if($('.Pk_ewm_cont').is(':visible')){
					$('.Pk_ewm_cont').children(render).remove(render).end().hide();
				}
			})
		},

		is_weixin:function (){
			var ua = navigator.userAgent.toLowerCase();
			if(ua.match(/MicroMessenger/i)=="micromessenger") {
				return true;
			} else {
				return false;
			}
		}
	};

	if($("#sesCustomerId").val()){//已登录

		if($("#activityId").attr("expert")==1){//专家
			vPKCheck();
		}else{//唯医会员，普通用户
			vPK_mywork.init();

		}
	}else{//未登录
		$(".ev_vcPK3").show();//导航显示
		$(".gr_center_con").show();
		$(".gr_center_main").eq(0).show();
		$(".gr_cen_ts").eq(1).show();
		if($('#activityId').attr('isResultShowBegin')){//如果结果公示开始//0:未知错误 1:结果公示中 -1:过期
			$('.gr_cen_ts').eq(1).find('.mark_words_dl').text('活动已结束，一大波获奖作品已经袭来').css('width','400px');
			$('#login_now').css({'background':'url("//img00.allinmd.cn/column/videoPK/gr_upl04.png") no-repeat'}).off('click').attr('href',"/pages/column/videoPK/pk4_results.html?activityId="+$("#activityId").val());
		}else{
			if($('#activityId').attr('isReviewBegin')==1){//如果（评分开始），点击查看参赛作品// 1:开始 -1:未开始
				$('.gr_cen_ts').eq(1).find('.mark_words_dl').text('活动已结束，评审正在紧张进行中...').css('width','380px');
				$('#login_now').css({'background':'url("//img00.allinmd.cn/column/videoPK/gr_upl03.png") no-repeat'}).off('click').attr('href',"/pages/column/videoPK/personal_works.html?activityId="+$("#activityId").val());
			}else{//在上传未截止之前，点击登录
				$("#login_now").on("click",function(){
					user.login({
						callback:function(){
                            g_sps.jump(null,location.href);
						},
						scene:privilegeSceneConst.eSceneTypeFellow
					});
				});
			}

		}

	}

}
$(function(){
	videoPK_personal_center();
})
