/*
* 视频pk四期结果公布
* created by sunhaibin on March 16 2016
* */
var vPK4_results=function(){
	var controller={
		config:{
			activityId:$('#activityId').val()
			
		},
		path:{
			foreWord:PC_CALL+"activity/api/introductionContent/",
			resultList:PC_CALL+"activity/api/resultPublicity/",
			tagList:PC_CALL+"activity/property/getMapList/"
		},
		init:function(obj){
			var t=this;
			t.opt={};
			var o={};
			t.opt=$.extend(o,obj);
			t.getIntroduction();
			t.getContent();
			//t.getTagList();
			var Top=0;
			$('#right_nav').on('click','.right_nav_btn',function(e){
				$("#right_nav .right_nav_btn").removeClass("active");
				$(this).addClass("active");
				var anchorName=$(this).find('a').attr('href');
				if($(anchorName).length){

					Top =$(anchorName).attr('top');
					$('body').scrollTop(Top-320);
				}
				return false;
			});

			t.rightBtnChange();
			$(window).bind("scroll",function(){
				t.rightBtnChange();
			});
		},
		rightBtnChange:function(){
			var targetId;
			$("#right_nav .right_nav_btn").removeClass("active");
			$.each($(".target_nav"),function(i,em){
				var scrollTop=$(document).scrollTop();
				if(scrollTop>$(".target_nav").eq(i).offset().top-260){
					$("#right_nav .right_nav_btn").removeClass("active");
					targetId = $(".target_nav").eq(i).attr('id');
					//$(".right_nav_btn").eq(i).addClass("active");
					$(".right_nav_btn a[href='#"+targetId+"']").parent('.right_nav_btn').addClass('active');
				}
			});
		},
		getIntroduction:function(){
			var t=this;
			var introContent='';
			t.ajaxFn({
				url: t.path.foreWord,
				param:{activityId:t.config.activityId},
				fn:function(data){
					if(data.responseObject.responseData){
						introContent=data.responseObject.responseData.message;
						$('.pk4_pubTxt').eq(0).html(introContent);
					}
				}
			})
		},
		getContent:function(){
			var t=this;
			t.ajaxFn({
				url:t.path.resultList,
				param:{activityId:t.config.activityId,randStrand:'1,2,3',resourceProperty:'',useFlag:3,attUseFlag:8},
				fn:function(data){
					t.rewardList(data);
					t.getTagList();
				}
			})
		},
		getTagList:function(){
			var t=this;
			var listHtml="";
			t.ajaxFn({
				url: t.path.tagList,
				param:{activityId:t.config.activityId,activityType:1,parentId:0},
				fn:function(data){
					if(data&&data.responseObject.responseData) {
						var res = data.responseObject.responseData;
						var pk4_h2_title;
						var item;
						var propertyName;
						if (res.list && res.list.length > 0) {
							for (var i = 0, l = res.list.length; i < l; i++) {
								item = res.list[i];
								if (item.cms_activity_property.parentId === 0) {
									propertyName = item.cms_activity_property.propertyName;
									for(var j= 0,n=$('.pk4_h2').length;j<n;j++){
										pk4_h2_title = $('.pk4_h2').eq(j).text();
										if(pk4_h2_title == propertyName){
											listHtml+='<div class="right_nav_btn"><a href="#'+propertyName+'">'+propertyName+'</a></div>';
										}
									}

								}
							}
							$('.middledasai_qr-code').html(listHtml);
						}
					}
				}
			})
		},
		rewardList:function(data){
			var t=this,
				html="",h2Title="";
			var tagHtml,vHtml,cHtml,vHtml2,vHtml3,cHtml2,cHtml3;
			var temporary2,temporary2_c,temporary3,temporary3_c;
			var dataFlag,dataFlag2,dataFlag2V,dataFlag3,dataFlag3V;
			if(data&&data.responseObject.responseData.rankResultList.length){
				var res=data.responseObject.responseData.rankResultList;
				
				for(var i=0,l=res.length;i<l;i++){//总表rankResultList
					tagHtml="";h2Title="";vHtml="";cHtml="";vHtml2="";vHtml3="";cHtml2="";cHtml3="";temporary2="";temporary2_c="";temporary3="";temporary3_c="";
					dataFlag=false;dataFlag2=false;dataFlag2V=false;dataFlag3=false;dataFlag3V=false;
					for(var j=0,jL=res[i].rank.length;j<jL;j++){//单个标签表rank
						
						if(res[i].rank[j].ranking==1){
							if(res[i].rank[j].videoRanks.length>0){
								dataFlag=true;
								for(var k=0,kl=res[i].rank[j].videoRanks.length;k<kl;k++){//循环视频列表
									vHtml += t.firstTemplate({
										href:res[i].rank[j].videoRanks[k].resourceInfo.pageStoragePath,
										imgSrc:	res[i].rank[j].videoRanks[k].resourceInfo.attachmentUrl,
										time:"<span>"+res[i].rank[j].videoRanks[k].resourceInfo.playTime+"</span>",
										title:	comm.getStrByteLen(res[i].rank[j].videoRanks[k].resourceInfo.resourceName,76),
										author:	res[i].rank[j].videoRanks[k].refCustomerInfo.customerName,
										hospital:	res[i].rank[j].videoRanks[k].refCustomerInfo.customerCompany,
										tagName:	res[i].rank[j].videoRanks[k].resourcePropertyInfo.propertName,
										score:	res[i].rank[j].videoRanks[k].resultPublicity.score,
										praise:	res[i].rank[j].videoRanks[k].resultPublicity.preferUpNum
									});
								}								
							}
							if(res[i].rank[j].caseRanks.length){
								dataFlag=true;
								for(var k_c=0,kl_c=res[i].rank[j].caseRanks.length;k_c<kl_c;k_c++){
									cHtml += t.firstTemplate({
										href:	res[i].rank[j].caseRanks[k_c].resourceInfo.pageStoragePath,
										imgSrc:	res[i].rank[j].caseRanks[k_c].resourceInfo.attachmentUrl,
										time:"",
										title:	comm.getStrByteLen(res[i].rank[j].caseRanks[k_c].resourceInfo.resourceName,76),
										author:	res[i].rank[j].caseRanks[k_c].refCustomerInfo.customerName,
										hospital:	res[i].rank[j].caseRanks[k_c].refCustomerInfo.customerCompany,
										tagName:	res[i].rank[j].caseRanks[k_c].resourcePropertyInfo.propertName,
										score:	res[i].rank[j].caseRanks[k_c].resultPublicity.score,
										praise:	res[i].rank[j].caseRanks[k_c].resultPublicity.preferUpNum
									});
								}
							}
							if(dataFlag){
								h2Title='<div class="pk4_h2">'+res[i].propertyName+'</div><div class="pk4_flag1"></div><a class="target_nav" id="'+res[i].propertyName+'"></a>';
							}
							tagHtml +=h2Title+vHtml+cHtml;
						}else{//一等奖结束,二三等奖
								if(res[i].rank[j].ranking==2){
									if(res[i].rank[j].videoRanks.length){
										dataFlag2=true;dataFlag2V=true;
										for(var i2=0,l2=res[i].rank[j].videoRanks.length;i2<l2;i2++){
											temporary2+=t.secondThirdTemplate({
												href:res[i].rank[j].videoRanks[i2].resourceInfo.pageStoragePath,
												imgSrc:res[i].rank[j].videoRanks[i2].resourceInfo.attachmentUrl,
												time:"<span>"+res[i].rank[j].videoRanks[i2].resourceInfo.playTime+"</span>",
												title:	comm.getStrByteLen(res[i].rank[j].videoRanks[i2].resourceInfo.resourceName,38),
												author:	res[i].rank[j].videoRanks[i2].refCustomerInfo.customerName,
												hospital:	res[i].rank[j].videoRanks[i2].refCustomerInfo.customerCompany,
												tagName:	res[i].rank[j].videoRanks[i2].resourcePropertyInfo.propertName,
												score:	res[i].rank[j].videoRanks[i2].resultPublicity.score,
												praise:	res[i].rank[j].videoRanks[i2].resultPublicity.preferUpNum
											});
											
										}
										vHtml2='<div class="pk4_item2">'+
							            			'<ul>'+temporary2+'<div class="clear"></div></ul></div>'
										if(dataFlag==true){//有一等奖
											tagHtml +=	'<div class="pk4_flag2">'+
															'<span>视频</span>'+
														'</div>'+vHtml2;
										}else{
											tagHtml+='<div class="pk4_h2">'+res[i].propertyName+'</div><a class="target_nav" id="'+res[i].propertyName+'"></a>'+
														'<div class="pk4_flag2">'+
															'<span>视频</span>'+
														'</div>'+vHtml2;
										}
									
									}
									if(res[i].rank[j].caseRanks.length){
										dataFlag2=true;
										for(var i2_c=0,l2_c=res[i].rank[j].caseRanks.length;i2_c<l2_c;i2_c++){
											temporary2_c+=t.secondThirdTemplate({
												href:	res[i].rank[j].caseRanks[i2_c].resourceInfo.pageStoragePath,
												imgSrc:	res[i].rank[j].caseRanks[i2_c].resourceInfo.attachmentUrl,
												time:"",
												title:	comm.getStrByteLen(res[i].rank[j].caseRanks[i2_c].resourceInfo.resourceName,38),
												author:	res[i].rank[j].caseRanks[i2_c].refCustomerInfo.customerName,
												hospital:	res[i].rank[j].caseRanks[i2_c].refCustomerInfo.customerCompany,
												tagName:	res[i].rank[j].caseRanks[i2_c].resourcePropertyInfo.propertName,
												score:	res[i].rank[j].caseRanks[i2_c].resultPublicity.score,
												praise:	res[i].rank[j].caseRanks[i2_c].resultPublicity.preferUpNum
											});
											
										}
										cHtml2='<div class="pk4_item2">'+
							            			'<ul>'+temporary2_c+'<div class="clear"></div></ul></div>';
										if(dataFlag){
											if(dataFlag2V){//存在视频
												tagHtml +=	'<div class="pk4_flag0">'+
														'<span>病例</span>'+
													'</div>'+cHtml2;
											}else{
												tagHtml +=	'<div class="pk4_flag2">'+
														'<span>病例</span>'+
													'</div>'+cHtml2;
											}
										}else{//没有一等奖
											if(dataFlag2V){//存在视频
												tagHtml +=	'<div class="pk4_h2">'+res[i].propertyName+'</div><a class="target_nav" id="'+res[i].propertyName+'"></a>'+
													'<div class="pk4_flag0">'+
														'<span>病例</span>'+
													'</div>'+cHtml2;
											}else{//只有病例
												tagHtml +=	'<div class="pk4_h2">'+res[i].propertyName+'</div><a class="target_nav" id="'+res[i].propertyName+'"></a>'+
													'<div class="pk4_flag2">'+
														'<span>病例</span>'+
													'</div>'+cHtml2;
											}
										}			
										
									
									}
								}else if(res[i].rank[j].ranking==3){
									if(res[i].rank[j].videoRanks.length){
										dataFlag3=true;dataFlag3V=true;
										for(var i3=0,l3=res[i].rank[j].videoRanks.length;i3<l3;i3++){
											temporary3+=t.secondThirdTemplate({
												href:res[i].rank[j].videoRanks[i3].resourceInfo.pageStoragePath,
												imgSrc:	res[i].rank[j].videoRanks[i3].resourceInfo.attachmentUrl,
												time:"<span>"+res[i].rank[j].videoRanks[i3].resourceInfo.playTime+"</span>",
												title:	comm.getStrByteLen(res[i].rank[j].videoRanks[i3].resourceInfo.resourceName,38),
												author:	res[i].rank[j].videoRanks[i3].refCustomerInfo.customerName,
												hospital:	res[i].rank[j].videoRanks[i3].refCustomerInfo.customerCompany,
												tagName:	res[i].rank[j].videoRanks[i3].resourcePropertyInfo.propertName,
												score:	res[i].rank[j].videoRanks[i3].resultPublicity.score,
												praise:	res[i].rank[j].videoRanks[i3].resultPublicity.preferUpNum
											});
											
										}
										vHtml3='<div class="pk4_item2">'+
							            			'<ul>'+temporary3+'</ul></div>';
									if(dataFlag||dataFlag2){
										tagHtml +=	'<div class="pk4_flag3">'+
													'<span>视频</span>'+
		            							'</div>'+vHtml3;
									}else{
										tagHtml+='<div class="pk4_h2">'+res[i].propertyName+'</div><a class="target_nav" id="'+res[i].propertyName+'"></a>'+
													'<div class="pk4_flag3">'+
															'<span>视频</span>'+
														'</div>'+vHtml3;
									}
							            			
									
									}
									if(res[i].rank[j].caseRanks.length){
										dataFlag3=true;
										for(var i3_c=0,l3_c=res[i].rank[j].caseRanks.length;i3_c<l3_c;i3_c++){
											temporary3_c+=t.secondThirdTemplate({
												href:res[i].rank[j].caseRanks[i3_c].resourceInfo.pageStoragePath,
												imgSrc:res[i].rank[j].caseRanks[i3_c].resourceInfo.attachmentUrl,
												time:"",
												title:	comm.getStrByteLen(res[i].rank[j].caseRanks[i3_c].resourceInfo.resourceName,38),
												author:	res[i].rank[j].caseRanks[i3_c].refCustomerInfo.customerName,
												hospital:	res[i].rank[j].caseRanks[i3_c].refCustomerInfo.customerCompany,
												tagName:	res[i].rank[j].caseRanks[i3_c].resourcePropertyInfo.propertName,
												score:	res[i].rank[j].caseRanks[i3_c].resultPublicity.score,
												praise:	res[i].rank[j].caseRanks[i3_c].resultPublicity.preferUpNum
											});
											
										}
										cHtml2='<div class="pk4_item2">'+
							            			'<ul>'+temporary3_c+'</ul></div>'
									if(dataFlag||dataFlag2){
										if(dataFlag3V==true){
											tagHtml +=	'<div class="pk4_flag0">'+
														'<span style="border-left: 3px solid #388dcf;">病例</span>'+
													'</div>'+cHtml2;
											}else{
												tagHtml +=	'<div class="pk4_flag3">'+
															'<span>病例</span>'+
														'</div>'+cHtml2;
											}
									}else{
										if(dataFlag3V==true){
											tagHtml +=	'<div class="pk4_h2">'+res[i].propertyName+'</div><a class="target_nav" id="'+res[i].propertyName+'"></a>'+'<div class="pk4_flag0">'+
													'<span>病例</span>'+
		            							'</div>'+cHtml2;
										}else{
											tagHtml +=	'<div class="pk4_h2">'+res[i].propertyName+'</div><a class="target_nav" id="'+res[i].propertyName+'"></a>'+'<div class="pk4_flag3">'+
														'<span>病例</span>'+
													'</div>'+cHtml2;
										}
									}
									
									
									}
								}
							}
												
						
		            				
					}//单个标签结果
					
					html += tagHtml;
				}
				
				$('.ev_resultWrap').html(html);
				$('.pk4_item2 ul').append('<div class="clear"></div>');
				for(var i=0;i<$('.target_nav').length;i++){
					$('.target_nav').eq(i).attr('top',$('.target_nav').eq(i).offset().top);
				}
			}
		},
		firstTemplate:function(obj){
			var html=	'<div class="pk4_one">'+	//一等奖视频
		            		'<div class="pk4_item1">'+
		            			'<a href="'+obj.href+'">'+
		            				'<div class="item1Left">'+
		            					'<div class="pk4_pic"><img src="'+(obj.imgSrc==undefined?'//img10.allinmd.cn/default/loading/225_150.jpg':obj.imgSrc)+'"/>'+obj.time+'</div>'+
			            				'<dl>'+
			            					'<dt>'+obj.title+'</dt>'+
			            					'<dd><div class="pk4_author">'+obj.author+'</div><div class="pk4_address">'+obj.hospital+'</div></dd>'+
			            					'<dd>术式：'+obj.tagName+'</dd>'+
			            				'</dl>'+
		            				'</div>'+
		            			'</a>'+
		            			'<div class="item1Right">'+
		            				'<ul>'+
		            					'<li class="pk4_score"><dl>'+
		            						'<dt>'+obj.score+'</dt>'+
		            						'<dd>总分</dd>'+
		            					'</dl></li>'+
		            					'<li class="pk4_support"><dl>'+
		            						'<dt>'+obj.praise+'</dt>'+
		            						'<dd>赞数</dd>'+
		            					'</dl></li>'+
		            				'</ul>'+
		            			'</div>'+
		            		'</div>'+
		            	'</div>';
		    return html;
		},
		secondThirdTemplate:function(obj){
			var html = 	'<li>'+
			            	'<a href="'+obj.href+'"><div class="item2Top">'+
	            				'<div class="pk4_img"><img src="'+(obj.imgSrc==undefined?'//img10.allinmd.cn/default/loading/225_150.jpg':obj.imgSrc)+'"/>'+obj.time+'</div>'+
	            				'<dl>'+
	            					'<dt>'+obj.title+'</dt>'+
	            					'<dd><div class="pk4_author">'+obj.author+'</div><div class="pk4_address">'+obj.hospital+'</div></dd>'+
	            					'<dd class="pk4_txt">术式：'+obj.tagName+'</dd>'+
	            				'</dl>'+
	            			'</div></a>'+
	            			'<div class="item2Bottom">'+
	            				'<div class="item2_score">总分：<span>'+obj.score+'</span></div>'+
	            				'<div class="item2_support">赞数：<span>'+obj.praise+'</span></div>'+
	            			'</div>'
        				'</li>'
        	return html;
		},
		ajaxFn:function(obj){
			comm.LightBox.showloading();
			$.ajax({
				url:obj.url,
				data:{paramJson:$.toJSON(obj.param)},
				dataType:'json',
				type:'post',
				success:function(data){
					comm.LightBox.hideloading();
					if(data){
						obj.fn(data);
					}
				},
				error:function(){
					
				}
			})
		}
	};
	controller.init();
};
$(function(){
	module.videoPKShare({
		title:'《骨科示教病例及手术视频评选活动》最终获奖结果揭晓',
		sina:'《骨科示教病例及手术视频评选活动》最终获奖结果揭晓—最终结果新鲜出炉，桂冠由谁摘得？人气王花落谁家？点击揭晓，并查看全部优秀作品！点击链接：',
		qqZone:'最终结果新鲜出炉，桂冠由谁摘得？人气王花落谁家？点击揭晓，并查看全部优秀作品！'
	});
	vPK4_results();
})
