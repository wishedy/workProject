/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：
 *     作用：
 *
 * Created by HJ on 2017/7/3.
 */
$(function () {
    var activityId = $("#activityId").val();
    // $('.spTemp_total_down').html(comm.actSkeleton());//增加灰度骨架屏样式
    var specialTemplate = {
        config: {
            resUrl: M_CALL + "activity/menu/layout/module/getResourceMapList/",//资源列表请求
            shareUrl: M_CALL + "cms/activity/getById/",//分享接口
            areaListUrl: M_CALL + "cms/activity/getAreaList/",//赛区入口列表
            getEventConfigList: M_CALL + "activity/event/getEventConfigList/",//报名流程步骤展示接口
            json_list_v2: M_CALL + "customer/trends/json_list_v2/",//我的作品列表
            getRegisterStatus: M_CALL + "activity/register/getRegisterStatus/",//判断用户是否报名的接口
            expertsCus: M_CALL + "activity/api/isExpert/"//判断专家用户
        },
        init: function () {
            var t = this;
            t.expertsFun();
            t.navAdap();
            t.tabClick();
            t.buildArguments();
            t.bannerSwiper();
            t.navFixed();
            if ($(".spTemp_total_nav_list li").length == 1) {
                $(".spTemp_total_nav").hide();
            }
            if(comm.browser.versions.iPhoneX){
                $(".Ev-ShareBtn").css({position: 'fixed', bottom: "1.4533rem"});
            }
        },
        expertsFun: function () {
            var t = this;
            if (!appjs.getAuthorCustomerId()) {//用户未登录
                $(".spTemp_total_nav_list li").each(function (i, em) {
                    if ($(em).find("span").text().indexOf("待评作品") > -1) {
                        $(em).remove();
                        if (comm.getpara("#").navText == $(em).find("span").attr("data-navtext")) {
                            $(".spTemp_total_nav_list li span").eq(0).click();
                        }
                    }
                });
                t.signUpBtn();
                $(".spTemp_total_nav_list li span").on("click", function () {
                    if ($(this).text().indexOf("我的作品") > -1) {
                        var a = window.location.pathname + location.search;
                        if (a.indexOf("#") < 0) {
                            a += "#";
                        }
                        var href = a + "&navText=" + $(this).data("navtext");
                        // g_sps.jump(null,href);
                        location.replace(href);
                        if(appjs.myWorksPermission){
                            appjs.myWorksPermission();
                        }
                    }
                });
            } else {//用户登录了 判断专家权限
                t.authUserShow();
            }
        },
        //登录用户判断专家权限，厂商权限
        authUserShow: function (flag) {
            var t = this;
            if (appjs.getCustomerRole) {
                if (appjs.getCustomerRole() != 3 && appjs.getCustomerRole() != 2 && appjs.getCustomerRole() != 4) {//0游客 1系统 2组织 3厂商 4患者 5普通医师 6认证医师
                    var param = {
                        paramJson: $.toJSON({
                            activityId: $("#activityId").val(),
                            customerId: appjs.getAuthorCustomerId()
                        })
                    };
                    var callback = function (rep) {
                        if (!comm.hasResponseData(rep)) {
                            return false;
                        }
                        var _isExpert = rep.responseObject.responseData.isExpert;
                        t.isExpert = _isExpert;
                        if (_isExpert == 1) {//专家用户
                            $(".spTemp_total_nav_list li").each(function (i, em) {
                                if ($(em).find("span").text().indexOf("我的作品") > -1) {
                                    if (comm.getpara("#").navText == $(em).find("span").attr("data-navtext")) {
                                        //专家用户点击我的作品进行登录处理
                                        $(".spTemp_total_nav_list li").each(function (k, v) {
                                            if ($(v).find("span").text().indexOf("待评作品") > -1) {
                                                $(v).find("span").click();
                                                return false;
                                            }
                                        });
                                    }
                                    $(em).remove();
                                    return false;
                                }
                            });
                        } else {//普通用户
                            $(".spTemp_total_nav_list li").each(function (i, em) {
                                if ($(em).find("span").text().indexOf("待评作品") > -1) {
                                    if (comm.getpara("#").navText == $(em).find("span").attr("data-navtext")) {
                                        $(".spTemp_total_nav_list li span").eq(0).click();
                                    }
                                    $(em).remove();
                                    return false;
                                }
                            });
                        }
                        t.signUpBtn();
                    };
                    comm.ajax.async(t.config.expertsCus, param, callback);
                } else {//厂商，组织，患者
                    $(".spTemp_total_nav_list li").each(function (i, em) {
                        if ($(em).find("span").text().indexOf("我的作品") > -1) {
                            if (comm.getpara("#").navText == $(em).find("span").attr("data-navtext")) {
                                $(".spTemp_total_nav_list li span").eq(0).click();
                            }
                            $(em).remove();
                        }
                        if ($(em).find("span").text().indexOf("待评作品") > -1) {
                            if (comm.getpara("#").navText == $(em).find("span").attr("data-navtext")) {
                                $(".spTemp_total_nav_list li span").eq(0).click();
                            }
                            $(em).remove();
                        }
                    });
                    t.signUpBtn();
                }
            }else{
                var params = {
                    paramJson: $.toJSON({
                        activityId: $("#activityId").val(),
                        customerId: appjs.getAuthorCustomerId()
                    })
                };
                var callbacks = function (rep) {
                    if (!comm.hasResponseData(rep)) {
                        return false;
                    }
                    var _isExpert = rep.responseObject.responseData.isExpert;
                    t.isExpert = _isExpert;
                    if (_isExpert == 1) {//专家用户
                        $(".spTemp_total_nav_list li").each(function (i, em) {
                            if ($(em).find("span").text().indexOf("我的作品") > -1) {
                                if (comm.getpara("#").navText == $(em).find("span").attr("data-navtext")) {
                                    //专家用户点击我的作品进行登录处理
                                    $(".spTemp_total_nav_list li").each(function (k, v) {
                                        if ($(v).find("span").text().indexOf("待评作品") > -1) {
                                            $(v).find("span").click();
                                            return false;
                                        }
                                    });
                                }
                                $(em).remove();
                                return false;
                            }
                        });
                    } else {//普通用户
                        $(".spTemp_total_nav_list li").each(function (i, em) {
                            if ($(em).find("span").text().indexOf("待评作品") > -1) {
                                if (comm.getpara("#").navText == $(em).find("span").attr("data-navtext")) {
                                    $(".spTemp_total_nav_list li span").eq(0).click();
                                }
                                $(em).remove();
                                return false;
                            }
                        });
                    }
                     t.signUpBtn();
                };
                comm.ajax.async(t.config.expertsCus, params, callbacks);
            }
        },
        //判断报名阶段，海选报名是否开始
        signUpBtn: function () {
            var t = this;
            var param = {activityId: $("#activityId").val()};
            var paramdData = {paramJson: $.toJSON(param)};
            var callback = function (rep) {
                if (rep && rep.responseObject && rep.responseObject.responseData
                    && rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                    $.each(rep.responseObject.responseData.data_list, function (i, e) {
                        if (e.eventProcessType == 1) {//报名流程type (1.海选报名、2.专家评审 、3.大众评选 、 4.现场展示和颁奖)
                            if (e.startStatus == -1 && e.endStatus == -1) {//报名流程开始,报名流程未结束
                                if (t.isExpert != 1) {
                                    $(".ev-signUpBtn").show().find(".ev-signUpName").text(e.cmsActivityEvent.eventName);
                                    if(comm.browser.versions.iPhoneX){
                                        $(".ev-signUpBtn").css({position: 'fixed', "padding-bottom": "0.4533rem"});//底部报名栏
                                    }
                                }
                                $(".ev-signUpBtn a").off("click").on("click", function () {
                                    appjs.startCampaignRegister(activityId);
                                });
                            }
                        }
                    });
                }
            };
            comm.ajax.async(t.config.getEventConfigList, paramdData, callback);
        },
        //轮播图，页脚操作
        bannerSwiper: function () {
            var t = this;
            //新闻长文字按钮点击展开操作
            $(document).on("click", ".ev-require_checkMore", function () {
                if ($(this).hasClass("ev-moreCanClick")) {
                    $(this).parents(".theme_news").find(".al-require_box").css("height", "auto");
                    $(this).text("收起").addClass("al-cM_packUp").removeClass("ev-moreCanClick");
                } else {
                    $(this).parents(".theme_news").find(".al-require_box").css("height", "11.48rem");
                    $(this).text("展开更多").removeClass("al-cM_packUp").addClass("ev-moreCanClick");
                }
            });
            //轮播图长度
            if ($("#bannerLength").val() == 1) {
                var spTemp_total_banner = new Swiper('.spTemp_total_banner', {
                    noSwiping: true
                });
            } else {
                var spTemp_total_banner = new Swiper('.spTemp_total_banner', {
                    autoplay: 3000,
                    loop: true,
                    pagination: '.swiper-pagination',
                    autoplayDisableOnInteraction: false
                });
            }
        },
        //导航自适应
        navAdap: function () {
            var t = this;
            var navL = 0;
            var marginNum = 0;
            var navH = $(".spTemp_total_nav").height();
            if ($('html').attr('data-dpr') == '1' && navH < 80 || $('html').attr('data-dpr') == '2' && navH < 160 || $('html').attr('data-dpr') == '3' && navH < 240) {
                $(".spTemp_total_nav_list li").each(function (i, em) {
                    navL += $(".spTemp_total_nav_list li").eq(i).width();
                    return navL;
                });
                if ($('html').attr('data-dpr') == '1') {
                    marginNum = ($('.spTemp_total_nav_list').width() - navL) / ($(".spTemp_total_nav_list li").length * 1);
                } else if ($('html').attr('data-dpr') == '2') {
                    marginNum = ($('.spTemp_total_nav_list').width() - navL) / ($(".spTemp_total_nav_list li").length * 2.1);
                } else if ($('html').attr('data-dpr') == '3') {
                    marginNum = ($('.spTemp_total_nav_list').width() - navL) / ($(".spTemp_total_nav_list li").length * 3.5);
                }
                if($('html').attr('data-dpr') == '1' && navH < 40 || $('html').attr('data-dpr') == '2' && navH < 80 || $('html').attr('data-dpr') == '3' && navH < 120){
                    $(".spTemp_total_nav_list li").css({
                        'padding': '0 ' + marginNum / 75 + 'rem'
                    })
                }else{
                    $(".spTemp_total_nav_list li").css({
                        'padding': '0 ' + 30 / 75 + 'rem'
                    });
                }
            } else {
                $(".spTemp_total_nav_list li").css({
                    'padding': '0 ' + 30 / 75 + 'rem'
                });
                //更多导航
                $('.spTemp_nav_more').show();
                $('.spTemp_total_nav_list').css({
                    overflow: 'hidden',
                    height: 150 / 75 + 'rem'
                });
                if (comm.getparaNew().navText > 6) {
                    if ($('.spTemp_nav_more').hasClass('spTemp_nav_more_spread')) {
                        $('.spTemp_nav_more').removeClass('spTemp_nav_more_spread').addClass('spTemp_nav_more_pack');
                        $('.spTemp_total_nav_list').css({
                            overflow: 'visible',
                            height: 'auto'
                        });
                        if($(".spTemp_total_nav_list li").length!=1) {
                            $(".ev-placeholder").css("height", $(".spTemp_total_nav").outerHeight());
                        }
                    } else {
                        $('.spTemp_nav_more').removeClass('spTemp_nav_more_pack').addClass('spTemp_nav_more_spread');
                        $('.spTemp_total_nav_list').css({
                            overflow: 'hidden',
                            height: 150 / 75 + 'rem'
                        });
                        if($(".spTemp_total_nav_list li").length!=1) {
                            $(".ev-placeholder").css("height", $(".spTemp_total_nav").outerHeight());
                        }
                    }
                }
                $('.spTemp_nav_more').off('click').on('click', function () {
                    if ($(this).hasClass('spTemp_nav_more_spread')) {
                        $(this).removeClass('spTemp_nav_more_spread').addClass('spTemp_nav_more_pack');
                        $('.spTemp_total_nav_list').css({
                            overflow: 'visible',
                            height: 'auto'
                        });
                        if($(".spTemp_total_nav_list li").length!=1) {
                            $(".ev-placeholder").css("height", $(".spTemp_total_nav").outerHeight());
                        }
                    } else {
                        $(this).removeClass('spTemp_nav_more_pack').addClass('spTemp_nav_more_spread');
                        $('.spTemp_total_nav_list').css({
                            overflow: 'hidden',
                            height: 150 / 75 + 'rem'
                        });
                        if($(".spTemp_total_nav_list li").length!=1) {
                            $(".ev-placeholder").css("height", $(".spTemp_total_nav").outerHeight());
                        }
                    }
                });
            }
            t.navFixed();
        },
        //导航固定
        navFixed:function(){
            $(".spTemp_total_nav").css({
                "position":"relative"
            });
            //无内容时页脚居于底部
            if($(".spTemp_total_nav_list li").length!=1) {
                $(".ev-placeholder").css("height", $(".spTemp_total_nav").outerHeight());
            }
            $(window).bind("scroll",function(){//浏览器滚动判断定位
                if($(window).scrollTop()>$(".spTemp_total_banner ").height()){//滚动过导航位置
                    $(".spTemp_total_nav").css({
                        "position":"fixed",
                        "top":"0",
                        "z-index":5
                    });
                }else{//恢复原来导航位置
                    $(".spTemp_total_nav").css({
                        "position":"relative"
                    });
                }
            });
        },
        //首次加载页面渲染
        firstLoad: function () {
            var t = this;
            var homePage = "",
                homeType = "",
                activityMenuId = "",
                myWorks = "",
                areaOrSemi = "",
                layoutId = "";
            var el = $(".spTemp_total_nav_list li:eq(0)");
            homePage =$(el).children("span").data("href")?$(el).children("span").data("href").replace("https:",""):"";
            homeType = $(el).children("span").data("type");
            activityMenuId = $(el).children("span").data("activitymenuid");
            layoutId = $(el).children("span").data("layoutid");
            if (el.text().indexOf("区域赛") > -1) {
                areaOrSemi = 1;
            }
            if (el.text().indexOf("半决赛") > -1) {
                areaOrSemi = 2;
            }
            if (el.text().indexOf("我的作品") > -1) {
                myWorks = 1;
            }
            if ($(this).text().indexOf("待评作品") > -1) {
                $(".spTemp_total_nav").addClass("waitingWorkChange");
            }else{
                $(".spTemp_total_nav").removeClass("waitingWorkChange");
            }
            t.judgeUtlType({
                urlType: homeType,
                urlLink: homePage,
                activityMenuId: activityMenuId,
                layoutId: layoutId,
                areaOrSemi: areaOrSemi,
                myWorks: myWorks
            });
            t.snsShare($.trim(el.text()));
        },
        //导航的点击事件
        tabClick: function () {
            var t = this;
            $(".spTemp_total_nav_list li span").on("click", function () {
                //每次点击获取到当前目标的一些自定义属性存起来用
                $('#shareLoc').val($(this).data('navtext'));
                $(this).addClass("textColorYesOne").parent().siblings().children("span").removeClass("textColorYesOne");
                if ($(this).parent().siblings().hasClass("nav_cut_hasTwo_down")) {
                    $(this).parent().siblings().children(".spTemp_total_nav_lists_two").hide().parent().removeClass("nav_cut_hasTwo_down").addClass("nav_cut_hasTwo_up");
                }
                if ($(this).parent().hasClass("nav_cut_hasTwo_up")) {
                    $(this).siblings(".spTemp_total_nav_lists_two").show().parent().removeClass("nav_cut_hasTwo_up").addClass("nav_cut_hasTwo_down");
                    if ($('.spTemp_nav_more').hasClass('spTemp_nav_more_spread')) {
                        $('.spTemp_nav_more').removeClass('spTemp_nav_more_spread').addClass('spTemp_nav_more_pack');
                        $('.spTemp_total_nav_list').css({
                            overflow: 'visible',
                            height: 'auto'
                        });
                    }
                } else if ($(this).parent().hasClass("nav_cut_hasTwo_down")) {
                    $(this).siblings(".spTemp_total_nav_lists_two").hide().parent().removeClass("nav_cut_hasTwo_down").addClass("nav_cut_hasTwo_up");
                    if ($('.spTemp_nav_more').hasClass('spTemp_nav_more_spread')) {
                        $('.spTemp_nav_more').removeClass('spTemp_nav_more_spread').addClass('spTemp_nav_more_pack');
                        $('.spTemp_total_nav_list').css({
                            overflow: 'visible',
                            height: 'auto'
                        });
                    }
                } else {
                    $('.spTemp_total_down').html(comm.actSkeleton());//增加灰度骨架屏样式
                    $(".spTemp_total_nav_lists_two").hide().parent().removeClass("nav_cut_hasTwo_down").addClass("nav_cut_hasTwo_up");
                    var urlLink = $(this).data("href"), //一级导航url
                        urlType = $(this).data("type"),
                        activityMenuId = $(this).data("activitymenuid"),
                        layoutId = $(this).data("layoutid"),
                        areaOrSemi = "",
                        myWorks = "";
                    if ($(this).text().indexOf("区域赛") > -1) {
                        areaOrSemi = 1;
                    }
                    if ($(this).text().indexOf("半决赛") > -1) {
                        areaOrSemi = 2;
                    }
                    if ($(this).text().indexOf("我的作品") > -1) {
                        myWorks = 1;
                    }
                    if ($(this).text().indexOf("待评作品") > -1) {
                       $(".spTemp_total_nav").css("height",$(this).parents("li").height());
                       $(".spTemp_total_nav_list").css({position:"absolute",background:"#fff"});
                    }else{
                        $(".spTemp_total_nav").css("height","auto");
                        $(".spTemp_total_nav_list").css({position:"static",background:"none"});
                    }
                    t.judgeUtlType({
                        urlType: urlType,
                        urlLink: urlLink,
                        activityMenuId: activityMenuId,
                        layoutId: layoutId,
                        areaOrSemi: areaOrSemi,
                        myWorks: myWorks
                    });
                    if (document.getElementsByTagName("gs:video-vod")[0]) {
                        GS.loadTag('video-vod', document.getElementsByTagName("gs:video-vod")[0]);
                    } else if (document.getElementsByTagName("gs:video-live")[0]) {
                        GS.loadTag('video-live', document.getElementsByTagName("gs:video-live")[0]);
                    }
                }

                //如果是有子菜单则不进行导航的更新
                // TODO:当更新时在当前页面进行分享或者跳转H5页面时返回回来会出现数据不展示问题。原因是点击二级菜单的父级时没有进行判断，直接改变了导航，在根据导航进行获取数据时不能找到相应的二级菜单的项。（不知为何之前没有发现 =_=|||）
                // TODO：解决办法是在点击二级导航的父级即带有二级菜单的一级菜单时不进行导航的更新。
                if($(this).next('section').length<=0){//如果没有二级菜单
                    var a = window.location.pathname + location.search;
                    if (a.indexOf("#") < 0) {
                        a += "#";
                    }
                    var href = a + "&navText=" + $(this).data("navtext");
                    /* setTimeout(function(){
                       g_sps.jump(null,href);
                     },500);*/
                    location.replace(href);
                    t.snsShare($.trim($(this).text()));
                }
                // else{
                //     alert("点击不更新")
                // }

                $(".ev-resource_list").attr("scrollPagination", "disabled");
                t.navFixed();

                $(".ev-firstTab,.ev-secondTab,.ev-thirdTab").removeClass("active activeUp");//选中状态展开按钮取消或者收起
                $(".menuSecond,.menuThird").hide();//展开的二级三级菜单收起
                $(".ev-thirdTab>b").removeClass("onclick");//三级多选选中取消
                $(".ev-firstTab[data-all=1]").addClass("active");//全部默认选中
            });
            $('.spTemp_total_nav_lists_two dl dd').on("click", function () {
                $('.spTemp_total_down').html(comm.actSkeleton());//增加灰度骨架屏样式
                //每次点击获取到当前目标的一些自定义属性存起来用
                $('#shareLoc').val($(this).data('navtext'));
                $(this).parents('.spTemp_total_nav_lists_two').siblings('span').attr('data-navtext', $(this).data('navtext'));
                $(this).parents('.nav_cut_hasTwo').children("span").addClass("textColorYesOne").parent().siblings().children("span").removeClass("textColorYesOne");
                $(this).parent().parent().hide().closest(".nav_cut_hasTwo_down").removeClass("nav_cut_hasTwo_down").addClass("nav_cut_hasTwo_up");
                $(this).addClass("textColorYesTwo").siblings().removeClass("textColorYesTwo");
                var urlLink = $(this).data("href"); //二级导航url
                var urlType = $(this).data("type"),
                    activityMenuId = $(this).data("activitymenuid"),
                    layoutId = $(this).data("layoutid");
                t.judgeUtlType({
                    urlType: urlType,
                    urlLink: urlLink,
                    activityMenuId: activityMenuId,
                    layoutId: layoutId
                });
                var b = window.location.pathname + location.search;
                if (b.indexOf("#") < 0) {
                    b += "#";
                }
                var href = b + "&navText=" + $(this).data("navtext");
                /* setTimeout(function(){
                   g_sps.jump(null,href);
                 },500);*/
                // alert(window.location.href);
                // alert(href);
                location.replace(href);
                // alert(window.location.href);
                t.snsShare($.trim($(this).text()));
                $(".ev-resource_list").attr("scrollPagination", "disabled");
                t.navFixed();
                $(".ev-firstTab,.ev-secondTab,.ev-thirdTab").removeClass("active activeUp");//选中状态展开按钮取消或者收起
                $(".menuSecond,.menuThird").hide();//展开的二级三级菜单收起
                $(".ev-thirdTab>b").removeClass("onclick");//三级多选选中取消
                $(".ev-firstTab[data-all=1]").addClass("active");//全部默认选中
            });
            $('.spTemp_total_nav_lists_two dl dd').hover(function () {
                $(this).removeClass("textColorNoTwo").addClass("textColorYesTwo");
            }, function () {
                $(this).removeClass("textColorYesTwo").addClass("textColorNoTwo");
            });
        },
        //页面html结构铺设
        judgeUtlType: function (uv) {
            var t = this;
            if (uv.urlType == 1 && uv.urlLink.length > 0) {
                comm.loading.show();
                $.ajax({
                    url: uv.urlLink,
                    dataType: 'html',
                    type: 'get',
                    async: true,
                    success: function (file) {
                        $('.spTemp_total_down').html(file);
                        if (!$('.spTemp_total_down').find("div[data-componenttype=11]").length) {
                            t.dataLoad(uv);
                        }
                        comm.loading.hide();
                    },
                    error: function () {
                    }
                });
            }
        },
        //页面数据铺设
        dataLoad: function (uv) {
            var t = this;
            if (uv.areaOrSemi) {//半决赛和区域赛组件列表
                var params = {
                    paramJson: $.toJSON({
                        scene: uv.areaOrSemi,
                        activityId: $("#activityId").val(),
                        activityMenuId: uv.activityMenuId
                    })
                };
                var callback = function (rep) {
                    if (rep && rep.responseObject && rep.responseObject.responseData && rep.responseObject.responseData.list
                        && rep.responseObject.responseData.list.length > 0) {
                        var items = rep.responseObject.responseData.list;
                        var html = "";
                        $(".isComp[data-componenttype=8] .total_title span").text(rep.responseObject.responseData.title);
                        $.each(items, function (i, e) {
                            html += '<a' + (e.cmsActivityProperty.isValid == 1 ? ' href="' + e.areaUrl + '"' : ' class="gray" href="javascript:;"') + '>'
                                + e.cmsActivityProperty.propertyName + '</a>';
                        });
                        $(".actTemp_division_entrance").html(html);
                    }
                };
                comm.ajax.async(t.config.areaListUrl, params, callback);
            }
            if (uv.myWorks) {
                t.myWorksHtml();
            }
            $.each($(".sp_container_l .isComp"), function (i, e) {
                if ($(e).attr("data-componentType") != 8) {//排除区域赛
                    var param = {
                        activityMenuId: uv.activityMenuId,
                        layoutId: uv.layoutId,
                        id: $(e).attr("data-id"),
                        columnId: $(e).attr("data-columnId"),
                        pageIndex: 1,
                        pageSize: 9999999,
                        solrScene: 10,
                        sortType: 2,
                        customerId: appjs.getAuthorCustomerId() ? appjs.getAuthorCustomerId() : '',
                        activityId: $("#activityId").val()
                    };
                    var callbacks = function (data) {
                        if (data && data.bo && data.bo.responseData && !$.isEmptyObject(data.bo.responseData)) {
                            spTemp_list.one.spTemp_listLoad({ //资源
                                resTemplate: data   //返回数据
                            });
                            questionnaire.one.question_listLoad({//问卷
                                resTemplate: data   //返回数据
                            });
                        }
                    };
                    comm.ajax.async(t.config.resUrl, {paramJson: $.toJSON(param)}, callbacks);
                }
            });
        },
        //myWorks我的作品列表请求
        myWorksHtml: function (uv) {
            var t = this;
            var className = "", activityId = $("#activityId").val();
            var paramData = {
                activityId: activityId,
                isNewActivity: 1,
                logoUseFlag: 3,
                customerId: appjs.getAuthorCustomerId() ? appjs.getAuthorCustomerId() : "",
                pageIndex: 1,
                pageSize: 50,
                attUseFlag: 4,
                dataFlag: 4,
                sessionCustomerId: appjs.getAuthorCustomerId() ? appjs.getAuthorCustomerId() : ""
            };
            var callB = function (rep) {
                if (rep && rep.responseObject && rep.responseObject.responseData
                    && rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                    var list = rep.responseObject.responseData.data_list;
                    var html = "";
                    $.each(list, function (i, val) {
                        var trend = val;
                        var resourceId = "";		//无效链接
                        var browseNum = trend.resource_valid.browseNum;//资源浏览数
                        var reviewNum = trend.resource_valid.reviewNum;//评论数
                        var upNum = trend.resource_valid.preferUpNum;//点赞数
                        var pubTime = trend.customer_trends.opDate ? comm.date.diffDay_one(trend.customer_trends.opDate.substr(0, 19), comm.date.local_time()) : "";
                        var auth_report = "";					//审核状态
                        var auth_report_ing = '<p><i class="pendingAudit"></i>待审核<b>' + pubTime + '</b></p>';
                        var auth_report_suc = trend.score > 0 ? '<p class="totalScoreBox">总分：<i>' + trend.score + '</i><i class="colorDifference">分</i><b>' + pubTime + '</b></p>' : '<p><i class="audited"></i>审核已通过<b>' + pubTime + '</b></p>';
                        var auth_report_fail = '<p><i class="auditedNone"></i>未达到参赛标准<span>' + ((trend.approvalReason && $.trim(trend.approvalReason) && !$.isEmptyObject(trend.approvalReason)) ? '拒绝原因:' + (comm.getStrLen(trend.approvalReason, 50)) : '') + '  </span><b>' + pubTime + '</b></p>';
                        var hide = "";
                        var trendType = trend.customer_trends_type;
                        //1-待审核、2-审核已通过、3-审核未通过、4-审核未通过
                        var state = trend.approvalStatus ? trend.approvalStatus : "";
                        switch (state) {
                            case 1:
                                hide = "style='display:block;'";
                                auth_report = auth_report_ing;
                                if (trend.customer_trends.isValid === 1&&trend.customer_trends_type==7) {	//只有病例终端待审核才能跳转
                                    resourceId = trend.customer_trends.resourceId;
                                }
                                break;
                            case 3:
                                auth_report = auth_report_fail;
                                break;
                            case 4:
                                auth_report = auth_report_fail;
                                break;
                            case 2:
                                hide = "style='display:block;'";
                                auth_report = auth_report_suc;
                                if (trend.customer_trends.isValid === 1) {	//视频有效
                                    resourceId = trend.customer_trends.resourceId;
                                }
                                break;
                            default :
                                hide = "style='display:block;'";
                                if (trendType == 4) {//话题
                                    if (trend.customer_trends.isValid === 1) {	//话题有效
                                        auth_report = auth_report_suc;
                                    } else {
                                        auth_report = auth_report_fail;
                                    }
                                } else {//请他情况
                                    auth_report = auth_report_suc;
                                }
                                if (trend.customer_trends.isValid === 1) {	//视频有效
                                    resourceId = trend.customer_trends.resourceId;
                                }
                                break;
                        }
                        var resourceName = comm.getStrLen(trend.customer_trends.resourceName, 50);
                        var attUrl = "";//默认图片
                        var noImgFlag;
                        if (trendType == 1) {//视频
                            if (trend.cms_video_attachment && trend.cms_video_attachment.length) {//病例、视频：显示图文，无图显示默认图；
                                attUrl = trend.cms_video_attachment[0].videoAttUrl ? trend.cms_video_attachment[0].videoAttUrl : "/images/img50/225_150.jpg";
                            } else {
                                attUrl = "/images/img50/225_150.jpg";
                            }
                            time = '<i></i><p>' + trend.resource_valid.playTime + '</p>';
                        } else {
                            time = "";
                            if (trendType == 2) {//文库  无图
                                noImgFlag = 1;
                            }
                            if (trendType == 4) {//话题  有图显示  无图文字
                                if (trend.cms_topic_attachment && trend.cms_topic_attachment.length) {
                                    attUrl = trend.cms_topic_attachment[0].topicAttUrl ? trend.cms_topic_attachment[0].topicAttUrl : "";
                                    if (!trend.cms_topic_attachment[0].topicAttUrl) {
                                        noImgFlag = 1;
                                    }
                                } else {
                                    attUrl = "";
                                    noImgFlag = 1;
                                }
                            }
                            if (trendType == 7) {//病例 病例、视频：显示图文，无图显示默认图；
                                if (trend.case_attachment_list && trend.case_attachment_list.length) {
                                    attUrl = trend.case_attachment_list[0].attUrl ? trend.case_attachment_list[0].attUrl : "/images/img50/225_150.jpg";
                                } else {
                                    attUrl = "/images/img50/225_150.jpg";
                                }
                            }
                        }
                        html += '<li class="ev-resClick appCssli" tplPath="' + trend.resource_valid.tpl_path + '"  resourceId="' + resourceId + '" trendType="' + trendType + '" resourceName="' + trend.customer_trends.resourceName + '">' +
                            '<aside class="wordsDetail">' +
                            '<aside class="listDetail"' + (noImgFlag == 1 ? ' style="width:8.8rem"' : '') + ' >' +
                            '<p>' + comm.getStrLen(resourceName, 40) + '</p>' +
                            '<p ' + hide + '><span><i></i>' + browseNum.toWK() + '</span>' +
                            '<span><i></i>' + reviewNum.toWK() + '</span>' +
                            '<span><i></i>' + upNum.toWK() + '</span></p>' +
                            '</aside>' +
                            '<aside class="listImg"' + (noImgFlag == 1 ? ' style="display:none;"' : '') + '>' + time +
                            '<a href="javascript:;" style="display:block;" target="_blank">' +
                            '<img src="' + attUrl + '"></a>' +
                            '</aside>' +
                            '</aside>' +
                            '<aside>' +
                            auth_report +
                            '</aside>' +
                            '</li>';
                    });
                    $(".wordsList").show();
                    $(".noWorkList").hide();
                    $(".ev-myWorkList").html(html);
                    $(".ev-ListNum").text("(" + list.length + ")");
                    t.myWorksResClick();
                } else {//没有作品列表的时候
                    $(".wordsList").hide();
                    $(".noWorkList").show();
                }
            };
            comm.ajax.async(t.config.json_list_v2, paramData, callB);
        },
        //我的作品列表点击跳转事件
        myWorksResClick: function () {
            $(".ev-resClick").on("click", function (event) {
                event.stopPropagation();
                var resourceId = $(this).attr("resourceId");
                if (resourceId) {
                    appjs.gotoTerminalDetailVC($.toJSON({
                        "resourceId": resourceId,
                        "resourceType": $(this).attr("trendType"),
                        "tplPath": $(this).attr("tplPath")
                    }));
                }
                return false;
            });
        },
        //微信/空间/微博分享功能
        snsShare: function (kv) {
            var t = this;
            var activityId = $('#activityId').val(),
                url = window.location.href.replace("/app/", "/m/"),
                shareData = {};
            var callback = function (data) {
                if (data && data.responseObject && !$.isEmptyObject(data.responseObject)) {//有分享话术的情况
                    shareData.shareTitle = data.responseObject.shareTitle;
                    shareData.shareUrl = data.responseObject.sharePicUrl;
                    shareData.shareContent = (kv && data.responseObject.shareContent) ? shareData.shareTitle + "——" + data.responseObject.shareContent + '——' + kv + " 点击查看：" + url : shareData.shareTitle + "——" + data.responseObject.shareContent + " 点击查看：" + url;
                    shareData.qqContent = (kv && data.responseObject.shareContent) ? data.responseObject.shareContent + '——' + kv : data.responseObject.shareContent;
                    shareData.emailContent = (kv && data.responseObject.shareContent) ? shareData.shareContent + '——' + kv + "查看详情" + url : shareData.shareContent + "查看详情" + url;
                    shareData.emailTitle = "（分享自：唯医）" + shareData.shareTitle + "  点击查看";
                    t.shareFunc(shareData);
                } else {//无分享话术的默认情况
                    shareData.shareTitle = document.title;
                    shareData.shareUrl = "";
                    shareData.shareContent = kv ? shareData.shareTitle + "——" + "汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。" + '——' + kv + " 点击查看：" + url : shareData.shareTitle + "——" + "汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。" + " 点击查看：" + url;
                    shareData.qqContent = kv ? "汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。" + '——' + kv : "汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。";
                    shareData.emailContent = kv ? "汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。" + '——' + kv + "查看详情" + url : "汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。" + "查看详情" + url;
                    shareData.emailTitle = "（分享自：唯医）" + document.title + "  点击查看";
                    t.shareFunc(shareData);
                }
            };
            comm.ajax.async(t.config.shareUrl, {activityId: activityId}, callback);
        },
        //shareAll分享函数
        shareFunc: function (shareData) {
            $(".Ev-ShareBtn").off("click").on("click", function () {
                appjs.share($.toJSON({
                        "url": window.location.href.replace("/app/", "/m/"),
                        "imgUrl": shareData.shareUrl,
                        "sinaContent": shareData.shareContent,//新浪簡介
                        "qqTitle": shareData.shareTitle, //qq微信title,
                        "qqContent": shareData.qqContent,//qq微信簡介
                        "messageContent": shareData.shareContent,//短信
                        "emailTitle": shareData.emailTitle, //qq微信title,
                        "emailContent": shareData.emailContent //youxiang
                    })
                );
            });
        },
        //定位函数
        buildArguments: function (obj) {
            var t = this;
            var params = comm.getparaNew();
            if (comm.getparaNew().navText) {
                if ($('.spTemp_total_nav_list li span[data-navText=' + params.navText + ']').length > 0 && $('.spTemp_total_nav_lists_two dl dd[data-navText=' + params.navText + ']').length <= 0) {
                    $('.spTemp_total_nav_list li span[data-navText=' + params.navText + ']').trigger("click");
                } else if ($('.spTemp_total_nav_lists_two dl dd[data-navText=' + params.navText + ']').length > 0) {
                    $('.spTemp_total_nav_lists_two dl dd[data-navText=' + params.navText + ']').trigger("click");
                    $('.spTemp_total_nav_list li span[data-navText=' + params.navText + ']').addClass("textColorYesOne").parent().siblings().children("span").removeClass("textColorYesOne");
                } else {
                    $('.spTemp_total_nav_list li span[data-navText=1]').trigger("click");
                }
            } else {
                t.firstLoad();
            }
        }
    };
    specialTemplate.init();
});

