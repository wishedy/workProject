/**
 * app专题模板 核心功能与事件交互
 * Created by lichunhui on 2016/09/22.
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
                break;
            case 4:
                $(".Ev-NavbarItem").css('width', "25%");
                break;
            case 3:
                $(".Ev-NavbarItem").css('width', "33.3333333333333%");
                break;
            case 2:
                $(".Ev-NavbarItem").css('width', "50%");
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
    snsShare: function() {
        var themeId = $('#themeId').val().replace(/,/g, ''); // "1461654118153";
        var info, imgData, shareImg = 'http://img50.allinmd.cn/app/allin_logo.png';
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
                    shareImg = "http:"+imgData[im].attPicUrl;
                    break;
                }
            }
        }
        var url=window.location.href.replace("/app/","/m/");
        $(".Ev-ShareBtn").on("click",function(){
            appjs.share($.toJSON({"url":url,
                    "imgUrl":shareImg,
                    "sinaContent":info != undefined && info.shareContent != "" ? info.shareTitle+"——"+info.shareContent+" 点击查看："+url : info.shareTitle+"——"+"汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。"+" 点击查看："+url,//新浪簡介
                    "qqTitle":info != undefined && info.shareTitle != "" ? info.shareTitle : document.title, //qq微信title,
                    "qqContent":info != undefined && info.shareContent != "" ? info.shareContent : "汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。",//qq微信簡介
                    "messageContent":info != undefined && info.shareContent != "" ? info.shareTitle+"——"+info.shareContent+" 点击查看："+url : info.shareTitle+"——"+"汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。"+" 点击查看："+url,//短信
                    "emailTitle":info != undefined && info.shareTitle != "" ? "（分享自：唯医）"+info.shareTitle+"  点击查看" : "（分享自：唯医）"+document.title+"  点击查看", //qq微信title,
                    "emailContent":info != undefined && info.shareContent != "" ? info.shareContent+"查看详情"+url : "汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。"+"查看详情"+url//youxiang
                })
            );
        });
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
    global.init();
    //点击回到顶部
    $(".Ev-BackToTop").on("click", function() {
        global.backToTop(500);
    });

    //粘性导航滑动触发
    $(window).on('scrollstart scrollstop touchmove', function() {
        global.resourceNavbarFixed();
    });
    //终端页跳转
    $(".contentBox").on("click",function(){
        resourceId=$(this).attr("resourceId");
        resourceType=$(this).attr("resourceType");
        tplPath=$(this).attr("tplPath");
        appjs.gotoTerminalDetailVC($.toJSON({"resourceId":resourceId,"resourceType":resourceType,"tplPath":tplPath}));
    })
});
