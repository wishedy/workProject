                                                    /**
 * 功能描述：处理右侧跟随屏幕  参照地址个人资料页右侧导航
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/4/15.
 */
comm.scrollFloating=function(obj){
    var offsetTop=obj.float.offset().top;
    $(window).bind("scroll",function(){
        maxTop=obj.maxObj.outerHeight()+obj.maxObj.offset().top-obj.float.height();
        scrTop=$(window).scrollTop();
        if(scrTop>offsetTop){
            if(scrTop>maxTop){
                obj.float.css({
                    "position":"absolute",
                    "top":maxTop-offsetTop
                });
            }else{
                obj.float.css({
                    "position":"fixed",
                    "top":obj.top?obj.top:0
                });
            }
        }else{
            obj.float.css({
                "position":"",
                "top":""
            });
        }
    });
};
