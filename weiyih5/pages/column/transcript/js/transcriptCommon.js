/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by WangNing on 2017/12/8.
 */
/*
* 生成图片
* ele : $(".swiper-slide")
* */

function convert2canvas(ele) {
    var cntElem = ele[0];
    var shareContent = cntElem;//需要截图的包裹的（原生的）DOM 对象
    var width = shareContent.offsetWidth; //获取dom 宽度
    var height = shareContent.offsetHeight; //获取dom 高度
    var canvas = document.createElement("canvas"); //创建一个canvas节点
    var scale = 2; //定义任意放大倍数 支持小数
    canvas.width = width * scale; //定义canvas 宽度 * 缩放
    canvas.height = height * scale; //定义canvas高度 *缩放
    canvas.getContext("2d").scale(scale, scale); //获取context,设置scale
    var opts = {
        scale: scale, // 添加的scale 参数
        canvas: canvas, //自定义 canvas
        // logging: true, //日志开关，便于查看html2canvas的内部执行流程
        width: width, //dom 原始宽度
        height: height,
        useCORS: true // 【重要】开启跨域配置
    };

    html2canvas(shareContent, opts).then(function (canvas) {

        var context = canvas.getContext('2d');
        // 【重要】关闭抗锯齿
        context.mozImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;

        // 【重要】默认转化的格式为png,也可设置为其他格式
        var img = Canvas2Image.convertToImage(canvas, canvas.width, canvas.height);
        // document.body.innerHTML="";
        // document.body.appendChild(img);
        ele.html("").append(img);
        $(img).css({
            "width": canvas.width / scale + "px",
            "height": canvas.height / scale+ "px",
        }).addClass('f-full');
    });
}
/*判断是否大于两天*/
function DateMinus(sDate){
    var sdate = new Date(sDate.replace(/-/g, "/"));
    var now = new Date();
    var days = now.getTime() - sdate.getTime();
    // var day = parseInt(days / (1000 * 60 * 60 * 24));
    return days>(1000 * 60 * 60 * 24*2);
}
function getData(userid,fn){
    /*我的id*/
    $.ajax({
        url:"/mcall/customer/statisticsStat/getMapByCustomerId/",
        data: {
            paramJson: JSON.stringify({
                "customerId":userid
            })
        },
        success: function (data) {
            if (data) {
                typeof  fn === "function" && fn(data);
            }else{
                console.log(userid,"数据拉取错误");
            }
        }
    });
}

/**
 * 获取参数的函数
 * */
function getparaNew()
{
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
                param[item[0]] = decodeURIComponent(item[1]);
            }
            return param;
        }
        return false;
    }
    return false;
}

/**
 * @example medCommon.stringLimitLength(str,strLength,endStr)
 * @desc  限定字符串长度,并以...结束
 * @param str:需要截取的字符串,strLength:截取的长度,endStr:结束字符串
 */
 function stringLimitLength(str, strLength, endStr) {
    if (!str) return "";
    var str = str.trim();
    var result = "", count = 0;
    for (var i = 0; i < strLength; i++) {
        var _char = str.charAt(i);
        if (count >= strLength) break;
        if (/[^x00-xff]/.test(_char)) count++; //双字节字符，//[u4e00-u9fa5]中文
        result += _char;
        count++;
    }
    if (result.length < str.length && endStr) {
        result += endStr;
    }
    return result;
};

/**
* 判断是否是微信
* */
function is_weixn(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}


