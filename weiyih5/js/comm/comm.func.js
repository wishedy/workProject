1   /**
 * 功能描述：  方法集
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by lichunhui on 2016/07/19.
 */
function popup(s) {
    if ($(".ev-commTips").length == 0) {

        $("body").append('<section class="al-middleTipsBox"><section class="al-middleTipsModal ev-commTips"><figure class="al-middleTipsModalText"><p class="tipText">' + s + '</p> </figure></section></section>');

        setTimeout(function() {
            $(".ev-commTips").addClass('show')
        }, 100);
    } else {
        $(".ev-commTips").addClass('show');
        $(".tipText").html(s);
    }
    setTimeout(function() {
        $(".ev-commTips").removeClass('show');
    }, 3000)
}

function popupFn(s,time,fn){
    if ($(".ev-commTips").length == 0) {

        $("body").append('<section class="al-middleTipsBox"><section class="al-middleTipsModal ev-commTips"><figure class="al-middleTipsModalText"><p class="tipText">' + s + '</p> </figure></section></section>');

        setTimeout(function() {
            $(".ev-commTips").addClass('show')
        }, 100);
    } else {
        $(".ev-commTips").addClass('show');
        $(".tipText").html(s);
    }
    setTimeout(function() {
        $(".ev-commTips").removeClass('show');
        fn&&fn();
    }, time?time:3000);
}
function sendError(text) {
    var text = text || '当前网络环境不佳，请重新发送';
    if ($('.EV-sendErrorTips').length === 0) {

        $(".al-indexHeader").append('<section class="al-sendFailTips EV-sendErrorTips"><p>' + text + '</p></section>');

        setTimeout(function() {
            $('.EV-sendErrorTips').addClass('show');
        }, 100)


    } else {
        $('.EV-sendErrorTips').addClass('show');
        $(".EV-sendErrorTips").text(text);
    }

    setTimeout(function() {
        $('.EV-sendErrorTips').removeClass('show');
    }, 3000);
}

function popupAutoDisappear(content, time) {
    if ($("#popupBasic2").length == 0) {
        $("body").append('<div data-role="popup" id="popupBasic2" data-dismissible="false">' +
            '                    <p></p>' +
            '            </div>');//.enhanceWithin()
    }

    $("#popupBasic2 p").text(content);

    $("#popupBasic2").popup("open", {
        overlayTheme: "b"
    });

    setTimeout(function() {
        $("#popupBasic2").popup("close");
    }, time);
}

//等比率缩放图片大小
function changeSize(nodeImg, width, height) {
    var oWH = fgetRealWH(width, height, nodeImg.width, nodeImg.height);
    $(nodeImg).animate({
        width: oWH.width,
        height: oWH.height
    });
}


//获取等比率缩放后的宽度和高度值
function fgetRealWH(baseWidth, baseHeight, realWidth, realHeight) {
    if (!realWidth || !realHeight) {
        return {
            width: baseWidth,
            height: baseHeight
        }
    }
    var rate1 = baseWidth / realWidth;
    var rate2 = baseHeight / realHeight;
    var width, height;
    rate1 = (rate1 < rate2 ? rate1 : rate2);
    width = Math.ceil(realWidth * rate1);
    height = Math.ceil(realHeight * rate1);
    return {
        width: width,
        height: height
    };
};

function getpara(symbol) { //获取参数的函数
    // var url = document.URL;
    // var param = {};
    // var str, item;
    // if (url.lastIndexOf(symbol ? symbol : "?") > 0) {
    //     str = url.substring(url.lastIndexOf(symbol ? symbol : "?") + 1, url.length);
    //     var arr = str.split("&");
    //     for (var i = 0; i < arr.length; i++) {
    //         item =  arr[i].split("=");
    //         param[item[0]] = decodeURI(item[1]);
    //     }
    // }
    // return param;
	var param ={};
	var search = location.search.split('?')[1];
	var hash = location.hash;
	if(search){
		search = search.split('&');
		for(var i=0;i<search.length;i++){
			item = search[i].split('=');
			if(item[1]){
				param[item[0]] = decodeURIComponent(item[1].split('#/')[0]);
			}
		}
	}
	if(hash){
		var newarr = hash.split('?');
		for(var i=0;i<newarr.length;i++){
			var ii = newarr[i].split('&');
			for(var j=0;j<ii.length;j++){
				var item = ii[j].split('=');
				if(item[1]){
					param[item[0]] = decodeURIComponent(item[1].split('#/')[0]);
				}
			}

		}
	}
	return param;
};

