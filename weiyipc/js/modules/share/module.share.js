/**
 * 功能描述：  全站分享功能包括(动态，微信，微博，qq空间，qq)
 * 使用方法:   module.share({
 *                 container:"",//存放分享组件的父级
 *                 type:1,//默认为1  1：社交分享  2：页面左下角全站分享,3.终端页面的固定分享,4.终端评论区分享，消息的评论我的，只分享到唯医朋友圈, 5:直播分享
 *                 url:'',//分享链接， 默认取当前页链接
 *                 hiddenEl：'',//url需要改变时传一个隐藏域
 *                 noShareWeixin:true //不需要微信分享时传值
 *                 h5Url:'',//微信分享生成二维码的链接
 *                 title:'',//分享标题
 *                 shareTrend:1,//0:不需要站内动态分享  1：需要站内动态分享
 *                 trendUrl:'',//分享到站内动态的接口
 *                 data:{},//分享到站内动态的接口参数
 *                 callback:function(){},//分享到站内动态成功后回调函数
 *                 pic:'',//分享图片
 *                 sinaTitle:'',//新浪分享标题
 *                 sinaSummary:'',//新浪分享描述
 *                 qqTitle:'',//qq好友分享标题
 *                 qqSummary:'',//qq好友分享描述
 *                 qqZoneTitle:'',//qq空间分享标题
 *                 qqZoneSummary:'',//qq空间分享描述
 *                 shareQQSuc:function(){},//分享qq成功
 *                 shareQzoneSuc:function(){},//分享qzone成功
 *                 shareSinaSuc:function(){},//分享sina成功
 *                 triggerRequest:function(content){}//分享按钮点击触发分享话术的获取
 *            });
 * 注意事件：
 * 引入来源： <link href="/js/plugins/top-tip/plugin.top-tip.css" rel="stylesheet" type="text/css" />
 *          <script src="/js/plugins/top-tip/plugin.top-tip.js"></script>
 *          <script src="/js/third-party/jquery-qrcode-master/src/jquery.qrcode.js"></script>
 *          <script src="/js/third-party/jquery-qrcode-master/src/qrcode.js"></script>
 *
 * Created by LiChunHui on 2016/8/8.
 */
module.share=function(obj){

    switch (obj.type){
        case 1:
            obj.createEvent=function(){
                //事件埋点
                comm.creatEvent({
                    triggerType:"分享",
                    keyword:"社交分享",
                    actionId:40
                });
            };
            break;
        case 2:
            obj.createEvent=function(){
                //事件埋点
                comm.creatEvent({
                    triggerType:"分享",
                    keyword:"pc全站右下角分享按钮",
                    actionId:40
                });
            };
            break;
        case 4:
            obj.createEvent=function(){
                //事件埋点
                comm.creatEvent({
                    triggerType:"分享",
                    keyword:"评论分享按钮",
                    actionId:40
                });
            };
            break;
        case 5:
            obj.createEvent=function(){
                //事件埋点
                comm.creatEvent({
                    triggerType:"分享",
                    keyword:"观看直播分享按钮",
                    actionId:40
                });
            };
            break;
        default:
            obj.createEvent=function(){
                //事件埋点
                comm.creatEvent({
                    triggerType:"分享",
                    keyword:"分享按钮",
                    actionId:40
                });
            };
            break;
    }
    if(typeof pcShare=="undefined"){
        $.getScript("//paas.allinmd.cn/modules/pcShare/pcShare.js",function(){
            pcShare(obj);
        });
    }else{
        pcShare(obj);
    }
};
