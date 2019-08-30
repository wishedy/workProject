/**
 * 功能描述：  专家作品审核
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by hejing on 2016/01/14.
 *
 * upData by zhanghongda on 2017/07
 */
var activityCheck=function(){
    var temData={};
    temData.scoreMapList=[];
    temData.videoHtml = '<div id="video_wrap"><div id="video"><div id="a1"></div></div></div>';//用来存放视频的插件，分开是为了和病例里面的视频进行区分id
    var controller={
        config:{
            url:PC_CALL+"activity/api/getExpertReviewResource/",//活动四期评分作品列表
            videoUrl:PC_CALL+"/activity/api/getActivityResourceByRefId/",//获取播放视频信息
            endUrl:PC_CALL+"activity/event/isReviewExpired/",//评分时间是否截止
            pageUrl:PC_CALL+"resources/search/search_list_activty/",
            maplist:PC_CALL+"activity/score/getMapList/",
            saveInter:PC_CALL+'customer/score/save/',
            reviewCount:PC_CALL+"activity/api/getExpertReviewResourceCount/",//查看专家待评作品数量
            isExpert:PC_CALL+'activity/api/isExpert/',//查看是否是专家
            customerId: $("#sesCustomerId").val(),pageSize: 10,pageIndex: 1,useFlag: 3,attUseFlag: 8,activityId:$("#activityId").val(),expireStatus:1,//没有截止dataForScore:{},
        },
        init:function(){
            var t=this;
            $(".pingfen_all").css("max-height",parseInt($(window).height())-250-parseInt($(".videoT_playBox_nav").height()));
            $(".v_detail_content").css("max-height",parseInt($(window).height())-250-parseInt($(".v_detail_title").height()));
            t.expireStatus();//评分是否截止
            t.checkIsOver();//判断活动是否结束，打分是否开始
            $(".expertReview").show();//待评已评按钮
            t.bindClick();
            t.scoreClose();
        },
        ajaxFn:function(opt) {
            comm.LightBox.showloading();
            var cfg = opt;
            $.ajax({
                url: cfg.url,type: 'post',data: {paramJson: $.toJSON(cfg.param)},dataType: 'json',
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
            var param={
                pageIndex:t.config.pageIndex,
                pageSize:t.config.pageSize,
                useFlag: t.config.useFlag,
                attUseFlag:t.config.attUseFlag,
                customerId:t.config.customerId,
                activityId:t.config.activityId,
                resourceStatus:1
            };
            param = {paramJson: $.toJSON(param)}
            var callback = function (data) {
                t.addWaitHtml(data);
            };
            comm.ajax.async(t.config.url,param,callback);
        },
        finishCheck:function(){//待评和已评作品列表的显示
            var t=this;
            var param={
                pageIndex:t.config.pageIndex,
                pageSize:t.config.pageSize,
                useFlag: t.config.useFlag,
                attUseFlag:t.config.attUseFlag,
                customerId:t.config.customerId,
                activityId:t.config.activityId,
                resourceStatus:2
            };
            param = {paramJson: $.toJSON(param)}
            var callback = function (data) {
                t.addFinishHtml(data);
            };
            comm.ajax.async(t.config.url,param,callback);
        },
        expireStatus:function(){//评分时间判断
            var t=this,expireStatus;
            t.ajaxFn({
                url: t.config.endUrl,
                param:{activityId: t.config.activityId},
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
        addWaitHtml:function(data){//待评作品
            var t=this,cfg= t.config,html="";
            if(data&&data.responseObject.responseData){
                var items=data.responseObject.responseData.pageMap.items;
                var wEvaluateNum=data.responseObject.responseData.pageMap.alreadyAuditCount;//待评审请求时已评审列表的数据有多少
                $(".expertReview_wait").show();
                $(".expertReview_wait h2 span").text("（"+data.responseObject.responseData.pageMap.totalCount+"）");
                for(var i=0;i<items.length;i++){
                    var refType=items[i].resourceInfo.refType,//类型，1视频，7病例
                        refId=items[i].resourceInfo.refId,//资源id
                        scoreType = items[i].resourceInfo.scoreType,//评分类型
                        refCustomerId = items[i].customerInfo.customerId?items[i].customerInfo.customerId:'',//上传人的id
                        refCompany = items[i].resourceInfo.refCompany,//作者所属医院
                        refAbstract = items[i].resourceInfo.refAbstract,//资源描述
                        playTime=items[i].resourceInfo.playTime,//视频时间
                        titleText=items[i].resourceInfo!=""?items[i].resourceInfo.refName:"",//标题
                        customerName=items[i].resourceInfo.refAuthor,//作者名
                        propertName=items[i].propertyInfo.propertName?items[i].propertyInfo.propertName:'',//术式
                        pageStoragePath=items[i].resourceInfo.pageStoragePath!=""?items[i].resourceInfo.pageStoragePath:"javascript:;",//pc终端页的地址
                        publishTime=items[i].resourceInfo.publishTime;//发布时间
                    var imgSrc,propertType='',isHasPic,MRNum;
                    if(items[i].propertyInfo.configName&&items[i].propertyInfo.configName.split(",").length>0){
                        var arr = comm.cutLine(items[i].propertyInfo.configName,"_",",").split(",");
                        propertType = arr[arr.length-1];
                    }
                    if(items[i].attachmentInfo){
                        if(items[i].attachmentInfo.attachmentUrl&&items[i].attachmentInfo.attachmentUrl.lastIndexOf("|")>-1){//将不合法的图片名称进行截取
                            imgSrc=items[i].attachmentInfo.attachmentUrl.split("|")[0];
                        }else{
                            imgSrc=items[i].attachmentInfo.attachmentUrl;
                        }
                    }else{//默认图片
                        imgSrc="/images/img10/default/loading/225_150.jpg";
                    }
                    switch (refType) {
                        case 1://视频
                            isHasPic = '<div class="wait_cont_piece_right">'+
                                        '<a data-href="'+pageStoragePath+'" class="tu ev-tu"><img src="'+imgSrc+'"></a>'+
                                        '<span>'+playTime+'</span>'+
                                        '<img class="video_btn ev-tu" src="/images/img10/v3/common/icon/video_btn.png">'+
                                        '</div>';
                            MRNum = 260;//用来组合样式，有图片时候有margin-right:260px;无时为0
                            break;
                        case 2://文库无图
                            isHasPic = '';
                            MRNum = 0;
                            break;
                        case 4://话题
                            if(items[i].attachmentInfo&&items[i].attachmentInfo.attachmentUrl.length>0){
                                if(items[i].attachmentInfo.attachmentUrl&&items[i].attachmentInfo.attachmentUrl.length>0)
                                isHasPic = '<div class="wait_cont_piece_right">'+
                                    '<a href="javaScript:;" data-href="'+pageStoragePath+'" class="tu ev-tu"><img src="'+imgSrc+'"></a>'+
                                    '</div>';
                                MRNum = 260;
                            }else{
                                isHasPic = '';
                                MRNum = 0;
                            }
                            break;
                        case 7://病例
                            isHasPic = '<div class="wait_cont_piece_right">'+
                                '<a href="javaScript:;" data-href="'+pageStoragePath+'" class="tu ev-tu"><img src="'+imgSrc+'"></a>'+
                                '</div>';
                            MRNum = 260;
                            break;
                    }
                    html += '<div class="wait_cont_piece" data={"refType":"'+refType+'","refId":"'+refId+'","scoreType":"'+scoreType+'","refCustomerId":"'+refCustomerId+'"} data-publliTime="'+publishTime+'">'+
                        isHasPic+
                        '<div class="wait_cont_piece_left" style="margin-right: '+MRNum+'px">'+
                        '<a data-href="'+pageStoragePath+'"><h3 class="titleBar"><span class="resourceNum">'+items[i].resourceInfo.resourceNum+'</span><span class="ev-actTitle">'+comm.getStrLen(titleText,80)+'</span></h3></a>'+
                        '<div class="docInfo">'+
                        // '<p><span class="ev_vedioT_writer">'+(customerName?customerName:"")+'</span><span>'+(refCompany?refCompany:"")+'</span></p>'+
                        '<p><span class="ev_vedioT_writer"></span><span></span></p>'+
                        ((propertType!=''&&propertName!='')?'<p class="actProType"><span class="ev-actProType">'+propertType+'</span><span class="ev_vedioT_p">'+propertName+'</span></p>':'')+
                        '</div>'+
                        '<p class="describe">'+(refAbstract?comm.getStrLen(refAbstract,154) : "")+'</p>'+
                        '<div class="buttonBox">'+
                        (refType==1||refType==7?'<a data-href="'+pageStoragePath+'" href="javaScript:;" class="tu ev-tu">查看作品</a>':'')+
                        '<a data-href="'+pageStoragePath+'" href="javaScript:;" class="scoreText">立即打分</a>'+
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
                    }else{
                        $(".er_noList").show().html("<p>作品正在整理中，请耐心等待...</p>");
                        $(".expertReview_wait").hide();
                        $(".expertReview_finish").hide();
                    }
                }
                t.worksListClick(t.config.expireStatus);
                if(data.responseObject.responseData.pageMap.totalCount>10){//分页
                    t.pageCli(data,$(".ev-waitWorkPager"),1);
                }else{
                    $(".ev-waitWorkPager").hide();
                }
            }
        },
        addFinishHtml:function(data){//已评作品
            var t=this,html="",items='';
            if(data&&data.responseObject.responseData){
                if(data.responseObject.responseData.pageMap){
                    items=data.responseObject.responseData.pageMap.items;
                    if(items.length>0){
                        $(".expertReview_finish").show();
                        $(".expertReview_finish h2 span").text("（"+data.responseObject.responseData.pageMap.totalCount+"）");
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
                            propertName=items[i].propertyInfo.propertName?items[i].propertyInfo.propertName:'',//术式
                            score=items[i].resourceInfo.score,//分数
                            pageStoragePath=items[i].resourceInfo.pageStoragePath!=""?items[i].resourceInfo.pageStoragePath:"javascript:;";//pc终端页的地址
                        publishTime= items[i].resourceInfo.publishTime;//发布时间
                        var imgSrc,propertType='',isHasPic,MRNum;
                        if(items[i].propertyInfo.configName&&items[i].propertyInfo.configName.split(",").length>0){
                            var arr = comm.cutLine(items[i].propertyInfo.configName,"_",",").split(",");
                            propertType = arr[arr.length-1];
                        }
                        if(items[i].attachmentInfo){
                            if(items[i].attachmentInfo.attachmentUrl&&items[i].attachmentInfo.attachmentUrl.lastIndexOf("|")>-1){//将不合法的图片名称进行截取
                                imgSrc=items[i].attachmentInfo.attachmentUrl.split("|")[0];
                            }else{
                                imgSrc=items[i].attachmentInfo.attachmentUrl;
                            }
                        }else{//默认图片
                            imgSrc="/images/img10/default/loading/225_150.jpg";
                        }
                        switch (refType) {
                            case 1://视频
                                isHasPic = '<div class="wait_cont_piece_right">'+
                                    '<a href="javaScript:;" data-href="'+pageStoragePath+'" class="tu ev-tu"><img src="'+imgSrc+'"></a>'+
                                    '<span>'+playTime+'</span>'+
                                    '<img class="video_btn ev-tu" src="/images/img10/v3/common/icon/video_btn.png">'+
                                    '</div>';
                                MRNum = 260;
                                break;
                            case 2://文库无图
                                isHasPic = '';
                                MRNum = 0;
                                break;
                            case 4://话题
                                if(items[i].attachmentInfo&&items[i].attachmentInfo.attachmentUrl.length>0){
                                    if(items[i].attachmentInfo.attachmentUrl){
                                        isHasPic = '<div class="wait_cont_piece_right">'+
                                            '<a href="javaScript:;" data-href="'+pageStoragePath+'" class="tu ev-tu"><img src="'+imgSrc+'"></a>'+
                                            '</div>';
                                        MRNum = 260;
                                    }
                                }else{
                                    isHasPic = '';
                                    MRNum = 0;
                                }
                                break;
                            case 7://病例
                                isHasPic = '<div class="wait_cont_piece_right">'+
                                    '<a href="javaScript:;" data-href="'+pageStoragePath+'" class="tu ev-tu"><img src="'+imgSrc+'"></a>'+
                                    '</div>';
                                MRNum = 260;
                                break;
                        }
                        html += '<div class="wait_cont_piece" data={"refType":"'+refType+'","refId":"'+refId+'","scoreType":"'+scoreType+'","refCustomerId":"'+refCustomerId+'"} data-publliTime="'+publishTime+'">'+
                            isHasPic+
                            '<div class="wait_cont_piece_left" style="margin-right: '+MRNum+'px">'+
                            '<a data-href="'+pageStoragePath+'" class="titleBar"><h3 class="titleBar"><span class="resourceNum">'+items[i].resourceInfo.resourceNum+'</span><span class="ev-actTitle">'+comm.getStrLen(titleText,80)+'</span></h3></a>'+
                            '<div class="docInfo">'+
                            // '<p><span class="ev_vedioT_writer">'+customerName+'</span><span>'+refCompany+'</span></p>'+
                            '<p><span class="ev_vedioT_writer"></span><span></span></p>'+
                            ((propertType!=''&&propertName!='')?'<p class="actProType"><span class="ev-actProType">'+propertType+'</span><span class="ev_vedioT_p">'+propertName+'</span></p>':'')+
                            '</div>'+
                            '<p class="describe">'+(refAbstract?comm.getStrLen(refAbstract,154) : "")+'</p>'+
                            '<div class="buttonBox">'+
                            '<span>'+data.responseObject.responseData.activityPromotedName+'得分：<i>'+score+'</i></span>'+
                            (data.responseObject.responseData.pageMap.items[i].resourceInfo.scoreType==1||refType==7?'<a data-href="'+pageStoragePath+'" href="javaScript:;" class="tu ev-tu">查看作品</a>':'')+
                            '<a data-href="'+pageStoragePath+'" href="javaScript:;" class="scoreText">修改打分</a>'+
                            '</div>'+
                            '</div>'+
                            '</div>'
                    }
                    $(".finish_cont").html(html);
                    t.worksListClick(t.config.expireStatus);
                    if(data.responseObject.responseData.pageMap.totalCount>10){//分页
                        t.pageCli(data,$(".ev-alreadyWorkPager"),2);
                    }else{
                        $(".ev-alreadyWorkPager").hide();
                    }
                }
            }
        },
        worksListClick:function(expireStatus){//作品列表的点击
            var t=this,
                data,
                dataObj={};
            if(expireStatus==1){//评分时间没有截止
                $(".ev-tu,.titleBar").off("click").on("click", function () {//视频的点击,查看作品，标题点击
                    $("body").css("overflow","hidden");
                    var This = $(this);//将$(this)数据进行存储，用于后面弹层提示跳转时进行数据解析
                    var openUrl = $(this).parent("a").attr("data-href");
                    refType = $.parseJSON($(this).parents(".wait_cont_piece").attr("data")).refType;
                    refId = $.parseJSON($(this).parents(".wait_cont_piece").attr("data")).refId;
                    if(refType==1||refType==7){//如果是视频或者病例，则进入视频详情页，否则弹层进入终端页
                        var authInfo = $(this).parents('.wait_cont_piece').find('.ev_vedioT_writer');
                        data=$(this).parents(".wait_cont_piece").attr("data");
                        dataObj=$.secureEvalJSON(data);
                        dataObj.refType=refType;
                        dataObj.customerId=t.config.customerId;
                        dataObj.activityId=t.config.activityId;
                        dataObj.recordId = $("#activityId").attr("recordId");
                        t.config.dataForScore = dataObj;
                        $("body").css("overflow","hidden");
                        $(".activityScoreCont").show();
                        $("#videoMask").show();
                        $("#videoTpk_btn").show();
                        $("#videoPlayer").show().css('visibility','visible');
                        $(".videoT_playBox_nav").show();
                        $("#vPK_prof_score").hide();
                        if(refType==1){//如果是视频
                            $(".v_detail_content").show();
                            $(".al-libraryInfoBox").remove();
                            $(".vPlay").text("视频播放");
                            if($("#a1").length<=0){
                                $("#v_detail_title").after(temData.videoHtml);//将视频插件进行插入
                            }
                            if(!authInfo.hasClass('ev_authInfo_exist')){//如果用户没有看过了视频
                                t.videoAbstractUpdate(authInfo,this);
                            }else{
                                t.domUpdate(this);
                                t.videoCKPlayer($(this).parents('.wait_cont_piece').eq(0).attr('resourceAttUrl'));//播放器的操作
                            }
                        }else if(refType==7){//如果是比病例（区分视频、图片、视频+图片）本次主要代码
                            $(".v_detail_content").hide();
                            $("#v_detail_content").find("#video_wrap").remove();
                            $(".al-libraryInfoBox").remove();
                            $(".vPlay").text("查看病例");
                            var _href=$(this).parents(".wait_cont_piece").find(".ev-tu").attr("data-href"),
                                refId=_href?_href.substring(_href.lastIndexOf("/") + 1, _href.lastIndexOf(".html")):"";
                            $.ajax({//此处将dom结构（模板）追加进去，然后判断是否存在视频，如果存在则进行播放，否则不走入视频操作
                                url:$(this).parents(".wait_cont_piece").find(".ev-tu").attr("data-href").replace("case","caseActivity"),//"/js/scene/column/activity_template/001-05-01.html",
                                dataType:'html',
                                type:'get',
                                success:function(file){
                                    comm.LightBox.hideloading();
                                    $(".videoT_playBox_con").append(file);
                                    $('.Ev-shareTitleName a').remove();//将人名进行移除
                                    reviewEvent(refId);//1502876072848refId
                                    $("#nowShowRefId").val(refId);
                                    if($("#a1").length>0&&$("#a1").find(".Ev-videoPic").attr("data-videosrc")){
                                        t.videoCKPlayer($("#a1").find(".Ev-videoPic").attr("data-videosrc"),660,550,$("#a1").find(".Ev-videoPic").attr("data-videosta"));//播放器的操作
                                    }else{
                                        t.qiniuImgEvent($("#a1 .Ev-videoPic"),refId);//转码图片处理
                                    }
                                    $(".surgery").css("width","660px");
                                    $(".al-libraryInfoBox").css("max-height",parseInt($(window).height())-250-120);
                                    $(document).off("click").on("click", ".viewBigImg", function (e) {//查看大图
                                        var container = $(this);
                                        var index = 0;
                                        if ($(e.target).parents().eq(0).index() > 0) {
                                            index = $(e.target).parents().eq(0).index();
                                        }
                                        module.viewBigImgAll({event: e, container: container, index: index});
                                    });
                                    $(".surgery p").on("click", function () {
                                        module.viewBigImgAll({
                                            event: $(this).siblings(".viewBigImg"),
                                            container: $(this).siblings(".viewBigImg"),
                                            index: 5
                                        });
                                    });
                                }
                            });
                            t.domUpdate(this);
                        }
                    }else{
                        if(TempCache.getItem("noPromp")&&$.parseJSON(TempCache.getItem("noPromp")).activetyId==$("#activityId").val()){//如果用户选中了不再提示，直接跳转
                            Dom=This.parents(".wait_cont_piece").find(".scoreText");
                            scoreTextClick(Dom);
                            g_sps.jump(null,This.parents("a").attr("data-href"));
                        }else{
                            var scrJumpHtml = '<div class="act-scrJumpModal"><section class="al-scrJumpModal" id="" style="z-index: 10">'+
                                '<section class="al-msgDeleteContent">'+
                                '<article><span>即将前往评阅该作品，记得回来打分哟~</span></article>'+
                                '</section>'+
                                '<section class="noPromp"><article><i class="active"></i>不再提示</article></section>'+
                                '<section class="signUpPbtn">'+
                                '<button class="al-msgDeleteConfirm">取消</button>'+
                                '<button class="al-msgDeleteCancel">立即前往</button>'+
                                '</section>'+
                                '</section></div>';
                            $("body").append(scrJumpHtml);
                            $(".al-msgDeleteCancel").off("click").on("click", function () {//立即前往
                                if($(".noPromp").find("i").hasClass("active")){
                                    var noPromp = $.toJSON({activetyId:$("#activityId").val()});
									TempCache.setItem("noPromp",noPromp);
                                    $.cookie("newIsClose")
                                }
                                $(".act-scrJumpModal").remove();
                                $("body").css("overflow","auto");
                                Dom=This.parents(".wait_cont_piece_left").find(".scoreText");
                                scoreTextClick(Dom);
                                var href=This.parents("a").attr("data-href");
                                setTimeout(function () {
                                    g_sps.jump(null,href,true);
                                },300);
                                });
                            $(".al-msgDeleteConfirm").off("click").on("click", function () {//取消
                                $(".act-scrJumpModal").remove();
                                $("body").css("overflow","auto");
                            });
                            $(".noPromp").find("i").off("click").on("click", function () {
                                if($(this).hasClass("active")){
                                    $(this).removeClass("active");
                                    if(TempCache.getItem("noPromp")&&$.parseJSON(TempCache.getItem("noPromp")).activetyId==$("#activityId").val()){
										TempCache.removeItem("noPromp");
                                    }
                                }else{
                                    $(this).addClass("active");
                                    var noPromp = $.toJSON({activetyId:$("#activityId").val()});
									TempCache.setItem("noPromp",noPromp);
                                    $.cookie("newIsClose")
                                }
                            })
                        }
                    }
                    return false;//阻止a标签跳转
                });
                $(".scoreText").off("click").on("click",function(){//评分按钮点击
                    scoreTextClick($(this));
                });
                function scoreTextClick(Dom){//传入Dom参数找到当前点击的位置的各个参数,用于进行跳页的时候获取信息
                    var authInfo = Dom.parents('.wait_cont_piece').find('.ev_vedioT_writer');
                    data=Dom.parents(".wait_cont_piece").attr("data");
                    dataObj=$.secureEvalJSON(data);
                    dataObj.customerId=t.config.customerId;
                    dataObj.activityId=t.config.activityId;
                    dataObj.recordId = $("#activityId").attr("recordId");
                    t.config.dataForScore = dataObj;
                    $("body").css("overflow","hidden");
                    $(".activityScoreCont").show();
                    if(dataObj.refType==1){//如果是视频
                        $(".v_detail_content").show();
                        $(".al-libraryInfoBox").remove();
                        if($("#a1").length<=0){
                            $("#v_detail_title").after(temData.videoHtml);//将视频插件进行插入
                        }
                        if(!authInfo.hasClass('ev_authInfo_exist')){
                            t.videoAbstractUpdate(authInfo,Dom);
                        }else{
                            t.videoCKPlayer(Dom.parents('.wait_cont_piece').eq(0).attr('resourceAttUrl'));//播放器的操作
                            t.domUpdate(Dom);
                        }
                    }else if(dataObj.refType==7){//如果是病例
                        $(".v_detail_content").hide();
                        $("#v_detail_content").find("#video_wrap").remove();
                        $(".al-libraryInfoBox").remove();
                        var _href=Dom.parents(".wait_cont_piece").find(".ev-tu").attr("data-href"),
                            refId=_href?_href.substring(_href.lastIndexOf("/") + 1, _href.lastIndexOf(".html")):"";
                        $.ajax({
                            url:Dom.parents(".wait_cont_piece").find(".ev-tu").attr("data-href").replace("case","caseActivity"),
                            dataType:'html',
                            type:'get',
                            success:function(file){
                                comm.LightBox.hideloading();
                                $(".videoT_playBox_con").append(file);
                                $(".surgery").css("width","660px");
                                $(".al-libraryInfoBox").css("max-height",parseInt($(window).height())-250-120);
                                reviewEvent(refId);//1502876072848refId
                                $("#nowShowRefId").val(refId);
                                if($("#a1").length>0&&$("#a1").find(".Ev-videoPic").attr("data-videosrc")){
                                    t.videoCKPlayer($("#a1").find(".Ev-videoPic").attr("data-videosrc"),660,550,$("#a1").find(".Ev-videoPic").attr("data-videosta"));//播放器的操作
                                }else{
                                    t.qiniuImgEvent($("#a1 .Ev-videoPic"),refId);//转码图片处理
                                }
                                $(document).off("click").on("click", ".viewBigImg", function (e) {//查看大图
                                    var container = $(this);
                                    var index = 0;
                                    if ($(e.target).parents().eq(0).index() > 0) {
                                        index = $(e.target).parents().eq(0).index();
                                    }
                                    module.viewBigImgAll({event: e, container: container, index: index});
                                });
                                $(".surgery p").on("click", function () {
                                    module.viewBigImgAll({
                                        event: $(this).siblings(".viewBigImg"),
                                        container: $(this).siblings(".viewBigImg"),
                                        index: 5
                                    });
                                });
                            }
                        });
                        t.domUpdate(Dom);
                    }else{
                        t.domUpdate(Dom);
                    }
                    $('#videoMask,#vPK_prof_score,#videoTpk_btn').show();
                    $(".vPlay").attr("data-href",$(Dom).attr("data-href"));
                    t.scoreTem(dataObj);
                }
            }
        },
        //病例视频图片处理
        qiniuImgEvent:function(obj,refId){
            var t=this;
            var params = {};
            params.paramJson = $.toJSON({
                refType: 7,
                refId: refId,
                attUseFlag: 10,
                qiniuId: obj.attr("data-qiniuId")
            });
            var cBack=function(res){
                if (obj.length > 0 && res.responseObject.responseStatus && res.responseObject.responseData.videoListMap.length > 0) {
                    var data = res.responseObject.responseData.videoListMap[0];
                    if (data.qiniuStatus == 2) {
                        //图片替换
                        $("img.ev-videoWait", obj).attr("src", data.logoUrl);
                        obj.attr({"data-videosrc":data.attUrl,"data-videosta":data.qiniuStatus});
                        if($("#a1").length>0){
                            t.videoCKPlayer($("#a1").find(".Ev-videoPic").attr("data-videosrc"),660,550,$("#a1").find(".Ev-videoPic").attr("data-videosta"));//播放器的操作
                        }
                    } else if (data.qiniuStatus == 4) {//转码失败
                        $("img.ev-videoWait", obj).attr("src", "//img10.allinmd.cn/default/qiniuFailing900_600.png").show();
                    } else {
                        $("img.ev-videoWait", obj).attr("src", "//img10.allinmd.cn/default/qiniu900_600.jpg").show();
                    }
                }
            };
            comm.ajax.async(PC_CALL + "qiniu/storage/getMapVideoList/",params,cBack);
        },
        pageCli:function(data,dom,sta){//分页操作
            var t = this;
            dom.show();
            PageClick = function(pageclickednumber){
                t.ajaxFn({
                    url: t.config.url,
                    param:{
                        pageIndex:pageclickednumber,
                        pageSize:10,
                        useFlag: t.config.useFlag,
                        attUseFlag:t.config.attUseFlag,
                        customerId:$("#sesCustomerId").val(),
                        activityId:$('#activityId').val(),
                        resourceStatus:sta//保存点击时候传入的数据，1：待评作品，2：已评作品
                    },
                    fn:function(data){
                        if(sta==1){
                            t.addWaitHtml(data);
                        }else{
                            t.addFinishHtml(data);
                        }
                        dom.find(".pager").pager({ pagenumber: pageclickednumber, pagecount: Math.ceil(data.responseObject.responseData.pageMap.totalCount / 10), buttonClickCallback: PageClick });
                    }
                });
            };
            dom.find(".pager").pager({ pagenumber: 1, pagecount: Math.ceil(data.responseObject.responseData.pageMap.totalCount / 10), buttonClickCallback: PageClick });
        },
        domUpdate:function(obj){//数据填充
            $(".ev_videoTitle").text($(obj).parents(".wait_cont_piece").find('.titleBar .ev-actTitle').eq(0).text());
            $(".ev_nameCard").text($(obj).parents(".wait_cont_piece").find('.ev_vedioT_writer').eq(0).text());
            //$(".publishTime i").text($(obj).parents(".wait_cont_piece").find('.ev_vedioT_writer').eq(0).attr('publishTime'));
            $(".publishTime i").text($(obj).parents(".wait_cont_piece").eq(0).attr('data-publliTime'));
            $(".playNum").text($(obj).parents(".wait_cont_piece").find('.ev_vedioT_writer').eq(0).attr('playNum'));
            if($(obj).parents(".wait_cont_piece").find(".ev-actProType").eq(0).text()!=''){
                $(".ev-propTyp").text($(obj).parents(".wait_cont_piece").find(".ev-actProType").eq(0).text()+" ： ");
            }else{
                $(".ev-propTyp").text("");
            }
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
        videoCKPlayer:function(resourceAttUrl,w,h,status){
            var t=this;//视频初始化
            if(status&&status!=2){
                $(".ev-videoWait").show();
                $("#video_wrap").css("height","470px");
            }else{
                $(".ev-videoWait").hide();
                $("#video_wrap").css("height","562px");
                $("#a1").html('<video id="ev-videoDetailCon" class="video-js vjs-default-skin vjs-no-flex vjs-big-play-centered" oncontextmenu="return true">'+
                    '<source src="'+resourceAttUrl+'" type="video/mp4"/>'+
                    '</video>');
                $("#video_wrap").css("marginBottom",'10px');
                //$("#v_detail_content").mCustomScrollbar({theme:"dark"});//将滚动条样式进行更改
                var player2 = new AllinmdPlayer('ev-videoDetailCon', {
                    width:w?w:708,
                    height:h?h:562,
                    poster:"//img10.allinmd.cn/v3/terminal/defaultVideo.jpg",  //播放之前需要放置的海报图片
                    flash: {//IE8下使用的swf地址
                        swf:'//paas.allinmd.cn/modules/allinmdplayer/allinmdplayer.swf'
                    },
                    limitPlayTime:{//设置播放权限时间，使用时需保证allow值为true
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
                comm.player2=player2;
            }
        },
        bindClick:function() {
            var t = this;
            $("#videoPlayer .ev-closeBtn").off("click").on("click", function () {//播放视频弹窗的关闭按钮
                if ($('.scoreNumber').length == 0) {
                    $("#videoMask").hide();
                    $("#videoPlayer").hide().removeClass('ev_scoring');
                    comm.creatEvent({triggerType:"全站功能按钮点击",keyword:"视频PK活动页面观看视频关闭",actionId:43 });
                    $(".activityScoreCont").hide();
                    t.player2.player.pause();
                    t.player2.player.dispose();
                    $("body").css("overflow","auto");
                    $("#a1").html("");
                }
            });
            $(".vPlay").off('click').on("click", function () {//点击视频播放按钮
                if($(this).text()=="查看作品"){
                    var jumpUrl = $(this).attr("data-href");
                    if(TempCache.getItem("noPromp")&&$.parseJSON(TempCache.getItem("noPromp")).activetyId==$("#activityId").val()){
                        comm.LightBox.hide();
                        $(".al-scrJumpModal").remove();
                        $(".activityScoreCont").show();
                        $('.Ev-shareTitleName a').remove();//将人名进行移除
                        g_sps(null,jumpUrl);
                    }else{
                        var scrJumpHtml = '<div class="act-scrJumpModal"><section class="al-scrJumpModal" id="" style="z-index: 10">'+
                            '<section class="al-msgDeleteContent">'+
                            '<article><span>即将前往评阅该作品，记得回来打分哟~</span></article>'+
                            '</section>'+
                            '<section class="noPromp"><article><i class="active"></i>不再提示</article></section>'+
                            '<section class="signUpPbtn">'+
                            '<button class="al-msgDeleteConfirm">取消</button>'+
                            '<button class="al-msgDeleteCancel">立即前往</button>'+
                            '</section>'+
                            '</section></div>';
                        $("body").append(scrJumpHtml);
                        $(".al-msgDeleteCancel").off("click").on("click", function () {//立即前往
                            if($(".noPromp").find("i").hasClass("active")){
                                var noPromp = $.toJSON({activetyId:$("#activityId").val()});
								TempCache.setItem("noPromp",noPromp);
                                $.cookie("newIsClose")
                            }
                            $(".act-scrJumpModal").remove();
                            $(".activityScoreCont").show();
                            g_sps.jump(null,jumpUrl,true);
                        });
                        $(".al-msgDeleteConfirm").off("click").on("click", function () {//取消
                            $(".act-scrJumpModal").remove();
                        });
                        $(".noPromp").find("i").off("click").on("click", function () {
                            if($(this).hasClass("active")){
                                $(this).removeClass("active");
                                if(TempCache.getItem("noPromp")&&$.parseJSON(TempCache.getItem("noPromp")).activetyId==$("#activityId").val()){
									TempCache.removeItem("noPromp");
                                }
                            }else{
                                $(this).addClass("active");
                                var noPromp = $.toJSON({activetyId:$("#activityId").val()});
								TempCache.setItem("noPromp",noPromp);
                            }
                        })
                    }
                }else{
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
                    $('.Ev-shareTitleName a').remove();//将人名进行移除
                }
            });
            $(".vScore").off('click').on("click", function () {//点击评分按钮
                $('#videoPlayer').css('visibility', 'hidden');
                if (!$('#vPK_prof_score').is(":visible")) {
                    if($('#videoPlayer').hasClass('ev_scoring')){//评分进行中。。。
                        $("#vPK_prof_score").show();
                    }else{
                        $('#videoMask,#vPK_prof_score,#videoTpk_btn').show();
                        t.scoreTem(t.config.dataForScore);
                    }
                    if($('#CKa1').length>0){CKobject.getObjectById('CKa1').videoPause();}
                }
            });
        },
        scoreTem:function(obj){//评分项
            var t=this;
            var callback= function (res) {
                if(res&&res.responseObject.treeMaps&&res.responseObject.treeMaps.length>0){
                    temData.activityId = res.responseObject.activityId;
                    temData.customerId = res.responseObject.customerId;
                    temData.refId = res.responseObject.refId;
                    temData.refCustomerId = res.responseObject.refCustomerId;
                    temData.refType = res.responseObject.refType;
                    temData.scoreType = res.responseObject.scoreType;
                    temData.updateFlag = 1;
                    var data = res.responseObject.treeMaps,
                        scoreValue = "",
                        html_sub="",		//内部评分项
                        html_Array="",		//评分大项（一、二、三）
                        comment="";			//评价
                    for(var i=0;i<data.length;i++){
                        html_sub="";
                        var	item = data[i];
                        $(".actPrompt span").text(data[0].scoreRemark);//温馨提示
                        if(res.responseObject.updateStatus==1&&item.customerScore!==""){//如果是初次评分updateStatus==0
                            scoreValue = item.customerScore;
                        }
                        if(item.chilidTreeMaps){
                            for(var j=0;j<item.chilidTreeMaps.length;j++){
                                html_sub += '<p class="pingfen_details">'+item.chilidTreeMaps[j].configName+'<span>'+(item.chilidTreeMaps[j].scoreTotal>0?'（'+item.chilidTreeMaps[j].scoreTotal+'分）':'')+'</span></p>'
                            }
                        }
                        if(item.scoreTermType===1){	//评价
                            comment='<li>'+
                                '<div class="pingfen_mian01 pingfen_mian02">'+
                                '<div class="pingfen_mian01_s">'+item.configName+' （不少于'+item.scoreTotal+'字）</div>'+
                                '<div class="pingfen_bottom">'+
                                '<textarea name="" id="ev_comment_content" placeholder="写下您的建议" scoreId='+item.scoreId+' minLen='+item.scoreTotal+'>'+(res.responseObject.updateStatus==1?item.customerRemark:"")+'</textarea>'+
                                '</div>'+
                                '</div>'+
                                '</li>';
                        }
                        if(item.scoreTermType===0){//评分
                            html_Array+='<li dataIndex="'+i+'">'+
                                '<div class="pingfen_mian01">'+
                                '<div class="pingfen_mian01_s"><h4>'+
                                item.configName +
                                (item.scoreTotal==0?"":"（共"+item.scoreTotal+"分）")+
                                '</h4>'+
                                '<div class="scoreBox"><span class="score_warn">0~'+item.scoreTotal+'</span><input data={"maxVal":'+item.scoreTotal+',"scoreId":'+item.scoreId+'} value="'+scoreValue+'" class="scoreNumber" type="text" placeholder="0~'+item.scoreTotal+'">分</div></div>'+
                                (html_sub!==""?('<div class="pingfen_listcon">'+html_sub+'</div>'):"")+
                                '</div>'+
                                '</li>';
                        }
                    }
                    html_wrap='<div class="pingfen_mian">'+
                        '<ul>'+
                        html_Array+comment+
                        '</ul>'+
                        '</div>'+
                        '<div class="pingfen_tijiao">'+
                        '<a href="javascript:;" id="score_submit" class="gray">提交评分</a>'+
                        '</div>';
                    $('.videoT_playBox_inn').html(html_wrap);
                    t.checkNumber();
                    t.scoreClose();
                    if(res.responseObject.updateStatus===1){//表示是修改打分
                        var valNumber="",dataConfig,dataObj_score={},dataObj_comment={};
                        $.each($('.scoreNumber'),function(i,el){//将打分项进行追加
                            valNumber = $(el).val();
                            dataConfig = $.secureEvalJSON($(el).attr('data'));  			//把data字符串解析成对象
                            var reg = /^\d*\.{0,1}\d{0,1}$/g;
                            if(valNumber<0||valNumber>dataConfig.maxVal||valNumber==''||reg.test(valNumber)==false||valNumber=='.'){
                                $(el).siblings(".score_warn").css("visibility","visible").end().removeClass("correct");
                            }else{
                                $(el).siblings(".score_warn").css("visibility","hidden").end().addClass("correct");
                                dataObj_score = {
                                    score:parseFloat(valNumber).toFixed(1),
                                    scoreTermType:0,
                                    scoreId:dataConfig.scoreId
                                }
                                temData.scoreMapList.push(dataObj_score);
                            }
                        });
                        if($('#ev_comment_content').length>0){//将评论进行追加
                            dataObj_comment={
                                score:0,
                                scoreTermType:1,
                                scoreId:$('#ev_comment_content').attr('scoreId'),
                                scoreRemark:$('#ev_comment_content').val()
                            }
                            temData.scoreMapList.push(dataObj_comment);
                        }
                    }
                    t.checkFinished();
                }
                if(res.responseObject.refType==1){//表示视频将左侧按钮内容更改
                    $(".vPlay").text("视频播放");
                }else if(res.responseObject.refType==7){//表示病例将左侧按钮内容更改
                    $(".vPlay").text("查看病例");
                }else{
                    $(".vPlay").text("查看作品");//表示其他资源将左侧按钮内容更改
                }
            };
            comm.ajax.async(t.config.maplist,{paramJson:$.toJSON(obj)},callback);
        },
        checkNumber:function(){
            var t=this,valNumber,dataConfig,dataObj_score={},dataObj_comment={},scoreId;
            if($('.scoreNumber').length>0){//如果有打分项
                $('.scoreNumber').on('load blur keyup',function(){
                    valNumber = $(this).val();
                    dataConfig = $.secureEvalJSON($(this).attr('data'));  			//把data字符串解析成对象
                    var reg = /^\d*\.{0,1}\d{0,1}$/g;
                    if(valNumber<0||valNumber>dataConfig.maxVal||valNumber==''||reg.test(valNumber)==false||valNumber=='.'){
                        $(this).siblings(".score_warn").css("visibility","visible").end().removeClass("correct");
                    }else{
                        $(this).siblings(".score_warn").css("visibility","hidden").end().addClass("correct");
                        dataConfig = $.secureEvalJSON($(this).attr('data'));  			//把data字符串解析成对象
                        scoreId= dataConfig.scoreId;
                        dataObj_score={
                            score:parseFloat(valNumber).toFixed(1),
                            scoreTermType:0,
                            scoreId:scoreId
                        };
                        var flag=true;
                        if(temData.scoreMapList.length>0){
                            for(var i=0,l=temData.scoreMapList.length;i<l;i++){
                                flag=true;
                                if(temData.scoreMapList[i].scoreId==scoreId){
                                    temData.scoreMapList[i].score = parseFloat(valNumber).toFixed(1);
                                    flag=true;
                                    break;
                                }else{
                                    flag=false;
                                }
                            }
                            if(flag==false){
                                temData.scoreMapList.push(dataObj_score);
                            }
                        }else{
                            temData.scoreMapList.push(dataObj_score);
                        }
                    }
                    t.checkFinished();
                })
            }
            if($('#ev_comment_content').length>0){//如果有意见项
                var scoreId_comment = $('#ev_comment_content').attr('scoreId'),
                    commentVal = $('#ev_comment_content').val();
                $('#ev_comment_content').on("propertychange input keyup paste",function(){
                    commentVal = $('#ev_comment_content').val();
                    if(commentVal.length>9999){
                        commentVal = commentVal.substring(0,9999);
                        $(this).val(commentVal);
                    }
                    dataObj_comment={
                        score:0,
                        scoreTermType:1,
                        scoreId:scoreId_comment,
                        scoreRemark:commentVal
                    };
                    var flag_c = true;
                    if(temData.scoreMapList.length>0){
                        for(var j=0,n=temData.scoreMapList.length;j<n;j++){
                            flag_c=true;
                            if(temData.scoreMapList[j].scoreId==scoreId_comment){
                                temData.scoreMapList[j].scoreRemark = commentVal;
                                flag_c=true;
                                break;
                            }else{
                                flag_c=false;
                            }
                        }
                        if(flag_c==false){
                            temData.scoreMapList.push(dataObj_comment);
                        }
                    }else{
                        temData.scoreMapList.push(dataObj_comment);
                    }
                    t.checkFinished();
                });
            }
        },
        checkFinished:function(){//检查是否可以提交
            var t=this;
            var done = true;
            var commVal=$('#ev_comment_content').length>0?$('#ev_comment_content').val():"";
            $.each($('.scoreNumber'),function(i,el){
                if(!$(el).hasClass('correct')){
                    done=false;
                }
            });
            if($('#ev_comment_content')&&$('#ev_comment_content').length>0){
                if(commVal.replace(/[ ]/g,"")==""||comm.getByteLen(commVal.replace(/[ ]/g,""))<(parseInt($('#ev_comment_content').attr('minLen'))*2)){	//评论字数限制100字，200字节
                    done=false;
                }
            }
            if(done){
                $('#score_submit').removeClass('gray').off('click').on('click',function(){
                    $('#videoMask').show();
                    t.submitPop();
                });
            }else{
                $('#score_submit').addClass('gray').off('click');
            }
        },
        getTotalScore:function(){
            var total=0;
            for(var i=0,l=temData.scoreMapList.length;i<l;i++){
                total+=parseFloat(temData.scoreMapList[i].score);
            }
            return total.toFixed(1);
        },
        submitPop:function(){		//提交弹层，显示总分
            var t=this,html="";
            html='<div class="act_score_sub_popp" id="score_sub_pop"><div class="videoT_Pop" >'+
                '<div class="videoT_Pop_title">'+
                '<div class="videoT_Popword">提示</div>'+
                '<div class="videoT_PcloseBtn">'+
                '<a href="javascript:;">'+
                '<img src="//img00.allinmd.cn/column/videoPK/pk_v3/videopk_Cbtn.png" alt=""></a>'+
                '</div>'+
                '<div class="clear"></div>'+
                '</div>'+
                '<div class="videoT_Pop_con">'+
                '<h4 class="videoTp">当前总分为<span>'+t.getTotalScore()+'</span>分</h4>'+
                '<div class="videoT_Pop_conRemark">90分以上为优秀，80分以上为良好，70分以上为中，60分以上为差，60分以下为不合格</div>'+
                '<div class="videoT_Pop_con_btns">'+
                '<div id="modify_score">取消</div>'+
                '<div class="videoT_PopSub" id="ev_videoT_PopSub">提交</div>'+
                '<div class="clear"></div>'+
                '</div>'+
                '</div></div>';
            $('body').append(html);
            t.scoreSubmitOrCancel();
        },
        scoreSubmitOrCancel:function(){						//提交按钮点击
            var t=this;
            $('#videoPlayer').css('visibility','hidden');
            $('#ev_videoT_PopSub').off("click").on("click", function () {//提交成功后，返回作品审核页，并刷新当前页
                $("#videoPlayer").hide();
                $("#videoTpk_btn").hide();
                $('#vPK_prof_score').hide();
                var newTemData = temData;
                newTemData.isNewSave = 1;
                newTemData.recordId = $("#activityId").attr("recordId");
                t.ajaxFn({
                    url:t.config.saveInter,
                    param:newTemData,
                    fn:function(){
                        location.reload();//刷新数据
                    },
                    err_fn:function(){
                        alert('上传数据出现错误，请稍后重新提交');
                        $('#vPK_prof_score').show();
                        $('#videoPlayer').css('visibility','hidden');
                        $('#score_sub_pop').remove();
                    }
                })
            });
            $('#modify_score,.videoT_PcloseBtn').click(function(){
                $('#score_sub_pop').remove();
                comm.creatEvent({triggerType:"全站功能按钮点击",keyword:"视频PK活动专家评分关闭",actionId:43});
            })
        },
        scoreClose:function(){//关闭评分弹层
            var t=this;
            var html='<div class="videoT_Pop" style="display: block;" id="close_conform">'+
                '<div class="videoT_Pop_title">'+
                '<div class="videoT_Popword">提示</div>'+
                '<div class="videoT_PcloseBtn" id="close_conform_clsBtn">'+
                '<a href="javascript:;"><img src="//img00.allinmd.cn/column/videoPK/pk_v3/videopk_Cbtn.png" alt=""></a>'+
                '</div>'+
                '<div class="clear"></div>'+
                '</div>'+
                '<div class="stopScoreBox">'+
                '<div class="stopScore">确定终止评分吗？</div>'+
                '<div class="stopOrNo">'+
                '<div class="stopYes" id="ev_stop_score">终止</div>'+
                '<div class="stopNo" id="ev_continue_score">继续评分</div>'+
                '<div class="clear"></div>'+
                '</div>'+
                '</div>'+
                '</div>';
            $('.videoT_playBox').children("img").off('click').on('click',function(){//点击关闭评分按钮
                var flag=false;
                $(".ev-detailReviewForm,#reviewArea,.ev-listMore").remove();
                if($('.scoreNumber').length>0){
                    for(var i=0;i<$('.scoreNumber').length;i++){
                        if($('.scoreNumber')[i].value!==""){
                            flag=true;
                            break;
                        }
                    }
                }
                if(flag){//如果评分里有数据则弹层提示，确定后清空cookie
                    if($('body').find('#close_conform').length>0){
                        return false;
                    }else{
                        $('body').append(html);
                        t.closeOrContinueScore();
                    }
                }else{
                    temData.scoreMapList = [];//将push进去的所有评分项进行清除，否则会影响后面算成绩
                    $('#videoPlayer').hide().removeClass('ev_scoring');
                    $('#videoMask,#videoTpk_btn').hide();
                    $('#score_sub_pop').remove();
                    $('.videoT_playBox_inn').empty();
                    $("body").css("overflow","auto");
                    $(".activityScoreCont").hide();
                    if($("#a1 div").length>0){//将视频进行关闭
                        comm.player2.player.pause();
                        comm.player2.player.dispose();
                    }
                }
            });
        },
        closeOrContinueScore:function(){				//关闭评分弹层 事件
            var t=this;
            $('#ev_continue_score,#close_conform_clsBtn').off('click').on('click',function(){//继续评分
                $('#close_conform').remove();
                //$("#videoPlayer .vPlay").removeClass('cur');//这个不知道什么意思，感觉没什么用，但是我不敢删
            });
            $('#ev_stop_score').off('click').on('click',function(){			//终止评分：清空确认层，提交层
                temData.scoreMapList = [];//将push进去的所有评分项进行清除，否则会影响后面算成绩
                comm.creatEvent({triggerType:"全站功能按钮点击",keyword:"视频PK活动专家评分关闭",actionId:43});
                $("#videoTpk_btn").show();
                $('#close_conform').remove();
                $('#score_sub_pop').remove();
                $('.videoT_playBox_inn').empty();
                $('#videoPlayer').css('visibility','visible').hide();
                $("#videoPlayer .vPlay").addClass('cur');
                $('#videoMask').hide();
                $("body").css("overflow","auto");
                $(".activityScoreCont").hide();
                if($("#a1 div").length>0){//将视频进行关闭
                    comm.player2.player.pause();
                    comm.player2.player.dispose();
                }
            });
        },
        checkIsOver: function () {
            $.ajax({//结果是否在公示中，上传是否截止
                type:'post',
                url:PC_CALL+'activity/event/isResultShowBegin/',
                data:{paramJson:$.toJSON({ activityId:$("#activityId").val()})},
                dataType:"json",
                async:false,
                success:function(res){
                    if(res&&res.responseObject.responseData&&(!$.isEmptyObject(res.responseObject.responseData))){
                        var isResultShowBegin=res.responseObject.responseData.expireStatus;
                        if(isResultShowBegin==1){//如果在公示中，默认上传截止
                            $('#activityId').attr('isResultShowBegin',isResultShowBegin);	//0:未知错误 1:结果公示中 -1:过期
                        }
                    }
                    if(!$('#activityId').attr('isResultShowBegin')){		//如果不是结果公示过程，则查看上传是否截止
                        $.ajax({//上传是否截止
                            type:'post',
                            url:PC_CALL+'activity/event/isSignUpOver/',
                            data:{paramJson:$.toJSON({ activityId:$("#activityId").val()})},
                            dataType:"json",
                            async:false,
                            success:function(rep){
                                if(rep&&rep.responseObject.responseData&&(!$.isEmptyObject(rep.responseObject.responseData))){
                                    var isSignState=rep.responseObject.responseData.expireStatus;
                                    $('#activityId').attr('isSignUpOver',isSignState);	//0:未知错误 1:未截止 -1:截止
                                }
                            }
                        });
                        $.ajax({//评分是否开始
                            type:'post',
                            url:PC_CALL+"activity/event/isReviewBegin/",
                            data:{paramJson:$.toJSON({ activityId:$("#activityId").val()})},
                            dataType:"json",
                            async:false,
                            success:function(data){
                                if (data && data.responseObject.responseData) {
                                    var isReviewBegin = data.responseObject.responseData.expireStatus;
                                    $('#activityId').attr('isReviewBegin',isReviewBegin);//1是已经开始了,-1没开始
                                }
                            }
                        })
                    }
                }
            })
        }
    };
    controller.init();
};
function reviewEvent(idParam){
    var refType=7;
    var first=true;
    //回复列表最新最旧事件绑定
    $(".ev-listSortOld").data("sortType",1).on('click', function(){ //最旧
        $('.ev-list').empty();
        module.reviewPage({sortType: 1,$context: $('.ev-list'),scene: 'terminal',refType: refType, refId: idParam});
        $(this).addClass("al-oldNews");
        $(".ev-listSortNew").removeClass("al-oldNews");
        //事件埋点
        if(!first){
            comm.creatEvent({
                triggerType:"评论",
                keyword:"评论区排序-最旧",
                actionId:74
            });
        }
        first=false;
    });

    $(".ev-listSortNew").data("sortType",3).on('click', function(){ //最新
        $('.ev-list').empty();
        module.reviewPage({sortType: 3,$context: $('.ev-list'),scene: 'terminal',refType: refType, refId: idParam});
        $(this).addClass("al-oldNews");
        $(".ev-listSortOld").removeClass("al-oldNews");
        //事件埋点
        if(!first) {
            comm.creatEvent({
                triggerType: "评论",
                keyword: "评论区排序-最新",
                actionId: 74
            });
        }
        first=false;
    });

    //默认为最旧
    $(".ev-listSortOld").click();

    //终端页评论区域个人中心跳转
    var href;
    $(".Ev-mesPersonalCenter").off("click").on("click",function(){
        href$(this).attr("data-perCenter");
        g_sps.jump(null,href,true);
    });
}