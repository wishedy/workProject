/**
 * 会议预告页面
 * Created by HJ on 2017/8/9.
 */
$(function () {
    //Log.createBrowse(212, "会议预告"); //	浏览日志
    var _nowMonth = new Date().getMonth() + 1;
    var cId = TempCache.getItem("userId");
    var authState = JSON.parse(TempCache.getItem("auth")) ? JSON.parse(TempCache.getItem("auth")).state : "";
    var controller = {
        config: {
            pageSize: 20
        },
        path: {
            getMapListV4Url: M_CALL + 'conference/index/getMapListV4/',//会议预告列表接口
            scrBtnUrl: M_CALL + "conference/index/getScreeningCondition/",//筛选项按钮的url
            followUrl: M_CALL + "customer/follow/resource/create/",//关注和想看接口
            cancelUrl: M_CALL + 'customer/follow/resource/delete3/',//取消关注接口
            shareUrl: M_CALL + "comm/data/share/getMapList3/"//分享的接口
        },

        init: function () {
            var t = this;
            if (comm.getpara().platId) {//判断
                TempCache.setItem('department', comm.getpara().platId)
            }
            t.webpImg();
            t.tabClickFunc();//顶部导航点击事件
            t.majorList();//专业筛选列表
            t.meetingState();//会议状态筛选的一些操作
            t.allinLiveFunc();//唯医录制点击
            t.backBtn();//返回按钮的返回和埋点
            t.feedBackClick();//反馈  告诉我们按钮
        },
        webpImg:function(){
            var UA = navigator.userAgent;
            //if(UA.indexOf('Android')>-1){
            //    if(UA.split('Android ')[1][0]>=4){  //android 4.0版本以上
            //        $.each($('img'),function(i,el){
            //            if($(el).attr('webpSrc')){
            //                $(el).on('load',function(){
            //                    $(el).attr('src',$(el).attr('webpSrc'));
            //                });
            //            }
            //        });
            //    }
            //}
            if(UA.indexOf('Android')==-1||(UA.indexOf('Android')>-1&&UA.split('Android ')[1][0]<4)){
                $.each($('img[webpSrc]'),function(i,el){
                    if($(el).attr('webpSrc')){
                        $(el).attr('src',$(el).attr('webpSrc'));
                    }
                });
            }

        },
        //反馈的埋点事件
        feedBackClick: function () {
            $(".ev-feedBackClick").off("click").on("click", function () {
                comm.creatEvent({
                    triggerType: '功能按钮',
                    triggerName: "告诉我们",
                    keyword: "",
                    actionId: 11026
                });
            });
        },
        //页面左上角返回按钮
        backBtn: function () {
            $(".ev-backBtn").off("click").on("click", function () {
                comm.creatEvent({
                    triggerType: '全站功能按钮点击',
                    keyword: "返回",
                    actionId: 41,
                    async: false
                });
                if (document.referrer != "") {
                    $(this).attr("href", "javascript:" + history.back(-1) + ";");
                } else {
                    $(this).attr("href", "/");
                }
            });

        },
        //专业列表筛选铺设
        majorList: function () {
            var t = this, html = "";
            var cBack = function (rep) {
                if (comm.hasResponseData(rep)) {
                    var res = rep.responseObject.responseData;
                    html = "";
                    if (res.majorList && res.majorList.length > 0) {
                        $.each(res.majorList, function (k, v) {
                            html += '<li data-tagId="' + v.tagId + '" data-tagType="' + v.tagType + '">' + v.tagName + '</li>';
                        });
                        $(".ev-majorCheck ul").append(html);
                        t.majorScrFunc();//专业筛选的一些操作
                    }
                }
            };
            comm.ajax.async(t.path.scrBtnUrl, {
                paramJson: $.toJSON({
                    sessionCustomerId: cId,
                    platformId: TempCache.getItem('department') || 1
                })
            }, cBack);
        },
        //专业筛选的选择
        majorScrFunc: function () {
            var t = this;
            var param = {};
            //初次点击专业
            $(".ev-majorCheck").off("click").on("click", function () {
                if ($(this).attr("data-flag") == 1) {
                    $(this).addClass("active").find(".ev-screenOptionsDiv,ul").slideDown();
                    if ($(".ev-meetingState").find(".ev-screenOptionsDiv,ul").is(":visible")) {//会议关闭
                        $(".ev-meetingState").click();
                    }
                    $(this).attr("data-flag", "0");
                    t.bodyNoScroll();
                } else {
                    $(this).removeClass("active").find(".ev-screenOptionsDiv,ul").slideUp();
                    $(this).attr("data-flag", "1");
                    t.bodyScroll();
                }
            });
            //专业筛选列表点击
            $(".ev-majorCheck ul li").off("click").on("click", function () {
                $(this).addClass("active").siblings("li").removeClass("active");//点击激活
                $(this).parents("ul").slideUp();//收起弹层
                if ($(this).attr("data-tagId") != "all") {//除去全部按钮的点击
                    $(this).parents(".ev-majorCheck").addClass("active checkHover").find("span").text(comm.getStrLen($(this).text(), 10)).attr("data-tagId", $(this).attr("data-tagId"));//专业文本替换
                } else {
                    $(this).parents(".ev-majorCheck").removeClass("checkHover").find("span").text("专业").attr("data-tagId", $(this).attr("data-tagId"));
                }
                param.openTime = t.validateTime();//判断时间
                if ($(".ev-titleTab ul li[class=active]").index() == _nowMonth - 1) {//当前月判断会议状态
                    param.runState = t.validateState();
                }
                param.shootState = t.validateAllin();//唯医录制
                param.subjectTeamId = t.validateMajor();//判断专业
                t.allCommAjax(param, 0, 1, 1);//0,0,1 直接点击顶部  是否是由专业和会议少选点击  是否是来自筛选
                comm.creatEvent({
                    triggerType: '筛选',
                    triggerName: "btn-筛选专业选择",
                    keyword: $(this).text(),
                    actionId: 11016
                });
                t.bodyScroll();
            });
        },
        //会议状态选择
        meetingState: function () {
            var t = this;
            var param = {};
            $(".ev-meetingState").off("click").on("click", function () {
                if ($(this).attr("data-flag") == 1) {
                    $(this).addClass("active").find(".ev-meetingStateDiv,ul").slideDown();
                    if ($(".ev-majorCheck").find(".ev-screenOptionsDiv,ul").is(":visible")) {
                        $(".ev-majorCheck").click();
                    }
                    $(this).attr("data-flag", "0");
                    t.bodyNoScroll();
                } else {
                    $(this).removeClass("active").find(".ev-meetingStateDiv,ul").slideUp();
                    $(this).attr("data-flag", "1");
                    t.bodyScroll();
                }
            });
            $(".ev-meetingState ul li").off("click").on("click", function () {
                $(this).addClass("active").siblings("li").removeClass("active");//点击激活
                $(this).parents("ul").slideUp();//收起弹层
                if ($(this).attr("data-type") != "all") {//除去全部按钮的点击
                    $(this).parents(".ev-meetingState").addClass("active checkHover").find("span").text($(this).text()).attr("data-type", $(this).attr("data-type"));//专业文本替换
                } else {
                    $(this).parents(".ev-meetingState").removeClass("checkHover").find("span").text("会议状态").attr("data-type", $(this).attr("data-type"));
                }
                if ($(".ev-titleTab ul li[class=active]").index() == _nowMonth - 1) {//当前月判断会议状态
                    param.runState = t.validateState();
                }
                param.openTime = t.validateTime();//判断时间
                param.subjectTeamId = t.validateMajor();//判断专业
                param.shootState = t.validateAllin();//1为拍摄  0为不拍摄
                t.allCommAjax(param, 0, 1, 1);//0,0,1 直接点击顶部  是否是由专业和会议少选点击  是否是来自筛选
                comm.creatEvent({
                    triggerType: '筛选',
                    triggerName: "会议状态筛选项",
                    keyword: $(this).text(),
                    actionId: 11020
                });
                t.bodyScroll();
            });
        },
        //唯医录制按钮
        allinLiveFunc: function () {
            var t = this;
            var param = {};
            $(".ev-allinLive").off("click").on("click", function () {
                if ($(this).attr("data-flag") == 1) {//选中唯医录制,进行接口请求
                    $(this).addClass("active").attr("data-flag", "0");
                    comm.creatEvent({
                        triggerType: '筛选',
                        triggerName: "唯医录制",
                        keyword: "",
                        actionId: 11021
                    });
                } else {//解除唯一录制，重新请求接口
                    $(this).removeClass("active").attr("data-flag", "1");
                }
                param.openTime = t.validateTime();//判断时间
                if ($(".ev-titleTab ul li[class=active]").index() == _nowMonth - 1) {//当前月判断会议状态
                    param.runState = t.validateState();
                }
                param.subjectTeamId = t.validateMajor();//判断专业
                param.shootState = t.validateAllin();//唯医录制
                if ($(this).attr("data-noRe") != 1) {//排除
                    t.allCommAjax(param, 0, 0, 1);//0,0,1 直接点击顶部  是否是由专业和会议少选点击  是否是来自筛选
                }
            });
        },
        //弹层显示的时候，禁止滑动
        bodyNoScroll: function ($this) {
            $("body,html,.al-mainInner").css({
                overflow: "hidden",
                height: "100%"
            });
        },
        //弹层关闭的时候，放开滑动
        bodyScroll: function () {
            $("body,html,.al-mainInner").css({overflow: "", height: "auto"});
        },
        //点击顶部筛选项的验证唯医录制（筛选项时相当于多选）
        validateAllin: function () {
            var _allinLive = $(".ev-allinLive").hasClass("active");//判断唯医录制有没有选择
            return _allinLive ? 1 : "";
        },
        //点击顶部筛选项的验证专业选中与否（筛选项时相当于多选）
        validateMajor: function () {
            var _major = $(".ev-majorCheck span").attr("data-tagId");
            return (_major == "noCheck" || _major == "all") ? "" : _major;//会议状态未选择和全部状态下情况
        },
        //点击顶部筛选项的验证会议状态（筛选项时相当于多选）
        validateState: function () {
            var _mState = $(".ev-meetingState span").attr("data-type");
            return (_mState == "noCheck" || _mState == "all") ? "" : _mState;//会议状态未选择和全部状态下情况
        },
        //点击顶部筛选项的验证时间（筛选项时相当于多选）
        validateTime: function () {
            var _kv = $(".ev-titleTab ul li[class=active]"),
                _thisMonth = parseInt(_kv.text()) > 9 ? parseInt(_kv.text()) : '0' + parseInt(_kv.text());
            return comm.date.local_time(new Date()).substr(0, 5) + _thisMonth;
        },
        //公共的ajax列表请求
        allCommAjax: function (param, flag, btFlag, isScreening) {//flag存在说明是直接点击顶部月份
            var t = this;
            var params = {
                paramJson: $.toJSON({
                    scene: 2,//场景（0-会议频道页，1-我关注的会议，2-会议预告）	2
                    sessionCustomerId: cId,	//用户ID
                    subjectTeamId: param.subjectTeamId ? param.subjectTeamId : "",	//专业标签（0-无标签，9999-综合，10000-其他，2-关节，7-脊柱，9-创伤）
                    runState: param.runState ? param.runState : "",	//会议状态（0-未进行，1-已进行）
                    shootState: param.shootState ? param.shootState : "",	//拍摄状态（0-不拍摄，1-拍摄）
                    openTime: param.openTime ? param.openTime : "",	//时间筛选
                    platformId: TempCache.getItem('department') || 1,	//平台（1-骨科，2-手外科）
                    pageIndex: 1,
                    pageSize: t.config.pageSize
                })
            };
            var cBack = function (rep) {
                if (comm.hasResponseData(rep) && rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length) {
                    var res = rep.responseObject.responseData;
                    t.htmlDomFunc(res, 0, param, isScreening);
                    t.listShowOrHide();
                } else {//本月无会议
                    if (flag) {//直接点击顶部导航
                        t.noMeetingShow();
                    } else {
                        t.noScreenResult(btFlag);//筛选无结果
                    }
                }
            };
            comm.ajax.async(t.path.getMapListV4Url, params, cBack);
        },
        //有列表时显示和隐藏
        listShowOrHide: function () {
            var t = this;
            $(".ev-meetingList,.ev-doubt,.ev-screenOptions").show();//会议列表和下边的疑问显示 筛选条显示
            $(".ev-screenNoResult,.ev-meetingNoneMouth").hide();//会议无结果隐藏和筛选无结果隐藏
            $(".ev-allinLive").attr("data-noRe", "0");
        },
        //筛选无结果
        noScreenResult: function (btFlag) {
            var t = this;
            $(".ev-screenNoResult,.ev-screenOptions").show();//筛选无结果显示 筛选条显示
            $(".ev-meetingList,.ev-doubt,.ev-meetingNoneMouth").hide();//会议列表隐藏
            if (btFlag) {
                $(".ev-allinLive").attr("data-noRe", "1");
            } else {
                $(".ev-allinLive").attr("data-noRe", "0");
            }
        },
        //本月无会议
        noMeetingShow: function () {
            var t = this;
            $(".ev-meetingNoneMouth").show();//本月无会议显示
            $(".ev-screenOptions,.ev-meetingList,.ev-doubt,.ev-screenNoResult").hide();//其他的筛选无结果 筛选tab 列表隐藏
        },
        //列表的dom结构铺设
        htmlDomFunc: function (items, flag, param, isScreening) {//isScreening判断是否来自筛选
            var t = this;
            var html = "", _str;
            $(".ev-results").text("已为您找到" + items.total + "个会议");
            $.each(items.data_list, function (k, v) {
                if (comm.getByteLen(v.conIntro) > 46) {
                    _str = '<p class="ev-absShowCut">' + (comm.getStrByteLen(v.conIntro, 66)) + '<i class="ev-absUpOrDown" data-conId="' + v.conId + '">展开</i></p>' +
                        '<p class="ev-absShowAll" style="display: none;">' + v.conIntro + '<i class="packUp ev-absUpOrDown" data-conId="' + v.conId + '">收起</i></p>';
                } else {
                    _str = '<p class="ev-absShowCut">' + v.conIntro + '</p>';
                }
                var _noShoot = "", _felOrLikeDiv;
                if (v.shootState == 1) {//唯医拍摄，表示关注
                    _noShoot = '<div class="allinLive">唯医合作</div>';
                    if (v.followState == 1) {//已关注
                        _felOrLikeDiv = '<div class="fellow fellowed ev-followBtn ev-commFollow" data-conId="' + v.conId + '">已关注</div></aside>';
                    } else {//未关注
                        _felOrLikeDiv = '<div class="fellow ev-followBtn ev-feRemind ev-commFollow" data-conId="' + v.conId + '">关注</div></aside>';
                    }
                } else {//唯医没录制，表示想看
                    _noShoot = '<div class="allinLive allinNone">合作沟通中</div>';
                    if (v.followState == 1) {//想看人数
                        _felOrLikeDiv = '<div class="fellow likeViewNum ev-followBtn"><i class="ev-likeViewPNum">' + v.followNum + '</i>人想看</div></aside>';
                    }else{//区分想看人数和想看按钮
                        if (v.runState == 1) {//多少人想看
                            _felOrLikeDiv = '<div class="fellow likeViewNum ev-followBtn"><i class="ev-likeViewPNum">' + v.followNum + '</i>人想看</div></aside>';
                        } else {//想看 0想看  1已有多少人看
                            _felOrLikeDiv = '<div class="fellow likeView ev-followBtn" data-conId="' + v.conId + '" data-likeV="' + v.followNum + '">想看</div></aside>';
                        }
                    }
                }
                html += '<li><aside class="allinFellow">' + _noShoot + <!--关注默认加类名fellow 已关注加类名fellowed 想看加类名likeView 显示想看的数量加类名likeViewNum-->
                    _felOrLikeDiv +
                    '<aside class="meetingTitle">' + (v.conTag ? '<span>' + v.conTag + '</span>' : '') +
                    '<a href="javascript:;" class="ev-meetingName">' + comm.getStrLen(v.conName, 40) + '</a></aside>' +
                    '<aside class="meetingIntroduction">' +
                    _str +
                    '</aside>' +
                    '<aside class="meetingTime">'+ (!v.startTime && !v.endTime ? '' : '<p class="mTime">' +comm.date.dateLocalJoint(v.startTime, v.endTime, "/", "-", true)+ '</p>') + (v.conAddr ? '<p class="mAddress">' + v.conAddr + '</p>' : '') + ' </aside>' +
                    '</li>';
            });
            var _kv = $(".ev-meetingList ul");
            if (flag) {//来自瀑布流
                _kv.append(html);
                t.fellowTipHide(0, isScreening);

            } else {//来自正常铺设
                _kv.html(html);
                //分页判断
                if (items.total > 20) {
                    _kv.attr("scrollPagination", "enabled");
                    t.scrollPage(param);
                } else {
                    _kv.attr("scrollPagination", "disabled");
                }
                t.fellowTipHide(true, isScreening);
            }
            t.showHideAbs();
        },
        //会议简介的展开收起
        showHideAbs: function () {
            var t = this;
            $(".ev-absUpOrDown").off("click").on("click", function () {
                if (!$(this).hasClass("packUp")) {//展开
                    $(this).parents(".ev-absShowCut").hide();
                    $(this).parents(".ev-absShowCut").siblings(".ev-absShowAll").show();
                    comm.creatEvent({
                        triggerType: '功能按钮',
                        triggerName: "展开",
                        keyword: "",
                        actionId: 11024,
                        refId: $(this).attr("data-conId"),
                        refType: "会议"
                    });
                } else {//收起
                    $(this).parents(".ev-absShowAll").siblings(".ev-absShowCut").show();
                    $(this).parents(".ev-absShowAll").hide();
                    comm.creatEvent({
                        triggerType: '功能按钮',
                        triggerName: "收起",
                        keyword: "",
                        actionId: 11025,
                        refId: $(this).attr("data-conId"),
                        refType: "会议"
                    });
                }
            });
        },
        //关注引导隐藏
        fellowTipHide: function (flag,isScreening) {
            var t = this;
            var _fellow = $(".ev-commFollow");
            $(".ev-followBtn").off("click").on("click", function () {
                if (cId &&  authState == 2|| authState == 7 || authState == 8 || authState == 9 ) {//登录认证用户 authState == 1
                    if ($(this).hasClass("ev-feRemind") || $(this).hasClass("likeView")) {//未关注的用户，点击关注 /想看的人
                        t.followOpFunc(t.path.followUrl, $(this));
                    } else {//已关注的用户，点击取消关注
                        if ($(this).hasClass("fellowed")) {//已经关注的用户
                            t.followOpFunc(t.path.cancelUrl, $(this));
                        }
                    }
                } else {
                    user.privExecute({
                        operateType: 'auth',   //'login','auth','conference'
                        callback: function () {
                        }
                    });
                }
            });
            if (flag&&!isScreening) {
                _fellow.eq(0).append('<div class="fellowTip"><p>关注会议</p><p>获得会议的最新动态</p></div>');
                setTimeout(function () {
                    $('.fellowTip').fadeOut();
                }, 3000);
                if (Date.parse(new Date()) > Date.parse('2017-09-06 00:00:00')) {
                    $('.fellowTip').fadeOut();
                }
            }
        },
        //关注操作
        followOpFunc: function (url, $this) {
            var t = this;
            if ($this.attr("data-conId")) {
                var param = {
                    paramJson: $.toJSON({
                        "refId": $this.attr("data-conId"),
                        "refName": '',
                        "customerId": cId,
                        "followType": 3
                    })
                };
                var cBack = function (rep) {
                    if (rep && rep.responseObject && rep.responseObject.responseStatus) {//关注成功
                        if ($this.hasClass("ev-feRemind")) {//未关注变成已关注
                            $this.removeClass("ev-feRemind").addClass("fellowed").text("已关注");
                            comm.creatEvent({
                                triggerType: '关注',
                                triggerName: "关注",
                                keyword: "",
                                actionId: 11022,
                                refId: $this.attr("data-conId"),
                                refType: "会议"
                            });
                        } else if ($this.hasClass("fellowed")) {
                            $this.addClass("ev-feRemind").removeClass("fellowed").text("关注");
                        }
                        if ($this.hasClass("likeView")) {//想看变成已有多少人在看
                            comm.creatEvent({
                                triggerType: '关注',
                                triggerName: "想看",
                                keyword: "",
                                actionId: 11023,
                                refId: $this.attr("data-conId"),
                                refType: "会议"
                            });
                            $this.attr("data-conId", "").removeClass("likeView").addClass("likeViewNum")
                                .html('<i class="ev-likeViewPNum">' + (parseInt($this.attr("data-likeV")) + 1) + '</i>人想看');
                        }
                    }
                };
                comm.ajax.async(url, param, cBack);
            }
        },
        //顶部导航点击事件
        tabClickFunc: function () {
            var t = this;
            var _kv = $(".ev-titleTab ul li");
            var halfWinWidth = $(window).width() / 2;
            var ulWidth = $(".ev-titleTab ul").width();
            var liWidth = ulWidth / 12;
            _kv.off("click").on("click", function () {
                var s = $(this).offset().left + $(this).outerWidth();
                $(this).addClass("active").siblings("li").removeClass("active");
                if ($(this).index() != _nowMonth - 1) {//当前点击不是当前月分
                    $(".ev-meetingState").hide().parents(".ev-screenOptions").addClass("screenTwo");
                } else {//当前点击是当前月份
                    $(".ev-meetingState").show().parents(".ev-screenOptions").removeClass("screenTwo");
                }
                //水平居中
                if ($(this).offset().left + $(".ev-titleTab").scrollLeft() > halfWinWidth) {
                    $(".ev-titleTab").scrollLeft($(".ev-titleTab").scrollLeft() + s - halfWinWidth - liWidth / 2);
                } else {
                    $(".ev-titleTab").scrollLeft(0);
                }
                var _thisMonth = parseInt($(this).text()) > 9 ? parseInt($(this).text()) : '0' + parseInt($(this).text());
                var _time = comm.date.local_time(new Date()).substr(0, 5) + _thisMonth;
                var param = {
                    openTime: _time
                };
                t.allCommAjax(param, 1);
                //t.shareFnCon(param);//分享的ajax请求
                t.shareFn(param);
                comm.creatEvent({
                    triggerType: '会议tab',
                    triggerName: "会议预告月份tab",
                    keyword: parseInt($(this).text()),
                    actionId: 11013
                });
            });
            if (comm.getpara().time) {//分享回来的链接
                _kv.eq(parseInt(comm.getpara().time) - 1).click();
            } else {
                //初始化默认选中
                _kv.eq(_nowMonth - 1).click();
            }
        },
        shareFnCon: function (kv) {
            var t = this;
            var param = {};
            param.time = kv.openTime;
            $.ajax({
                url: t.path.shareUrl,
                async:false,
                type:"post",
                dataType:"json",
                data: {paramJson:$.toJSON({
                    resourceType: 3,
                    sceneType: 2,
                    openTime: kv.openTime,
                    platformId: TempCache.getItem('department') || 1
                })},
                success: function (rep) {
                    var items = rep.responseObject.responseData.data_list[0];
                    var  shareTitle = items.share_comm.shareTitle != "" ? items.share_comm.shareTitle : document.title;
                    param.pic = items.share_comm.shareImageUrl;
                    param.title = shareTitle;
                    $.each(items.share_channel, function (i, el) {
                        if (el.shareChannel == 'Sina') {//新浪
                            param.sinaTitle = el.shareDesc;
                            param.sinaDesc = el.shareDesc;
                        } else if (el.shareChannel == "QZone") {//QQ空间
                            param.qzoneTitle = el.shareTitle;
                            param.qZoneSummary = el.shareDesc;
                        } else if (el.shareChannel == "WechatFriend") {//微信好友
                            param.wxTitle = el.shareTitle;
                            param.wxDesc = el.shareDesc;
                        } else if (el.shareChannel == "WechatTimeline") {//微信朋友圈
                            param.timelineTitle = el.shareTitle;
                            param.timelineSummary = el.shareDesc;
                        }
                    });
                }
            });
            return param;
        },
        //右上角的分享按钮
        shareFn: function (x) {
            var t= this;
            var kv ={};
            shareAll({
                url: window.location.href + "?time=" + x.openTime.substr(5, 7)  + "&platId=" + TempCache.getItem('department') || 1,//不传默认取当前地址
                fnMessageSuc: function () {
                    comm.shareLog({
                        shareType: 3,
                        resourceId: "",
                        resourceType: 3,
                        refId: "",
                        isValid: 1,
                        shareSence: 25,
                        shareChannel: 4,
                        shareContent: kv.sinaTitle
                    });
                },
                fnTimelineSuc: function () {
                    comm.shareLog({
                        shareType: 3,
                        resourceId: "",
                        resourceType: 3,
                        refId: "",
                        isValid: 1,
                        shareSence: 25,
                        shareChannel: 5,
                        shareContent: kv.shareTitle
                    });
                },
                qShareLog: function (o) {
                    comm.shareLog({
                        shareType: 3,
                        resourceId: "",
                        resourceType: 3,
                        refId: "",
                        isValid: 1,
                        shareSence: 25,
                        shareChannel: o == 'sina' ? 3 : 1,
                        shareContent: o == 'sina' ?
                            kv.sinaTitle : kv.qZoneDesc
                    });
                },
                triggerRequest:function(){
                    kv = t.shareFnCon(x);
                    return kv;
                }
            }, false, $('.ev-shareBtn'));
        },
        //瀑布流滚动加载列表
        scrollPage: function (param) {
            var t = this;
            var _kv = $(".ev-meetingList ul");
            var pageIndex = 2;
            var params = {
                scene: 2,//场景（0-会议频道页，1-我关注的会议，2-会议预告）	2
                sessionCustomerId: cId,	//用户ID
                subjectTeamId: param.subjectTeamId ? param.subjectTeamId : "",	//专业标签（0-无标签，9999-综合，10000-其他，2-关节，7-脊柱，9-创伤）
                runState: param.runState ? param.runState : "",	//会议状态（0-未进行，1-已进行）
                shootState: param.shootState ? param.shootState : "",	//拍摄状态（0-不拍摄，1-拍摄）
                openTime: param.openTime ? param.openTime : "",	//时间筛选
                platformId: TempCache.getItem('department') || 1,	//平台（1-骨科，2-手外科）
                pageIndex: pageIndex,
                pageSize: t.config.pageSize
            };
            _kv.off("scroll").scrollPagination({
                'contentPage': t.path.getMapListV4Url,
                'contentData': $.extend(params, {
                    pageIndex: function () {
                        return pageIndex++;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset': 0,
                'delaytime': 0,
                'type': "post",
                'beforeLoad': function () {
                    comm.loading.show();
                },
                'afterLoad': function (elementsLoaded) {
                    comm.loading.hide();
                },
                'loader': function (data) {
                    if ($.isEmptyObject(data)) {
                        _kv.attr("scrollPagination", "disabled");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            _kv.attr("scrollPagination", "disabled");
                            return false;
                        } else {
                            var items = data.responseObject.responseData;
                            t.htmlDomFunc(items, 1);
                        }
                    }
                }
            });
        }
    };
    controller.init();
});
