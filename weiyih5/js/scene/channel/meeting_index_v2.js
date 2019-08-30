/**
 * 会议首页相关功能改版
 * Created by HJ on 2017/8/2.
 */

$(function () {
    //window.onload = Log.createBrowse(42, "会议列表页面"); //	浏览日志
    var cId = TempCache.getItem("userId");
    var authState = JSON.parse(TempCache.getItem("auth")) ? JSON.parse(TempCache.getItem("auth")).state : "";
    comm.footerNav();
    var meetingIndex = {
        opt: {
            clickNum: 0,
            pageSize: 20,
            jsonData:{}
        },
        path: {
            bannerUrl: M_CALL + 'conference/index/getBannerList/',//banner广告位
            getMapListV4Url: M_CALL + 'conference/index/getMapListV4/',//页面主列表
            scrBtnUrl: M_CALL + "conference/index/getScreeningCondition/"//筛选项按钮的url
        },
        init: function () {
            var t = this;
            t.webpImg();
            t.appWakeUpFunc(); //唤醒app
            t.shareLog();//分享日志
            t.backToTop();//返回顶部
            t.slideUp();//骨科手外科切换
            t.bannerList();//页面banner图
            t.scrDomFun();//筛选项dom结构
            t.loadMainList();//页面的主函数
            t.createEventPoint();//跳转埋点
        },
        webpImg:function(){
            var UA = navigator.userAgent;
            if(UA.indexOf('Android')>-1){
                if(UA.split('Android ')[1][0]>=4){  //android 4.0版本以上
                    $.each($('img[webpSrc]'),function(i,el){
                        if($(el).attr('webpSrc')){
                            $(el).on('load',function(){
                                $(el).attr('src',$(el).attr('webpSrc'));
                            });
                        }
                    });
                }
            }
        },
        //唤醒app
        appWakeUpFunc: function () {
            comm.appWakeUp('btn');
        },
        //我关注的会议、会议预告跳转埋点
        createEventPoint: function () {
            var t = this;
            $(".ev-navTabClick ul li").on("click", function () {
                if ($(this).index() == 0) {
                    comm.creatEvent({
                        triggerType: '会议tab',
                        triggerName: "首页-会议tab",
                        keyword: "我关注的会议",
                        actionId: 11011
                    });
                } else {
                    comm.creatEvent({
                        triggerType: '会议tab',
                        triggerName: "首页-会议tab",
                        keyword: "会议预告",
                        actionId: 11011
                    });
                }
            });
        },
        //年月选中日期转换
        transitionDate: function (dataArr) {
            var dateStr = '';
            for (var i = 0, maxI = dataArr.length; i < maxI; i++) {
                if ((dataArr[i].month) && (dataArr[i].month != '') && (dataArr[i].month != '0')) {
                    var dataMonth = dataArr[i].month.split(',');
                    for (var j = 0, maxJ = dataMonth.length; j < maxJ; j++) {
                        if (dataMonth[j] != '') {
                            dateStr += dataArr[i].year + '-' + (dataMonth[j].slice(0, dataMonth[j].length - 1)>9?dataMonth[j].slice(0, dataMonth[j].length - 1):'0'+dataMonth[j].slice(0, dataMonth[j].length - 1)) + '_';
                        }//小灰灰你竟然在代码里下毒
                    }
                } else {
                    dateStr += dataArr[i].year + '_';
                }

            }
            dateStr = dateStr.slice(0, dateStr.length - 1);
            if (dateStr == '全部') {
                dateStr = '';
            }
            return dateStr;
        },
        //分享日志,只在微信浏览器端的分享
        shareLog: function () {
            shareAll({
                title: document.title,
                pic: 'https://m.allinmd.cn/image/allin_logo.png',
                summary: $('meta[name="keywords"]').attr('content'),
                fnMessageSuc: function () {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: 3,
                        refId: "",
                        isValid: 1,
                        shareSence: 25,
                        shareChannel: 4,
                        shareContent: document.title
                    });
                },
                fnTimelineSuc: function () {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: 3,
                        refId: "",
                        isValid: 1,
                        shareSence: 25,
                        shareChannel: 5,
                        shareContent: document.title
                    });
                }
            }, true);
        },
        //回到顶部
        backToTop: function () {
            var t = this;
            var scrollTop = 0;
            $(window).scroll(function () {
                scrollTop = $(window).scrollTop();
                if (scrollTop > 100) {
                    $('.al-footerBarItemBackToTop').show();
                } else {
                    $('.al-footerBarItemBackToTop').hide();
                }
            });
            $('.al-footerBarItemBackToTop').on('click', function (e) {
                if (t.opt.clickNum == 1) {
                  g_sps.jump(null,location.href);
                } else {
                    t.opt.clickNum = 1;
                    setTimeout(function () {
                        t.opt.clickNum = 0;
                        $('html body').stop().animate({scrollTop: 0}, 300);
                    }, 500);
                    e.preventDefault();
                    return false;
                }
            });
        },
        //骨科手外科切换
        slideUp: function () {
            var _h = $('.al-indexHeader').outerHeight();
            $(window).on('scroll touchmove', function () {
                if (!$(".ev-screenOption").is(":visible")) {
                    if ($(window).scrollTop() > _h) {
                        $('.al-indexHeader').stop().animate({height: 0}, 100);
                        //$('.searchCont').stop().animate({height:0},100);
                        if ($('.ev_switchPlatform').hasClass('al-personalSelectorOn')) {
                            $('.ev_switchPlatform').removeClass('al-personalSelectorOn');
                            comm.creatEvent({
                                triggerType: '骨科&手外科切换(取消)',
                                keyword: "骨科&手外科切换(取消)",
                                actionId: 3
                            });
                        }
                    } else {
                        $('.al-indexHeader').stop().animate({height: _h}, 100);
                        //$('.searchCont').stop().animate({height:'1.12rem'},100);
                    }
                }
            });
        },
        //banner图接口请求铺设
        bannerList: function () {
            var t = this;
            //先加载本地缓存数据，请求结束后替换
            if(TempCache.getItem('meetFirstScreenData')){
                var _tempData = JSON.parse(TempCache.getItem('meetFirstScreenData'));
                var item = _tempData.bannerData;
                if(item){
                    t.bannerData(item);
				}else{
					$('#ev_imgWrap').html("").hide();
                }
            }
            var param = {
                paramJson: $.toJSON({
                    visitSiteId: 2,
                    platformId: TempCache.getItem('department') || 1,
                    customerId: cId ? cId : ""
                })
            };
            var callback = function (rep) {
                if (comm.hasResponseData(rep) && rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length) {
                    t.opt.jsonData.bannerData = rep;
                    t.bannerData(rep);
                } else {
                    $('#ev_imgWrap').hide();
                }
            };
            comm.ajax.async(t.path.bannerUrl, param, callback);
        },
        bannerData:function(rep){
            var t = this;
            var res = [];
            if(comm.hasResponseData(rep)&&rep.responseObject.responseData.data_list.length){
				res = rep.responseObject.responseData.data_list;
            }
            var recentMeeting = "", _recentMeet = "";
            //轮播图开始
            $.each(res, function (i, e) {
                _recentMeet += ' <figure class="swiper-slide al-carouselBannerItem">' +
                '<a href="' + (e.linkUrl ? e.linkUrl : 'javascript:;') + '" adId="'+e.id+'">' +
                '<img src="' + (/:/.test(e.adAttUrl) ? e.adAttUrl : "https:" + e.adAttUrl) + '" alt="' + e.adAttName + '">' +
                '</a>' +
                '</figure>';
            });
            recentMeeting = '<section class="swiper-wrapper">' + _recentMeet + '</section><section class="swiper-pagination"></section>';
            //轮播图的添加
            $('#ev_imgWrap').html(recentMeeting);
            t.bannerSwiper();
            //轮播图结束
        },
        //banner轮播图埋点，swiper轮播
        bannerSwiper: function () {
            if ($('.swiper-slide').length > 1) {
                var indexCarousel = new Swiper("#ev_imgWrap", {
                    direction: 'horizontal',
                    loop: true,
                    autoplay: 3000,
                    speed: 500,
                    pagination: '.swiper-pagination',
                    autoplayDisableOnInteraction: false
                });
                //埋点
                $('.swiper-wrapper a').click(function () {//$('.swiper-slide-active')
                    var param=$(this).attr("href")+"$"+$(this).attr("adId");
                    comm.creatEvent({
                        triggerType: '广告位',
                        keyword: "广告位-轮播图(会议)-" + $(this).find('img').attr('alt'),
                        actionId: 14,
                        param:param,
                        locationId: parseInt($('.swiper-slide-active').attr('data-swiper-slide-index')) + 1,
                        refId: $(this).attr('href')
                    });
                });
            } else {
                $('.swiper-wrapper a').click(function () {
                    var param=$(this).attr("href")+"$"+$(this).attr("adId");
                    comm.creatEvent({
                        triggerType: '广告位',
                        keyword: "广告位-轮播图(会议)-" + $(this).find('img').attr('alt'),
                        actionId: 14,
                        locationId: 1,
                        param:param,
                        refId: $(this).attr('href')
                    });
                });
            }

        },
        //主列表请求加载
        loadMainList: function (param, flag) {//flag来自于筛选
            var t = this;
            var params = {
                scene: 0,//场景（0-会议频道页，1-我关注的会议，2-会议预告）
                platformId: TempCache.getItem('department') || 1,
                subjectTeamId: param && param.subjectTeamId ? param.subjectTeamId : "",
                openTime: param && param.openTime ? param.openTime : "",
                pageIndex: 1,
                pageSize: t.opt.pageSize
            };
            if(TempCache.getItem('meetFirstScreenData')){
                var _tempData = JSON.parse(TempCache.getItem('meetFirstScreenData'));
                var item = _tempData.listData.responseObject.responseData;
                if(item){
					t.meetingDomList(item,0,params,flag);
                }
                
            }
            var _kv = $("nav.al-indexNavbar ul li span").eq(3);
            var callback = function (rep) {
                if (comm.hasResponseData(rep) && rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length) {
                    t.opt.jsonData.listData = rep;
                    TempCache.setItem('meetFirstScreenData',JSON.stringify(t.opt.jsonData));
                    var res = rep.responseObject.responseData;
                    $(".ev-aListNum").text('已为您找到' + res.total + '个会议');//列表顶部的会议总数
                    t.meetingDomList(res, 0, params, flag);//会议主列表
                    $(".ev-meetingList").show();
                    $(".ev-screenNone").hide();
                    if (res.liveState == 1) {//有直播的会议
                        if (!_kv.find("i").length) {
                            _kv.append("<i></i>");
                        }
                    } else {
                        if (_kv.find("i").length) {
                            _kv.find("i").remove();
                        }
                    }
                } else {//默认没有列表的时候
                    $(".ev-screenNone").show();//筛选无结果
                    $(".ev-meetingList").hide();//筛选列表隐藏
                    if (_kv.find("i").length) {
                        _kv.find("i").remove();
                    }
                    $(".ev-meetingList ul").attr("scrollPagination", "disabled");
                }
            };
            comm.ajax.async(t.path.getMapListV4Url, {paramJson: $.toJSON(params)}, callback);
        },
        //主列表dom结构铺设
        meetingDomList: function (res, flag, param, screening) {
            var t = this, conferenceList = "";
            //主列表开始
            $.each(res.data_list, function (k, v) {
                conferenceList += '<li>' +
                    (v.isLive == 1 ? '<p class="meetingLive"></p>' : '') + ' <aside class="meetingTitle">' +
                    ( v.conTag ? '<span>' + v.conTag + '</span>' : '') +
                    '<a href="/pages/conference/meeting_detail.html?conId=' + v.conId + '" class="ev-meetingName">' + comm.getStrLen(v.conName, 40) + '</a></aside>' +
                    '<aside class="meetingTime">'+ (!v.startTime && !v.endTime ? '' : '<p class="mTime">' +comm.date.dateLocalJoint(v.startTime, v.endTime, "/", "-", true)+ '</p>') +
                    (v.conAddr ? '<p class="mAddress">' + v.conAddr + '</p>' : '') + '</aside></li>';
            });
            var _kv = $(".ev-meetingList ul");
            if (flag) {
                _kv.append(conferenceList);
            } else {
                _kv.html(conferenceList);
                //分页判断
                if (res.total && parseInt(res.total) > 20) {
                    _kv.attr("scrollPagination", "enabled");
                    //区分筛选和正常铺设
                    t.scrollPage(param);
                } else {
                    _kv.attr("scrollPagination", "disabled");
                }
            }
            //主列表结束
        },
        //首页推荐的筛选，和筛选列表里的筛选项的dom铺设
        scrDomFun: function () {
            var t = this;
            //先加载本地缓存数据，请求结束后替换
            if(TempCache.getItem('meetFirstScreenData')){
                var _tempData = JSON.parse(TempCache.getItem('meetFirstScreenData'));
                var item = _tempData.tagData;
                if(item){
                	t.tagData(item);
				}
            }
            var cBack = function (rep) {
                if (comm.hasResponseData(rep)) {
                    t.opt.jsonData.tagData = rep;
                    t.tagData(rep);
                } else {
                    $(".ev-screenListNav").hide();
                }
            };
            comm.ajax.async(t.path.scrBtnUrl, {
                paramJson: $.toJSON({
                    sessionCustomerId: cId,
                    platformId: TempCache.getItem('department') || 1
                })
            }, cBack);
        },
        tagData:function(rep){
            var t = this, html = "", html2 = "";
            var _kv = $(".ev-screenListNav>ul");
            var res = rep.responseObject.responseData;
            if (res.authMajorList && res.authMajorList.length > 0) {
                html = "";
                html2 = "";
                //首页推荐专业年份循环开始
                $.each(res.authMajorList, function (i, e) {//首页推荐的筛选标签
                    html += '<li class="ev-scrTopNav ' + (e.tagType == 1 ? 'ev-scrMajor' : 'ev-scrYear') + '" data-tagId="' + e.tagId + '" data-tagType="' + e.tagType + '">' + e.tagName + '</li>';
                });
                _kv.html(html);
                //首页推荐专业年份循环结束
            }
            //筛选的全部列表专业年份循环开始
            if (res.majorList && res.majorList.length > 0) {
                _kv.append('<li class="ev-screeningBtn" data-flag="1">筛选<i></i></li>');//<li class="ev-scrMajor" data-tagId="2" data-tagType="1">关节</li>
                //专业循环开始
                $.each(res.majorList, function (k, v) {
                    html2 += '<span data-tagId="' + v.tagId + '" data-tagType="' + v.tagType + '">' + v.tagName + '</span>';
                });
                $(".ev-majorList").html(html2);
                //专业循环结束
            }
            //筛选的全部列表专业年份循环结束
            t.scrClickFunc();
        },
        //顶部推荐筛选项的点击事件
        scrClickFunc: function () {
            var t = this;
            //筛选项的专业按钮的点击事件
            $(".ev-scrMajor").off("click").on("click", function () {
                var _typeId = $(this).attr("data-tagId") ? $(this).attr("data-tagId") : "";
                if ($(".ev-screenOption").is(":visible")) {
                    t.scrPopCloseFun();
                }
                var params = {};
                //判断有没有年份选中增加参数
                params.openTime = t.transitionDate(t.timeClickParam());
                //判断专业的激活状态选中取消的class
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active").attr("data-scMC1", 0);
                    params.subjectTeamId = "";
                } else {
                    $(this).addClass("active").attr("data-scMC1", 1).siblings(".ev-scrMajor").removeClass("active").attr("data-scMC1", 0);
                    params.subjectTeamId = _typeId;
                }
                t.loadMainList(params);
                comm.creatEvent({
                    triggerType: '筛选',
                    triggerName: "会议推荐筛选项",
                    keyword: $(this).text(),
                    actionId: 11014
                });
                //判断专业类型关联
                $.each($(".ev-majorList span"), function (i, e) {
                    if ($(e).attr("data-tagId") == _typeId) {
                        if ($(this).hasClass("active")) {//专业取消
                            $(this).removeClass("active");
                        } else {//专业选中
                            $(this).addClass("active").siblings().removeClass("active");
                        }
                        return false;
                    }
                });
            });
            //筛选项的时间按钮的点击事件
            $(".ev-scrYear").off("click").on("click", function () {
                var _yVal = $(this).attr("data-tagId") ? $(this).attr("data-tagId") : "";
                var param = {};
                //判断专业是否有选中增加参数
                param.subjectTeamId = t.majorClickParam();
                if ($(".ev-screenOption").is(":visible")) {
                    t.scrPopCloseFun();
                }
                //选中取消的class
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active").attr("data-scMC1", 0);
                    param.openTime = "";
                } else {
                    $(this).addClass("active").attr("data-scMC1", 1);
                    param.openTime = _yVal;
                }
                t.loadMainList(param);
                comm.creatEvent({
                    triggerType: '筛选',
                    triggerName: "会议推荐筛选项",
                    keyword: $(this).text(),
                    actionId: 11014
                });
                //判断年份关联
                $.each($(".ev-yearList span"), function (i, e) {
                    if ($(e).text() == _yVal) {
                        if ($(this).hasClass("active")) {//年份取消
                            $(this).removeClass("active").attr({
                                "data-load": 1,
                                "data-month": ""
                            }).find(".ev-sOrHMon").hide();
                            $(".ev-allYear").removeClass("active");
                            $('.ev-monthTwo').hide();
                        } else {//年份选中
                            $(this).addClass("active").attr({
                                "data-load": 0,
                                "data-month": 0
                            }).find(".ev-sOrHMon").show();
                            $(".ev-allYear").addClass("active");
                            $('.ev-monthTwo').show();
                        }
                        return false;
                    }
                });
            });
            //筛选按钮的点击事件
            $(".ev-screeningBtn").off("click").on("click", function () {
                if ($(this).attr("data-flag") == 1) {//点击展开
                    t.scrTopVal = $(window).scrollTop();
                    $(this).attr("data-flag", "0");//设置成不能点击展开
                    $(this).addClass("active");
                    $('.screenListNav').addClass('screenFixed');//增加定位
                    $(".ev-screenTop").hide();//导航顶部隐藏
                    $(".ev-screenOption,.ev-screenShadow").show();
                    $(".screenFixed").css("top", $(".fixedHeader").height() - 2);//定位的高度
                    $("body,html,.al-mainInner").css({
                        height: "100%",
                        overflow: "hidden"
                    });
                    //t.scrollFollowEvent();
                    //进行专业和时间的循环添加初始状态
                    t.sureStateTime;//确定后记录时间选中状态的数组
                    t.sureStateMajor;//确定后记录专业选中状态的数组
                    if(t.sureStateTime&&t.sureStateTime.length){
                        $.each(t.sureStateTime,function(i,e){
                            $.each($(".ev-yearList span"), function (k, v) {
                                if($(v).attr("data-tagId")== e.year){
                                    $(v).addClass("active").attr("data-month", e.month);
                                }
                            });
                        });
                    }
                    if(t.sureStateMajor&&t.sureStateMajor.length){
                        $.each(t.sureStateMajor,function(i,e){
                            $.each($(".ev-majorList span"), function (k, v) {
                                if($(v).attr("data-tagId")== e.tagId){
                                    $(v).addClass("active").attr("data-sureR","1");
                                    return false;
                                }
                            });
                        });
                    }
                } else {
                    t.scrPopCloseFun();
                }
                comm.creatEvent({
                    triggerType: '筛选',
                    triggerName: "会议btn-筛选项呼出",
                    keyword: "",
                    actionId: 11015
                });
            });
            //点击空白处关闭筛选弹层
            $(".ev-screenShadow,.al-footerBar").off("click").on("click", function () {//footer点击特殊处理
                if ($(".ev-screenOption").is(":visible")) {
                    t.scrPopCloseFun();
                    if($(".ev-scrMajor").length){
                        //顶部专业和弹层里专业的循环
                        $(".ev-scrMajor").each(function (i, e) {//顶部的年份和专业
                            if ($(e).attr("data-scMC1") == 1) {
                                $(".ev-majorList span").each(function (k, v) {//筛选弹层里的
                                    if ($(v).attr("data-tagId") == $(e).attr("data-tagId")) {
                                        $(e).addClass("active");
                                        $(v).addClass("active").siblings().removeClass("active");
                                        return false;
                                    } else {
                                        $(v).removeClass("active");
                                    }
                                });
                                return false;
                            } else {
                                $(e).removeClass("active");
                                $.each($(".ev-majorList span"), function (k, v) {//筛选列表里的年份和专业
                                    $(v).removeClass("active");
                                });
                            }
                        });
                    }else{
                        $.each($(".ev-majorList span"), function (k, v) {//筛选列表里的年份和专业
                            if($(v).attr("data-sureR")!=1) {
                                $(v).removeClass("active");
                            }
                        });
                    }
                    if($(".ev-scrYear").length){
                        //顶部年份和筛选列表里的循环
                        $(".ev-scrYear").each(function (i, e) {//顶部的年份
                            if ($(e).attr("data-scMC1") == 1) {
                                $.each($(".ev-yearList span"), function (k, v) {//筛选列表里的年份
                                    if ($(v).attr("data-tagId") != $(e).attr("data-tagId")) {
                                        $(v).removeClass("active").attr({"data-load":1,"data-new":false,"data-month":""});
                                        $(".ev-monthTwo").hide().find("ul li").removeClass("active");//月份重置
                                    } else {
                                        $(e).addClass("active");
                                        $(v).addClass("active");
                                        $(v).attr("data-month", "0");
                                    }
                                });
                            } else {
                                $(e).removeClass("active");
                                $.each($(".ev-yearList span"), function (k, v) {//筛选列表里的年份和专业
                                    $(v).removeClass("active").attr({"data-load":1,"data-new":false,"data-month":""});
                                    $(".ev-monthTwo").hide().find("ul li").removeClass("active");//月份重置
                                });
                            }
                        });
                    }else{
                        $.each($(".ev-yearList span"), function (k, v) {//筛选列表里的年份和专业
                            if($(v).attr("data-sureR")!=1){
                                $(v).removeClass("active").attr({"data-load":1,"data-new":false,"data-month":""});
                                $(".ev-monthTwo").hide().find("ul li").removeClass("active");//月份重置
                            }
                        });
                    }
                }
            });
            t.scrMoreCon();//展开更多的内容区
        },
        //弹层滚动跟随
        scrollFollowEvent: function () {
            var t = this;
            $(window).bind("scroll", function () {
                $(".screenFixed").css("top", $(".fixedHeader").height() - 2);//定位的高度
            });
        },
        //确定按钮点击后判断关联
        topNavActShow: function (yearArr) {
            var t = this;
            //时间的关联
            $.each(yearArr, function (i, e) {
                $.each($(".ev-scrYear"), function (k, v) {
                    if ($(v).text() == e.year && e.month == 0) {
                        $(v).addClass("active");
                    } else {
                        $(v).removeClass("active");
                    }
                });
            });
            //判断关联顶部专业
            $.each($(".ev-scrMajor"), function (i, e) {
                $.each($(".ev-majorList span"), function (k, v) {
                    if ($(v).hasClass("active")) {
                        if ($(e).attr("data-tagId") == $(v).attr("data-tagId")) {
                            $(e).addClass("active").attr("data-scMC2", 1).siblings(".ev-scrMajor").removeClass("active");
                            return false;
                        } else {
                            $(e).removeClass("active").attr("data-scMC2", 0);
                        }
                    } else {
                        $(e).removeClass("active").attr("data-scMC2", 0);
                    }
                });
            });
        },
        //筛选弹层的相关事件，展开更多的内容区函数
        scrMoreCon: function () {
            var t = this;
            module.selectDate({
                yearContainer: $('.ev-yearList'),//包含年份的标签
                yearEle: 'span',//包裹年的元素，默认是li标签
                isAllYear: false,//年列表是否需要全部按钮
                monthContainer: $('.ev-monthTwo'),//包含月份的标签
                year: 2014,
                insure: $('.ev-sureBtn'),//确定按钮
                reset: $('.ev-resetBtn'),//重置按钮
                yearcallBack: function ($this) {//点击年的时候回调
                    comm.creatEvent({
                        triggerType: '筛选',
                        triggerName: "btn-筛选项年份选择",
                        keyword: $this.text(),
                        actionId: 11017
                    });
                },
                monthcallBack: function ($this, monthText) {//点击月的时候回调
                    comm.creatEvent({
                        triggerType: '筛选',
                        triggerName: "btn-筛选项月份选择",
                        keyword: monthText,
                        actionId: 11018
                    });

                },
                monthAllcallBack: function ($this, monthText) {//全选按钮的回调函数
                    comm.creatEvent({
                        triggerType: '筛选',
                        triggerName: "btn-筛选项月份选择",
                        keyword: monthText,
                        actionId: 11018
                    });
                },
                callBack: function (yearArr) {//点击确定回调函数
                    if ($(".ev-sureBtn").hasClass("active")) {
                        t.scrPopCloseFun();
                        var param = {
                            openTime: t.transitionDate(yearArr)
                        };
                        param.subjectTeamId = t.majorClickParam();
                        t.loadMainList(param, 1);
                    }
                    comm.creatEvent({
                        triggerType: '筛选',
                        triggerName: "btn-筛选项确定",
                        keyword: "",
                        actionId: 11019
                    });
                    t.topNavActShow(yearArr);
                    t.sureStateTime=yearArr;//确定后记录时间选中状态的数组
                    var sureStateMajor=[];//确定后记录专业选中状态的数组
                    var _obj={};
                    $.each($(".ev-majorList span"), function (i, e) {
                        if ($(e).hasClass("active")) {
                            $(e).attr("data-sureR","1");//来源为确定按钮，保证顶部没有相关关联的时候，确定筛选确定了
                            _obj.tagId = $(e).attr("data-tagId");
                            _obj.sureR = $(e).attr("data-sureR");
                            sureStateMajor.push(_obj);
                            t.sureStateMajor=sureStateMajor;
                            return false;
                        } else {
                            $(e).attr("data-sureR","0");
                            t.sureStateMajor=sureStateMajor;
                        }
                    });
                },
                resetcallBack: function () {//重置按钮回调函数
                    $(".ev-screenOne span,.ev-scrMajor,.ev-scrYear").removeClass("active");//选中专业年份重置
                    $(".ev-monthTwo").hide().find("ul li").removeClass("active");//月份重置
                    $(".ev-yearList span").find("i").hide();
                    $(".ev-majorList span").attr("data-sureR","0");//重置按钮将确定
                }
            });
            var _topNav;
            //专业的点击筛选
            $(".ev-majorList span").off("click").on("click", function () {
                var _typeId = $(this).attr("data-tagId") ? $(this).attr("data-tagId") : "";
                _topNav = $(this);
                if ($(this).hasClass("active")) {//专业取消
                    $(this).removeClass("active");
                } else {//专业选中
                    $(this).addClass("active").siblings().removeClass("active");
                }
                comm.creatEvent({
                    triggerType: '筛选',
                    triggerName: "btn-筛选专业选择",
                    keyword: $(this).text(),
                    actionId: 11016
                });
            });
        },
        //循环遍历专业的点击选中事件（确定筛选参数）
        majorClickParam: function () {
            var subjectTeamId;
            $.each($(".ev-majorList span"), function (i, e) {
                if ($(e).hasClass("active")) {
                    subjectTeamId = $(e).attr("data-tagId");
                    return false;
                } else {
                    subjectTeamId = "";
                }
            });
            return subjectTeamId;
        },
        //循环时间的点击参数（确定筛选参数）
        timeClickParam: function () {
            var yearArr = [];
            $(".ev-yearList span").each(function (index, ele) {
                if ($(ele).hasClass('active')) {
                    if ($(ele).attr('data-month') != '' || $(ele).text() == '全部') {
                        var yearObj = {};
                        yearObj.year = $(ele).text();
                        yearObj.month = $(ele).attr('data-month');
                        yearArr.push(yearObj);
                    } else {
                        $(ele).removeClass('active')
                    }
                }
            });
            return yearArr;
        },
        //筛选弹层关闭
        scrPopCloseFun: function () {
            var t = this;
            $(".ev-screenOption,.ev-screenShadow").hide();//弹层弹层遮罩隐藏
            $(".ev-monthTwo").hide();//月份隐藏
            $('.screenListNav').removeClass('screenFixed');//增加定位
            $(".ev-screeningBtn").removeClass("active").attr("data-flag", "1");//筛选按钮取消选中
            $("body,html,.al-mainInner").css({height: "auto", overflow: "auto"});
            $(".ev-screenTop").show();//导航顶部显示
            $.each($(".ev-yearList span"), function (i, e) {
                if ($(e).find("i").length) {
                    $(e).find("i").hide();
                }
            });
            $(window).scrollTop(t.scrTopVal);
        },
        //瀑布流滚动加载列表
        scrollPage: function (param) {
            var t = this;
            var _kv = $(".ev-meetingList ul");
            var pageIndex = 2;
            var params = param;
            params.pageIndex = pageIndex;
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
                            t.meetingDomList(items, 1);
                        }
                    }
                }
            });
        }

    };
    meetingIndex.init();
});