function popupClose() {
    $("#popupBasic2").popup("close");
}

function checkAccountType(account) {
    var type = "";
    if (/^1\d{10}$/.test(account)) {
        type = "mobile";
    }
    if (/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(account)) {
        type = "email";
    }
    return type;
}


function twoStar(email) {
    var str = "";
    var arr = email.split("@");
    str = arr[0].substr(0, 1) + "**" + arr[0].substr(arr[0].length - 1, 1) + "@" + arr[1];
    return str;
}

function DrawImage(ImgD, iwidth, iheight) {
    //参数(图片,允许的宽度,允许的高度)
    var image = new Image();
    image.src = ImgD.src;
    if (image.width > 0 && image.height > 0) {
        if (image.width / image.height >= iwidth / iheight) {
            if (image.width > iwidth) {
                ImgD.width = iwidth;
                ImgD.height = (image.height * iwidth) / image.width;
            } else {
                ImgD.width = image.width;
                ImgD.height = image.height;
            }
        } else {
            if (image.height > iheight) {
                ImgD.height = iheight;
                ImgD.width = (image.width * iheight) / image.height;
            } else {
                ImgD.width = image.width;
                ImgD.height = image.height;
            }
        }
    }
}

function DrawImageLarge(ImgD, iwidth, iheight) {
    //参数(图片,允许的宽度,允许的高度)
    var image = new Image();
    image.src = ImgD.src;
    if (image.width > 0 && image.height > 0) {
        if (image.width / image.height >= iwidth / iheight) {

            ImgD.width = iwidth;
            ImgD.height = (image.height * iwidth) / image.width;

        } else {
            ImgD.height = iheight;
            ImgD.width = (image.width * iheight) / image.height;

        }
    }
}

function reDrawImg(ImgD, rate) {
    var image = new Image();
    image.src = ImgD.src;
    if (image.width > 0 && image.height > 0) {
        if (image.width / image.height >= iwidth / iheight) {
            if (image.width > iwidth) {
                ImgD.width = iwidth;
                ImgD.height = (image.height * iwidth) / image.width;
            } else {
                ImgD.width = image.width;
                ImgD.height = image.height;
            }
        } else {
            if (image.height > iheight) {
                ImgD.height = iheight;
                ImgD.width = (image.width * iheight) / image.height;
            } else {
                ImgD.width = image.width;
                ImgD.height = image.height;
            }
        }
    }
}
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

String.prototype.toInt = function() {
    return parseInt(this);
};
String.prototype.toK = function() {
    if (parseInt(this) > 999) {
        return Math.floor(parseInt(this) / 1000) + "K+";
    } else {
        return this;
    }
};
Number.prototype.toK = function() {
    if (parseInt(this) > 999) {
        return Math.floor(parseInt(this) / 1000) + "K+";
    } else {
        return this;
    }
};
String.prototype.toW = function() {
    if (parseInt(this) > 9999) {
        var num = parseInt(this) / 10000;
        return Math.round(num * 10) / 10 + "万+";
    } else {
        return this;
    }
};
Number.prototype.toW = function() {
    if (parseInt(this) > 9999) {
        var num = parseInt(this) / 10000;
        return Math.round(num * 10) / 10 + "万+";
    } else {
        return this;
    }
};

function toggleToPC() {
    var PC = comm.equipment.IsPC();
    if (PC) {
        var currentUrl = location.href;
        if (currentUrl.indexOf("m.allinmd.cn") > -1) {
            location.href = currentUrl.replace("m.allinmd.cn", "www.allinmd.cn").replace("/m/", "/");
        }
    }
}

jQuery.cookie = function(key, value, options) {

    // key and value given, set cookie...
    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
        options = jQuery.extend({}, options);

        if (value === null) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires,
                t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? String(value) : encodeURIComponent(String(value)),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function(s) {
        return s;
    } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};


