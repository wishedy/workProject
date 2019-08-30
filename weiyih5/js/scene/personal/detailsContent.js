$.getScript(window.paasFilePathObj.js,function() {
//上下文
    //Log.createBrowse(12, '评论内容页');
    var templateDiscuss = {
        reviewList: function (kv, scene) {
            //if(kv.content !='' && kv.content.indexOf("</a>")>0){
            //    var result=[];
            //    var tempArr= kv.content.match(/(<a(.)*)(.|\r\n|\n)*?<\/a>/gi).join("").split("><");
            //    for(var x= 0,len=tempArr.length;x<len;x++){
            //        if(len-1==x){
            //            result.push("<i "+tempArr[x].substr(0,tempArr[x].length-4)+"</i>");
            //        }else{
            //            result.push("<i "+tempArr[x].substr(2,tempArr[x].length-5)+"</i>");
            //        }
            //    }
            //    result= kv.content.substr(0,kv.content.indexOf("<a"))+result.join("");
            //    kv.content= result;
            //}
            kv.content = kv.content.replace(/<(\/*?[b-z].*?)>/g, "&lt;$1&gt;").replace(/&lt;br\/&gt;/g, '<br/>').replace(/@@/g, "@").replace(/href=/g, "style='color:#2899e6;' href=/pages/personal/others_contribution.html?cid=");

            return '<article class="al-timelineContentItem">' +
                '<figure class="al-timelineUserImg">' +
                '<a href="'+(kv.customerId&&kv.customerId!=0?'/pages/personal/others_contribution.html?cid='+ kv.customerId:'javascript:;')+'">' +
                '<img src="' + kv.logoUrl + '" alt="">' +
                '</a>' +
                '</figure>' +
                '<article class="al-timelineContentTextBox">' +
                '<header class="al-timelineContentAuthor">' +
                '<a href="'+(kv.customerId&&kv.customerId!=0?'/pages/personal/others_contribution.html?cid='+ kv.customerId:'javascript:;')+'">' + comm.getStrByteLen(kv.username, 20) + '<i class="al-vipUser"></i><p class="al-timelineTime">' + kv.publishTime + '</p></a>' +
                '<span>' + kv.company + '</span>' +
                '</header>' +
                '<article class="al-timelineContentText">' +
                '<a href="javascript:void(0)">' + kv.parentUsername + '</a><p>' + kv.content + '</p>' +
                this.videoH(kv) +
                this.picH(kv) +
                this.quoteH(kv) +
                '</article>' +
                '</article>' +
                '</article>';
        },
        timeLine: function (height) {
            return '<i class="al-timeline" style="height:' + height + 'px;"></i>';
        },
        picH: function (kv) {
            var imgs = kv.imgsListArr;
            if (imgs.length === 0) return '';

            var imgH = '';
            for (var x = 0, len = imgs.length; x < len; x++) {
                if (len < 7) {
                    imgH += '<figure class="al-timelineImg"><img src="' + imgs[x].attUrl + '" attWidth=' + imgs[x].originalAttWidth + ' attHeight=' + imgs[x].originalAttHeight + ' alt=""></figure>';
                }
                if (len > 6 && x < 5) {
                    imgH += '<figure class="al-timelineImg"><img src="' + imgs[x].attUrl + '" attWidth=' + imgs[x].originalAttWidth + ' attHeight=' + imgs[x].originalAttHeight + ' alt=""></figure>';
                } else if (len > 6 && x == 5) {
                    imgH += '<figure class="al-timelineImg">' +
                        '<img src="' + imgs[x].attUrl + '" attWidth=' + imgs[x].originalAttWidth + ' attHeight=' + imgs[x].originalAttHeight + ' alt="">' +
                        '<figure class="al-moreImgMask">' +
                        '<p>还有<span>' + (len - 6) + '</span>张<i class="icon-detailsArrow"></i></p>' +
                        '</figure>' +
                        '</figure>';
                } else if (x > 5) {
                    imgH += '<figure class="al-timelineImg" style="display: none"><img src="' + imgs[x].attUrl + '" alt=""></figure>';
                }

            }

            return '<section class="al-timelineImgBox ev-picList">' + imgH + '</section>';
        },
        quoteH: function (kv) {
            if (!kv.quoteUrl) return '';

            var word = "", html = '<a href="' + kv.quoteUrl + '">《<span>' + kv.refQuoteName + '</span>》</a>';
            switch (kv.quoteType) {
                case 1:
                    word = "视频";
                    break;
                case 2:
                    word = "文库";
                    break;
                case 4:
                    word = "话题";
                    break;
                case 7:
                    word = "病例";
                    break;
                default:
                    word = "评论";
                    html = '<a href="' + kv.quoteUrl + '"><span>' + kv.refQuoteName + '</span></a>';
            }
            return '<p class="al-commentContentQuote">引用' + word + '：' + html + '</p>';
        },
        videoH: function (kv) {
            if (!kv.videoLogoUrl)
                return '';
            return '<figure class="al-commentContentVideo ev-video" data-videoSrc="' + kv.videoSrcUrl + '" style="width: 4.8rem;height: 3.2rem;">' +
                '<img class="al-commentContentVideoImg" src="' + kv.videoLogoUrl + '" alt="视频缩略图" />' +
                '<i class="al-commentContentVideoBtn"><img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt=""></i>' +
                '<span class="al-commentContentVideoTime">' + kv.playTime + '</span>' +
                '</figure>';
        },
        social: function (kv) { //社交部分
            return '<footer class="al-timelineFooter">' +
                '<article class="al-timelineFooterBtn ev-review" data-refCustomerId="' + kv.refCustomerId + '" data-reviewId="' + kv.reviewId + '" data-username="' + kv.username + '" data-refType="' + kv.refType + '" data-parentId="' + kv.reviewId + '">' +
                '<i class="icon-detailsComment"></i><span>' + kv.reviewNum + '</span>' +
                '</article>' +
                '<article class="al-timelineFooterBtn ' + (kv.collectState == 1 ? 'al-timelineContentCollected' : '') + ' ev-collect"  data-collectState="' + kv.collectState + '" data-customerId="' + kv.customerId + '" data-reviewId="' + kv.reviewId + '">' +
                '<i class="icon-detailsCollect"></i><span class="ev-collectNum">' + kv.collectNum + '</span>' +
                '</article>' +
                '<article class="al-timelineFooterBtn al-timelineShareBtn ev-reprint" reprint-refCustomerId="' + kv.customerId + '" reprint-refId="' + kv.reviewId + '" data-pic="' + kv.logoUrl + '" data-desc="' + $("<p>" + kv.content + "</p>").text() + '" >' +
                '<i class="icon-detailsShare"></i><span>' + kv.reprintNum + '</span>' +
                '</article>' +
                '<article class="al-timelineFooterBtn ' + (kv.preferState == 1 ? 'al-timelineContentLiked' : '') + ' ev-prefer" data-reviewId="' + kv.reviewId + '" data-preferState="' + kv.preferState + '" data-customerId="' + kv.customerId + '">' +
                '<i class="icon-detailsLike"></i><span class="ev-preferNum">' + kv.upNum + '</span>' +
                '</article>' +
                '</footer>';
        }
    }

    $(function () {
        var para = comm.getparaNew();
        var refId = para.refId;
        var refType = para.refType;
        var reviewId = para.reviewId;
        var amChannel = comm.getpara()._amChannel;
        var callAppOptions = {
            ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=8&sourceId=" + refId + "&replyId=" + reviewId + "&resourceType=" + refType + (amChannel?"&_amChannel="+amChannel:''),
            android: "allin://com.allin.social:75235?data={scene:3,type:8,sourceId:" + refId + ",replyId:" + reviewId + ",resourceType:" + refType + (amChannel?",_amChannel:"+amChannel:'')+ "}",
            ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=8&sourceId=" + refId + "&replyId=" + reviewId + "&resourceType=" + refType + (amChannel?"&_amChannel="+amChannel:''),
            runAtOnce: false
        };
        //comm.recognizeAppShareLink(callAppOptions);//app分享的页面强打开app
        comm.appWakeUp("btn", callAppOptions);//下载app层
        if (getpara().state != 'delete') {
            sessionStorage.setItem('details_fromPage', document.referrer);
        }
        //后退
        $('.ev-goBack').on('click', function () {
            if (getpara().state == 'delete') {
                var fromPage = sessionStorage.getItem('details_fromPage');
                if (!fromPage) {
                  g_sps.jump(null,getpara().refUrl);
                } else {
                  g_sps.jump(null,sessionStorage.getItem('details_fromPage'));
                }

            } else {
                //window.location.href= document.referrer;
                history.back();
            }
        });

        //更换标题
        var _refName = getpara().refName.replace(/@\+@/g, "%");//标题中有% getpara会报错，%用@+@替换下，再换回来
        var updateTitle = _refName.substring(_refName.indexOf("《") + 1, _refName.lastIndexOf("》"));
        $(".ev-title").html('<a href=' + getpara().refUrl + '>《' + (updateTitle != '' ? updateTitle.cutString(24) : _refName.cutString(24)) + '》</a>');

        //是否关注过 是自己资源时
        $.ajax({
            url: M_CALL + 'customer/follow/resource/info/',
            data: {
                paramJson: $.toJSON({
                    refId: getpara().refId,
                    followType: getpara().refType,
                    customerId: localStorage.getItem("userId")!=null?localStorage.getItem("userId"):""
                })
            },
            type: 'POST',
            success: function (data) {
                if (data && data.responseObject.responseStatus && data.responseObject.responseData.data_list[0].relationShip == 0) {
                    var refCustomerId = data.responseObject.responseData.data_list[0].customer_follow_resource.customerId;
                    if (refCustomerId == localStorage.getItem('userId')) {
                        $('.ev-follow').hide();
                    } else {
                        $('.ev-follow').show();
                    }
                    $(".ev-follow").on('click', function () { //关注资源
                        $.ajax({
                            url: M_CALL + 'customer/follow/resource/create/',
                            data: {paramJson: $.toJSON({refId: getpara().refId, dataFlag: 2, followType: 7})},
                            type: 'POST',
                            success: function (data) {
                                popup('已成功关注');
                                $(".ev-follow").hide();
                            }
                        })
                    });
                }
            }
        });

        if (getpara().state == "delete") {
            $(".ev-deleteShow").remove();
        } else {
            $(".ev-deleteShow").on("click", function () {
                if ($(this).hasClass('active')) {
                    $(this).children().hide();
                } else {
                    $(this).children().show();
                }
                $(this).toggleClass('active');
            });
        }

        var $evList = $(".ev-list");

        var urlParams = getpara();
        if (!urlParams || !urlParams.reviewId || !urlParams.refId) {
          g_sps.jump(null,'/');
        }

        var upHtml = dataList(ajaxAsyncHandle("up"), "up");
        var downHtml = dataList(ajaxAsyncHandle("down"), "down");

        upHtmlLoad(upHtml);
        downHtmlLoad(downHtml);
        imgWidth();
        sub_Fns();
//新增图片尺寸处理
        function imgWidth() {
            var ulWidth = $('.al-timelineImgBox').width();
            var liWidth = parseInt((ulWidth - 18) / 3);
            $('.al-timelineImgBox').each(function (ind, elem) {
                $(elem).find('.al-timelineImg').each(function (index, element) {
                    $(element).width(liWidth);
                    $(element).height(liWidth);
                    var marginWidth = Math.floor((ulWidth - liWidth * 3) / 2 - 1);
                    if (index % 3 != 2) {
                        $(element).css({marginRight: marginWidth});
                    } else {
                        $(element).css({marginRight: 0});
                    }
                })
            });
        }

        function dialogLine() {
            var listCountHeight = $evList.outerHeight();
            var listLen = $evList.children().length;
            var lastItemHeight = $($evList.children()[listLen - 1]).outerHeight();
            $evList.before(templateDiscuss.timeLine(listCountHeight - lastItemHeight));
        }

        function upHtmlLoad(html_Arr) {
            if(!html_Arr){
                return ;
            }
            var socialHtml = html_Arr.pop();
            $evList.html(html_Arr);
            dialogLine();
            if (getpara().state != "delete") {
                $evList.parent().after(socialHtml);
            }
        }

        function downHtmlLoad(html) {
            if (!html) {
                return false;
            }
            $evList.parents(".ev-upStairs").after('<section class="ev-downStairs al-timelineContent al-replayComment"></section>');
            $(".ev-downStairs").html(html);
        }

        function dataList(data, scene) {
            var result = isExistData(data);
            if (!result) {
                return false;
            }

            var html = [];
            if (scene == "up") {
                for (var x = 0; x < result.length; x++) {
                    html.push(templateDiscuss.reviewList(AjaxAdapter(result[x], scene)));
                }

                //是否显示...删除
                var lastRs = AjaxAdapter(result[result.length - 1]);
                if (localStorage.userId == lastRs.customerId) {
                    $(".ev-deleteShow").show();

                    //删除
                    $(".ev-delete").on('click', function () {
                        // 删除评论
                        $.ajax({
                            url: M_CALL + 'customer/review/delete/',
                            data: {
                                paramJson: $.toJSON({id: getpara().reviewId, reviewStatus: 3})
                            },
                            success: function (data) {
                              g_sps.jump(null,location.href + '&state=delete');
                            }
                        });
                    });
                }

                html.push(templateDiscuss.social(lastRs, scene));
            } else {
                for (var x = 0; x < result.length; x++) {
                    html += templateDiscuss.reviewList(AjaxAdapter(result[x], scene));
                }
            }
            return html;
        }

        function ajaxAsyncHandle(scene) {
            var result = {};
            var params = {};
            if (scene == "up") {
                params = {
                    dataFlag: 3, useFlag: 1, attUseFlag: 3, logoUseFlag: 3, scene: 2, pageIndex: 1, pageSize: 100,
                    refId: urlParams.refId, currentReviewId: urlParams.reviewId,
                };
            } else {
                params = {
                    dataFlag: 3,
                    useFlag: 1,
                    attUseFlag: 3,
                    logoUseFlag: 3,
                    sortType: 1,
                    scene: 2,
                    isCurrentRow: 0,
                    pageIndex: 1,
                    pageSize: 100,
                    refId: urlParams.refId,
                    parentId: urlParams.reviewId
                }
            }

            $.ajax({
                url: M_CALL + 'customer/review/json_list/',
                data: params,
                type: 'POST',
                async: false,
                success: function (data) {
                    result = data;
                }
            });
            return result;
        }

        function sub_Fns() {
            //$(".ev-list").find('.ev-picList figure').on('click', function(){
            //    $('.video-js, video').css('opacity',0);
            //    $(this).picShowComment({
            //        open: $(this).index(),
            //        showVideo:function(){
            //            $('.video-js, video').css('opacity',1);
            //        }
            //    });
            //    Log.createBrowse(188,'点击大图');
            //});
            bigPicShow.init({
                domIdList: [".al-timelineImgBox"],//指定多个class|| ID
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

            $(".ev-list").find('.ev-video').on('click', function () {
                if ($(this).find('video').length == 0) {

                    //var videoHtml= "<video controls src='"+$(this).attr('data-videoSrc')+"' style='width:4.8rem;height: 3.2rem;top:0;left:0;background: #000;'></video>";
                    //$(this).append(videoHtml).find('video')[0].play();
                    var _w = $(this).find('img').eq(0).width();
                    var _h = $(this).find('img').eq(0).height();
                    var poster = $(this).find('img').eq(0).attr('src');
                    var n = $('video').length + 2;
                    var videoItem = ' <video id="CKa' + n + '" class="video-js vjs-default-skin vjs-no-flex vjs-big-play-centered">' +
                        '  <source src="' + $(this).attr('data-videoSrc') + '">' +
                        '  </video>';
                    $(this).children().hide();//width:100% HEIGHT:312PX;
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
                }
            });

            $(".ev-prefer").on('click', function () {
                // 厂商未认证去认证
                if(TempCache.getItem("customerRole") === "14"){
                    // 审核与二次认证
                    if(user.getRenZhengInfo().state === 0 || user.getRenZhengInfo().state === 1){
                        comm.alertBox({
                            "title":"认证资料审核将在1-3个工作日内完成，请耐心等待 ",
                            "ensure":"知道了",
                        });
                    }else{
                        // 厂商未认证时,直接去APP认证,认证后可以看
                        var androidParam = "{}";
                        var iosParam = "";
                        comm.newReleaseBox({
                            imgPath:"/images/img50/case/release.png",
                            title:"厂商认证需使用唯医骨科App",
                            solidBtnTitile:"立即使用",
                            authNoneTitle:"暂不使用",
                            data:{
                                el: ".solidBtn",
                                ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                                ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                                android: "allin://com.allin.social:75235?data="+androidParam
                            }
                        });
                    }
                }else {
                    var self = this;
                    user.privExecute({
                        operateType: 'auth',   //'login','auth','conference'
                        callback: function () {
                            if ($(self).attr('data-preferState') == 0) {
                                $(self).attr('data-preferState', 1)
                                $(self).addClass('al-timelineContentLiked');
                                $(self).find(".ev-preferNum").text(parseInt($(self).find(".ev-preferNum").text()) + 1);
                            } else {
                                $(self).attr('data-preferState', 0);
                                $(self).removeClass('al-timelineContentLiked');
                                var num = parseInt($(self).find(".ev-preferNum").text()) - 1;
                                $(self).find(".ev-preferNum").text(num > -1 ? num : 0);
                            }

                            social.prefer({
                                customerId: localStorage.getItem('userId'), //$(this).attr('data-customerId'), 当前资源人id
                                usefulType: 8,
                                upDownType: $(self).attr('data-preferState') == 1 ? 1 : 0,
                                refId: $(self).attr('data-reviewId')
                            });
                        }
                    });
                }
            });

            $(".ev-collect").on('click', function () {
                // 厂商未认证去认证
                if(TempCache.getItem("customerRole") === "14"){
                    // 审核与二次认证
                    if(user.getRenZhengInfo().state === 0 || user.getRenZhengInfo().state === 1){
                        comm.alertBox({
                            "title":"认证资料审核将在1-3个工作日内完成，请耐心等待 ",
                            "ensure":"知道了",
                        });
                    }else{
                        // 厂商未认证时,直接去APP认证,认证后可以看
                        var androidParam = "{}";
                        var iosParam = "";
                        comm.newReleaseBox({
                            imgPath:"/images/img50/case/release.png",
                            title:"厂商认证需使用唯医骨科App",
                            solidBtnTitile:"立即使用",
                            authNoneTitle:"暂不使用",
                            data:{
                                el: ".solidBtn",
                                ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                                ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                                android: "allin://com.allin.social:75235?data="+androidParam
                            }
                        });
                    }
                }else {
                    var self = this;
                    user.privExecute({
                        operateType: 'auth',   //'login','auth','conference'
                        callback: function () {
                            if ($(self).attr('data-collectState') == 0) {
                                $(self).attr('data-collectState', 1)
                                $(self).addClass('al-timelineContentCollected');
                                $(self).find(".ev-collectNum").text(parseInt($(self).find(".ev-collectNum").text()) + 1);
                            } else {
                                $(self).attr('data-collectState', 0);
                                $(self).removeClass('al-timelineContentCollected');
                                var num = parseInt($(this).find(".ev-collectNum").text()) - 1;
                                $(self).find(".ev-collectNum").text(num > -1 ? num : 0);
                            }

                            social.collect({
                                customerId: localStorage.getItem('userId'), //$(this).attr("data-customerId")指的是这条资源的作者id
                                refType: 8,
                                isCollect: $(self).attr('data-collectState') == 1 ? 1 : 0,
                                refId: $(self).attr('data-reviewId')
                            })
                        }
                    });
                }
            });

            //$(".ev-reprint").on('click', function(){
            var refTitle = getpara().refName.replace(/@\+@/g, "%");
            var refUrl = getpara().refUrl;

            var reprintParams = {
                "dataFlag": 2,
                "attUseFlag": 3,
                "refId": $("[reprint-refId]").attr("reprint-refId"), //
                "trendsId": 0,
                "logoUseFlag": 3,
                "refCustomerId": $("[reprint-refCustomerId]").attr("reprint-refCustomerId"),
                "pageIndex": 1,
                "pageSize": 7,
                "reprintType": 8
            };

            shareAll({
                title: refTitle,
                url: refUrl,//不传默认取当前地址
                pic: $(".ev-reprint").attr('data-pic'),//分享图片
                trendUrl: M_CALL + "customer/reprint/create/",//分享动态的请求连接  //不需要动态分享就不传
                noPJ: 0,//0：分享动态给后台的参数需要转为paramJson ,1:不需要
                data: reprintParams,//分享动态传给后台的参数
                callback: function () {
                },//分享动态后成功后的回调函数
                wxTitle: refTitle,//微信分享标题
                wxDesc: $(".ev-reprint").attr('data-desc'),//微信分享描述
                timeLineTitle: 'timelIne',
                sinaTitle: refTitle,//新浪title
                desc: $(".ev-reprint").attr('data-desc'),//新浪的描述
                qzoneTitle: refTitle,//qq空间title
                summary: $(".ev-reprint").attr('data-desc'),//qq空间的描述
                qShareLog: function (x) {    //分享新浪，空间成功与否都执行
                    comm.shareLog({
                        shareType: refType,
                        resourceId: refId,
                        resourceType: refType,
                        refId: refId,
                        isValid: 1,
                        shareSence: '',
                        shareChannel: x == 'sina' ? 3 : 1,
                        shareContent: refTitle,
                        refCustomerId: TempCache.getItem('userId') || 0
                    });
                },
                fnMessageSuc: function () {
                    comm.shareLog({
                        shareType: refType,
                        resourceId: refId,
                        resourceType: refType,
                        refId: refId,
                        isValid: 1,
                        shareSence: '',
                        shareChannel: 4,
                        shareContent: refTitle,
                        refCustomerId: TempCache.getItem('userId') || 0
                    });
                },      //分享好友成功回调
                fnTimelineSuc: function () {
                    comm.shareLog({
                        shareType: refType,
                        resourceId: refId,
                        resourceType: refType,
                        refId: refId,
                        isValid: 1,
                        shareSence: '',
                        shareChannel: 5,
                        shareContent: refTitle,
                        refCustomerId: TempCache.getItem('userId') || 0
                    });
                }      //分享朋友圈成功回调
            }, false, $(".ev-reprint"), 1);
            //});

            $('.ev-review').on('click', function () {
                // 厂商医助不可以评论
                if(TempCache.getItem("customerRole") === "14" ||
                    TempCache.getItem("customerRole") === "15" ||
                    TempCache.getItem("customerRole") === "13") {
                    comm.toastFactoryAuth(null);
                    return false;
                }else { // 原逻辑
                    if (TempCache.getItem('customerRole') == 2 ||
                        TempCache.getItem('customerRole') == 3 ||
                        TempCache.getItem('customerRole') == 4) {
                        popup('该用户没有操作权限');
                        return false;
                    }
                    var refId = getpara().refId; //资源id
                    var username = $(this).attr('data-username');
                    var refType = $(this).attr('data-refType');
                    var parentId = $(this).attr('data-reviewId'); //当前资源id
                    var refCustomerId = $(this).attr('data-refCustomerId');
                    TempCache.setItem('commentFromPage', window.location.href);
                    g_sps.jump(null, '/pages/common/comment.html?resourceId=' + refId + '&username=' + username + '&type=' + refType + '&parentId=' + parentId + '&refCustomerId=' + refCustomerId);
                }
            });


        }

        function AjaxAdapter(kv, scene) {
            return {
                refUrl: kv.customer_review.refUrlWap,
                refType: kv.customer_review.reviewType,
                parentId: kv.customer_review.parentId,
                reviewId: kv.customer_review.id,
                customerId: kv.customer_review.customerId,
                refCustomerId: kv.customer_review.refCustomerId,
                logoUrl: kv.customer_att.logoUrl,
                username: kv.customer_auth.lastName + kv.customer_auth.firstName,
                parentUsername: (function (kv) {
                    if (kv.customer_review.parentId == 0) {
                        return '';
                    } else {
                        return !kv.parent_customer_auth ? kv.customer_auth.lastName + kv.customer_auth.firstName : kv.parent_customer_auth.lastName + kv.parent_customer_auth.firstName
                    }
                })(kv),
                company: kv.customer_auth.company,
                publishTime: kv.customer_review.publishTime,
                content: kv.customer_review.reviewContent,
                upUsername: !kv.parent_customer_auth ? '' : '回复给' + kv.parent_customer_auth.lastName + kv.parent_customer_auth.firstName + '：',
                upContent: htmlToString(kv.parent_review_insite.reviewContent).replace(/&lt;br\/&gt;/g, '<br/>'),
                reviewNum: kv.customer_review.reviewNum,
                collectNum: kv.customer_collection.isValid ? (kv.customer_review.collectionNum == 0 ? 1 : kv.customer_review.collectionNum) : kv.customer_review.collectionNum,
                upNum: kv.customer_prefer.isValid ? (kv.customer_review.upNum == 0 ? 1 : kv.customer_review.upNum) : kv.customer_review.upNum,
                reprintNum: kv.customer_review.reprintNum,
                imgsListArr: kv.customer_review_insite_attachment,
                quoteType: getValue(kv.customer_quote, 'refQuoteType'),
                refQuoteName: htmlToString(getValue(kv.customer_quote, 'refQuoteName').cutString(26)),
                quoteUrl: getValue(kv.customer_quote, 'web_storage_path'),
                videoSrcUrl: getValue(kv.customer_review_insite_attachment_video, 'attUrl'),
                videoLogoUrl: getValue(kv.customer_review_insite_attachment_video, 'attLogoUrl'),
                playTime: getValue(kv.customer_review_insite_attachment_video, 'playTime'),
                preferState: kv.customer_prefer.isValid,
                reprintState: kv.customer_reprint.isValid,
                collectState: kv.customer_collection.isValid
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

        function isExistData(data) {
            if (data.responseObject && data.responseObject.responseStatus && data.responseObject.responseData.data_list) {
                return data.responseObject.responseData.data_list;
            } else {
                return false;
            }
        }


    });
});
