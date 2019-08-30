/**
 * 年份月份选择
 * Created by HJ on 2017/8/8.
 */
module.fiterData = function (obj) {
    var controller = {
        init: function (obj) {
            var t = this;
            t.options = {};
            var o = {
                callback: function () {}
            };
            t.options = (o, obj);
            t.getDataYm();
        },
        //获得年月
        getDataYm:function(){
            var t=this;

        }
    };
    controller.init(obj);
};