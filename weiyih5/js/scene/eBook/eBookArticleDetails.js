$(function () {
    var cId = TempCache.getItem("userId");// $("#authCustomerId").val();   TempCache.getItem("userId")
    var refType = $("#relationType").val();
    var refId = $("#resourceId").val();
    toggleToPC();
    var amChannel = comm.getpara()._amChannel;
    var callAppOptions = {
        ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=2&sourceId=" + refId + "&tplPath=287" + (amChannel?"&_amChannel="+amChannel:''),
        android: "allin://com.allin.social:75235?data={scene:3,type:2,sourceId:" + refId + ",tplPath:287" + (amChannel?",_amChannel:"+amChannel:'')+ "}",
        ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=2&sourceId=" + refId + "&tplPath=287" + (amChannel?"&_amChannel="+amChannel:''),
        runAtOnce: false
    };
    //comm.recognizeAppShareLink(callAppOptions);
    //if (comm.getparaNew() && comm.getparaNew().share && (comm.getparaNew().share.toLowerCase() == "app")) {//app分享的链接

    //} else {
        user.privExecute({
            operateType: 'auth',   //'login','auth','conference'
            callback: function () {
                //if (!TempCache.getItem("detailNoNeedApp")) {
                    comm.appWakeUp("figure", callAppOptions);//唤醒app弹层
                    $(".al-appWakeUpFigure").css("margin-top","1.3rem");
                //}
                //TempCache.removeItem("detailNoNeedApp");
            }
        });
    //}

    var article = {
        default: {
            qzone_m: "http://qzs.qzone.qq.com/open/connect/widget/mobile/qzshare/feedback.html?",
            sina_m: "http://v.t.sina.com.cn/share/share.php?&appkey=&",
            scrollTop:0
        },
        init: function () {
            var t = this;
            //TODO vue重构后页面链接修改
            var a=$(".Ev-authorName").eq(0).find("a").attr("href");
            if(a&&a.lastIndexOf("/pages/")>-1){
              a = a.replace("pages","dist");
              $(".Ev-authorName").eq(0).find("a").attr("href",a);
              $(".Ev-articleName").attr("href",a);
              $(".al-terminalEbookImg").attr("href",a);
            }
            var b=$(".al-terminalAuthorImg a").eq(0).attr("href");
            if(b&&b.lastIndexOf("/pages/")>-1){
              b = b.replace("pages","dist").replace("others_contribution","others_index");
              $(".al-terminalAuthorImg a").attr("href",b);
              $(".Ev-authorName").eq(1).attr("href",b)
            }
            $.each($(".al-terminalTags"),function(i,em){
              if($(em).attr("href").lastIndexOf("pages")>-1){
                var tag = $(em).attr("href").replace("pages","dist");
                $(em).attr("href",tag);
              }
            })
            t.updateViewdNum();//增加浏览数
            t.shareDomRender();
            t.contentFun();//页面中的浏览，关注数，话题的关注状态
            t.oldNewFunc();//评论区最新最旧按钮切换
            t.scrollFunc();//评论最新最旧的滚动&&固定
            t.shareFunc();//页面上的分享功能
            t.backBtnClick();//返回按钮
            t.draftRemind();//草稿提示
            t.backBtnClick();//返回按钮
            t.getColumnInfo();//栏目相关推荐10.12
            t.videoClose();//视频关闭
            t.qiniuEdit();//七牛视频处理
            t.prevNextArticle();//上一篇和下一篇文章点击
            t.series();
            t.advertisement();
            scoringSystem();//新增评分系统
        },
        advertisement:function(){
            var t = this;
            console.log(refId);
            $.ajax({
                url: '/mcall/medicalCollege/getBannerList/',
                type: "post",
                data: {
                    paramJson: $.toJSON(
                        {
                            //   "resourceId":refId,
                            "opUsr":TempCache.getItem("userId")!=""&&TempCache.getItem("userId")!=undefined?TempCache.getItem("userId"):"",
                            "resourceId":refId,
                            "recommendType":6,
                            "resourceType":2,
                            "firstResult":0,
                            "maxResult":1,
                            'visitSiteId': 1
                        }
                    )
                },
                dataType: 'json',
                success: function (d) {

                    if (d && d.responseObject && d.responseObject.responseData && d.responseObject.responseData.dataList && d.responseObject.responseData.dataList.length > 0) {
                        var item = d.responseObject.responseData.dataList[0];
                        $(".al-advertisement-video").remove();
                        $(".Ev-discussArea").before(`<section class='al-advertisement-video'><section class='al-advertisement-picture' style='background: url("${item.bannerUrl}") no-repeat center center/cover'></section></section>`);
                        $(".al-advertisement-video").off("click").on("click",function(){
                            console.log(comm.banner);
                            comm.banner.openBanner(item);
                        });
                        console.log(d.responseObject.responseData.dataList.length);
                    } else {

                    }
                },
                error: function () {

                }
            });
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
            series: function () {
                //系列课程
                var t = this;
                var operateData = {
                    pageName: function () {
                        var a = location.href;
                        var b = a.split("/");
                        var c = b.slice(b.length - 1, b.length).toString(String).split(".");
                        return c.slice(0, 1);
                    }
                };
                var param = {
                    paramJson: $.toJSON({
                        // "resourceId": 1491805335090,    //资源Id
                        "resourceId": $('#resourceId').val(),    //资源Id
                        "isValid": !$(".al-terminalNone").length ? 1 : 0,
                        "resourceType": 2
                    })
                };
                var findRecommendObj = function () {
                    var objArr = [$(".Ev-recommendVideo"), $(".Ev-similarRecommend")];
                    var resultObj = false;
                    $.each(objArr, function (i, v) {
                        if (v.length > 0) {
                            resultObj = v;
                        }
                    })
                    return resultObj;
                };
                var templateRecommend = function (data) {
                    var reStr = "";
                    /*//资源类型，1-视频，2-文库，7-病例,17-电子书，18-文章*/
                    $.each(data, function (i, v) {
                        var typeStr = "";
                        switch (parseInt(v.resourceType)) {
                            case 1:
                                typeStr = "视频";
                                break;
                            case 2:
                                typeStr = "文库";
                                break;
                            case 7:
                                typeStr = "病例";
                                break;
                            case 17:
                                typeStr = "电子书";
                                break;
                            case 18:
                                typeStr = "文章";
                                break;
                        }
                        reStr += '<article class="al-terminalRecommendItem"><a href="//' + v.webStoragePath + '"><em>' + typeStr + '</em><span>' + comm.getStrLen(v.resourceName, 30) + '</span></a></article>';
                    });
                    return reStr;
                };
                function recommendShow(data) {
                    var recommendObj = findRecommendObj();
                    var newArrData = [];
                    var recommendLen = 0;
                    if (data) {
                        $.each(data, function (i, v) {
                            if (i < 5) {
                                newArrData.push(v);
                            }
                            recommendLen++;
                        });
                    }

                    recommendObj.find(".al-terminalRecommendItem").each(function (i) {
                        if (i < recommendLen) {
                            $(this).remove();
                        }
                    });
                    recommendObj.find("h2").after(templateRecommend(newArrData));
                    if (recommendObj.find(".al-terminalRecommendItem").length > 0) {
                        recommendObj.show();
                    } else {
                        recommendObj.hide();
                    }
                }
                function belongCourse(data){
                    var templateBelong = function(data){
                        var belongStr = "";
                        $.each(data,function(i,v){
                            belongStr+='<a href="/pages/discover/series/discover_series_details.html?tId='+ v.courseId+'">《'+v.courseName+'》</a>';
                        });
                        return belongStr;
                    };
                    if(data.length>0){
                        var belongObj = $(".al-series-belong");
                        belongObj.find(".al-series-list").html(templateBelong(data));
                        belongObj.show();
                    }
                }
                //资源类型，1-视频，2-文库，7-病例,17-电子书，18-文章
                var callback = function (rep) {
                    if (rep && rep.responseObject && rep.responseObject.responseData && rep.responseObject.responseData.data_list
                        && rep.responseObject.responseData.data_list.length > 0) {
                        var dataInfo = rep.responseObject.responseData.data_list;
                        belongCourse(dataInfo);
                        recommendShow(rep.responseObject.responseData.recommend_list);
                    }
                };
                comm.ajax.async(M_CALL + "/cms/course/getCoursesByResource/", param, callback);
            },
        //上一篇和下一篇文章点击
        prevNextArticle:function(){
            var param={};
            param.docId=refId;
            param.visitSiteId =2;
            var params={paramJson: $.toJSON(param)};
            var callback=function(data){
                    if (data && data.responseObject && data.responseObject.responseData&&data.responseObject.responseData.data_list) {
                        var items=data.responseObject.responseData.data_list[0];
                        if(items.last_doc_data&&items.last_doc_data.length>0){
                            $(".Ev-prevArticle a").attr("href",items.last_doc_data[0].webStoragePath);
                        }else{
                            $(".Ev-prevArticle a").css("color","#B4B4B4").find("img").attr("src","//img50.allinmd.cn/pages/personal/arrowBack_grayLeft.png");
                        }
                        if(items.next_doc_data&&items.next_doc_data.length>0){
                            $(".Ev-nextArticle a").attr("href",items.next_doc_data[0].webStoragePath);
                        }else{
                            $(".Ev-nextArticle a").css("color","#B4B4B4").find("img").attr("src","//img50.allinmd.cn/pages/personal/arrowBack_grayLeft.png");
                        }

                    }
            };

            comm.ajax.async("/mcall/cms/doc/getMapByLastNext/",params,callback);
        },
        //七牛视频处理
        qiniuEdit:function(){
            var t=this;
            var _v=absVideoData;
            var _fontSize=parseInt(parseInt($(".al-terminalContextItem p").css("font-size"))*0.9);
            $(".al-terminalContextItem:first p span").attr("style", "");
            $(".al-terminalContextItem:first p img").attr("style", "").removeAttr('width height');
            $(".al-terminalContextItem:first a>img").attr("style", "width:100%");
            $(".al-terminalContextItem:first").children("style,meta").remove();
            $(".al-terminalContextItem:first p>img").each(function(i,e){
                $(e).attr("style", "");
            });
            $.each($(".al-terminalContextItem:first a"), function (i, e) {
                var _href=$(e).attr("href");
                var _n=_href?(_href.substring(_href.lastIndexOf("/")+1,_href.lastIndexOf(".html"))):"";
                $(e).addClass("Ev-videoImgSrc").attr("style", "").css({
                    position:"relative",
                    display:"block"
                }).attr("href", "javascript:;");

                if(!$(e).find("img").length&&_n){//表格中的视频进行容错
                    $.each($(e).siblings("img"),function(i2,e2){
                        if($(e2).attr("src")){
                            $(e).append('<img style="min-width:4.5rem;" src="'+$(e2).attr("src")+'"/>');
                            $(e2).attr("src","").remove();
                            return false;
                        }
                    });
                }
                $.each(_v,function(k,v){
                    if(v.videoId==_n){
                        //$(e).find("img").attr("src",v.APPPicUrl);
                        $(e).attr("videoSrc", v.APPMp4Url).append('<i class="al-terminalVideoBtn"><img src="//img50.allinmd.cn/pages/case/video.png"></i><span class="al-videoTime Ev-videoTime">'
                        + v.playTime+'</span>');
                        return false;
                    }
                });
                $.each($(".Ev-vAbsArticle"), function (i1, ele) {
                    if ($(ele).attr("data-videoId") == _n) {
                        $(e).attr("data-videoAbs", $(ele).text()).after('<p style="color: #666;font-size: '+_fontSize+'px;text-align: justify;">' + $(ele).text() + '</p>');
                        return false;
                    }
                });
            });
            var clickTime = 0;
            $('.Ev-videoImgSrc img').on('click', function (e) {
                if($(this).parents(".Ev-videoImgSrc").attr("videoSrc")){
                    clickTime++;
                    t.default.scrollTop=$(window).scrollTop();
                    var poster  =$(this).attr('src');
                    var videoLen = $('video').length+2;
                    var _n=$(this).parents("a");
                    var _w=parseInt($(window).width());
                    var _h=parseInt($(window).width()*0.5625);
                    var videoItem = '<section class="al-videoBox Ev-articleVideo">' +
                        '<a class="Ev-articleClose" href="javascript:;">X</a>' +
                        '<figure class="al-videoBoxItem al-terminalImgVideo">' +
                        '<video id="CKa_book'+clickTime+'" class="video-js vjs-default-skin vjs-no-flex vjs-big-play-centered">' +
                        '  <source src="'+_n.attr("videoSrc")+'">'+
                        '  </video>'+
                        '</figure>' +
                        '<article class="al-videoItemContent">' + _n.attr("data-videoAbs") + '</article>' +
                        '</section>';
                    $('body').css("position","fixed").append(videoItem);
                        //.find('video')[0].play();
                    var player2 = new AllinmdPlayer('CKa_book'+clickTime, {
                        width: _w,
                        height: _h,
                        poster: poster,  //播放之前需要放置的海报图片
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
                    //player2.SetControlBarShow(false);
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
        },
        //视频关闭
        videoClose: function () {
            var t=this;
            $(document).on("click",".Ev-articleClose", function () {
                $(".Ev-articleVideo").remove();
                $("body").css({position:"static"});
                $(window).scrollTop(t.default.scrollTop);
            });
        },
        //返回按钮
        backBtnClick: function () {
            $(".Ev-backBtn").on("click", function () {
                if (document.referrer.lastIndexOf("/passport/") > -1 || document.referrer.indexOf("seminar") > -1 || !document.referrer) {
                  g_sps.jump(null,"/");
                } else {
                    history.back();
                }
                return false;
            });
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
                $(".ev-column a").attr('href', '/pages/discover/discover_feature_detail.html?columnId=' + parseInt(data.specialId)).text('《'+comm.getStrByteLen(data.specialTitle, 28)+'》');
            }

        },
        //评论区最新最旧按钮切换
        oldNewFunc: function () {
            $(".al-terminalSortChangeItem").on("click", function () {
                $(this).addClass('active').siblings().removeClass('active');
            });
        },
        //页面上的分享功能
        shareFunc: function () {
            var t=this;
            var paramLog = {};
            paramLog.shareSence = shareSenceConst.doc_detail;
            var param = {};
            param.sessionCustomerId = cId||'';
            param.docId = refId;
            param.resourceType = refType;
            param.sceneType = 27;
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
            $(".Ev-shareBtn").off("click").on("click", function () {

                var shareToName = $(this).attr('ref');
                if (shareToName == "wx") {
                    var shareHtml = '<div class="dk-result-pointer-bg"></div><div class="dk-result-pointer" ></div>';
                    $("body").append(shareHtml);
                    $("body").bind('touchmove', function (e) {
                        e.preventDefault();
                    });
                    $(".dk-result-pointer,.dk-result-pointer-bg").on("click", function () {
                        $(".dk-result-pointer").remove();
                        $(".dk-result-pointer-bg").remove();
                        $('body').unbind('touchmove');
                        return false;
                    });
                } else if (shareToName == "trend") {
                        user.privExecute({
                            operateType: 'auth', //'login','auth','conference'
                            callback: function () {
                                comm.loading.show();
                                $.ajax({
                                    type: "post",
                                    url: "/mcall/customer/reprint/create/",
                                    data: {
                                        paramJson: $.toJSON({
                                            "reprintType": refType,
                                            "customerId": cId,//当前人ID
                                            "refId": refId,//资源id
                                            "visitSiteId": "2"//1PC 2 h5
                                        })
                                    },
                                    dataType: "json",
                                    success: function (rep) {
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
                                    error: function () {
                                        comm.loading.hide();
                                        popup("分享到唯医朋友圈失败！");
                                        $('body').unbind('touchmove');
                                    }
                                });
                            }
                        });
                    } else {
                        var newHref = t.default[shareToName + '_m'];
                        var picture = '&pics=http:',
                            shareTitleFixed, shareChannel;
                        if (shareToName == 'sina') {
                            picture = "&pic=http:";
                            shareTitleFixed = paramLog.sinaDesc != '' ? comm.getStrLen(paramLog.sinaDesc,140): comm.getStrLen(document.title,140);
                            shareChannel = 3;
                        } else if (shareToName == 'qzone') {
                            shareTitleFixed = paramLog.qZoneTitle != '' ? paramLog.qZoneTitle : document.title;
                            shareChannel = 1;
                        }
                        if (  paramLog.picUrl.search(':') >= 0) {
                            paramLog.picUrl = paramLog.picUrl.split(':')[1];
                        }
                        comm.shareLog({
                            shareType: 7,
                            resourceId: refId,
                            resourceType: 7,
                            refId: refId,
                            isValid: 1,
                            shareSence: 10,
                            shareChannel: shareChannel,
                            shareContent: paramLog.shareTitle,
                            refCustomerId: cId
                        });
                        window.open(newHref + 'url=' + encodeURIComponent(window.location.href) + '&title=' + shareTitleFixed +
                            picture + encodeURIComponent( paramLog.picUrl) + '&summary=' + encodeURIComponent(comm.getStrLen(paramLog.qZoneSummary,60)) +
                            (shareToName == 'sina' ? '&desc=' + encodeURIComponent(comm.getStrLen(paramLog.sinaDesc,60)) : ""), '_blank');
                    }
                    $('body').unbind('touchmove');
                    return false;
            });

            shareAll({
                title: paramLog.shareTitle,
                url: window.location.href,//不传默认取当前地址
                pic: paramLog.picUrl ,//分享图片
                trendUrl: "/mcall/customer/reprint/create/",//分享动态的请求连接  //不需要动态分享就不传
                noPJ: 0,//0：分享动态给后台的参数需要转为paramJson ,1:不需要
                data: {//分享动态传给后台的参数
                    "reprintType":refType,
                    "customerId": cId,//当前人ID
                    "refId": refId,//资源id
                    "visitSiteId": "2"//1PC 2 h5
                },
                callback: function () {
                },//分享动态后成功后的回调函数
                wxTitle: paramLog.wechatTitle,//微信分享标题
                wxDesc:  paramLog.weiXinDesc,//微信分享描述
                timeLineTitle: paramLog.timelineTitle,
                sinaTitle: paramLog.sinaDesc,//新浪title
                desc: paramLog.sinaDesc,//新浪的描述
                qzoneTitle: paramLog.qZoneTitle,//qq空间title
                summary:  paramLog.qZoneSummary ,//qq空间的描述
                qShareLog: function (x) {
                    comm.shareLog({
                        shareType: refType,
                        resourceId: refId,
                        resourceType: refType,
                        refId: refId,
                        isValid: 1,
                        shareSence: paramLog.shareSence,
                        shareChannel: x=='sina'?3:1,
                        shareContent:  x=='sina'?(paramLog.sinaDesc?paramLog.sinaDesc:document.title):(paramLog.qZoneTitle?paramLog.qZoneTitle:document.title),
                        refCustomerId: cId

                    });
                },  //分享新浪，空间成功与否都执行
                fnMessageSuc: function () {//分享好友成功回调
                    comm.shareLog({
                        shareType: refType,
                        resourceId: refId,
                        resourceType: refType,
                        refId: refId,
                        isValid: 1,
                        shareSence: paramLog.shareSence,
                        shareChannel: 4,
                        shareContent: paramLog.shareTitle,
                        refCustomerId: cId

                    });
                },
                fnTimelineSuc: function () {//分享朋友圈成功回调
                    comm.shareLog({
                        shareType: refType,
                        resourceId: refId,
                        resourceType: refType,
                        refId: refId,
                        isValid: 1,
                        shareSence: paramLog.shareSence,
                        shareChannel: 5,
                        shareContent: paramLog.shareTitle,
                        refCustomerId: cId
                    });
                }
            }, false,$(".Ev-topShareBtn"));
        },
        //页面中的浏览，关注数，话题的关注状态
        contentFun: function () {
            var t = this;
            var callback=function(rep){
                if(rep&&rep.responseObject&&rep.responseObject.responseData&&rep.responseObject.responseData.data_list){
                    var data =rep.responseObject.responseData.data_list[0];//关注
                    var info = data.customer_doc;//收藏，点赞，评论，关注，浏览数
                    var auth = data.doc_customer_auth;//电子书文章的作者
                    //评论数
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

                    //浏览数
                    if (info.browseNum && info.browseNum > 0) {
                        if (parseInt(info.browseNum) > 9999) {
                            $(".Ev-browseNum").text(info.browseNum.toW());//浏览数
                        } else {
                            $(".Ev-browseNum").text(info.browseNum);//浏览数
                        }

                    } else {
                        $(".Ev-browseNum").text(0);//浏览数
                    }

                    //关注数
                    if (info.followFansNum && info.followFansNum > 0) {
                        $(".Ev-followNum").text(info.followFansNum);//关注数
                    } else {
                        $(".Ev-followNum").text(0);//关注数
                    }

                    //点赞数
                    if (info.preferUpNum && info.preferUpNum > 0) {
                        if (parseInt(info.preferUpNum) > 999) {
                            $(".Ev-praiseNum span").show().text("999+");//点赞数
                        } else {
                            $(".Ev-praiseNum span").show().text(info.preferUpNum);//点赞数
                        }
                    } else {
                        $(".Ev-praiseNum span").show().text("点赞");//点赞数
                    }
                    //收藏数
                    if (info.collectionNum && info.collectionNum > 0) {
                        if (parseInt(info.collectionNum) > 999) {
                            $(".Ev-collectNum span").show().text("999+");//收藏数
                        } else {
                            $(".Ev-collectNum span").show().text(info.collectionNum);//收藏数
                        }
                    } else {
                        $(".Ev-collectNum span").show().text("收藏");//收藏数
                    }

                    //文章的点赞状态和收藏状态
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
                    t.praColDisFunc(auth.customerId);//点赞收藏评论操作
                    t.activityStatus(data);
                }
            };
           comm.ajax.async("/mcall/cms/doc/info/", {paramJson: $.toJSON({
                sessionCustomerId: cId,
                useFlag: 12,
                visitSiteId: 2,
                logoUseFlag: 3,
                docId: refId
            })},callback);
        },
        //点赞收藏评论操作
        praColDisFunc: function (val) {
            var t = this;
            var authorName = $('.Ev-chContent').text().replace(/[\n|\s]/g, "");
            $(".Ev-discussBtn").off("click").on("click", function () {//加入讨论操作
                comm.creatEvent({
                    triggerType:'加入讨论',
                    keyword:$('#resourceId').val(),
                    actionId:72
                });
              g_sps.jump(null,"/pages/common/comment.html?resourceId=" + refId + "&username=" + authorName + "&type=" + refType + "&parentId=0&refCustomerId=" + val);
            });
            $(".Ev-reviewNum").off("click").on("click", function () {//评论数点击操作
                var _top = $(".Ev-discussArea").offset().top;
                $(window).scrollTop(_top);
                return false;
            });
            var rep;
			var praising =false,collecting = false;
            $(".Ev-praiseNum").off("click").on("click", function () {//点赞数点击操作
				if(praising){
					return false;
				}
                var kv = $(".Ev-praiseNum span").text();
                var preferUpNum = $(".Ev-praiseNum span").text()!="点赞" ? parseInt($(".Ev-praiseNum span").text()) : "点赞";
                var params = {};
                params.customerId = cId;
                params.refId = refId;
                params.usefulType = refType;
                params.upDownType = 1;
				praising = true;
                var paramsData={paramJson: $.toJSON(params)};
                if ($(".Ev-praiseNum").hasClass("on")) {//取消点赞
                    var callbackOff=function(rep){
						praising = false;
                        if (rep&&rep.responseObject&&rep.responseObject.responseStatus && rep.responseObject.responseStatus == true) {
                            $(".Ev-praiseNum").removeClass("on");
                            if (kv.indexOf("+") == -1) {
                                if (preferUpNum && preferUpNum > 0) {  //点赞数
                                    if (preferUpNum - 1 > 0) {
                                        $(".Ev-praiseNum span").text(preferUpNum - 1);
                                    } else {
                                        $(".Ev-praiseNum span").text("点赞");
                                    }

                                } else {
                                    $(".Ev-praiseNum span").text("点赞");
                                }
                            }
                        }
                    };
                    comm.ajax.async("/mcall/customer/prefer/delete/", paramsData,callbackOff);

                } else {//点赞
                    var callbackOn=function(rep){
						praising = false;
                        if (rep&&rep.responseObject&&rep.responseObject.responseStatus && rep.responseObject.responseStatus == true) {
                            $(".Ev-praiseNum").addClass("on");
                            if (kv.indexOf("+") == -1) {
                                if(preferUpNum=="点赞"){
									$(".Ev-praiseNum span").text(1).show();//点赞数
                                }else{
									$(".Ev-praiseNum span").text(preferUpNum+1).show();//点赞数
                                }
                            }
                        }
                    };
                    comm.ajax.async("/mcall/customer/prefer/create/", paramsData,callbackOn);

                }
            });
            $(".Ev-collectNum").off("click").on("click", function () {//收藏数点击操作
				if(collecting){return false;}
                var kVal = $(".Ev-collectNum span").text();
                var collectionNum = $(".Ev-collectNum span").text()!="收藏" ? parseInt($(".Ev-collectNum span").text()) : "收藏";
                var param = {};
                param.customerId = cId;
                param.refId = refId;
				collecting= true;
                param.collectionType = refType;
                var paramsData={paramJson: $.toJSON(param)};
                if ($(".Ev-collectNum").hasClass("on")) {//取消收藏
                    var callbackOff=function(rep){
						collecting= false;
                        if (rep&&rep.responseObject&&rep.responseObject.responseStatus && rep.responseObject.responseStatus == true) {
                            $(".Ev-collectNum").removeClass("on");
                            if (kVal.indexOf("+") == -1) {
                                if (collectionNum && collectionNum > 0) {
                                    if (collectionNum - 1 > 0) {
                                        $(".Ev-collectNum span").text(collectionNum - 1);
                                    } else {
                                        $(".Ev-collectNum span").text("收藏").show();
                                    }
                                } else {
                                    $(".Ev-collectNum span").text("收藏").show();
                                }
                            }
                        }
                    };
                    comm.ajax.async("/mcall/customer/collection/delete/", paramsData,callbackOff);
                } else {//收藏
                    var callbackOn=function(rep){
						collecting= false;
                        if (rep&&rep.responseObject&&rep.responseObject.responseStatus && rep.responseObject.responseStatus == true) {
                            $(".Ev-collectNum").addClass("on");
                            if (kVal.indexOf("+") == -1) {
                                if(collectionNum =="收藏"){
									$(".Ev-collectNum span").text(1).show();
                                }else{
									$(".Ev-collectNum span").text(collectionNum + 1).show();//收藏数
                                }
                            }
                        }
                    };
                    comm.ajax.async("/mcall/customer/collection/create/", paramsData,callbackOn);
                }
            });
        },
        //顶部滚动和评论区导航滚动
        scrollFunc: function () {
            var t = this;
            var windowTop = 0;//初始可视区域距离页面顶端的距离
            $(window).bind("scroll", function () {
                var _top = $(".Ev-discussArea").offset().top;
                var scrolls = $(this).scrollTop();//获取当前可视区域距离页面顶端的距离
                if (scrolls >= _top) {//评论区顶部最新最旧
                    $(".Ev-discussArea h2").css({
                        "position": "fixed",
                        "top": $('.Ev-fixedHeader').outerHeight(),
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
        //所属活动，所属书籍
        activityStatus: function (data) {
            var t = this;
            var act = data.bookDoc ? data.bookDoc : "";
            if ($.trim(act)&&!$.isEmptyObject(act)) {
                $(".Ev-article").show();
                $(".Ev-AllBookBtn").show();
                $(".Ev-articleName").text("《" + comm.getStrByteLen(act.bookName, 28) + "》");
                t.bookId=act.bookId;
                t.allBookClick();  //全书阅读点击进行引导app
            }
        },
        //全书点击，引导打开app
        allBookClick: function () {
            var t=this;
            $('.Ev-AllBookBtn').off("click").on('click',function(){
                var refId =t.bookId;
                var amChannel = comm.getpara()._amChannel;
                var callAppOptionsAll ={
                    ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=2&sourceId=" + refId + "&tplPath=286&share=app&visitSiteId=5"+ (amChannel?"&_amChannel="+amChannel:''),
                    android: "allin://com.allin.social:75235?data={scene:3,type:2,sourceId:"+ refId +",tplPath:286"+ (amChannel?",_amChannel:"+amChannel:'')+ "}",
                    ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=2&sourceId=" + refId+ "&tplPath=286&share=app&visitSiteId=5"+ (amChannel?"&_amChannel="+amChannel:''),
                    runAtOnce: false
                };
                comm.appWakeUp("confirm", callAppOptionsAll);//唤醒app弹层
            });
        },
        //更新浏览数
        updateViewdNum: function () {
            commdata.asyncExecute("updateDocNum", {
                "propertyKey": "browseNum",
                "type": "plus",
                "docId": refId
            });
        },
        //草稿提示
        draftRemind: function () {
            var t=this;
            comm.draftRemind({
                url: "/mcall/customer/draft/reviewOperate/",
                data: {refId: refId, reviewType: refType, operateType: 1},//reviewType 4:话题 7:病例;
                type: 2, //1:频道页 2:详情页
                resourceId: refId,
                resourceType:refType,//resourceType 1-视频，2-文库，4-话题 ,7-病例
                data2: {refId: refId, reviewType: refType, operateType: 2}//operateType 1:说明执行的是判断是否加载提示操作 2:关闭提示
            });
        }
    };
    article.init();
    //相关产品
    var relatedProducts={
        path:{
            product:"/mcall/cms/resourceCategory/getMapList/"
        },
        init:function(){
            var t=this;
            t.resourceType=$("#relationType").val();
            t.resourceId=$("#resourceId").val();
            t.getData();
            t.appendRecommendProduct();
        },
        appendRecommendProduct:function(){
            var oldRecommendElement = $(".al-productRecommendPart");//原有的相关推荐产品
            var newRecommendTemplate = '<!--推荐产品开始-->'+
                '                        <section class="al-elite-productList" style="display: none;">'+
                '                            <section class="al-elite-titleBar productTitle"><h1 class="title">推荐产品</h1>'+
                '                            </section>'+
                '                            <section class="al-elite-productContainerWrap">'+
                '                                <section class="al-elite-productContainer">'+
                '                                </section>'+
                '                            </section>'+
                '                        </section>'+
                '  <!--推荐产品结束-->';
            oldRecommendElement.hide().after(newRecommendTemplate);
            oldRecommendElement.remove();
        },
        getData:function(){
            var t=this;
            var data={
                resourceType:t.resourceType,     //文库2 视频1 病例7
                resourceId:t.resourceId,
                categoryType:4,
                pageIndex:1,
                pageSize:10000,
                isValid:1,
                sortType:5
            };
            var params={paramJson: $.toJSON(data)};
            comm.loading.show();
            comm.ajax.async(t.path.product,params,function(data){
                $(".al-productRecommendPart").css("display","block");
                if(data&&data.responseObject.responseData&&data.responseObject.responseData.total_count){
                    var total_count=data.responseObject.responseData.total_count;
                    t.total_count=total_count;
                    $('.al-productRecommendPart .num').text(total_count);
                }
                if(data&&data.responseObject.responseData&&data.responseObject.responseData.data_list){
                    var data_list = data.responseObject.responseData.data_list;
                    if (data_list.length > 0){
                        t.dataProcessing(data_list);
                    }
                }
                if($.isEmptyObject(data.responseObject.responseData)){
                    $(".al-productRecommendPart").css("display","none");
                }
                comm.loading.hide();
            });
        },
        dataProcessing:function(data){
            var t=this;
            var html='';
            /*唯医3.6推荐产品逻辑开始*/
            $(".al-elite-productList .title").html("推荐产品");
            var n = data.length >= 10 ? 10 : data.length;
            if(n>0){
                $(".al-elite-productList").show();
            }
            for (var i = 0; i < n; i++) {
                var dataItem = data[i];
                var newUrlLink = dataItem.productId;
                dataItem.webStoragePath = '//m.allinmd.cn/dist/medPlus/medPlus.html?#/productDetail?productId=' + newUrlLink + '&';
                if (parseInt(dataItem.operationType, 10) === 1) {
                    if (dataItem.attPath !== '') {
                        html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                            '                                        <section class="al-elite-productCard"\n' +
                            '                                                 style="background: url(&quot;'+dataItem.attPath+'&quot;) center center / cover no-repeat;">\n' +
                            '                                        </section>\n' +
                            '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                            '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                            '                                    </a>';
                    } else {
                        html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                            '                                        <section class="al-elite-productCard"\n' +
                            '                                                 style="background: url(&quot;//img50.allinmd.cn/score/productNoImg.png&quot;) center center / cover no-repeat;">\n' +
                            '                                        </section>\n' +
                            '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                            '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                            '                                    </a>';
                    }
                } else if (parseInt(dataItem.operationType, 10) === 2) {
                    if ((parseInt(dataItem.customerId, 10) === parseInt(cId, 10)) && (parseInt(dataItem.customerId, 10) != 0)) {//我打的产品
                        if (dataItem.attPath !== '') {
                            html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                                '                                        <section class="al-elite-productCard"\n' +
                                '                                                 style="background: url(&quot;'+dataItem.attPath+'&quot;) center center / cover no-repeat;">\n' +
                                '                                            <span class="al-my-product">我的</span>\n' +
                                '                                        </section>\n' +
                                '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                                '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                                '                                    </a>';
                        } else {
                            html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                                '                                        <section class="al-elite-productCard"\n' +
                                '                                                 style="background: url(&quot;//img50.allinmd.cn/score/productNoImg.png&quot;) center center / cover no-repeat;">\n' +
                                '                                            <span class="al-my-product">我的</span>\n' +
                                '                                        </section>\n' +
                                '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                                '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                                '                                    </a>';
                        }
                    } else {
                        if (dataItem.attPath !== '') {
                            html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                                '                                        <section class="al-elite-productCard"\n' +
                                '                                                 style="background: url(&quot;'+dataItem.attPath+'&quot;) center center / cover no-repeat;">\n' +
                                '                                        </section>\n' +
                                '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                                '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                                '                                    </a>';
                        } else {
                            html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                                '                                        <section class="al-elite-productCard"\n' +
                                '                                                 style="background: url(&quot;//img50.allinmd.cn/score/productNoImg.png&quot;) center center / cover no-repeat;">\n' +
                                '                                        </section>\n' +
                                '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                                '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                                '                                    </a>';
                        }
                    }

                }

            }
            $('.al-elite-productContainer').append(html);
            if (n == 10) {
                $('.al-elite-productContainer').append('<section class="al-elite-productItem al-elite-productMore total">\n' +
                    '                                        <section class="al-elite-productCard"\n' +
                    '                                                 style="background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAABp5JREFUeAHtnc1rlEccx3c3wSSHmCBSRSwmoRARxJqjUMGg9BQPbc+C9FIP9dL2r9BezKG9lIJn20NyKpYUWsgxLQ2IgZKkNYS2iBiFbFLy0s93febhedlnn3mefZLN7s4DDzPPzPzm5bO/38w8LzNbLrXw2N/fP7m9vX2ZKozv7e2Nl8vlcfynOQeJG+R6UNXD/xr/a7w6/+Z6qVKpLOFf6uvr+5W45/hbcpQPs1QaPgCw68CapNxJGn6RsKbqQB5ksb9IfnNAnQPoj4RVD6tdTVXeppICtLW1dZW0tzg/4vq4jVzeNMB7hewjzof9/f0/C3DevGzkDgwgoPrQttu4X3CO2VSm6DTAW+a8h1Z+i7tddP7Kr3CAwJKZfoKZfk7+Zw6i0jnyXMe87wPya0AWat6FAsRUpwD4gHMkRyMPXAR4q5x3Me3ZogorBGC1Wj0ncFTqZlEVO+B8ZgD56cDAwF/NltM0QMz1g93d3W+oyHCzlTlk+Zc9PT0fY9bfN1NuJa8wGndsc3PzAfC+I492g6dmD6vuaoPakpdDLg2kwBP0d7O4V/IWfJTkMOd5+sUp3BdZ65UZINDOAu8H3AtZCzvK6YH3BIjv465lqWcmgIAbB9xjzrezFNIuaYH3jPMGIHWbaHVY94HSvE6GJ1pSDK+NZ63okcgKIJmqz5PZdqTmBWGpjV5bTwTDk/ypAMnwGBlqwOioPi8JiMLVVq/NqaNzKkAmyffJsCNG20bQonFqs9oeDY9eNxxEvEmy5nldezDZ/rDRZDsRoHd79hvk2nGSXOQP/pKR+VLSbV+iCaPCurftdnj6IYZhMZ30i9QFSAc6hUC7PBhIaluR4Tc9JrE8YyYM7QESP8EdiaXu4gDMeJUJ9gXc0PPEmAbS991x8OKaIiZ6UByNCWkgifoAuEyio/IkOVrfVl+vM5iMoYX+64GQBkL4toPX8Dc64zHyE/kaiPbp7dkfuGN+rPPECKB9y/SF7+DW3vb5Ggi8qw5ejFcsQIzEykT4AAm4ZQKdm0rAZ1UzYahq6qJPJo6niroEJcz3FWZ8Grda00A6xusOnr1miJWYSaIG0PtWxT4Hl7JkmJk+cNIxyUygxkyfNp2k//sX15/SZM6qCwU0jaEffKuCLV928LJrgJiJnUz4fHZxJ+ERGK/QGeqrUHfkIAC78xVs2QHMAU8iYteLeyqnfKIYfUNpZWWltLGxUUszNDRUGh0dLfFuIVEmGNFq+WBdUvynyjy+WqFDHElJaB2txi8sLJR2dnZCMr29vaWJiYlUiK2WD1U65QINXK0Ar/YlfEpa62hpXhSehBWmuLSj1fJp9QvGi536wEIBGrMNFmT8jeJs0hyGvKmHjSt25k7EJr1LU4eATFiLVwo7NGAkHY3ijEyjNI3iipI3+di4YicTLhSgRlsNGNFDYYpLO1otn1a/YLzYaRT+HZIXgxHN+ls9DWm2fNv2A3BRAPXBZO3Zlq2gS/eGAAAfqw+0/hrTgQsTEDsW8FSehoPdlS0B2C1pGuM00JZYPN2Se6Aah2IVQv/35oEqnufY8qKVlEvkExAzsTN3InN+jPPYEqgxqwGkM3QAbbF56Qwz92I9Izglx3TDL9YJ0EeDWibvDjsCjzxmoYU2D+1kXSoI+Kz8d8GMKu7zNgvdQPPqf95GxD7nPYs8ujqJGImVgeBroALQQveJryFT3238iS9ktxmeU5c31c+780PFRoyCLQ1poCLQQrfMIUjI8wPObpkDCaucd+vk0dVBYiI2UQjmVi4UzldHswTMhAK7+2LGYxKjEDNhk4In1ecwZ7fYsFTKt9iQBSV/al8VA7RbXTFIWqkpJnVN2MDy1slOm+sudKcbrRUWj0QTNrAwYy35/wm3q1atM2BoL5lruP8ZFvXcVIASAp42nfgFtyv2TQCa9pB5Dzd1Ix4rgB5EbbgzD8SO3rkDaM+AdwV3rZ7GRcMa9oHBxMqQ84YKCIZ3kl9t89poBU9tt9ZAAwoNdFs/GRi41hpoZPiF1rz+Yd6EtbtLmzRgqM+z1jzT5swAJUhBLyjwGt5OmOJMqy1qk4GSxc1swtHM+ZDHbcAYhZLlWhNNfr13kWmne2dtAXopbZJsw6FpDQwWwjTHbUIbBJLHzyg9wIOIO8h+xnlUNq9Ypy5fck/7FZoXeySVp51GplANNJnKBaTbiDsIJK8fkG4r+LzwonIyb0Zt92cEUTB5rwFq/g7jvBY90j9p3Z6WnjX6O4x/kDN/h/GUkbSlf4fxPxamYl2QcMBBAAAAAElFTkSuQmCC\') center center / cover no-repeat;">\n' +
                    '                                        </section>\n' +
                    '                                        <article class="al-elite-productDes productEndProductDes">\n' +
                    '                                            <p class="content">查看更多</p></article>\n' +
                    '                                    </section>');
            }
            if (t.total_count == 9) {
                $('.al-elite-productContainer .al-elite-productMore').remove();
            }
            /*唯医3.6推荐产品逻辑结束*/
            if(t.total_count>3){
                //t.touchFun();
            }
            t.skipProduct();
            $('.ev_digHole').click(function () {
                var _hr = $(this).attr('href');
                var _refId = _hr.split('.html')[0];
                var _rd = _refId.substring(_refId.lastIndexOf('/') + 1);
                comm.creatEvent({
                    triggerType: '引流医栈',
                    keyword: $(this).find('.al-productRecommendText').text(),
                    actionId: 1,
                    pushMessageId:_rd,
                    locationId: $(this).parent().index() + 1
                });
            });
        },
        //手动滑动查看
        touchFun:function(){
            var tag_num = $(".al-productRecommendListBox >li").length;
            var nav_widthx = document.body.clientWidth; //获取可视区域宽度
            var tag_width =$(".al-productRecommendListBox >li").width();
            var max_width = (tag_num * tag_width + tag_width+20) * -1; //获取左滑最大距离
            document.getElementById("al-productRecommendListBox").addEventListener('touchstart', touchStart,false);
            document.getElementById("al-productRecommendListBox").addEventListener('touchmove', touchMove,false);
            document.getElementById("al-productRecommendListBox").addEventListener('touchend', function() {
                isMove = false;
            },false);
            function touchStart(e) {
                isMove = true;
                tx = parseInt($("#al-productRecommendListBox").css('left'));
                x = e.touches[0].pageX;
            }
            function touchMove(e) {
                if (isMove) {
                    var n = tx + e.touches[0].pageX - x;
                    if (n <= 0 && n > max_width) {
                        $("#al-productRecommendListBox").css('left', n + 'px');
                    }
                }
            }
        },
        //点击全部进入产品列表页
        skipProduct:function(){
            var t=this;
            $(".total").on("click",function(){
                window.location='/pages/scoringSystem/productListPage.html?resourceType='+t.resourceType+'&resourceId='+t.resourceId+'';
            });
        }
    }
    relatedProducts.init();
    //window.onload = Log.createBrowse(5, "文库终端页面"); //	浏览日志
});





