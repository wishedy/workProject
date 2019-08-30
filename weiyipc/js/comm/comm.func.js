/**
 * 功能描述：  方法集
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiuYuTao on 2015/3/5.
 */

comm.setCenter = function(obj){
    var positionFromTop = ($(window).height()-obj.height())/2;
    var positionFromLeft = ($(window).width()-obj.width())/2;
    var top  = $(window).scrollTop() + positionFromTop;
    var left = $(window).scrollLeft() + positionFromLeft;
    obj.css({
        top: top + 'px',
        left: left + 'px'
    });
};

comm.browser = {
    mozilla : /firefox/.test(navigator.userAgent.toLowerCase()),
    webkit : /webkit/.test(navigator.userAgent.toLowerCase()),
    opera : /opera/.test(navigator.userAgent.toLowerCase()),
    msie : /msie/.test(navigator.userAgent.toLowerCase()),
    qqbrowser:/qqbrowser/.test(navigator.userAgent.toLowerCase()),
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {//移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') === -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase(),
    isIe8:function(){
        var browser = navigator.appName;
        var b_version = navigator.appVersion;
        var version = b_version.split(";");
        var trim_Version = (version[1]!=undefined&&version[1]!="")?version[1].replace(/[ ]/g, ""):"";
        if (browser === "Microsoft Internet Explorer" && trim_Version=="MSIE8.0") {
            return true;
        } else {
            return false;
        }
    },
    isIe9:function(){
        var browser = navigator.appName;
        var b_version = navigator.appVersion;
        var version = b_version.split(";");
        var trim_Version = (version[1]!=undefined&&version[1]!="")?version[1].replace(/[ ]/g, ""):"";
        if (browser === "Microsoft Internet Explorer" && trim_Version=="MSIE9.0") {
            return true;
        } else {
            return false;
        }
    },
    //ie8以下
    isLessEqIe8:function() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
        if(isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if(fIEVersion == 6||fIEVersion == 7||fIEVersion == 8) {
                return true;
            }else {
                return false;
            }
        }else{
            return false;//不是ie浏览器
        }
    },
    isIeOrEdge:function() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if(isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if(fIEVersion == 7) {
            return true;
        } else if(fIEVersion == 8) {
            return true;
        } else if(fIEVersion == 9) {
            return true;
        } else if(fIEVersion == 10) {
            return true;
        } else {
            return true;//IE版本<=7
        }
    } else if(isEdge) {
        return true;//edge
    } else if(isIE11) {
        return true; //IE11
    }else{
        return false;//不是ie浏览器
    }
  },
    isLessIe10:function() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
        var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        if(isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if(fIEVersion == 7) {
                return true;
            } else if(fIEVersion == 8) {
                return true;
            } else if(fIEVersion == 9) {
                return true;
            } else if(fIEVersion == 10) {
                return true;
            } else {
                return false;//IE版本<=7
            }
        } else if(isEdge) {
            return false;//edge
        } else if(isIE11) {
            return false; //IE11
        }else{
            return false;//不是ie浏览器
        }
    }
};

comm.setImgSize = function (maxHeight,maxWidth,objImg) {
        var img = new Image();
        img.src = objImg.src;
        var hRatio;
        var wRatio;
        var Ratio = 1;
        var w = img.width;
        var h = img.height;
        wRatio = maxWidth / w;
        hRatio = maxHeight / h;
        if (maxWidth ===0 && maxHeight===0){
            Ratio = 1;
        }else if (maxWidth===0){//
            if (hRatio<1) Ratio = hRatio;
        }else if (maxHeight===0){
            if (wRatio<1) Ratio = wRatio;
        }else if (wRatio<1 || hRatio<1){
            Ratio = (wRatio<=hRatio?wRatio:hRatio);
        }
        if (Ratio<1){
            w = w * Ratio;
            h = h * Ratio;
        }
        objImg.height = h;
        objImg.width = w;
};
/**
 * 将超出长度的字符串加。。。
 * @param str
 * @param len
 * @returns {string}
 */
comm.getStrLen = function(str,len){
    var strlen= 0,s = "";
    if(!str){
        return '';
    }
    for(var i = 0;i < str.length; i++) {
        s = s + str.charAt(i);
        if (str.charCodeAt(i) > 128) {
            strlen = strlen + 2;
            if(strlen >= len){
                return s.substring(0,s.length-1) + "...";
            }
        } else {
            strlen = strlen + 1;
            if(strlen >= len){
                return s.substring(0,s.length-2) + "...";
            }
        }
    }
    return s;
};
/*
* 截取字符长度
* */
comm.getStrByteLen=function(str,len){
    var newStr='',newLength=0;
    if(!str){//如果不存在
        return '';
    }
    for(var i=0;i<str.length;i++){
        if(str.charCodeAt(i)>128){
            newLength+=2;
        }else{
            newLength++;
        }
        if(newLength<=len){
            newStr=newStr.concat(str[i]);
        }else{
            break;
        }
    }
    if(newLength>len){
        newStr = newStr+"..."
    }
    return newStr;
};
comm.revCutstr=function (str, len) {
    function newCut(str, len){
        var str_length = 0;
        var str_len = 0;
        str_cut = new String();
        str_len = str.length-1;
        for (var i =  str_len; i >=0; i--) {
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
    var str=newCut(str, len);
    str_cut1 = new String();
    for(var i=str.length;i>=0;i--){
        a = str.charAt(i);
        str_cut1 = str_cut1.concat(a);
    }
    return str_cut1;

};
/*
*获取字符串长度
*/
comm.getByteLen = function(val){
    var len = 0;
    for (var i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/ig) !== null) // 全角
            len += 2;
        else
            len += 1;
    }
    return len;
};

// 取消冒泡
comm.stopBubble = function (event) {
    event && event.stopPropagation ? event.stopPropagation() : window.event.cancelBubble = !0
};

/**
 * 用户类型
 * @param account
 * @returns {string}
 */
comm.checkAccountType = function(account) {
    var type = "";
    // if(/^(127|13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/.test(account)){
    if(/^1\d{10}$/.test(account)){
        type = "mobile";
    }
    if(/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(account)){
        type = "email";
    }
    return type;
};
//分享日志
comm.shareLog = function(options) {
    var _val = $('#sesCustomerId').val();
    var customerId = (_val != "" && _val != undefined) ? _val : "";
    var conId = comm.getpara().conId;
    var defaultOptions = {
        customerId: customerId,
        shareType: 3,
        resourceId: conId,
        resourceType: 3,
        refId: conId,
        isValid: 1,
        refUrl: window.location.href
    };
    //  shareType"));//1-视频，2-文库，3-会议 4-话题，7-病例，8－评论
    //  shareSence"));//分享场景24-会议直播页面-多会场 25-直播列表页面 26-会议回放页面
    //  shareChannel);//分享渠道（1-QQ空间，2-QQ好友，3-新浪微博，4-微信好友，5-微信朋友圈 ，6短信
    defaultOptions = $.extend(defaultOptions, options);

    $.ajax({
        url: PC_CALL+"customer/share/createShareLog/",
        type: "POST",
        data: {
            paramJson: $.toJSON(defaultOptions)
        },
        success: function() {

        }
    });
}
/**
 *
 * @returns {{}}
 */
