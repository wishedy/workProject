 function downloadAppAddress() {
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
    return link;
};
$(function(){
   $("#EV-download").attr("href",downloadAppAddress())
});

