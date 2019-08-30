/**
 * 功能描述：拜耳活动二期PC
 * 使用方法:
 * 注意事件：
 * 引入来源：
 * 作用：
 *
 * Created by ZhangHongda on 2017/04/01.
 */
$(function () {
    var control = {
        init:function(){
            this.division();
        },
        //赛区入口的点击
        division: function () {
            var t = this;
            $(".DivisionEntranceList").on("click","li", function () {
                $(this).addClass("active").siblings().removeClass("active");
            })
        },
    };
    control.init();
});


