/**
 * 功能描述：扩大文本域，示例场景处，参照个人简介编辑资料
 * 使用方法:  $.textareaAutoHeight();
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/4/7.
 */
//文本域高度自适应
$.fn.extend({
    textareaAutoHeight: function (options) {
        this._options = {
            minHeight: 0,
            maxHeight: 1000
        };
        this.init = function () {
            for (var p in options) {
                this._options[p] = options[p];
            }
            if (this._options.minHeight == 0) {
                this._options.minHeight=parseFloat($(this).height());
            }
            for (var p in this._options) {
                //if ($(this).attr(p) == null) {
                    $(this).attr(p, this._options[p]);
                //}
            }
            $(this).keydown(this.resetHeight).keyup(this.resetHeight).change(this.resetHeight)
                .focus(this.resetHeight);
            if($(this).length){
                $(this)[0].onpaste=this.resetHeight;
            }
        };
        this.resetHeight = function () {
            var _minHeight = parseFloat($(this).attr("minHeight"));
            var _maxHeight = parseFloat($(this).attr("maxHeight"));
            if (!$.browser.msie) {
                $(this).height(0);
            }
            var h = parseFloat(this.scrollHeight);
            h = h < _minHeight ? _minHeight :
                h > _maxHeight ? _maxHeight : h;
            $(this).height(h);//.scrollTop(h);
            if (h >= _maxHeight) {
                $(this).css("overflow", "auto");
            }
            else {
                $(this).css("overflow", "hidden");
            }

        }
        this.init();
    }
});

