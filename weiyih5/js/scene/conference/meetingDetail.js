/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2017/7/10
 * @author: sunhaibin
 */

$(function () {
    var conId = comm.getpara().conId;
    var cId = TempCache.getItem("userId");
    var authState = JSON.parse(TempCache.getItem("auth")) ? JSON.parse(TempCache.getItem("auth")).state : "";
    var ctrl = {
        path: {
            getMapListV4Url: M_CALL + 'conference/index/getMapListV4/',//会议预告列表接口
            followUrl: M_CALL + "customer/follow/resource/create/",//关注接口customer/follow_resource/createFollowResource/'  customer/follow/resource/create/
            cancelUrl: M_CALL + 'customer/follow/resource/delete3/'//取消关注接口"customer/follow_resource/delete3/"  customer/follow/resource/delete/
        },
        init: function () {
            var t = this;
            t.mInfo();
            t.eventTrack();
            //Log.createBrowse(25, '直播列表页面');
        },
        //解析app端分享出来的会议终端进行强制关注
        appFollow: function () {
            var t = this;
            if (comm.getpara().appCode) {//app分享出的链接进行用户强制关注
                if (cId &&  authState == 2|| authState == 7 || authState == 8 || authState == 9) {//登录认证用户authState == 1 ||
                    if(!$(".ev-followBtn").hasClass("active")){
                        $(".ev-followBtn").click();
                    }
                } else {
                    user.privExecute({
                        operateType: 'auth',   //'login','auth','conference'
                        noNeedBack:true,
                        callback: function () {
                            if(!$(".ev-followBtn").hasClass("active")){
                                $(".ev-followBtn").click();
                            }
                        }
                    });
                }
            }
        },
        cusStatus: function () {
            var t = this;
            comm.ajax.request({
                port: t.path.getMapListV4Url,
                postData: {
                    scene: 0,//场景（0-会议频道页，1-我关注的会议，2-会议预告）
                    visitSiteId: 2,
                    platformId: TempCache.getItem('department') || 1,
                    pageIndex: 1,
                    pageSize: 20,
                    sessionCustomerId: cId ? cId : "",
                    conId: conId
                },//上传参数，json形式即可
                success: function (req) {//成功的回调
                    var items = req.responseObject.responseData.data_list[0];
                    if (items.followState == 0) {//未关注
                        $(".ev-followBtn").removeClass("active").text("关注");
                    } else {//已关注
                        $(".ev-followBtn").addClass("active").text("已关注");
                    }
                    //关注数修改
                    $(".ev-followNum").text(items.followNum+"关注");
                    t.followClick();
                    t.appFollow();//判断访问来源
                }
            });
        },
        //关注按钮的点击事件
        followClick: function () {
            var t=this;
            $(".ev-followBtn").off("click").on("click", function () {
                if (cId && authState == 2|| authState == 7 || authState == 8 || authState == 9 ) {//登录认证用户 authState == 1 ||
                    if ($(this).hasClass("active")) {//已关注的用户，点击取消关注
                        t.followOpFunc(t.path.cancelUrl,$(this));
                    }else{//未关注的用户，点击关注
                        t.followOpFunc(t.path.followUrl,$(this));
                    }
                } else {
                    user.privExecute({
                        operateType: 'auth',   //'login','auth','conference'
                        callback: function () {}
                    });
                }
            });
        },
        //关注操作
        followOpFunc: function (url,$this) {
            var t = this;
            var _followNum=parseInt($(".ev-followNum").text());
            if (conId) {
                var param = {
                    paramJson: $.toJSON({
                        "refId": conId,
                        "refName": '',
                        "customerId": cId,
                        "followType": 3
                    })
                };
                var cBack = function (rep) {
                    if (rep && rep.responseObject && rep.responseObject.responseStatus) {//关注成功
                        if ($this.hasClass("active")) {//已关注的用户，点击取消关注
                            $this.removeClass("active").text("关注");
                           if(_followNum){
                               if(_followNum>1){
                                   $(".ev-followNum").text(_followNum-1+"关注");
                               }else{
                                   $(".ev-followNum").text("0关注");
                               }
                           }else{
                               $(".ev-followNum").text("0关注");
                           }
                        }else{
                            $this.addClass("active").text("已关注");
                            $(".ev-followNum").text(_followNum+1+"关注");
                            comm.creatEvent({
                                triggerType: '关注',
                                triggerName:"关注",
                                keyword: "",
                                actionId: 11022,
                                refId:$this.attr("data-conId"),
                                refType:"会议"
                            });
                        }
                    }
                };
                comm.ajax.async(url, param, cBack);
            }
        },
        eventTrack: function () {
            $('.ev_backBtn').click(function () {
                comm.creatEvent({
                    triggerType: '全站功能按钮点击',
                    keyword: $('.meIntroTitle').text(),
                    actionId: 41,
                    refId: conId,
                    async: false
                });
                history.back();
            });

        },
        hasResponseData: function (r) {
            if (r && r.responseObject && r.responseObject.responseData && !$.isEmptyObject(r.responseObject.responseData)) {
                return true;
            }
            return false;
        },
        hasResponseMessage: function (r) {
            if (r && r.responseObject && r.responseObject.responseMessage && !$.isEmptyObject(r.responseObject.responseMessage)) {
                return true;
            }
            return false;
        },
        timeCompare: function (x) {//比较与当前时间的关系
            var _stime = Date.UTC(x.substring(0, 4), parseInt(x.substring(5, 7)) - 1, x.substring(8, 10), parseInt(x.substring(11, 13)) - 8, x.substring(14, 16), 0);
            var _now = new Date().getTime();
            if (_now > _stime) { //当前时间大干比较时间
                return true;
            } else {
                return false;
            }
        },
        /*会议简介的数据*/
        mInfo: function () {
            var t = this;
            $.ajax({
                url: '/mcall/conference/index/getConferenceSubList/',
                type: "post",
                data: {
                    paramJson: $.toJSON({
                        "pageIndex": 1, "pageSize": 200, "conId": conId
                    })
                },
                async: false,
                success: function (req) {
                    var meetingIntro,
                        meetingList;
                    if (t.hasResponseData(req)) {
                        meetingIntro = req.responseObject.responseData;
                    }
                    if (t.hasResponseMessage(req)) {
                        meetingList = req.responseObject.responseMessage;
                    }
                    var str = '';
                    var isLive = false;
                    var conMainPicUrl = '';
                    //简介字符串截取
                    if (meetingIntro) {
                        var meetingTitle = meetingIntro.conIntro;
                        str = '<aside class="meIntroTitle">' + meetingIntro.conName + '</aside>' +
                            '<div class="fellow"><div class="fellowNum ev-followNum">关注</div> <div class="fellowBtn ev-followBtn" data-conId="' + meetingIntro.conId + '">关注</div></div>' +
                            '<p><b>' + meetingTitle + '</b><span data-flag="0">展开<i></i></span></p>';

                        $('.meetingIntroduction').html(str);
                        t.cusStatus();//调用用户的登录登录认证状态
                        var _shortIntro = meetingTitle;
                        if (meetingTitle.length > 40) {
                            _shortIntro = comm.getStrLen(meetingTitle, 80);
                            $('.meetingIntroduction p b').text(_shortIntro);
                        } else {
                            $('.meetingIntroduction span').hide();
                        }
                        conMainPicUrl = meetingIntro.conMainPicUrl;
                        t.mInfoToggle(meetingTitle, _shortIntro);
                       var title="完整授课视频";
                       for(var i=0;i<meetingList.length;i++){
                         var val=meetingList[i];
                         if((val.isOnline==1||val.isOnline==2)&&(val.isValid==5||val.isValid==4)){
                           title="直播进行中";
                           break;
                         }
                       }
                        t.shareFn({
                            conId: conId,
                            title: "[" + meetingIntro.conName + "]"+title+"，就在唯医",
                            picUrl: conMainPicUrl ? conMainPicUrl : "https://m.allinmd.cn/image/allin_logo.png",
                            wxTitle: "[" + meetingIntro.conName + "]"+title+"，就在唯医",
                            wxDesc: _shortIntro,
                            timelineTitle: "[" + meetingIntro.conName + "]"+title+"，就在唯医",
                            sinaTitle: "[" + meetingIntro.conName + "]"+title+"，就在唯医。" + (meetingIntro.startTime ? meetingIntro.startTime.substring(0, 10) + "," : "") + " " + meetingIntro.country + meetingIntro.city + (_shortIntro ? (',' + _shortIntro) : "") + " 点击查看:",
                            qZoneTitle: "[" + meetingIntro.conName + "]"+title+"，就在唯医",
                            qZoneDesc: _shortIntro
                        })
                    }
                    if (meetingList) {//分会场
                        var conName = '';
                        $.each(meetingList, function (i, v) {
                            var meetingType = "";   //直播回播类型
                            var isLiveOrPlayBackMeeting = "";    //是否要给回播直播留icon位置
                            var _liveStartTime = "";   //直播开始时间
                            //isOnline 判断是否在线直播(0-不直播、1-展视互动-直播、2-厂商-直播、3-展视互动-回播；)'
                            if (v.isOnline == 3) {//回播
                                isLive = true;
                                meetingType = 'playBackMeeting';
                                isLiveOrPlayBackMeeting = "isLiveOrPlayBackMeeting";
                            } else if ((v.isOnline == 1 || v.isOnline == 2) && (v.isValid == 5 || v.isValid == 4)) { //isValid 4即将直播，5正在直播，6直播结束
                                meetingType = 'liveMeeting';
                                isLiveOrPlayBackMeeting = "isLiveOrPlayBackMeeting";
                                _liveStartTime = v.startTime;
                                isLive = true;
                            }
                            var halfLineHeight = '';
                            if (v.conSubName.length > 20) {//判断分会名字长度加不同行高
                                halfLineHeight = 'halfLineHeight';
                            }
                            conName += '<li data-alcode-sm="list-1" class="' + (meetingType != "" ? "ev_liveOrBack" : "") + '" conSubId="' + v.id + '" liveId="' + v.liveId + '" playBackId="' + v.playBackId + '" token="' + v.authcode + '" roomId="'+v.conSubRoom+'">' +
                                '<div  data-alcode="e115" class="listName ' + halfLineHeight + ' ' + isLiveOrPlayBackMeeting + '" startTime="' + _liveStartTime + '" isOnline="' + v.isOnline + '" authority="' + v.authority + '">' +
                                v.conSubName +
                                '<i class=' + meetingType + '></i>' +
                                '</div>' +
                                '<div class="scheduleListWrap" hasData="false" style="display:none;"></div>' +
                                '</li>';


                        });

                        $('.meetingList ul').html(conName);
                        t.meetingListClick();
                        if (meetingList.length == 1 && !isLive) { //只有一个并且不是直/回播时 自动展开
                            setTimeout(function () {
                                t.getConSub(meetingList[0].id, $('.meetingList li:eq(0)'));
                            }, 400)

                        }

                        t.scrollFn();
                    }


                },
                error: function () {
                }
            });
        },
        /*会议简介的展开收起*/
        mInfoToggle: function (meetingTitle, _shortIntro) {
            $('.meetingIntroduction span').attr('data-flag', 0);
            $('.meetingIntroduction span').on('click', function (e) {
                if ($(this).attr('data-flag') == 0) {
                    $('.meetingIntroduction p b').text(meetingTitle);
                    $(this).attr('data-flag', 1);
                    $(this).html('收起' + '<i class="active"></i>');
                    comm.creatEvent({
                        triggerType: '功能按钮',
                        triggerName:"展开",
                        keyword: "",
                        actionId: 11024,
                        refId:conId,
                        refType:"会议"
                    });
                } else {
                    $('.meetingIntroduction p b').text(_shortIntro);
                    $(this).attr('data-flag', 0);
                    $(this).html('展开' + '<i></i>');
                    comm.creatEvent({
                        triggerType: '功能按钮',
                        triggerName:"收起",
                        keyword: "",
                        actionId: 11025,
                        refId:conId,
                        refType:"会议"
                    });
                }
                e.stopPropagation();
            });
        },
        /*分会数据预处理*/
        pretreatmentData: function (data) {
            var returnData = {};
            var changeTimeStyle = function (time) {
                return time.split(" ")[0];
            };
            $.each(data, function (i, v) {
                if (returnData[changeTimeStyle(v.startTime)]) {
                    returnData[changeTimeStyle(v.startTime)].push(v);
                } else {
                    returnData[changeTimeStyle(v.startTime)] = [];
                    returnData[changeTimeStyle(v.startTime)].push(v);
                }
            });
            return returnData
        },
        /*分会场点击事件*/
        meetingListClick: function () {
            var self = this;
            var conSubId = '';
            $('.meetingList .listName').on('click', function (e) {
                var $this = $(this);
                var t = $(this).parent();//li
                conSubId = t.attr('conSubId');
                TempCache.setItem('conName',$('.meIntroTitle').text());
                //判断有无直播，有直播开始去直播页，有直播未开始弹提示层，没有直播加载分会数据
                var _liveStartTime = $(this).attr('startTime');
                if ($this.attr('isOnline') == 3 && t.attr('playBackId')) {//回播
                    /*var liveUrl = '/pages/conference/live-wrap.html?conSubId=' + conSubId + '&conId=' + conId + '&playBackId=' + t.attr('playBackId') + "&token=" + t.attr('token');*/
                    var liveUrl = '/pages/conference/conference_live.html?conSubId='+conSubId+'&conId='+conId+'&userId=0438CD3A0AB20794&roomId='+t.attr('roomId')+'&back=1&liveId='+t.attr('liveId')+'&recordId='+t.attr('playBackId')+'&authority='+$this.attr("authority");
                    g_sps.jump($(this), liveUrl);
                } else if (_liveStartTime) {//有直播
                    if (self.timeCompare(_liveStartTime)) {//当前时间大于直播开始时间，去直播页
                        //isOnline 判断是否在线直播(0-不直播、1-展视互动-直播、2-厂商-直播、3-展视互动-回播；)'
                        var liveUrl = '';
                        switch (parseInt($this.attr('isOnline'))) {
                            case 1:
                            case 2:
                                /*liveUrl = '/pages/conference/live-wrap.html?conSubId=' + conSubId + '&conId=' + conId + '&liveId=' + t.attr('liveId') + "&token=" + t.attr('token');*/
                                liveUrl = '/pages/conference/conference_live.html?conSubId='+conSubId+'&conId='+conId+'&userId=0438CD3A0AB20794&roomId='+t.attr('roomId')+'&back=0'+'&authority='+$this.attr("authority");
                                break;
                            //case 2:
                            //    liveUrl = '/pages/conference/live.html?conSubId=' + conSubId + '&title=' + $this.text();
                            //    break;
                            case 3:
                                '/pages/conference/conference_live.html?conSubId='+conSubId+'&conId='+conId+'&userId=0438CD3A0AB20794&roomId='+t.attr('roomId')+'&back=1&liveId='+t.attr('liveId')+'&recordId='+t.attr('playBackId')+'&authority='+$this.attr("authority");
                                break;
                        }
                        if (liveUrl) {
                            g_sps.jump($(this), liveUrl);
                        }
                    } else {
                        comm.alertBox({
                            title: "直播将于" + _liveStartTime + "开始",
                            ensure: "知道了",
                            ensureCallback:function(){
								$('.ev_alertBox').remove();
                            }
                        });
                    }

                } else {//非直播回播加载日程及toggle

                    if (t.find('.scheduleListWrap').attr('hasData') == 'false') {//加载分会数据
                        self.getConSub(conSubId, t);
                    } else {
                        //if(t.find('.scheduleListWrap').attr('hasData') == 'noData'){//请求过无数据
                        //    return false;
                        //}else {
                        if (t.find('i').hasClass('active')) {
                            t.find('i').removeClass('active');
                            t.find('.scheduleListWrap').slideUp();
                        } else {
                            t.find('i').addClass('active');
                            t.find('.scheduleListWrap').slideDown();
                        }
                        //}
                    }
                }

            });
        },
        getConSub: function (conSubId, $dom) {//分会id, $dom处理的元素
            var t = this;
            $.ajax({
                url: M_CALL + 'conference/index/getAgendaVideoList/',
                type: "post",
                data: {
                    paramJson: $.toJSON({
                        "pageIndex": 1, "pageSize": 100, "conSubId": conSubId, "conId": conId
                    })
                },
                success: function (opt) {
                    if (t.hasResponseMessage(opt)) {
                        var scheduleList = t.pretreatmentData(opt.responseObject.responseMessage);
                        var innerHtml = '';
                        var videoUrl = 'javascript:;';
                        var noVideoShow = "noVideoShow";
                        $.each(scheduleList, function (i, q) {
                            var dateList = '';
                            $.each(q, function (i, w) {
                                videoUrl = 'javascript:;';
                                noVideoShow = "noVideoShow";
                                if (w.videoUrl) {
                                    videoUrl = "/html/m/" + w.videoUrl;
                                    noVideoShow = "";
                                }
                                var dateTime = w.startTime.substring(w.startTime.indexOf(' '), w.startTime.length).substring(0, 6);
                                dateList += '<div class="scheduleCont">' +
                                    '<div class="scheduleTime">' + dateTime + '</div>' +
                                    '<div class="scheduleTitle" data-url=' + videoUrl + '>' +
                                    '<p class="' + (noVideoShow == "noVideoShow" ? "gray" : "") + '">' + ($.isEmptyObject(w.conName) ? "&nbsp;" : w.conName) + '<i class="active ' + noVideoShow + '"></i></p>' +
                                    '<p>主讲人：' + w.lecturer + '</p>' +
                                    '</div>' +
                                    '</div>';
                            });
                            innerHtml += '<aside class="scheduleList">' +
                                '<div class="listLi">' +
                                '<div class="scheduleContDate">' +
                                '<div class="scheduleTime"></div>' +
                                '<div class="scheduleTitle">' + i + '</div>' +
                                '</div>' +
                                dateList +
                                '</div>' +
                                '</aside>';
                        });

                        $dom.find('.scheduleListWrap').html(innerHtml).slideDown().attr('hasData', true);
                        $dom.find('.listName i').addClass('active');
                        //$dom.find('i').addClass('active');
                        $('.scheduleTitle').on('click', function (e) {
                            if (!/javascript:;/.test($(this).attr('data-url'))) {
                                g_sps.jump($(this), $(this).attr('data-url'));

                            }
                            e.stopPropagation();
                        });
                    } else {
                        $dom.find('.scheduleListWrap').attr('hasData', 'noData');
                    }

                },
                error: function () {
                }
            });
        },
        scrollFn: function () {
            var t = this;
            var headH = $('.al-headFilterBox').outerHeight();
            var arr = [];
            var scrollTop = 0;
            $(window).on('scroll touchmove', function () {
                if ($(window).scrollTop() > 0) {
                    $('.ev_consubName').html(comm.getStrLen($('.meIntroTitle').text(), 20));
                    if($(window).scrollTop()>$('.meetingIntroduction p').height()-$('.meetingIntroduction p').offset().top){
                        if ($('.meetingIntroduction span').attr('data-flag') == 1) {
                            $('.meetingIntroduction span').click();
                        }
                    }

                } else {
                    $('.ev_consubName').html('');
                }
                scrollTop = $(window).scrollTop() + headH;
                arr = [];
                $.each($('.meetingList li:not(.ev_liveOrBack)'), function (v, el) {
                    arr.push($(el).offset().top);
                });
                $('.ev-fixedArea').html("").removeAttr('liIndex');
                $.each(arr, function (i, ev) {
                    if (scrollTop > arr[i] && (arr[i + 1] ? scrollTop < arr[i + 1] : true)) {
                        $('.ev-fixedArea').html($('.meetingList li:not(.ev_liveOrBack)').eq(i).find('.listName').clone()).attr('liIndex', i);

                    }
                });

            });
            $('.ev-fixedArea').click(function () {
                $('.meetingList li:not(.ev_liveOrBack)').eq($(this).attr('liIndex')).find('.listName').click();
            });
        },
        shareFn: function (kv) {
            shareAll({
                title: kv.title,
                url: window.location.href,//不传默认取当前地址
                pic: kv.picUrl,//分享图片
                trendUrl: "",//分享动态的请求连接  //不需要动态分享就不传 cId?"/mcall/customer/reprint/create/":""
                noPJ: 0,//0：分享动态给后台的参数需要转为paramJson ,1:不需要book
                data: {//分享动态传给后台的参数

                },
                callback: function () {
                },//分享动态后成功后的回调函数
                wxTitle: kv.wxTitle,//微信分享标题
                wxDesc: kv.wxDesc,//微信分享描述
                timeLineTitle: kv.timelineTitle,
                sinaTitle: kv.sinaTitle,//新浪title
                desc: kv.sinaTitle,//新浪的描述
                qzoneTitle: kv.qZoneTitle,//qq空间title
                summary: kv.qZoneDesc,//qq空间的描述
                fnMessageSuc: function () {
                    comm.shareLog({
                        shareType: 3,
                        resourceId: kv.conId,
                        resourceType: 3,
                        refId: kv.conId,
                        isValid: 1,
                        shareSence: 24,
                        shareChannel: 4,
                        shareContent: kv.title
                    });
                },
                fnTimelineSuc: function () {
                    comm.shareLog({
                        shareType: 3,
                        resourceId: kv.conId,
                        resourceType: 3,
                        refId: kv.conId,
                        isValid: 1,
                        shareSence: 24,
                        shareChannel: 5,
                        shareContent: kv.title
                    });
                },
                qShareLog: function (o) {
                    comm.shareLog({
                        shareType: 3,
                        resourceId: kv.conId,
                        resourceType: 3,
                        refId: kv.conId,
                        isValid: 1,
                        shareSence: 24,
                        shareChannel: o == 'sina' ? 3 : 1,
                        shareContent: o == 'sina' ?
                            kv.sinaTitle : kv.qZoneDesc
                    });
                }
            }, false, $('.ev_shareBtn'));
        }

    };
    ctrl.init();

});