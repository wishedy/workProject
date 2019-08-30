//loading的显示与隐藏
comm.loading = {
    show: function () {
        if ($(".ev-loading").length == 0) {
            $("body").append('<section class="al-middleTipsBox"><section class="al-middleTipsModal ev-loading"><figure class="al-middleTipsModalText al-loading"><img src="//img50.allinmd.cn/pages/default/loading.png" alt=""></figure></section></section>');
        } else {
            $(".ev-loading").show();
        }
    },
    hide: function () {
        $(".ev-loading").hide();
    }
};
comm.mountSps = function(){
    if(!(typeof g_sps == "undefined")) {
        var commonFuncs = {
            //获取地址栏的键值对name的对应value值
            getQueryString: function (url, name) {
                var reg = new RegExp("(^|\\?|&)" + name + "=([^&|^#]*)(\\s|[^&]|[^#]|$)", "i");
                if (!url) url = window.location.href;
                if (reg.test(url)) return decodeURIComponent(RegExp.$2.replace(/\+/g, " "));
                return null;
            },
            //在URL中添加推广渠道参数，键值对为 config.channelParam=data
            addChanelParam: function (currentUrl, _channelParam) {
                var params = "_amChannel" + "=" + _channelParam;
                var hrefObj = commonFuncs.parseHref(currentUrl);
                var newHref = hrefObj.main;
                if (hrefObj.search) {
                    newHref += "?" + hrefObj.search + "&" + params;
                } else {
                    newHref = newHref + "?" + params;
                }
                if (hrefObj.hash) {
                    newHref += "#" + hrefObj.hash;
                }
                return newHref;
            },
            /**
             * 解析链接对象
             * */
            parseHref: function (href) {
                var hashIndex, hash = "", search = "", result, searchIndex;

                hashIndex = href.indexOf("#");
                if (hashIndex > -1) {
                    hash = href.slice(hashIndex + 1);
                    href = href.slice(0, hashIndex);
                }
                searchIndex = href.indexOf("?");
                if (searchIndex > -1) {
                    search = href.slice(searchIndex + 1);
                    href = href.slice(0, searchIndex);
                }

                result = {
                    hash: hash,
                    search: search,
                    main: href.replace(/^\s+|\s+$/gm, '')
                };

                return result;
            },
        };

        window.g_sps = {
            //链接跳转方法，
            // el，触发跳转的元素对象，如果没有，则需要传入null，
            // openNewWindow，是否打开新窗口，可选
            jump: function (el, url, openNewWindow) {

                if (!url) {	// 无链接，不处理。
                    return false;
                }

                if (url.indexOf("_amChannel") > -1) {
                    //表示目标地址已存在对应的渠道，则不继续添加
                } else {
                    _channelParam = commonFuncs.getQueryString(null, "_amChannel");
                    if (_channelParam) {
                        url = commonFuncs.addChanelParam(url, _channelParam);
                    }
                }

                //是否需要打开新标签
                if (openNewWindow) {
                    window.open(url);
                } else {
                    window.location.href = url;
                }
            }
        };
    }else{
        //如果有sps相当于什么也不执行
    }
};
comm.mountSps();
comm.redirect = function (href, paramTime, isLoading, loadingTxt) {
    //是否显示loading，默认显示
    var isL = true;
    if (isLoading == false) {
        isL = isLoading;
    }
    if (isL) {
        /*if (loadingTxt && loadingTxt != "") {
         $.mobile.loading("show", {text: loadingTxt, textVisible: true});
         } else {
         $.mobile.loading("show");
         }*/
    }
    var time = 1000,
        hash, temp;
    if (paramTime != null && typeof paramTime != "undefined") {
        time = paramTime;
    }
    if (href.indexOf("#") > 0) {
        temp = href.split("#");
        href = temp[0];
        hash = temp[1];
    }

    /*  if(href.indexOf("?")>0){
     href += "&_=" + Math.random();
     }else{
     href += "?_=" + Math.random();
     }
     if(hash!="" && hash!=undefined){
     href = href+"#"+hash;
     }*/
    window.reloadAppHref = function(){
        //location.reload();
        //在app端登录或者认证成功后的回调
        comm.loginApp();
    };
    if(comm.isApp()&&href.indexOf('login.html')>-1){

        appjs&&appjs.joinAuthority(JSON.stringify(
            {
                callback:"reloadAppHref",//函数名字,
                operateId:'908',//1002
            }
        ));
    }else if(comm.isApp()&&href.indexOf('auth.html')>-1){
        appjs&&appjs.joinAuthority(JSON.stringify(
            {
                callback:"reloadAppHref",//函数名字,
                operateId:'1002',//1002
            }
        ));
    }else{
        if (time > 0) {
            setTimeout(function () {
                //$.mobile.loading("hide");
                if(!(typeof g_sps == "undefined")){
                    g_sps.jump(null,href);
                }else{
                    window.location.href=href;
                }
            }, time);
        } else {
            if(!(typeof g_sps == "undefined")){
                g_sps.jump(null,href);
            }else{
                window.location.href=href;
            }
        }

    }

};
comm.setCenter = function (obj) {
    var positionFromTop = ($(window).height() - obj.height()) / 2;
    var positionFromLeft = ($(window).width() - obj.width()) / 2;
    var top = $(window).scrollTop() + positionFromTop;
    var left = $(window).scrollLeft() + positionFromLeft;
    obj.css({
        top: top + 'px',
        left: left + 'px'
    });
};

comm.browser = {
    mozilla: /firefox/.test(navigator.userAgent.toLowerCase()),
    webkit: /webkit/.test(navigator.userAgent.toLowerCase()),
    opera: /opera/.test(navigator.userAgent.toLowerCase()),
    msie: /msie/.test(navigator.userAgent.toLowerCase()),
    versions: function () {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        return { //移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') === -1 ,//是否web应该程序，没有头部与底部
            iPhoneX: (/iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375))
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

comm.setImgSize = function (maxHeight, maxWidth, objImg) {
    var img = new Image();
    img.src = objImg.src;
    var hRatio;
    var wRatio;
    var Ratio = 1;
    var w = img.width;
    var h = img.height;
    wRatio = maxWidth / w;
    hRatio = maxHeight / h;
    if (maxWidth === 0 && maxHeight === 0) {
        Ratio = 1;
    } else if (maxWidth === 0) { //
        if (hRatio < 1) Ratio = hRatio;
    } else if (maxHeight === 0) {
        if (wRatio < 1) Ratio = wRatio;
    } else if (wRatio < 1 || hRatio < 1) {
        Ratio = (wRatio <= hRatio ? wRatio : hRatio);
    }
    if (Ratio < 1) {
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
comm.getStrLen = function (str, len) {
    if (typeof str != 'undefined') {
        var strlen = 0,
            s = "";
        for (var i = 0; i < str.length; i++) {
            s = s + str.charAt(i);
            if (str.charCodeAt(i) > 128) {
                strlen = strlen + 2;
                if (strlen >= len) {
                    return s.substring(0, s.length - 1) + "...";
                }
            } else {
                strlen = strlen + 1;
                if (strlen >= len) {
                    return s.substring(0, s.length - 2) + "...";
                }
            }
        }
        return s;
    }
};
/*
 * 截取字符长度
 * */
comm.getStrByteLen = function (str, len) {
    if (typeof str != 'undefined') {
        var newStr = '',
            newLength = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 128) {
                newLength += 2;
            } else {
                newLength++;
            }
            if (newLength <= len) {
                newStr = newStr.concat(str[i]);
            } else {
                break;
            }
        }
        if (newLength > len) {
            newStr = newStr + "..."
        }
        return newStr;
    }
};

/*
 *获取字符串长度
 */
comm.getByteLen = function (val) {
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
comm.checkAccountType = function (account) {
    var type = "";
    if (/^1\d{10}$/.test(account)) {
        type = "mobile";
    }
    if (/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(account)) {
        type = "email";
    }
    return type;
};


/**
 *
 * @returns {{}}
 */
comm.getpara = function (symbol) //获取参数的函数
{
    var url = document.URL;
    var param = {};
    var str, item;
    if (url.lastIndexOf(symbol ? symbol : "?") > 0) {
        str = url.substring(url.lastIndexOf(symbol ? symbol : "?") + 1, url.length);
        var arr = str.split("&");
        for (var i = 0; i < arr.length; i++) {
            item = arr[i].split("=");
            if(decodeURIComponent(item[1]).lastIndexOf("#")>-1){
                item[1] = item[1].replace("#","");
            }
            param[item[0]] = decodeURIComponent(item[1]);
        }
    }
    return param;
};

//判断空对象
comm.isEmptyObject = function (obj) {
    for (var n in obj) {
        return false
    }
    return true;
};

comm.forceHttp = function () {
    if (location.protocol === "https:")
        location.href = "http://" + location.hostname + location.pathname + location.search;
};

comm.getparaNew = function () //获取参数的函数
{
    var url = document.URL;
    var param = {};
    var str, item;
    str = url;
    if (url.lastIndexOf("?") > 0) {
        // str = url.substring(url.lastIndexOf("?") + 1, url.length);
        if(url.lastIndexOf("?")>url.lastIndexOf("#")){//判断?在#&的位置，当?在后面，则将后面的进行截断，留取路径中的前面部分例如：//m.allinmd.cn/page#&navText=21
            str = url.substring(0, url.lastIndexOf("?") );//TODO:ios分享后navText后会带有一个?appinstall=0标志，原来方法错误、进行了更正
        }else{//如果?在前面，则将?之后的截断留取例如：?alcode=12345#&navText=21
            str = url.substring(url.lastIndexOf("?") + 1, url.length);//TODO:如果是站内进行跳转会有一个alcode需要单独处理。
        }
    }
    if (url.lastIndexOf("#") > 0) {
        str = str.split("#")[1];
    }
    if (url.indexOf("=") == "-1") {
        return false;
    }
    if (str.length > 0) {
        var arr = str.split("&");
        if (arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                item = arr[i].split("=");
                param[item[0]] = decodeURIComponent(item[1]);
            }
            return param;
        }
        return false;
    }
    return false;
};

/**
 * 将参数 生成锚点链接 添加到链接后面
 * @param obj   参数对象
 */
comm.buildAnchor = function (obj) {
    if (obj && obj != null && !$.isEmptyObject(obj)) {
        var a = window.location.pathname + location.search;
        if (a.indexOf("#") < 0) {
            a += "#";
        }
        for (var key in obj) {
            a += "&" + key + "=" + obj[key];
        }
        if (a.indexOf("share=app" > 0)) {
            a += "&share=app";
        }
        if (a.indexOf("visitSiteId") > 0) {
            var visitSiteId = comm.getparaNew().visitSiteId;
            a += "&visitSiteId=" + visitSiteId;
        }
        g_sps.jump(null,a);
    } else {
        return;
    }
};
/**
 * 获取分类下的标签数据
 * @param type {String} 专业
 * @returns {*}
 */
comm.getData = function (type) {

    var opts = CommonJsonData.videoListOptionArr[1],
        arr = [];
    if (type >= 0) {
        for (var i = 0, l = opts.length; i < l; i++) {
            if (opts[i].parentId == type) {
                arr.push(opts[i]);
            }
        }
        return arr;
    } else {
        return CommonJsonData.videoListOptionArr[1];
    }
};

/**
 *
 * @param {String} str
 * @returns {number}
 */
comm.getLength = function (str) {
    var realLength = 0,
        len = str ? str.length : 0,
        charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
};

/**
 * js截取字符串，中英文都能用
 * @param str：需要截取的字符串
 * @param len: 需要截取的长度
 */
comm.cutstr = function (str, len, symbol) {
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
            if (symbol) {
                str_cut = str_cut.concat("...");
            }
            return str_cut;
        }
    }
    //如果给定字符串小于指定长度，则返回源字符串；
    if (str_length < len) {
        return str;
    }
};

comm.revCutstr = function (str, len, symbol) {
    function newCut(str, len) {
        var str_length = 0;
        var str_len = 0;
        str_cut = new String();
        str_len = str.length - 1;
        for (var i = str_len; i >= 0; i--) {
            a = str.charAt(i);
            str_length++;
            if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于4
                str_length++;
            }
            str_cut = str_cut.concat(a);
            if (str_length >= len) {
                if (symbol) {
                    str_cut = str_cut.concat("...");
                }
                return str_cut;
            }
        }
        //如果给定字符串小于指定长度，则返回源字符串；
        if (str_length < len) {
            return str;
        }
    }

    var str = newCut(str, len);
    str_cut1 = new String();
    for (var i = str.length; i >= 0; i--) {
        a = str.charAt(i);
        str_cut1 = str_cut1.concat(a);
    }
    return str_cut1;

};

/* 将手机号中间四位替换成星号 */
comm.phoneMask = function (account) {
    return account.substr(0, 3) + "****" + account.substr(7, 11);
};


/* 为链接添加延迟响应，以避免迅速跳转后触发下一页同位置的按钮的bug */
comm.renderLinks = function () {
    $("a").on("click", function (e) {

        var str = $(this).attr("href");
        if (str && str.indexOf("javascript") < 0 && str != "") {
            e.stopPropagation();
            e.preventDefault();
            setTimeout(function () {
                comm.redirect(str);
            }, 500);
        }
    });
};

/* 为链接添加延迟响应，以避免迅速跳转后触发下一页同位置的按钮的bug */
comm.autoLogin = function () {
    var param = comm.getpara();
    var loginType = param && param.loginType;
    var signature = param && param.signature;
    var account_ = param && param.account;
    var password = param && param.password;
    var type = "";
    if (loginType && loginType == "weixin" && account_ && account_ != "") {
        var ses = customer.execute("checkSession");
        if (ses.responseStatus && !ses.responseMessage.status) { // 未登录
            type = "weixin";
            var param = {
                j_username: "weixin;" + account_ + ";allin;" + signature,
                j_password: "allin"
            };
            param.rememberMe = 1;
            var url = customer.urlList.userLogin.url;
            $.ajax({
                url: url,
                cache: false,
                async: false,
                data: param,
                dataType: 'json',
                type: "POST"
            });
        }
    }
};
//获取文件大小
comm.getFileSize = function (target) {
    var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
    var fileSize = 0;
    if (isIE && !target.files) {
        //          var filePath = target.value;
        //          var fileSystem = new ActiveXObject("Scripting.FileSystemObject");   ／／IE需要安全配置
        //
        //          if(!fileSystem.FileExists(filePath)){
        //             alert("附件不存在，请重新输入！");
        //             return;
        //          }
        //          var file = fileSystem.GetFile (filePath);
        //          fileSize = file.Size;
    } else {
        fileSize = target.files[0].size;
    }

    return fileSize;
};


