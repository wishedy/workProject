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
 *                 shareSinaSuc:function(){}//分享sina成功
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
    var container={};
    container={
        config:{

        },
        template:{
            socialShare:function(){//社交功能中的分享
                var trend="";
                if (obj.shareTrend===1){
                    trend= '<img src="//img10.allinmd.cn/v3/common/icon/share_inset.png" alt="">'
                }else{
                    trend= '<img src="//img10.allinmd.cn/v3/common/icon/share_inset_no.png" alt="">'
                }
                return '<section class="al-shareBox hide" style="z-index:2;">'+
                    '<figure class="al-shareListItem ev-ttrend" style="margin-left:8px">'+
                    trend+
                    '<figcaption>唯医朋友圈</figcaption>'+
                    '</figure>'+
                    '<figure class="al-shareListItem ev-tweixin" style="width:48px">'+
                    '<img src="//img10.allinmd.cn/v3/common/icon/share_weixin.png" alt="">'+
                    '<figcaption>微信</figcaption>'+
                    '</figure>'+
                    '<figure class="al-shareListItem ev-tsina" style="width:48px">'+
                    '<img src="//img10.allinmd.cn/v3/common/icon/share_weibo.png" alt="">'+
                    '<figcaption>微博</figcaption>'+
                    '</figure>'+
                    '<figure class="al-shareListItem ev-tqzone" style="margin-left:4px;margin-right:4px">'+
                    '<img src="//img10.allinmd.cn/v3/common/icon/share_zone.png" alt="">'+
                    '<figcaption>QQ空间</figcaption>'+
                    '</figure>'+
                    '<figure class="al-shareListItem ev-tqq" style="width:48px">'+
                    '<img src="//img10.allinmd.cn/v3/common/icon/share_qq.png" alt="">'+
                    '<figcaption>QQ</figcaption>'+
                    '</figure>'+
                    '<section class="al-weixinErweiCodeBox ev-erweima hide">'+
                    '<span>使用微信扫描二维码</span>'+
                    '<img src="//img10.allinmd.cn/v3/friends/weixin_share.jpg" alt="">'+
                    '</section>'+
                    '</section>';
            },
            allBateShare:function(){//全站分享
                var trend="",weixin="";
                if (obj.shareTrend===1){
                    trend= '<img src="//img10.allinmd.cn/v3/common/icon/share_inset.png" alt="">'
                }else{
                    trend= '<img src="//img10.allinmd.cn/v3/common/icon/share_inset_no.png" alt="">'
                }
                if (obj.noShareWeixin){
                    weixin= '';
                }else{
                    weixin='<figure class="al-shareListItem ev-tweixin" style="width:48px">'+
                    '<img src="//img10.allinmd.cn/v3/common/icon/share_weixin.png" alt="">'+
                    '<figcaption>微信</figcaption>'+
                    '</figure>';
                }
                return '<section class="al-shareBox hide">'+
                    '<figure class="al-shareListItem ev-ttrend" style="margin-left:8px">'+
                    trend+
                    '<figcaption>唯医朋友圈</figcaption>'+
                    '</figure>'+
                    weixin+
                    '<figure class="al-shareListItem ev-tsina" style="width:48px">'+
                    '<img src="//img10.allinmd.cn/v3/common/icon/share_weibo.png" alt="">'+
                    '<figcaption>微博</figcaption>'+
                    '</figure>'+
                    '<figure class="al-shareListItem ev-tqzone" style="margin-left:4px;margin-right:4px">'+
                    '<img src="//img10.allinmd.cn/v3/common/icon/share_zone.png" alt="">'+
                    '<figcaption>QQ空间</figcaption>'+
                    '</figure>'+
                    '<figure class="al-shareListItem ev-tqq" style="width:48px">'+
                    '<img src="//img10.allinmd.cn/v3/common/icon/share_qq.png" alt="">'+
                    '<figcaption>QQ</figcaption>'+
                    '</figure>'+
                    '<section class="al-weixinErweiCodeBox ev-erweima hide">'+
                    '<span>使用微信扫描二维码</span>'+
                    '<img src="//img10.allinmd.cn/v3/friends/weixin_share.jpg" alt="">'+
                    '</section>'+
                    '</section>'
            },
            terminalReviewShare:function(){//终端页评论区分享
                return '<section class="al-shareBox al-onlyFriendCircle hide">'+
                    '<figure class="al-shareListItem ev-ttrend" style="margin-left:8px">'+
                    '<img src="//img10.allinmd.cn/v3/common/icon/share_inset.png" alt="">'+
                    '<figcaption>唯医朋友圈</figcaption>'+
                    '</figure>'+
                    '</section>'
            }
        },
        init:function(obj){
            var t = this;
            this.options = {};
            var o = {
                type:1,
                url:window.location.href,
                title:document.title,
                trend:true
            };
            this.options = $.extend(o, obj);
            t.parent=t.options.container;
            t.options.container.attr("hasAjax","");
            switch (t.options.type){
                case 1:
                    t.options.container.append(t.template.socialShare());
                    t.options.container.attr("on","true").off('click').on("click",function(){
                        $(".al-shareBox").hide();
                        $('.ev-shareContainer, .ev-share').not(t.options.container).attr('on','true');
                        if($(this).attr("on")=="true"){
                            $(this).attr("on","false");
                            $(this).find(".al-shareBox").show();
                            //事件埋点
                            comm.creatEvent({
                                triggerType:"分享",
                                keyword:"社交分享",
                                actionId:40
                            });
                            return false;
                        }else{
                            $(this).attr("on","true");
                            $(this).find(".al-shareBox").hide();
                            return false;
                        }
                    });
                    break;
                case 2:
                    t.options.container.show();
                    t.options.container.html("分享"+t.template.allBateShare());
                    t.options.container.attr("on","true").off('click').on("click",function(e){
                        $(".al-shareBox").hide();
                        $('.ev-shareContainer, .ev-share').not(t.options.container).attr('on','true');
                        if($(this).attr("on")=="true"){
                            if(t.options.hiddenEl){//针对url会发生改变
                                if (t.options.hiddenEl.val()) {
                                    t.options.url=t.options.hiddenEl.val();
                                }
                            }
                            t.shareClick();
                            $(this).attr("on","false");
                            $(this).find(".al-shareBox").show();
                            //事件埋点
                            comm.creatEvent({
                                triggerType:"分享",
                                keyword:"pc全站右下角分享按钮",
                                actionId:40
                            });
                            return false;
                        }else{
                            $(this).attr("on","true");
                            $(this).find(".al-shareBox").hide();
                            return false;
                        }
                    });
                    break;
                case 3:
                    if(t.options.hiddenEl){//针对url会发生改变
                        if (t.options.hiddenEl.val()) {
                            t.options.url=t.options.hiddenEl.val();
                        }
                    }
                    break;
                case 4:
                    t.options.container.append(t.template.terminalReviewShare());
                    t.options.container.attr("on","true").off('click').on("click",function(e){
                        $(".al-shareBox").hide();
                        $('.ev-shareContainer, .ev-share').not(t.options.container).attr('on','true');
                        if($(this).attr("on")=="true"){
                            $(this).attr("on","false");
                            $(this).find(".al-shareBox").show();
                            //事件埋点
                            comm.creatEvent({
                                triggerType:"分享",
                                keyword:"评论分享按钮",
                                actionId:40
                            });
                            return false;
                        }else{
                            $(this).attr("on","true");
                            $(this).find(".al-shareBox").hide();
                            return false;
                        }
                    });

                    break;
                case 5:
                    t.options.container.attr("on","true").off('click').on("click",function(e){
                        $(".al-shareBox").hide();
                        $('.ev-shareContainer, .ev-share').not(t.options.container).attr('on','true');
                        if($(this).attr("on")=="true"){
                            t.shareClick();
                            $(this).attr("on","false");
                            $(this).find(".al-shareBox").show();
                            //事件埋点
                            comm.creatEvent({
                                triggerType:"分享",
                                keyword:"观看直播分享按钮",
                                actionId:40
                            });
                            return false;
                        }else{
                            $(this).attr("on","true");
                            $(this).find(".al-shareBox").hide();
                            return false;
                        }
                    });
                    break;
                default:
                    t.options.container.attr("on","true").off('click').on("click",function(e){
                        $(".al-shareBox").hide();
                        $('.ev-shareContainer, .ev-share').not(t.options.container).attr('on','true');
                        if($(this).attr("on")=="true"){
                            t.shareClick();
                            $(this).attr("on","false");
                            $(this).find(".al-shareBox").show();
                            //事件埋点
                            comm.creatEvent({
                                triggerType:"分享",
                                keyword:"分享按钮",
                                actionId:40
                            });
                            return false;
                        }else{
                            $(this).attr("on","true");
                            $(this).find(".al-shareBox").hide();
                            return false;
                        }
                    });
                    break;
            };
            if(t.options.shareTrend){//需要分享动态的
                t.shareTrend();
            }
            t.shareWeixing();
            t.shareSina();
            t.shareQQ();
            t.shareQzone();
            $(document).bind("click",function(){
                t.weixingup=0;
                t.parent.attr("on","true");
                $(".al-shareBox",t.parent).hide();
                $("canvas",t.parent).remove();
                $(".ev-erweima",t.parent).hide();
                var ele = $(".ev-erweima",t.parent).find("table");
                if(ele.length>0){
                    ele.remove();
                    $(".qrcodeTable",t.parent).removeAttr("style");
                }else{
                    $("canvas",t.parent).remove();
                }
            })
        },
        //分享按钮点击
        shareClick:function(){
            var t=this;
            if(t.options.container.attr("hasAjax")!="true"){
                var content={};
                t.options.triggerRequest&&t.options.triggerRequest(content);
                t.options.container.attr("hasAjax","true");
                if(t.options.triggerRequest){
                    t.options.title=content.title;
                    t.options.pic=content.pic;
                    t.options.sinaTitle=content.sinaTitle;
                    t.options.qqTitle=content.qqTitle;
                    t.options.qqSummary=content.qqSummary;
                    t.options.qqZoneTitle=content.qqZoneTitle;
                    t.options.qqZoneSummary=content.qqZoneSummary;
                    t.options.h5Url=content.h5Url;
                }
            }
        },
        //分享动态
        shareTrend:function(){
            var t=this;
            t.parent.find(".ev-ttrend").on("click",function(){
                user.login({
                    callback: function () {
                        $.ajax({
                            type : "post",
                            url : t.options.trendUrl,
                            data : {paramJson: $.toJSON(t.options.data)},
                            dataType : "json",
                            success : function(rep){
                                if(rep&&rep.responseObject.responseStatus){
                                    t.options.callback();
                                    $.topTip({mark: "success", content: "分享到唯医朋友圈成功！",showTime: 3});
                                }else{
                                    $.topTip({mark: "warn", content: "分享到唯医朋友圈失败！",showTime: 3});
                                }
                            },
                            error:function(){
                                $.topTip({mark: "warn", content: "分享到唯医朋友圈失败！",showTime: 3});
                            }
                        });
                    },
                    scene:privilegeSceneConst.eSceneTypeAuth
                })

            })
        },
        //微信点击
        shareWeixing:function(){
            var t=this;
            this.weixingup=0;
            if(!t.options.h5Url){
                t.options.h5Url= t.options.url;
            }
            t.parent.find(".ev-tweixin").on("click",function(){
                var erweima=$(".ev-erweima",t.parent);
                if(t.weixingup===0){
                    // 是否支持canvas
                    t.weixingup=1;
                    if(!!document.createElement('canvas').getContext){
                        erweima.show().qrcode({
                            text : t.options.h5Url
                        });
                        $("canvas",t.parent).css({"margin-left":"62px","position":"absolute","width":"150px","height":"150px","left":"0"});
                    }else{
                        erweima.show().find(".qrcodeTable").qrcode({
                            render	: "table",
                            text : t.options.h5Url
                        });
                        $("canvas",t.parent).css({"margin-left":"62px","position":"absolute","width":"150px","height":"150px","left":"0"});
                    }
                }else{
                    t.weixingup=0;
                    erweima.hide();
                    var ele = $(this).find("table");
                    if(ele.length>0){
                        ele.remove();
                        $(".qrcodeTable",t.parent).removeAttr("style");
                    }else{
                        $("canvas",t.parent).remove();
                    }

                }
                if($(".ev-linkBox").length>0){
                    $(".ev-linkBox").hide();
                }
                return false;
            });
        },
        //分享新浪
        shareSina:function(){
            var t=this;
            t.parent.find(".ev-tsina").on("click",function(){
                var sinT= t.options.sinaTitle?(t.options.sinaTitle.split(/[:|：]\s*http/)[0].replace(/""/g,'"').replace(/"([\S\s].*?)"/g,"“$1”")):"";
                var tsina="http://service.weibo.com/share/share.php?title=" + sinT + "&url=" + encodeURIComponent(t.options.url) +(t.options.sinaSummary?"&summary="+encodeURIComponent(comm.getStrLen(t.options.sinaSummary,50)):'')+ (t.options.pic?"&pic="+ encodeURIComponent(t.options.pic):'');
                window.open(tsina);
                t.options.shareSinaSuc&&t.options.shareSinaSuc();
                return false;
            })
        },
        //分享qq好友
        shareQQ:function(){
            var t=this;
            t.parent.find(".ev-tqq").on("click",function(){
                var tqq="http://connect.qq.com/widget/shareqq/index.html?title="+ encodeURIComponent(t.options.qqTitle? t.options.qqTitle:t.options.title) +"&url=" + encodeURIComponent(t.options.url)+(t.options.qqSummary?"&summary="+encodeURIComponent(comm.getStrLen(t.options.qqSummary,50)):'')+(t.options.pic?"&pics="+ encodeURIComponent(t.options.pic?t.options.pic:''):'');
                window.open(tqq);
                t.options.shareQQSuc&&t.options.shareQQSuc();
                return false;
            })
        },
        //分享qq空间
        shareQzone:function(){
            var t=this;
            t.parent.find(".ev-tqzone").on("click",function(){
                var tqzone="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=" + encodeURIComponent(t.options.qqZoneTitle? t.options.qqZoneTitle:t.options.title) + "&url=" + encodeURIComponent(t.options.url)+(t.options.qqZoneSummary?"&summary="+encodeURIComponent(comm.getStrLen(t.options.qqZoneSummary,50)):'')+(t.options.pic?"&pics="+ encodeURIComponent(t.options.pic?t.options.pic:''):'');
                window.open(tqzone);
                t.options.shareQzoneSuc&&t.options.shareQzoneSuc();
                return false;
            })
        }

    };
    container.init(obj);
};
