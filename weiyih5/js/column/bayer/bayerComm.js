/**
 * 功能描述： 拜耳例之声的公共模块、活动介绍、优秀病例页面
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2016/04/05.
 */

$(function() {
    //window.onload = Log.createBrowse(52,'拜耳活动页面');
    //处理Bayer一期活动
    var oneI = location.href.indexOf("bayer_index.html") > 0 || location.href.indexOf("bayer_activity.html") > 0 || location.href.indexOf("bayer_case.html") > 0;
    if (oneI) {
        //上传参选作品的点击
        $(".Ev-BayerUpCaseBtn").on("click", function() {
            user.privExecute({
                operateType: 'auth',
                callback: function() {
                  g_sps.jump(null,"/pages/case/case_upload.html");
                }
            });

        });
    } else { //非一期
        navbarScroll();

    }

    $(".footerBackToTop").click(function() {
        backToTop(300);
    });

    function backToTop(delay) {
        $('html,body').animate({
            scrollTop: 0
        }, delay, "swing");
    }


    //分享到微博、qq空间、微信
    //mobileShare($(".Ev-BayerShareCaseBtn"), {
    //    title: 'Xa例之声 | 决战羊城，赛场集锦抢先看！', //默认标题
    //    url: window.location.href,
    //    pic: 'https://m.allinmd.cn/images/img50/column/bayer_race/leftDai.png',
    //    summary: "#厚积理应薄发，实力就该发声#我正在观看总决赛精彩视频，来和我一起欣赏吧！", //分享话术
    //    desc: '#厚积理应薄发，实力就该发声#我正在观看总决赛精彩视频，来和我一起欣赏吧！' //微信描述
    //});


    var shareTitle='Xa例之声 | 决战羊城，赛场集锦抢先看！';
    var shareDesc="#厚积理应薄发，实力就该发声#我正在观看总决赛精彩视频，来和我一起欣赏吧！";
    shareAll({
        title:shareTitle,
        url:window.location.href,//不传默认取当前地址
        pic:'https://m.allinmd.cn/images/img50/column/bayer_race/leftDai.png',//分享图片
        trendUrl:"",//分享动态的请求连接  //不需要动态分享就不传
        noPJ:0,//0：分享动态给后台的参数需要转为paramJson ,1:不需要
        data:{},//分享动态传给后台的参数
        callback:function(){},//分享动态后成功后的回调函数
        wxTitle:shareTitle,//微信分享标题
        wxDesc:shareDesc,//微信分享描述
        timeLineTitle:shareDesc,
        sinaTitle:shareDesc,//新浪title
        desc:shareDesc,//新浪的描述
        qzoneTitle:shareTitle,//qq空间title
        summary:shareDesc,//qq空间的描述
        qShareLog:function(x){
            comm.shareLog({
                isValid: 1,
                shareSence:33,
                shareChannel:x=='sina'?3:1,
                shareContent:shareTitle
            });
        },  //分享新浪，空间成功与否都执行
        fnMessageSuc:function(){//分享好友成功回调
            comm.shareLog({
                isValid: 1,
                shareSence:33,
                shareChannel:4,
                shareContent:shareTitle
            });
        },
        fnTimelineSuc:function(){//分享朋友圈成功回调
            comm.shareLog({
                isValid: 1,
                shareSence:33,
                shareChannel:5,
                shareContent:shareTitle

            });
        }
    },false,$(".Ev-BayerShareCaseBtn"));



    var userAgentInfo = navigator.userAgent;
    var isIphone = false;
    if (userAgentInfo.indexOf("iPhone") > 0) {
        isIphone = true
    }
    var isWeixin = (userAgentInfo.indexOf("MicroMessenger") > 0);

    if (isIphone) {
        if (isWeixin) {
            $(".Ev-footerAppDownload").attr("href", "http://a.app.qq.com/o/simple.jsp?pkgname=com.allin.social");
        } else {
            $(".Ev-footerAppDownload").attr("href", "https://itunes.apple.com/cn/app/wei-yi-for-iphone/id986266583");
        }
    } else {
        $(".Ev-footerAppDownload").attr("href", "http://a.app.qq.com/o/simple.jsp?pkgname=com.allin.social");
    }

    footerBtnScroll();

});
var scrollFlag = null;
var oneI = location.href.indexOf("bayer_index.html") > 0 || location.href.indexOf("bayer_activity.html") > 0 || location.href.indexOf("bayer_case.html") > 0;

function footerBtnScroll() { //底部分享按钮的位置
    var scrTop;
    var winH;
    var bodyH;
    winH = $(window).height(); //当前屏幕的高度
    bodyH = $(".main").height(); //总高度
    scrollFlag = Math.abs(bodyH - winH - $(".pageFooter").height() - $(".footerBtn").height());

    if ($(document).height() - winH < scrollFlag) {
        $(".footerBtn").css({
            position: 'fixed',
            bottom: '1.6rem'
        });
        $(window).on("scroll touchend", function() {
            return;
        });
    } else {

        $(".footerBtn").css("position", "fixed");
        $(".footerBtn").css("bottom", "0");
        $(window).on("scroll touchend", function() {
            scrTop = $(document).scrollTop(); //卷起来的高度
            if (scrTop > scrollFlag) {
                $(".footerBtn").css("position", "fixed");
                $(".footerBtn").css("bottom", "1.6rem");
            }
            if (scrTop < (scrollFlag)) {
                if ($(".Ev-CaseList").length && ($(".Ev-CaseList").parents(".main").height() - $(".pageFooter").height()) < $(window).height()) {
                    $(".footerBtn").css("bottom", "1.6rem");
                } else {
                    $(".footerBtn").css("position", "fixed");
                    $(".footerBtn").css("bottom", "0");
                }

            }
        });
    }


}

function cutstr(str, len) {
    var str_length = 0;
    var str_len = 0;
    str_cut = new String();
    str_len = str.length;
    for (var i = 0; i < str_len; i++) {
        a = str.charAt(i);
        str_length++;
        if (escape(a).length > 4) {
            //中文字符的长度经编码之后大于4
            str_length++;
        }
        str_cut = str_cut.concat(a);
        if (str_length >= len) {
            //str_cut = str_cut.concat("...");
            return str_cut;
        }
    }
    //如果给定字符串小于指定长度，则返回源字符串；
    if (str_length < len) {
        return str;
    }
}

function getLength(str) {
    var realLength = 0,
        len = str ? str.length : 0,
        charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
}

//Created by QiangKailiang on 2016/04/25
//可滑动导航条声明
function navbarScroll() {
    var scrollNavbar = new Swiper('.topNavbarSix', {
        slidesPerView: 4,
        freeMode: true
    });
}
