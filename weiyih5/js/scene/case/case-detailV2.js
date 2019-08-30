/**
 * Created by Administrator on 2014/12/29.
 */
$(function () {
    var cId = TempCache.getItem("userId");
    var refType = $("#relationType").val();
    var refId = $("#resourceId").val();
    toggleToPC();
    var amChannel = comm.getpara()._amChannel;
    var callAppOptions = {
        ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=7&sourceId=" + refId + "&tplPath=1"+ (amChannel?"&_amChannel="+amChannel:''),
        android: "allin://com.allin.social:75235?data={scene:3,type:7,sourceId:" + refId + ",tplPath:1"+ (amChannel?",_amChannel:"+amChannel:'')+ "}",
        ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=7&sourceId=" + refId + "&tplPath=1"+ (amChannel?"&_amChannel="+amChannel:''),
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
                    if($(".Ev-fixedHeader").length>0){//有分享按鈕時
                        $(".al-appWakeUpFigure").css("margin-top","1.3rem")
                    }
                //}
                //TempCache.removeItem("detailNoNeedApp");
            },
            noNeedBack:true,
            noAuthTip:1
        });
    //}


    //病例
    if ($(".Ev-caseDetail").length > 0) {
        //新增病例页视频开始
        var qiniuId = '';
        var contentVideoLength = 0;
        var contentPlayers=[];
        if ($('.Ev-videoCtrl').length > 0) {
            /*
             * 新版视频处理
             * */
            //新版病例终端页视频播放逻辑实现,张恒
            $(".Ev-videoCtrl .videoImg").each(function(){
                var isThis = $(this);
                var videoOnOff =isThis.attr("data-src").length>5;//是否有视频
                var initVideo = function(em){
                    contentVideoLength = contentPlayers.length;
                    var itemEm = em.parents(".videoImg");
                    var videoItem = ' <video id="CKa_content'+contentVideoLength+'" class="video-js vjs-default-skin vjs-no-flex vjs-big-play-centered">'+
                        '  <source src="'+itemEm.attr('data-src')+'">'+
                        '  </video>';
                    itemEm.find('.Ev-videoPlay').html(videoItem).show();
                    //debugger;
                    var _n = itemEm;
                    var _w = _n.width();
                    var _h = _n.find(".Ev-videoBcImg").height();
                    contentPlayers[contentVideoLength] = new AllinmdPlayer('CKa_content'+contentVideoLength, {
                        width: _w,
                        height: _h,
                        poster: itemEm.find('.Ev-videoBcImg').attr('src'),  //播放之前需要放置的海报图片
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
                    comm.players.push(contentPlayers[contentVideoLength]);
                    contentPlayers[contentVideoLength].player.play();
                    $.each(comm.players,function(ix,plea){
                        plea.player.on('play',function(){
                            $.each(comm.players,function(ind,ple){
                                if(plea.player!= ple.player){
                                    ple.player.pause();
                                }
                            });
                        });
                    });
                };
                if(videoOnOff){
                    isThis.find(".al-terminalVideoBtn").off("click").on("click",function(){
                        isThis.find(".Ev-videoBcImg").hide();//隐藏视频截图
                        isThis.find(".al-terminalVideoBtn").hide();//隐藏视频播放按钮
                        isThis.find(".Ev-videoTime").hide();//隐藏视频时间
                        var itElement = $(this);
                        initVideo(itElement);
                    });
                }
            });
            //老版病例终端页视频播放逻辑实现
            /*$.each($('.Ev-videoCtrl'),function(i,em){
                qiniuId = $(em).attr('data-qiniuId');
                if (qiniuId != '' && qiniuId != undefined) {
                    $.ajax({
                        url: "/mcall/qiniu/storage/getMapVideoList/",
                        type: "post",
                        data: {paramJson: $.toJSON({refType: 7, refId: refId, attUseFlag: 13, qiniuId: qiniuId})},
                        dataType: 'json',
                        success: function (data) {
                            if (data && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.videoListMap.length) {
                                var item = data.responseObject.responseData.videoListMap[0];
                                if (item.qiniuStatus == 1 || item.qiniuStatus == 0 || item.qiniuStatus == 3) {//七牛视频处理状态0－未上传，1－上传成功，2－转码成功,3-转码中',
                                    $('.Ev-videoBcImg',$(em)).attr('src', '//img50.allinmd.cn/case/videoFormating.jpg');
                                    $('.Ev-videoTime,.al-terminalVideoBtn',$(em)).html('').hide();
                                } else if (item.qiniuStatus == 2) {
                                    //var _n = $('.Ev-videoCtrl');
                                    $('.Ev-videoTime',$(em)).html(item.playTime);
                                    $('.Ev-videoBcImg',$(em)).attr('src', item.logoUrl);
                                    //var _w = _n.css("width");
                                    //var _h = _w * 0.666;

                                    $(em).on('click', function () {
                                        contentVideoLength = $('.al-terminalContent video').length;
                                        if ($(".Ev-videoPlay",$(em)).find('video').length == 0) {
                                            var videoItem = ' <video id="CKa_content'+contentVideoLength+'" class="video-js vjs-default-skin vjs-no-flex vjs-big-play-centered">'+
                                                '  <source src="'+item.attUrl+'">'+
                                                '  </video>';
                                            $('.Ev-videoPlay',$(em)).html(videoItem);

                                            $('.Ev-maxVideo',$(em)).children().not(".Ev-videoPlay",$(em)).hide();
                                            $(".Ev-videoPlay",$(em)).show();

                                            var _n = $(em);
                                            var _w = _n.width();
                                            var _h = _w * 0.666;
                                            contentPlayers[contentVideoLength] = new AllinmdPlayer('CKa_content'+contentVideoLength, {
                                                width: _w,
                                                height: _h,
                                                poster: $('.Ev-videoBcImg',$(em)).attr('src'),  //播放之前需要放置的海报图片
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
                                            comm.players.push(contentPlayers[contentVideoLength]);
                                            contentPlayers[contentVideoLength].player.play();
                                            $.each(comm.players,function(ix,plea){
                                                plea.player.on('play',function(){
                                                    $.each(comm.players,function(ind,ple){
                                                        if(plea.player!= ple.player){
                                                            ple.player.pause();
                                                        }
                                                    });
                                                });
                                            });
                                        }
                                    });
                                }else if(item.qiniuStatus==4){//转码失败
                                    $('.Ev-videoBcImg',$(em)).attr('src','//img50.allinmd.cn/case/videoFailing.png');
                                    $('.Ev-videoTime,.al-terminalVideoBtn',$(em)).html('').hide();
                                }
                            } else if (data.responseObject.responseStatus == false) {
                                $(em).remove();
                            }
                        }
                    })
                }
            });*/

        }
        //新增病例页视频结束
    }
    var caseBase = {
        default: {
            qzone_m: "http://qzs.qzone.qq.com/open/connect/widget/mobile/qzshare/index.html?",
            sina_m: "http://v.t.sina.com.cn/share/share.php?&appkey=&"
        },
        init: function () {
            var t = this;
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
            $('.al-terminalContentTags').hide();//将标签先进行隐藏，请求回后进行展示
            t.updateViewdNum();//增加浏览数
            t.shareDomRender();
            t.discFunc();//讨论处@的人的跳转
            t.loadRecommendCase();//推荐病例
            t.contentFun();//页面中的浏览，关注数，病例的关注状态
            t.oldNewFunc();//评论区最新最旧按钮切换
            t.scrollFunc();//评论最新最旧的滚动&&固定
            t.shareFunc();//页面上的分享功能
            t.draftRemind();//草稿提示
            t.backBtnClick();//返回按钮
            t.authorNeat();
            t.getColumnInfo();//栏目相关推荐10.12
            t.activityStatus();//所属活动
            scoringSystem();//新增评分系统
            t.bindOrientationChangeEvent(); //处理视频转屏时大小问题
            t.eventTrack();
            t.viewBigImg();
            t.series();
            t.getTabList();//获取标签
            t.advertisement();
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
                            "resourceType":7,
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
            var param = {
                paramJson: $.toJSON({

                    "resourceId": $('#resourceId').val(),    //资源Id
                    "isValid": !$(".al-terminalNone").length ? 1 : 0,
                    "resourceType": 7
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
                        belongStr+='<a href="/dist/discover/discover_seriesDetail.html?tId='+ v.courseId+'">《'+v.courseName+'》</a>';
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
        viewBigImg:function(){
            /**
             * 点击查看大图
             * */
            function initSuiFangJiLu(){
              var container = $("[data-attnamelist]");
              container.each(function(){
                 var imgItem = $(this);
                 var imgList = imgItem.attr("data-attnamelist").split("@_@");
                 imgItem.find(".Ev-maxImg").each(function(i){
                     $(this).find("img").attr({"title":imgList[i]})
                 });
              });
            }
            initSuiFangJiLu();
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
                    //loop: true, // 开启循环模式,必须设置loopedSlides
                    //loopedSlides: 1, //looped slides should be the same
                    paginationFractionRender: function (swiper2, current, total) {
                        var _inf = $(swiper2.wrapper).find('.swiper-slide').eq(swiper2.activeIndex).find('img').attr('title');
                        _inf = (_inf&&_inf!='undefined')?_inf:"";
                        return '<span class="' + current + '"></span>' +
                            ' / ' +
                            '<span class="' + total + '"></span>'+
                            '<div class="ev-imgInfo imgInfo_text">'+ (_inf?(_inf.length>100?comm.getStrLen(_inf,200):_inf):"")+'</div>';
                    },
                    onSlideChangeStart:function(swiper2){ //滑块释放时如果触发slider切换则执行
                        var _imgInfo = $(swiper2.wrapper).find('.swiper-slide').eq(swiper2.activeIndex).find('img').attr('title');
                        _imgInfo = (_imgInfo&&_imgInfo!='undefined')?_imgInfo:"";
                        $('.ev-imgInfo').html(_imgInfo?(_imgInfo.length>100?comm.getStrLen(_imgInfo,200):_imgInfo):"");
                    },
                    preventClicks:false,//当swiper在触摸时阻止默认事件（preventDefault），用于防止触摸时触发链接跳转。
                    pagination : '.swiper-pagination'//分页器
                },
                zoom:true,
                imgClickCallBack:function(index,ele){
                    if(comm.players.length){
                        for(var i=0;i<comm.players.length;i++){
                            comm.players[i]&&comm.players[i].player.pause();
                        }
                    }
                    Log.createBrowse(188,'点击大图');
                    $('html').attr('sT',$(window).scrollTop());
                    $('html,body').css({height:'100%',overflow:'hidden'});
                    $('.ev-topTitle').html($(ele).parents('.Ev-imgCtrl').attr('typeTitle'));
                },
                bottomSwiperOptions: {
                    isInit:false,//是否需要初始化,
                },
                closeCallBack:function(){
                    $('html,body').css({height:'auto',overflow:'auto'});
                    $(window).scrollTop($('html').attr('sT')||0);
                    $('html').removeAttr('sT');
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

        },
        bindOrientationChangeEvent: function () {
            var t = this;
            $(window).on('orientationchange', function (event) {
                $('.CKa1-dimensions').css({
                    width:$('.al-terminalImgBox').width(),
                    height:$('.al-terminalImgBox').width()*0.56
                })
            });
            $(window).on('resize', function (event) {
                $('.CKa1-dimensions').css({
                    width:$('.al-terminalImgBox').width(),
                    height:$('.al-terminalImgBox').width()*0.56
                })
            });
        },
        //强迫症对齐专用(al-terminalAuthorMsg 作者信息无职称时候对齐)
        authorNeat: function () {
            if (!$.trim($(".al-terminalAuthorMsg p>span").eq(0).text())) {
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
        //埋点专用
        eventTrack:function(){
            var t = this;
            $('.al-simCase').attr("href","javascript:;")
            $('.al-simCase').click(function(){
                comm.creatEvent({
                    triggerType:"终端页功能",
                    keyword:"我有相似病例",
                    actionId:11052,
                    async:false
                });
               /* comm.creatEvent({
                    triggerType:'补充病例',
                    keyword:"补充病例",
                    actionId:34
                });*/
                t.releaseCase()
            });
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
        //返回按钮
        backBtnClick: function () {
            $(".Ev-backBtn").on("click", function () {
                if (TempCache.getItem("prevCaseHref")) {
                    g_sps.jump(null,TempCache.getItem("prevCaseHref"));
                    TempCache.removeItem("prevCaseHref");
                } else if (document.referrer.lastIndexOf("/passport/") > -1 || document.referrer.indexOf("seminar") > -1 || !document.referrer) {
                   g_sps.jump(null,"/");
                } else {
                    history.back();
                }
                return false;
            })
        },
        //推荐视频
        loadRecommendCase: function () {
            var t = this;
            var recommendBox = $(".Ev-similarRecommend");
            $.ajax({
                url: '//m.allinmd.cn/mcall/case/baseinfo/listInTag/', //推荐视频
                type: "GET",
                dataType: "json",
                data: {
                    refId: refId
                },
                success: function (data) {
                    if (data && data.rows && data.rows[0].refCaseItems && data.rows[0].refCaseItems.length > 0) {
                        var list = data.rows[0].refCaseItems;
                        recommendBox.show();
                        var html = "", html2;
                        $.each(list, function (i, e) {
                            if (i < 5) {
                                html += '<article class="al-terminalRecommendItem"><a href="' + e.pageStoragePath + '">' +
                                    '<em>病例</em><span>' + comm.cutstr(e.caseName, 32, 1) + '</span></a>' +
                                    '</article>';
                            }
                        });
                        html2 = '<h2>相关推荐</h2>' + html;
                        recommendBox.html(html2);
                    } else {
                        recommendBox.hide();
                    }
                }
            })
        },
        //评论区最新最旧按钮切换
        oldNewFunc: function () {
            $(".al-terminalSortChangeItem").on("click", function () {
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
            paramLog.shareSence = shareSenceConst.case_detail;
            var param = {};
            param.resourceType = refType;
            param.sessionCustomerId = cId||'';
            param.sceneType = 6;
            param.caseId = refId;
            param.useFlag = 12;
            param.visitSiteId = 2;
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
                    //判断是否是pK活动作品
                    var sTitleC = comm.cutstr($('.Ev-caseTitle h2').text().replace(/[\n|\s]/g, ""), 30, 1);
                    var authorName = $('.Ev-authorName').text().replace(/[\n|\s]/g, "");
                    authorName = ((authorName == '唯医小编' || authorName == "") ? "" : authorName + ":");//作者名称为唯医小编时为空
                    //视频病例PK活动分享不同
                    if ($('#resourceId').attr('activityId') == 1449026372937) {//1449026372937是视频病例PK活动ID
                        paramLog.shareTitle = "参赛病例《" + sTitleC + "》";
                        paramLog.wechatTitle=paramLog.shareTitle;
                        paramLog.weiXinDesc = authorName + '参加了“骨科示教病例及手术视频评选活动”， 快点赞支持他！点击进入作品';
                        paramLog.timeLineTitle = "参赛病例《" + paramLog.shareTitle + "》，欢迎讨论！";
                        paramLog.sinaDesc =  paramLog.weiXinDesc;
                        paramLog.qZoneTitle=paramLog.shareTitle;
                        paramLog.qZoneSummary= paramLog.weiXinDesc;
                    }
                    t.shareFuncClick(paramLog);
                }else{
                    t.shareFuncClick({});
                }
            };
            comm.ajax.async("/mcall/comm/data/share/getMapList3/",params,callback);
        },
        //分享点击操作
        shareFuncClick:function(paramLog){
            var t = this;
            //页面固定的分享
            $(".Ev-shareBtn").off("click").on("click", function () {
                comm.creatEvent({
                    triggerType:'分享',
                    keyword:"分享",
                    actionId:40,
                    locationId:$(this).index()
                });
                var shareToName = $(this).attr('ref');
                if (shareToName =='wx') {
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
                }else if (shareToName == "trend") {
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
                } else {
                    var newHref = t.default[shareToName + '_m'];
                    var picture = '&pics=http:',
                        shareTitleFixed, shareChannel;
                    if (shareToName == 'sina') {
                        picture = "&pic=http:";
                        shareTitleFixed = paramLog.sinaDesc ? paramLog.sinaDesc : document.title;
                        shareChannel = 3;
                    } else if (shareToName = 'qzone') {
                        shareTitleFixed = paramLog.qZoneTitle ? paramLog.qZoneTitle : document.title;
                        shareChannel = 1;
                    }
                    if (  paramLog.picUrl&&paramLog.picUrl.search(':') >= 0) {
                        paramLog.picUrl = paramLog.picUrl.split(':')[1];
                    }else{
                        paramLog.picUrl ='//m.allinmd.cn/image/allin_logo.png';
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
                    window.open(newHref + 'url=' + encodeURIComponent(window.location.href) + '&title=' + encodeURIComponent(shareTitleFixed) +
                        picture + encodeURIComponent(  paramLog.picUrl) + '&summary=' + encodeURIComponent(paramLog.qZoneSummary) +
                        (shareToName == 'sina' ? '&desc=' + encodeURIComponent(paramLog.sinaDesc) : ""), '_blank');
                }
                $('body').unbind('touchmove');
                return false;
            //}
            });

            shareAll({
                title: paramLog.shareTitle?paramLog.shareTitle:document.title,
                url: window.location.href,//不传默认取当前地址
                pic: paramLog.picUrl? paramLog.picUrl:"https://m.allinmd.cn/image/allin_logo.png",//分享图片
                trendUrl: "/mcall/customer/reprint/create/",//分享动态的请求连接  //不需要动态分享就不传
                noPJ: 0,//0：分享动态给后台的参数需要转为paramJson ,1:不需要
                data: {//分享动态传给后台的参数
                    "reprintType": refType,
                    "customerId": cId,//当前人ID
                    "refId": refId,//资源id
                    "visitSiteId": "2"//1PC 2 h5
                },
                callback: function () {
                },//分享动态后成功后的回调函数
                wxTitle: paramLog.wechatTitle?paramLog.wechatTitle:"",//微信分享标题
                wxDesc:  paramLog.weiXinDesc?paramLog.weiXinDesc:"",//微信分享描述
                timeLineTitle: paramLog.timelineTitle?paramLog.timelineTitle:"",
                sinaTitle: paramLog.sinaDesc?paramLog.sinaDesc:"",//新浪title
                desc: paramLog.sinaDesc?paramLog.sinaDesc:"",//新浪的描述
                qzoneTitle: paramLog.qZoneTitle?paramLog.qZoneTitle:"",//qq空间title
                summary:  paramLog.qZoneSummary?paramLog.qZoneSummary:"" ,//qq空间的描述
                qShareLog: function (x) {
                    comm.shareLog({
                        shareType: refType,
                        resourceId: refId,
                        resourceType: refType,
                        refId: refId,
                        isValid: 1,
                        shareSence: paramLog.shareSence?paramLog.shareSence:"",
                        shareChannel: x=='sina'?3:1,
                        shareContent: x=='sina'?(paramLog.sinaDesc?paramLog.sinaDesc:document.title):(paramLog.qZoneTitle?paramLog.qZoneTitle:document.title),
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
                        shareSence: paramLog.shareSence?paramLog.shareSence:"",
                        shareChannel: 4,
                        shareContent: paramLog.shareTitle?paramLog.shareTitle:document.title,
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
                        shareSence: paramLog.shareSence?paramLog.shareSence:"",
                        shareChannel: 5,
                        shareContent: paramLog.shareTitle?paramLog.shareTitle:document.title,
                        refCustomerId: cId
                    });
                }
            }, false,$(".Ev-topShareBtn"));
        },

        //讨论处@的人的跳转
        discFunc: function () {
            $('.Ev-disPerCenter a').on("click", function () {
                var href = parseInt($(this).attr('href'));
                if (/^\d+$/.test(href)) {//href只是数字
                  g_sps.jump(null,'/dist/personal/others_index.html?cid=' + href);
                    return false;
                }
            });
        },
        //页面中的浏览，关注数，病例的关注状态
        contentFun: function () {
            var t = this;


            var callback = function (rep) {
                if (rep && rep.responseObject && rep.responseObject.responseData &&!$.isEmptyObject(rep.responseObject.responseData)&& rep.responseObject.responseData.data_list) {
                    var data = rep.responseObject.responseData.data_list[0];//关注
                    if (!$.isEmptyObject(data)) {
                        var info = data.case_baseinfo;//收藏，点赞，评论，关注，浏览数
                        var auth = data.case_customer_auth;//病例的作者

                        $('#resourceId').attr('activityId', info.activityId);//把activityId赋值给input#resourceId属性
                        //病例关注 回复数
                        if (info.reviewNum && info.reviewNum >0) {
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
                            $(".Ev-browseNum").text(info.browseNum.toW());//浏览数
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
                                $(".Ev-collectNum span").show().text("999+");//点赞数
                            } else {
                                $(".Ev-collectNum span").show().text(info.preferUpNum);//点赞数
                            }
                        } else {
                            $(".Ev-collectNum span").show().text("点赞");//点赞数
                        }

                        if (info.collectionNum && info.collectionNum > 0) {
                            if (parseInt(info.collectionNum) > 999) {
                                $(".Ev-praiseNum span").show().text("999+");//收藏数
                            } else {
                                $(".Ev-praiseNum span").show().text(info.collectionNum);//收藏数
                            }
                        } else {
                            $(".Ev-praiseNum span").show().text("收藏");//收藏数
                        }


                        //病例关注状态开始
                        if (auth.customerId == cId) {
                            $(".Ev-EditBtn").css("display", "inline-block");
                            $(".Ev-FollowBtn,.Ev-alFollowBtn").hide();
                        } else {
                            if (parseInt(data.followRelationship) === 0) {
                                $(".Ev-FollowBtn").css("display", "inline-block");
                                $(".Ev-EditBtn,.Ev-alFollowBtn").hide();
                            } else {
                                $(".Ev-alFollowBtn").css("display", "inline-block");
                                $(".Ev-EditBtn,.Ev-FollowBtn").hide();
                            }
                        }

                        //病例的点赞状态和收藏状态
                        if (parseInt(data.preferRelationship) != 0) {//点赞
                            $(".Ev-collectNum").addClass("on");
                        } else {
                            $(".Ev-collectNum").removeClass("on");
                        }
                        if (parseInt(data.collectionRelationship) != 0) {//收藏
                            $(".Ev-praiseNum").addClass("on");
                        } else {
                            $(".Ev-praiseNum").removeClass("on");
                        }
                        t.followClickFunc();//关注按钮的点击事件
                        t.praColDisFunc(auth.customerId, info);//点赞收藏评论操作
                    } else {
                        $(".Ev-navReviewNum").text(0);
                    }
                }
            };
            comm.ajax.async("/mcall/case/baseinfo/info/", {
                paramJson: $.toJSON({
                    sessionCustomerId: cId,
                    useFlag: 12,
                    visitSiteId: 2,
                    logoUseFlag: 3,
                    caseId: refId,
                    attUseFlag: 10
                })
            }, callback);
        },
        //关注按钮的点击事件
        followClickFunc: function () {
            var t = this;
            var params = {};
            params.paramJson = $.toJSON({
                refId: refId,
                followType: refType,
                refName: $(".Ev-caseTitle h2").text(),
                customerId: cId
            });//refId  被关注者ID
            $(".Ev-EditBtn").off("click").on("click", function () {//点击编辑
                //2017/12/22已注，点击编辑跳转终端页Ding
                // if (!TempCache.getItem("prevCaseHref")) {
                //     TempCache.setItem("prevCaseHref", document.referrer);//记录上传病例的来源页，以后用作返回依据
                // }
                // window.location.href = "/pages/case/case_upload.html?caseId=" + refId;
                t.releaseCase();
            });
            $(".Ev-FollowBtn").off("click").on("click", function () {//关注，点击进行关注
              user.privExecute({
                operateType: 'auth',   //'login','auth','conference'
                callback: function () {
                  comm.creatEvent({
                    triggerType:'关注',
                    pushMessageId:$('#resourceId').val(),
                    actionId:6
                  });
                  var _n = parseInt($(".Ev-followNum").text());
                  $.ajax({
                    type: "POST",
                    url: "/mcall/customer/follow/resource/create/",
                    data: params,
                    dataType: "json",
                    success: function (rep) {
                      if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                        $(".Ev-alFollowBtn").css("display", "inline-block");
                        $(".Ev-EditBtn,.Ev-FollowBtn").hide();
                        $(".Ev-followNum").text(_n + 1);
                      }
                    },
                    error: function () {
                    }
                  });
                }
              });
            });
            $(".ev-sureBtn").off("click").on("click", function () {//确认取消
                var _n = parseInt($(".Ev-followNum").text());
                $.ajax({
                    type: "POST",
                    url: "/mcall/customer/follow/resource/delete/",
                    data: params,
                    dataType: "json",
                    success: function (rep) {
                        if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                            $(".Ev-FollowBtn").css("display", "inline-block");
                            $(".Ev-EditBtn,.Ev-alFollowBtn").hide();
                            $(".Ev-cancelFollow").removeClass('on');
                            if (_n && _n != 0) {
                                if (_n - 1 > 0) {
                                    $(".Ev-followNum").text(_n - 1);
                                } else {
                                    $(".Ev-followNum").text(0);
                                }
                            } else {
                                $(".Ev-followNum").text(0);
                            }
                        }
                    },
                    error: function () {
                    }
                });
            });
            $(".Ev-alFollowBtn").off("click").on("click", function () {//已关注，点击取消关注
                $(".Ev-cancelFollow").addClass('on');
            });
            $(".ev-cancelBtn").off("click").on("click", function () {
                $(".Ev-cancelFollow").removeClass('on');
            });
        },
        //点赞收藏评论操作
        praColDisFunc: function (val) {
            var t = this;
            $(".Ev-discussBtn").off("click").on("click", function () {//加入讨论操作
              var authorName = $('.Ev-authorName').text().replace(/[\n|\s]/g, "");
              var $this=$(this);
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
                  }else{
                    var href = "/pages/common/comment.html?resourceId=" + refId + "&username=" + authorName + "&type=" + refType + "&parentId=0&refCustomerId=" + val
                    g_sps.jump($this,href);
                  }
                }
              });
            });
            $(".Ev-reviewNum").off("click").on("click", function () {//评论数点击操作
                var _top = $(".Ev-discussArea").offset().top;
                $(window).scrollTop(_top);
                return false;
            });
            var rep;
			var praising =false,collecting = false;
            $(".Ev-collectNum").off("click").on("click", function () {//点赞数点击操作
                if(collecting){
                    return false;
                }
                var kv = $(".Ev-collectNum span").text();
                var preferUpNum = $(".Ev-collectNum span").text()!="点赞" ? parseInt($(".Ev-collectNum span").text()) : "点赞";
                var params = {};
                params.customerId = cId;
                params.refId = refId;
                params.usefulType = refType;
                params.upDownType = 1;
                collecting = true;
                var paramData = {paramJson: $.toJSON(params)};
                  user.privExecute({
                    operateType: 'auth',   //'login','auth','conference'
                    callback: function () {
                      if ($(".Ev-collectNum").hasClass("on")) {//取消点赞
                        var callbackOff = function (rep) {
                          collecting = false;
                          if (rep && rep.responseObject && rep.responseObject.responseStatus && rep.responseObject.responseStatus == true) {
                            $(".Ev-collectNum").removeClass("on");
                            if (kv.indexOf("+") == -1) {
                              if (preferUpNum && preferUpNum > 0) {  //点赞数
                                if (preferUpNum - 1 > 0) {
                                  $(".Ev-collectNum span").text(preferUpNum - 1);
                                } else {
                                  $(".Ev-collectNum span").text("点赞");
                                }
                              } else {
                                $(".Ev-collectNum span").text("点赞");
                              }
                            }
                          }
                        };
                        comm.ajax.async("/mcall/customer/prefer/delete/", paramData, callbackOff);
                      } else {//点赞
                        var callbackOn = function (rep) {
                          collecting = false;
                          if (rep && rep.responseObject && rep.responseObject.responseStatus && rep.responseObject.responseStatus == true) {
                            $(".Ev-collectNum").addClass("on");
                            if (kv.indexOf("+") == -1) {
                              if($(".Ev-collectNum span").text() === '点赞'){
                                $(".Ev-collectNum span").text('1');
                              }else{
                                $(".Ev-collectNum span").text(preferUpNum + 1).show();//点赞数
                              }
                            }
                          }
                        };
                        comm.ajax.async("/mcall/customer/prefer/create/", paramData, callbackOn);

                      }
                    }
                  });
            });
            
            $(".Ev-praiseNum").off("click").on("click", function () {//收藏数点击操作
                if(praising){
                    return false;
                }
                var kVal = $(".Ev-praiseNum span").text();
                var collectionNum = $(".Ev-praiseNum span").text() ? parseInt($(".Ev-praiseNum span").text()) : "";
                var param = {};
                praising = true;
                param.customerId = cId;
                param.refId = refId;
                param.collectionType = refType;
                var paramData = {paramJson: $.toJSON(param)};
                  user.privExecute({
                    operateType: 'auth',   //'login','auth','conference'
                    callback: function () {
                      if ($(".Ev-praiseNum").hasClass("on")) {//取消收藏

                        var callbackOff = function (rep) {
                          praising =false;
                          if (rep && rep.responseObject && rep.responseObject.responseStatus && rep.responseObject.responseStatus == true) {
                            $(".Ev-praiseNum").removeClass("on");
                            if (kVal.indexOf("+") == -1) {
                              if (collectionNum && collectionNum > 0) {
                                if (collectionNum - 1 > 0) {
                                  $(".Ev-praiseNum span").text(collectionNum - 1);
                                } else {
                                  $(".Ev-praiseNum span").text("收藏");
                                }
                              } else {
                                $(".Ev-praiseNum span").text("收藏");
                              }
                            }
                          }
                        };
                        comm.ajax.async("/mcall/customer/collection/delete/", paramData, callbackOff);
                      } else {//收藏

                        var callbackOn = function (rep) {
                          praising =false;
                          if (rep && rep.responseObject && rep.responseObject.responseStatus && rep.responseObject.responseStatus == true) {
                            $(".Ev-praiseNum").addClass("on");
                            if (kVal.indexOf("+") == -1) {
                              if($(".Ev-praiseNum span").text() === '收藏'){
                                $(".Ev-praiseNum span").text('1');
                              }else{
                                $(".Ev-praiseNum span").text(collectionNum + 1).show();//收藏数
                              }
                            }
                          }
                        };
                        comm.ajax.async("/mcall/customer/collection/create/", paramData, callbackOn);
                      }
                    }
                  });
            });
        },
        //顶部滚动和评论区导航滚动
        scrollFunc: function () {
            var t = this;
            var windowTop = 0;//初始可视区域距离页面顶端的距离
            $(".Ev-discussArea h2").wrap('<div style="height:1.2rem;width: 100%;"></div>');
            $('.al-terminalFooter').show();
            $(window).bind("scroll", function () {
                var _top = $(".Ev-discussArea").offset().top;
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
                    if(scrolls!=0){
                        windowTop = scrolls;
                    }

                    // $('.al-terminalFooter').hide();
                } else {//上滑
                    windowTop = scrolls;
                    // $('.al-terminalFooter').show();
                }
            });
        },
        //所属活动
        activityStatus: function () {
            var callback = function (rep) {
                if (rep && rep.responseObject && rep.responseObject.responseData &&!$.isEmptyObject(rep.responseObject.responseData)&& rep.responseObject.responseData.data_list) {
                    var data = rep.responseObject.responseData.data_list[0];//关注
                    var caseAuth=data.case_customer_auth;
                    var name=caseAuth.lastName+caseAuth.firstName;
                    var company=caseAuth.company?caseAuth.company:caseAuth.schoolName;
                    var medicalTitle=caseAuth.medicalTitleShow;
                    var logoUrl=data.case_customer_logo.logoUrl;
                    var act = data.activity;
                    if (act.activityId != 0 || act.activityId != "") {
                        $(".Ev-activity").show().find("span").text(act.type == 1 ? "活动：" : "专题：");
                        $(".Ev-actName").text("《" + comm.getStrByteLen(act.activityName, 28) + "》").attr("href", act.activityUrl);
                    }
                    if(!caseAuth.customerId||caseAuth.customerId==0){
                        $(".al-terminalHeader").hide();
                    }
                    $(".Ev-authorName").text(name);
                    $(".al-terminalAuthorImg img").attr("src",logoUrl);
                    $(".al-terminalAuthorMsg p").eq(0).html('<span>'+medicalTitle+'</span><span>'+company+'</span>');
                    $(".al-terminalHeader a").attr("href",(caseAuth.customerId&&caseAuth.customerId!=0)?"/dist/personal/others_index.html?cid="+caseAuth.customerId:'javascript:;');
                }
            };
            comm.ajax.async("/mcall/case/baseinfo/getMapById3/", {
                paramJson: $.toJSON({
                    sessionCustomerId: cId,
                    useFlag: 12,
                    visitSiteId: 2,
                    logoUseFlag: 3,
                    caseId: refId,
                    attUseFlag: 10
                })
            }, callback);

        },
        //更新浏览数
        updateViewdNum: function () {
            commdata.asyncExecute("updateCaseNum", {
                "propertyKey": "browseNum",
                "type": "plus",
                "caseId": $("#resourceId").val()
            });
        },
        //草稿提示
        draftRemind: function () {
            //草稿提示
            comm.draftRemind({
                url: "/mcall/customer/draft/reviewOperate/",
                data: {refId: refId, reviewType: 7, operateType: 1},//reviewType 4:话题 7:病例;
                type: 2, //1:频道页 2:详情页
                resourceId: refId,
                resourceType: 7,//resourceType 1-视频，2-文库，4-话题 ,7-病例
                data2: {refId: refId, reviewType: 7, operateType: 2}//operateType 1:说明执行的是判断是否加载提示操作 2:关闭提示
            });
        },
        releaseCase: function(){
            var amChannel = comm.getpara()._amChannel;
            comm.newReleaseBox({
                imgPath:"/images/img50/case/release.png",
                title:"发布病例需使用唯医骨科App",
                solidBtnTitile:"立即使用",
                authNoneTitle:"暂不编辑",
                data:{
                    el: ".solidBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=7&sourceId=" + refId + "&tplPath=1" +(amChannel?"&_amChannel="+amChannel:''),
                    android: "allin://com.allin.social:75235?data={scene:3,type:7,sourceId:" + refId + ",tplPath:1"+ (amChannel?",_amChannel:"+amChannel:'')+ "}",
                    ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=7&sourceId=" + refId + "&tplPath=1" +(amChannel?"&_amChannel="+amChannel:''),
                }
            });
        },
        //获取标签列表
        getTabList: function () {
            //(1-视频,2-文库,4-话题,7-病例)
            var t = this;
            $.ajax({
                url: '//m.allinmd.cn/mcall/cms/resource_property/jsonList/', //推荐视频
                type: "post",
                dataType: "json",
                data: {paramJson: $.toJSON({
                        resourceType:7,
                        resourceId: refId,
                        isValid: 1,
                    })},
                success: function (data) {
                    if (data&&data.responseData&&data.responseData.dataList) {
                        var _rep = data.responseData.dataList;
                        var TagHtml = '';
                        for(var i = 0;i<_rep.length;i++){
                            TagHtml += '<a href="//m.allinmd.cn/dist/discover/discover_tagSubject.html?tId='+_rep[i].propertyId+'" class="al-terminalTags">'+_rep[i].propertyName+'</a>'
                        }
                        $('.al-terminalContentTags').html('<h3>标签</h3>'+TagHtml);
                        $('.al-terminalContentTags').show();
                    }
                }
            })
        }
    };
    caseBase.init();
    //相关产品
    var relatedProducts={
        path:{
            product:"/mcall/cms/resourceCategory/getMapList/"
        },
        init:function(){
            var t=this;
            t.resourceType=$("#relationType").val();
            t.resourceId=$("#resourceId").val();
            t.appendRecommendProduct();
            t.getData();
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
            $('.ev_digHole').click(function(){
                var _hr = $(this).attr('href');
                var _refId = _hr.split('.html')[0];
                var _rd = _refId.substring(_refId.lastIndexOf('/')+1);
                comm.creatEvent({
                    triggerType:'引流医栈',
                    keyword:$(this).find('.al-productRecommendText').text(),
                    actionId:1,
                    pushMessageId:_rd,
                    locationId:$(this).parent().index()+1

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
                window.location = '/dist/medPlus/medPlus.html#/terminalRelatedProducts?resourceType=' + t.resourceType + '&resourceId=' + t.resourceId + '';
            });
        }
    };
    relatedProducts.init();
    //window.onload = Log.createBrowse(10, "病例终端页面"); //	浏览日志

});


