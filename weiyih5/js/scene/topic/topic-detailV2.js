function draw(obj){
	var $width = $(".picShowlist").width();
	var $height = $width * 4;     // 380 /   570
	DrawImageLarge(obj,$width,$height);
}


$(function () {
    var cId=TempCache.getItem("userId");// $("#authCustomerId").val();   TempCache.getItem("userId")
    var refType=$("#relationType").val();
    var refId=$("#resourceId").val();
    toggleToPC();
  var amChannel = comm.getpara()._amChannel;
	var callAppOptions = {
		ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=4&sourceId=" + refId+ "&tplPath=1"+(amChannel?"&_amChannel="+amChannel:''),
		android: "allin://com.allin.social:75235?data={scene:3,type:4,sourceId:"+refId +",tplPath:1"+(amChannel?",_amChannel:"+amChannel:'')+ "}",
		ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=4&sourceId=" +refId + "&tplPath=1"+(amChannel?"&_amChannel="+amChannel:''),
		runAtOnce: false
	};
	//comm.recognizeAppShareLink(callAppOptions);
    //if (comm.getparaNew() && comm.getparaNew().share && (comm.getparaNew().share.toLowerCase() == "app")){//app分享的链接

    //}else {
        user.privExecute({
            operateType: 'auth',   //'login','auth','conference'
            callback: function () {
                //if (!TempCache.getItem("detailNoNeedApp")) {
                    comm.appWakeUp("figure", callAppOptions);//唤醒app弹层
                if($(".Ev-fixedHeader").length>0){//有分享按鈕時
                    $(".al-appWakeUpFigure").css("margin-top","1.3rem")
                }
                //}
                //TempCache.removeItem("detailNoNeedApp");
            }
        });
    //}

    //window.onload = Log.createBrowse(9, "话题终端页面"); //	浏览日志


    //查看大图
    //var gallary = null;
    //if ($(".Ev-maxImg img").size() > 0) {
    //    $(".Ev-maxImg").each(function (index, obj) {
    //        //var $width = $(obj).width();
    //        //var $height = $width * 0.666;     // 371 /   580
    //        //DrawImageLarge($(obj).find("img:eq(0)").get(0), $width, $height);
    //        $(obj).on("click", function () {
    //            $("video").hide();
    //            $('.video-js').css('opacity',0);
    //            var openIndex=$(this).index();
    //            gallary = $(obj).picShow({open: openIndex,showVideo:function(){
    //                $("video").show();
    //                $('.pswp').remove();
    //                $('.video-js').css('opacity',1);
    //            }});
    //            Log.createBrowse(188,'点击大图');
    //            return false;
    //        });
    //        $(window).on("orientationchange", function () {
    //            if ($(".pswp").size() > 0) {
    //                gallary.updateSize();
    //            }
    //        });
    //    });
    //}
    bigPicShow.init({
        /**
         * 指定多个class|| ID
         * */
        domIdList:[".Ev-imgCtrl"],
        topSwiperOptions: {
            isInit:true,//是否需要初始化,
            onInit:function(){

            },
            zoom:true,
            preventClicks:false,//当swiper在触摸时阻止默认事件（preventDefault），用于防止触摸时触发链接跳转。
            pagination : '.swiper-pagination'//分页器
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
        closeCallBack:function(){
            $('html,body').css({height:'auto',overflow:'auto'});
            $(window).scrollTop($('html').attr('sT')||0);
            $('html').removeAttr('sT');
        },
        bottomSwiperOptions: {
            isInit:false,//是否需要初始化,
        },
        theme:'dark',
        topTitle:{
            isInit:true,
            title:""
        }

    });
    $(".al-terminalMoreImg").on("click",function(){
        $(this).siblings().eq(5).find('img').click();
    });

   //新增话题页视频开始
    var qiniuId = '';
    if ($('.Ev-videoCtrl').length>0) {
        qiniuId = $('.Ev-videoCtrl').attr('data-qiniuId');
        if (qiniuId != ''&&qiniuId!=undefined) {
            $.ajax({
                url: "/mcall/qiniu/storage/getMapVideoList/",
                type: "post",
                data: {paramJson: $.toJSON({refType: 4, refId: refId, attUseFlag: 13, qiniuId: qiniuId})},
                dataType: 'json',
                success: function (data) {
                    if (data && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.videoListMap.length) {
                        var item = data.responseObject.responseData.videoListMap[0];
                        if (item.qiniuStatus == 1||item.qiniuStatus == 0||item.qiniuStatus == 3) {//七牛视频处理状态0－未上传，1－上传成功，2－转码成功,3-转码中',
                            $('.Ev-videoBcImg').attr('src','//img50.allinmd.cn/case/videoFormating.jpg');
                            $('.Ev-videoTime,.al-terminalVideoBtn').html('').hide();
                        } else if (item.qiniuStatus == 2) {
                            var _n=$('.Ev-videoCtrl');
                            $('.Ev-videoTime').html(item.playTime);
                            $('.Ev-videoBcImg').attr('src',item.logoUrl);
                            var _w=_n.width();
                            var _h=_w*0.666;
                            /*
                             * 新版视频处理
                             * */
                            var videoItem = ' <video id="CKa1" class="video-js vjs-default-skin vjs-no-flex vjs-big-play-centered" >'+
                                '  <source src="'+item.attUrl+'">'+
                                '  </video>';
                            $('.Ev-videoCtrl').on('click', function () {
                                var _vh = $('.Ev-videoBcImg').height();
                                if ($(".Ev-videoPlay").find('video').length == 0) {
                                    $('.Ev-maxVideo').children().not(".Ev-videoPlay").hide();
                                    $(".Ev-videoPlay").show();
                                    $('.Ev-videoCtrl .Ev-videoPlay').html(videoItem);
                                    var player2 = new AllinmdPlayer('CKa1', {
                                        width: _w,
                                        height: _vh,
                                        poster: $('.Ev-videoBcImg').attr('src'),  //播放之前需要放置的海报图片
                                        //设置播放权限时间，使用时需保证allow值为true
                                        limitPlayTime: {
                                            allow: false,
                                            value: 180
                                        },//设置允许最大的快进时长，用于限制用户拖拽至不允许播放的时间点，使用时需保证allow值为true
                                        setMaxPlayTime: {
                                            allow: false,
                                            value: 0
                                        },
                                        isH5:true
                                    }, function () {
                                        var isIOS = comm.browser.versions.ios;
                                        var ua = navigator.userAgent.toLowerCase();
                                        var isAndroidChrome = /chrome\/[\d|.]+ mobile safari\/[\d|.]+$/g.test(ua);  //android手机chrome浏览器
                                        if(isIOS||isAndroidChrome){  //ios放出全屏（版本10以下playsinline无效，暂无解决方法）
                                            $('.vjs-fullscreen-control').show().css('marginRight','0.5rem');
                                            $('.allinmd-time-elements').css('float','left');
                                        }
                                    });
                                    comm.players.push(player2);
                                    player2.player.play();
                                    player2.player.on('play',function(){
                                        $.each(comm.players,function(ix,plea){
                                            if(player2.player != plea.player){
                                                plea.player.pause();
                                            }
                                        });
                                    });
                                }
                            });
                        }else if(item.qiniuStatus==4){//转码失败
                            $('.Ev-videoBcImg').attr('src','//img50.allinmd.cn/case/videoFailing.png');
                            $('.Ev-videoTime,.al-terminalVideoBtn').html('').hide();
                        }
                    }else if(data.responseObject.responseStatus==false){
                        $('.Ev-videoCtrl').remove();
                    }
                }
            })
        }
    }
    //新增话题页视频结束

    var topic = {
        default: {
            qzone_m: "http://qzs.qzone.qq.com/open/connect/widget/mobile/qzshare/feedback.html?",
            sina_m: "http://v.t.sina.com.cn/share/share.php?&appkey=&"
        },
        init: function () {
            var t=this;
          var a=$(".al-terminalHeader a").eq(0).attr("href");
          if(a&&a.lastIndexOf("/pages/")>-1){
            a = a.replace("pages","dist").replace("others_contribution","others_index");
            $(".al-terminalHeader a").attr("href",a);
          }
          $.each($(".al-terminalTags"),function(i,em){
            if($(em).attr("href").lastIndexOf("pages")>-1){
              var tag = $(em).attr("href").replace("pages","dist");
              $(em).attr("href",tag);
            }
          })
            $('.al-terminalContentTags').hide();
            t.param = comm.getparaNew();
            t.updateViewdNum();//增加浏览数
            t.shareDomRender();
            t.discFunc();//讨论处@的人的跳转
            t.contentFun();//页面中的浏览，关注数，话题的关注状态
            t.oldNewFunc();//评论区最新最旧按钮切换
            t.scrollFunc();//评论最新最旧的滚动&&固定
            t.shareFunc();//页面上的分享功能
            t.draftRemind();//草稿提示
            t.backBtnClick();//返回按钮
            t.authorNeat();
            t.getColumnInfo();//栏目相关推荐10.12
            t.bindOrientationChangeEvent(); //处理视频转屏时大小问题
            t.eventTrack();
            t.getTabList();//获取标签
        },
        shareDomRender:function(){
            var t=this;
            t.isWeixin = function () { //是否微信浏览器
                var nav = navigator.userAgent;
                if (/MicroMessenger/.test(nav)) {
                    return true;
                } else {
                    return false;
                }
            };
            if(t.isWeixin()){
                $('.al-terminalShareItem').wrapAll('<div class="al-terminalShareItemWrap">');
                $('.al-terminalShareItem[ref=qzone]').hide();
                wxDom = '<section class="al-terminalShareItem Ev-shareBtn" ref="wx">'+
                    '<figure class="al-bottomShareImg">'+
                    '<img src="/images/img50/pages/index/wechat.png" _mce_src="/images/img50/pages/index/wechat.png" alt=""></figure>'+
                    '<figcaption>微信</figcaption>'+
                    '</section>'+
                    '<section class="al-terminalShareItem Ev-shareBtn" ref="wx">'+
                    '<figure class="al-bottomShareImg">'+
                    '<img src="/images/img50/pages/index/friendship.png" _mce_src="/images/img50/pages/index/friendship.png" alt=""></figure>'+
                    '<figcaption>朋友圈</figcaption>'+
                    '</section>';
                $('.al-terminalShareItem[ref=trend]').after(wxDom);
            }

        },
        //标签埋点
        eventTrack:function(){
            $('.al-terminalTags').click(function(){
                comm.creatEvent({
                    triggerType:'标签',
                    trigger_name:"标签",
                    keyword:$(this).text(),
                    refId:$(this).attr('href').split('tId=')[1],
                    actionId:79,
                    async:false
                });
            });
        },
        bindOrientationChangeEvent: function () {
            var t = this;
            $(window).on('orientationchange', function (event) {
                $('.CKa1-dimensions').css({
                    width:$('.al-terminalImgBox').width(),
                    //height:$('.al-terminalImgBox').width()*0.56
                })
            });
            $(window).on('resize', function (event) {
                $('.CKa1-dimensions').css({
                    width:$('.al-terminalImgBox').eq(0).outerWidth(),
                    height:$('.al-terminalImgBox').eq(0).outerWidth()*0.56
                })
            });
        },
        //强迫症对齐专用(al-terminalAuthorMsg 作者信息无职称时候对齐)
        authorNeat:function(){
            if(!$.trim($(".al-terminalAuthorMsg p>span").eq(0).text())){
                $(".al-terminalAuthorMsg p>span").eq(0).remove();
            }
        },
        getColumnInfo:function(){
            var t = this;
            var callback = function (data) {
                if(comm.hasResponseData(data)){
                    var item = data.responseObject.responseData.data_list;
                    if(item.length){
                        t.cloumnStatus(item[0]);
                    }
                }
            };
            comm.ajax.async('/mcall/special/getResourceSpecial/', {
                paramJson: $.toJSON({
                    resourceId:refId,
                    resourceType:refType
                })
            }, callback);
        },
        //所属栏目
        cloumnStatus: function (data) {
            if (data.specialId && data.specialTitle) {
                $(".ev-column").show();
                //$(".joinBoneClass").show();
                //$(".columnName").html('《'+comm.getStrByteLen(data.specialTitle, 10)+'》');
                //comm.creatEvent({
                //    triggerType: '功能按钮',
                //    trigger_name: "所属栏目",
                //    keyword: data.specialTitle,
                //    push_message_id:data.specialId,
                //    actionId: 11042,
                //    async: false
                //});
                $(".ev-column a").attr('href', '/dist/discover/discover_columnDetail.html?columnId=' + parseInt(data.specialId)).text('《'+comm.getStrByteLen(data.specialTitle, 28)+'》');
            }

        },
        //返回按钮
        backBtnClick:function(){
            var t=this;
            $(".Ev-backBtn").on("click", function() {
                if (TempCache.getItem("prevTopicHref")||t.param.prev) {
                    g_sps.jump(null,TempCache.getItem("prevTopicHref")||t.param.prev);
                    TempCache.removeItem("prevTopicHref");
                } else if (document.referrer.lastIndexOf("/passport/") > -1 || document.referrer.indexOf("seminar") > -1 || !document.referrer) {
                  g_sps.jump(null,"/");
                } else {
                    history.back();
                }
                return false;
            })
        },
        //评论区最新最旧按钮切换
        oldNewFunc:function(){
            $(".al-terminalSortChangeItem").on("click", function() {
                $(this).addClass('active').siblings().removeClass('active');
                comm.creatEvent({
                    triggerType:'评论区排序',
                    trigger_name:"评论区排序",
                    keyword:$(this).text(),
                    actionId:74
                });
            });
        },
        //页面上的分享功能
        shareFunc: function () {
            var t=this;
            var paramLog = {};
            paramLog.shareSence = shareSenceConst.topic_detail;
            var param = {};
            param.resourceType = refType;
            param.sessionCustomerId = cId||'';
            param.sceneType = 6;
            param.topicId = refId;
            param.useFlag = 12;
            param.visitSiteId = 2;
            param.logoUseFlag = 3;
            param.attUseFlag = 10;
            var params={paramJson: $.toJSON(param)};
            var callback=function(rep){
                if (rep && rep.responseObject && !$.isEmptyObject(rep.responseObject.responseData) && rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list[0]) {
                    var items = rep.responseObject.responseData.data_list[0];
                    var sinaTitle, qqTitle, qZoneTitle, qqSummary, qZoneSummary, picUrl, shareTitle, shareDesc,wechatTitle,wechatSummary,timelineTitle,timelineSummary;
                    picUrl = items.share_comm.shareImageUrl;
                    shareTitle = items.share_comm.shareTitle != "" ? items.share_comm.shareTitle : document.title;
                    paramLog.picUrl = picUrl;
                    paramLog.shareTitle = shareTitle;
                    $.each(items.share_channel, function (i, el) {
                        if (el.shareChannel == 'Sina') {//新浪
                            sinaTitle = el.shareTitle;
                            shareDesc = el.shareDesc;
                            paramLog.sinaTitle = sinaTitle;
                            paramLog.sinaDesc = shareDesc;
                        } else if (el.shareChannel == "QZone") {//QQ空间
                            qZoneTitle = el.shareTitle;
                            qZoneSummary = el.shareDesc;
                            paramLog.qZoneTitle = qZoneTitle;
                            paramLog.qZoneSummary = qZoneSummary;
                        }else if (el.shareChannel == "WechatFriend") {//微信好友
                            wechatTitle = el.shareTitle;
                            wechatSummary = el.shareDesc;
                            paramLog.wechatTitle = wechatTitle;
                            paramLog.weiXinDesc = wechatSummary;
                        }else if (el.shareChannel == "WechatTimeline") {//微信朋友圈
                            timelineTitle = el.shareTitle;
                            timelineSummary = el.shareDesc;
                            paramLog.timelineTitle = timelineTitle;
                            paramLog.timelineSummary = timelineSummary;
                        }
                    });
                    t.shareFuncClick(paramLog);
                }
            };
            comm.ajax.async("/mcall/comm/data/share/getMapList3/",params,callback);
        },
        //分享点击操作
        shareFuncClick:function(paramLog){
            var t=this;
            //页面固定的分享
            $(".Ev-shareBtn").off("click").on("click",function(){
                comm.creatEvent({
                    triggerType:'分享',
                    keyword:"分享",
                    actionId:40,
                    locationId:2
                });
                var shareToName = $(this).attr('ref');
                if (shareToName == "wx") {
                    var shareHtml = '<div class="dk-result-pointer-bg"></div><div class="dk-result-pointer" ></div>';
                    $("body").append(shareHtml);
                    $("body").bind('touchmove', function(e) {
                        e.preventDefault();
                    });
                    $(".dk-result-pointer,.dk-result-pointer-bg").on("click", function() {
                        $(".dk-result-pointer").remove();
                        $(".dk-result-pointer-bg").remove();
                        $('body').unbind('touchmove');
                        return false;
                    });
                }else if (shareToName == "trend") {
                    comm.loading.show();
                    $.ajax({
                        type: "post",
                        url: "/mcall/customer/reprint/create/",
                        data: {paramJson: $.toJSON({
                            "reprintType":refType,
                            "customerId": cId,//当前人ID
                            "refId":refId,//资源id
                            "visitSiteId": "2"//1PC 2 h5
                        })},
                        dataType: "json",
                        success: function(rep) {
                            comm.loading.hide();
                            $('.al-bottomSharePart').removeClass('on');
                            $("body").css("overflow", "visible");
                            if (rep && rep.responseObject.responseStatus) {
                                popup("分享到唯医朋友圈成功！");
                            } else {
                                popup("分享到唯医朋友圈失败！");
                            }
                            $('body').unbind('touchmove');
                        },
                        error: function() {
                            comm.loading.hide();
                            popup("分享到唯医朋友圈失败！");
                            $('body').unbind('touchmove');
                        }
                    });
                } else {
                    var newHref = t.default[shareToName + '_m'];
                    var picture = '&pics=http:',
                        shareTitleFixed,shareChannel;
                    if (shareToName == 'sina') {
                        picture = "&pic=http:";
                        shareTitleFixed = paramLog.sinaDesc != '' ?  paramLog.sinaDesc: document.title;
                        shareChannel=3;
                    } else if (shareToName == 'qzone') {
                        shareTitleFixed =  paramLog.qZoneTitle != '' ?  paramLog.qZoneTitle: document.title;
                        shareChannel=1;
                    }
                    if (paramLog.picUrl.search(':') >= 0) {
                        paramLog.picUrl = paramLog.picUrl.split(':')[1];
                    }
                    comm.shareLog({
                        shareType: refType,
                        resourceId:refId ,
                        resourceType: refType,
                        refId: refId,
                        isValid: 1,
                        shareSence:10,
                        shareChannel:shareChannel,
                        shareContent:paramLog.shareTitle,
                        refCustomerId:cId
                    });
                    window.open(newHref + 'url=' + encodeURIComponent(window.location.href) + '&title=' + encodeURIComponent(shareTitleFixed) +
                        picture + encodeURIComponent( paramLog.picUrl) + '&summary=' + encodeURIComponent(comm.getStrLen(paramLog.qZoneSummary,50)) +
                        (shareToName == 'sina' ? '&desc=' + encodeURIComponent(paramLog.sinaDesc) : ""), '_blank');
                }
                $('body').unbind('touchmove');
                return false;
            });

            shareAll({
                title:paramLog.shareTitle,
                url:window.location.href,//不传默认取当前地址
                pic:paramLog.picUrl,//分享图片
                trendUrl:"/mcall/customer/reprint/create/",//分享动态的请求连接  //不需要动态分享就不传
                noPJ:0,//0：分享动态给后台的参数需要转为paramJson ,1:不需要
                data:{//分享动态传给后台的参数
                    "reprintType":refType,
                    "customerId": cId,//当前人ID
                    "refId":refId,//资源id
                    "visitSiteId": "2"//1PC 2 h5
                },
                callback:function(){},//分享动态后成功后的回调函数
                wxTitle: paramLog.wechatTitle,//微信分享标题
                wxDesc:  paramLog.weiXinDesc,//微信分享描述
                timeLineTitle: paramLog.timelineTitle,
                sinaTitle: paramLog.sinaDesc,//新浪title
                desc: paramLog.sinaDesc,//新浪的描述
                qzoneTitle: paramLog.qZoneTitle,//qq空间title
                summary:  paramLog.qZoneSummary ,//qq空间的描述
                qShareLog:function(x){
                    comm.shareLog({
                        shareType: refType,
                        resourceId:refId ,
                        resourceType: refType,
                        refId: refId,
                        isValid: 1,
                        shareSence:10,
                        shareChannel:x=='sina'?3:1,
                        shareContent: x=='sina'?(paramLog.sinaDesc?paramLog.sinaDesc:document.title):(paramLog.qZoneTitle?paramLog.qZoneTitle:document.title),
                        refCustomerId:cId
                    });
                },  //分享新浪，空间成功与否都执行
                fnMessageSuc:function(){//分享好友成功回调
                    comm.shareLog({
                        shareType: refType,
                        resourceId:refId ,
                        resourceType: refType,
                        refId: refId,
                        isValid: 1,
                        shareSence:10,
                        shareChannel:4,
                        shareContent:paramLog.shareTitle,
                        refCustomerId:cId
                    });
                },
                fnTimelineSuc:function(){//分享朋友圈成功回调
                    comm.shareLog({
                        shareType: refType,
                        resourceId:refId ,
                        resourceType: refType,
                        refId: refId,
                        isValid: 1,
                        shareSence:10,
                        shareChannel:5,
                        shareContent:paramLog.shareTitle,
                        refCustomerId:cId
                    });
                }
            },false,$('.Ev-topShareBtn'));
        },
        //讨论处@的人的跳转
        discFunc:function(){
            $('.Ev-disPerCenter a').on("click",function(){
                var href = parseInt($(this).attr('href'));
                if(/^\d+$/.test(href)){//href只是数字
                    g_sps.jump(null,'/dist/personal/others_index.html?cid='+href);
                    return false;
                }
            });
        },
        //页面中的浏览，关注数，话题的关注状态
        contentFun:function(){
            var t=this;
            var result = CommService.getResponseData("/mcall/cms/topic/base/info/", {
                sessionCustomerId:cId,
                useFlag:12,
                visitSiteId:2,
                logoUseFlag:3,
                topicId:refId,
                attUseFlag:10
            });
            if(!$.isEmptyObject(result)) {
                var data = result.data_list[0];//关注
                var info = data.cms_topic;//收藏，点赞，评论，关注，浏览数
                var auth = data.cms_topic_customer;//话题的作者
                //话题关注 回复数
                if (info.reviewNum && info.reviewNum > 0) {
                    $(".Ev-navReviewNum").text(info.reviewNum);//评论区导航评论数字
                    if (parseInt(info.reviewNum) > 999) {
                        $(".Ev-reviewNum span").show().text("999+");//评论数
                    } else {
                        $(".Ev-reviewNum span").show().text(info.reviewNum);//评论数
                    }
                } else {
                    $(".Ev-navReviewNum").text(0);//评论区导航评论数字
                    $(".Ev-reviewNum span").show().text("评论");
                }

                if (info.browseNum && info.browseNum > 0) {
                    if (parseInt(info.browseNum) > 9999) {
                        $(".Ev-browseNum").text(info.browseNum.toW());//浏览数
                    } else {
                        $(".Ev-browseNum").text(info.browseNum);//浏览数
                    }
                } else {
                    $(".Ev-browseNum").text(0);//浏览数
                }

                if (info.followFansNum && info.followFansNum > 0) {
                    $(".Ev-followNum").text(info.followFansNum);//关注数
                } else {
                    $(".Ev-followNum").text(0);//关注数
                }

                if (info.preferUpNum && info.preferUpNum > 0) {
                    if (parseInt(info.preferUpNum) > 999) {
                        $(".Ev-praiseNum span").show().text("999+");//点赞数
                    } else {
                        $(".Ev-praiseNum span").show().text(info.preferUpNum);//点赞数
                    }
                } else {
                    $(".Ev-praiseNum span").show().text("点赞");//点赞数
                }

                if (info.collectionNum && info.collectionNum > 0) {
                    if (parseInt(info.collectionNum) > 999) {
                        $(".Ev-collectNum span").show().text("999+");//收藏数
                    } else {
                        $(".Ev-collectNum span").show().text(info.collectionNum);//收藏数
                    }
                } else {
                    $(".Ev-collectNum span").show().text("收藏");//收藏数
                }


                //话题关注状态开始
                if (auth.customerId == cId) {
                    $(".Ev-FollowBtn,.Ev-alFollowBtn").hide();
                } else {
                    if (parseInt(data.followRelationship) === 0) {
                        $(".Ev-FollowBtn").css("display", "inline-block");
                        $(".Ev-alFollowBtn").hide();
                    } else {
                        $(".Ev-alFollowBtn").css("display", "inline-block");
                        $(".Ev-FollowBtn").hide();
                    }
                }

                //话题的点赞状态和收藏状态
                if (parseInt(data.preferRelationship) > 0) {//点赞
                    $(".Ev-praiseNum").addClass("on");
                    if($(".Ev-praiseNum span").text()=="点赞"||$(".Ev-praiseNum span").text()==0){
						$(".Ev-praiseNum span").text(1);
                    }
                } else {
                    $(".Ev-praiseNum").removeClass("on");
                }
                if (parseInt(data.collectionRelationship) > 0) {//收藏
                    $(".Ev-collectNum").addClass("on");
					if($(".Ev-collectNum span").text()=="收藏"||$(".Ev-collectNum span").text()==0){
						$(".Ev-collectNum span").text(1);
					}
                } else {
                    $(".Ev-collectNum").removeClass("on");
                }
                t.followClickFunc();//关注按钮的点击事件
                t.praColDisFunc(auth.customerId);//点赞收藏评论操作
                t.activityStatus(data);
            }else{
                $(".Ev-navReviewNum").text(0);
            }
        },
        //关注按钮的点击事件
        followClickFunc:function(){
            var params = {};
            params.paramJson = $.toJSON({refId: refId, followType: refType,refName:$(".Ev-caseTitle h2").text(),customerId:cId});//refId  被关注者ID
            $(".Ev-FollowBtn").off("click").on("click",function(){//关注，点击进行关注
              user.privExecute({
                operateType: 'auth',   //'login','auth','conference'
                callback: function () {
                  comm.creatEvent({
                    triggerType:'关注',
                    pushMessageId:$('#resourceId').val(),
                    actionId:5
                  });
                  var _n=parseInt($(".Ev-followNum").text());
                  $.ajax({
                    type: "POST",
                    url: "/mcall/customer/follow/resource/create/",
                    data:params,
                    dataType: "json",
                    success: function (rep) {
                      if(rep&&rep.responseObject&&rep.responseObject.responseStatus){
                        $(".Ev-alFollowBtn").css("display","inline-block");
                        $(".Ev-FollowBtn").hide();
                        $(".Ev-followNum").text(_n+1);
                      }
                    },
                    error: function () {
                    }
                  });
                }
              });

            });
            $(".ev-sureBtn").off("click").on("click",function(){//确认取消
                var _n=parseInt($(".Ev-followNum").text());
                $.ajax({
                    type: "POST",
                    url: "/mcall/customer/follow/resource/delete/",
                    data:params,
                    dataType: "json",
                    success: function (rep) {
                        if(rep&&rep.responseObject&&rep.responseObject.responseStatus){
                            $(".Ev-FollowBtn").css("display","inline-block");
                            $(".Ev-alFollowBtn").hide();
                            $(".Ev-cancelFollow").removeClass('on');
                            if(_n&&_n!=0){
                                if(_n-1>0){
                                    $(".Ev-followNum").text(_n-1);
                                }else{
                                    $(".Ev-followNum").text(0);
                                }
                            }else{
                                $(".Ev-followNum").text(0);
                            }
                        }
                    },
                    error: function () {}
                });
            });
            $(".Ev-alFollowBtn").off("click").on("click",function(){//已关注，点击取消关注
                $(".Ev-cancelFollow").addClass('on');
            });
            $(".ev-cancelBtn").off("click").on("click",function(){
                $(".Ev-cancelFollow").removeClass('on');
            });
        },
        //点赞收藏评论操作
        praColDisFunc:function(val){
            var t=this;
            $(".Ev-discussBtn").off("click").on("click",function(){//加入讨论操作
                var authorName =$('.Ev-authorName').text().replace(/[\n|\s]/g, "");
              user.privExecute({
                operateType: 'auth',   //'login','auth','conference'
                callback: function () {
                  comm.creatEvent({
                    triggerType:'加入讨论',
                    keyword:$('#resourceId').val(),
                    actionId:72
                  });
                  if(TempCache.getItem('customerRole')==2||TempCache.getItem('customerRole')==3||TempCache.getItem('customerRole')==4){
                    popup('该用户没有操作权限');
                  }else {
                    g_sps.jump(null,"/pages/common/comment.html?resourceId=" + refId + "&username=" + authorName + "&type=" + refType + "&parentId=0&refCustomerId=" + val);
                  }
                }
              });

            });
            $(".Ev-reviewNum").off("click").on("click",function(){//评论数点击操作
                var _top=$(".Ev-discussArea").offset().top;
                $(window).scrollTop(_top);
                return false;
            });
            var rep;
			var praising =false,collecting = false;
            $(".Ev-praiseNum").off("click").on("click",function(){//点赞数点击操作
				if(praising){
					return false;
				}
                var kv=$(".Ev-praiseNum span").text();
                var preferUpNum=$(".Ev-praiseNum span").text()!="点赞"?parseInt($(".Ev-praiseNum span").text()):"点赞";
                var params={};
                params.customerId=cId;
                params.refId=refId;
                params.usefulType=refType;
                params.upDownType=1;
                praising = true;
              user.privExecute({
                operateType: 'auth',   //'login','auth','conference'
                callback: function () {
                  if($(".Ev-praiseNum").hasClass("on")){//取消点赞
                    rep=  CommService.execute("/mcall/customer/prefer/delete/", params);
                    praising = false;
                    if(rep.responseStatus&&rep.responseStatus==true){
                      $(".Ev-praiseNum").removeClass("on");
                      if(kv.indexOf("+")==-1){
                        if(preferUpNum&&preferUpNum>0){  //点赞数
                          if(preferUpNum-1>0){
                            $(".Ev-praiseNum span").text(preferUpNum-1);
                          }else{
                            $(".Ev-praiseNum span").text("点赞");
                          }

                        }else{
                          $(".Ev-praiseNum span").text("点赞");
                        }
                      }
                    }
                  }else{//点赞
                    rep=  CommService.execute("/mcall/customer/prefer/create/", params);
                    praising = false;
                    if(rep.responseStatus&&rep.responseStatus==true){
                      $(".Ev-praiseNum").addClass("on");
                      if(kv.indexOf("+")==-1) {
                        if($(".Ev-praiseNum span").text() === '点赞'){
                          $(".Ev-praiseNum span").text(1);
                        }else{
                          $(".Ev-praiseNum span").text(preferUpNum + 1).show();//点赞数
                        }
                      }
                    }
                  }
                }
              });

            });
            $(".Ev-collectNum").off("click").on("click",function(){//收藏数点击操作
				if(collecting){return false;}
                var kVal=$(".Ev-collectNum span").text();
                var collectionNum=$(".Ev-collectNum span").text()!="收藏"?parseInt($(".Ev-collectNum span").text()):"收藏";
                var param={};
                param.customerId=cId;
                param.refId=refId;
                param.collectionType=refType;
				collecting= true;
              user.privExecute({
                operateType: 'auth',   //'login','auth','conference'
                callback: function () {
                  if($(".Ev-collectNum").hasClass("on")){//取消收藏
                    rep=  CommService.execute("/mcall/customer/collection/delete/", param);
                    collecting= false;
                    if(rep.responseStatus&&rep.responseStatus==true){
                      $(".Ev-collectNum").removeClass("on");
                      if(kVal.indexOf("+")==-1){
                        if(collectionNum&&collectionNum>0){
                          if(collectionNum-1>0){
                            $(".Ev-collectNum span").text(collectionNum-1);
                          }else{
                            $(".Ev-collectNum span").text("收藏");
                          }
                        }else{
                          $(".Ev-collectNum span").text("收藏");
                        }
                      }
                    }
                  }else{//收藏
                    rep=  CommService.execute("/mcall/customer/collection/create/",param);
                    collecting= false;
                    if(rep.responseStatus&&rep.responseStatus==true){
                      $(".Ev-collectNum").addClass("on");
                      if(kVal.indexOf("+")==-1) {
                        if($(".Ev-collectNum span").text() === '收藏'){
                          $(".Ev-collectNum span").text(1)
                        }else{
                          $(".Ev-collectNum span").text(collectionNum + 1).show();//收藏数
                        }
                      }
                    }
                  }
                }
              });

            });
        },
        //顶部滚动和评论区导航滚动
        scrollFunc:function(){
            var windowTop = 0;//初始可视区域距离页面顶端的距离
            $(window).bind("scroll", function() {
                var _top=$(".Ev-discussArea").offset().top;
                var scrolls = $(this).scrollTop();//获取当前可视区域距离页面顶端的距离
                if (scrolls >= _top) {//评论区顶部最新最旧
                    var top = 0;
                    if($('.Ev-fixedHeader').length>0){
                        top=$('.Ev-fixedHeader').outerHeight()
                    }
                    $(".Ev-discussArea h2").css({
                        "position": "fixed",
                        "top": top,
                        "left": 0,
                        "right": 0,
                        "background": "#fff",
                        "z-index": 4
                    });
                } else {
                    $(".Ev-discussArea h2").css({
                        position: "static"
                    });
                }
                    if (scrolls >= windowTop) {//向下滑动
                        if (scrolls != 0) {
                            windowTop = scrolls;
                        }
                        // $('.al-terminalFooter').hide();
                    }else {//上滑
                        windowTop = scrolls;
                        // $('.al-terminalFooter').show();
                    }
            });
        },
        //所属活动
        activityStatus:function(data){
            var t=this;
            var act=data.activity;
            if(act.activityId!=0||act.activityId!=""){
                $(".Ev-activity").show().find("span").text(act.type==1?"活动：":"专题：");
                $(".Ev-actName").text("《"+comm.getStrByteLen(act.activityName,28)+"》").attr("href",act.activityUrl);
            }
        },

        //更新浏览数
        updateViewdNum:function(){
            commdata.asyncExecute("updateTopicNum", {
                "propertyKey": "browseNum",
                "type": "plus",
                "topicId": $("#resourceId").val()
            });
        },
        //草稿提示
        draftRemind:function(){
            comm.draftRemind({
                url:"/mcall/customer/draft/reviewOperate/",
                data:{refId:refId,reviewType:4,operateType:1},//reviewType 4:话题 7:病例;
                type:2, //1:频道页 2:详情页
                resourceId:refId,
                resourceType:4,//resourceType 1-视频，2-文库，4-话题 ,7-病例
                data2:{refId:refId,reviewType:4,operateType:2}//operateType 1:说明执行的是判断是否加载提示操作 2:关闭提示
            });
        },
        //获取标签列表
        getTabList: function () {
            //(1-视频,2-文库,4-话题,7-病例)
            var params = {};
            params.paramJson = $.toJSON({resourceId: refId, resourceType: 2,isValid: 1});
            $.ajax({
                type: "POST",
                url: "/mcall/customer/follow/resource/create/",
                data:params,
                dataType: "json",
                success: function (rep) {
                    if(rep&&rep.responseData&&rep.responseData.dataList){
                        var _rep = rep.responseData.dataList;
                        var TagHtml = '';
                        for(var i = 0;i<_rep.length;i++){
                            TagHtml += '<a href="//m.allinmd.cn/dist/discover/discover_tagSubject.html?tId='+_rep[i].propertyId+'" class="al-terminalTags">'+_rep[i].propertyName+'</a>'
                        }
                        $('.al-terminalContentTags').html('<h3>标签</h3>'+TagHtml);
                        $('.al-terminalContentTags').show();
                    }
                },
            });
        }
    };
    topic.init();
});





