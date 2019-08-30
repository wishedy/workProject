/**
 * 功能描述：  视频、病例PK专家作品审核
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by hejing on 2016/01/14.
 */
var vPKCheck=function(){
        var controller={
            config:{
                url:PC_CALL+"activity/api/getCustomerReviewResource/",//评分作品列表
                videoUrl:PC_CALL+"/activity/api/getActivityResourceByRefId/",//获取播放视频信息
                endUrl:PC_CALL+"activity/event/isReviewExpired/",//评分时间是否截止
//              isReviewBeginUrl:PC_CALL+"activity/event/isReviewBegin/",//专家评审是否开始 //1是已经开始了,-1没开始
                customerId: $("#sesCustomerId").val(),
                pageSize: 20,
                pageIndex: 1,
                useFlag: 3,
                attUseFlag: 8,
                activityId:$("#activityId").val(),
                CHECKED:2,//已审核
                UNCHECKED:1,//待审核
                expireStatus:1,//没有截止
                dataForScore:{}
//              isReviewBegin:1//1是已经开始了,-1没开始


            },
            init:function(){
                var t=this;
                $(".video_pk_shouye_navhuodongjianjie").show();
                $(".v3con").show();//待评已评按钮
                t.expireStatus();
//              t.isReviewBegin();
                t.bindClick();
                t.videoPosition();
            },
            waitCheck:function(resourceStatus){//待评和已评作品列表的显示
                var t=this;
                var cfg= t.config;
                t.ajaxFn({
                    url: cfg.url,
                    param:{
                        pageIndex:cfg.pageIndex,
                        pageSize:cfg.pageSize,
                        useFlag: cfg.useFlag,
                        attUseFlag:cfg.attUseFlag,
                        customerId:cfg.customerId,
                        activityId:cfg.activityId,
                        resourceStatus:resourceStatus
                    },
                    fn:function(data){
                        t.addHtml(data,resourceStatus);
                        $(".pages").pager({pagenumber: 1, pagecount: data.responseObject.responseData.pageMap.pageCount, buttonClickCallback: PageClick });
                    }
                });
                PageClick = function(pageclickednumber){
                    t.ajaxFn({
                        url: t.config.url,
                        param:{
                            pageIndex:pageclickednumber,
                            pageSize:cfg.pageSize,
                            useFlag: cfg.useFlag,
                            attUseFlag:cfg.attUseFlag,
                            customerId:cfg.customerId,
                            activityId:cfg.activityId,
                            resourceStatus:resourceStatus
                        },
                        fn:function(data){
                            $(".pager").pager({pagenumber: pageclickednumber, pagecount: data.responseObject.responseData.pageMap.pageCount, buttonClickCallback: PageClick});
                            t.addHtml(data,resourceStatus);
                        }
                    });
                };
            },
            ajaxFn:function(opt) {
                comm.LightBox.showloading();
                var cfg = opt;
                $.ajax({
                    url: cfg.url,
                    type: 'post',
                    data: {paramJson: $.toJSON(cfg.param)},
                    dataType: 'json',
                    success: function (data) {
                        comm.LightBox.hideloading();
                        if (data) {
                            cfg.fn(data);
                        }
                    }
                });
            },
            expireStatus:function(){//评分时间判断
                var t=this,
                    cfg= t.config,
                    expireStatus;
                t.ajaxFn({
                    url: cfg.endUrl,
                    param:{
                        activityId: cfg.activityId,
                    },
                    fn:function(data) {
                        if (data && data.responseObject.responseData) {
                            expireStatus = data.responseObject.responseData.expireStatus;
                            t.config.expireStatus=expireStatus;
                            if(expireStatus==-1){//评分时间截止
                                t.waitCheck(cfg.CHECKED);//2
                                $(".ev_finishEvaluate").addClass("ele_main_nav_cur");
                                $(".ev_finishEvaluate").off("click");
                                $(".ev_timeEnd").remove();
                            }else{//时间没有截止
                                    t.waitCheck(cfg.UNCHECKED);//1
                            }
                        }
                    }
                })
            },
//          isReviewBegin:function(){//专家评审时间开始了么
//            var t=this,
//                cfg= t.config,
//                isReviewBegin;
//              t.ajaxFn({
//                  url: cfg.isReviewBeginUrl,
//                  param:{
//                      activityId: cfg.activityId,
//                  },
//                  fn:function(data) {
//                      if (data && data.responseObject.responseData) {
//                          isReviewBegin = data.responseObject.responseData.expireStatus;
//                          t.config.isReviewBegin=isReviewBegin;//1是已经开始了,-1没开始
//                      }
//                  }
//              });
//          },
            addHtml:function(data,resourceStatus){
                var t=this,
                    cfg= t.config,
                    html="",
                    picTime="",
                    scoreText="",
                    vcScore="";
                var addCaption;//添加没有列表时的说明文字
                if(data&&data.responseObject.responseData){
                    var items=data.responseObject.responseData.pageMap.items;
                    var wEvaluateNum=data.responseObject.responseData.pageMap.alreadyAuditCount;//待评审请求时已评审列表的数据有多少
                    $(".elec_main_nav").show();
                    $(".ev_pages").show();
                    for(var i=0;i<items.length;i++){
                        var refType=items[i].resourceInfo.refType,//类型，1视频，7病例
                            refId=items[i].resourceInfo.refId,//资源id
                            scoreType = items[i].resourceInfo.scoreType,//评分类型
                            refCustomerId = items[i].customerInfo.customerId,//上传人的id
                            playTime=items[i].resourceInfo.playTime,//视频时间
                            titleText=items[i].resourceInfo!=""?items[i].resourceInfo.refName:"",//标题
                            customerName=items[i].resourceInfo.refAuthor,//作者名
                            propertName=items[i].propertyInfo.propertName,//术式
                            score=items[i].resourceInfo.score,//分数
                            pageStoragePath=items[i].resourceInfo.pageStoragePath!=""?items[i].resourceInfo.pageStoragePath:"javascript:;";//pc终端页的地址
                        var imgSrc;
                        if(items[i].attachmentInfo){
                            imgSrc=items[i].attachmentInfo.attachmentUrl;
                        }else{//默认图片
                            imgSrc="//img10.allinmd.cn/default/225_150.jpg";
                        }
                        if(refType==1){//视频
                            picTime = '<div class="hm"></div><p class="tu_time">'+playTime+'</p>';
                        }else{//病例
                            picTime="";
                        }
                        if(cfg.expireStatus==-1){//评分时间截止了
                            vcScore ='<div class="vedioT_num"><span>'+score+'</span>分</div>';
                        }else{//未截止
                            if(resourceStatus==1){//待评
                                scoreText = '<a href="javascript:;" class="scoreText score">评分</a>';
                            }else{//已评
                                vcScore ='<div class="vedioT_num"><span>'+score+'</span>分</div>';
                                scoreText = '<a href="javascript:;" class="scoreText score">修改评分</a>';
                            }
                        }
                        html+='<div class="v3con_list" data={"refType":"'+refType+'","refId":"'+refId+'","scoreType":"'+scoreType+'","refCustomerId":"'+refCustomerId+'"}>'+
                                '<div class="gr_list">'+
                                    '<div class="gr_list_l">'+
                                        '<a href="'+pageStoragePath+'"><img src="'+imgSrc+'" class="tu"/></a>'+
                                            picTime+
                                    '</div>'+
                                    '<div class="gr_list_r">'+
                                        '<div class="gr_list_h">'+
                                            '<a href="'+pageStoragePath+'" class="titleBar">'+comm.getStrLen(titleText,80)+'</a>'+
                                        '</div>'+
                                        '<div class="vedioT_writer">作者：<span class="ev_vedioT_writer">'+customerName+'</span></div>'+
                                        '<div class="vedioT_p">术式：<span class="ev_vedioT_p">'+propertName+'</span></div>'+
                                        '<div class="vedioT_scoreBtn">'+
                                            vcScore+
                                            scoreText+
                                        '<div class="clear"></div>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="clear"></div>'+
                            '</div>'+
                            '<div class="clear"></div>'+
                            '</div>';
                    }
                    $(".videoT_con").html(html);
                    $(".videoT_con .v3con_list").last().find(".gr_list").css("border","none");
                    if(cfg.expireStatus==1){//打分未结束
//                      if(cfg.isReviewBegin==1){//专家打分开始
                        if($('#activityId').attr('isReviewBegin')==1){	
                            if($(".ev_waitEvaluate").hasClass("ele_main_nav_cur")){
                                if($(".v3con_list").length==0){
                                    if(wEvaluateNum==0){
                                        addCaption='<div class="videoT_noh ev_noList" style="width:276px;">作品正在整理中，请耐心等待...</div>';
                                        $(".videoT_con").html(addCaption);
                                        $(".ev_pages").hide();
                                        $(".ev_waitEvaluate,.ev_finishEvaluate").addClass("ev_noWorks");
                                    }else{
                                        addCaption='<div class="videoT_noh ev_noList" style="width:270px;">暂时没有需要评分的作品哦~</div>';
                                        $(".videoT_con").html(addCaption);
                                        $(".ev_pages").hide();
                                    }
                                }
                            }
                            if($(".ev_finishEvaluate").hasClass("ele_main_nav_cur")){
                                if($(".v3con_list").length==0){
                                    if($(".ev_noWorks").length==2){
                                        addCaption='<div class="videoT_noh ev_noList" style="width:276px;">作品正在整理中，请耐心等待...</div>';
                                        $(".videoT_con").html(addCaption);
                                        $(".ev_pages").hide();
                                    }else{
                                        addCaption='<div class="videoT_noh ev_noList" style="width:270px;">暂时没有已评分的作品哦~</div>';
                                        $(".videoT_con").html(addCaption);
                                        $(".ev_pages").hide();
                                    }
                                }
                            }
                        }else{//专家打分没开始
                            addCaption='<div class="videoT_noh ev_noList" style="width:276px;">作品正在整理中，请耐心等待...</div>';
                            $(".videoT_con").html(addCaption);
                            $(".ev_pages").hide();
                        }

                    }else{//评分结束，专家没有评分的作品
                        if($(".v3con_list").length==0){
                            addCaption='<div class="videoT_noh ev_noList" style="width:270px;">暂时没有已评分的作品哦~</div>';
                            $(".videoT_con").html(addCaption);
                            $(".ev_pages").hide();
                        }
                    }
                    t.worksListClick(t.config.expireStatus);
                }
            },
            worksListClick:function(expireStatus){
                var t=this,data,dataObj={},refType,
                    cfg= t.config;
                if(expireStatus==1){//评分时间没有截止
                    $(".tu,.titleBar").on("click", function () {
                        var authInfo = $(this).parents('.gr_list').find('.ev_vedioT_writer');
                        data=$(this).parents(".v3con_list").attr("data");
                        dataObj=$.secureEvalJSON(data);
                        refType=dataObj.refType;
                        dataObj.customerId=t.config.customerId;
                        dataObj.activityId=t.config.activityId;
                        t.config.dataForScore = dataObj;
 						if(!authInfo.hasClass('ev_authInfo_exist')){
	                            t.videoAbstractUpdate(authInfo,this);
	                           
	                    }else{
	                        	t.domUpdate(this);
				                t.videoCKPlayer($(this).parents('.gr_list').eq(0).attr('resourceAttUrl'));//播放器的操作

	                    }
	                   
                        if(refType==1){//视频
                            $("#videoMask").show();
                             $("#videoPlayer").show().css('visibility','visible');
                             $(".videoT_playBox_nav").show();
                            $('.videoT_playBox').css({
                            	top:$(window).scrollTop()+50,
                            	left:($(window).width()-1000)/2
                            })
                            return false;
                        }
                        
                    });
                    $(".scoreText").on("click",function(){//评分按钮
                        var authInfo = $(this).parents('.gr_list').find('.ev_vedioT_writer');
                        data=$(this).parents(".v3con_list").attr("data");
                        dataObj=$.secureEvalJSON(data);
                        refType=dataObj.refType;
                        dataObj.customerId=t.config.customerId;
                        dataObj.activityId=t.config.activityId;
                        t.config.dataForScore = dataObj;
                        if(!authInfo.hasClass('ev_authInfo_exist')){
	                            t.videoAbstractUpdate(authInfo,this);
	                            
	                    }else{
	                        	t.domUpdate(this);
	                        	t.videoCKPlayer($(this).parents('.gr_list').eq(0).attr('resourceAttUrl'));//播放器的操作
	                    }

                        if(refType==7){//病例
                            $(".videoT_playBox_nav").hide();
                        }else{
                            $(".videoT_playBox_nav").show();
                        }
                        pk_score(dataObj);
                        $('.videoT_playBox').css({
                            	top:$(window).scrollTop()+50,
                            	left:($(window).width()-1000)/2
                            })
                        t.videoPosition();
                    });
                }
            },
            domUpdate:function(obj){
            	$(".ev_videoTitle").text($(obj).parents(".v3con_list").find('.titleBar').eq(0).text());
                $(".ev_nameCard").text($(obj).parents(".v3con_list").find('.ev_vedioT_writer').eq(0).text());
                $(".ev_docPosition").text($(obj).parents(".v3con_list").find('.ev_vedioT_writer').eq(0).attr('customersocialtitle'));
                $(".ev_hospitalName").text($(obj).parents(".v3con_list").find('.ev_vedioT_writer').eq(0).attr('customercompany'));
                if($(".ev_videoAbstract").length>0){
                    $(".ev_videoAbstract").text($(obj).parents(".v3con_list").find('.ev_vedioT_writer').eq(0).attr('videoabstract'));
                }
                $(".ev_operation").text($(obj).parents(".v3con_list").find('.ev_vedioT_p').eq(0).text());
            },
            videoAbstractUpdate:function(obj,o){
            	var t=this;
            	var refId = t.config.dataForScore.refId!==undefined?t.config.dataForScore.refId:"",
            		refType = t.config.dataForScore.refType!==undefined?t.config.dataForScore.refType:"";
            	$(".ev_videoTitle,.ev_nameCard,.ev_docPosition,.ev_hospitalName,.ev_operation").text("");
            	t.ajaxFn({
                    url:t.config.videoUrl,
                    param:{
                        refId: refId,
                        refType:refType,
                        activityId: t.config.activityId
                    },
                    async:false,
                    fn:function(data){
                        if(data&&data.responseObject&&data.responseObject.responseData&&(!$.isEmptyObject(data.responseObject.responseData))){
                        	var item=data.responseObject.responseData;
                          	var videoAbstract=item.resourceInfo.resourceAbstract;//视频简介
                            var resourceAttUrl=item.resourceAttachment?item.resourceAttachment.resourceAttUrl:"";
                            var customerCompany=item.activityRegisterInfo.customerCompany;//作者医院
                            var customersocialTitle=item.activityRegisterInfo.customersocialTitle;//作者职称
                            $(obj).attr({
                                customerCompany:customerCompany,
                                customersocialTitle:customersocialTitle.match(/\W\D+/g).toString().replace(/,,/g,","),
                                videoAbstract:videoAbstract

                            }).addClass('ev_authInfo_exist');
                            $(o).parents('.gr_list').eq(0).attr('resourceAttUrl',resourceAttUrl);
							t.domUpdate(o);
                            t.videoCKPlayer($(o).parents('.gr_list').eq(0).attr('resourceAttUrl'));//播放器的操作
                        }
                    }
                });
            },
            videoCKPlayer:function(resourceAttUrl){
                var flashvars={
                    f:resourceAttUrl,//视频地址
                    c:0,//是否读取文本配置，0不读取，1读取
                    e:2,//视频结束时暂停播放并且不调用广告
                    p:1//视频默认播放，0默认暂停但是加载视频
                };
                var params={bgcolor:'#FFF',allowFullScreen:true,allowScriptAccess:'always'};
                CKobject.embedSWF('/js/third-party/ckplayer6.6/ckplayer/ckplayer.swf','a1','CKa1','1000','562',flashvars,params);
            },
            bindClick:function() {
                var t = this;
                $(".ev_finishEvaluate").off("click").on("click", function () {//已评作品的点击
                    if($(this).hasClass("ele_main_nav_cur")){
                        return false;
                    }else{
                        $(".ev_waitEvaluate").removeClass("ele_main_nav_cur");
                        $(".ev_finishEvaluate").addClass("ele_main_nav_cur");
                        t.waitCheck(t.config.CHECKED);//已评分 2
                    }
                });
                $(".ev_waitEvaluate").off("click").on("click", function () {//待评作品的点击
                    if($(this).hasClass("ele_main_nav_cur")){
                        return false;
                    }else{
                        $(".ev_finishEvaluate").removeClass("ele_main_nav_cur");
                        $(".ev_waitEvaluate").addClass("ele_main_nav_cur");
                        t.waitCheck(t.config.UNCHECKED);
                    }
                });
                $(".videoTpk_btn a").on("click", function () {//播放视频弹窗的关闭按钮
                    if ($('.scoreNumber').length == 0) {
                        $("#videoMask").hide();
                        $("#videoPlayer").hide().removeClass('ev_scoring');
                        //事件埋点
                        comm.creatEvent({
                            triggerType:"全站功能按钮点击",
                            keyword:"视频PK活动页面观看视频关闭",
                            actionId:43
                        });
                    }
                });
                $(".vPlay").off('click').on("click", function () {//点击视频播放按钮
                	if ($('#vPK_prof_score').is(":visible")) {		//如果评分显示，则加ev_scoring（正在评分）
                        if (!$('#videoPlayer').is(":visible")) {
                            $("#videoPlayer").show().css('visibility', 'visible').addClass('ev_scoring');
                        } else {
                            if($('#CKa1').length>0){CKobject.getObjectById('CKa1').videoPause();}
                            $('#videoPlayer').css('visibility', 'visible');
                        }
                        $("#videoPlayer").addClass('ev_scoring');
                    }else{
                    	$("#videoPlayer").removeClass('ev_scoring');
                    }
                    $("#vPK_prof_score").hide();
                });
                    $(".vScore").off('click').on("click", function () {//点击评分按钮
                        $('#videoPlayer').css('visibility', 'hidden');
                        if (!$('#vPK_prof_score').is(":visible")) {
                        	if($('#videoPlayer').hasClass('ev_scoring')){//评分进行中。。。
                        		$("#vPK_prof_score").show();
                        	}else{
                        		pk_score(t.config.dataForScore);
                        	}
                            if($('#CKa1').length>0){CKobject.getObjectById('CKa1').videoPause();}
                        }
                    });
            },
            videoPosition:function(){
            	var t=this;
            	if($('.videoT_playBox').is(":visible")){
            		$(this).css({
            			left:($(window).width()-1000)/2+'px'
            		});
            	}
            	$(window).on('load resize',function(){
            		$('.videoT_playBox').css({
            			left:($(window).width()-1000)/2+'px'
            		});
            	})
            }
        };
        controller.init();
};
function closelights(){//关灯
    document.getElementsByTagName("body")[0].style.overflowY="hidden";
    $('#videoPlayer').append('<div class="light_off_bg" style="position:fixed;width:100%;height:100%;background:#000;top:0;left:0;z-index:13;"></div>');
}
function openlights(){//开灯
    document.getElementsByTagName("body")[0].style.overflowY="auto";
    $('#videoPlayer').find('.light_off_bg').remove();
}