/* 初始化输入框获取光标事件 */
comm.initInputFocusEvent = function () {
    $("input").on("focus", function () {
        $(this).parents(".v3-input-wrap").addClass("active");
        $(this).parents(".v3-input-wrap").addClass("active-border");
    });
    $("input").on("blur", function () {
        if ($.trim($(this).val()) == "") {
            $(this).parents(".v3-input-wrap").removeClass("active");
        }
        $(this).parents(".v3-input-wrap").removeClass("active-border");
    });
};


/***
 *  绑定返回按钮
 * @param pageName  某个子页面
 * @param href      返回到哪个页面
 */
comm.bindReturnBtn = function (pageName, href) {
    var pageBox = "";
    if (pageName != "" && typeof pageName != "undefined") {
        pageBox = "#" + pageName;
    }

    $(pageBox + " .v3-login-return," + pageBox + " .v3-return-btn").on("click", function () {
        if (href != "" && typeof href != "undefined") {
            comm.redirect(href);
        } else {
            $.mobile.loading("show");
            setTimeout(function () {
                $.mobile.loading("hide");
                history.go(-1);
            }, 600);
        }
    });
};
comm.getResponseResult = function (data) {
    if (!$.isEmptyObject(data) && data.responseObject && data.responseObject.responseStatus && !$.isEmptyObject(data.responseObject.responseData)) {
        return data.responseObject.responseData;
    } else {
        return false;
    }
};
comm.showPageError = function (param1, param2) {
    var page;
    if (param2 == undefined) {
        page = $(".content-page");
    } else {
        page = $("#" + param2);
    }
    if (page.find(".errorInfo").size() == 0) {
        page.prepend("<div class='errorInfo'></div>");
    }
    page.find(".errorInfo").show().empty().append('<div class="top_warning"><span><label>' + param1 + '<div class="close"></div></label></span></div>');

    page.find(".close").on("click", function () {
        page.find(".errorInfo").hide();
    });
};

/**
 * 绑定微信帐号
 */
comm.bindWeixin = function () {
    var rep=customer.execute("updateWeixinUniteBind", null, null);
    return rep;
};


comm.setOpenCenter = function (el) {

    el.css("top", $(window).scrollTop() + ($(window).height() / 2 - el.height() / 2));
    document.body.style.overflow = 'hidden';
};

comm.setCenter = function (obj) {
    var positionFromTop = ($(window).height() - obj.height()) / 2;
    var positionFromLeft = ($(window).width() - obj.width()) / 2;
    var top = $(window).scrollTop() + positionFromTop;
    var left = $(window).scrollLeft() + positionFromLeft;
    obj.css({
        top: top + 'px',
        left: left + 'px'
    });
};

/**
 * 处理未知是否合法的对象 比如 {} null undefined;
 * @param obj
 * @param defaultStr     默认替换字符串
 * @returns {*}
 */
comm.hdlEptObj = function (obj, defaultStr) {
    if ($.isEmptyObject(obj) || obj == "") {
        return defaultStr != undefined ? defaultStr : "";
    } else {
        return obj;
    }
};

comm.isWeiXin = function () {
    var weixinFlag = false;
    var isWXBrowse = function(){
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger" && ua.indexOf("iphone") > 0) {
            return "iphoneWX";
        } else if (ua.match(/MicroMessenger/i) == "micromessenger" && ua.indexOf("android") > 0) {
            return "androidWX";
        }
        return "other";
    };
    var isWXBrowse=isWXBrowse();
    if(isWXBrowse=="iphoneWX"||isWXBrowse=="androidWX"){
        weixinFlag = true;
    }
    return weixinFlag;
};

comm.getBrowseType = function () {
    var u = navigator.userAgent;
    var bbT = { //移动终端浏览器版本信息
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
        mac: u.indexOf('Mac') > -1,
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
    };
    return bbT;
};

/**
 * 处理 6_脊柱,2_关节 的用户职称数据，去掉前面的数字
 * @param str
 * @returns {*}
 */
comm.removeMedicalTitleNum = function (str) {

    return str ? str.replace(/\d*_/g, "") : "";
};
//参数:字符 截取分隔符类型 返回分隔类型
comm.cutLine = function (srcStr, type, callType) {
    if (!srcStr) {
        return;
    }
    var oneStep = srcStr.split(",");
    var str = "";

    $.each(oneStep, function (i, val) {
        if (val) {
            if (val.split(type)[1]) {
                str += val.split(type)[1] + callType;
            } else {
                str += val + callType;
            }
        }
    });
    return str.substring(0, str.length - 1);
};

/**
 * 截剪医师
 * @param arr
 * @returns {string}
 */
comm.cutDoctorTitle = function (arr) {
    var title = "";
    if (arr.length > 0) {
        var arrList = arr.split(",");
        var regExp = /(医师)/g;
        for (var i = 0; i < arrList.length; i++) {
            if (regExp.test(arrList[i])) {
                title = arrList[i];
                break;
            }
        }
    }
    return title;
};
/**
 * 裁剪非医师
 * @param arr
 * @returns {string}
 */
comm.cutNotDoctorTitle = function (arr) {
    var title = "";
    if (arr.length > 0) {
        var arrList = arr.split(",");
        var regExp = /(医师)/g;
        for (var i = 0; i < arrList.length; i++) {
            if (!regExp.test(arrList[i])) {
                title += arrList[i] + ",";
            }
        }
    }
    return title;
};
//
/**
 * @example
 * var param={"struts.token":};
 * CommService.getResponseData("/mcall/web/user/getWebUser/",param);
 * @returns {String}
 */
comm.getToken = function () {
    var data = CommService.getResponseData("/mcall/token/getToken/", null);
    if (data && data.token)
        return data.token;
    return "";
};

/**
 * 历史记录 设置 与返回
 * @type {{setFrom: setFrom, back: back, getHistory: getHistory}}
 */
comm.history = {
    /**
     * 记录来源
     */
    setFrom: function (paramLocation) {
        var t = this;
        var arr = t.getHistory();
        var exist = false;
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (item[0] == window.location.href) {
                exist = true;
            }
        }
        var lastPage;

        //if(!exist){
        if (paramLocation != undefined) {
            lastPage = paramLocation;
        } else if (TempCache.getItem("location") != null) {
            lastPage = TempCache.getItem("location");
            TempCache.setItem("location", window.location.href);
        } else {
            lastPage = document.referrer;
        }
        if (TempCache.getItem("location") != null && TempCache.getItem("location") != "" && TempCache.getItem("location").indexOf("app/#") > 0) {
            lastPage = TempCache.getItem("location");
            TempCache.setItem("location", "");
        }

        /*if(window.location.href!=lastPage){
         console.log("lastPage:" + document.referrer);
         arr.push([window.location.href,lastPage]);
         TempCache.setItem("history", $.toJSON(arr));
         }*/
        //}
        // console.log(arr);
        //if(location){
        TempCache.setItem("location", window.location.href);
        //}
    },
    setLocation: function () {
        TempCache.setItem("location", window.location.href);
    },
    /**
     * 返回时获取本页来源页
     */
    back: function () {
        var t = this;
        var arr = t.getHistory();
        var exist = false;
        var returnHref;

        if (arr.length) {
            for (var i = arr.length; i > 0; i++) {
                var item = arr[i];
                if (item[0] == window.location.href) {
                    var href = item[1];
                    arr.remove(i);
                    returnHref = href;
                    exist = true;
                    break;
                }
            }
            TempCache.setItem("history", $.toJSON(arr));
        }

        if (!exist) {
            returnHref = "/";
        }
        g_sps.jump(null,returnHref);
    },
    getHistory: function () {
        var str = TempCache.getItem("history");
        var arr = [];
        if (str != undefined) {
            arr = $.parseJSON(str);
        }
        return arr;
    }
};

comm.showPage = function (id) {
    $("[data-role=page]").hide();
    $(id).show();
};
//病例提示弹层
comm.attention = function (str, obj, confirmText, ensureCallback) {
    if (confirmText == undefined) {
        confirmText = "确定"
    }
    var html = '<div id="atten"><div class="jxl_mask"></div>' +
        '<div class="jsx_parent">' +
        '<div class="jxl_want" style="top:40%">' +
        '<div class="atten_title">提示</div>' +
        '<div class="atten_con">' + str + '</div>' +
        '<div class="jxl_want_bottom">' +
        '<div class="ms_sure">' + confirmText + '</div>' +
        '</div>' +
        '</div>' +
        '</div></div>';
    obj.append(html);
    setTimeout(function () {
        comm.setCenter($("#atten .jxl_want"));
    }, 50);

    $(".ms_sure").on("click", function () {
        ensureCallback && ensureCallback();
        setTimeout(function () {
            $("#atten").remove();
        }, 500);

    });
};
//草稿箱保存提示
comm.draftAttention = function (obj, str) {
    var html = '<div id="attention"><div class="jxl_mask"></div>' +
        '<div class="jsx_parent">' +
        '<div class="jxl_want">' +
        '<div class="atten_title">提示</div>' +
        '<div class="atten_con">' + str + '</div>' +
        '<div class="jxl_want_bottom" style="border-top: solid #969696 1px;">' +
        '<div class="jix_l" id="no_save_dra">不保存</div>' +
        '<div class="jix_r" id="save_dra">保存</div>' +
        '<div class="clear"></div>' +
        '</div>' +
        '</div>' +
        '</div></div>';
    obj.append(html);
    setTimeout(function () {
        comm.setCenter($("#attention .jxl_want"));
    }, 50);
};

comm.equipment = {
    IsPC: function () {
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPod");
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }
};

comm.shareLog = function (options) {
    var customerId = TempCache.getItem("userId");
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
        url: "/mcall/customer/share/createShareLog/",
        type: "POST",
        data: {
            paramJson: $.toJSON(defaultOptions)
        },
        success: function () {

        }
    });
};

/**
 * 绑定点击列表事件，使其可以点li 跳转到内部的链接上
 * @param {jQuery} el - 要绑定的li元素
 * @example comm.bindLinks($(".case_list_cont").find("li"))
 */
comm.bindLinks = function (el) {

    $(el).on("click", function (e) {
        var href = $(this).find("a").attr("href");
        g_sps.jump(null,href);
    });
};
//草稿箱提示
comm.draftRemind = function (opt) {
    $.ajax({
        type: "post",
        url: opt.url,
        data: opt.data,
        dataType: "json",
        success: function (rep) {
            if (rep !== null && rep.responseObject.responseStatus) {
                var text = "";
                var href = "/pages/common/comment-draft-list.html?resourceId=" + opt.resourceId + "&resourceType=" + opt.resourceType;
                if (opt.type == 1) { //频道页
                    text = '你有' + rep.responseObject.responseData.count + '条未发布的内容在草稿箱中，<a class="d_p_look" href="javascript:;">点击查看</a>';
                } else { //详情页
                    var count = rep.responseObject.responseData.count;
                    if (count == 1) {
                        href = "/pages/common/comment.html?id=" + rep.responseObject.responseData.id + "&draft=1";
                    }
                    text = '你对本内容有' + count + '条未发布的评论，<a class="d_p_con" href="javascript:;">继续编辑</a>';
                }
                html = '<div class="draft_popup">' +
                    '<div class="draft_popup_main">' +
                    '<div class="draft_popup_text">' + text +
                    '</div>' +
                    '<div class="d_p_close"><img src="//img50.allinmd.cn/detail/draft_close_popup.png" /></div>' +
                    '</div>' +
                    '</div>';
                $(".content-page").prepend(html);
                if (opt.type == 1) {
                    $(".d_p_look").on("click", function () {
                        close(function () {
                            g_sps.jump(null, '/pages/personal/personal_draft.html');
                        });
                    })
                } else {
                    $(".d_p_con").on("click", function () {
                        localStorage.setItem("draftListLastHref", location.href); //存储评论草稿列表来源页
                        g_sps.jump(null,href);
                    })
                }
                $(".d_p_close").on("click", function () {
                    close();
                })
            }
        }
    });

    function close(fn) {
        $.ajax({
            type: "post",
            url: opt.url,
            data: opt.data2,
            dataType: "json",
            success: function (rep) {
                if (rep.responseObject.responseStatus) {
                    $(".draft_popup").remove();
                    fn && fn();
                }
            },
            error: function () {
            }
        });
    }
};


/**
 * REM---PX单位换算
 * @param opx:需转换的PX单位字符串
 * @returns {string}
 *
 * @Author qiangkailiang
 */

comm.rem = function (opx) {
    var px = parseInt(opx);
    return (px / 75) + 'rem';
};

/**
 * 显示发布弹框
 *
 * @Author qiangkailiang
 * //该方法H5暂时没用，直接引用footer里面就可以执行发布弹层17/12/12
 */

comm.releaseBox = function () {
    $(".al-release").on("click", function (e) {
        if (TempCache.getItem('customerRole') != 3 && TempCache.getItem("customerRole") != 2 && TempCache.getItem("customerRole") != 4) {
            if ($(".al-releasePageMask").hasClass('show')) {
                return;
            }
            $(".al-releasePageMask").addClass('show');
            if (comm.browser.versions.android) {

                $(".al-releasePageMask").addClass('al-fullBlurAndroid');
            } else {
                $(".al-mainInner").addClass('al-fullBlur');
            }
            Log.createBrowse(85, '发布-选择页面');
        }
        e.stopPropagation();
    });

    $(".al-releaseCancel").on("click", function (e) {
        e.stopPropagation();
        if (!($(".al-releasePageMask").hasClass('show'))) {
            return;
        }
        $(".al-releasePageMask").removeClass('show');
        if (comm.browser.versions.android) {
            $(".al-releasePageMask").removeClass('al-fullBlurAndroid')
        } else {
            $(".al-mainInner").removeClass('al-fullBlur');
        }
    });
};

/**
 * 发现————二级筛选列表控制
 *
 * @Author qiangkailiang
 */
