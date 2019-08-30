/**
 * 功能描述：   发布时会添加到终端页生成队列中有几秒的延迟这是需要验证html生成的状态
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用： ajax请求html判断返回状态
 *
 * Created by LiChunHui on 2015/8/7.
 */
comm.ajaxExistHtml=function(url,fn){
    var timer=null;
    timer=setInterval(function(){
        $.ajax({
            type : "get",
            url : url,
            dataType:"html",
            statusCode:{
                404: function() {

                },
                403: function() {

                },
                200: function(data){
                	    var index = data.indexOf("<title>唯医-医生互动社区,医学继续教育,allinmd</title>"); //首页
                    var notFound = data.indexOf("<title>页面未找到</title>"); //返回的404页not_found.html
                		if(index === -1 && notFound === -1){
                			clearInterval(timer);
                			fn&&fn();
                		}
                }
            }
        });
    },2000)

}
