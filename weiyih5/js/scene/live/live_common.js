/**
 * Created by ALLIN on 2016/11/16.
 */

medCommon = {};
medCommon.getparaNew = function () {//获取参数的函数
    var url = document.URL;
    var param = {};
    var str, item;
    str = url;
    if (url.lastIndexOf("?") > 0) {
        str = url.substring(url.lastIndexOf("?") + 1, url.length);
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
                param[item[0]] = decodeURI(item[1]);
            }
            return param;
        }
        return false;
    }
    return false;
};

medCommon.getData = function (options) {
    $.ajax({
        url: options.url,
        type: options.type,
        data: options.params,
        //scriptCharset: 'utf-8',
        beforeSend: function (XHR) {

        },
        contentType: "application/x-www-form-urlencoded; charset=utf-8", //添加这个编码声明
        error: function (xhr) {
            //console.log("error : " + xhr.status + " " + xhr.statusText);
        },
        success: function (data) {
            if (data) {
                //console.log("dataReady");
            }
            if (typeof options.sucFn == "function") {
                options.sucFn(data);
            }
        },
        complete: function (XMLHttpRequest, textStatus) {

        }
    });
};
