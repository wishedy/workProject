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
            customerId: $("#sesCustomerId").val(),
            pageSize: 20,
            pageIndex: 1,
            useFlag: 3,
            attUseFlag: 8,
            activityId:$("#activityId").val(),
            expireStatus:1,//没有截止
            dataForScore:{}
        },
        init:function(){
            var t=this;
            $(".expertReview").show();//待评已评按钮
            t.expireStatus();
            t.bindClick();
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
        waitCheck:function(){//待评和已评作品列表的显示
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
                    resourceStatus:1
                },
                fn:function(data){
                    t.addWaitHtml(data);
                }
            });
        },
        finishCheck:function(){//待评和已评作品列表的显示
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
                    resourceStatus:2
                },
                fn:function(data){
                    t.addFinishHtml(data);
                }
            });
        },
        expireStatus:function(){//评分时间判断
            var t=this,
                cfg= t.config,expireStatus;
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
                                t.finishCheck();
                                $(".expertReview_wait").remove();
                            }else{//时间没有截止
                                t.waitCheck();
                                t.finishCheck();
                            }
                        }
                    }
                })
        },
        addWaitHtml:function(data){
            var t=this,cfg= t.config,html="";
            if(data&&data.responseObject.responseData){
                var items=data.responseObject.responseData.pageMap.items;
                var wEvaluateNum=data.responseObject.responseData.pageMap.alreadyAuditCount;//待评审请求时已评审列表的数据有多少
                $(".expertReview_wait").show();
                for(var i=0;i<items.length;i++){
                    var refType=items[i].resourceInfo.refType,//类型，1视频，7病例
                        refId=items[i].resourceInfo.refId,//资源id
                        scoreType = items[i].resourceInfo.scoreType,//评分类型
                        refCustomerId = items[i].customerInfo.customerId,//上传人的id
                        refCompany = items[i].resourceInfo.refCompany,//作者所属医院
                        refAbstract = items[i].resourceInfo.refAbstract,//资源描述
                        playTime=items[i].resourceInfo.playTime,//视频时间
                        titleText=items[i].resourceInfo!=""?items[i].resourceInfo.refName:"",//标题
                        customerName=items[i].resourceInfo.refAuthor,//作者名
                        propertName=items[i].propertyInfo.propertName,//术式
                        pageStoragePath=items[i].resourceInfo.pageStoragePath!=""?items[i].resourceInfo.pageStoragePath:"javascript:;";//pc终端页的地址
                    var imgSrc;
                    $(".expertReview_wait span").text("（"+items.length+"）");
                    if(items[i].attachmentInfo){
                        imgSrc=items[i].attachmentInfo.attachmentUrl;
                    }else{//默认图片
                        imgSrc="/images/img10/default/loading/225_150.jpg";
                    }
                    html += '<div class="wait_cont_piece" data={"refType":"'+refType+'","refId":"'+refId+'","scoreType":"'+scoreType+'","refCustomerId":"'+refCustomerId+'"}>'+
                        '<div class="wait_cont_piece_right">'+
                        '<a href="'+pageStoragePath+'" class="tu"><img src="'+imgSrc+'"></a>'+
                        '<span>'+playTime+'</span>'+
                        '<img class="video_btn" src="/images/img10/v3/common/icon/video_btn.png">'+
                        '</div>'+
                        '<div class="wait_cont_piece_left">'+
                        '<a href="'+pageStoragePath+'"><h3 class="titleBar">'+comm.getStrLen(titleText,80)+'</h3></a>'+
                        '<div class="docInfo">'+
                        '<p><span class="ev_vedioT_writer">'+customerName+'</span><span>'+refCompany+'</span></p>'+
                        '<p><span>术式</span><span class="ev_vedioT_p">'+propertName+'</span></p>'+
                        '</div>'+
                        '<p class="describe">'+(refAbstract?comm.getStrLen(refAbstract,154) : "")+'</p>'+
                        '<div class="buttonBox">'+
                        '<a href="'+pageStoragePath+'" class="tu">查看作品</a>'+
                        '<a href="javascript:;" class="scoreText">立即打分</a>'+
                        '</div>'+
                        '</div>'+
                        '</div>'
                }
                $(".wait_cont").html(html);
                if(cfg.expireStatus==1){//打分未结束
                    if($('#activityId').attr('isReviewBegin')==1){
                        if($(".wait_cont .wait_cont_piece").length==0){
                            if(wEvaluateNum==0){
                                $(".er_noList").show().html("<p>作品正在整理中，请耐心等待...</p>");
                                $(".expertReview_wait").hide();
                                $(".expertReview_finish").hide();
                            }else{
                                $(".er_noList").show().html("<p>暂时没有需要评分的作品哦～</p>");
                                $(".expertReview_wait").hide();
                            }
                        }
                    }else{//专家打分没开始
                        $(".er_noList").show().html("<p>作品正在整理中，请耐心等待...</p>");
                        $(".expertReview_wait").hide();
                        $(".expertReview_finish").hide();
                    }
                }else{//评分结束，专家没有评分的作品
                    if($(".wait_cont .wait_cont_piece").length==0){
                        $(".er_noList").show().html("<p>暂时没有需要评分的作品哦～</p>");
                        $(".expertReview_wait").hide();
                    }
                }
                t.worksListClick(t.config.expireStatus);
            }
        },
        addFinishHtml:function(data){
            var t=this,html="";
            if(data&&data.responseObject.responseData){
                var items=data.responseObject.responseData.pageMap.items;
                if(items.length>0){
                    $(".expertReview_finish").show();
                }
                for(var i=0;i<items.length;i++){
                    var refType=items[i].resourceInfo.refType,//类型，1视频，7病例
                        refId=items[i].resourceInfo.refId,//资源id
                        scoreType = items[i].resourceInfo.scoreType,//评分类型
                        refCustomerId = items[i].customerInfo.customerId,//上传人的id
                        refCompany = items[i].resourceInfo.refCompany,//作者所属医院
                        refAbstract = items[i].resourceInfo.refAbstract,//资源描述
                        playTime=items[i].resourceInfo.playTime,//视频时间
                        titleText=items[i].resourceInfo!=""?items[i].resourceInfo.refName:"",//标题
                        customerName=items[i].resourceInfo.refAuthor,//作者名
                        propertName=items[i].propertyInfo.propertName,//术式
                        score=items[i].resourceInfo.score,//分数
                        pageStoragePath=items[i].resourceInfo.pageStoragePath!=""?items[i].resourceInfo.pageStoragePath:"javascript:;";//pc终端页的地址
                    var imgSrc;
                    $(".expertReview_finish span").text("（"+items.length+"）");
                    if(items[i].attachmentInfo){
                        imgSrc=items[i].attachmentInfo.attachmentUrl;
                    }else{//默认图片
                        imgSrc="/images/img10/default/loading/225_150.jpg";
                    }
                    html += '<div class="wait_cont_piece" data={"refType":"'+refType+'","refId":"'+refId+'","scoreType":"'+scoreType+'","refCustomerId":"'+refCustomerId+'"}>'+
                        '<div class="wait_cont_piece_right">'+
                        '<a href="'+pageStoragePath+'" class="tu"><img src="'+imgSrc+'"></a>'+
                        '<span>'+playTime+'</span>'+
                        '<img class="video_btn" src="/images/img10/v3/common/icon/video_btn.png">'+
                        '</div>'+
                        '<div class="wait_cont_piece_left">'+
                        '<a href="'+pageStoragePath+'" class="titleBar"><h3 class="titleBar">'+comm.getStrLen(titleText,80)+'</h3></a>'+
                        '<div class="docInfo">'+
                        '<p><span class="ev_vedioT_writer">'+customerName+'</span><span>'+refCompany+'</span></p>'+
                        '<p><span>术式</span><span class="ev_vedioT_p">'+propertName+'</span></p>'+
                        '</div>'+
                        '<p class="describe">'+(refAbstract?comm.getStrLen(refAbstract,154) : "")+'</p>'+
                        '<div class="buttonBox">'+
                        '<span><i>'+score+'</i>分</span>'+
                        '<a href="'+pageStoragePath+'" class="tu">查看作品</a>'+
                        '<a href="javascript:;" class="scoreText">修改打分</a>'+
                        '</div>'+
                        '</div>'+
                        '</div>'
                }
                $(".finish_cont").html(html);
                //if($(".finish_cont .wait_cont_piece").length==0){
                //    $(".expertReview_finish").hide()
                //}
                t.worksListClick(t.config.expireStatus);
            }
        },
        worksListClick:function(expireStatus){
            var t=this,
                data,
                dataObj={},
                refType=1;
            if(expireStatus==1){//评分时间没有截止
                $(".tu,.titleBar").on("click", function () {
                    var authInfo = $(this).parents('.wait_cont_piece').find('.ev_vedioT_writer');
                    data=$(this).parents(".wait_cont_piece").attr("data");
                    dataObj=$.secureEvalJSON(data);
                    dataObj.refType=refType;
                    dataObj.customerId=t.config.customerId;
                    dataObj.activityId=t.config.activityId;
                    t.config.dataForScore = dataObj;
                    if(!authInfo.hasClass('ev_authInfo_exist')){
                        t.videoAbstractUpdate(authInfo,this);
                    }else{
                        t.domUpdate(this);
                        t.videoCKPlayer($(this).parents('.wait_cont_piece').eq(0).attr('resourceAttUrl'));//播放器的操作
                    }

                    if(refType==1){//视频
                        $("#videoMask").show();
                        $("#videoTpk_btn").show();
                        $("#videoPlayer").show().css('visibility','visible');
                        $(".videoT_playBox_nav").show();
                        return false;
                    }
                });
                $(".scoreText").on("click",function(){//评分按钮
                    var authInfo = $(this).parents('.wait_cont_piece').find('.ev_vedioT_writer');
                    data=$(this).parents(".wait_cont_piece").attr("data");
                    dataObj=$.secureEvalJSON(data);
                    dataObj.refType=refType;
                    dataObj.customerId=t.config.customerId;
                    dataObj.activityId=t.config.activityId;
                    t.config.dataForScore = dataObj;
                    if(!authInfo.hasClass('ev_authInfo_exist')){
                        t.videoAbstractUpdate(authInfo,this);
                    }else{
                        t.domUpdate(this);
                        t.videoCKPlayer($(this).parents('.wait_cont_piece').eq(0).attr('resourceAttUrl'));//播放器的操作
                    }
                    pk_score_v2(dataObj);
                });
            }
        },
        domUpdate:function(obj){
            $(".ev_videoTitle").text($(obj).parents(".wait_cont_piece").find('.titleBar').eq(0).text());
            $(".ev_nameCard").text($(obj).parents(".wait_cont_piece").find('.ev_vedioT_writer').eq(0).text());
            $(".publishTime i").text($(obj).parents(".wait_cont_piece").find('.ev_vedioT_writer').eq(0).attr('publishTime'));
            $(".playNum").text($(obj).parents(".wait_cont_piece").find('.ev_vedioT_writer').eq(0).attr('playNum'))
            if($(".ev_videoAbstract").length>0){
                $(".ev_videoAbstract").text($(obj).parents(".wait_cont_piece").find('.ev_vedioT_writer').eq(0).attr('videoabstract'));
            }
            $(".ev_operation").text($(obj).parents(".wait_cont_piece").find('.ev_vedioT_p').eq(0).text());
        },
        videoAbstractUpdate:function(obj,o){
            var t=this;
            var refId = t.config.dataForScore.refId!==undefined?t.config.dataForScore.refId:"",
                refType = t.config.dataForScore.refType!==undefined?t.config.dataForScore.refType:"";
            $(".ev_videoTitle,.ev_nameCard,.ev_operation").text("");
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
                        var resourceAttUrl=item.resourceAttachment?item.resourceAttachment.resourceAttUrl:"";//视频链接
                        var publishTime=item.resourceInfo.publishTime;//发布时间
                        var playNum=item.resourceInfo.playNum;//视频播放量
                        $(obj).attr({
                            publishTime:publishTime,
                            playNum:playNum,
                            videoAbstract:videoAbstract
                        }).addClass('ev_authInfo_exist');
                        $(o).parents('.wait_cont_piece').eq(0).attr('resourceAttUrl',resourceAttUrl);
                        t.domUpdate(o);
                        t.videoCKPlayer($(o).parents('.wait_cont_piece').eq(0).attr('resourceAttUrl'));//播放器的操作
                    }
                }
            });
        },
        videoCKPlayer:function(resourceAttUrl){
            var t=this;
            /*var flashvars={
                f:resourceAttUrl,//视频地址
                c:0,//是否读取文本配置，0不读取，1读取
                e:2,//视频结束时暂停播放并且不调用广告
                p:1//视频默认播放，0默认暂停但是加载视频
            };
            var params={bgcolor:'#FFF',allowFullScreen:true,allowScriptAccess:'always'};
            CKobject.embedSWF('/js/third-party/ckplayer6.6/ckplayer/ckplayer.swf','a1','CKa1','708','562',flashvars,params);*/
            //视频初始化
            $("#a1").html('<video id="ev-videoDetailCon" class="video-js vjs-default-skin vjs-no-flex vjs-big-play-centered" oncontextmenu="return true">'+
            '<source src="'+resourceAttUrl+'" type="video/mp4"/>'+
            '</video>');
            var player2 = new AllinmdPlayer('ev-videoDetailCon', {
                width:708,
                height:562,
                poster:"//img10.allinmd.cn/v3/terminal/defaultVideo.jpg",  //播放之前需要放置的海报图片
                //IE8下使用的swf地址
                flash: {
                    swf:'//paas.allinmd.cn/modules/allinmdplayer/allinmdplayer.swf'
                },
                //需要使用的插件，清晰度切换(videoJsResolutionSwitcher)，关键点显示(progress)
                /*plugins: {
                 videoJsResolutionSwitcher:{"default": 'high', dynamicLabel: "true"}
                 },*/
                //设置播放权限时间，使用时需保证allow值为true
                limitPlayTime:{
                    allow:false,
                    value:3
                },//设置允许最大的快进时长，用于限制用户拖拽至不允许播放的时间点，使用时需保证allow值为true
                setMaxPlayTime:{
                    allow:false,
                    value:0
                }
            },function(){
                var t=this;
                if(player2!=undefined){
                    player2.player.play();
                }else{
                    t.play();
                }

            });
            t.player2=player2;
        },
        bindClick:function() {
            var t = this;
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
                    t.player2.player.pause();
                    t.player2.player.dispose();
                    $("#a1").html("");
                }
            });
            $(".vPlay").off('click').on("click", function () {//点击视频播放按钮
                if ($('#vPK_prof_score').is(":visible")) {		//如果评分显示，则加ev_scoring（正在评分）
                    if (!$('#videoPlayer').is(":visible")) {
                        $("#videoPlayer").show().css('visibility','visible').addClass('ev_scoring');
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
                        pk_score_v2(t.config.dataForScore);
                    }
                    if($('#CKa1').length>0){CKobject.getObjectById('CKa1').videoPause();}
                }
            });
        }
    };
    controller.init();
};
/*function closelights(){//关灯
    document.getElementsByTagName("body")[0].style.overflowY="hidden";
    $('#videoPlayer').append('<div class="light_off_bg" style="position:fixed;width:100%;height:100%;background:#000;top:0;left:0;z-index:13;"></div>');
}
function openlights(){//开灯
    document.getElementsByTagName("body")[0].style.overflowY="auto";
    $('#videoPlayer').find('.light_off_bg').remove();
}*/