comm.twoFilterController = function () {
    var myscroll_first, myscroll_second;
    if (location.href.indexOf("discover_type") == -1) {
        //(function() {
        //    myscroll_first = new IScroll("#wrapper_first", {
        //        preventDefault: false,
        //        onBeforeScrollStart: function(e) {
        //            e.preventDefault();
        //        },
        //        snap: true,
        //        hScrollbar: false
        //    });
        //    myscroll_second = new IScroll("#wrapper_second", {
        //        preventDefault: false,
        //        onBeforeScrollStart: function(e) {
        //            e.preventDefault();
        //        },
        //        snap: true,
        //        hScrollbar: false
        //    });
        //})();
    }
    $(".al-typeFilterNavbarItem").eq(0).addClass('active');
    $(".al-typeFilterMainMask").eq(0).addClass('active');
    $(".al-discoverMask").addClass('show');
    $("html,body,.al-mainInner").css({"overflow": "hidden", "height": "100%"});
    $('html').attr('sT', $(window).scrollTop());
    //$(".al-typeFilterMainMask").bind('touchmove',function(e){
    //    e.stopPropagation();
    //    e.preventDefault();
    //});
    $('.al-typeFilterNavbarItem').on("click", function (e) {
        var role = $(this).data("role");
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(".al-typeFilterMainMask[data-role=" + role + "]").removeClass("active");
            $(".al-discoverMask").removeClass('show');
            $("html,body,.al-mainInner").css({"overflow": "auto", "height": "auto"});
            $(window).scrollTop($('html').attr('sT') || 0);
        } else {
            $(this).addClass('active').siblings().removeClass('active');
            $(".al-typeFilterMainMask").removeClass('active');
            $(".al-typeFilterMainMask[data-role=" + role + "]").addClass('active');
            $(".al-discoverMask").addClass('show');
            $("html,body,.al-mainInner").css({"overflow": "hidden", "height": "100%"});
            $('html').attr('sT', $(window).scrollTop());
            //$(".al-typeFilterMainMask").unbind('touchmove');

        }
    });
    $(".al-twoFloorFilter").on("click", '.al-twoFloorFirstFilterItem', function (e) {
        //分享埋点
        comm.creatEvent({
            triggerType: '筛选',
            keyword: $(this).text(),
            actionId: 50
        });
        $('#wrapper_second').scrollTop(0);
        var matrix = $('.EV-firstTemplateBox').css('transform');
        var _h = matrix && matrix.replace(/[^\d+,]/g, "").split(',')[5];
        var secondRole = $(this).data("role");
        $(this).addClass('selected').siblings().removeClass('selected');
        $(".al-twoFloorSecondFilterBox").removeClass('selected');
        $(".al-twoFloorSecondFilterBox[data-role=" + secondRole + "]").addClass('selected');
        $(".al-twoFloorSecondFilter").css("height", $(".al-twoFloorSecondFilterBox.selected").height() + "px");
        if (location.href.indexOf("discover_type") == -1) {
            //myscroll_first = new IScroll("#wrapper_first", {
            //    preventDefault: false,
            //    onBeforeScrollStart: function(e) {
            //        e.preventDefault();
            //    },
            //    snap: true,
            //    hScrollbar: false,
            //    y:_h
            //});
            //myscroll_second = new IScroll("#wrapper_second", {
            //    preventDefault: false,
            //    onBeforeScrollStart: function(e) {
            //        e.preventDefault();
            //    },
            //    snap: true,
            //    hScrollbar: false
            //});
        }
        $('.EV-firstTemplateBox').css('-webkit-transform', 'translate(0px, ' + -_h + 'px) translateZ(0px)').css('transform', 'translate(0px, ' + -_h + 'px) translateZ(0px)');
        e.stopPropagation();
    });
    $('.al-twoFloorSecondFilter').on("click", ".al-twoFloorSecondFilterItem", function (e) {
        $(".al-twoFloorSecondFilterItem").removeClass('active');
        $(this).addClass('active');

        $(".al-typeFilterMainMask").removeClass('active');
        $(".al-typeFilterNavbarItem").removeClass('active');
        $(".al-discoverMask").removeClass('show');
        //$("body").unbind('touchmove');
    });
    $(".al-oneFloorFilterItem[data-role='sort']").on("click", function (e) {
        $(this).addClass('active').siblings().removeClass('active');
        $(".al-typeFilterNavbarItem").removeClass('active');
        $(".al-typeFilterMainMask").removeClass('active');
        $(".al-typeFilterNavbarItem[data-role='sort'] span").text($(this).text());
        $(".al-discoverMask").removeClass('show');
        //$("body").off('touchmove');
    });
    $(".al-oneFloorFilterItem").on("click", function (e) {
        //$("body").off('touchmove');
    })

};


/**
 * Confirm模态框弹层
 *      @param options {obj}
 *          - title 标题文本 {string}
 *          - cancel 取消按钮文本 {string}
 *          - ensure 确认按钮文本 {string}
 *          - ensureCallback 确认执行回调 {Function}
 *          - cancelCallback 取消执行回调 {Function}
 *          - callBack   确认执行回调 {Function}（点击事件在callBack函数里）
 * @Author qiangkailiang
 */

comm.confirmBox = function (options) {
    if ($('.ev_confirmBox').length === 0) {
        var template = '<section class="al-confirmModalMask ev_confirmBox">' +
            '<section class="al-confirmModal">' +
            (
                function(){
                    var str='';
                    if(options.imgPath){
                        str+='<div class="confirmImg"><img src="'+options.imgPath+'" /></div>';
                    }
                    return str;
                }()
            )+
            '<article class="al-confirmModalContent">' +
            '<article>' +
            (options.topTitle?'<h3>'+options.topTitle+'</h3>':'')+
            '<p>' + options.title + '</p>' +
            '</article>' +
            '</article>' +
            '<footer class="al-confirmModalBtns">' +
            '<button class="al-confirmModalCancelBtn">' + options.cancel + '</button>' +
            '<button class="al-confirmModalEnsureBtn">' + options.ensure + '</button>' +
            '</footer>' +
            '</section>' +
            '</section>';
        $("body").append(template);

        setTimeout(function (e) {
            $(".ev_confirmBox").addClass('show');
        }, 100);

        if (!options.noClickParam){
            $(".al-confirmModalEnsureBtn").off('click').on("click", function () {
                options.ensureCallback && options.ensureCallback();
                $(".ev_confirmBox").remove();
                return false;
            });
        }

        $(".al-confirmModalCancelBtn").off('click').on("click", function () {
            options.cancelCallback && options.cancelCallback();
            $(".ev_confirmBox").remove();
            return false;
        });
        options.callBack && options.callBack();
    } else {
        $(".ev_confirmBox").addClass('show');
    }
};
comm.confirmAuthBox = function (options) {
    $('.ev-guide').remove();
    if ($('.ev_authPopup').length === 0) {
        var template = '<section class="ToAuth ev_authPopup">' +
            '    <section class="ToAuthCont ToAuthInner">' +
            '        <span class="al-authHelpClose ev_authCancelBtn"></span>' +
            '        <img src="//img50.allinmd.cn/pages/personal/goAuth.png" alt="">' +
            '        <h2>认证后才能继续操作</h2>' +
            '        <button class="ev_authNowBtn">立即认证</button>' +
            '    </section>' +
            '</section>';
        $("body").append(template);
        //立即认证
        $(".ev_authNowBtn").off('click').on("click", function () {
            options.ensureCallback && options.ensureCallback();
            $(".ev_authPopup").remove();
            return false;
        });
        $(".ev_authCancelBtn").off('click').on("click", function () {
            options.cancelCallback && options.cancelCallback();
            $(".ev_authPopup").remove();
            return false;
        });
        options.callBack && options.callBack();
    }
};


/**
 * alert模态框弹层
 *      @param options {obj}
 *          - title 标题文本 {string}
 *          - ensure 确认按钮文本 {string}
 *          - ensureCallback 确认执行回调 {Function}
 *
 * @Author qiangkailiang
 */

comm.alertBox = function (options) {
    $('.ev-guide').hide();
    if ($('.ev_alertBox').length === 0) {
        var template = '<section class="al-confirmModalMask al-alertModalMask ev_alertBox">' +
            '<section class="al-confirmModal">' +
            '<article class="al-confirmModalContent">' +
            '<article>' +
            '<h2>' + (options.mTitle || '') + '</h2>' +
            '<p>' + (options.title || '') + '</p>' +
            '</article>' +
            '</article>' +
            '<footer class="al-confirmModalBtns">' +
            '<button class="al-confirmModalEnsureBtn" style="width:100%">' + (options.ensure || '') + '</button>' +
            '</footer>' +
            '</section>' +
            '</section>';
        $("body").append(template);

        setTimeout(function (e) {
            $(".ev_alertBox").addClass('show');
        }, 50);

        $("body").on("click", ".al-confirmModalEnsureBtn", function (e) {
            options.ensureCallback && options.ensureCallback();
            $(".ev_alertBox").removeClass('show');
            e.preventDefault();
            e.stopPropagation();
        });
    } else {
        $(".ev_alertBox").addClass('show');
    }
};


/**
 * 输入框动态样式
 *      @param options {obj}
 *          - inputCallback 开始输入时执行回调 {function}
 *          - emptyCallback 输入框内容删空执行回调 {function}
 *          - focusCallback 点击输入框执行回调 {function}
 *          - clearCallback 输入框内容手动点击清空执行回调
 *          - cancelCallback 取消按钮点击执行回调 {function}
 * @Author qiangkailiang
 *
 */
comm.inputFocus = function (cObj) {
    cObj = cObj || {};
    $(".al-searchInputBar input").on("keyup", function (e) {
        if ($(this).val().length !== 0) {
            $(this).parent().find(".icon-searchCancel").show();
            cObj.inputCallback && cObj.inputCallback($(this));
        } else {
            $(this).parent().find(".icon-searchCancel").hide();
            cObj.emptyCallback && cObj.emptyCallback();
        }
    });
    $(".al-searchInputBar input").on("click", function () {
        $(".al-searchHead").addClass('al-searchHeadShow');
        $(this).addClass('focus');
        $(".al-searchHead .al-searchCancel").addClass('show');
        cObj.focusCallback && cObj.focusCallback();
    });


    $(".al-searchCancel").on("click", function (e) {
        if (e.target.className === "icon-searchCancel") {
            $(".al-searchInputBar").find("input").val("");
            $(".icon-searchCancel").hide();
            cObj.clearCallback && cObj.clearCallback();
            return;
        } else {
            $(".al-searchHead").removeClass('al-searchHeadShow');
            $(".al-searchHead input").removeClass('focus');
            $(".al-searchHead .al-searchCancel").removeClass('show');
            cObj.cancelCallback && cObj.cancelCallback();
        }

    });

    $(".al-searchFocusMask").on("click", function () {
        $(".al-searchHead").removeClass('al-searchHeadShow');
        $(".al-searchHead input").removeClass('focus');
        $(".al-searchHead .al-searchCancel").removeClass('show');
    });


};
//发布按钮
comm.uploadBtn = function (obj) {
    var uploadHtml = '<!-- 发布 -->' +
        '<section class="al-releasePageMask" data-alcode-mod="576" data-alcode-item-selector="a">' +
        '<figure class="al-releaseTitle">' +
        '<img src="//img50.allinmd.cn/pages/index/release_title.png" alt="">' +
        '</figure>' +
        '<section class="al-releaseBtn">' +
        /*'<a href="javascript:;" _href="/pages/living/living_index.html" style="position: absolute;top: -130%;left: 50%;transform: translateX(-50%);"><figure class="al-releaseItem">' +
         '<img src="/images/img50/pages/living/living_logo.png" alt="">' +
         '<figcaption>直播</figcaption>' +
         '</figure></a>' +*/
        '<a href="javascript:;" _href="/pages/case/case_upload.html"><figure class="al-releaseItem">' +
        //'<img src="//img50.allinmd.cn/pages/index/release_case.png" alt="">' +
        '<img src="data:image/png;base64,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" alt="">' +
        '<figcaption>病例</figcaption>' +
        '</figure></a>' +
        //'<figure class="al-releaseItem">' +
        //'<a href="javascript:;" _href="/pages/topic/topic_upload.html">' +
        ////'<img src="//img50.allinmd.cn/pages/index/release_topic.png" alt="">' +
        //'<img src="data:image/png;base64,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" alt="">' +
        //'<figcaption>话题</figcaption>' +
        //'</figure></a>' +
        '<a href="javascript:;" _href="/pages/personal/personal_draft.html"><figure class="al-releaseItem">' +
        //'<img src="//img50.allinmd.cn/pages/index/release_draft.png" alt="">' +
        '<img src="data:image/png;base64,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" alt="">' +
        '<figcaption>草稿</figcaption>' +
        '</figure></a>' +
        '</section>' +
        '<figure class="al-releaseCancel">' +
        //'<img src="//img50.allinmd.cn/pages/index/release_cancel.png" alt="">' +
        '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeBAMAAADJHrORAAAAJ1BMVEUomeb///8omeYomeYomeYomeYomeYomeYomeYomeYomeYomeYomeaezgQrAAAADHRSTlMAAANdXp2en6Gi/P15HOMAAAAAvklEQVQY012RvQ3CMBBGTyELRMkC6VJSUbgiAgnJLStQMgUjsAIpvQH0SOaG4u4+25i4sPT0Pdn3Q82Z7HR6diNNcVu4Dze68qOw4zd5jvvEfeCFWr3AjuNMWUDcURYQCycBsTIExMoQEBubgNhYhQNisAhPxGARGHHi9sWfueLNit2/v35P/jtW/1k9/leP1TuUelM/PveT+h1Sv2UeHvMo8zKhnqcK9bxVkH0sZR9e9jEhNh7CnZpLtc/T+AXAVXWzaO9W7wAAAABJRU5ErkJggg==" alt="">' +
        '</figure>' +
        '</section>';
    // if (!$(".al-releasePageMask").length > 0) {
    //     $("body").append(uploadHtml);
    // }
    obj.on("click", function (e) {
        if (TempCache.getItem('customerRole') != 3 && TempCache.getItem("customerRole") != 2 && TempCache.getItem("customerRole") != 4) {
            comm.creatEvent({
                triggerType: '发布',
                keyword: "发布",
                actionId: 32
            });
            var id = TempCache.getItem('userId')||'';
            var amChannel = comm.getpara()._amChannel;
            comm.newReleaseBox({
                imgPath:"//img50.allinmd.cn/case/release.png",
                title:"发布内容需使用唯医App",
                solidBtnTitile:"立即使用",
                authNoneTitle:"暂不发布",
                data:{
                    el: ".solidBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html?scene=11&type=7" +(amChannel?"&_amChannel="+amChannel:''),
                    ios9: "http://app.allinmd.cn/applinks.html?scene=11&type=7" +(amChannel?"&_amChannel="+amChannel:''),
                    android: "allin://com.allin.social:75235?data={scene:11,type:51,userId:"+id + (amChannel?",_amChannel:"+amChannel:'')+ "}"
                }
            });
            // if (comm.browser.versions.ios) {
            //     $("body").css("overflow", "hidden");
            //     $(".al-releasePageMask").addClass('show');
            //     $(".al-mainInner").addClass('al-fullBlur');
            //     return false;
            // } else {
            //     $("body").css("overflow", "hidden");
            //     $(".al-mainInner").addClass('al-fullBlurAndroid');
            //     $(".al-releasePageMask").addClass('al-fullBlurAndroid');
            //     //Log.createBrowse(85,'发布-选择页面');
            //     return false;
            // }
        } else {
            popup('该用户没有操作权限');
        }
    });
    // $(".al-releaseBtn a").on("click", function () {
    //     var $this = $(this);
    //     var href = $(this).attr("_href");
    //     if (href.indexOf('case_upload') > -1) {
    //         comm.creatEvent({
    //             triggerType: '发布-病例',
    //             keyword: "发布-病例",
    //             actionId: 33,
    //             async: false
    //         });
    //     } else if (href.indexOf('topic_upload') > -1) {
    //         comm.creatEvent({
    //             triggerType: '发布-话题',
    //             keyword: "发布-话题",
    //             actionId: 35,
    //             async: false
    //         });
    //     } else {
    //         comm.creatEvent({
    //             triggerType: '发布-草稿',
    //             keyword: "发布-草稿",
    //             actionId: 37,
    //             async: false
    //         });
    //     }
    //     //$(".al-releasePageMask").removeClass('show');
    //     user.privExecute({
    //         operateType: 'auth', //'login','auth','conference'
    //         callback: function () {
    //             $(".al-releasePageMask").addClass('show');
    //             TempCache.removeItem("activity");     //清楚活动的缓存
    //             //window.location.href = href;
    //             g_sps.jump($this, href);
    //         },
    //         noNeedBack: true
    //     });
    // });
    // $(".al-releaseCancel").on("click", function (e) {
    //     if (comm.browser.versions.ios) {
    //         $("body").css("overflow", "auto");
    //         $(".al-releasePageMask").removeClass('show');
    //         $(".al-mainInner").removeClass('al-fullBlur');
    //     } else {
    //         $("body").css("overflow", "auto");
    //         $(".al-mainInner").removeClass('al-fullBlurAndroid');
    //         $(".al-releasePageMask").removeClass('al-fullBlurAndroid');
    //         return false;
    //     }
    // });
};
/**
 * 新版发布弹层
 *      @param options {obj}
 *          - imgPath 弹框图片地址
 *          - title 标题文本 {string}
 *          - solidBtnTitile 确认按钮文本 {string}
 *          - authNoneTitle 确认执行回调 {Function}
 *          - data 跳转App地址和参数
 *
 * @Author on 2017/12/15
 */
