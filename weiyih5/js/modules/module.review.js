module.reviewList= function(options){
	var opts= {
		$context: null,
		customerId: 0, //查看人的回复列表值
		sessionCustomerId: localStorage.getItem('userId'), //
		refId: 0,//查看资源回复列表值
		refType: 0,//资源的类型
		isTotalCount: 1, //用于获取json总数
		scene: "myReview" //collectReview
	};
	$.extend(opts, options);

	var url='',params= {};
	if(opts.scene==="myReview") {    // 我的评论
		url= M_CALL+'customer/review/json_list/';
		params = {
			dataFlag: 3,
			customerId: opts.customerId,
			reviewType: opts.refType,
			sortType: 7,
			isTotalCount: opts.isTotalCount,
			sessionCustomerId: opts.sessionCustomerId
		};
	}else if(opts.scene === "collectReview"){    // 收藏的评论
		url= M_CALL+ 'customer/collection/json_list/';
		params = {
			collectionType: 8,
			dataFlag: 3,
			customerId: opts.customerId,
			sessionCustomerId: opts.sessionCustomerId,
			reviewType: opts.refType,
			isTotalCount: opts.isTotalCount
		};
	}else{ //资源回复列表         // 评论列表
		url= M_CALL+'customer/review/json_list/';
		params={
			dataFlag: 1,
			refId: opts.refId,
			sortType: 1,
			reviewType: opts.refType,
			isTotalCount: opts.isTotalCount
		};
	}

	params.scene= 2,params.reviewStatus= 1, params.logoUseFlag= 3, params.attUseFlag= 3, params.pageIndex= 1, params.pageSize= 20;

	if(opts.scene==="myReview"){ params.pageSize= 100 }

	var ctrl= {
		init: function(){
			var _this= this;

			$.ajax({url: url, data: params, success: function(data){
				$(".ev-list").attr("scrollpagination","");
				_this.dataList(data,_this);
				_this.waterfall();
				$(".ev-list a").css('wordBreak','break-all');//57-60行 处理我的评论中a标签的问题
				if(opts.scene==="myReview"){
					$.each($('.al-commentContentText').find('a'),function(i,e){
						var href = $(this).attr('href');
						if(href&&href!=0){
                            if(/^\d+$/g.test(href)&&href.length>10){
                                $(this).css('color','#2899e6').attr('href',"/pages/personal/others_contribution.html?cid="+href);
                            }
						}else{
                            if(/^\d+$/g.test(href)&&href.length>10){
                                $(this).css('color','#2899e6').attr('href',"javascript:;");
                            }
						}
					});
					$.each($('.al-commentShareContent').find('a'),function(i,e){
						var href = $(this).attr('href');
                        if(href&&href!=0){
                            if(/^\d+$/g.test(href)&&href.length>10){
                                $(this).css('color','#2899e6').attr('href',"/pages/personal/others_contribution.html?cid="+href);
                            }
                        }else{
                            if(/^\d+$/g.test(href)&&href.length>10){
                                $(this).css('color','#2899e6').attr('href',"javascript:;");
                            }
                        }
					});
				}
			}});

		},
		// 渲染数据
		dataList: function(res,_this){
			// 无评论
			if ((!res || !res.responseObject.responseStatus || !res.responseObject.responseData || !res.responseObject.responseData.data_list) && params.pageIndex==1) {
				opts.$context.html(module.listTemplate.nothingReview).attr('scrollPagination', 'disabled');
			}else if(!res || !res.responseObject.responseStatus || !res.responseObject.responseData || !res.responseObject.responseData.data_list){
				opts.$context.append(module.listTemplate.noReviewTemplate).attr('scrollPagination', 'disabled');
			}else{
				var resAuth= res.responseObject.responseData;
				res= res.responseObject.responseData.data_list;

				var html= '';
				for(var x=0;x<res.length;x++){
					html+= module.listTemplate.itemReview(_this.adapter(res[x], resAuth),opts.scene);
				}

				opts.$context.addClass('al-comment').append(html).find(".ev-reviewDelete").on("click", function(){
					social.delete({
						reviewId: $(this).attr("data-reviewid"),
						callback: function(){ window.location.reload() }//module.reviewList(opts); }
					})
				});

				shareAll({
					triggerCallback: function(e) {
						var reprintParams= {
							"dataFlag":2,
							"attUseFlag":3,
							"refId":e.attr("data-refId"),
							"trendsId":0,
							"logoUseFlag":3,
							"refCustomerId":e.attr("data-refCustomerId"),
							"visitSiteId": "2",
							"reprintType":e.attr("data-refType")
						};
						return {
							title: e.attr('data-title'),
							url:e.attr('data-url'), //不传默认取当前地址
							pic:e.attr('data-pic'), //分享图片
							trendUrl:M_CALL+"customer/reprint/create/",//分享动态的请求连接  //不需要动态分享就不传
							noPJ:0,//0：分享动态给后台的参数需要转为paramJson ,1:不需要
							data:reprintParams,//分享动态传给后台的参数
							wxTitle: e.attr('data-title'), //微信分享标题
							wxDesc: e.attr('data-desc'), //微信分享描述
							timeLineTitle: 'timelIne',
							sinaTitle: e.attr('data-title'), //新浪title
							desc: e.attr('data-desc'), //新浪的描述
							qzoneTitle: e.attr('data-title'), //qq空间title
							summary: e.attr('data-desc'), //qq空间的描述
						};
					},
					qShareLog:function(x,obj){    //分享新浪，空间成功与否都执行
						comm.shareLog({
							shareType: "",
							resourceId: "",
							resourceType:"",
							refId: "",
							refUrl:obj.url,
							shareSence: '',
							shareChannel: x=='sina'?3:1,
							shareContent: x=='sina'?obj.sinaTitle:obj.qzoneTitle,
							refCustomerId: TempCache.getItem('userId')||0
						});
					},
					fnMessageSuc:function(obj){
						comm.shareLog({
							shareType: "",
							resourceId:"" ,
							resourceType: "",
							refId: "",
							refUrl:obj.url,
							shareSence:"",
							shareChannel:4,
							shareContent:obj.wxTitle?obj.wxTitle:obj.title,
							refCustomerId: TempCache.getItem('userId')||0
						});
					},      //分享好友成功回调
					fnTimelineSuc:function(obj){
						comm.shareLog({
							shareType: "",
							resourceId:"" ,
							resourceType: "",
							refId: "",
							refUrl:obj.url,
							shareSence:"",
							shareChannel:5,
							shareContent:obj.timeLineTitle?obj.timeLineTitle:obj.title,
							refCustomerId: TempCache.getItem('userId')||0
						});
					}      //分享朋友圈成功回调
				},false,$('.ev-share'));

				opts.$context.find(".ev-prefer").on('click', function(){
					if($(this).attr('data-preferState')==0){
						$(this).attr('data-preferState',1);
						var num=$(this).find(".ev-preferNum").text();
						if(!(typeof num=="number")){
							num=0;
						}
						$(this).find(".ev-preferNum").text(parseInt(num) + 1);
						$(this).addClass("al-timelineContentLiked");
					}else{
						$(this).attr('data-preferState',0);
						var num= parseInt($(this).find(".ev-preferNum").text())-1;
						$(this).find(".ev-preferNum").text(num >-1?num:0);
						$(this).removeClass("al-timelineContentLiked");
					}

					social.prefer({
						customerId: $(this).attr('data-customerId'),
						usefulType: 8,
						sessionCustomerId: localStorage.getItem('userId'),
						upDownType: $(this).attr('data-preferState')==1?1:0,
						refId: $(this).attr('data-refId')
					});
				});

				bigPicShow.init({
					/**
					 * 指定多个class|| ID
					 * */
					domIdList:[".ev-picList"],
					topSwiperOptions: {
						isInit:true,//是否需要初始化,
						onInit:function(){

						},
						zoom:true
					},
					imgClickCallBack:function(index,ele){
						if(comm.players.length){
							for(var i=0;i<comm.players.length;i++){
								comm.players[i]&&comm.players[i].player.pause();
							}
						}
						Log.createBrowse(188,'点击大图');
						$('html').attr('sT',$(window).scrollTop());
						$('html,body').css({height:'100%',overflow:'hidden'});
					},
					bottomSwiperOptions: {
						isInit:false,//是否需要初始化,
					},
					theme:'dark',
					closeCallBack:function(){
						$('html,body').css({height:'auto',overflow:'auto'});
						$(window).scrollTop($('html').attr('sT')||0);
						$('html').removeAttr('sT');
					},
					topTitle:{
						isInit:true,
						title:""
					}
				});

				opts.$context.find('.ev-review').on('click',function(){
					if(TempCache.getItem('customerRole')==3||TempCache.getItem("customerRole")==2||TempCache.getItem("customerRole")==4){
						popup('该用户没有操作权限');
					}else {
						var refId = $(this).attr('data-refId');
						var username = $(this).attr('data-username');
						var refType = $(this).attr('data-refType');
						var parentId = $(this).attr('data-parentId');
            g_sps.jump(null,'/pages/common/comment.html?resourceId=' + refId + '&username=' + username + '&type=' + refType + '&parentId=' + parentId);
					}
				});

				opts.$context.find('.ev-shareAndCollect').on('click', function(){
					$(this).toggleClass('active');
					if($(this).hasClass('active')){
						$(this).children().show();
					}else{
						$(this).children().hide();
					}
				});

				//opts.$context.find('.ev-share').on('click', function(){
				//});

				opts.$context.find('.ev-collect').on('click', function(){
					if($(this).attr('data-state') ==0){
						$(this).attr('data-state',1)
						$(this).addClass('icon-commentCollected');
					}else{
						$(this).attr('data-state',0);
						$(this).removeClass('icon-commentCollected');
					}

					social.collect({
						customerId: localStorage.getItem('userId'),
						refType: 8,
						isCollect: $(this).attr('data-state')==1?1:0,
						refId: $(this).attr('data-refId')
					})
				});

				opts.$context.find('.ev-video').on('click', function(){
					if($(this).find('video').length == 0){
						//width:100% HEIGHT:312PX;
						//var videoHtml= "<video controls src='"+$(this).attr('data-videoSrc')+"' style='width:"+(parseInt($(this).css("width"))-16)+"px;height: "+(parseInt($(this).css("height"))-16)+"px;top:0;left:0;background: #000;'></video>";
						//$(this).append(videoHtml).find('video')[0].play();
						var _w = $(this).find('img').eq(0).width();
						var _h = $(this).find('img').eq(0).height();
						var poster = $(this).find('img').eq(0).attr('src');
						var n = $('video').length+2;
						var videoItem = ' <video id="CKa'+n+'" class="video-js vjs-default-skin vjs-no-flex vjs-big-play-centered">'+

							'  <source src="'+$(this).attr('data-videoSrc')+'">'+
							'  </video>';
						$(this).children().hide();
						$(this).append(videoItem);
						var players =[];
						players[n] = new AllinmdPlayer('CKa'+n, {
							width: _w,
							height: _h,
							poster: poster,  //播放之前需要放置的海报图片
							//设置播放权限时间，使用时需保证allow值为true
							limitPlayTime: {allow: false,value: 180},//设置允许最大的快进时长，用于限制用户拖拽至不允许播放的时间点，使用时需保证allow值为true
							setMaxPlayTime: {allow: false,value: 0},
							isH5:true
						}, function () {
							var isIOS = comm.browser.versions.ios;
							var ua = navigator.userAgent.toLowerCase();
							var isAndroidChrome = /chrome\/[\d|.]+ mobile safari\/[\d|.]+$/g.test(ua);  //android手机chrome浏览器
							if(isIOS||isAndroidChrome){  //ios放出全屏（版本10以下playsinline无效，暂无解决方法）
								$('.vjs-fullscreen-control').show().css('marginRight','0');
								$('.allinmd-time-elements').css({
									float:'left',
									margin:"2px 0 0 0"
								});
							}
						});

						players[n].player.play();
						comm.players.push(players[n]);
						var _player = players[n].player;
						$.each(comm.players,function(ix,plea){
							if(_player != plea.player){
								plea.player.pause();
							}
						});
					}
				});

				if(res.length===0){
					opts.$context.append(module.listTemplate.noReviewTemplate).attr('scrollPagination', 'disabled');
					return false;
				}

				if(res.length<params.pageSize){
					opts.$context.append(module.listTemplate.nullDataTemplate).attr('scrollPagination', 'disabled');
				}
			}
		},
		waterfall: function(){//瀑布流
			$(".ev-list").scrollPagination({
				'contentPage': url,
				'contentData':{
					dataFlag:params.dataFlag,
					customerId: params.customerId,
					reviewType: params.refType,
					scene: params.scene,
					collectionType: 8,
					sortType: params.sortType,
					sessionCustomerId: params.sessionCustomerId,
					reviewStatus:params.reviewStatus,
					logoUseFlag: params.logoUseFlag,
					attUseFlag: params.attUseFlag,
					isTotalCount: opts.isTotalCount,
					pageIndex:function(){
						return params.pageIndex++
					},
					pageSize:params.pageSize
				},
				'scrollTarget': $(window),
				'noParamJson': true,
				'heightOffset': 0,
				'delaytime':1000,
				'_this': this,
				'beforeLoad': function(){},
				'afterLoad': function(elementsLoaded){},
				'loader':function(data){
					this._this.dataList(data,this._this);
				}
			});
		},
		adapter: function(kv,kvAuth){
			if(!kv.customer_review_insite){	kv.customer_review_insite =		kv.customer_review;	}
			if(!kv.parent_review_insite) { kv.parent_review_insite= kv.parent_customer_review}
			if(!kv.customer_review_insite_attachment) {kv.customer_review_insite_attachment= kv.customer_review_attachment_list}

			if(!kv.customer_prefer){ kv.customer_prefer={isValid: kv.preferRelationship} }
			if(!kv.customer_collection){ kv.customer_collection={isValid: kv.collectionRelationship} }

			var username,logoUrl,_resName;
			if(opts.scene!="myReview"){//我的评论
				username= kv.review_customer.lastName+kv.review_customer.firstName;
				logoUrl= kv.review_customer_logo.logoUrl;
			}else{
				username= kvAuth.customer_auth.lastName+kvAuth.customer_auth.firstName;
				logoUrl= kvAuth.customer_att.logoUrl;
			}
			if(kv.resource){//有资源
				if(kv.resource.caseName){
					_resName = kv.resource.caseName;
				}else if(kv.resource.videoName){
					_resName = kv.resource.videoName;
				}else if(kv.resource.docName){
					_resName = kv.resource.docName;
				}else if(kv.resource.topicName){
					_resName = kv.resource.topicName;
				}else{
					_resNam="";
				}
			}else{
				if(/personal_myComment/.test(window.location.href)){
					_resName = kv.customer_review_insite.refName;
				}
			}
			var preferState, collectState,videoList;
			if(kv.preferRelationship===undefined){
				preferState= kv.customer_prefer.isValid;
			}else{
				preferState= kv.preferRelationship;
			}

			if(kv.collectionRelationship === undefined){
				collectState= kv.customer_collection.isValid
			}else{
				collectState= kv.collectionRelationship;
			}

			if(kv.customer_review_insite_attachment_video){
				videoList= kv.customer_review_insite_attachment_video;
			}else{
				videoList= kv.customer_review_video_list;
			}


			return {
				refType:8,
				id: kv.customer_review_insite.id,
				username: username,
				logoUrl: logoUrl,
				customerId: kv.customer_review_insite.customerId,
				publishTime: (function(opts,kv){
					if(opts.scene=="collectReview"){
						return kv.customer_collection.collectionTime!==''?diffDay_one(kv.customer_collection.collectionTime,local_time()):'';
					}else{
						return kv.customer_review_insite.publishTime!==''?diffDay_one(kv.customer_review_insite.publishTime,local_time()):'';
					}
				})(opts,kv),
				reviewStatus:kv.customer_review_insite.reviewStatus,//评论的状态 1-发布；2-系统屏蔽；3-用户删除；４－草稿
				content: htmlToString(kv.customer_review_insite.reviewContent).replace(/&lt;br\/&gt;/g,'<br/>'),
				preferNum: kv.customer_review_insite.upNum.toWK(),
				reviewNum: kv.customer_review_insite.reviewNum.toWK(),
				refCustomerId: kv.customer_review_insite.refCustomerId,
				refName:htmlToString((function(kv){
					if(!kv.customer_review_insite.refName){
						return kv.customer_collection.refContent;
					}else{
						return kv.customer_review_insite.refName;
					}
				})(kv)),
				//refUrl: kv.customer_review_insite.refUrlWap =='https://m.allinmd.cn'?!kv.resource?'':kv.resource.webStoragePath:'javascript:;',	//不知道具体逻辑，测试提BUG（我的评论点击进去再点击标题）不能跳转到终端，修改
				refUrl: kv.customer_review_insite.refUrlWap =='https://m.allinmd.cn'?!kv.resource?'':kv.resource.webStoragePath:kv.customer_review_insite.refUrlWap,
				refId: kv.customer_review_insite.refId,
				resourceType: kv.customer_review_insite.reviewType||kv.customer_review_insite,
				preferState: preferState,
				collectState: collectState,
				quoteType: this.getValue(kv.customer_quote, 'quoteType'),
				refQuoteName: htmlToString(this.getValue(kv.customer_quote, 'refQuoteName')),
				quoteUrl: this.getValue(kv.customer_quote, 'web_storage_path'),
				attachment_Arr: kv.customer_review_insite_attachment,
				//videoSrcUrl:  this.getValue(kv.customer_review_insite_attachment_video,'attUrl')||this.getValue(kv.customer_review_video_list,'attLogoUrl'),
				videoSrcUrl:  this.getValue(videoList,'attUrl'),
				videoLogoUrl: this.getValue(videoList,'attLogoUrl'),
				videoState: this.getValue(videoList,'qiniuStatus'),
				playTime: this.getValue(videoList,'playTime'),
				parentId: kv.customer_review_insite.parentId,
				parentData: kv.bo_attachment, //回复列表
				parentAuth: kv.parent_customer_auth, //回复列表
				parentUsername: kv.parent_review_insite.refUrlWap==''?'':kv.parent_customer_auth?kv.parent_customer_auth.lastName+kv.parent_customer_auth.firstName:'',
				//parentContent: kv.parent_review_insite.reviewContent,
				parentContent: kv.customer_review_insite.parentId!=0?htmlToString(kv.parent_review_insite.reviewContent):htmlToString(_resName),
				parentRefUrl: kv.parent_review_insite.refUrlWap==''?'javascript:;':kv.parent_review_insite.refUrlWap,
				trendsValid: 1, //为了通用personalAction.js 加的值
				tplPath:kv.bo_attachment?kv.bo_attachment.tplPath:"",
				resourceIsValid: (function(kv){
					if(typeof kv.resource_valid != "string"){
						return parseInt(kv.resource_valid.resourceValid); //0被系统屏蔽 1有效 3用户删除
					}else{
						return parseInt(kv.resource_valid);
					}
				})(kv)
			}
		},
		getValue: function(kv,props){ //有时候不存在，有时候是空数组...
			if(!kv) { return ''}
			if(kv.length===0) { return '' };
			return kv[0][props];
		}
	};

	ctrl.init();

};
