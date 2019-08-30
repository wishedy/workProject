/**
 * 专题模板 核心功能与事件交互
 * Created by Qiangkailiang on 2016/4/21.
 */


var global = {
    scrollFlag: true,
    //回到顶部功能
    backToTop: function(speed) {
        var backSpeed = speed || 500;
        $("html,body").animate({
            scrollTop: 0
        }, backSpeed, "swing");
    },

    //“过往推荐”部分的图片动态样式功能
    recommendImageNum: function() {
        var imgNum = $(".Ev-PastContent").size();
        if (imgNum > 4 || imgNum === 0) {
            console.log('错误：“过往推荐”的图片数量仅支持1-4张.');
            return;
        }
        switch (imgNum) {
            case 1:
                $(".Ev-PastContentBox").addClass("oneImg");
                break;
            case 2:
                $(".Ev-PastContentBox").addClass("twoImg");
                break;
            case 3:
                $(".Ev-PastContentBox").addClass("threeImg");
                break;
            case 4:
                $(".Ev-PastContentBox").addClass("fourImg");
                break;
        }
    },
    //导航栏点击跳转锚点功能
    resourceChange: function(speed) {
        var changeSpeed = speed || 500;
        var nH = $(".Ev-Navbar").height();
        var t = this;
        var ele;

        $(".Ev-NavbarItem").removeClass('on').eq(0).addClass('on');

        $(".Ev-HideNavbar").height(nH);
        $(".Ev-NavbarItem").on("click", function(e) {
            t.scrollFlag = false;
            e.stopPropagation();
            ele = (e.target.nodeName.toLowerCase() === 'img') ? $(e.target.parentNode.parentNode) : $(e.target);
            ele.addClass("on").siblings(".Ev-NavbarItem").removeClass("on");

            if (ele.hasClass("Ev-NavbarItemChange")) {
                var index = $(".Ev-NavbarItemChange").index(ele);
                var h = $(".Ev-MainContent").eq(index).offset().top - nH;

                $("html,body").animate({
                    scrollTop: h
                }, changeSpeed, function() {
                    t.scrollFlag = true;
                });
            } else {
                t.scrollFlag = false;

                var index = $(".Ev-NavbarItem").index(ele);
                var oH = $(".banner").height();
                $(".Ev-MainContent").hide().eq(index).show();
                $("html,body").scrollTop(oH);


                if ($(window).height() === $("body").height()) {
                    $(".bottomBtn").addClass('lessBottomBtn');
                } else {
                    $(".bottomBtn").removeClass('lessBottomBtn');
                }
            }
        });
    },

    //导航栏图片自适应宽度功能
    resourceNavNum: function() {
        switch ($(".Ev-NavbarItem").size()) {
            case 5:
                $(".Ev-NavbarItem").css('width', "20%");
                $(".Ev-NavbarItem").last().css('width', "19%");
                break;
            case 4:
                $(".Ev-NavbarItem").css('width', "25%");
                $(".Ev-NavbarItem").last().css('width', "24%");
                break;
            case 3:
                $(".Ev-NavbarItem").css('width', "33.3333333333333%");
                $(".Ev-NavbarItem").last().css('width', "32.3333333333333%");
                break;
            case 2:
                $(".Ev-NavbarItem").css('width', "50%");
                $(".Ev-NavbarItem").last().css('width', "50%");
                break;
            case 1:
                $(".Ev-Navbar").hide();
                break;
        }
    },
    //粘性导航及导航项目自动切换功能
    resourceNavbarFixed: function() {

        var oH = $(".Ev-Navbar").height();
        if ($(".Ev-MainContent:visible").offset().top - $(document).scrollTop() <= oH) {
            $(".Ev-Navbar").addClass("fixed");
            $(".Ev-HideNavbar").show();
        } else {
            $(".Ev-Navbar").removeClass("fixed");
            $(".Ev-HideNavbar").hide();
        }

        if (this.scrollFlag) {
            if ($(".Ev-NavbarItem").hasClass('Ev-NavbarItemChange')) {
                $(".Ev-MainContent").each(function(index, element) {
                    var oH = $(element).offset().top - $(document).scrollTop() - $(".Ev-Navbar").height();

                    if (oH < 10) {
                        $(".Ev-NavbarItem").eq(index).addClass('on').siblings('.Ev-NavbarItem').removeClass('on');
                    }
                });
            }
        }
    },

    //点击跳转下载页面
    downloadApp: function() {
        var userAgentInfo = navigator.userAgent;
        var isIphone = false;
        if (userAgentInfo.indexOf("iPhone") > 0) {
            isIphone = true;
        }
        var isWeixin = (userAgentInfo.indexOf("MicroMessenger") > 0);

        if (isIphone) {
            if (isWeixin) {
                $(".Ev-DownloadApp").attr("href", "http://a.app.qq.com/o/simple.jsp?pkgname=com.allin.social");
            } else {
                $(".Ev-DownloadApp").attr("href", "https://itunes.apple.com/cn/app/wei-yi-for-iphone/id986266583");
            }
        } else {
            $(".Ev-DownloadApp").attr("href", "http://a.app.qq.com/o/simple.jsp?pkgname=com.allin.social");
        }
    },
    //去除标题蓝色框内的空格
    contentTypeTrim: function() {
        $(".contentType").each(function(index, el) {
            var text = $(el).text().trim('string');
            $(el).text(text);
        });
    },
    //微信/空间/微博分享功能
    /*Created By SunHaibin on 2016/05/05*/
    snsShare: function() {
        var themeId = $('#themeId').val().replace(/,/g, ''); // "1461654118153";
        var info, imgData, shareImg = '/images/img50/allin_logo.png';
        if (info == undefined) {
            $.ajax({
                url: "/mcall/cms/theme/getMapById/",
                data: { paramJson: $.toJSON({ themeId: themeId }) },
                dataType: 'json',
                type: "post",
                async: false,
                success: function(data) {
                    if (data && data.responseObject && data.responseObject.responseData && !$.isEmptyObject(data.responseObject.responseData)) {
                        info = data.responseObject.responseData.bo_data;
                        imgData = data.responseObject.responseData.bo_data_attachment;
                    }
                }
            });
        }
        if (imgData != undefined && imgData.length) {
            for (var im = 0; im < imgData.length; im++) {
                if (imgData[im].refType == 2) {
                    shareImg = imgData[im].attPicUrl;
                    break;
                }
            }
        }

        shareAll({
            title: info != undefined && info.shareTitle != "" ? info.shareTitle : document.title, //默认标题
            url: window.location.href,
            pic: shareImg,
            summary: info != undefined && info.shareContent != "" ? info.shareContent : "汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。", //
            desc: info != undefined && info.shareContent != "" ? info.shareContent : "汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。" //微信描述
        },false,$(".Ev-ShareBtn"));

    },
    wakeUpApp:function(){
        if(!comm.isApp()){
            var amChannel = comm.getpara()._amChannel;
            var refId = $('#themeId').val();
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
            $(".spTemp_total_up").css({"position":"relative"});
            comm.appWakeUp("figure", callAppOptions);//唤醒app弹层
        }
    },
    //功能加载
    init: function() {
        var titleImgFlag = $(".mainTitle .titleImg img").attr("src");
        //底部过往推荐若无图片则隐藏容器
        if ($(".Ev-PastContentBox img").size() > 0) {
            this.recommendImageNum();
        } else {
            $(".Ev-PastContentBox").hide();
        }
        //若未传入顶部主标题图片则容器不显示
        if (titleImgFlag.length === 0) {
            $(".mainTitle").hide();
        }
        //切换模式下默认第一部分内容显示
        if ($(".Ev-NavbarItemChange").size() === 0) {
            $(".Ev-MainContent").hide().eq(0).show();
        }
        //若无用户信息则容器清空
        $(".personalMsg").each(function(index, el) {
            var user=$(el).find('.user').text().length;
            var host=$(el).find('.hospital').text().length;
            if (user===0||host===0) {
                $(el).find('.point').hide();
            }
        });
        //去除两端空格 加载
        this.contentTypeTrim();
        //定位导航 加载
        this.resourceChange(500);
        //导航图片自适应 加载
        this.resourceNavNum();
        //分享功能 加载
        this.snsShare();
    }
};

$(function() {
    //Log.createBrowse(79,"专题内容页");
    global.init();
    //点击回到顶部
    $(".Ev-BackToTop").on("click", function() {
        global.backToTop(500);
    });
    //点击下载
    $(".Ev-DownloadApp").on("click", function() {
        global.downloadApp();
    });
    //点击回到上一页
    $(".Ev-BackPast").on("click", function() {
        history.back(-1);
    });
    setTimeout(function(){
        global.wakeUpApp();
    },1000);

    //粘性导航滑动触发
    $(window).on('scrollstart scrollstop touchmove', function() {
        global.resourceNavbarFixed();
    });

});