//文本域高度自适应
$.fn.extend({
    textareaAutoHeight: function(options) {
        this._options = {
            minHeight: 0,
            maxHeight: 1000
        };
        this.init = function() {
            for (var p in options) {
                this._options[p] = options[p];
            }
            if (this._options.minHeight == 0) {
                this._options.minHeight = parseFloat($(this).height());
            }
            for (var p in this._options) {
                if ($(this).attr(p) == null) {
                    $(this).attr(p, this._options[p]);
                }
            }
            $(this).keydown(this.resetHeight).keyup(this.resetHeight).change(this.resetHeight)
                .focus(this.resetHeight);
            $(this)[0].onpaste = this.resetHeight;
        };
        this.resetHeight = function() {
            var _minHeight = parseFloat($(this).attr("minHeight"));
            var _maxHeight = parseFloat($(this).attr("maxHeight"));
        /*    if (!$.browser.msie) {
                $(this).height(0);
            }*/
            $(this).height(0);
            var h = parseFloat(this.scrollHeight);
            h = h < _minHeight ? _minHeight :
                h > _maxHeight ? _maxHeight : h;
            $(this).height(h).scrollTop(h);
            if (h >= _maxHeight) {
                $(this).css("overflow-y", "scroll");
            } else {
                $(this).css("overflow-y", "hidden");
            }
            $(this).parents(".case_title").css("height", $(this).parent().next().outerHeight(true) + $(this).height() + 12);
            $(this).parents(".case_title_more_p").css("height", $(this).parent().next().outerHeight(true) + $(this).height() + 12);
        };
        this.init();
    }
});

