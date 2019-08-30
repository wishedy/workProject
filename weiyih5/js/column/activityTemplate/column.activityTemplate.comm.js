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
    var cId = TempCache.getItem("userId");
    var title = document.title;
    var activityId = $("#activityId").val();
    var authState = JSON.parse(TempCache.getItem("auth")) ? JSON.parse(TempCache.getItem("auth")).state : "";
    //Log.createBrowse(197, "新版活动页面");
    var storeSession = {
        checkInvalid: function (val) {
            if (((typeof val == 'string') && (val.length == 0)) || (val == undefined) || (val == 'undefined') || (val == 'null') || (typeof val == 'undefined') || (typeof val == 'null') || (val == null)) {
                return true;
            } else {
                return false;
            }
        },
        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        loginInit: function () {
            var webdomain = '//' + location.host;
            var appId = 'wx8d4a2df6fdc13658';
            var searchParam = '';
            var searchUrlOnOff = storeSession.checkInvalid(location.search);
            var loginOnOff = false;
            if (searchUrlOnOff) {
                loginOnOff = true;
                searchParam = "?redirectNum=1";
            } else {
                var redirectNum = storeSession.getQueryString('redirectNum');
                var loginNumRight = !storeSession.checkInvalid(redirectNum);
                if (loginNumRight && parseInt(redirectNum, 10) === 1) {
                    loginOnOff = false;
                } else {
                    searchParam = location.search + "&redirectNum=1";
                    loginOnOff = true;
                }
            }
            var href = location.origin + location.pathname + searchParam;
            var toUrl = 'http:' + webdomain + '/mcall/wx/allin/interact/viewVideo/?url=' + encodeURIComponent(href);
            if (loginOnOff) {
                var weixinLoginUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(toUrl) + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
                window.location.href = weixinLoginUrl;
            } else {

            }
        }
    };
    setTimeout(function(){
        g_sps&&g_sps.createBrowse({pageId:469})
    }, 2000);
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
            if(comm.isWeiXin()){
                storeSession.loginInit();
            }
            t.expertsFun();
            t.navAdap();
            t.tabClick();
            t.buildArguments();
            t.bannerSwiper();
            if ($(".spTemp_total_nav_list li").length == 1) {
                $(".spTemp_total_nav").hide();
            }
            setTimeout(function(){
                t.wakeUpApp();
            },1000);
        },
        wakeUpApp:function(){
            if(!comm.isApp()){
                var amChannel = comm.getpara()._amChannel;
                var refId = $("#activityId").val();
                var linkUrl = window.location.href.replace("https:","");
                //3.10需求，整站添加顶部唤醒app的按钮，20190241101，张恒
                var iosParam = "scene=11&type=53&linkUrl="+encodeURIComponent(linkUrl)+"&linkName="+document.title+"";
                var androidParam = "{scene:3,type:53,linkUrl:"+linkUrl+",linkName:"+document.title+"";
                var callAppOptions = {
                    el: ".solidBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                    ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                    android: "allin://com.allin.social:75235?data="+androidParam,
                    runAtOnce: false
                };
                comm.appWakeUp("figure", callAppOptions);//唤醒app弹层
            }
        },
        expertsFun: function () {
            var t = this;
            if (!cId) {//用户未登录
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
                        g_sps.jump(null,href);
                        user.privExecute({ //检测登录认证
                            operateType: 'auth',   //'login','auth','conference'
                            noNeedBack: true,
                            callback: function () {
                                t.authUserShow();
                            }
                        });
                    }
                });
            } else {//用户登录了 判断专家权限
                t.authUserShow();
            }
        },
        //登录用户判断专家权限，厂商权限
        authUserShow: function (flag) {
            var t = this;
            if (TempCache.getItem("customerRole") != 3 && TempCache.getItem("customerRole") != 2 && TempCache.getItem("customerRole") != 4) {//0游客 1系统 2组织 3厂商 4患者 5普通医师 6认证医师
                var param = {
                    paramJson: $.toJSON({
                        activityId: $("#activityId").val(),
                        customerId: cId
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
                                }
                                $(".ev-signUpBtn a").off("click").on("click", function () {//点海选报名按钮验证用户登录认证
                                    if (TempCache.getItem("customerRole") != 3 && TempCache.getItem("customerRole") != 2 && TempCache.getItem("customerRole") != 4) {
                                        if (cId && authState == 7 || authState == 2 || authState == 8 || authState == 9) {
                                            t.applyStateAjax();//首先进行用户的报名状态请求
                                        } else {
                                            user.privExecute({ //检测登录认证
                                                operateType: 'auth',   //'login','auth','conference'
                                                noNeedBack: true,
                                                callback: function () {
                                                    t.applyStateAjax();
                                                }
                                            });
                                        }
                                    } else {
                                        popupFn("该用户没有权限操作", 5000);
                                    }
                                });
                                t.footerFixed();
                            }
                        }
                    });
                }
            };
            comm.ajax.async(t.config.getEventConfigList, paramdData, callback);
        },
        //报名状态请求
        applyStateAjax: function () {
            var t = this;
            var cBack = function (rep) {
                if (rep && rep.responseObject && rep.responseObject.responseData && !$.isEmptyObject(rep.responseObject.responseData)) {
                    if (rep.responseObject.responseData.registerStatus == 6) {//上传作品已达上限
                        comm.confirmBox({
                            topTitle:"您在本活动提交作品数<br/>已达上限",
                            title: '您可参与其他活动<br/>或直接发布到网站与同行交流',
                            cancel: '知道了',
                            ensure: '去发布',
                            noClickParam:1,
                            callBack: function () {//唤醒app的发布病例
                                var amChannel = comm.getpara()._amChannel;
                                comm.bindCallApp({
                                    el:".al-confirmModalEnsureBtn",
                                    ios: "allinmdios://app.allinmd.cn/applinks.html?scene=11&type=7"+(amChannel?"&_amChannel="+amChannel:''),
                                    ios9: "http://app.allinmd.cn/applinks.html?scene=11&type=7"+(amChannel?"&_amChannel="+amChannel:''),
                                    android: "allin://com.allin.social:75235?data={scene:11,type:51"+(amChannel?",_amChannel:"+amChannel:'')+ "}"
                                });
                            },
                            cancelCallback: function () {}
                        });
                    } else {
                        t.applyProcess(rep.responseObject.responseData.registerStatus);//报名步骤流程
                    }
                }
            };
            comm.ajax.async(t.config.getRegisterStatus, {
                paramJson: $.toJSON({
                    customerId: cId,
                    activityId: activityId,
                    isValid:1
                })
            }, cBack);
        },
        //从新请求用户状态,报名的流程
        applyProcess: function (kv) {
            var t = this;
            if (t.repeatSignUp == 1) {//重复报名判断
                popupFn("请勿重复报名", 5000);
            } else if (t.computerUpload == 1) {//电脑上传
                $("body,html").css({
                    'height':'100%',
                    'overflow':'hidden'
                });
                var amChannel = comm.getpara()._amChannel;
                comm.newReleaseBox({
                    imgPath:"/images/img50/case/release.png",
                    title:"报名成功<br/>上传作品需使用唯医骨科App",
                    solidBtnTitile:"立即使用",
                    authNoneTitle:"暂不发布",
                    data:{
                        el: ".solidBtn",
                        ios: "allinmdios://app.allinmd.cn/applinks.html?scene=11&type=53&sourceId="+activityId+"&userId="+cId+"&linkUrl=//m.allinmd.cn/html/app/activity/" + activityId + "/activity_index.html&linkName="+title+(amChannel?"&_amChannel="+amChannel:''),
                        ios9: "http://app.allinmd.cn/applinks.html?scene=11&type=53&sourceId="+activityId+"&userId="+cId+"&linkUrl=//m.allinmd.cn/html/app/activity/" + activityId + "/activity_index.html&linkName="+title +(amChannel?"&_amChannel="+amChannel:''),
                        android: "allin://com.allin.social:75235?data={scene:3,type:53,sourceId:"+activityId+",userId:"+cId+",linkUrl://m.allinmd.cn/html/app/activity/" + activityId + "/activity_index.html,linkName:"+title+ (amChannel?",_amChannel:"+amChannel:'')+ "}"
                    },
                    authNoneCallBack:function () {
                        $("body,html").css({
                            'height':'auto',
                            'overflow':'auto'
                        });
                    }
                });
            }else if(t.computerUpload==2){
                comm.alertBox({
                    "title": "您已报名成功！为了保证作品质量，此次活动仅提供电脑版上传功能，请您移步电脑版唯医www.allinmd.cn完成上传。期待您的精彩作品！",
                    "ensure": "好的",
                    ensureCallback: function () {
                    }
                });
            } else {
                var param = {activityId: activityId, customerId: cId, registerStatus: kv};
                var paramdData = {paramJson: $.toJSON(param)};
                var callback = function (rep) {
                    if (rep && rep.responseObject && rep.responseObject.responseData
                        && rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                        $.each(rep.responseObject.responseData.data_list, function (i, e) {
                            if (e.eventProcessType == 1) {//报名流程type (1.海选报名、2.专家评审 、3.大众评选 、 4.现场展示和颁奖)
                                if (e.startStatus == -1 && e.endStatus == -1) {//报名流程开始,报名流程未结束
                                    var _ev = e.cmsActivityEventConfig;
                                    if (!_ev.length) {//判断长度不存在，原本只有报名基本信息和提交按钮
                                        popupFn("请勿重复报名", 5000, function () {
                                            t.repeatSignUp = 1;
                                        });
                                    } else {
                                       $.each(_ev,function (i,e) {
                                           if(e.configDataType!=4){//如果存在报名信息进行提示
                                               t.computerUpload=0;
                                               return false;
                                           }else{//20181015  问题51582  增加需求视频和问题提示上传到PC
                                               $.each(e.uploadType.split(','),function (i, kv) {
                                                   if(kv==2||kv==1){//上传的类型是文库或者视频
                                                       t.computerUpload=2;
                                                       return false;
                                                   }
                                               });
                                           }
                                       });
                                       if(t.computerUpload==0){//正常情况下跳转到报名页
                                         g_sps.jump(null,"/pages/column/activityTemplate/activity_signUp.html?actId=" + $("#activityId").val()+"&tit="+title);
                                       }else{
                                           $("body,html").css({
                                               'height':'100%',
                                               'overflow':'hidden'
                                           });
                                           if(t.computerUpload==2){
                                               comm.alertBox({
                                                   "title": "您已报名成功！为了保证作品质量，此次活动仅提供电脑版上传功能，请您移步电脑版唯医www.allinmd.cn完成上传。期待您的精彩作品！",
                                                   "ensure": "好的",
                                                   ensureCallback: function () {
                                                       $("body,html").css({
                                                           'height':'auto',
                                                           'overflow':'auto'
                                                       });
                                                   }
                                               });
                                           }else{
                                               t.computerUpload = 1;
                                               var amChannel = comm.getpara()._amChannel;
                                               comm.newReleaseBox({
                                                   imgPath:"//img50.allinmd.cn/case/release.png",
                                                   title:"报名成功<br/>上传作品需使用唯医骨科App",
                                                   solidBtnTitile:"立即使用",
                                                   authNoneTitle:"暂不发布",
                                                   data:{
                                                       el: ".solidBtn",
                                                       ios: "allinmdios://app.allinmd.cn/applinks.html?scene=11&type=53&sourceId="+activityId+"&userId="+cId+"&linkUrl=//m.allinmd.cn/html/app/activity/" + activityId + "/activity_index.html&linkName="+title +(amChannel?"&_amChannel="+amChannel:''),
                                                       ios9: "http://app.allinmd.cn/applinks.html?scene=11&type=53&sourceId="+activityId+"&userId="+cId+"&linkUrl=//m.allinmd.cn/html/app/activity/" + activityId + "/activity_index.html&linkName="+title +(amChannel?"&_amChannel="+amChannel:''),
                                                       android: "allin://com.allin.social:75235?data={scene:3,type:53,sourceId:"+activityId+",userId:"+cId+",linkUrl://m.allinmd.cn/html/app/activity/" + activityId + "/activity_index.html,linkName:"+title+ (amChannel?",_amChannel:"+amChannel:'')+ "}"
                                                   },
                                                   authNoneCallBack:function () {
                                                       $("body,html").css({
                                                           'height':'auto',
                                                           'overflow':'auto'
                                                       });
                                                   }
                                               });
                                           }

                                       }
                                    }
                                }
                            }
                        });
                    }
                };
                comm.ajax.async(t.config.getEventConfigList, paramdData, callback);
            }

        },
        //轮播图，页脚操作,新闻长文字按钮点击展开操作
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
                t.footerFixed();
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
            //返回顶部
            $(".footerBackToTop").click(function () {
                backToTop(300);
            });

            function backToTop(delay) {
                $('html,body').animate({
                    scrollTop: 0
                }, delay, "swing");
            }

            //下载链接
            var link = "";
            var userAgentInfo = navigator.userAgent;
            var isIphone = false;
            if (userAgentInfo.indexOf("iPhone") > 0) {
                isIphone = true
            }
            var isWeixin = (userAgentInfo.indexOf("MicroMessenger") > 0);
            if (isIphone) {
                if (isWeixin) {
                    link = "http://a.app.qq.com/o/simple.jsp?pkgname=com.allin.social";
                } else {
                    link = "https://itunes.apple.com/cn/app/wei-yi-for-iphone/id986266583";
                }
            } else {
                link = "http://a.app.qq.com/o/simple.jsp?pkgname=com.allin.social";
            }
            $(".Ev-footerAppDownload").attr("href", link);
        },
        //页脚固定于底部，分享按钮显示
        footerFixed: function () {
            var _signUpBtn = $(".ev-signUpBtn");
            //分享按钮滚动
            var _sBtn = $(".Ev-ShareBtn");
            var scrTop, scrollFlag;//当前屏幕的高度
            if (parseInt($(".spTemp_total_down").outerHeight()) + parseInt($(".spTemp_total_up").outerHeight()) + $(".pageFooter").outerHeight() + $(".registrationEntrance").outerHeight() <= parseInt($(window).height())) {//只有一屏高度时
                $(".spTemp_total_down").css("min-height", $(window).height() - $(".spTemp_total_up").outerHeight() - $(".pageFooter").outerHeight() - $(".pageFooter").outerHeight() / 2 - $(".registrationEntrance").outerHeight());
                if (_signUpBtn.is(":visible")) {//底部报名栏可见
                    _sBtn.css({position: 'fixed', bottom: "1rem"});//分享按钮
                    _signUpBtn.css({position: 'fixed', bottom: "1.535rem"});//底部报名栏
                    if(comm.browser.versions.iPhoneX){
                        _sBtn.css({position: 'fixed', bottom: "1.4533rem"});//分享按钮
                        _signUpBtn.css({position: 'fixed', "padding-bottom": "0"});//底部报名栏
                    }
                } else {
                    _sBtn.css({position: 'fixed', bottom: "1.6rem"});
                    if(comm.browser.versions.iPhoneX){
                        _sBtn.css({position: 'fixed', bottom: "2.0533rem"});
                    }
                }
            } else {
                if (_signUpBtn.is(":visible")) {//底部报名栏可见
                    _signUpBtn.css({position: 'fixed', bottom: "0"});//底部报名栏
                    if(comm.browser.versions.iPhoneX){
                        _signUpBtn.css({position: 'fixed', "padding-bottom": "0.4533rem"});//底部报名栏
                    }
                }
            }
            $(".spTemp_total_nav").css({
                "position": "relative"
            });
            //无内容时页脚居于底部
            if ($(".spTemp_total_nav_list li").length != 1) {
                $(".ev-placeholder").css("height", $(".spTemp_total_nav").outerHeight());
            }
            $(window).bind("scroll", function () {
                if (parseInt($(".spTemp_total_down").outerHeight()) + parseInt($(".spTemp_total_up").outerHeight()) + $(".pageFooter").outerHeight() + $(".registrationEntrance").outerHeight() <= parseInt($(window).height())) {//只有一屏高度时
                    if (_signUpBtn.is(":visible")) {//底部报名栏可见
                        _sBtn.css({position: 'fixed', bottom: "1rem"});//分享按钮
                        _signUpBtn.css({position: 'fixed', bottom: "1.535rem"});//底部报名栏
                        if(comm.browser.versions.iPhoneX){
                            _sBtn.css({position: 'fixed', bottom: "1.4533rem"});//分享按钮
                            _signUpBtn.css({position: 'fixed', "padding-bottom": "0"});//底部报名栏
                        }
                    } else {
                        _sBtn.css({position: 'fixed', bottom: "1.6rem"});
                        if(comm.browser.versions.iPhoneX){
                            _sBtn.css({position: 'fixed', bottom: "2.0533rem"});
                        }
                    }
                    $(".spTemp_total_nav").css({
                        "position": "relative"
                    });
                } else {//存在滚动时
                    //顶部导航固定啊
                    if ($(window).scrollTop() > $(".spTemp_total_banner").height()) {//滚动过导航位置
                        $(".spTemp_total_nav").css({
                            "position": "fixed",
                            "top": 0,
                            "z-index": 5
                        });
                    } else {//恢复原来导航位置
                        $(".spTemp_total_nav").css({
                            "position": "relative"
                        });
                    }
                    if (_signUpBtn.is(":visible")) {
                        _sBtn.css({position: 'fixed', bottom: "1rem"});
                        if(comm.browser.versions.iPhoneX){
                            _sBtn.css({position: 'fixed', bottom: "1.4533rem"});
                        }
                    } else {
                        _sBtn.css({position: 'fixed', bottom: "1px"});
                        if(comm.browser.versions.iPhoneX){
                            _sBtn.css({position: 'fixed', bottom: "0.4533rem"});
                        }
                    }
                    scrTop = $(this).scrollTop(); //当前可视区域距离顶端的距离
                    scrollFlag = Math.abs($(document).height() - $(".pageFooter").outerHeight() - $(".registrationEntrance").outerHeight());
                    if (scrollFlag - scrTop <= $(window).height()) {//滚动到底了
                        if (_signUpBtn.is(":visible")) {//底部报名栏可见
                            _sBtn.css({position: 'fixed', bottom: "1rem"});
                            _signUpBtn.css({position: 'fixed', bottom: "1.535rem"});//底部报名栏
                            if(comm.browser.versions.iPhoneX){
                                _sBtn.css({position: 'fixed', bottom: "1.4533rem"});
                                _signUpBtn.css({position: 'fixed', "padding-bottom": "0"});//底部报名栏
                            }
                        } else {
                            _sBtn.css({position: 'fixed', bottom: "1.6rem"});
                            if(comm.browser.versions.iPhoneX){
                                _sBtn.css({position: 'fixed', bottom: "2.0533rem"});
                            }
                        }
                    } else {//还未滚动到底部
                        if (_signUpBtn.is(":visible")) {//底部报名栏可见
                            _sBtn.css({position: 'fixed', bottom: "0.6rem"});
                            _signUpBtn.css({position: 'fixed', bottom: "0"});//底部报名栏
                            if(comm.browser.versions.iPhoneX){
                                _sBtn.css({position: 'fixed', bottom: "1.4533rem"});
                                _signUpBtn.css({position: 'fixed', "padding-bottom": "0.4533rem"});//底部报名栏
                            }
                        } else {
                            _sBtn.css({position: 'fixed', bottom: "1px"});
                            if(comm.browser.versions.iPhoneX){
                                _sBtn.css({position: 'fixed', bottom: "0.4533rem"});
                            }
                        }
                    }
                }
            });
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
                if ($('html').attr('data-dpr') == '1' && navH < 40 || $('html').attr('data-dpr') == '2' && navH < 80 || $('html').attr('data-dpr') == '3' && navH < 120) {
                    $(".spTemp_total_nav_list li").css({
                        'padding': '0 ' + marginNum / 75 + 'rem'
                    })
                } else {
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
                        if ($(".spTemp_total_nav_list li").length != 1) {
                            $(".ev-placeholder").css("height", $(".spTemp_total_nav").outerHeight());
                        }
                    } else {
                        $('.spTemp_nav_more').removeClass('spTemp_nav_more_pack').addClass('spTemp_nav_more_spread');
                        $('.spTemp_total_nav_list').css({
                            overflow: 'hidden',
                            height: 150 / 75 + 'rem'
                        });
                        if ($(".spTemp_total_nav_list li").length != 1) {
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
                        if ($(".spTemp_total_nav_list li").length != 1) {
                            $(".ev-placeholder").css("height", $(".spTemp_total_nav").outerHeight());
                        }
                    } else {
                        $(this).removeClass('spTemp_nav_more_pack').addClass('spTemp_nav_more_spread');
                        $('.spTemp_total_nav_list').css({
                            overflow: 'hidden',
                            height: 150 / 75 + 'rem'
                        });
                        if ($(".spTemp_total_nav_list li").length != 1) {
                            $(".ev-placeholder").css("height", $(".spTemp_total_nav").outerHeight());
                        }
                    }
                });
            }
        },
        //首次加载页面渲染
        firstLoad: function () {
            var t = this;
            var homePage = "",
                homeType = "",
                areaOrSemi = "",
                myWorks = "",
                activityMenuId = "",
                layoutId = "";
            var el = $(".spTemp_total_nav_list li:eq(0)");
            homePage = $(el).children("span").data("href") ? $(el).children("span").data("href").replace("https:", "") : "";
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
                        $(".spTemp_total_nav").addClass("waitingWorkChange");
                    } else {
                        $(".spTemp_total_nav").removeClass("waitingWorkChange");
                    }
                    t.judgeUtlType({
                        urlType: urlType,
                        urlLink: urlLink,
                        activityMenuId: activityMenuId,
                        layoutId: layoutId,
                        areaOrSemi: areaOrSemi,
                        myWorks: myWorks
                    });
                    $(".spTemp_total_nav_lists_two").hide().parent().removeClass("nav_cut_hasTwo_down").addClass("nav_cut_hasTwo_up");
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
                    setTimeout(function(){
                        g_sps.jump(null,href);
                    },500);
                    t.snsShare($.trim($(this).text()));
                }
                $(".ev-resource_list").attr("scrollPagination", "disabled");

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
                setTimeout(function(){
                  g_sps.jump(null,href);
                },500);
                t.snsShare($.trim($(this).text()));
                $(".ev-resource_list").attr("scrollPagination", "disabled");

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
                        activityMenuId: uv.activityMenuId,
                        siteId: 2
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
                        t.footerFixed();
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
                        visitSiteId: 2,
                        customerId: localStorage.getItem("userId") ? localStorage.getItem("userId") : '',
                        activityId: $("#activityId").val()
                    };
                    var callbacks = function (data) {
                        if (data && data.bo && data.bo.responseData && !$.isEmptyObject(data.bo.responseData)) {
                            spTemp_list.one.spTemp_listLoad({ //资源
                                resTemplate: data,   //返回数据
                                fn: function () {
                                    t.footerFixed();
                                }
                            });
                            questionnaire.one.question_listLoad({//问卷
                                resTemplate: data,  //返回数据
                                fn: function () {
                                    t.footerFixed();
                                }
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
                customerId: cId,
                pageIndex: 1,
                pageSize: 50,
                attUseFlag: 4,
                dataFlag: 4,
                sessionCustomerId: cId
            };
            var callB = function (rep) {
                if (rep && rep.responseObject && rep.responseObject.responseData &&
                    rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                    var list = rep.responseObject.responseData.data_list;
                    var html = "";
                    $.each(list, function (i, val) {
                        var trend = val;
                        var resourceUrl = "";		//无效链接
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
                                if (trend.customer_trends.isValid === 1 && trend.customer_trends_type == 7) {	//只有病例终端待审核才能跳转
                                    resourceUrl = trend.customer_trends.resourceUrl;
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
                                    resourceUrl = trend.customer_trends.resourceUrl;
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
                                    resourceUrl = trend.customer_trends.resourceUrl;
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
                        html += '<li class="ev-resClick" tplPath="' + trend.resource_valid.tpl_path + '"  resourceUrl="' + resourceUrl + '" trendType="' + trendType + '" resourceName="' + trend.customer_trends.resourceName + '">' +
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
                t.footerFixed();
            };
            comm.ajax.async(t.config.json_list_v2, paramData, callB);
        },
        //我的作品列表点击跳转事件
        myWorksResClick: function () {
            $(".ev-resClick").on("click", function (event) {
                event.stopPropagation();
                var resourceUrl = $(this).attr("resourceUrl");
                if (resourceUrl) {
                    g_sps.jump($(this), resourceUrl);
                }
                return false;
            });
        },
        //微信/空间/微博分享功能
        snsShare: function (kv) {
            var t = this;
            var activityId = $('#activityId').val(),
                shareData = {};
            var callback = function (data) {
                if (data && data.responseObject && !$.isEmptyObject(data.responseObject)) {//有分享话术的情况
                    shareData.shareTitle = data.responseObject.shareTitle;
                    shareData.shareUrl = data.responseObject.sharePicUrl;
                    shareData.shareContent = (kv && data.responseObject.shareContent) ? data.responseObject.shareContent + '——' + kv : data.responseObject.shareContent;
                    t.shareFunc(shareData);
                } else {//无分享话术的默认情况
                    shareData.shareTitle = document.title;
                    shareData.shareUrl = "";
                    shareData.shareContent = kv ? "汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。" + "——" + kv : "汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。";
                    t.shareFunc(shareData);
                }
            };
            comm.ajax.async(t.config.shareUrl, {activityId: activityId}, callback);
        },
        //shareAll分享函数
        shareFunc: function (shareData) {
            shareAll({
                title: shareData.shareTitle, //默认标题
                url: window.location.href,
                pic: shareData.shareUrl,
                summary: shareData.shareContent,
                desc: shareData.shareContent,
                sinaTitle: shareData.shareTitle + '——' + shareData.shareContent + ' 点击查看：'
            }, false, $(".Ev-ShareBtn"));
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