comm.getpara = function (symbol)//获取参数的函数
{
    var url=document.URL;
    var param={};
    var str,item;
    if(url.lastIndexOf(symbol?symbol:"?")>0)
    {
        str=url.substring(url.lastIndexOf(symbol?symbol:"?")+1,url.length);
        var arr=str.split("&");
        for(var i=0;i<arr.length;i++)
        {
            item =  arr[i].split("=");
            param[item[0]] = htmlToString(decodeURIComponent(item[1]));
        }
    }
    return param;
};

//判断空对象
comm.isEmptyObject = function(obj){
    for(var n in obj){return false}
    return true;
};

comm.forceHttp= function(){
	if(location.protocol === "https:")
		location.href= "http://"+location.hostname+location.pathname+location.search;
};
String.prototype.toInt = function () {
    return parseInt(this);
};
String.prototype.toK = function () {
    if (parseInt(this) > 999) {
        return Math.floor(parseInt(this) / 1000) + "千+";
    } else {
        return this;
    }
};
Number.prototype.toK = function () {
    if (parseInt(this) > 999) {
        return Math.floor(parseInt(this) / 1000) + "千+";
    } else {
        return this;
    }
};
String.prototype.toW = function () {
    if (parseInt(this) > 9999) {
        var num = parseInt(this) / 10000;
        return Math.round(num * 10) / 10 + "万+";
    } else {
        return this;
    }
};
Number.prototype.toW = function () {
    if (parseInt(this) > 9999) {
        var num = parseInt(this) / 10000;
        return Math.round(num * 10) / 10 + "万+";
    } else {
        return this;
    }
};
Number.prototype.toWan = function () {
    var _isThis = this;
    if (isNaN(parseInt(_isThis))) return 0;
    if (parseInt(_isThis, 10) > 9999) {
        var num = parseInt(this) / 10000;
        return Math.round(num * 10) / 10 + "万";
    } else {
        return _isThis
    }
};
String.prototype.toWK = function() {
    if (isNaN(parseInt(this))) return 0;
    if (parseInt(this) < 10000 && parseInt(this) > 999) {
        return Math.floor(parseInt(this) / 1000) + "千+";
    } else if (parseInt(this) > 9999) {
        var num = parseInt(this) / 10000;
        return Math.round(num * 10) / 10 + "万+";
    } else {
        return this;
    }
}
String.prototype.toWKH = function() {
    if (isNaN(parseInt(this))) return 0;
    if (parseInt(this) < 10000 && parseInt(this) > 999) {
        return Math.floor(parseInt(this) / 1000) + "千+";
    } else if (parseInt(this) > 9999) {
        var num = parseInt(this) / 10000;
        return Math.round(num * 10) / 10 + "万+";
    } else {
        return this;
    }
}
Number.prototype.toWK = function() {
    if (isNaN(parseInt(this))) return 0;

    if (parseInt(this) < 10000 && parseInt(this) > 999) {
        return Math.floor(parseInt(this) / 1000) + "千+";
    } else if (parseInt(this) > 9999) {
        var num = parseInt(this) / 10000;
        return Math.round(num * 10) / 10 + "万+";
    } else {
        return this;
    }
}
Number.prototype.toWKH = function() {
    if (isNaN(parseInt(this))) return 0;

    if (parseInt(this) < 10000 && parseInt(this) > 999) {
        return Math.floor(parseInt(this) / 1000) + "千+";
    } else if (parseInt(this) > 9999) {
        var num = parseInt(this) / 10000;
        return Math.round(num * 10) / 10 + "万+";
    } else {
        return this;
    }
}
if (!Array.prototype.indexOf){
    Array.prototype.indexOf = function(elt /*, from*/)
    {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++)
        {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}

/*
* 未认证用户显示邮箱或手机号码
* */
comm.getRegisterName=function(email,mobile){
    var count="";
    if(email){
        if(email.indexOf("@")<=1) {
            count=email.substr(0,1)+"****"+email.substring(email.lastIndexOf("@"));
        }else{
            count=email.substr(0,2)+"****"+email.substring(email.lastIndexOf("@"));
        }
    }else if(mobile){
        count=mobile.substr(0,3)+"****"+mobile.substring(mobile.length-4);
    }
    return count;
}

//设置页的成功弹层   现在您可以使用新密码登录唯医了
/*
* comm.showSuccessPop({
*   title:'',//标题
*   content:'',//内容
*   second:3,//时间
*   obj:$("")//存放dom的父元素
* })
* */
comm.showSuccessPop=function(options){
    var html='<figure class="al-promptContentPop al-resetPassword al-bindSuccess">'+
        '<div class="al-promptHead">'+
        '<b></b>'+options.title+
        '</div>'+
        '<div>'+options.content+'</div>'+
        '<span class="ev-successPopSec">'+options.second+'秒后消失</span>'+
        '</figure>';

    options.obj.append(html);
    if(options.second){
        var num=options.second;
        var timer=null;
        timer=setInterval(function(){
            num--;
            $(".ev-successPopSec").text(num+"秒后消失");
            if(num==0){
                clearInterval(timer);
                $(".al-bindSuccess").remove();
            }
        },1000);
    }

};
//兼容不支持localStorage的情况,如safari隐身模式/
function canSetLocalStorage(){
    try {
        localStorage.setItem('aa','bb')
        return localStorage.getItem('aa')!== null;
    } catch (e) {
        return false;
    }
}
var TempCache = {
    cache: function(value) {
        if(canSetLocalStorage()){
            localStorage.setItem("EasyWayTempCache", value);
        }else{
            $.cookie("EasyWayTempCache", value,{expires:3600*24*7});
        }

    },
    getCache: function() {
        if(canSetLocalStorage()){
            return localStorage.getItem("EasyWayTempCache");
        }else{
            return $.cookie("EasyWayTempCache");
        }
    },
    setItem: function(key, value) {
        if(canSetLocalStorage()){
            localStorage.setItem(key, value);
        }else{
            $.cookie(key, value,{expires:3600*24*7});
        }
    },
    getItem: function(key) {
        var item;
        if(canSetLocalStorage()){
            item = localStorage.getItem(key);
            if (key && key == "fromPage") // 来源页面只能获取一次
                localStorage.removeItem(key);
        }else{
            item = $.cookie(key);
            if(key&&key=="fromPage"){
                $.removeCookie(key);
            }
        }
        return item;
    },
    removeItem: function(key) {
        if(canSetLocalStorage()){
            return localStorage.removeItem(key);
        }else{
            return $.removeCookie(key);
        }

    },
    clear: function() {
        // 清除缓存
        /* storage = window.localStorage;
         while (storage.key(storage.length - 1).indexOf(keyword) === 0) {
         storage.removeItem(storage.key(storage.length - 1))
         }*/
        var wxBrowseAccessLockOn = localStorage.getItem("wxBrowseAccessLockOn");
        localStorage.clear();
        localStorage.setItem("wxBrowseAccessLockOn", wxBrowseAccessLockOn);
    }
};

//展示时把html标签转换成字符串显示
function htmlToString(str){
    var rstStr = (str+ '').replace(/[<>&]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;'}[c];});
    var tempArr = rstStr.split("\&lt\;\/a\&gt\;&lt\;a");

    if(tempArr.length>=2){
        rstStr = tempArr.map(function(d,index) {
            var s =  d.replace(/\&lt\;a[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)/gi,"<a href=\"$1\">$2");
            s =  s.replace(/[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)&lt\;\/a\&gt\;/gi,"<a href=\"$1\">$2</a>");
            s =  s.replace(/[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)/gi,"<a href=\"$1\">$2</a>");
            return s;
        }).join();
    }else{
        rstStr = (rstStr+'').replace(/\&lt\;a[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)\&lt\;\/a\&gt\;/gi,"<a href=\"$1\">$2</a>"); /* 恢复文本中的提醒谁看的A链接*/
    }
    rstStr = rstStr.replace(/@@/g,"@");
    return rstStr;
}
//防止xss攻击进行标签转换字符串显示
function symbolToString(str){
    if(!str){
        return '';
    }
    var rstStr = str.replace(/[<>]/g,function(c){return {'<':'&lt;','>':'&gt;'}[c];});
    var tempArr = rstStr.split("\&lt\;\/a\&gt\;&lt\;a");

    if(tempArr.length>=2){
        rstStr = tempArr.map(function(d,index) {
            var s =  d.replace(/\&lt\;a[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)/gi,"<a href=\"$1\">$2");
            s =  s.replace(/[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)&lt\;\/a\&gt\;/gi,"<a href=\"$1\">$2</a>");
            s =  s.replace(/[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)/gi,"<a href=\"$1\">$2</a>");
            return s;
        }).join();
    }else{
        rstStr = (rstStr+'').replace(/\&lt\;a[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)\&lt\;\/a\&gt\;/gi,"<a href=\"$1\">$2</a>"); /* 恢复文本中的提醒谁看的A链接*/
    }
    rstStr = rstStr.replace(/@@/g,"@");
    return rstStr;
}

//特殊字符转义
function escapeReplace(str){
    return str.replace(/[+/?#&=!%]/g,function(c){return {'+':'%2B','/':'%2F','?':'%3F','#':'%23','&':'%26','=':'%3D','!':'%21','%':'%25'}[c];});
}
//发布评论时拼接字符串
function escapeReplace1(str){
    return str.replace(/['\\/]/g,function(c){return {"'":'&apos;',"\\":"%5C",'/':'%2F'}[c];});
}

//获取后台信息去掉<a href="11111">@123</a>
function removeA(str){
    return str.replace(/<a.*?>.*?<\/\a>/g,'');
}

//创建class类
comm.numToChinese=function(name) {
    var _change = {
        ary0:["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"],
        ary1:["", "十", "百", "千"],
        ary2:["", "万", "亿", "兆"],
        strrev:function () {
            var ary = [];
            name = name.toString();
            for (var i =name.length; i >= 0; i--) {
                ary.push(name[i])
            }
            return ary.join("");
        }, //倒转字符串。
        init:function () {
            var $this = this;
            var ary = this.strrev();
            var zero = "";
            var newary = "";
            var i4 = -1;
            for (var i = 0; i < ary.length; i++) {
                if (i % 4 == 0) { //首先判断万级单位，每隔四个字符就让万级单位数组索引号递增
                    i4++;
                    newary = this.ary2[i4] + newary; //将万级单位存入该字符的读法中去，它肯定是放在当前字符读法的末尾，所以首先将它叠加入$r中，
                    zero = ""; //在万级单位位置的“0”肯定是不用的读的，所以设置零的读法为空

                }
                //关于0的处理与判断。
                if (ary[i] == '0') { //如果读出的字符是“0”，执行如下判断这个“0”是否读作“零”
                    switch (i % 4) {
                        case 0:
                            break;
                        //如果位置索引能被4整除，表示它所处位置是万级单位位置，这个位置的0的读法在前面就已经设置好了，所以这里直接跳过
                        case 1:
                        case 2:
                        case 3:
                            if (ary[i - 1] != '0') {
                                zero = "零"
                            }//如果不被4整除，那么都执行这段判断代码：如果它的下一位数字（针对当前字符串来说是上一个字符，因为之前执行了反转）也是0，那么跳过，否则读作“零”
                            break;
                    }
                    newary = zero + newary;
                    zero = '';
                }
                else { //如果不是“0”
                    newary = this.ary0[parseInt(ary[i])] + this.ary1[i % 4]+newary; //就将该当字符转换成数值型,并作为数组ary0的索引号,以得到与之对应的中文读法，其后再跟上它的的一级单位（空、十、百还是千）最后再加上前面已存入的读法内容。
                }

            }
            if (newary.indexOf("零") == 0) {
                newary = newary.substr(1)
            }//处理前面的0
            if(newary.charAt(0)=='一'&&name.length==2){
                newary = newary.substr(1);
            }
            return newary;
        }
    };

    if(typeof parseInt(name) =="number"){
        return _change.init();
    }
};
//秒数转换成时分秒格式00:03:03
comm.secToTime=function (s) {
    var t,hour,min,sec;
    if(s > -1){
        hour = Math.floor(s/3600);
        min = Math.floor(s/60) % 60;
        sec = s % 60;
        if(hour<10){
            t="0";
        }
        t+= hour + ":";
        if(min < 10){t += "0";}
        t += min + ":";
        if(sec < 10){t += "0";}
        t += sec;
    }
    return t;
};
//时间格式转换成秒数
comm.timeToSec=function (s) {
    var arr=s.split(':');
    return parseInt(arr[0]*3600)+parseInt(arr[1]*60)+parseInt(arr[2]);
};
/**
 * alert模态框弹层
 *      @param options {obj}
 *          - title 标题文本 {string}
 *          - ensure 确认按钮文本 {string}
 *          - ensureCallback 确认执行回调 {Function}
 *
 * @Author lichunhui
 */
comm.alertBox = function(options) {
    if ($('.ev-alPopupClass').length === 0) {
        comm.LightBox.show(60,"#000");
        comm.LightBox.setZIndex(8);
        var template = '<section class="alPopupMain ev-alPopupClass">'+
            '<figure class="close ev_sureClose"><i></i></figure>'+
            (options.title?'<article class="passSuccess"><i></i>'+options.title+'</article>':'')+
            '<article class="passSuccessText">'+options.content+'</article>'+
            (options.ensure?'<button class="know ev_sureClose">'+options.ensure+'</button>':'')+
            '</section>';
        $("body").append(template);
        comm.setCenter($(".ev-alPopupClass"));

        $("body").on("click", ".ev_sureClose", function() {
            options.ensureCallback && options.ensureCallback();
            $(".ev-alPopupClass").hide();
            comm.LightBox.hide();
            if($(this).hasClass("close")){
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"弹层关闭",
                    actionId:43
                });
            }
            return false;
        });
    } else {
        comm.LightBox.show(60,"#000");
        comm.LightBox.setZIndex(8);
        $(".ev-alPopupClass").show();
        comm.setCenter($(".ev-alPopupClass"));
    }
};
comm.checkInvalid = function(val){//检查一个字符串是否有效
    if(((typeof val =='string')&&(val.length==0))||(val==undefined)||(val=='undefined')||(val=='null')||(typeof val=='undefined')||(typeof val=='null')||(val==null)){
        return true;
    }else{
        return false;
    }
};

comm.checkUrl = function(type,pra){
    var urlInfoContainer = [
        {"regx":/html\/video\//g,"type":"4","name":"视频内容页","urlLink":"https://www.allinmd.cn/html/video/"},
        {"regx":/html\/doc\//g,"type":"5","name":"视频内容页","urlLink":"https://www.allinmd.cn/html/doc/"},
        {"regx":/personal_index/g,"type":"6","name":"个人主页","urlLink":"https://www.allinmd.cn/pages/personal/personal_index.html"},
        {"regx":/customerInfo/g,"type":"8","name":"个人资料页","urlLink":"https://www.allinmd.cn/pages/personal/personal_customerInfo.html"},
        {"regx":/html\/topic\//g,"type":"9","name":"话题内容页","urlLink":"https://www.allinmd.cn/html/topic/"},
        {"regx":/html\/case\//g,"type":"10","name":"病例内容页","urlLink":"https://www.allinmd.cn/html/case/"},
        {"regx":/fellowship_home/g,"type":"15","name":"fellowship应用页","urlLink":"https://www.allinmd.cn/html/index/fellowship/fellowship_home.html"},
        {"regx":/dingkao/g,"type":"16","name":"医师定考应用页","urlLink":"https://www.allinmd.cn/pages/channel/dingkao.html"},
        {"regx":/video_index/g,"type":"17","name":"视频列表页面","urlLink":"https://www.allinmd.cn/pages/channel/video/video_index.html"},
        {"regx":/doc_index/g,"type":"18","name":"文库列表页面","urlLink":"https://www.allinmd.cn/pages/channel/doc/doc_index.html"},
        {"regx":/topic_index/g,"type":"19","name":"话题列表页","urlLink":"https://www.allinmd.cn/pages/channel/topic/topic_index.html"},
        {"regx":/case_index/g,"type":"20","name":"病例列表页面","urlLink":"https://www.allinmd.cn/pages/channel/case/case_index.html"},
        {"regx":/meeting_agenda/g,"type":"94","name":"年会日程页面","urlLink":"https://www.allinmd.cn/html/conference/"},
        {"regx":/html\/conference\//g,"type":"21","name":"年会内容页面","urlLink":"https://www.allinmd.cn/html/conference/"},
        {"regx":/channel\/organization\//g,"type":"22","name":"组织应用页面","urlLink":"https://www.allinmd.cn/pages/channel/organization.html"},
        {"regx":/channel\/product\//g,"type":"23","name":"厂商应用页面","urlLink":"https://www.allinmd.cn/pages/channel/product.html"},
        {"regx":/multi-conference\/live\//g,"type":"24","name":"会议直播页面-多会场","urlLink":"https://www.allinmd.cn/pages/channel/conference/multi-conference/live.html"},
        {"regx":/channel\/live_list\//g,"type":"25","name":"直播列表页面","urlLink":"https://www.allinmd.cn/pages/channel/live_list.html"},
        {"regx":/multi-conference\/playback\//g,"type":"26","name":"会议回放页面","urlLink":"https://www.allinmd.cn/pages/channel/conference/multi-conference/playback.html"},
        {"regx":/reset_password_account/g,"type":"29","name":"找回密码页面","urlLink":"https://www.allinmd.cn/pages/singlePage/user/passport/reset_password_account.html"},
        {"regx":/html\/theme/g,"type":"79","name":"专题页面","urlLink":"https://www.allinmd.cn/html/theme/"},
        {"regx":/friends_circle/g,"type":"36","name":"朋友圈","urlLink":"https://www.allinmd.cn/pages/personal/friends_circle.html"},
        {"regx":/discover_tagSubject/g,"type":"37","name":"标签专题","urlLink":"https://www.allinmd.cn/pages/discover/discover_tagSubject.html"},
        {"regx":/newList.html?dateType=1/g,"type":"38","name":"每日最新","urlLink":"https://www.allinmd.cn/pages/list/newList.html?dateType=1"},
        {"regx":/newList.html?dateType=2/g,"type":"39","name":"每周最新","urlLink":"https://www.allinmd.cn/pages/list/newList.html?dateType=2"},
        {"regx":/hotList.html?groupByFlag=1/g,"type":"40","name":"每日最热","urlLink":"https://www.allinmd.cn/pages/list/hotList.html?groupByFlag=1"},
        {"regx":/hotList.html?groupByFlag=5/g,"type":"41","name":"每周最热","urlLink":"https://www.allinmd.cn/pages/list/hotList.html?groupByFlag=5"},
        {"regx":/meeting_index/g,"type":"42","name":"会议列表页","urlLink":"https://www.allinmd.cn/pages/channel/conference/meeting_index.html"},
        {"regx":/meeting_follow/g,"type":"211","name":"我关注的会议","urlLink":"https://www.allinmd.cn/pages/channel/conference/meeting_follow.html"},
        {"regx":/meeting_trailer/g,"type":"212","name":"会议预告页","urlLink":"https://www.allinmd.cn/pages/channel/conference/meeting_trailer.html"},
        {"regx":/discover_index/g,"type":"43","name":"发现首页","urlLink":"https://www.allinmd.cn/pages/discover/discover_index.html"},
        {"regx":/discover_major.html#type=major/g,"type":"44","name":"按专业","urlLink":"https://www.allinmd.cn/pages/discover/discover_major.html#type=major"},
        {"regx":/discover_major.html#type=disease/g,"type":"45","name":"按疾病","urlLink":"https://www.allinmd.cn/pages/discover/discover_major.html#type=disease"},
        {"regx":/discover_major.html#type=operation/g,"type":"46","name":"按术士","urlLink":"https://www.allinmd.cn/pages/discover/discover_major.html#type=operation"},
        {"regx":/discover_tag/g,"type":"47","name":"按标签","urlLink":"https://www.allinmd.cn/pages/discover/discover_tag.html"},
        {"regx":/discover_major.html#type=resource/g,"type":"48","name":"按类型","urlLink":"https://www.allinmd.cn/pages/discover/discover_major.html#type=resource"},
        {"regx":/discover_subject/g,"type":"49","name":"按专题","urlLink":"https://www.allinmd.cn/pages/discover/discover_subject.html"},
        {"regx":/discover_expert/g,"type":"50","name":"权威专家","urlLink":"https://www.allinmd.cn/pages/discover/discover_expert.html"},
        {"regx":/discover_hotActivity/g,"type":"51","name":"热门活动","urlLink":"https://www.allinmd.cn/pages/discover/discover_hotActivity.html"},
        {"regx":/user\/auth.html/g,"type":"10001","name":"认证","urlLink":"https://www.allinmd.cn/pages/singlePage/user/auth.html"},
        {"regx":/activity_details/g,"type":"80","name":"活动介绍","urlLink":"https://www.allinmd.cn/html/activity/"},
        {"regx":/personal_works/g,"type":"81","name":"活动资源列表","urlLink":"https://www.allinmd.cn/html/activity/"},
        {"regx":/personal_center/g,"type":"82","name":"活动-我的作品","urlLink":"https://www.allinmd.cn/html/activity/"},
        {"regx":/html\/activity/g,"type":"52","name":"活动内容","urlLink":"https://www.allinmd.cn/html/activity/"},
        {"regx":/message_main/g,"type":"54","name":"关注提醒","urlLink":"https://www.allinmd.cn/pages/message/message_main.html"},
        {"regx":/message_main.html#&tab=review/g,"type":"55","name":"评论我的","urlLink":"https://www.allinmd.cn/pages/message/message_main.html#&tab=review"},
        {"regx":/message_main.html#&tab=remind/g,"type":"56","name":"提醒我看","urlLink":"https://www.allinmd.cn/pages/message/message_main.html#&tab=remind"},
        {"regx":/message_main.html#&tab=praise/g,"type":"57","name":"赞了我的","urlLink":"https://www.allinmd.cn/pages/message/message_main.html#&tab=praise"},
        {"regx":/personal_contribution/g,"type":"64","name":"我的贡献","urlLink":"https://www.allinmd.cn/pages/personal/personal_contribution.html"},
        {"regx":/personal_active/g,"type":"65","name":"我的动态","urlLink":"https://www.allinmd.cn/pages/personal/personal_active.html"},
        {"regx":/others_index/g,"type":"66","name":"他的动态","urlLink":"https://www.allinmd.cn/pages/personal/others_index.html"},
        {"regx":/others_contribution/g,"type":"67","name":"他的贡献","urlLink":"https://www.allinmd.cn/pages/personal/others_contribution.html"},
        {"regx":/others_baseInfo/g,"type":"68","name":"他的简介","urlLink":"https://www.allinmd.cn/pages/personal/others_baseInfo.html"},
        {"regx":/search_result/g,"type":"32","name":"搜索页","urlLink":"https://www.allinmd.cn/pages/search/search.html"},
        {"regx":/upload-case/g,"type":"83","name":"病例编辑页","urlLink":"https://www.allinmd.cn/pages/singlePage/upload-case.html"},
        {"regx":/others_sns.html?action=collect/g,"type":"96","name":"TA的收藏","urlLink":"https://www.allinmd.cn/pages/personal/others_sns.html?action=collect"},
        {"regx":/setting/g,"type":"104","name":"设置页","urlLink":"https://www.allinmd.cn/pages/personal/setting.html"},
        {"regx":/organization-home/g,"type":"115","name":"组织介绍页","urlLink":"https://www.allinmd.cn/pages/channel/organization-home.html"},
        {"regx":/intro_index/g,"type":"119","name":"进修项目页-项目介绍","urlLink":"https://www.allinmd.cn/html/fellowship/"},
        {"regx":/project_index/g,"type":"120","name":"进修项目页-进修中心","urlLink":"https://www.allinmd.cn/html/fellowship/"},
        {"regx":/fellowship_registration/g,"type":"121","name":"进修报名页","urlLink":"https://www.allinmd.cn/pages/column/fellowship/fellowship_registration.html"},
        {"regx":/column\/product/g,"type":"122","name":"产品详情页","urlLink":"https://www.allinmd.cn/pages/column/product"},
        {"regx":/friends_recommend/g,"type":"123","name":"推荐医师","urlLink":"https://www.allinmd.cn/pages/personal/friends_recommend.html"},
        {"regx":/sns.html?action=fans/g,"type":"124","name":"我的-粉丝列表","urlLink":"https://www.allinmd.cn/pages/personal/sns.html?action=fans"},
        {"regx":/others_sns.html?action=fans/g,"type":"125","name":"TA的粉丝列表","urlLink":"https://www.allinmd.cn/pages/personal/others_sns.html?action=fans"},
        {"regx":/sns.html?action=follow/g,"type":"126","name":"关注医师列表","urlLink":"https://www.allinmd.cn/pages/personal/sns.html?action=follow"},
        {"regx":/sns.html?action=praise/g,"type":"127","name":"点赞列表","urlLink":"https://www.allinmd.cn/pages/personal/sns.html?action=praise"},
        {"regx":/followList/g,"type":"129","name":"关注病例用户列表","urlLink":"https://www.allinmd.cn/template/terminal/followList.html"},
        {"regx":/discover_tagFollowers/g,"type":"130","name":"关注此标签的人","urlLink":"https://www.allinmd.cn/pages/discover/discover_tagFollowers.html"},
        {"regx":/statement/g,"type":"145","name":"隐私声明","urlLink":"https://www.allinmd.cn/pages/help/statement.html"},
        {"regx":/service/g,"type":"146","name":"服务条款","urlLink":"https://www.allinmd.cn/pages/help/service.html"},
        {"regx":/about_us/g,"type":"147","name":"关于我们","urlLink":"https://www.allinmd.cn/pages/help/about_us.html"},
        {"regx":/live_create/g,"type":"150","name":"UGC开直播-基本信息","urlLink":"https://www.allinmd.cn/pages/live/live_create.html"},
        {"regx":/live_watch/g,"type":"151","name":"UGC直播终端-直播中","urlLink":"https://www.allinmd.cn/pages/live/living_watch.html"},
        {"regx":/live_list/g,"type":"156","name":"UGC直播-直播列表","urlLink":"https://www.allinmd.cn/pages/live/livingList.html"},
        {"regx":/live_myOrderList/g,"type":"157","name":"UGC直播-我的预约","urlLink":"https://www.allinmd.cn/pages/live/livingOrder.html"},
        {"regx":/eBook_details/g,"type":"159","name":"书籍主页","urlLink":"https://www.allinmd.cn/pages/eBook/eBook_details.html"},
        {"regx":/eBook_chapter/g,"type":"164","name":"章节列表页","urlLink":"https://www.allinmd.cn/pages/eBook/eBook_chapter.html"},
        {"regx":/eBookReading/g,"type":"166","name":"全书阅读页","urlLink":"https://www.allinmd.cn/pages/eBook/eBookReading.html"},
        {"regx":/productListPage/g,"type":"174","name":"相关产品","urlLink":"https://www.allinmd.cn/pages/scoringSystem/productListPage.html"},
        {"regx":/discover_billboard_contribution/g,"type":"176","name":"贡献榜","urlLink":"https://www.allinmd.cn/pages/discover/billboard/discover_billboard_contribution.html?listType=0"},
        {"regx":/discover_billboard_activity/g,"type":"177","name":"活跃榜","urlLink":"https:://www.allinmd.cn/pages/discover/billboard/discover_billboard_activity.html?listType=1"},
        {"regx":/discover_billboard_recommend/g,"type":"178","name":"推荐榜","urlLink":"https:://www.allinmd.cn/pages/discover/billboard/discover_billboard_recommend.html?listType=2"},
        {"regx":/discover_series_course/g,"type":"202","name":"系列课-推荐、创伤、脊柱、关节","urlLink":"http://www.allinmd.cn/pages/discover/series/discover_series_course.html"},
        {"regx":/discover_series_details/g,"type":"206","name":"课程详情页","urlLink":"http://www.allinmd.cn/pages/discover/series/discover_series_details.html"},
        {"regx":/discover_billboard_recommend/g,"type":"210","name":"受欢迎讲师","urlLink":"http://www.allinmd.cn/pages/discover/series/discover_series_teacher.html"},
        {"regx":/iphone-app-download/g,"type":"215","name":"手机端页","urlLink":"http://www.allinmd.cn/pages/singlePage/iphone-app-download.html"},
        {"regx":/nationalDayActivity/g,"type":"216","name":"2017十一国庆活动页","urlLink":"http://www.allinmd.cn/pages/column/nationalDayActivity.html"},
        {"regx":/discover_feature_column/g,"type":"217","name":"特色栏目列表页","urlLink":"http://www.allinmd.cn/pages/discover/discover_feature_column.html"},
        {"regx":/discover_feature_detail/g,"type":"218","name":"特色栏目详情页","urlLink":"http://www.allinmd.cn/pages/discover/discover_feature_detail.html"},
        {"regx":/eBook_list/g,"type":"220","name":"电子书列表页","urlLink":"http://www.allinmd.cn/pages/eBook/eBook_list.html"}
    ];
    var urlOnOff = true;
    var regx = /^(https|http):\/\/www.allinmd.cn\/$/;
    if (type == "type") {
        for (var uNum = 0; uNum < urlInfoContainer.length; uNum++) {
            if (urlInfoContainer[uNum].regx.test(pra)) {
                urlOnOff = false;
                return urlInfoContainer[uNum].type;
            }
        }
        if (urlOnOff) {
            if (location.pathname=="/") {

                return "35";
            }
        }
    } else {
        for (var uNumT = 0; uNumT < urlInfoContainer.length; uNumT++) {
            if (urlInfoContainer[uNumT].type == pra) {
                return urlInfoContainer[uNumT].urlLink;
            }
        }
        if (pra == "35") {
            if (regx.test(pra)) {
                return "https://www.allinmd.cn";
            }
        }
    }
};
//创建事件埋点
comm.creatEvent = function(opt){
    var browTypeUrl;
    if (opt.browTypeUrl) {
        browTypeUrl = opt.browTypeUrl;
    } else {
        browTypeUrl = window.location.href.substr(0, 250);
    }
    var opDescs = [
        "消息推送的点击","相关产品","骨科&手外科切换(切换按钮点击)","骨科&手外科切换(骨科按钮点击)","关注--医生",
        "关注--话题","关注--病例","关注--标签","搜索-首页","搜索-发现",
        "专页搜索","搜索-局部(PC)","下载按钮","下载功能按钮","广告位-轮播图",
        "广告位-启动页","登录按钮","去登录按钮(个人中心)","视频弹出去登录按钮","微信登录",
        "CAOS登录","CAOS授权登录(立即登录)","注册-创建帐号","去认证","认证-视频弹窗确定",
        "现在认证","暂不认证","认证-骨科","认证-手外","认证-下一步",
        "认证-提交","评分功能","发布","发布-病例","补充病例",
        "发布-话题","发布-直播","发布-草稿", "发布-视频(PC)","浏览记录",
        "分享","返回","跳过","关闭","下一步","取消",
        "智能排序","最新发布","最多浏览","最多评论","按专业-筛选",
        "全部类型 -全部","全部类型 - 病例","全部类型 - 视频","全部类型 - 文库","全部类型 - 话题",
        "相关性","最新","最热","发布文库","热门搜索","历史搜索","运营手动插入广告位","动态入口","搜索结果页-翻页导航-首页(PC)",
        "搜索结果页-翻页导航-下一页(PC)","搜索结果页-翻页导航-上一页(PC)","搜索结果页-翻页导航-末页(PC)","搜索结果页-翻页导航-点击数字(PC)",
        "取消关注","分享渠道","数据译者筛选-全部","加入讨论","跳到评论","评论区排序","评论区点赞","评论区转发","展开","收起","标签","我要吐槽"
    ];
    var latitude="";//经度
    var longitude="";//维度
    function locationError(error) {
        latitude = "";
        longitude = "";
    }

    function locationSuccess(position) {
        var coords = position.coords;
        latitude = coords.latitude;
        longitude = coords.longitude;
        localStorage.setItem("latitude", coords.latitude);
        localStorage.setItem("longitude", coords.longitude);
    }

    if (navigator.geolocation) {
        if (window.localStorage && !window.localStorage.getItem("latitude")) {
            /*navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {
                // 指示浏览器获取高精度的位置，默认为false
                enableHighAccuracy: true,
                // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
                timeout: 5000,
                // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
                maximumAge: 3000
            });*/
        } else {
            latitude = localStorage.getItem("latitude");
            longitude = localStorage.getItem("longitude");
        }
    } else {
        //alert("Your browser does not support Geolocation!");
    }


    function getOS() {
        //获取用户代理
        var ua = navigator.userAgent;
        if (ua.indexOf("Windows NT 5.1") != -1) return "Windows XP";
        if (ua.indexOf("Windows NT 6.0") != -1) return "Windows Vista";
        if (ua.indexOf("Windows NT 6.1") != -1) return "Windows 7";
        if (ua.indexOf("Windows NT 6.3") != -1) return "Windows 8";
        if (ua.indexOf("Windows NT 6.4") != -1) return "Windows 10";
        if (ua.indexOf("Windows NT 10.0") != -1) return "Windows 10";
        if (ua.indexOf("(Macintosh;") != -1) return "Macbook";
        if (ua.indexOf("iPhone") != -1) return "iPhone";
        if (ua.indexOf("iPad") != -1) return "iPad";
        if (ua.indexOf("Linux") != -1) {
            var index = ua.indexOf("Android");
            if (index != -1) {
                //os以及版本
                var os = ua.slice(index, index + 13);
                //手机型号
                var index2 = ua.indexOf("Build");
                var type = ua.slice(index + 1, index2);
                return type + os;
            } else {
                return "Linux";
            }
        }
        return "未知操作系统";
    }

    function getTimeZone() {
        var d = new Date();
        return d.getTimezoneOffset() / 60
    }

    var browType=opt.browType?opt.browType:comm.checkUrl("type",window.location.href);//当前页类型
    var browTypeSource=opt.browTypeSource?opt.browTypeSource:comm.checkUrl("type",document.referrer);//来源页类型
    var browTypeSourceUrl=opt.browTypeSourceUrl?opt.browTypeSourceUrl:document.referrer;//来源页url
    if(!comm.date){
        comm.date={};
        comm.date.local_time = function(){
            var local = new Date();
            var year = local.getFullYear();
            var month = local.getMonth()+1;
            if(month<10){
                month = "0"+month;
            }
            var day = local.getDate();
            if(day<10){
                day = "0"+day;
            }
            var time = local.toTimeString().substr(0,8);
            var local_time = year+"-"+month+"-"+day+" "+time;
            return local_time;
        }
    }
    var param = {
        siteId:1,//站点Id
        opSource:"web",//站点 端口
        createTime:comm.date.local_time(),
        appVersion:window.version,
        osVersion:getOS(),// 系统型号
        tVersion:navigator.appCodeName + " " + navigator.appVersion,   // 浏览器版本
        latitude:latitude,//经度
        longitude:longitude,//维度
        timeZone:"GMT " + getTimeZone(),//时区

        customerId:$("#sesCustomerId").val(),//会员Id
        opUsr:$("#sesCustomerId").val(),//会员Id
        locationId:(opt.locationId&&opt.locationId!=null&&opt.locationId!='null')?opt.locationId:0,//区块Id
        pushMessageId:(opt.pushMessageId&&opt.pushMessageId!=null&&opt.pushMessageId!='null')?opt.pushMessageId:0,//事件对于对象的ID 如：关注人时记录被关注人ID
        param:opt.param,//banner的链接
        userRoleType:opt.userRoleType?opt.userRoleType:'',//判断有无角色选择（认证步骤）
        //adId:opt.adId,//广告位Id,
        //adPosition:opt.adPosition,//广告图片位置
        triggerType:opt.triggerType,//事件类型
        triggerName:opt.triggerName?opt.triggerName:opDescs[opt.actionId],//事件名称
        keyword:opt.keyword,//关键词
        actionId:opt.actionId,//事件Id
        browseType:$("#browseType").val()?$("#browseType").val():browType,//当前页面类型
        browseTypeUrl:browTypeUrl,//当前页面url
        browseTypeSource:browTypeSource,//来源页面类型
        browseTypeSourceUrl:browTypeSourceUrl,//来源页面URL
        refId:opt.refId,//资源ID
        refType:opt.refType//资源Type

    };
    opt.userRoleType? param.param={"userRoleType":opt.userRoleType}:"";//认证区分角色
    opt.param? param.param={"bannerUrl":opt.param}:"";//banner的链接

    if(typeof g_sps!="undefined"){
        setTimeout(function () {
            param = $.extend(param,{
                sessionId:g_sps._$.sessionId + "_" + g_sps._$.sessionIndex,
                openedCount: g_sps._$.openedCount
            })
        },1000)
    }
    $.ajax({
        type: 'POST',
        url: PC_CALL + "log/track/batchCreate/",
        data: {paramJson:$.toJSON(param)},
        async:opt.async!=undefined?opt.async:true,
        dataType: "json",
        success: function (rep) {
        },
        error: function () {
        }
    });
};
//确认弹窗
/*
* {
*icon:0或1, //需要图标吗 默认有
*title:'标题',
*content:'内容',
*success:function(){
*   点击知道了回调函数
* }
* }
* */
comm.surePop=function(obj){
    comm.LightBox.show(60,"rgba(10, 30, 43,.6)");
    comm.LightBox.setZIndex(8);
    $("body").append('<section class="alPopupMain ev_surePop">'+
    '<figure class="close"><i></i></figure>'+
    '<article class="passSuccess" style="'+obj.passCss+'">'+(obj.icon!=0?'<i></i>':'')+obj.title+'</article>'+
    (obj.content?'<article class="authSuccessText" style="'+obj.contentCss+'">'+obj.content+'</article>':'')+
    '<button class="know '+(obj.sureClass?obj.sureClass:'')+'">'+(obj.btnText?obj.btnText:'知道了')+'</button>'+
    '</section>');
    comm.setCenter($(".ev_surePop"));
    $(".close").on('click',function(){
        comm.LightBox.hide();
        $(".ev_surePop").remove();
        //事件埋点
        comm.creatEvent({
            triggerType:"全站功能按钮点击",
            keyword:"弹层关闭",
            actionId:43,
            async:false
        });
        obj.close&&obj.close();
    });
    $(".know").on("click",function(){
        comm.LightBox.hide();
        $(".ev_surePop").remove();
        obj.success&&obj.success();
    });
};
comm.hasResponseData = function(r){
    if(r&&r.responseObject&&r.responseObject.responseData&&!$.isEmptyObject(r.responseObject.responseData)){
        return true;
    }
    return false;
};

comm.hasResponseMessage = function(r){
    if(r&&r.responseObject&&r.responseObject.responseMessage&&!$.isEmptyObject(r.responseObject.responseMessage)){
        return true;
    }
    return false;
};
//到病历夹ie8以下弹出提示
comm.emrIEAlert = function(url){
    var ieAlert='<section class="browserUpgrade ev-browserUpgrade">'+
        '<aside class="content">'+
        '<p class="close"><span></span></p>'+
        '<figure class="upgradeTip"><img src="//img10.allinmd.cn/v3/upload_case/unhappy.png"> </figure>'+
        '<p class="upgradeText">您当前的浏览器版本过低，可升级最新版本或下载推荐浏览器再使用</p>'+
        '<ul class="upgradeCont" style="width:456px;margin:0 auto">'+
        '<li><a href="http://www.microsoft.com/zh-cn/download/Internet-Explorer-11-for-Windows-7-details.aspx" target="_blank">'+
        '<img src="//img10.allinmd.cn/v3/upload_case/ie.png">'+
        '<p>升级至新版本 IE 浏览器</p>'+
        '</a></li>'+
        '<li><a href="https://www.baidu.com/link?url=wkitDqmRRoU8ivb_fGcGfwSYMVqSY3bAP0T7Q8VvuuSHq1hG5gCBLm_BvvA15MdfLWIVxifS0ahk7xNueXChfa&wd=&eqid=e69ae8450002f802000000035b4f1fd5" target="_blank">'+
        '<img src="//img10.allinmd.cn/v3/upload_case/Google.png">'+
        '<p>使用Google Chrome 浏览器</p>'+
        '</a></li>'+
        '</ul>'+
        '</aside>'+
        '</section>';
    if($(".ev-browserUpgrade").length>0){
        $(".ev-browserUpgrade").show();
    }else{
        $("body").append(ieAlert);
    }
    comm.LightBox.show(70,"#0A1E2B");
    comm.LightBox.setZIndex(4);
    var obj=$(".ev-browserUpgrade .content");
    var positionFromTop = ($(window).height()-obj.height())/2;
    var positionFromLeft = ($(window).width()-obj.width())/2;
    obj.css({
        top: positionFromTop + 'px',
        left: positionFromLeft + 'px'
    });
    $(".browserUpgrade .close").on('click',function(){
        $(".ev-browserUpgrade").remove();
        comm.LightBox.hide();
    });
};
//发布病例时ie8,9上传插件不兼容的提示
comm.ieAlert = function(url,text,callback,isReload){
    //ie8,9发布报错
    var ieAlert='<section class="browserUpgrade ev-browserUpgrade">'+
        '<aside class="content">'+
        '<p class="close"><span></span></p>'+
        '<figure class="upgradeTip"><img src="//img10.allinmd.cn/v3/upload_case/unhappy.png"> </figure>'+
        '<p class="upgradeText">您的浏览器版本过低，将无法上传图片或视频，可下载推荐浏览器后再发布</p>'+
        '<ul class="upgradeCont">'+
        '<li><a href="http://www.microsoft.com/zh-cn/download/Internet-Explorer-11-for-Windows-7-details.aspx" target="_blank">'+
        '<img src="//img10.allinmd.cn/v3/upload_case/ie.png">'+
        '<p>升级至新版本 IE 浏览器</p>'+
        '</a></li>'+
        '<li><a href="https://www.baidu.com/link?url=wkitDqmRRoU8ivb_fGcGfwSYMVqSY3bAP0T7Q8VvuuSHq1hG5gCBLm_BvvA15MdfLWIVxifS0ahk7xNueXChfa&wd=&eqid=e69ae8450002f802000000035b4f1fd5" target="_blank">'+
        '<img src="//img10.allinmd.cn/v3/upload_case/Google.png">'+
        '<p>使用Google Chrome 浏览器</p>'+
        '</a></li>'+
        '<li><a href="'+(url?url:'javascript:;')+'" class="ev-nopicture">'+
        '<img src="//img10.allinmd.cn/v3/upload_case/nopicture.png">'+
        '<p>'+(text?text:'继续发布无图病例')+'</p>'+
        '</a></li>'+
        '</ul>'+
        '</aside>'+
        '</section>';
    if(comm.browser.isIe8()||comm.browser.isIe9()){
        if($(".ev-browserUpgrade").length>0){
            $(".ev-browserUpgrade").show();
        }else{
            $("body").append(ieAlert);
        }
        comm.LightBox.show(70,"#0A1E2B");
        comm.LightBox.setZIndex(4);
        // comm.setCenter($(".ev-browserUpgrade .content"));
        var obj=$(".ev-browserUpgrade .content");
        var positionFromTop = ($(window).height()-obj.height())/2;
        var positionFromLeft = ($(window).width()-obj.width())/2;
        obj.css({
            top: positionFromTop + 'px',
            left: positionFromLeft + 'px'
        });
        $(".browserUpgrade .close").on('click',function(){
            $(".ev-browserUpgrade").remove();
            comm.LightBox.hide();
        });
        if(text){
            $('.ev-nopicture').on('click',function(){
                $(".ev-browserUpgrade").remove();
                comm.LightBox.hide();
                if(isReload){
                    callback&&callback();
                }else{
                    location.reload();
                }

            })
        }

    }else{
       //window.location.href=url;
        if(url){
            g_sps.jump(null,url);
        }else{
            callback&&callback();
        }

    }

};
/*
* comm.layerBottomFixed({"layerDom":$(".mask-content")//蒙层内的弹框，closeBtn:"关闭弹窗的按钮元素"})
* author:sunhaibin
* date:2017/12/22
* */
comm.layerBottomFixed = function(obj){
    var scrollTop = $(window).scrollTop();
    if(obj.layerDom.is(':visible')){
        $('html').attr('sT',scrollTop);//.css('marginTop',-scrollTop);
        $('body').css({'height':$(window).height()+scrollTop,overflow:'hidden'});
    }
    obj.closeBtn.click(function(){
        if(obj.isclose){
            obj.layerDom.remove();
        }
        $('html').css('marginTop','');
        $('body').css({'height':"",overflow:''});
        $(window).scrollTop($('html').attr('sT'));
        $('html').removeAttr('sT');
    });
};
//MD5加密token  手机验证码请求
comm.allinaccesstoken = function(timestamp,mobile){
    var key = "dynamic.allinmd.cn";
    return $.md5(key+"/"+timestamp+"/"+mobile);
};
//设置cookie
comm.cookie = {
    set:function(key,val,time){//设置cookie方法
        var date=new Date(); //获取当前时间
        var expiresDays=time;  //将date设置为n天以后的时间
        date.setTime(date.getTime()+expiresDays*24*3600*1000); //格式化为cookie识别的时间
        document.cookie=key + "=" + val +";expires="+date+";path=/;domain=.allinmd.cn";  //设置cookie
    },
    get:function(key){//获取cookie方法
        /*获取cookie参数*/
        var getCookie = document.cookie.replace(/[ ]/g,"");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
        var arrCookie = getCookie.split(";");  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
        var tips;  //声明变量tips
        for(var i=0;i<arrCookie.length;i++) {   //使用for循环查找cookie中的tips变量
            var arr = arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
            if (key == arr[0]) {  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
                tips = arr[1];   //将cookie的值赋给变量tips
                break;   //终止for循环遍历
            }
        }
        return tips;
    },
    deleteFn:function(key) { //删除cookie方法
        if(this.get(key)){
        // document.cookie = key + "=; expires =-1;domain=.allinmd.cn;";//设置cookie
            this.set(key,'',-1)
        }

    }
};