String.prototype.cutString = function(len) {
    //length属性读出来的汉字长度为1
    if (this.length * 2 <= len) {
        return this;
    }
    var strlen = 0;
    var s = "";
    for (var i = 0; i < this.length; i++) {
        s = s + this.charAt(i);
        if (this.charCodeAt(i) > 128) {
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
};
var TempCache = {
    cache: function(value) {
        localStorage.setItem("EasyWayTempCache", value);
    },
    getCache: function() {
        return localStorage.getItem("EasyWayTempCache");
    },
    setItem: function(key, value) {
        localStorage.setItem(key, value);
    },
    getItem: function(key) {
        var item = localStorage.getItem(key);
        if (key && key == "fromPage") // 来源页面只能获取一次
            localStorage.removeItem(key);
        return item;
    },
    removeItem: function(key) {
        return localStorage.removeItem(key);
    },
    clear: function() {
        // 清除缓存
        /* storage = window.localStorage;
         while (storage.key(storage.length - 1).indexOf(keyword) === 0) {
         storage.removeItem(storage.key(storage.length - 1))
         }*/
        // TODO:2017/10/18 郑辉修改，微信授权逻辑错误
        //var wxBrowseAccessLockOn = localStorage.getItem("wxBrowseAccessLockOn");
        localStorage.clear();
        //localStorage.setItem("wxBrowseAccessLockOn", wxBrowseAccessLockOn);
    }
};

function initTuiJian(obj) {
    var str = "";
    $.each(tuijianList, function(index, val) {
        str += '<div class="ui-block-' + (index % 2 == 0 ? 'a' : 'b') + ' item" videoKey="' + val.key + '">' +
            '<div>' +
            '<img src="' + val.pic + '"  />' +
            '<span class="type">' + val.type + '</span><a  class="title">' + val.title + '</a>' +
            '<span class="author"><span class="user"></span>' + val.author + '</span>' +
            '</div>' +
            '</div>'
    });
    $(obj).html(str);

    $(obj).find(".item").on('vclick', function(e) {
        TempCache.setItem("videoKey", $(this).attr("videoKey"));
        $.mobile.changePage("video.html", {
            transition: "slideleft"
        });
    });

}

function runvote(videoId, location) {
    var param = {
        useful_type: 1,
        up_down_type: 1,
        ref_id: videoId
    };

    $.ajax({
        type: 'POST',
        url: "/mcall/customer/prefer/createPrefer/",
        data: {
            "paramJson": $.toJSON(param)
        },
        dataType: "json",
        timeout: 10000,
        success: function callback(rep) {
            if (rep != null) {
                if (rep.responseObject.responseStatus) {
                    alert("投票成功");

                } else {
                    if ("9X0001" == rep.responseObject.responseCode) {
                        alert("您已经投过票了");
                    }

                }

                if (location != window.location.href) {
                  g_sps.jump(null,location);
                } else {
                    setVideoInfo();
                }
            }

        },
        error: function() {
            alert("数据错误");
        }
    });
}

function getXueZuListData() {
    var result = [];
    $.ajax({
        type: 'POST',
        url: "/mcall/comm/data/tag/json_list/",
        data: {
            treeLevel: '2',
            pageIndex: 1,
            pageSize: 100
        },
        dataType: "json",
        timeout: 20000,
        async: false,
        success: function callback(rep) {
            if (rep && rep.responseObject) {
                result = rep.responseObject.responseMessage;
            } else {
                //console.log("getDataTags数据错误");
            }
        },
        error: function() {
            //console.log("getDataTags数据错误");
        }
    });
    return result;
}

function initXueZu(selector) {
    var data = getXueZuListData();
    var str = $.map(data, function(el, index) {
        return "<div class='tab_a'><div class='tab_b'>" + el + "</div></div>";
    }).join("");
    $("#" + selector).html(str);

    $("#xuezu_list >div ").on("vclick", function() {
        var href = "/html/pages/video_list.html?type=" + $(this).text();
        g_sps.jump(null,href);
    });
}


if (!Array.remove) {
    //Array Remove - By John Resig (MIT Licensed)
    Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };
}

function shareFriend() {
    var link = location.href;
    var desc = ((typeof weiXinDesc == "undefined") || weiXinDesc == "") ? link : weiXinDesc;
    var title = ((typeof weiXinTitle == "undefined") || weiXinTitle == "") ? $("title").text() : weiXinTitle;
    var logoUrl = ((typeof weiXinLogo == "undefined") || weiXinLogo == "") ? "" : weiXinLogo;
    if (link.indexOf("?") > 0) {
        link = link + "&_=" + Math.random();
    }
    //alert("title"+$("title").text());
    WeixinJSBridge.invoke('sendAppMessage', {
        "img_url": logoUrl || "//m.allinmd.cn/images/img50/weixin_video_logo.jpg",
        "img_width": "640",
        "img_height": "640",
        "link": link,
        "desc": desc || "",
        "title": title || $("title").text()
    }, function(res) {
        //_report('send_msg', res.err_msg);
    })
}

function shareTimeline() {
    var link = location.href;
    var desc = ((typeof weiXinDesc == "undefined") || weiXinDesc == "") ? link : weiXinDesc;
    var title = ((typeof weiXinTitle == "undefined") || weiXinTitle == "") ? $("title").text() : weiXinTitle;
    var logoUrl = ((typeof weiXinLogo == "undefined") || weiXinLogo == "") ? "" : weiXinLogo;
    if (link.indexOf("?") > 0) {
        link = link + "&_=" + Math.random();
    }
    WeixinJSBridge.invoke('shareTimeline', {
        "img_url": logoUrl || "//m.allinmd.cn/images/img50weixin_video_logo.jpg",
        "img_width": "640",
        "img_height": "640",
        "link": link,
        "desc": desc,
        "title": title || $("title").text()
    }, function(res) {
        //_report('timeline', res.err_msg);
    });
}

function shareWeibo() {

    WeixinJSBridge.invoke('shareWeibo', {
        "content": descContent,
        "url": lineLink
    }, function(res) {
        _report('weibo', res.err_msg);
    });
}


var isIE = !!window.ActiveXObject;
var isIE6 = isIE && !window.XMLHttpRequest;
var isIE8 = isIE && !!document.documentMode;
var isIE7 = isIE && !isIE6 && !isIE8;
if (isIE8 || isIE7) {
    document.attachEvent('WeixinJSBridgeReady', function onBridgeReady() {
        // 发送给好友
        if (location.pathname.indexOf("login") < 0 && location.pathname.indexOf("regist") < 0) {
            WeixinJSBridge.on('menu:share:appmessage', function(argv) {
                shareFriend();
            });

            WeixinJSBridge.on('menu:share:timeline', function(argv) {
                shareTimeline();
            });
        }
    }, false);
} else {
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        // 发送给好友
        if (location.pathname.indexOf("login") < 0 && location.pathname.indexOf("regist") < 0) {
            WeixinJSBridge.on('menu:share:appmessage', function(argv) {
                shareFriend();
            });

            WeixinJSBridge.on('menu:share:timeline', function(argv) {
                shareTimeline();
            });
        }


        /*  // 分享到朋友圈


         // 分享到微博
         WeixinJSBridge.on('menu:share:weibo', function(argv){
         shareWeibo();
         });*/
    }, false);
}

