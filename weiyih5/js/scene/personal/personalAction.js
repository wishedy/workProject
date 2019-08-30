$.getScript(window.paasFilePathObj.js,function() {
    $(function () {

        //区分他人与自己时
        var cid = getpara().cid;
        var uid = localStorage.getItem('userId');
        var isSelf = false;
        var isFriendCircle = false;
        if (cid === uid || location.pathname === "/pages/personal/personal_active.html") {
            isSelf = true;
            if (location.pathname !== "/pages/personal/personal_active.html") {
              g_sps.jump(null,"/pages/personal/personal_active.html");
            }
        }
        // /pages/personal/friends_circle.html
        //未登录
        if (isSelf && !uid) {
            $('.ev-list').append(module.listTemplate.notLoginTemplate());
        }

        if (isSelf) {
            //window.onload = Log.createBrowse(65, '我的动态页面');
        } else {
            if (location.pathname === "/pages/personal/friends_circle.html") {

            } else {
                //window.onload = Log.createBrowse(66, '他人的动态页面');
            }
        }
        var dataFlag = isSelf ? 4 : 5;
        if (location.pathname === "/pages/personal/friends_circle.html") {
            isSelf = true;
            dataFlag = 7;
            cid = uid;
            isFriendCircle = true;
        }
        if (isSelf && !uid) { //未登录
            return false;
        }
        var url = M_CALL + "customer/trends/getMapList/";
        var index = 1;
        var params = {
            paramJson: $.toJSON({
                customerId: cid,
                sessionCustomerId: uid,
                dataFlag: dataFlag,
                logoUseFlag: 3,
                attUseFlag: 2,
                visitSiteId: 2,
                scene: 2,
                pageIndex: 1,
                pageSize: 20
            })
        };

        comm.loading.show();
        $.ajax({
            url: url,
            type: "POST",
            data: params,
            success: function (data) {
                comm.loading.hide();
                dataList(data);
                replaceALink();
                if (!getpara().cid) {
                    waterfall();
                } else {
                    ohterWaterfall();
                }
                if ($('.al-footerBar').length) {
                    $(".ev-list").css('paddingBottom', $('.al-footerBar').outerHeight(true));
                }
            }
        });
        function replaceALink() {//替换@某人的a链接
            var _cid = TempCache.getItem('userId');
            var _href;
            $(".ev-list a").each(function () {
                _href = $(this).attr('href')
                if (/^\d+$/.test(_href)) {  //如果a链接中只是数字，说明是@人的cid
                    if (_href == _cid) {
                        $(this).attr('href', '/pages/personal/personal_contribution.html').css('color', '#3598db');
                    } else {
                        $(this).attr('href', '/pages/personal/others_contribution.html?cid=' + _href).css('color', '#3598db');
                    }
                }
            });
        }

        function dataList(data) {
            var result = AjaxResult(data);
            if (result.total_count > 0) {
                result = result.data_list;
                var html = '';
                for (var x = 0; x < result.length; x++) {
                    html += module.listTemplate.itemReview(AjaxAdapter(result[x]), "personalAction");
                }

                if (result.length < 20) {
                    $(".ev-list").append(html).attr('scrollPagination', 'disabled');
                    sub_Fns();
                    $(".ev-list").append(module.listTemplate.nullDataTemplate);
                } else {
                    $(".ev-list").append(html);
                    sub_Fns();
                }
            } else {
                if (location.pathname !== "/pages/personal/friends_circle.html") {
                    if (index == 1) {//第一页加载时
                        $(".ev-list").html(module.listTemplate.actionNullData()).attr('scrollPagination', 'disabled');
                    } else {
                        $(".ev-list").attr('scrollPagination', 'disabled');
                        $(".ev-list").append(module.listTemplate.nullDataTemplate);
                    }
                } else {
                    if (index == 1) {//第一页加载时
                        $('.ev-list').html(module.listTemplate.friendCircleNullDataTitle);
                    } else {
                        $(".ev-list").append(module.listTemplate.nullDataTemplate);
                        $(".ev-list").attr('scrollPagination', 'disabled');
                    }
                    if (TempCache.getItem("department") == 2) {//手外不推荐
                        $('.ev-list').remove();
                        return false;
                    }
                    if (index == 1) {
                        var url = M_CALL + "customer/trends/getMapList/";
                        var params = {
                            paramJson: $.toJSON({
                                dataFlag: 5,
                                opId: 0,
                                trendTypes: '1,2,4,7',
                                logoUseFlag: 3,
                                attUseFlag: 2,
                                visitSiteId: 2,
                                scene: 2,
                                pageIndex: 1,
                                pageSize: 50
                            })
                        };
                        $.ajax({
                            url: url,
                            type: "POST",
                            data: params,
                            success: function (data) {
                                var tt = {};
                                tt = AjaxResult(data).data_list;

                                if (!tt) {
                                    console.log('没有推荐数据!Error');
                                    return false;
                                }
                                ;

                                var html = '';
                                for (var x = 0; x < tt.length; x++) {
                                    html += module.listTemplate.itemReview(AjaxAdapter(tt[x]), "personalAction");
                                }

                                $(".ev-list").append(html).attr('scrollPagination', 'disabled');
                                sub_Fns();
                                $(".ev-list").append(module.listTemplate.nullDataTemplate).attr('scrollPagination', 'disabled');
                            }
                        });
                    }
                }
            }
        }

        function sub_Fns() {

            $(".ev-list").find(".ev-prefer").off('click').on('click', function () {
                if ($(this).attr('data-preferState') == 0) {
                    $(this).attr('data-preferState', 1);
                    var num = parseInt($(this).find(".ev-preferNum").text());
                    if (num > -1) {

                    } else {
                        num = 0;
                    }
                    $(this).find(".ev-preferNum").text(parseInt(num) + 1);
                    $(this).addClass("al-timelineContentLiked");
                } else {
                    $(this).attr('data-preferState', 0);
                    var num = parseInt($(this).find(".ev-preferNum").text()) - 1;
                    $(this).find(".ev-preferNum").text(num > -1 ? num : 0);
                    $(this).removeClass("al-timelineContentLiked");
                }

                social.prefer({
                    customerId: $(this).attr('data-customerId'),
                    usefulType: $(this).attr('data-reviewType'),
                    upDownType: $(this).attr('data-preferState') == 1 ? 1 : 0,
                    refId: $(this).attr('data-refId')
                });
                return false;
            });

            // $(".al-commentItem", ".ev-list").on('click', function() { //整列进入终端页
            //     var checkUrl = $(".itemsRefUrl", this).attr("href");
            //     if (checkUrl) { window.location.href = checkUrl; }
            // });

            bigPicShow.init({
                domIdList: [".al-commentContentImgPart"],//指定多个class|| ID
                topSwiperOptions: {
                    isInit: true,//是否需要初始化,
                    onInit: function (sipwer) {
                    },
                    zoom: true
                },
                imgClickCallBack: function (index, ele) {
                    if (comm.players.length) {
                        for (var i = 0; i < comm.players.length; i++) {
                            comm.players[i] && comm.players[i].player.pause();
                        }
                    }
                    Log.createBrowse(188, '点击大图');
                    $('html').attr('sT', $(window).scrollTop());
                    $('html,body').css({height: '100%', overflow: 'hidden'});
                    $('.ev-topTitle').html($(ele).parents('.Ev-imgCtrl').attr('typeTitle'));
                },
                bottomSwiperOptions: {
                    isInit: false,//是否需要初始化,
                },
                closeCallBack: function () {
                    $('html,body').css({height: 'auto', overflow: 'auto'});
                    $(window).scrollTop($('html').attr('sT') || 0);
                    $('html').removeAttr('sT');
                },
                theme: 'dark',
                topTitle: {
                    isInit: true,
                    title: ""
                }
            });
            $(".al-moreImgMask").on("click", function () {
                $(this).siblings("img").click();
            });


            $(".ev-list").find('.ev-review').on('click', function () {
                if (TempCache.getItem('customerRole') == 2 || TempCache.getItem('customerRole') == 3 || TempCache.getItem('customerRole') == 4) {
                    popup('该用户没有操作权限');
                } else {
                    var refId = $(this).attr('data-refId');
                    var username = $(this).attr('data-username');
                    var refType = $(this).attr('data-refType');
                    var parentId = $(this).attr('data-parentId');
                    TempCache.setItem('commentFromPage', window.location.href);
                    var href = '/pages/common/comment.html?resourceId=' + refId + '&username=' + username + '&type=' + refType + '&parentId=' + parentId;
                    g_sps.jump($(this), href);
                }
            });

            $(".ev-list").find('.ev-video').on('click', function () {

                var fullscreen = function (elem) {
                    var prefix = 'webkit';
                    if (elem[prefix + 'EnterFullScreen']) {
                        return prefix + 'EnterFullScreen';
                    } else if (elem[prefix + 'RequestFullScreen']) {
                        return prefix + 'RequestFullScreen';
                    }
                    ;
                    return false;
                };

                function autoFullScrenn(v) {
                    var ua = navigator.userAgent.toLowerCase();
                    var Android = String(ua.match(/android/i)) == "android";
                    // if(!Android) return;//非android系统不使用;
                    var video = v, doc = document;
                    var fullscreenvideo = fullscreen(doc.createElement("video"));
                    if (!fullscreen) {
                        alert("不支持全屏模式");
                        return;
                    }
                    video.addEventListener("webkitfullscreenchange", function (e) {
                        if (!doc.webkitIsFullScreen) {//退出全屏暂停视频
                            this.pause();
                            // this.pause();
                        }
                        ;
                    }, false);
                    video.addEventListener("click", function () {
                        this.play();
                        video[fullscreenvideo]();
                    }, false);
                    video[fullscreenvideo]();
                    video.addEventListener('ended', function () {
                        doc.webkitCancelFullScreen(); //播放完毕自动退出全屏
                    }, false);
                }

                // autoFullScrenn(video_obj)


                if ($(this).find('video').length == 0) {
                    var _w = $(this).find('img').eq(0).width();
                    var _h = $(this).find('img').eq(0).height();
                    var poster = $(this).find('img').eq(0).attr('src');
                    if (!(/jpg|png|jpeg/g.test($(this).attr('data-videoSrc')))) {
                        //$(this).children().hide(); //width:100% HEIGHT:312PX;
                        //var videoHtml = "<video controls src='" + $(this).attr('data-videoSrc') + "' style='width:"+_w+"px;height:"+_h+"px;top:0;left:0;background: #000;'></video>";
                        //var v = $(this).append(videoHtml).find('video')[0];
                        //v.play();
                        //autoFullScrenn(v);
                        /*
                         * 新版播放器
                         * */
                        var n = $('video').length + 2;
                        var videoItem = ' <video id="CKa' + n + '" class="video-js vjs-default-skin vjs-no-flex vjs-big-play-centered">' +
                            '  <source src="' + $(this).attr('data-videoSrc') + '">' +
                            '  </video>';
                        $(this).children().hide(); //width:100% HEIGHT:312PX;
                        $(this).append(videoItem);
                        var players = [];
                        players[n] = new AllinmdPlayer('CKa' + n, {
                            width: _w,
                            height: _h,
                            poster: poster,  //播放之前需要放置的海报图片
                            //设置播放权限时间，使用时需保证allow值为true
                            limitPlayTime: {allow: false, value: 180},//设置允许最大的快进时长，用于限制用户拖拽至不允许播放的时间点，使用时需保证allow值为true
                            setMaxPlayTime: {allow: false, value: 0},
                            isH5: true
                        }, function () {
                            var isIOS = comm.browser.versions.ios;
                            var ua = navigator.userAgent.toLowerCase();
                            var isAndroidChrome = /chrome\/[\d|.]+ mobile safari\/[\d|.]+$/g.test(ua);  //android手机chrome浏览器
                            if (isIOS || isAndroidChrome) {  //ios放出全屏（版本10以下playsinline无效，暂无解决方法）
                                $('.vjs-fullscreen-control').show().css('marginRight', '0');
                                $('.allinmd-time-elements').css({
                                    float: 'left',
                                    margin: "2px 0 0 0"
                                });
                            }
                        });
                        players[n].player.play();
                        comm.players.push(players[n]);
                        var _player = players[n].player;
                        $.each(comm.players, function (ix, plea) {
                            if (_player != plea.player) {
                                plea.player.pause();
                            }
                        });
                        return false;
                    } else {
                        var _link = $(this).parents('.al-commentContent').find('a').eq(1).attr('href');
                        if (/\/html\/m/g.test(_link)) {
                          g_sps.jump(null,_link);
                        }

                    }

                }
            });

            //...分享收藏
            $(".al-comment").off("click").on("click", '.ev-shareAndCollect', function (e) {
                e.stopPropagation();
                $(this).toggleClass('active');
                if ($(this).hasClass('active')) {
                    $(this).children().show();
                } else {
                    $(this).children().hide();
                }
                return false;
            });

            $('.ev-collect').off('click').on('click', function () {
                if ($(this).attr('data-state') == 0) {
                    $(this).attr('data-state', 1)
                    $(this).addClass('icon-commentCollected');
                } else {
                    $(this).attr('data-state', 0);
                    $(this).removeClass('icon-commentCollected');
                }

                social.collect({
                    customerId: localStorage.getItem('userId'),
                    refType: $(this).attr('data-refType'),
                    isCollect: $(this).attr('data-state') == 1 ? 1 : 0,
                    refId: $(this).attr('data-refId')
                })
                return false;
            });


            shareAll({
                noSelfInit: true,
                qShareLog: function (x, obj) {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        refUrl: obj.url,
                        shareSence: isFriendCircle ? 50 : (isSelf ? 51 : 52),    //朋友圈50，自己动态51，他人动态52
                        shareChannel: x == 'sina' ? 3 : 1,
                        shareContent: x == 'sina' ? obj.sinaTitle : obj.qzoneTitle,
                    });
                },
                fnMessageSuc: function (obj) {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        refUrl: obj.url,
                        shareSence: isFriendCircle ? 50 : (isSelf ? 51 : 52),
                        shareChannel: 4,
                        shareContent: obj.wxTitle ? obj.wxTitle : obj.title,
                    });
                }, //分享好友成功回调
                fnTimelineSuc: function (obj) {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        refUrl: obj.url,
                        shareSence: isFriendCircle ? 50 : (isSelf ? 51 : 52),
                        shareChannel: 5,
                        shareContent: obj.timeLineTitle ? obj.timeLineTitle : obj.title
                    });
                }, //分享朋友圈成功回调
                triggerCallback: function (e) {
                    function getTypeDesc(refType) {
                        var refTypeDesc = ''; //类型描述
                        switch (parseInt(refType)) {
                            case 1:
                                refTypeDesc = "视频";
                                break;
                            case 2:
                                refTypeDesc = "文库";
                                break;
                            case 4:
                                refTypeDesc = "话题";
                                break;
                            case 7:
                                refTypeDesc = "病例";
                                break;
                            case 8:
                                refTypeDesc = "评论";
                                break;
                            case 16:
                                refTypeDesc = "活动";
                                break;
                            default:
                                refTypeDesc = "活动";
                        }
                        return refTypeDesc;
                    }

                    var username = e.attr('data-username'), //当前资源人名称
                        parentId = parseInt(e.attr('data-parentId')), //用于判别父级是资源还是回复
                        parentUsername = e.attr('data-parentUsername'), //当前资源如果为评论时的父级名称
                        resourceType = e.attr("data-resourceType"), //资源类型
                        shareTitle = e.attr('data-title'),
                        shareContent = e.attr('data-desc'),
                        refType = parseInt(e.attr("data-refType")), //当前资源类型
                        opId = parseInt(e.attr("data-opId"));
                    //根据类型决定显示分享话术
                    var QQTitle = '', QQContent = '', WXTitle = '', WXContent = '', SinaTitle = '', SinaContent = '';
                    switch (refType) { //发布1247
                        case 1:
                        case 2:
                        case 4:
                        case 7:
                            if (opId == 2) {
                                username = parentUsername;
                            }
                            QQTitle = "[" + username + "]发布《" + shareTitle + "》";
                            QQContent = shareContent;
                            WXTitle = "[" + username + "]发布了[" + getTypeDesc(refType) + "]《" + shareTitle + "》";
                            WXContent = shareContent;
                            SinaTitle = "[" + username + "]发布了[" + getTypeDesc(refType) + "]《" + shareTitle + "》，点击查看：";
                            SinaContent = "[" + username + "]发布了[" + getTypeDesc(refType) + "]《" + shareTitle + "》，点击查看：";
                            break;
                        case 16: //活动
                            if (opId == 2) {//分享场景
                                content = "分享";
                            } else {
                                content = "参加";
                            }
                            QQTitle = '[' + username + ']' + content + '[' + shareTitle + ']';  //[参加者姓名]参加了"[活动title]"活动
                            QQContent = shareContent;
                            WXTitle = '[' + username + ']' + content + '了[' + shareTitle + ']活动';
                            WXContent = shareContent;
                            SinaTitle = '[' + username + ']' + content + '了[' + shareTitle + ']活动，点击查看活动详情：';
                            SinaContent = '[' + username + ']' + content + '了[' + shareTitle + ']活动，点击查看活动详情：';
                            break;
                        case 8:
                            if (parentId == 0) { //回复发布
                                if (opId == 2) {//分享场景
                                    QQTitle = '[' + username + ']发表了回复"' + shareContent + '"';
                                    QQContent = shareContent;
                                    WXTitle = '[' + username + ']发表了回复"' + shareContent + '"';
                                    WXContent = shareContent;
                                    SinaTitle = '[' + username + ']发表了回复"' + shareContent + '"，点击查看：';
                                    SinaContent = '[' + username + ']发表了回复"' + shareContent + '"，点击查看：';
                                } else {
                                    QQTitle = "[" + username + "]回复《" + shareTitle + "》";
                                    QQContent = shareContent;
                                    WXTitle = "[" + username + "]回复了[" + getTypeDesc(resourceType) + "]《" + shareTitle + "》";
                                    WXContent = shareContent;
                                    SinaTitle = "[" + username + "]回复了[" + getTypeDesc(resourceType) + "]《" + shareTitle + "》，点击查看：";
                                    SinaContent = "[" + username + "]回复了[" + getTypeDesc(resourceType) + "]《" + shareTitle + "》，点击查看：";
                                }

                            } else { //回复评论
                                if (opId == 2) {//分享场景
                                    QQTitle = '[' + username + ']发表了回复"' + parentUsername + '"';
                                    QQContent = shareContent;
                                    WXTitle = '[' + username + ']发表了回复"' + parentUsername + '"';
                                    WXContent = shareContent;
                                    SinaTitle = '[' + username + ']发表了回复"' + parentUsername + '"，点击查看：';
                                    SinaContent = '[' + username + ']发表了回复"' + parentUsername + '"，点击查看：';
                                } else {
                                    QQTitle = "[" + username + "]回复[" + parentUsername + "]";
                                    QQContent = shareContent;
                                    WXTitle = '[' + username + ']回复[' + parentUsername + ']"' + shareContent + '"';
                                    WXContent = shareContent;
                                    SinaTitle = '[' + username + ']回复[' + parentUsername + ']"' + shareContent + '"，点击查看：';
                                    SinaContent = '[' + username + ']回复[' + parentUsername + ']"' + shareContent + '"，点击查看：';
                                }
                            }
                            break; //parentId 0 [回复者姓名]回复了[资源类型]《title》 parentId !=0 [回复者姓名]回复[原回复作者]"回复内容"
                        default:
                    }

                    var reprintParams = {
                        "dataFlag": 2,
                        "attUseFlag": 3,
                        "refId": e.attr("data-refId"),
                        "trendsId": 0,
                        "logoUseFlag": 3,
                        "refCustomerId": e.attr("data-refCustomerId"),
                        "visitSiteId": "2",
                        "reprintType": e.attr("data-refType")
                    };
                    if (location.href.indexOf('circle') !== -1) { //朋友圈
                        return {
                            title: shareTitle,
                            url: e.attr('data-url'), //不传默认取当前地址
                            pic: e.attr('data-pic'), //分享图片
                            // trendUrl:M_CALL+"customer/reprint/create/",//分享动态的请求连接  //不需要动态分享就不传
                            noPJ: 0, //0：分享动态给后台的参数需要转为paramJson ,1:不需要
                            data: reprintParams, //分享动态传给后台的参数
                            wxTitle: WXTitle, //微信分享标题
                            wxDesc: WXContent, //微信分享描述
                            timeLineTitle: WXTitle,
                            sinaTitle: SinaTitle, //新浪title
                            desc: SinaContent, //新浪的描述
                            qzoneTitle: QQTitle, //qq空间title
                            summary: QQContent, //qq空间的描述
                        };
                    } else {
                        return {
                            title: shareTitle,
                            url: e.attr('data-url'), //不传默认取当前地址
                            pic: e.attr('data-pic'), //分享图片
                            trendUrl: M_CALL + "customer/reprint/create/",//分享动态的请求连接  //不需要动态分享就不传
                            noPJ: 0, //0：分享动态给后台的参数需要转为paramJson ,1:不需要
                            data: reprintParams, //分享动态传给后台的参数
                            wxTitle: WXTitle, //微信分享标题
                            wxDesc: WXContent, //微信分享描述
                            timeLineTitle: WXTitle,
                            sinaTitle: SinaTitle, //新浪title
                            desc: SinaContent, //新浪的描述
                            qzoneTitle: QQTitle, //qq空间title
                            summary: QQContent, //qq空间的描述
                        };
                    }
                }
            }, false, $(".ev-share"));

        }

        function AjaxAdapter(data) {
            var kv = {};
            var trends = data.customer_trends;
            switch (data.customer_trends_type) {
                case 1://视频
                    kv = {
                        refType: 1,
                        opId: trends.opId,
                        id: trends.resourceId,
                        username: data.customer_auth.lastName + data.customer_auth.firstName,
                        logoUrl: data.customer_att.logoUrl,
                        customerId: data.customer_auth.customerId,
                        publishTime: trends.opDate !== '' ? comm.date.diffDay_one(trends.opDate, comm.date.local_time()) : '',
                        content: htmlToString(trends.resourceName).replace(/&lt;br\/&gt;/g, '<br/>'),
                        refUrl: trends.resourceUrl,
                        refId: trends.resourceId,
                        refCustomerId: trends.customerId,
                        resourceType: 1,
                        refName: htmlToString(trends.resourceName),
                        preferNum: data.resource_valid.preferUpNum ? data.resource_valid.preferUpNum.toWK() : data.resource_valid.preferUpNum,
                        reviewNum: data.resource_valid.reviewNum ? data.resource_valid.reviewNum.toWK() : data.resource_valid.reviewNum,
                        preferState: data.customer_prefer.isValid,
                        collectState: data.customer_collection.isValid,
                        quoteType: '',
                        refQuoteName: '',
                        quoteUrl: '',
                        attachment_Arr: [],
                        videoSrcUrl: getValue(data.cms_video_attachment, 'videoAttUrl'),
                        videoState: getValue(data.cms_video_attachment, 'qiniuStatus'),
                        videoLogoUrl: getValue(data.cms_video_attachment, 'videoAttUrl') == '' || data.cms_video_attachment_logo.videoAttUrl,
                        playTime: getValue(data.cms_video_attachment, 'playTime') || data.resource_valid.playTime,
                        parentUsername: data.parent_customer_auth.lastName + data.parent_customer_auth.firstName,
                        parentContent: '',
                        parentRefUrl: '',
                        trendsValid: trends.isValid, //是否有效（0-无效;1-有效；2-系统屏蔽；3-用户删除)' 代表的是资源的1247的状态,
                    }
                    break;
                case 2://文库
                    kv = {
                        refType: 2,
                        opId: trends.opId,
                        id: trends.resourceId,
                        refCustomerId: trends.customerId,
                        username: data.customer_auth.lastName + data.customer_auth.firstName,
                        logoUrl: data.customer_att.logoUrl,
                        customerId: data.customer_auth.customerId,
                        publishTime: trends.opDate !== '' ? comm.date.diffDay_one(trends.opDate, comm.date.local_time()) : '',
                        content: htmlToString(trends.resourceName).replace(/&lt;br\/&gt;/g, '<br/>'),
                        refUrl: trends.resourceUrl,
                        refId: trends.resourceId,
                        resourceType: 2,
                        refName: htmlToString(trends.resourceName),
                        preferNum: data.resource_valid.preferUpNum ? data.resource_valid.preferUpNum.toWK() : data.resource_valid.preferUpNum,
                        reviewNum: data.resource_valid.reviewNum ? data.resource_valid.reviewNum.toWK() : data.resource_valid.reviewNum,
                        preferState: data.customer_prefer.isValid,
                        collectState: data.customer_collection.isValid,
                        quoteType: '',
                        refQuoteName: '',
                        quoteUrl: '',
                        attachment_Arr: data.cms_doc_attachment_logo.docAttUrl,
                        videoSrcUrl: '',
                        videoState: '',
                        videoLogoUrl: '',
                        playTime: '',
                        parentUsername: data.parent_customer_auth.lastName + data.parent_customer_auth.firstName,
                        parentContent: '',
                        parentRefUrl: '',
                        trendsValid: trends.isValid,
                        tplPath: data.resource_valid.tpl_Path
                    }
                    break;
                case 4://话题
                    kv = {
                        refType: 4,
                        opId: trends.opId,
                        id: trends.resourceId,
                        refCustomerId: trends.customerId,
                        username: data.customer_auth.lastName + data.customer_auth.firstName,
                        logoUrl: data.customer_att.logoUrl,
                        customerId: data.customer_auth.customerId,
                        publishTime: trends.opDate !== '' ? comm.date.diffDay_one(trends.opDate, comm.date.local_time()) : '',
                        content: trends.resourceName == '' ? htmlToString(trends.trendContent).replace(/&lt;br\/&gt;/g, '<br/>') : htmlToString(trends.resourceName),
                        refUrl: trends.resourceUrl,
                        refId: trends.resourceId,
                        resourceType: 4,
                        refName: htmlToString(trends.resourceName),
                        preferNum: data.resource_valid.preferUpNum ? data.resource_valid.preferUpNum.toWK() : data.resource_valid.preferUpNum,
                        reviewNum: data.resource_valid.reviewNum ? data.resource_valid.reviewNum.toWK() : data.resource_valid.reviewNum,
                        preferState: data.customer_prefer.isValid,
                        collectState: data.customer_collection.isValid,
                        quoteType: '',
                        refQuoteName: '',
                        quoteUrl: '',
                        attachment_Arr: data.cms_topic_attachment,
                        videoSrcUrl: getValue(data.cms_topic_video, 'attUrl'),
                        videoState: getValue(data.cms_topic_video, 'qiniuStatus'),
                        videoLogoUrl: getValue(data.cms_topic_video, 'logoUrl'),
                        playTime: getValue(data.cms_topic_video, 'playTime'),
                        parentUsername: data.parent_customer_auth.lastName + data.parent_customer_auth.firstName,
                        parentContent: '',
                        parentRefUrl: '',
                        trendsValid: trends.isValid
                    }
                    break;
                case 7://病例
                    kv = {
                        refType: 7,
                        opId: trends.opId,
                        id: trends.resourceId,
                        refCustomerId: trends.customerId,
                        username: data.customer_auth.lastName + data.customer_auth.firstName,
                        logoUrl: data.customer_att.logoUrl,
                        customerId: data.customer_auth.customerId,
                        publishTime: trends.opDate !== '' ? comm.date.diffDay_one(trends.opDate, comm.date.local_time()) : '',
                        content: htmlToString(trends.resourceName).replace(/&lt;br\/&gt;/g, '<br/>'),
                        refUrl: trends.resourceUrl,
                        refId: trends.resourceId,
                        resourceType: 7,
                        refName: htmlToString(trends.resourceName),
                        preferNum: data.resource_valid.preferUpNum ? data.resource_valid.preferUpNum.toWK() : data.resource_valid.preferUpNum,
                        reviewNum: data.resource_valid.reviewNum ? data.resource_valid.reviewNum.toWK() : data.resource_valid.reviewNum,
                        preferState: data.customer_prefer.isValid,
                        collectState: data.customer_collection.isValid,
                        quoteType: '',
                        refQuoteName: '',
                        quoteUrl: '',
                        attachment_Arr: data.case_attachment_list,
                        videoSrcUrl: getValue(data.case_video_list, 'attUrl'),
                        videoState: getValue(data.case_video_list, 'qiniuStatus'),
                        videoLogoUrl: getValue(data.case_video_list, 'logoUrl'),
                        playTime: getValue(data.case_video_list, 'playTime'),
                        parentUsername: data.parent_customer_auth.lastName + data.parent_customer_auth.firstName,
                        parentContent: '',
                        parentRefUrl: '',
                        trendsValid: trends.isValid
                    }
                    break;
                case 16:
                    kv = {
                        refType: 16,
                        opId: trends.opId,
                        id: trends.resourceId,
                        refCustomerId: trends.customerId,
                        username: data.customer_auth.lastName + data.customer_auth.firstName,
                        logoUrl: data.customer_att.logoUrl,
                        customerId: data.customer_auth.customerId,
                        publishTime: trends.opDate !== '' ? comm.date.diffDay_one(trends.opDate, comm.date.local_time()) : '',
                        content: trends.resourceName,
                        refUrl: trends.resourceUrl,
                        refId: trends.resourceId,
                        resourceType: 7,
                        refName: htmlToString(trends.resourceName),
                        preferNum: data.resource_valid.preferUpNum ? data.resource_valid.preferUpNum.toWK() : data.resource_valid.preferUpNum,
                        reviewNum: data.resource_valid.reviewNum ? data.resource_valid.reviewNum.toWK() : data.resource_valid.reviewNum,
                        preferState: data.customer_prefer.isValid,
                        collectState: data.customer_collection.isValid,
                        quoteType: '',
                        refQuoteName: '',
                        quoteUrl: '',
                        attachment_Arr: data.case_attachment_list,
                        videoSrcUrl: getValue(data.case_video_list, 'attUrl'),
                        videoState: getValue(data.case_video_list, 'qiniuStatus'),
                        videoLogoUrl: getValue(data.case_video_list, 'attLogoUrl'),
                        playTime: getValue(data.case_video_list, 'playTime'),
                        parentUsername: '',
                        parentContent: '',
                        parentRefUrl: '',
                        activity: data.activity, //活动具体数据
                        trendsValid: trends.isValid
                    }
                    break;

                case 8://评论
                    kv = {
                        opId: trends.opId,
                        refType: 8,
                        id: trends.citeId,
                        username: data.customer_auth.lastName + data.customer_auth.firstName,
                        logoUrl: data.customer_att.logoUrl,
                        customerId: data.customer_auth.customerId,
                        publishTime: trends.opDate !== '' ? comm.date.diffDay_one(trends.opDate, comm.date.local_time()) : '',
                        content: htmlToString(trends.trendContent).replace(/&lt;br\/&gt;/g, '<br/>'),
                        refId: trends.resourceId,
                        refUrl: trends.resourceUrl,
                        refCustomerId: trends.customerId,
                        resourceType: trends.resourceType,
                        refName: htmlToString(trends.resourceName),
                        preferNum: trends.upNum ? trends.upNum.toWK() : trends.upNum,
                        reviewNum: trends.reviewNum ? trends.reviewNum.toWK() : trends.reviewNum,
                        preferState: data.customer_prefer.isValid,
                        collectState: data.customer_collection.isValid,
                        quoteType: getValue(data.customer_quote, 'refQuoteType'),
                        refQuoteName: getValue(data.customer_quote, 'refQuoteName')?htmlToString(getValue(data.customer_quote, 'refQuoteName').cutString(26)):'',
                        quoteUrl: getValue(data.customer_quote, 'web_storage_path'),
                        attachment_Arr: data.customer_review_attachment_list,
                        videoSrcUrl: getValue(data.customer_review_video_list, 'attUrl'),
                        videoState: getValue(data.customer_review_video_list, 'qiniuStatus'),
                        videoLogoUrl: getValue(data.customer_review_video_list, 'attLogoUrl'),
                        playTime: getValue(data.customer_review_video_list, 'playTime'),
                        parentId: data.parent_customer_review.id,
                        parentUsername: (function (data) {
                            //if(data.customer_trends.parentCiteId!=0){
                            //    return data.parent_customer_review.reviewContent;
                            //}else{
                            return data.parent_customer_auth.lastName + data.parent_customer_auth.firstName;
                            //}
                            //data.parent_customer_review.refUrlWap == '' ? '' : data.parent_customer_auth ? data.parent_customer_auth.lastName + data.parent_customer_auth.firstName : '',
                        })(data),
                        parentContent: htmlToString((function (data) {
                            if (/friends_circle/.test(window.location.href)) {
                                if (data.customer_review.parentId != 0) {
                                    return convertVideoWord(data.parent_customer_review.reviewContent);
                                } else {
                                    return data.customer_trends.resourceName;
                                }
                            } else {
                                if (data.customer_review.parentId != 0) {
                                    return convertVideoWord(data.parent_customer_review.reviewContent);
                                } else {
                                    return convertVideoWord(data.customer_review.reviewContent);
                                }
                            }
                            //if (data.customer_trends.parentCiteId != 0) {
                            //if (data.customer_review.parentId != 0) {
                            //
                            //    //return data.parent_customer_review.reviewContent;
                            //    return data.customer_trends.resourceName;
                            //} else {
                            //    //return data.customer_trends.resourceName;
                            //    return data.customer_review.reviewContent;
                            //}
                        })(data)).replace(/&lt;br\/&gt;/g, '<br/>'),
                        parentRefUrl: data.parent_customer_review.refUrlWap == '' ? 'javascript:;' : data.parent_customer_review.refUrlWap,
                        trendsValid: trends.isValid,
                        tplPath: data.resource_valid.tpl_Path
                    }
                    break;
                case 17:
                    kv = {refType: 17};
                    break;
                case 18:
                    kv = {
                        refType: 18
                    };
                    break;
                default:
            }
            kv.resourceIsValid = parseInt(data.resource_valid.resourceValid); //0被系统屏蔽 1有效 3用户删除
            return kv;
        }

        function convertVideoWord(str) { //转成【影像】文字
            if (/\[影像\]/.test(str) || str == "") {
                return '【影像】';
            } else {
                return str;
            }
        }

        function getValue(kv, props) { //有时候不存在，有时候是空数组...
            if (!kv) {
                return ''
            }
            if (kv.length === 0) {
                return ''
            }
            ;
            return kv[0][props];
        }

        function AjaxResult(data) {
            if (data && data.responseObject.responseStatus && data.responseObject.responseData.data_list) {
                return data.responseObject.responseData;
            }
            return false;
        }

        function ohterWaterfall() { //瀑布流
            $(".ev-list").scrollPagination({
                'contentPage': url,
                'contentData': {
                    customerId: getpara().cid,
                    dataFlag: dataFlag,
                    logoUseFlag: 3,
                    attUseFlag: 2,
                    visitSiteId: 2,
                    scene: 2,
                    pageIndex: function () {
                        index = index + 1;
                        if (params.paramJson) {
                            params = JSON.parse(params.paramJson);
                        }
                        params.pageIndex = params.pageIndex + 1;
                        return params.pageIndex;
                    },
                    pageSize: 20
                },
                'scrollTarget': $(window),
                'heightOffset': 60,
                'delaytime': 0,
                'beforeLoad': function () {
                    comm.loading.show();
                },
                'afterLoad': function (elementsLoaded) {
                    comm.loading.hide();
                },
                'loader': function (data) {
                    dataList(data);
                    replaceALink()
                }
            });
        }

        function waterfall() { //瀑布流
            $(".ev-list").scrollPagination({
                'contentPage': url,
                'contentData': {
                    customerId: uid,
                    sessionCustomerId: uid,
                    dataFlag: dataFlag,
                    logoUseFlag: 3,
                    attUseFlag: 2,
                    visitSiteId: 2,
                    scene: 2,
                    pageIndex: function () {
                        index = index + 1;
                        if (params.paramJson) {
                            params = JSON.parse(params.paramJson);
                        }
                        params.pageIndex = params.pageIndex + 1;
                        return params.pageIndex;
                    },
                    pageSize: 20
                },
                'scrollTarget': $(window),
                'heightOffset': 60,//为0时候，不触发加载，$('.al-footBar')的高度为58，大概设为60，有时没有footbar所以无法使用它的高度，如朋友圈 sunhaibin
                'delaytime': 0,
                'type': "POST",
                'beforeLoad': function () {
                    comm.loading.show();
                },
                'afterLoad': function (elementsLoaded) {
                    comm.loading.hide();
                },
                'loader': function (data) {
                    dataList(data);
                    replaceALink()
                }
            });
        }

    });
});