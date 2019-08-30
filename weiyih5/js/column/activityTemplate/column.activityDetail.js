/**
 * 功能描述： 拜耳例之声的总决赛页
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HJ on 2017/04/25.
 */
$(function () {
    //Log.createBrowse(198, "新版活动详情页");
    var _sBtn = $(".Ev-ShareBtn");
    var activityDetail = {
        config:{
            shareUrl:M_CALL+"cms/activity/getById/"//分享接口
        },
        init: function () {
            var t = this;
            t.snsShare();
            t.bannerSwiper();
            t.footerClick();
            t.actListEvent();
            t.shareBtnScroll();
        },
        //头部轮播，头部返回按钮，底部
        bannerSwiper: function () {
            //头部banner轮播
            if ($("#bannerLength").val() == 1) {
                var headBanner = new Swiper('.headBanner', {
                    noSwiping: true
                });
            } else {
                var headBanner = new Swiper('.headBanner', {
                    autoplay: 3000,
                    loop: true,
                    pagination: '.swiper-pagination',
                    autoplayDisableOnInteraction: false
                });
            }
            //点击左上按钮返回上一页
            $(".Ev-BackBtn").on("click", function () {
                history.back();
            });
        },
        //页脚返回顶部操作、无内容时页脚居于底部、下载
        footerClick:function(){
            //页脚返回顶部操作
            $(".footerBackToTop").click(function () {
                backToTop(300);
            });
            function backToTop(delay) {
                $('html,body').animate({
                    scrollTop: 0
                }, delay, "swing");
            }
            //无内容时页脚居于底部
            $(window).bind("scroll", function() {
                if ($(".main").height() <= $(window).height()) {
                    $(".pageFooter").addClass('takeInBottom');
                } else {
                    $(".pageFooter").removeClass('takeInBottom');
                }
            });
            //下载
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
        //微信/空间/微博分享功能
        snsShare: function() {
            var t=this;
            var activityId = $('#activityId').val(),
                shareData={};
            var callback=function(data){
                if (data && data.responseObject&&!$.isEmptyObject(data.responseObject)) {//有分享话术的情况
                    shareData.shareTitle = data.responseObject.shareTitle;
                    shareData.shareUrl = data.responseObject.sharePicUrl;
                    shareData.shareContent = data.responseObject.shareContent;
                    t.shareFunc(shareData);
                }else{//无分享话术的默认情况
                    shareData.shareTitle = document.title;
                    shareData.shareUrl ="";
                    shareData.shareContent ="汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。";
                    t.shareFunc(shareData);
                }
            };
            comm.ajax.async(t.config.shareUrl,{ activityId: activityId},callback);
        },
        //shareAll分享函数
        shareFunc:function(shareData){
            shareAll({
                title:shareData.shareTitle, //默认标题
                url: window.location.href,
                pic: shareData.shareUrl,
                summary: shareData.shareContent,
                desc:  shareData.shareContent,
                sinaTitle:shareData.shareTitle+'——'+shareData.shareContent+' 点击查看：'
            },false,_sBtn);
        },
        //列表title长度截取，列表点击事件处理
        actListEvent:function(){
            $(".case_content").on("click", function () {
                var href = $(this).find("a").attr("href");
                g_sps.jump(null,href);
                return false;
            });

            //病例列表长度截取
            $(".ev-titleLenCtrl").each(function (i, e) {
                $(e).text(comm.getStrLen($(e).text(), 32));
            });
        },
        //分享按钮滚动处理
        shareBtnScroll:function(){
            var scrTop,
                winH = $(window).height(),//当前屏幕的高度
                bodyH = $(document).height();//总高度
            var scrollFlag = Math.abs(bodyH - $(".pageFooter").height() - _sBtn.height());
            if (bodyH - winH < 5) {
                _sBtn.css({position: 'fixed', bottom: "1.6rem"});
            } else {
                _sBtn.css({position: 'fixed', bottom: "1px"});
                $(window).bind("scroll", function () {
                    scrTop = $(this).scrollTop(); //当前可视区域距离顶端的距离
                    if (scrTop > scrollFlag) {
                        _sBtn.css({position: 'fixed', bottom: "1.6rem"});
                    } else {
                        if (scrollFlag - scrTop <= winH) {
                            _sBtn.css({position: 'fixed', bottom: "1.6rem"});
                        } else {
                            _sBtn.css({position: 'fixed', bottom: "1px"});
                        }
                    }
                });
            }
        }
    };
    activityDetail.init();
});