function goBack(href, step) {
    //var nav = browser.versions;
    //if(nav.iPhone||nav.iPad||nav.ios){
    g_sps.jump(null,href);
    /*}else{
     history.back(step?step:-1);
     }*/
}

function rem(opx) {
    var px = parseInt(opx);

    return (px / 75) + 'rem';
}
//展示时把html标签转换成字符串显示
function htmlToString(str){
    var rstStr = (str+ '').replace(/[<>&]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;'}[c];});
    var tempArr = rstStr.split("\&lt\;\/a\&gt\;&lt\;a");

    if(tempArr.length>=2){
        rstStr = tempArr.map(function(d,index) {
            var s =  d.replace(/\&lt\;a[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)/gi,"<a href=\"$1\">$2");
            s =  s.replace(/[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)&lt\;\/a\&gt\;/gi," href=\"$1\">$2</a>");
            return s;
        }).join("</a><a");
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
//cookie
$.getCookie = function(key, options) {
    options = options || {};
    var result, decode = options.raw ? function(s) {
        return s;
    } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

$.setCookie = function(key, value, options) {
    options = $.extend({}, {
        domain: '',
        path: '/'
    }, options);
    //删除cookie操作处理
    if (value === null) {
        options.expires = -1;
    }
    //设置过期时间
    if (typeof options.expires === 'number') {
        var seconds = options.expires,
            t = options.expires = new Date();
        t.setTime(t.getTime() + seconds*1000); //* 1000 * 60 * 60
    }
    //强制转换为字符串格式
    value = '' + value;
    //设置cookie信息
    return (document.cookie = [
        key, '=',
        options.raw ? value : value,
        options.expires ? '; expires=' + options.expires.toUTCString() : '',
        options.path ? '; path=' + options.path : '',
        options.domain ? '; domain=' + options.domain : '',
        options.secure ? '; secure' : ''
    ].join(''));
};



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
    if(s){
        var arr=s.split(':');
        return parseInt(arr[0]*3600)+parseInt(arr[1]*60)+parseInt(arr[2]);
    }
};

function allinaccesstoken(timestamp,phoneVal){
	return $.md5('dynamic.allinmd.cn/'+timestamp+'/'+phoneVal);
}
/*20190129
* Change by HJ
* 新增活动、专题灰度骨架屏html结构
* */
comm.actSkeleton=function () {
    return '<section class="p_parent">' +
        '        <aside>' +
        '            <p class="p_BgColor"></p>' +
        '            <p class="p_BgColor p_width70"></p>' +
        '        </aside>' +
        '        <aside class="p_position">' +
        '            <p class="p_BgColor p_width32 p_inline"></p>' +
        '            <p class="p_BgColor p_width50 p_inline "></p>' +
        '            <p class="p_BgColor p_width50 p_inline p_absolute"></p>' +
        '        </aside>' +
        '        <aside class="p_position">' +
        '            <p class="p_BgColor p_width50 p_width50L p_inline"></p>' +
        '            <p class="p_BgColor p_width50 p_inline p_absolute2"></p>' +
        '            <p class="p_BgColor p_width32 p_width32R p_inline"></p>' +
        '        </aside>' +
        '        <aside class="p_BgColor"></aside>' +
        '        <aside class="p_BgColor"></aside>' +
        '        <aside class="p_position">' +
        '            <p class="p_BgColor p_width32 p_inline"></p>' +
        '            <p class="p_BgColor p_width50 p_inline "></p>' +
        '            <p class="p_BgColor p_width50 p_inline p_absolute"></p>' +
        '        </aside>' +
        '        <aside class="p_BgColor"></aside>' +
        '    </section>';
};

// 厂商弹出小黑框提示, title为内容 goback为是否返回首页
comm.toastFactoryAuth = function(title, goback){
    if(!title){ title = "该功能仅向医务人员开放"; }
    popup(title);
    if(goback){
        setTimeout(function(){
            window.location.href = "//m.allinmd.cn";
        },3000);
    }
}
comm.checkInvalid = function(val){//检查一个字符串是否有效
    if(((typeof val =='string')&&(val.length==0))||(val==undefined)||(val=='undefined')||(val=='null')||(typeof val=='undefined')||(typeof val=='null')||(val==null)){
        return true;
    }else{
        return false;
    }
}
comm.banner = {
    openUrl:function(url){
        if(!comm.checkInvalid(url)){
            if(g_sps){
                g_sps.jump(null,url);
            }else{
                window.location.href=url;
            }
        }
    },
    openLiveTerminal:function(config){//打开直播终端页
        var _this = this;
        if(_this.appPort){
            appjs&&appjs.gotoEliteClubBroadcastVC(
                $.toJSON({
                    columnId:'1553136536872',
                    broadcastStartTime:config.liveStartTime,
                    authority:config.authority,
                    liveId:config.liveId,
                    boradcastUserId:config.boradcastUserId,
                    boradcastRoomNum:config.boradcastRoomNum,
                    boradcastAuthcode:config.boradcastAuthcode,
                    boradcastLiveId:config.boradcastLiveId,
                    boradcastRecoderId:config.boradcastRecoderId,
                    broadcastNameString:config.broadcastNameString,
                    broadcastType:config.liveState
                })
            );
        }else{
            var liveJson={
                id:config.id,
                userId:config.userId,
                playBack:config.playBackId,
                authcode:config.authcode,
                conSubId:config.id,
                startTime:config.startTime,
                conSubRoom:config.conSubRoom,
                liveId:config.liveId,
                authority:config.authority,
                liveState:config.liveState,
                title:config.title
            };
            var createUrl = function(data){
                var liveUrl = '';
                switch (parseInt(liveJson.liveState)) {
                    case 1://预告
                        comm.alertBox({
                            title: "直播将于" + data.startTime + "开始",
                            ensure: "知道了",
                            ensureCallback:function(){
                                $('.al-alertModalMask').remove();
                            }
                        });
                        break;
                    case 2://直播中
                        liveUrl = '/pages/conference/conference_live.html?conSubId=' + data.conSubId +'&userId='+data.userId+'&roomId=' + data.conSubRoom + '&back=0&recordId='+data.playBack+'&liveId='+data.liveId+'&authority='+data.authority+'&title='+data.title;
                        break;
                    case 3://直播结束
                        comm.alertBox({
                            title: "直播已结束",
                            ensure: "知道了",
                            ensureCallback:function(){
                                $('.al-alertModalMask').remove();
                            }
                        });
                        break;
                    case 4://回播
                        liveUrl = '/pages/conference/conference_live.html?conSubId=' + data.conSubId + '&userId='+data.userId+'&roomId=' + data.conSubRoom + '&back=1&recordId='+data.playBack+'&liveId='+data.liveId+'&authority='+data.authority+'&title='+data.title;
                        break;
                }
                return liveUrl;
            };
            console.log(createUrl(liveJson));
            _this.openUrl(createUrl(liveJson));
        }
    },
    openDoc:function(config){//打开文库终端页
        var _this = this;
        if(_this.appPort){
            appjs.gotoTerminalDetailVC($.toJSON({
                "resourceId": config.detailInfo.docId,
                "resourceType": '2',
                "tplPath": 'm.allinmd.cn'
            }))
        }else{
            _this.openUrl(config.linkUrl);
        }
    },
    openBanner:function(config){
        var _this = this;
        switch (parseInt(config.resourceType,10)) {
            case 1://单篇内容-视频
            case 2://单篇内容-文库
            case 7://单篇内容-病例
            case 16://专题
            case 17://活动
                _this.openUrl(config.h5Url);
                break;
            case 21://付费课程，本质上付费课程同单篇视频终端页
                _this.openPayCourse(config);
                break;
            case 3://骨科会议
                _this.openMeeting(config);//resourceId
                break;
            case 11://菁英汇直播//id=>resourceId
                var liveJson = {
                    id:config.id,
                    playBackId:config.boradcastRecoderId,
                    authcode:config.boradcastAuthcode ,
                    conSubRoom:config.boradcastRoomNum,
                    liveId:config.liveId,
                    authority:config.authority,
                    userId:config.boradcastUserId,
                    liveState:config.liveState,
                    startTime:config.formatStartTime
                };
                _this.openLiveTerminal(liveJson);
                break;
            case 12://锦囊
                _this.openUrl("//m.allinmd.cn/dist/commShare.html?brochureId="+config.resourceId+"");
                break;
            case 19://产品
                _this.openUrl("https://m.allinmd.cn/dist/medPlus/medPlus.html?#/productDetail?"+config.resourceId+"");
                break;
            case 20://品牌
                _this.openUrl("https://m.allinmd.cn/dist/medPlus/medPlus.html?#/brandDetail?brandId="+config.resourceId+"&brandName="+config.resourceName+"");
                break;
            case 13://个人主页//cid=>resourceId
                _this.openPersonal({
                    cid:config.resourceId
                });
                break;
            case 14://课程resourceId
                _this.openUrl("//m.allinmd.cn/dist/surgicalLecture.html#/courseProduce?courseId="+config.resourceId+"&columnId="+config.columnId+"&customerId="+_this.cid+"");
                break;
            case 15://栏目resourceId
                switch (parseInt(config.columnType,10)) {
                    case 1:
                        _this.openUrl("//m.allinmd.cn/dist/surgicalLecture.html#/surgicalLecture?columnId="+config.columnId+"");
                        break;
                    case 2:
                        _this.openUrl("https://m.allinmd.cn/dist/surgicalLecture.html#/surgicalPractice?columnId="+config.columnId+"");
                        break;
                    case 3:
                        _this.openUrl("https://m.allinmd.cn/dist/elite/elite.html#/home");
                        break
                }
                break;
            case 18://链接跳转',
                _this.openUrl(config.linkUrl);
                break;
            default:
                break;
        }


    },
    openNews:function(config){
        var _this = this;
        _this.openUrl(config.linkUrl);
    },
    openPersonal:function(config){//打开个人中心
        var _this = this;
        if(parseInt(config.cid,10)>100){
            if(_this.appPort){
                appjs&&appjs.gotoPersonalCenter($.toJSON({
                    customerId:config.cid
                }));
            }else{
                if(parseInt(config.cid,10)===parseInt(_this.cid,10)){
                    _this.openUrl('/dist/personal/personal_index.html');
                }else{
                    _this.openUrl('//m.allinmd.cn/dist/personal/others_index.html?cid='+config.cid);
                    //g_sps.jump(null,);
                }
            }
        }
    },
    openPayCourse:function(config){//打开付费课程
        var _this = this;
            if(_this.appPort){
                appjs&&appjs.gotoPersonalCenter($.toJSON({
                    customerId:config.cid
                }));
            }else{
                    _this.openUrl('//m.allinmd.cn/dist/payCourse/payCourse.html#/payCourse?courseId='+config.resourceId);
                    //g_sps.jump(null,);
            }
    },
    openMeeting:function(config){//打开会议终端页
        var _this = this;
        if(_this.appPort){
            appjs&&appjs.gotoConferenceDetailInfoVC($.toJSON({
                // meetId:config.conId,
                meetId:config.conId?config.conId:config.resourceId,
                meetName:config.conName
            }));
        }else{
            // _this.openUrl("//m.allinmd.cn/dist/conference/meeting_detail.html?conId=${config.conId}");
            _this.openUrl("//m.allinmd.cn/dist/conference/meeting_detail.html?conId="+config.conId?config.conId:config.resourceId+"");
        }
    }
};
//alert('comm.func');

