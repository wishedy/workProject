/*使用：
依赖文件：jquery.js,jqueryMobile.js,comm-data.js,js/comm/jweixin-1.0.0.js,js/comm/WeixinJSApi.js,js/comm/Weixin_share.js
*注意：分享新浪和qzone的弹层中，新浪和qzone的a标签要加个ref属性(sina,qzone);
*
* trigger触发按钮(jquery对象)，obj分享话术;只要加trigger,内部处理分享新浪，qzone的显示和隐藏
* 如果没有特殊要求的标题，下面的sinaTitle,qzoneTitle....等可以不写，全部标题使用title
* mobileShare($(dom),
*                {
*                   title:document.title,                                                      //默认标题
                    url:window.location.href,                                                  //
                    pic:'//m.allinmd.cn//img50.allinmd.cn/allin_logo.png',                                 //
                    summary:"汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。",         //
                    sinaTitle:'',                                                              //新浪标题
                    qzoneTitle:'',                                                             //空间标题
                    qqTitle:'',                                                                //qq好友
                    wxTitle:'',                                                                //微信好友
                    TimeLineTitle:'',                                                          //朋友圈
                    desc:''                                                                    //微信描述
*
*
*                });
*Created by sunhaibin on 2016/4/26.
* */


function mobileShare(trigger,obj){
    var controller ={
        default:{
            qzone:"http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?",
            qzone_m:"http://qzs.qzone.qq.com/open/connect/widget/mobile/qzshare/index.html?",
            sina:"http://service.weibo.com/share/share.php?",
            sina_m:"http://v.t.sina.com.cn/share/share.php?&appkey=&",
            qq:'http://connect.qq.com/widget/shareqq/feedback.html?'
        },
        init:function(obj){
            var t=this;
            var opt={};
            var shareDef={
                title:document.title,
                url:window.location.href,
                pic:'',
                summary:"汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。",
                sinaTitle:'',
                sinaDesc:'',
                qzoneTitle:'',
                qqTitle:'',
                wxTitle:"",//唯医—医生互动社区，医学继续教育
                timeLineTitle:"",
                desc:''
            };
            opt = $.extend(shareDef,obj);
            wechat_share({
                link:opt.url,
                title:opt.wxTitle!=''?opt.wxTitle:opt.title,
                desc:opt.desc!=""?opt.desc:'汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。',
                imgUrl:(opt.pic.search(':')>=0?opt.pic:'http:'+opt.pic),
                timeLineTitle:opt.timeLineTitle!=''?opt.timeLineTitle:opt.title,
                qqTiTle:opt.qqTitle!=""?opt.qqTitle:opt.title,
                fnMessageSuc:opt.fnMessageSuc&&opt.fnMessageSuc,
                fnTimelineSuc:opt.fnTimelineSuc&&opt.fnTimelineSuc
            })
            t.shareAction(opt);
        },
        shareAction:function(obj){
            var t=this;
            $(trigger).on('click',function(){
                //判断是否为微信浏览器
                if (WeixinJSApi.is_weixin()) {
                    var shareHtml = '<div class="dk-result-pointer-bg"></div><div class="dk-result-pointer" ></div>';
                    $("body").append(shareHtml);
                    $("body").bind('touchmove',function(e){
                        e.preventDefault();
                    });
                    if ($(".dk-result-pointer").length) {
                        setTimeout(function () {

                            $(".dk-result-pointer").remove();
                            $(".dk-result-pointer-bg").remove();
                            $("body").unbind('touchmove');
                        }, 10000);
                    }
                    $(".dk-result-pointer,.dk-result-pointer-bg").on("click", function () {

                        $(".dk-result-pointer").remove();
                        $(".dk-result-pointer-bg").remove();
                        $('body').unbind('touchmove');
                        return false;
                    });
                    //微信分享
                    wechat_share({
                        link:obj.url,
                        title:obj.wxTitle!=''?obj.wxTitle:obj.title,
                        desc:obj.desc!=""?obj.desc:'汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。',
                        imgUrl:(obj.pic.search(':')>=0?obj.pic:'http:'+obj.pic),
                        timeLineTitle:obj.timeLineTitle!=''?obj.timeLineTitle:obj.title,
                        qqTiTle:obj.qqTitle!=""?obj.qqTitle:obj.title,
                        fnMessageSuc:obj.fnMessageSuc&&obj.fnMessageSuc,
                        fnTimelineSuc:obj.fnTimelineSuc&&obj.fnTimelineSuc
                    });
                } else {
                    $('.videoPK_share_pop').show();
                    $('.vPK_share_list>a').on('click', function (e) {
                        var shareToName = $(this).attr('ref');
                        var newHref = t.default[shareToName+'_m'];
                        var picture = '&pics=http:', shareTitle;
                        if (shareToName == 'sina') {
                            picture = "&pic=http:";
                            shareTitle = obj.sinaTitle != '' ? obj.sinaTitle : obj.title;
                        } else if (shareToName = 'qzone') {
                            shareTitle = obj.qzoneTitle != '' ? obj.qzoneTitle : obj.title;
                        }
                        if(obj.pic.search(':')>=0){
                            obj.pic = obj.pic.split(':')[1];
                        }
                        obj.qShareLog&&obj.qShareLog(shareToName);
                        window.open(newHref + 'url=' + encodeURIComponent(obj.url) + '&title=' + encodeURIComponent(shareTitle) + picture + encodeURIComponent(obj.pic) + '&summary=' + encodeURIComponent(obj.summary)+(shareToName=='sina'?'&desc='+encodeURIComponent(obj.desc):""), '_blank');
                        return false;
                    });
                    $('.share_quxiao').on('click',function(){
                        $('.videoPK_share_pop').hide();
                        return false;
                    })
                }
                return false;
            })

        }
    };
    controller.init(obj);
};