comm.newReleaseBox = function (options) {
    if ($('.ev_authPopup').length === 0) {
        var template ='<section class="authPopup ev_authPopup">\n' +
            '        <aside class="authPopupCont">\n' +
            '            <figure class="ev_authPopClose"><img src="//img50.allinmd.cn/authentication/auth/close.png"></figure>\n' +
            '           <aside class="exhibitionImg authTip"><img src="'+(options.imgPath?options.imgPath:'/images/img50/authentication/auth/attestation.png')+'"></aside>' +
            '            <article class="titleText"></article>' +
            '            <article class="detailText color333">'+(options.title?options.title:'认证后才能继续操作<br>是否前往认证？')+'</article><!--色值为#777777 浅色-->\n' +
            '            <button class="solidBtn">'+(options.solidBtnTitile?options.solidBtnTitile:'前往认证')+'</button><!--实心按钮-->\n' +
            '                    <article class="authNone">'+(options.authNoneTitle?options.authNoneTitle:'暂不认证')+'</article>' +
            '        </aside>\n' +
            '    </section>';
        $("body").append(template);

        comm.bindCallApp(options.data);

        $(".authNone,.ev_authPopClose").off('click').on("click", function () {
            options.authNoneCallBack && options.authNoneCallBack();
            $(".ev_alertBox").removeClass('show');
            $(".ev_authPopup").remove();
            return false;
        });
    }
};

// 厂商认证或返回上一页
comm.factoryForceBox = function (options) {
    if ($('.ev_authPopup').length === 0) {
        var template ='<section class="authPopup ev_authPopup">\n' +
            '        <aside class="authPopupCont">\n' +
            '           <aside class="exhibitionImg authTip"><img src="'+(options.imgPath?options.imgPath:'/images/img50/authentication/auth/attestation.png')+'"></aside>' +
            '            <article class="titleText"></article>' +
            '            <article class="detailText color333">'+(options.title?options.title:'认证后才能继续操作<br>是否前往认证？')+'</article><!--色值为#777777 浅色-->\n' +
            '            <button class="solidBtn">'+(options.solidBtnTitile?options.solidBtnTitile:'前往认证')+'</button><!--实心按钮-->\n' +
            '                    <article class="authNone ev-facotry-goback">'+(options.authNoneTitle?options.authNoneTitle:'返回')+'</article>' +
            '        </aside>\n' +
            '    </section>';
        $("body").append(template);

        comm.bindCallApp(options.data);

        $(".ev-facotry-goback").off('click').on("click", function () {
            options.authNoneCallBack && options.authNoneCallBack();
            window.history.back();
            return false;
        });
    }
};

/*页面底部主导航功能*/
comm.footerNav = function () {
    comm.uploadBtn($(".al-release"));
    if (TempCache.getItem("userId")) {
        getSpecialCount();
    }

    function getSpecialCount() {
        var data = {};
        var localTime = comm.date.local_time();
        if (TempCache.getItem("userId")) {
            if (!TempCache.getItem("readCollectionTime")) {
                TempCache.setItem("readCollectionTime", localTime); //第一次登录后进入网站记下时间
            }
            if (!TempCache.getItem("readDraftTime")) {
                TempCache.setItem("readDraftTime", localTime); //第一次登录后进入网站记下时间
            }
            if (!TempCache.getItem("readTrendTime")) {
                TempCache.setItem("readTrendTime", localTime); //第一次登录后进入网站记下时间
            }
            if (!TempCache.getItem("readFansTime")) {
                TempCache.setItem("readFansTime", localTime); //第一次登录后进入网站记下时间
            }
            if (!TempCache.getItem("readPreferTime")) {
                TempCache.setItem("readPreferTime", localTime); //第一次登录后进入网站记下时间
            }
        }

        data.readCollectionTime = TempCache.getItem("readCollectionTime"); //上次进入我的收藏的时间
        data.readDraftTime = TempCache.getItem("readDraftTime"); //上次进入草稿的时间
        data.readTrendTime = TempCache.getItem("readTrendTime"); //上次进入朋友圈的时间
        data.readFansTime = TempCache.getItem("readFansTime"); //上次进入粉丝列表的时间
        data.readPreferTime = TempCache.getItem("readPreferTime"); //上次进入赞列表的时间
        data.platformId = TempCache.getItem("department");
        var param = {};
        param.paramJson = $.toJSON(data);

        $.ajax({
            type: "post",
            url: M_CALL + "customer/message/getSpecialCount/",
            data: param,
            dataType: "json",
            success: function (rep) {
                if (rep && rep.responseObject.responseData) {
                    if (rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                        var list = rep.responseObject.responseData.data_list[0];
                        specialCount = {
                            collectionNum: list.collectionNum, ////新的收藏数
                            draftNum: list.draftNum, //新的草稿数
                            fansNum: list.fansNum, //新的粉丝数
                            messageNum: list.messageNum, //新的消息数
                            preferNum: list.preferNum, //新的赞数
                            trendsNum: list.trendsNum //新的朋友圈数
                        };
                        if (list.trendsNum > 0) { //首页徽标
                            // $(".al-footerBarItem").eq(0).append('<i class="icon-newTips"></i>');
                            //$(".al-indexRecommendItem a").eq(0).append('<i class="icon-newTips"></i>');  //朋友圈
                        }

                        /*if(list.trendsNum>0){//发现徽标
                         $(".al-footerBarItem").eq(1).append('<i class="al-newsNum"></i>');
                         }*/
                        if (list.messageNum > 0) { //消息徽标
                            $(".al-footerBarItem").eq(3).append('<i class="al-newsNum">' + (list.messageNum < 100 ? list.messageNum : '...') + '</i>');
                        } else if (list.sysNoReadCount > 0) {
                            $(".al-footerBarItem").eq(3).append('<i class="icon-newTips"></i>');
                        }
                        if (list.draftNum > 0 || list.fansNum > 0 || list.preferNum > 0 || list.collectionNum > 0) { //我的徽标
                            $(".al-footerBarItem").eq(4).append('<i class="icon-newTips"></i>');
                        }

                        //个人中心
                        if (list.collectionNum) { //收藏
                            $(".ev-collectIcon").append('<i class="al-newsNum">' + (list.collectionNum < 100 ? list.collectionNum : '...') + '</i>');
                        }
                        if (list.draftNum > 0) { //草稿
                            $(".ev-draftIcon").append('<i class="al-newsNum">' + (list.draftNum < 100 ? list.draftNum : '...') + '</i>');
                        }
                        if (list.fansNum > 0) { //有新的粉丝加徽标
                            $(".al-personalSnsNum").eq(0).append('<i class="icon-newTips"></i>');
                        } else {
                            $(".al-personalSnsNum").eq(0).find("i").remove();
                        }
                        if (list.preferNum > 0) { //有新的关注人加徽标
                            $(".al-personalSnsNum").eq(2).append('<i class="icon-newTips"></i>');
                        } else {
                            $(".al-personalSnsNum").eq(2).find("i").remove();
                        }
                    }
                }
            },
            error: function () {
            }
        });
    }
};

/*
 * 未认证用户显示邮箱或手机号码
 * */
comm.getRegisterName = function (email, mobile) {
    var count = "";
    if (email) {
        count = email.substr(0, 2) + "****" + email.substring(email.lastIndexOf("@"));
    } else if (mobile) {
        count = mobile.substr(0, 3) + "****" + mobile.substring(mobile.length - 4);
    }
    return count;
};

/**
 * @desc 在页面底部显示提示下载
 * @param {String} page video|img|home|topic 页面类型
 */
comm.showAppDownload = function (page, zIndex) {
    comm.getAppLogin();
    if (localStorage.getItem("appLogin") == 1) { //在app上登录过过不继续往下执行
        return;
    }
    var userAgentInfo = navigator.userAgent;
    var isIphone = false;
    if (userAgentInfo.indexOf("iPhone") > 0) {
        isIphone = true
    }

    var isWeixin = (userAgentInfo.indexOf("MicroMessenger") > 0);
    if (typeof zIndex === "undefined") {
        index = 5;
    }
    if (!page) {
        return;
    }

    //alert(isWeixin);
    var sesName = "DownAppClosed_"; // + page;
    var sess;
    var link;
    /*if (window.sessionStorage) {
     sess = sessionStorage.getItem(sesName);
     } else {
     sess = $.cookie(sesName);
     }*/

    sess = $.cookie(sesName);
    if (!sess) { // 未关闭过
        $("body").find(".mo-download-app").remove();
        if (isIphone) {
            if (isWeixin) {
                link = "http://a.app.qq.com/o/simple.jsp?pkgname=com.allin.social";
            } else {
                link = "https://itunes.apple.com/cn/app/wei-yi-for-iphone/id986266583";
            }
        } else {
            link = "http://a.app.qq.com/o/simple.jsp?pkgname=com.allin.social";
        }

        $("body").append('<div class="mo-download-app">' +
            '<div class="app_position_close"><img src="//img50.allinmd.cn/app/colse.png" /></div>' +
            '<div class="app_position_logo"><img src="//img50.allinmd.cn/app/allin_logo.png" /></div>' +
            '<div class="app_position_text"><img src="//img50.allinmd.cn/app/app_text_' + page + '.png" /></div>' +
            '<div class="app_position_down"><a href="' + link + '" data-ajax="false">' +
            '   <img src="//img50.allinmd.cn/app/downland.png" /></a></div>' +
            '</div>');
        $(".mo-download-app").css("zIndex", zIndex);
        $(".app_position_close").on("vclick", function () {
            $(".mo-download-app:last").remove();
            /* if (window.sessionStorage) {
             sessionStorage.setItem(sesName, 1);
             } else {
             $.cookie(sesName, 1);
             }*/

            $.cookie(sesName, 1, {expires: 1, path: "/"});
        });


        /* if (isWeixin) {
         $(".app_position_down").on("vclick", function () {
         $("body").append(' <div class="app_popup_wx"></div>' +
         '              <div class="app_popup_wx_img"><img src="/images/img50/app/popup_wx.png" /></div>');
         $(".app_popup_wx_img").off("vclick").on("vclick", function () {
         $(".app_popup_wx,.app_popup_wx_img").remove();
         return false;
         })
         });
         }*/

    }

};

//检验是否在app上登录过
comm.getAppLogin = function () {
    if (!localStorage.getItem("appLogin") && localStorage.getItem("userId")) { //在登录时只会请求一次
        $.ajax({
            type: "post",
            url: "/mcall/log/customer/login/getIsLogin/",
            data: {"paramJson": $.toJSON({"dataFlag": 2, pageIndex: 1, pageSize: 10})},
            async: false,
            dataType: "json",
            success: function (rep) {
                if (rep.responseObject && rep.responseObject.responseMessage) {
                    localStorage.setItem("appLogin", rep.responseObject.responseMessage.isLogin); //0:未登录过,1:登录过
                }
            },
            error: function () {
            }
        });
    }
};

/**
 * @desc 字符串插值 近似于Array.prototype.splice
 * @param {String} idx 插入位置
 *        {String} rem 插入位置删除字符数量
 *        {String} str 插入字符串
 */
String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

/**
 * 识别链接是否从APP中分享而来 若是则显示弹层 强制去引导打开APP   ，用户不能关闭
 * @return {boolean} 是否为分享链接
 * */
