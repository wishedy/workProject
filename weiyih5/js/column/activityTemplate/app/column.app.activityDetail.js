/**
 * 功能描述： 拜耳例之声的总决赛页
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HJ on 2017/04/26.
 */
$(function () {
    var _sBtn = $(".Ev-ShareBtn");
    var activityDetail = {
        config: {
            shareUrl: M_CALL + "cms/activity/getById/"//分享接口
        },
        init: function () {
            var t = this;
            t.snsShare();
            t.bannerSwiper();
            t.actListEvent();
        },
        //头部轮播
        bannerSwiper: function () {
            //轮播图长度
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
        },
        //微信/空间/微博分享功能
        snsShare: function () {
            var t = this;
            var activityId = $('#activityId').val(),
                url=window.location.href.replace("/app/", "/m/"),
                shareData = {};
            var callback = function (data) {
                if (data && data.responseObject && !$.isEmptyObject(data.responseObject)) {//有分享话术的情况
                    shareData.shareTitle = data.responseObject.shareTitle;
                    shareData.shareUrl = data.responseObject.sharePicUrl;
                    shareData.shareContent = shareData.shareTitle + "——" + data.responseObject.shareContent + " 点击查看：" + url;
                    shareData.qqContent = data.responseObject.shareContent;
                    shareData.emailContent = shareData.shareContent + "查看详情" + url;
                    shareData.emailTitle = "（分享自：唯医）" + shareData.shareTitle + "  点击查看";
                    t.shareFunc(shareData);
                } else {//无分享话术的默认情况
                    shareData.shareTitle = document.title;
                    shareData.shareUrl = "";
                    shareData.shareContent = shareData.shareTitle + "——" + "汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。" + " 点击查看：" + url;
                    shareData.qqContent = "汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。";
                    shareData.emailContent = "汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。" + "查看详情" + url;
                    shareData.emailTitle = "（分享自：唯医）" + document.title + "  点击查看";
                    t.shareFunc(shareData);
                }
            };
            comm.ajax.async(t.config.shareUrl, {activityId: activityId}, callback);
        },
        //shareAll分享函数
        shareFunc: function (shareData) {
            _sBtn.on("click", function () {
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
        //列表title长度截取，列表点击事件处理
        actListEvent:function(){
            //病例列表长度截取
            $(".ev-titleLenCtrl").each(function (i, e) {
                $(e).text(comm.getStrLen($(e).text(), 32));
            });
            $(".case_content").on("click", function () {
                var resourceId = $(this).find("a.appZDtitle").attr("resourceId"),
                    resourceType = $(this).find("a.appZDtitle").attr("resourceType"),
                    tplPath = $(this).find("a.appZDtitle").attr("tplPath");
                appjs.gotoTerminalDetailVC($.toJSON({
                    "resourceId": resourceId,
                    "resourceType": resourceType,
                    "tplPath": tplPath
                }));
            });
        }
    };
    activityDetail.init();

    //app标题替换，有毒的方法，js方法在此调用的下边，会不执行
    var val = $("#areaName").val();
    appjs.updateTitle(val);
});
