/**
 * Created by qiangkailiang on 2016/5/20.
 */

$(function() {
	var controller={
		config:{
			bayerReviveListUrl:"/mcall/activity/resource/property/cmsActivityResourcePropertyAction!getReviveMapList",//复活排行榜
			bayerWonderfulReviveUrl:"/mcall/activity/resource/property/cmsActivityResourcePropertyAction!getAllVideoList",//精彩复活
			activityId:1460028659268/*1460028659268  1459416619774*/
		},
		init:function(){
			var t=this;
			t.bayerReviveList();
			t.bayerWonderfulRevive();
			$(".Ev-reviveBackBtn").on("click",function(){
				history.back();
			});

		},
		//复活排行榜
		bayerReviveList:function(){
			var t=this,items,html;
			var liHtml;
			$.ajax({
				type: "POST",
				url: t.config.bayerReviveListUrl,
				data: {activityId:t.config.activityId},
				dataType: "json",
				success: function (data) {
					if(data&&data.responseObject){
						items=data.responseObject;
						html="";
						$.each(items,function(i,e){
							if(i>1){
								liHtml='<li class="reviveRankItem">';
							}else{
								liHtml='<li class="reviveRankItem reviveRankTop">';
							}
							html+=liHtml+
								'<i class="rankNum">'+(i+1)+'</i>'+
								'<h3>'+(e.customerName?cutstr(e.customerName,10):"")+'</h3>'+
								'<span class="area">'+(e.propertyName?e.propertyName:"")+'</span>'+
								'<i class="hr">&nbsp</i>'+
								'<span class="clickZan">点赞数</span>'+
								'<span class="zanNum">'+ e.preferUpNum+'</span>'+
								'</li>';
						});
						$(".Ev-ul-BayerAppendReviveList").html(html);
						footerBtnScroll();
					}
				},
				error: function () {
				}
			});
		},
		//精彩复活
		bayerWonderfulRevive:function(){
			var t=this,items,html1,html2,html3,html4;
			var pageCount;

			var pageIndex=1;
			var data={};
			data.pageIndex=pageIndex;
			data.pageSize=20;
			data.activityId= t.config.activityId;
			$.ajax({
				type: "POST",
				url: t.config.bayerWonderfulReviveUrl,
				data: data,
				dataType: "json",
				success: function (data) {
					if(data&&data.responseObject.returnList){
						items=data.responseObject.returnList;
						pageCount=data.responseObject.pageCount;
						html1="", html2="", html3="", html4="";

						for(var j=1;j<=pageCount;j++){
							html1+='<section class="Ev-AppendWonVideo">'+
								'</section>';

							html3+='<li class="paginationTopItem Ev-li-PageTopItem" data-page="'+j+'">'+
										'<a href="javascript:;">'+j+'</a>'+
								  '</li>';
							html4+='<li class="paginationBottomItem Ev-li-PageBottomItem" data-page="'+j+'">' +
										'<a href="javascript:;">'+j+'</a>' +
									'</li>'

						}
						$(".Ev-AppendBox").html(html1);
						$(".Ev-ul-AppendTopPages").html(html3);
						$(".Ev-ul-AppendBottomPages").html(html4);
						$(".Ev-ul-AppendTopPages li").eq(0).addClass("on");
						$(".Ev-ul-AppendBottomPages li").eq(0).addClass("on");
						$(".Ev-AppendWonVideo").hide().eq(0).show().addClass("hasAjax").html(t.addWonderfulReviveHtml(items));
						footerBtnScroll();
						t.tabClickBtn();

					}
				},
				error: function () {
				}
			});
		},
		//精彩复活的页码切换
		tabClickBtn:function(){
			var t=this;
			var items;
			var pageCount;
			var hasAjaxData;
			var data={};
			data.pageSize=20;
			data.activityId= t.config.activityId;
			$(".Ev-li-PageTopItem,.Ev-li-PageBottomItem").each(function(i,e){
				$(e).on("click",function(){
					i=$(this).index();
					hasAjaxData=$(".Ev-AppendWonVideo").eq(i).hasClass("hasAjax");
					if(hasAjaxData){
						$(".Ev-AppendWonVideo").hide().eq(i).show();
						$(".Ev-li-PageTopItem").removeClass("on").eq(i).addClass("on");
						$(".Ev-li-PageBottomItem").removeClass("on").eq(i).addClass("on");
						footerBtnScroll();
					}else{
						data.pageIndex=parseInt($(this).attr("data-page"));
						$.ajax({
							type: "POST",
							url: t.config.bayerWonderfulReviveUrl,
							data:data,
							dataType: "json",
							success: function (rep) {
								if(rep&&rep.responseObject.returnList){
									items=rep.responseObject.returnList;
									pageCount=rep.responseObject.pageCount;
									$(".Ev-AppendWonVideo").hide().eq(i).show().addClass("hasAjax").html(t.addWonderfulReviveHtml(items,data.pageIndex));
									$(".Ev-li-PageTopItem").removeClass("on").eq(i).addClass("on");
									$(".Ev-li-PageBottomItem").removeClass("on").eq(i).addClass("on");
									footerBtnScroll();
								}
							},
							error: function (){
							}
						});
					}
				});
			});

		},
		//精彩复活的列表循环
		addWonderfulReviveHtml:function(items,pageNum){
			var titleName,
				videoLogoUrl,
				promotion,
				html2="",
				propertyName,
				company,
				customerNum;
			$.each(items,function(i,e){
				if(getLength(e.videoName)>36){//标题名
					titleName= cutstr(e.videoName,36)+"…";
				}else{
					titleName=e.videoName;
				}
				if(!e.videoLogoUrl){//图片
					videoLogoUrl="//img00.allinmd.cn/default/225_150.jpg";
				}else{
					videoLogoUrl=e.videoLogoUrl;
				}

				if(e.propertyName){//赛区
					propertyName='<span class="raceArea">'+e.propertyName+'</span>';
				}else{
					propertyName="";
				}
				if(e.company){//医院
					company='<span class="hospital">'+e.company+'</span>';
				}else{
					company="";
				}

				if(e.isPromotion==1){//晋级
					promotion='<figure class="levelUpIcon">'+
						'<img src="//img50.allinmd.cn/column/bayer_race/levelUp.png" alt="">'+
						'</figure>';
				}else{
					promotion="";
				}

				if(pageNum>1){//学员的号码排序
					if(pageNum==3){
						customerNum=(pageNum+1)*10+(i+1);
					}else if(pageNum==4){
						customerNum=(pageNum+2)*10+(i+1);
					}else if(pageNum==5){
						customerNum=(pageNum+3)*10+(i+1);
					}else{
						customerNum=pageNum*10+(i+1);
					}

				}else{
					customerNum=(i>8?i+1:"0"+(i+1));
				}

				html2+='<section class="broveShowList levelUp Ev-broveShowList Ev-ReviveShowList">'+
							'<figure class="broveShowImg">'+
								'<a href="'+e.videoUrl+'">'+
									'<img src="'+videoLogoUrl+'" alt="">'+
									promotion+
								'</a>'+
							'</figure>'+
							'<article class="broveShowText">'+
								'<a href="'+e.videoUrl+'">' +
									'<strong class="authorName">'+customerNum+'号'+(e.customerName?e.customerName:"")+'</strong>' +
									'<span>'+titleName+'</span>' +
								'</a>'+
								'<p>'+
									propertyName+
									company+
								'</p>'+
								'<p class="clickLike">'+
									'<span>'+ e.preferUpNum+'</span>'+
									'<a class="clickLikeLink Ev-ClickLike" href="'+e.videoUrl+'">去点赞</a>'+
								'</p>'+
							'</article>'+
					'</section>';
			});
			return html2;
		}

	};
	controller.init();




});