comm.recognizeAppShareLink = function (callAppOptions) {
    /*if (comm.getparaNew() && comm.getparaNew().share && (comm.getparaNew().share.toLowerCase() == "app")) {

     var $content = $(".content-page");
     if ($content.size() == 0) {
     $content = $("body");
     }
     $content.append("<div class='app_download_wx_jump_app'><div class='bg'></div><div class='center'><img src='//img50.allinmd.cn/callApp/share-app-popup.png' alt='' ></div></div>");

     var vp = document.querySelector('meta[name="viewport"]').getAttribute('content');

     var scale = vp.match(/initial\-scale=([\d\.]+)/) || vp.match(/maximum\-scale=([\d\.]+)/);
     if (scale != null && parseInt(scale[1]) == 1) {
     $(".app_download_wx_jump_app").addClass("viewport-small");
     }
     $("video,input,select,textarea,object").hide(); // 隐藏某些不受z-index控制的元素。    当前层 z-index 10050

     // 扩展之前页面上已存在的唤醒参数
     if (typeof callAppOptions != "undefined") { // 若存在定义
     callAppOptions = $.extend(callAppOptions, { el: ".app_download_wx_jump_app .center" });
     } else {
     var callAppOptions = {
     el: ".app_download_wx_jump_app .center",
     ios: "allinmdios://",
     ios9: "http://app.allinmd.cn/applinks.html",
     android: "allin://com.allin.social:75235"
     }
     }
     comm.bindCallApp(callAppOptions);

     $("body").css("overflow", "hidden").on("mousemove touchmove", function(e) {
     return false;
     });
     return true; // 分享的链接          7-26      http://cooperation.allinmd.cn/redmine/issues/14431
     } else {
     return false; // 非分享的链接         7-26
     }*/
};


/**
 * @example Common.bindCallApp({ios:"",android:"",element,callback:function(){},reCallBack:function(){}});
 * @desc 绑定唤醒APP的按钮
 * @param  options {Object,runAtOnce:true，android,ios,ios9,el} 表示地址。必须至少包含一个属性：ios,或 android,
 * 修改本函数，需连同allin/personal/app/scripts/services/mainService.js 此文件中同名函数一同修改。
 * */
comm.bindCallApp = function (options) {
    if (typeof options != "object") {
        log();
        return;
    }

    if (!options.hasOwnProperty("ios") && !options.hasOwnProperty("android")) {
        log();
        return;
    }
    var u = window.navigator.userAgent;
    var isWeixin = /MicroMessenger/.test(u);
    var isIOS9 = false;
    var isIOS9_0_or_1 = false;

    isIOS9 = Boolean(navigator.userAgent.match(/OS ([9]_[2-9]|[10|11][_\d])[_\d]* like Mac OS X/i)); // ios9.2之前的版本，
    isIOS9_0_or_1 = Boolean(navigator.userAgent.match(/OS ([9]_[0-1])[_\d]* like Mac OS X/i)); // ios9.2之前的版本，

    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;

    var isIphone = u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1;
    var isWeibo = u.indexOf('weibo') > -1 || u.indexOf('Weibo') > -1;
    var isQQBrowser = u.indexOf('QQ') > -1 && u.indexOf("NetType") > -1;//qq内置浏览器
    var StartTime;
    var elements;
    var timeoutsArr = [];
    var url = getUrl();
    if(options.ios9.lastIndexOf("?")>-1){
        options.ios9+="&title="+document.title;
    }else{
        options.ios9+="?title="+document.title;
    }
    /**
     *  获取对应版本的 schema 地址
     * */
    function getUrl() {
        var url = "";
        var u = navigator.userAgent;
        if (isAndroid) {
            if (options.android != undefined) {
                url = options.android;
            }
        }

        if (isIphone) {
            if (options.ios != undefined) {
                url = options.ios;
            }
        }
        if(url.lastIndexOf("?")>-1){
            url+="&title="+document.title;
        }else{
            url+="?title="+document.title;
        }
        return url;
    }

    $(window).on("blur pagehide beforeunload", clearTimeouts);

    function clearTimeouts() {
        timeoutsArr.forEach(window.clearTimeout);
        timeoutsArr = [];
    }

    // 针对ios9 如果跳至中转页面,返回后仍然没有打开.则尝试用schema再打开一次,若再打不开,再跳转至下载页
    if (typeof comm.getparaNew().ios9 != "undefined") {
        tryOpen(url);
    }
    /*尝试直接打开*/
    if (typeof options.runAtOnce == "boolean" && options.runAtOnce) {
        if (isIOS9) {
            locationOpen(options.ios9);
        } else {
            tryOpen(url);
        }

    }

    /* 需要绑定按钮 */
    if (typeof options.el == "string") {
        elements = options.el;
        bindIng(options.callback,options.reCallBack);
    }

    function bindIng(callback,reCallBack) {
        if (isAndroid) {
            /*  alert(isAndroid + "isAndroid")
             alert(isWeixin + "isWeixin")
             alert(isWeibo + "isWeibo")
             alert(isQQBrowser + "isQQBrowser")*/
            if (isWeixin || isWeibo) {/* || isQQBrowser*/
                $(elements).on("click", function () {
                    showWeixinGuide("android",callback,reCallBack);
                });
            } else {
                bindOpen();
            }
        }
        if (isIphone) {
            if (isIOS9) { // ios9直接显示加链接
                bindOpen(options.ios9);
            } else { //ios9以下 的话;          */
                if (isWeixin || isWeibo) {
                    $(elements).on("click", function () {
                        showWeixinGuide("ios",callback,reCallBack);
                    });
                } else {
                    bindOpen(options.ios);
                }
            }
        }
    }

    function bindOpen(url) {
        $(elements).off("click").on("click", {url: url || ""}, function (event) {
            var url = event.data.url;
            StartTime = +(new Date);
            if (!url) {
                var url = getUrl();
            }
            tryOpen(url);
            comm.creatEvent({
                triggerType:'产品引流',
                triggerName:'打开APP',
                keyword:'H5端引导用户打开APP按钮',
                actionId:11029
            });
        });
    }

    /*尝试去打开*/
    function tryOpen(url) {
        if (!url) return;
        if (isIOS9) {
            locationOpen(url);
        } else {
            var u = url;
            window.setTimeout(function () {
                if (isIOS9_0_or_1) {
                    locationOpen(u);
                } else {
                    iframeOpen(u);
                }

            }, 0);
        }
        checkIfFail();
    }


    function iframeOpen(url) {
        var iframe = document.createElement("iframe");
        iframe.src = url;
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        setTimeout(function () {
            document.body.removeChild(iframe);
            iframe = null
        }, 0);
    }


    function locationOpen(url) {
        window.location.href = url;
    }

    /**
     *  在不支持统一链接的微信内的话显示引导界面
     * */
    function showWeixinGuide(type,callback,reCallBack) {
        var imgPath;
        if (type == "android") {
            imgPath = "//img50.allinmd.cn/callApp/android.jpg";
        } else {
            imgPath = "//img50.allinmd.cn/callApp/ios.png";
        }
        var $content = $(".content-page");
        if ($content.length > 0) {
            $content.append("<div class='app_download_wx'><img src='" + imgPath + "' /></div>");
        } else {
            $("body").append("<div class='app_download_wx'><img src='" + imgPath + "' /></div>");
        }
        callback&&callback();
        $("body").css("overflow", "hidden").bind('touchmove', function (eve) {
            eve.preventDefault();
        });
        $(".app_download_wx").on("click", function () {
            $(this).remove();
            $("body").css("overflow", "auto").unbind('touchmove');
            reCallBack&&reCallBack();
        });
        comm.creatEvent({
            triggerType:'产品引流',
            triggerName:'打开APP',
            keyword:'H5端引导用户打开APP按钮',
            actionId:11029
        });
    }

    /**
     * 检测是否失败
     * 失败后跳转到APP 下载
     * */
    function checkIfFail() {

        if (isAndroid) {
            timeoutsArr.push(window.setTimeout(function () {
                if (+(new Date) - StartTime < 3100) {
                    window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.allin.social"; // app download url
                }
            }, 3e3));
        } else {
            timeoutsArr.push(window.setTimeout(function () {
                console.log(Date.now() - StartTime);
                if (Date.now() - StartTime < 3100) {
                    if (isWeixin) {
                        window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.allin.social"; // app download url
                    } else {
                        window.location.href = "https://itunes.apple.com/cn/app/wei-yi-gu-ke-yi-sheng-ji-xu/id986266583"; // app download url
                    }
                }
            }, 3e3));
        }

    }

    function log() {
        console.log("请传入要跳转的APP地址的参数对象，如：{ios:\"allinmdios://meettingBroadcast/meetInfo\",android:\"'allin://com.allin.social:75235?data=mydata\"}");
    }
};


/***
 * 生成导航
 * @param index {number}选中的索引 -1 不选  0-首页,1-病例,2-视频,3-专家,4-会议,5-文库,6-话题
 * @param isCallApp {Object} 是否显示打开APP  ID为 callAppBtn
 * @param isShowSearch {boolean}是否显示 搜索条
 */
comm.bindNav = function (index, isCallApp, isShowSearch) {
    var $header;
    var href = "";
    /* 初始化DOM */
    function initHeaderDom() {
        $("#selector_top").remove();
        var openAppDom = "";
        if (isCallApp) {
            openAppDom = ' <div class="app_iphone" id="callAppBtn">' +
                '                <a href="javascript:void(0)" data-ajax="false">' +
                '                    <div class="app_iphone_text">打开APP</div>' +
                '                </a>' +
                '           </div>';
        }

        $header = $("header");
        if (!$header.size()) {
            $(".content-page").prepend('<header class="al-indexHeader"></header>');
            $header = $("header");
        }
        switch (index) {
            case 1:
                title = "病例";
                href = TempCache.getItem("prevCaseHref");
                break;
            case 2:
                title = "视频";
                break;
            case 5:
                title = "文库";
                break;
            case 6:
                title = "话题";
                href = TempCache.getItem("prevTopicHref");
                break;
            default:
                title = "";
                break;
        }
        $header.html(
            openAppDom + '<figure class="al-indexHeaderItem">' +
            '<a href="javascript:;" data-ajax="false">' +
            '<img src="//img50.allinmd.cn/pages/personal/arrow_back.png" alt="">' +
            '</a>' +
            '</figure>' +
            '<figure class="al-indexHeaderItem">' +
            '<h1>' + title + '</h1>' +
            '</figure>' +
            '<figure class="al-indexHeaderItem">' +
            '<a href="javascript:void(0)">' +
            '</a>' +
            '</figure>'
        );

    }


    /**
     * 保证传入了正确的参数
     * @param key
     */
    function checkParams(key) {
        if (!callAppOptions.hasOwnProperty(key)) {
            throw "打开APP的参数没有传入" + key;
        }
    }


    function init() {
        initHeaderDom();
        $(".al-indexHeaderItem a").on("click", function () {
            if (href) {
                location.href = href;
                if (index == 1) {
                    TempCache.removeItem("prevCaseHref");
                }
                if (index == 6) {
                    TempCache.removeItem("prevTopicHref");
                }
            } else if (document.referrer.lastIndexOf("/passport/") > -1 || document.referrer.indexOf("seminar") > -1 || !document.referrer) {
                g_sps.jump(null, "/");
            } else {
                history.back();
            }
            return false;
        })
    }

    init();
};

/***
 * app唤醒提示
 * @param callAppOptions
 * @param pattern {string}
 *        'btn' 按钮提示
 *        'figure' 横幅提示
 *        'confirm' 弹框提示
 */

comm.appWakeUp = function (pattern, callAppOptions,position) {
    var t = this;
    this.callAppOptions = callAppOptions;
    var template = '    <section class="al-appWakeUpFigure">' +
        '        <figure class="al-appWakeUpImg">' +
        '            <img src="//img50.allinmd.cn/pages/index/logo.png" alt="">' +
        '            <figcaption>' +
        '                <h2>唯医骨科 手术资源免费下载</h2>' +
        '            </figcaption>' +
        '        </figure>' +
        '        <button class="al-appWakeUpFigureBtn ev-openAppBtn" style="margin-top: 0.1rem;">' +
        '            立即打开' +
        '        </button>' +
        '    </section>';
    var bTemplate = '<button class="al-appWakeUpBtn icon-appWakeUp ev-openAppBtn"><span>打开APP</span></button>';
    if (pattern === 'figure') {
        $('body').prepend(template);
        appWakeUpCallback(".ev-openAppBtn");
    } else if (pattern === 'btn') {
        //TODO 新增打开app按钮追加位置
        if(position&&position.dom){
            position.dom.append(bTemplate);
        }else{
            $(".al-indexHeaderItem").filter(':first').append(bTemplate);
        }
        appWakeUpCallback(".ev-openAppBtn");
    } else if (pattern === 'confirm') {

        comm.confirmBox({
            title: '在"唯医应用"中打开链接吗？',
            cancel: '取消',
            ensure: '打开',
            callBack: function () {
                appWakeUpCallback(".al-confirmModalEnsureBtn");
            },
            cancelCallback: function () {
                return false;
            }
        });

        /*$(".al-confirmModal").css({
         width: "30rem",
         marginLeft: "-15rem"
         });

         $(".al-confirmModalContent").css({
         fontSize: "2em"
         })*/
        $(".al-confirmModalCancelBtn").css({
            border: "none",
            borderRight: "1px solid #e4e9ed"
        })
    }else if(pattern === 'diyLayer'){
        comm.confirmBox({
            title: '在"唯医应用"中打开吗？',
            cancel: '取消',
            ensure: '打开',
            callBack: function () {
                appWakeUpCallback(".al-confirmModalEnsureBtn");
            },
            cancelCallback: function () {
                return false;
            }
        });
        $(".al-confirmModalCancelBtn").css({
            border: "none",
            borderRight: "1px solid #e4e9ed"
        })
    }

    function appWakeUpCallback(el) {
        if (typeof t.callAppOptions != "undefined") { // 若存在定义
            var callAppOptions = $.extend(t.callAppOptions, {el: el});
        } else {
            var amChannel = comm.getpara()._amChannel;
            var callAppOptions = {
                el: el,
                ios: "allinmdios://",
                ios9: "http://app.allinmd.cn/applinks.html"+(amChannel?"?_amChannel="+amChannel:''),
                android: "allin://com.allin.social:75235"+(amChannel?"?data={_amChannel:"+amChannel+"}":'')
            }
        }
        comm.bindCallApp(callAppOptions);
    }
};


/***
 * app认证失败提示
 *
 */

