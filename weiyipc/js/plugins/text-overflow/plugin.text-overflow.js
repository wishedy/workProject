/**
 * 功能描述：  文字超出显示省略号
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiuYuTao on 2015/3/30.
 */

$.fn.textOverflow = function (length) {
    $(this).each(function () {
        $(this).text().length>length && $(this).text($(this).text().substr(0,length)+"...");
    });
};