comm.authFail = function () {
    var template = '<section class="al-authFailBox">' +
        '<header class="al-authFailTitle">' +
        '<h2>认证拒绝</h2>' +
        '</header>' +
        '<article class="al-authFailText">' +
        '<p>很抱歉！您提交的认证资料不符合要求，为了保证您的权益，请重新认证！</p>' +
        '</article>' +
        '<section class="al-authFailBtn">' +
        '<button class="btn-primary-lg" id="now_goAuth">' +
        '现在认证' +
        '</button>' +
        '<span class="al-authGiveUp">暂不认证</span>' +
        '</section>' +
        '</section>';
    if ($('.al-authFailBox').size() === 0) {
        $("body").append(template);

        setTimeout(function () {

            if (comm.browser.versions.ios) {
                $('.al-authFailBox').addClass('show');
                $(".al-mainInner").addClass('al-fullBlur');
                if ($(".content-page").size() !== 0) {
                    $(".content-page").addClass('al-fullBlur');
                }
            } else {
                $('.al-authFailBox').addClass('al-fullBlurAndroid');
                $(".al-mainInner").addClass('al-fullBlurAndroid');
                if ($(".content-page").size() !== 0) {
                    $(".content-page").addClass('al-fullBlurAndroid');
                }
            }
            if ($(".al-releasePageMask").size() !== 0) {
                $(".al-releasePageMask").removeClass('show');
            }
        }, 200)
    } else {
        if (comm.browser.versions.ios) {
            $('.al-authFailBox').addClass('show');
            $(".al-mainInner").addClass('al-fullBlur');
            if ($(".content-page").size() !== 0) {
                $(".content-page").addClass('al-fullBlur');
            }
        } else {
            $('.al-authFailBox').addClass('al-fullBlurAndroid');
            $(".al-mainInner").addClass('al-fullBlurAndroid');
            if ($(".content-page").size() !== 0) {
                $(".content-page").addClass('al-fullBlurAndroid');
            }
        }
        if ($(".al-releasePageMask").size() !== 0) {
            $(".al-releasePageMask").removeClass('al-fullBlurAndroid');
        }
    }
    Log.createBrowse(142, '认证拒绝提示页');

};
// 滑动式tabs切换
comm.slideTabs = function (fn) {
    var contentNum = parseInt($(".slide-content").size());
    $(".slide-container").width(contentNum * 100 + "%");
    $(".slide-wrapper").attr("data-active-role", $(".al-eBookContentChangeItem.active").attr("data-role"));
    $(".slide-content").css("width", (100 / contentNum) + "%");
    //$(".slide-wrapper").height($(".slide-content[data-role='" + $(".al-eBookContentChangeItem.active").attr('data-role') + "']").height());
    $(".slide-wrapper").css({minHeight:$(".slide-content[data-role='" + $(".al-eBookContentChangeItem.active").attr('data-role') + "']").height()});
    $(".slide-navbarItem").on("click", function () {
        var role = $(this).attr("data-role");
        $(this).addClass('active').siblings().removeClass('active');
        $(".slide-wrapper").css("transform", "translateX(-" + (100 / contentNum) * $(this).index() + "%)");
        $(".slide-wrapper").height($(".slide-content[data-role='" + role + "']").innerHeight());
        fn && fn();
    });
};

comm.checkUrl = function (type, pra) {
    var urlInfoContainer = [
        {"regx": /html\/m\/video\//g, "type": "4", "name": "视频内容页", "urlLink": "https://m.allinmd.cn/html/m/video/"},
        {"regx": /html\/m\/doc\//g, "type": "5", "name": "视频内容页", "urlLink": "https://m.allinmd.cn/html/m/doc/"},
        {
            "regx": /personal_index/g,
            "type": "6",
            "name": "个人主页",
            "urlLink": "https://m.allinmd.cn/pages/personal/personal_index.html"
        },
        {
            "regx": /personal_customerInfo/g,
            "type": "8",
            "name": "个人资料页",
            "urlLink": "https://m.allinmd.cn/pages/personal/personal_customerInfo.html"
        },
        {"regx": /html\/m\/topic\//g, "type": "9", "name": "话题内容页", "urlLink": "https://m.allinmd.cn/html/m/topic/"},
        {"regx": /html\/m\/case\//g, "type": "10", "name": "病例内容页", "urlLink": "https://m.allinmd.cn/html/m/case/"},
        {
            "regx": /details_content/g,
            "type": "12",
            "name": "评论内容页",
            "urlLink": "https://m.allinmd.cn/pages/personal/details_content.html"
        },
        {
            "regx": /video_index/g,
            "type": "17",
            "name": "视频列表页面",
            "urlLink": "https://m.allinmd.cn/pages/video/video_index.html"
        },
        {
            "regx": /doc_index/g,
            "type": "18",
            "name": "文库列表页面",
            "urlLink": "https://m.allinmd.cn/pages/doc/doc_index.html"
        },
        {
            "regx": /topic_index/g,
            "type": "19",
            "name": "话题列表页",
            "urlLink": "https://m.allinmd.cn/pages/topic/topic_index.html"
        },
        {
            "regx": /case_index/g,
            "type": "20",
            "name": "病例列表页面",
            "urlLink": "https://m.allinmd.cn/pages/case/case_index.html"
        },
        {
            "regx": /meeting-place/g,
            "type": "21",
            "name": "年会内容页面",
            "urlLink": "https://m.allinmd.cn/pages/conference/meeting-place.html"
        },
        {
            "regx": /playBackId/g,
            "type": "26",
            "name": "会议回放页面",
            "urlLink": "https://m.allinmd.cn/pages/conference/live-wrap.html"
        },
        {
            "regx": /conference\/live-wrap/g,
            "type": "24",
            "name": "会议直播页面-多会场",
            "urlLink": "https://m.allinmd.cn/pages/conference/live-wrap.html"
        },
        {
            "regx": /live_list/g,
            "type": "25",
            "name": "直播列表页面",
            "urlLink": "https://m.allinmd.cn/pages/conference/live_list.html"
        },
        {
            "regx": /send_email_input/g,
            "type": "29",
            "name": "找回密码页面",
            "urlLink": "https://m.allinmd.cn/mcall/customer/reset/password/send_email_input/"
        },
        {"regx": /html\/m\/theme/g, "type": "79", "name": "专题页面", "urlLink": "https://m.allinmd.cn/html/m/theme/"},
        {
            "regx": /friends_circle/g,
            "type": "36",
            "name": "朋友圈",
            "urlLink": "https://m.allinmd.cn/pages/personal/friends_circle.html"
        },
        {
            "regx": /tag_seminar/g,
            "type": "37",
            "name": "标签专题",
            "urlLink": "https://m.allinmd.cn/pages/discover/tag_seminar.html"
        },
        {
            "regx": /newList.html?dateType=1/g,
            "type": "38",
            "name": "每日最新",
            "urlLink": "https://m.allinmd.cn/pages/list/newList.html?dateType=1"
        },
        {
            "regx": /newList.html?dateType=2/g,
            "type": "39",
            "name": "每周最新",
            "urlLink": "https://m.allinmd.cn/pages/list/newList.html?dateType=2"
        },
        {
            "regx": /hotList.html?groupByFlag=1/g,
            "type": "40",
            "name": "每日最热",
            "urlLink": "https://m.allinmd.cn/pages/list/hotList.html?groupByFlag=1"
        },
        {
            "regx": /hotList.html?groupByFlag=5/g,
            "type": "41",
            "name": "每周最热",
            "urlLink": "https://m.allinmd.cn/pages/list/hotList.html?groupByFlag=5"
        },
        {
            "regx": /meeting_index/g,
            "type": "42",
            "name": "会议列表页",
            "urlLink": "https://m.allinmd.cn/pages/conference/meeting_index.html"
        },
        {
            "regx": /discover_index/g,
            "type": "43",
            "name": "发现首页",
            "urlLink": "https://m.allinmd.cn/pages/discover/discover_index.html"
        },
        {
            "regx": /discover_profession/g,
            "type": "44",
            "name": "按专业",
            "urlLink": "https://m.allinmd.cn/pages/discover/discover_profession.html"
        },
        {
            "regx": /discover_disease/g,
            "type": "45",
            "name": "按疾病",
            "urlLink": "https://m.allinmd.cn/pages/discover/discover_disease.html"
        },
        {
            "regx": /discover_operation/g,
            "type": "46",
            "name": "按术士",
            "urlLink": "https://m.allinmd.cn//pages/discover/discover_operation.html"
        },
        {
            "regx": /discover_searchTag/g,
            "type": "47",
            "name": "按标签",
            "urlLink": "https://m.allinmd.cn/pages/discover/discover_searchTag.html"
        },
        {
            "regx": /discover_type/g,
            "type": "48",
            "name": "按类型",
            "urlLink": "https://m.allinmd.cn/pages/discover/discover_type.html"
        },
        {
            "regx": /discover_seminar/g,
            "type": "49",
            "name": "按专题",
            "urlLink": "https://m.allinmd.cn/pages/discover/discover_seminar.html"
        },
        {
            "regx": /discover_master/g,
            "type": "50",
            "name": "权威专家",
            "urlLink": "https://m.allinmd.cn/pages/discover/discover_master.html"
        },
        {
            "regx": /discover_activition/g,
            "type": "51",
            "name": "热门活动",
            "urlLink": "https://m.allinmd.cn/pages/discover/discover_activition.html"
        },
        {"regx": /activity_details/g, "type": "80", "name": "活动介绍", "urlLink": "https://m.allinmd.cn/html/m/activity/"},
        {"regx": /personal_works/g, "type": "81", "name": "活动资源列表", "urlLink": "https://m.allinmd.cn/html/m/activity/"},
        {
            "regx": /personal_center/g,
            "type": "82",
            "name": "活动-我的作品",
            "urlLink": "https://m.allinmd.cn/html/m/activity/"
        },
        {
            "regx": /html\/m\/activity/g,
            "type": "52",
            "name": "活动内容",
            "urlLink": "https://m.allinmd.cn/html/m/activity/"
        },
        {
            "regx": /message_index/g,
            "type": "53",
            "name": "消息列表",
            "urlLink": "https://m.allinmd.cn/pages/message/message_main.html"
        },
        {
            "regx": /message_follow/g,
            "type": "54",
            "name": "关注提醒",
            "urlLink": "https://m.allinmd.cn/pages/message/message_follow.html"
        },
        {
            "regx": /message_review/g,
            "type": "55",
            "name": "评论我的",
            "urlLink": "https://m.allinmd.cn/pages/message/message_review.html"
        },
        {
            "regx": /message_remind/g,
            "type": "56",
            "name": "提醒我看",
            "urlLink": "https://m.allinmd.cn/pages/message/message_remind.html"
        },
        {
            "regx": /message_praise/g,
            "type": "57",
            "name": "赞了我的",
            "urlLink": "https://m.allinmd.cn/pages/message/message_praise.html"
        },
        {
            "regx": /personal_contribution/g,
            "type": "64",
            "name": "我的贡献",
            "urlLink": "https://m.allinmd.cn/pages/personal/personal_contribution.html"
        },
        {
            "regx": /personal_active/g,
            "type": "65",
            "name": "我的动态",
            "urlLink": "https://m.allinmd.cn/pages/personal/personal_active.html"
        },
        {
            "regx": /others_index/g,
            "type": "66",
            "name": "他的动态",
            "urlLink": "https://m.allinmd.cn/pages/personal/others_index.html"
        },
        {
            "regx": /others_contribution/g,
            "type": "67",
            "name": "他的贡献",
            "urlLink": "https://m.allinmd.cn/pages/personal/others_contribution.html"
        },
        {
            "regx": /others_baseInfo/g,
            "type": "68",
            "name": "他的简介",
            "urlLink": "https://m.allinmd.cn/pages/personal/others_baseInfo.html"
        },
        {
            "regx": /search/g,
            "type": "78",
            "name": "搜索页",
            // "urlLink": "https://m.allinmd.cn/pages/search/search.html"
            "urlLink": "https://m.allinmd.cn/dist/search/search.html"
        },
        {
            "regx": /case_upload/g,
            "type": "83",
            "name": "病例编辑页",
            "urlLink": "https://m.allinmd.cn/pages/case/case_upload.html"
        },
        {
            "regx": /topic_upload/g,
            "type": "84",
            "name": "话题编辑页",
            "urlLink": "https://m.allinmd.cn/pages/topic/topic_upload.html"
        },
        {
            "regx": /personal_draft/g,
            "type": "88",
            "name": "草稿页",
            "urlLink": "https://m.allinmd.cn/pages/personal/personal_draft.html"
        },
        {
            "regx": /personal_collection/g,
            "type": "95",
            "name": "我的收藏",
            "urlLink": "https://m.allinmd.cn/pages/personal/personal_collection.html"
        },
        {
            "regx": /personal_collection/g,
            "type": "96",
            "name": "TA的收藏",
            "urlLink": "https://m.allinmd.cn/pages/personal/personal_collection.html"
        },
        {
            "regx": /personal_myFollow/g,
            "type": "97",
            "name": "关注资源页",
            "urlLink": "https://m.allinmd.cn/pages/personal/personal_myFollow.html"
        },
        {
            "regx": /personal_browsed/g,
            "type": "98",
            "name": "浏览记录页",
            "urlLink": "https://m.allinmd.cn/pages/personal/personal_browsed.html"
        },
        {
            "regx": /personal_myComment/g,
            "type": "99",
            "name": "我的评论",
            "urlLink": "https://m.allinmd.cn/pages/personal/personal_myComment.html"
        },
        {
            "regx": /customerInfoEdit/g,
            "type": "102",
            "name": "简介编辑页",
            "urlLink": "https://m.allinmd.cn/pages/personal/customerInfoEdit.html"
        },
        {
            "regx": /authInfo/g,
            "type": "103",
            "name": "认证信息编辑页",
            "urlLink": "https://m.allinmd.cn/pages/personal/authInfo.html"
        },
        {
            "regx": /setting/g,
            "type": "104",
            "name": "设置页",
            "urlLink": "https://m.allinmd.cn/pages/personal/setting.html"
        },
        {
            "regx": /securityAccount/g,
            "type": "105",
            "name": "帐号安全",
            "urlLink": "https://m.allinmd.cn/pages/personal/securityAccount.html"
        },
        {
            "regx": /bindMobile/g,
            "type": "107",
            "name": "绑定手机",
            "urlLink": "https://m.allinmd.cn/pages/personal/bindMobile.html"
        },
        {
            "regx": /bindEmail/g,
            "type": "108",
            "name": "绑定邮箱",
            "urlLink": "https://m.allinmd.cn/pages/personal/bindEmail.html"
        },
        {
            "regx": /bindCAOS/g,
            "type": "109",
            "name": "绑定COAS",
            "urlLink": "https://m.allinmd.cn/pages/personal/bindCAOS.html"
        },
        {
            "regx": /updatePassword/g,
            "type": "110",
            "name": "密码修改",
            "urlLink": "https://m.allinmd.cn/pages/personal/updatePassword.html"
        },
        {
            "regx": /discover_sendMsg/g,
            "type": "112",
            "name": "专题反馈页",
            "urlLink": "https://m.allinmd.cn/pages/discover/discover_sendMsg.html"
        },
        {
            "regx": /feedBack/g,
            "type": "113",
            "name": "意见反馈页",
            "urlLink": "https://m.allinmd.cn/pages/personal/feedBack.html"
        },
        {
            "regx": /discover_addMaster/g,
            "type": "114",
            "name": "权威专家申请",
            "urlLink": "https://m.allinmd.cn/pages/discover/discover_addMaster.html"
        },
        {
            "regx": /friends_recommend/g,
            "type": "123",
            "name": "推荐医师",
            "urlLink": "https://m.allinmd.cn/pages/personal/friends_recommend.html"
        },
        {
            "regx": /sns.html?action=fans/g,
            "type": "124",
            "name": "我的-粉丝列表",
            "urlLink": "https://m.allinmd.cn/pages/personal/sns.html?action=fans"
        },
        {
            "regx": /others_sns.html?action=fans/g,
            "type": "125",
            "name": "TA的粉丝列表",
            "urlLink": "https://m.allinmd.cn/pages/personal/others_sns.html?action=fans"
        },
        {
            "regx": /sns.html?action=follow/g,
            "type": "126",
            "name": "关注医师列表",
            "urlLink": "https://m.allinmd.cn/pages/personal/sns.html?action=follow"
        },
        {
            "regx": /sns.html?action=praise/g,
            "type": "127",
            "name": "点赞列表",
            "urlLink": "https://m.allinmd.cn/pages/personal/sns.html?action=praise"
        },
        {
            "regx": /tag_followerList/g,
            "type": "130",
            "name": "关注此标签的人",
            "urlLink": "https://m.allinmd.cn/pages/discover/tag_followerList.html"
        },
        {
            "regx": /education/g,
            "type": "133",
            "name": "教育背景页",
            "urlLink": "https://m.allinmd.cn/pages/personal/education.html"
        },
        {
            "regx": /cEducation/g,
            "type": "135",
            "name": "继续教育页",
            "urlLink": "https://m.allinmd.cn/pages/personal/cEducation.html"
        },
        {"regx": /honor/g, "type": "136", "name": "获得荣誉页", "urlLink": "https://m.allinmd.cn/pages/personal/honor.html"},
        {"regx": /fund/g, "type": "137", "name": "科研基金页", "urlLink": "https://m.allinmd.cn/pages/personal/fund.html"},
        {
            "regx": /social/g,
            "type": "138",
            "name": "社会任职页",
            "urlLink": "https://m.allinmd.cn/pages/personal/social.html"
        },
        {"regx": /opus/g, "type": "139", "name": "学术专著页", "urlLink": "https://m.allinmd.cn/pages/personal/opus.html"},
        {
            "regx": /patent/g,
            "type": "140",
            "name": "发明专利页",
            "urlLink": "https://m.allinmd.cn/pages/personal/patent.html"
        },
        {"regx": /about/g, "type": "147", "name": "关于我们", "urlLink": "https://m.allinmd.cn/pages/personal/about.html"},
        {
            "regx": /login_caos/g,
            "type": "148",
            "name": "联合登录-caos登录",
            "urlLink": "https://m.allinmd.cn/pages/passport/login_caos.html"
        },
        {
            "regx": /living_watch/g,
            "type": "151",
            "name": "UGC直播终端-直播中",
            "urlLink": "https://m.allinmd.cn/pages/live/living_watch.html"
        },
        {
            "regx": /livingList/g,
            "type": "156",
            "name": "UGC直播-直播列表",
            "urlLink": "https://m.allinmd.cn/pages/live/live.html"
        },
        {
            "regx": /livingOrder/g,
            "type": "157",
            "name": "UGC直播-我的预约",
            "urlLink": "https://m.allinmd.cn/pages/live/livingOrder.html"
        },
        {
            "regx": /eBook_details/g,
            "type": "159",
            "name": "书籍主页",
            "urlLink": "https://m.allinmd.cn/pages/eBook/eBook_details.html"
        },
        {
            "regx": /eBook_transformerList/g,
            "type": "163",
            "name": "译者列表页",
            "urlLink": "https://m.allinmd.cn/pages/eBook/eBook_transformerList.html"
        },
        {
            "regx": /eBook_chapter/g,
            "type": "164",
            "name": "章节列表页",
            "urlLink": "https://m.allinmd.cn/pages/eBook/eBook_chapter.html"
        },
        {
            "regx": /scoreDetails/g,
            "type": "167",
            "name": "评分详情界面",
            "urlLink": "https://m.allinmd.cn/pages/scoringSystem/scoreDetails.html"
        },
        {
            "regx": /productListPage/g,
            "type": "74",
            "name": "相关产品",
            "urlLink": "https://m.allinmd.cn/pages/scoringSystem/productListPage.html"
        },
        {
            "regx": /discover_series_course/g,
            "type": "199",
            "name": "体系化课程页",
            "urlLink": "https://m.allinmd.cn/pages/discover/series/feedback.html"
        },
        {
            "regx": /discover_series_details/g,
            "type": "200",
            "name": "体系化课程资源页",
            "urlLink": "https://m.allinmd.cn/pages/discover/series/discover_series_details.html"
        },
        {
            "regx": /meeting_fellow/g,
            "type": "211",
            "name": "我关注的会议",
            "urlLink": "https://m.allinmd.cn/pages/channel/conference/meeting_follow.html"
        },
        {
            "regx": /meeting_trailer/g,
            "type": "212",
            "name": "会议预告",
            "urlLink": "https://m.allinmd.cn/pages/channel/conference/meeting_trailer.html"
        },
        {
            "regx": /meeting_detail/g,
            "type": "94",
            "name": "会议终端页",
            "urlLink": "https://m.allinmd.cn/pages/conference/meeting_detail.html"
        },
        {
            "regx":/auth\/auth.html/g,
            "type":"10001",
            "name":"认证-基本信息",
            "urlLink":"https://m.allinmd.cn/pages/passport/auth/auth.html"
        },
        {
            "regx":/auth\/auth.html.*#secondStep/g,
            "type":"10014",
            "name":"认证-证件信息",
            "urlLink":"https://m.allinmd.cn/pages/passport/auth/auth.html"
        },
        {
            "regx":/auth\/authInfo.html/g,
            "type":"10025",
            "name":"个人中心-其他个人信息-个人中心-证件信息",
            "urlLink":"https://m.allinmd.cn/pages/passport/auth/authInfo.html"
        },
        {
            "regx":/nationalDayActivity/g,
            "type":"216",
            "name":"2017十一国庆活动页",
            "urlLink":"https://m.allinmd.cn/pages/column/nationalDayActivity.html"
        },
        {
            "regx":/discover_feature_column/g,
            "type":"217",
            "name":"特色栏目",
            "urlLink":"https://m.allinmd.cn/pages/discover/discover_feature_column.html"
        },
        {
            "regx":/discover_feature_detail/g,
            "type":"218",
            "name":"特色栏目详情页",
            "urlLink":"https://m.allinmd.cn/pages/discover/discover_feature_detail.html"
        },
        {
            "regx":/eBook_list/g,
            "type":"220",
            "name":"电子书列表页",
            "urlLink":"https://m.allinmd.cn/pages/eBook/eBook_list.html"
        }

    ];
    var urlOnOff = true;
    var regx = /^(https|http):\/\/m.allinmd.cn\/$/;
    if (type == "type") {
        for (var uNum = 0; uNum < urlInfoContainer.length; uNum++) {
            if (urlInfoContainer[uNum].regx.test(pra)) {
                urlOnOff = false;
                return urlInfoContainer[uNum].type;
            }
        }
        if (urlOnOff) {
            if (regx.test(pra)) {

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
                return "https://m.allinmd.cn";
            }
        }
    }


};
//创建事件埋点
comm.creatEvent = function (opt) {
    var browTypeUrl;
    if (opt.browTypeUrl) {
        browTypeUrl = opt.browTypeUrl;
    } else {
        browTypeUrl = window.location.href.substr(0, 250);
    }
    var opDescs = [
        "消息推送的点击", "相关产品", "骨科&手外科切换(切换按钮点击)", "骨科&手外科切换(骨科按钮点击)", "关注--医生",
        "关注--话题", "关注--病例", "关注--标签", "搜索-首页", "搜索-发现",
        "专页搜索", "搜索-局部(PC)", "下载按钮", "下载功能按钮", "广告位-轮播图",
        "广告位-启动页", "登录按钮", "去登录按钮(个人中心)", "视频弹出去登录按钮", "微信登录",
        "CAOS登录", "CAOS授权登录(立即登录)", "注册-创建帐号", "去认证", "认证-视频弹窗确定",
        "现在认证", "暂不认证", "认证-骨科", "认证-手外", "认证-下一步",
        "认证-提交", "评分功能", "发布", "发布-病例", "补充病例",
        "发布-话题", "发布-直播", "发布-草稿", "发布-视频(PC)", "浏览记录",
        "分享", "返回", "跳过", "关闭", "下一步", "取消",
        "智能排序", "最新发布", "最多浏览", "最多评论", "按专业-筛选",
        "全部类型 -全部", "全部类型 - 病例", "全部类型 - 视频", "全部类型 - 文库", "全部类型 - 话题",
        "相关性", "最新", "最热", "发布-文库(PC)", "热门搜索",
        "历史搜索", "运营手动插入广告位", "动态入口"


    ];
    var latitude = "";//经度
    var longitude = "";//维度
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
            navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {
                // 指示浏览器获取高精度的位置，默认为false
                enableHighAccuracy: true,
                // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
                timeout: 5000,
                // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
                maximumAge: 3000
            });
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

    var browType = opt.browType ? opt.browType : comm.checkUrl("type", window.location.href);//当前页类型
    var browTypeSource = opt.browTypeSource ? opt.browTypeSource : comm.checkUrl("type", document.referrer);//来源页类型
    var browTypeSourceUrl = opt.browTypeSourceUrl ? opt.browTypeSourceUrl : document.referrer;//来源页url
    if (!(comm.date && comm.date.local_time)) {
        comm.date = {};
        comm.date.local_time = function () {
            var local = new Date();
            var year = local.getFullYear();
            var month = local.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }
            var day = local.getDate();
            if (day < 10) {
                day = "0" + day;
            }
            var time = local.toTimeString().substr(0, 8);
            var local_time = year + "-" + month + "-" + day + " " + time;
            return local_time;
        }
    }
    var param = {
        siteId: 2,//站点Id
        opSource: "web",//站点 端口
        createTime: comm.date.local_time(),
        appVersion:window.version,
        osVersion: getOS(),// 系统型号
        tVersion: comm.isWeiXin()?navigator.appCodeName + " " + navigator.appVersion + "_isWeiXin":navigator.appCodeName + " " + navigator.appVersion,   // 浏览器版本
        latitude: latitude,//经度
        longitude: longitude,//维度
        timeZone: "GMT " + getTimeZone(),//时区

        customerId: TempCache.getItem('userId')!=null?TempCache.getItem('userId'):'',//会员Id
        opUsr: TempCache.getItem('userId')!=null?TempCache.getItem('userId'):'',//会员Id
        // param:,//banner的链接
        locationId:(opt.locationId&&opt.locationId!=null&&opt.locationId!='null')?opt.locationId:0,//区块Id
        pushMessageId:(opt.pushMessageId&&opt.pushMessageId!=null&&opt.pushMessageId!='null')?opt.pushMessageId:0,//事件对于对象的ID 如：关注人时记录被关注人ID
        //adId:opt.adId,//广告位Id,
        //adPosition:opt.adPosition,//广告图片位置
        triggerType: opt.triggerType,//事件类型
        triggerName: opt.triggerName ? opt.triggerName : opDescs[opt.actionId],//事件名称
        keyword: opt.keyword,//关键词
        actionId: opt.actionId,//事件Id
        browseType: browType,//当前页面类型
        browseTypeUrl: browTypeUrl,//当前页面url
        browseTypeSource: browTypeSource,//来源页面类型
        browseTypeSourceUrl: browTypeSourceUrl,//来源页面URL
        refId: (opt.refId&&opt.refId!=null&&opt.refId!='null')?opt.refId:0,//资源ID
        refType: (opt.refType&opt.refType!=null&&opt.refType!='null')?opt.refType:0,//资源Type
        location_id:(opt.location_id&opt.location_id!=null&&opt.location_id!='null')?opt.location_id:0,            //发现页排序
        browsetype_url:(opt.browsetype_url&opt.browsetype_url!=null&&opt.browsetype_url!='null')?opt.browsetype_url:0,      //发现栏目ID、类型
        push_message_id:(opt.push_message_id&&opt.push_message_id!=null&&opt.push_message_id!='null')?opt.push_message_id:0     //发现页点击标签ID
    };
    opt.userRoleType? param.param={"userRoleType":opt.userRoleType}:"";//认证区分角色
    opt.param? param.param={"bannerUrl":opt.param}:"";//banner的链接

    if(typeof g_sps!="undefined"){
        param = $.extend(param,{
            sessionId:g_sps&&g_sps._$&&g_sps._$.sessionId?g_sps._$.sessionId + "_" + g_sps._$.sessionIndex:'',
            openedCount: g_sps&&g_sps._$&&g_sps._$.openedCount?g_sps._$.openedCount:''
        })
    }
    $.ajax({
        type: 'POST',
        url: M_CALL + "log/track/batchCreate/",
        data: {paramJson: $.toJSON(param)},
        dataType: "json",
        async: opt.async ? opt.async : true,
        success: function (rep) {
        },
        error: function () {
        }
    });
};
//新版登录错误 顶部提示
comm.topShowPageError = function (str, fn) {
    var topErrorDom = '<section class="topShowError"><i></i>' + str + '</section>';
    if ($('.topShowError').length == 0) {
        $('.alLogin').append(topErrorDom);
    } else {
        $('.topShowError').remove();
        $('.alLogin').append(topErrorDom);
    }
    fn && fn();
    //setTimeout(function(){
    //    $('.topShowError').remove();
    //},3000);
};
//最新版登录错误 顶部提示，zhanghonda
comm.topShowPageErrorNew = function (str, fn) {
    var topErrorDom = '<section class="topShowError"><i></i>' + str + '</section>';
    if ($('.topShowError').length == 0) {
        $('.al-login').append(topErrorDom);
    } else {
        $('.topShowError').remove();
        $('.al-login').append(topErrorDom);
    }
    fn && fn();
    // $('body').off("click").on('click',function (e) {
    //     e.stopPropagation();
    //     $(".topShowError").hide();
    // });
    setTimeout(function(){
        $('.topShowError').remove();
    },2000);
};
//认证四期异常流程登录错误 顶部提示，zhanghonda
comm.topShowPageErrorNewAuth = function (str, fn) {
    var topErrorDom = '<section class="topShowError"><i></i>' + str + '</section>';
    if ($('.topShowError').length == 0) {
        $('.al-mainInner').append(topErrorDom);
    } else {
        $('.topShowError').remove();
        $('.al-mainInner').append(topErrorDom);
    }
    fn && fn();
    setTimeout(function(){
        $('.topShowError').remove();
    },2000);
};

comm.hasResponseData = function (r) {
    if (r && r.responseObject && r.responseObject.responseData && !$.isEmptyObject(r.responseObject.responseData)) {
        return true;
    }
    return false;
};

comm.hasResponseMessage = function (r) {
    if (r && r.responseObject && r.responseObject.responseMessage && !$.isEmptyObject(r.responseObject.responseMessage)) {
        return true;
    }
    return false;
};
comm.isLiveState = function () {
    setTimeout(function(){
        $.ajax({
            type: "post",
            url: M_CALL + "conference/index/getMapListV4/",
            data: {
                paramJson: $.toJSON({
                    scene: 0,//场景（0-会议频道页，1-我关注的会议，2-会议预告）
                    platformId: TempCache.getItem('department') || 1,
                    pageIndex:1,
                    pageSize:0
                })
            },
            dataType: "json",
            success: function (rep) {
                var _kv = $("nav.al-indexNavbar ul li span").eq(3);
                if (rep && rep.responseObject && rep.responseObject.responseData &&!$.isEmptyObject(rep.responseObject.responseData)) {
                    var res = rep.responseObject.responseData;
                    if (res.liveState == 1) {//有直播的会议
                        if (!_kv.find("i").length) {
                            _kv.append("<i></i>");
                        }
                    } else {
                        if (_kv.find("i").length) {
                            _kv.remove("<i></i>");
                        }
                    }
                } else {//默认没有列表的时候
                    if (_kv.find("i").length) {
                        _kv.remove("<i></i>");
                    }
                }
            },
            error: function () {
            }
        });
    },1500);
};
comm.layerBottomFixed = function(obj){
    var scrollTop = $(window).scrollTop();
    if(obj&&obj.layerDom&&obj.layerDom.is(':visible')){
        $('html').attr('sT',scrollTop).css('marginTop',-scrollTop);
        $('html,body').css({'height':$(window).height()+scrollTop,overflow:'hidden'});
    }
    obj&&obj.closeBtn&&obj.closeBtn.off('click').click(function(){
        if(obj.isclose){
            obj.layerDom.remove();
        }
        $('html').css('marginTop','');
        $('html,body').css({'height':"",overflow:''});
        $(window).scrollTop($('html').attr('sT'));
        $('html').removeAttr('sT');
    });
};
comm.skeleton = {
    remove:function(){
        $(".al-skeleton-container").remove();
    }
};
comm.loginApp = function() {
    var _this = this;
    if (!(typeof appjs == "undefined" || appjs == null || appjs == "")) {
        var customerId = appjs && appjs.getAuthorCustomerId() ? appjs.getAuthorCustomerId() + '' : '';
        if (customerId) {
            //如果app端存在customerId,那就使用接口在app端进行登录
            comm.syncAjax({
                url: '/mcall/customer/invitation/loginByCustomerId/',
                method: "POST",
                paramJson: true,
                data: {
                    customerId: customerId
                },
                success: function (res) {
                    if (res.data.responseObject.responseStatus) {
                        //接口登录成功
                        TempCache.setItem('userId', customerId);
                        var url = '/mcall/customer/unite/getMapById/';
                        var Data = {
                            "customerId": customerId,
                            "logoUseFlag": 4,
                            "isCustomer": 1,
                            "vFlag": 3
                        };
                        _this.syncAjax({
                                url: url,
                                method: "POST",
                                paramJson: true,
                                data: Data,
                                success: function (res) {

                                    var dataList = res.data.responseObject.responseData && res.data.responseObject.responseData.data_list && res.data.responseObject.responseData.data_list[0];
                                    if (dataList) {
                                        var customerAuth = dataList.customer_auth;
                                        TempCache.setItem("trueName", customerAuth.lastName + customerAuth.firstName);
                                        TempCache.setItem("customerRole", dataList.customer_unite.customerRole);
                                        TempCache.setItem("auth", customerAuth);
                                    }
                                }
                            }
                        );
                    } else {
                        //接口登录失败
                    }
                }
            })
        } else {
            //如果app端不存在customerid,那么如果用户需要登录app端就登录/认证，不需要就不登录/不认证
            //alert('退出登录');
            $.ajax({
                url: "/mcall/web/user/logout/",
                data: null,
                dataType: 'json',
                type: 'post',
                async: false,
                success: function () {
                    TempCache.clear();
                }
            });
            //alert('清楚缓存');
            //TempCache.clear();

            /*}*/
        }
    }
}
//alert(Date.parse(new Date()));
comm.syncAjax = function(options){
    var data = {};
    if(options.paramJson){
        data = {paramJson: JSON.stringify(options.data)}
    }else{
        data = options.data;
    }
    //alert(options.url);
    $.ajax({
        type: options.method?options.method:"POST",
        url: options.url,
        data:data,
        dataType: 'json',
        async:false,  //同步方式
        success: function(res){
            var responseData = {
                data:res
            };
            options.success&&options.success(responseData);
        }
    });

};
comm.isApp = function() {
    if (!(typeof appjs == "undefined" || appjs == null || appjs == "")) {
        return  true;
    } else {
        return  false;
    }
};
comm.callAppLogin = function(){
    //唤醒app的登录
    window.appLoginCallBack = function(){
        //唤醒app登录的回调
        comm.loginApp();
    };
    if(comm.isApp()){
        appjs&&appjs.joinAuthority(JSON.stringify(
            {
                callback:"appLoginCallBack",//函数名字,
                operateId:'908',//1002
            }
        ));
    }
};
comm.callAppAuth = function(){
    //唤醒app的登录
    window.appAuthCallBack = function(){
        //唤醒app认证的回调
        comm.loginApp();
    };
    if(comm.isApp()){
        appjs&&appjs.joinAuthority(JSON.stringify(
            {
                callback:"appAuthCallBack",//函数名字,
                operateId:'1002',//1002
            }
        ));
    }
};
/*微信环境下强制登录的公共方法*/
comm.getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};
comm.checkInvalid = function (val) {
    if (((typeof val == 'string') && (val.length == 0)) || (val == undefined) || (val == 'undefined') || (val == 'null') || (typeof val == 'undefined') || (typeof val == 'null') || (val == null)) {
        return true;
    } else {
        return false;
    }
};
comm.weChatPay = function(options){
    if(comm.isWeiXin()){
        return false;
    }else{
        var _this = this;
        var paramJson = {
            "appId":"wx8d4a2df6fdc13658",     //公众号名称，由商户传入
            "timeStamp":options.data.timeStamp+"",         //时间戳，自1970年以来的秒数
            "nonceStr":options.data.nonceStr, //随机串
            "package":"prepay_id="+options.data.prepayId,
            "signType":"MD5",         //微信签名方式：
            "paySign":options.data.sign //微信签名
        };
        //alert(JSON.stringify(paramJson));
        var payFun = ()=>{
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', paramJson,
                function(res){
                    //alert(res.err_msg);
                    if(res.err_msg == "get_brand_wcpay_request:ok" ){
                        // 使用以上方式判断前端返回,微信团队郑重提示：
                        options.successCallBack&&options.successCallBack();

                    }else if(res.err_msg == 'get_brand_wcpay_request:cancel'){
                        options.cancelCallBack&&options.cancelCallBack();

                    }else if(res.err_msg =='get_brand_wcpay_request:fail'){
                        options.faileCallback&&options.faileCallback();
                    }
                });
        };

        if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
                document.addEventListener('WeixinJSBridgeReady', function(){
                     payFun();
                }, false);
            }else if (document.attachEvent){
                document.attachEvent('WeixinJSBridgeReady', function(){
                    payFun();
                });
                document.attachEvent('onWeixinJSBridgeReady', function(){
                    payFun();
                });
            }
        }else{
            //onBridgeReady();
            payFun();
        }
    }
};
comm.loginInit = function () {
    var webdomain = '//' + location.host;
    var appId = 'wx8d4a2df6fdc13658';
    var searchParam = '';
    var searchUrlOnOff = comm.checkInvalid(location.search);
    var loginOnOff = false;
    if (searchUrlOnOff) {
        loginOnOff = true;
        searchParam = "?redirectNum=1";
    } else {
        var redirectNum = comm.getQueryString('redirectNum');
        var loginNumRight = !comm.checkInvalid(redirectNum);
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
};
/*微信环境下强制登录的公共方法*/
/**最初是发现在视频终端，微信中，如果用户登录过，回出现session丢失的情况，导致登录界面仍然显示，使用该方法静默登录，重复确认用户在微信状态下是否登陆过，如果登陆过，存储session微信端确认登陆过后自动登录,张恒2019.5.28，16：05**/
/*if(comm.isWeiXin()){
    storeSession.loginInit();
}*/
//alert("开始执行");
if(comm.isApp()){
    comm.loginApp();
    //检查是否存在唤醒app的顶部按钮
}
comm.callAppIndex = function(){
    //3.10需求，唤醒唯医app首页整站添加顶部唤醒app的按钮，20190241101，张恒
    if(!comm.isApp()){
        var linkUrl = window.location.href;
        if(!((/\/html\/m\/video/g).test(linkUrl)||(/https:\/\/m.allinmd.cn\//g).test(linkUrl))){
            //除了视频终端页的其他页面唤醒逻辑需要单独处理
            var callAppOptions = {
                el: ".solidBtn",
                ios: "allinmdios://app.allinmd.cn/applinks.html",
                android: "allin://com.allin.social:75235?data={}",
                ios9: "http://app.allinmd.cn/applinks.html",
                runAtOnce: false
            };
            comm.appWakeUp("figure", callAppOptions);//唤醒app弹层
        }
    }
};
comm.checkVipRight = function(options){
    $.ajax({
        url: '/static/json/rightInterestsJson.json',
        type: "get",//请求方式为get
        dataType: "json", //返回数据格式为json
        success: function (data) {
            if(data && data.dataList){
                var resultstr = '<section class="rightInterestsTip" style="z-index: 4">\n' +
                    '        <!--弹层样式-->\n' +
                    '        <section class="rightInterestsCont">\n' +
                    '            <i>权益详解</i>\n' +
                    '            <article class="rigthDesc">\n' +
                    '                <ul>\n' +
                    '                </ul>\n' +
                    '            </article>\n' +
                    '        </section>\n' +
                    '        <span class="tipCloseBtn"></span>\n' +
                    '    </section>';
                var domElement = $(resultstr);
                var htmlStr = '';
                for (var outNum  = 0;outNum<data.dataList.length;outNum++){
                    console.log(data.dataList[outNum].rightName+"+++"+options.rightName);
                    if(data.dataList[outNum].rightName == options.rightName){
                        var dataList = data.dataList[outNum].rightList;
                        for(var num = 0;num<dataList.length;num++){
                            var item = dataList[num];
                            console.log(item);
                            htmlStr+='<li>\n' +
                                '                        <span>'+item.title+'</span>\n' +
                                '                        <p>'+item.desc+'</p>\n' +
                                '                    </li>\n';
                        }

                    }
                }

                domElement.find(".rigthDesc ul").html(htmlStr);
                $(".rightInterestsTip").remove();
                $("body").append(domElement);
                $(".tipCloseBtn").off("click").on("click",function(){
                    options.closeBack&&options.closeBack();
                    $(".rightInterestsTip").remove();
                });
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('失败')
        }
    })
};
comm.buySuccessDialog = function(options){
    console.log({
        productType: options.productType,
        customerId: localStorage.getItem('userId')?localStorage.getItem('userId'):"",
        productId: options.productId
    });
    var param = {
        productType: options.productType,
        customerId: localStorage.getItem('userId')?localStorage.getItem('userId'):"",
        productId: options.productId
    };
    $.ajax({
        url: '/allingateway/base-resource-platform/customer/purchase/getProductCustomerResult/',
        type: "GET",
        dataType: "json",
        data: param,
        success: function (data) {
            var popupConfig = data.responseData;
            var htmlStr = '<section class="popups-container">\n' +
                '        <div class="popups-content">\n' +
                '            <span :style="{ background: headerImg }" class="popups-header-img"></span>\n' +
                '            <span class="popups-header-bg"></span>\n' +
                '            <div class="popups-item-title">\n' +
                '                <p>恭喜您成为'+popupConfig.departmentName+'的会员</p>\n' +
                '                <p>学号：'+popupConfig.studentNum+'</p>\n' +
                '            </div>\n' +
                '            <div class="popups-item-tip">\n' +
                '                <p>您可观看'+popupConfig.departmentName+'内所有课程视频内容</p>\n' +
                '            </div>\n' +
                '            <div class="popups-item-page ev-payOpenApp">\n' +
                '                <button>\n' +
                '                    打开APP，访问'+popupConfig.departmentName+'主页<i></i>\n' +
                '                </button>\n' +
                '            </div>\n' +
                '            <div class="popups-item-time">会员有效期至'+popupConfig.expireDate+'</div>\n' +
                '            <span class="popups-close"></span>\n' +
                '        </div>\n' +
                '    </section>';
            $(".popups-container").remove();
            $("body").append(htmlStr);
            $(".popups-close").off("click").on("click",function(){
                options.closeBack&&options.closeBack();
                $(".popups-container").remove();
            });
            $('.ev-payOpenApp').on('click',function () {
                var amChannel = comm.getpara()._amChannel;
                var callAppData = {
                    el: ".ev-payOpenApp",
                    ios: "allinmdios://app.allinmd.cn/applinks.html?scene=3&type=109&sourceId=" +popupConfig.departmentId+(amChannel?"&_amChannel="+amChannel:''),
                    ios9: "http://app.allinmd.cn/applinks.html?scene=3&type=109&sourceId=" +popupConfig.departmentId+(amChannel?"&_amChannel="+amChannel:''),
                    android: "allin://com.allin.social:75235?data={scene:3,type:109,sourceId:"+popupConfig.departmentId + (amChannel?",_amChannel:"+amChannel:'')+ "}"
                };
                comm.bindCallApp(callAppData);
            })
        }
    });
};
